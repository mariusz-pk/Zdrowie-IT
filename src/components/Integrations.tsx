import { useState, useEffect } from 'react';
import { Share2, Cloud, CheckCircle2, DownloadCloud } from 'lucide-react';
import { User } from 'firebase/auth';
import { googleSignIn, initAuth, logout, getAccessToken } from '../lib/auth';

export function Integrations() {
  const [needsAuth, setNeedsAuth] = useState(true);
  const [user, setUser] = useState<User | null>(null);
  const [isLoggingIn, setIsLoggingIn] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState('');

  useEffect(() => {
    const unsub = initAuth(
      (u, token) => {
        setUser(u);
        setNeedsAuth(false);
      },
      () => {
        setUser(null);
        setNeedsAuth(true);
      }
    );
    return () => { if (unsub) unsub(); };
  }, []);

  const handleLogin = async () => {
    setIsLoggingIn(true);
    try {
      const result = await googleSignIn();
      if (result) {
        setUser(result.user);
        setNeedsAuth(false);
      }
    } catch (err) {
      console.error('Login failed:', err);
    } finally {
      setIsLoggingIn(false);
    }
  };

  const backupToDrive = async () => {
    setIsLoading(true);
    setMessage('');
    try {
      const token = await getAccessToken();
      if (!token) throw new Error('No token');

      // Create a combined JSON backup object
      const historyData = localStorage.getItem('v2_dailyCronHistory_v2') || '{}';
      const depsData = localStorage.getItem('v2_acquiredDeps') || '[]';
      
      const exportData = {
        history: JSON.parse(historyData),
        deps: JSON.parse(depsData)
      };
      
      const metadata = {
        name: `IT_Health_Backup_${new Date().toISOString().split('T')[0]}.json`,
        mimeType: 'application/json'
      };

      const file = new Blob([JSON.stringify(exportData)], { type: 'application/json' });
      const form = new FormData();
      form.append('metadata', new Blob([JSON.stringify(metadata)], { type: 'application/json' }));
      form.append('file', file);

      const res = await fetch('https://www.googleapis.com/upload/drive/v3/files?uploadType=multipart', {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`
        },
        body: form
      });

      if (!res.ok) throw new Error('Failed to upload');
      setMessage('Pomyślnie zapisano backup w Google Drive.');

    } catch (e) {
      console.error(e);
      setMessage('Błąd zapisu w Google Drive.');
    } finally {
      setIsLoading(false);
    }
  };

  const importFromDrive = async () => {
    setIsLoading(true);
    setMessage('');
    try {
      const token = await getAccessToken();
      if (!token) throw new Error('No token');

      // Wyszukaj najnowszy backup w Google Drive
      const query = "name contains 'IT_Health_Backup_' and mimeType = 'application/json' and trashed = false";
      const res = await fetch(`https://www.googleapis.com/drive/v3/files?q=${encodeURIComponent(query)}&orderBy=createdTime desc&pageSize=1`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });

      if (!res.ok) throw new Error('Nie udało się wyszukać plików');
      const data = await res.json();
      
      if (!data.files || data.files.length === 0) {
        setMessage('Nie znaleziono plików kopii zapasowej (IT_Health_Backup_*.json) w Google Drive.');
        return;
      }

      const fileId = data.files[0].id;
      
      const fileRes = await fetch(`https://www.googleapis.com/drive/v3/files/${fileId}?alt=media`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });

      if (!fileRes.ok) throw new Error('Nie udało się pobrać pliku');
      const fileData = await fileRes.json();
      
      // Handle both new combined format and old history-only format
      if (fileData.history) {
        localStorage.setItem('v2_dailyCronHistory_v2', JSON.stringify(fileData.history));
      } else {
        localStorage.setItem('v2_dailyCronHistory_v2', JSON.stringify(fileData));
      }
      
      if (fileData.deps) {
        localStorage.setItem('v2_acquiredDeps', JSON.stringify(fileData.deps));
      }
      
      setMessage('Pomyślnie zaimportowano dane. Aplikacja zostanie odświeżona...');

      setTimeout(() => {
        window.location.reload();
      }, 2000);

    } catch (e) {
      console.error(e);
      setMessage('Błąd pobierania kopii z Google Drive.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-6 pb-8 animate-in fade-in duration-300">
      <div className="flex flex-col mb-4">
        <h2 className="text-xl font-bold tracking-tight text-slate-200">Cloud</h2>
        <p className="text-sm text-slate-500 font-mono mt-1">Synchronizacja i kopie zapasowe</p>
      </div>

      <div className="cyber-panel p-5 space-y-5">
        {!needsAuth && user ? (
          <div>
            <div className="flex items-center gap-3 mb-6 p-4 bg-slate-900/50 rounded-lg border border-slate-800">
              {user.photoURL ? (
                <img src={user.photoURL} alt="Avatar" className="w-10 h-10 rounded-full" />
              ) : (
                <div className="w-10 h-10 rounded-full bg-cyan-900/50 flex items-center justify-center">
                  <span className="text-cyan-500 font-bold">{user.email?.[0]?.toUpperCase()}</span>
                </div>
              )}
              <div className="flex-1">
                <p className="text-sm font-bold text-slate-200">{user.displayName || user.email}</p>
                <p className="text-xs text-slate-500 font-mono">Zalogowano pomyślnie</p>
              </div>
              <button 
                onClick={logout}
                className="text-xs text-slate-400 hover:text-red-400 p-2 transition-colors font-mono uppercase"
              >
                Wyloguj
              </button>
            </div>

            <div className="space-y-4">
              <button
                onClick={backupToDrive}
                disabled={isLoading}
                className="w-full flex items-center justify-between p-4 bg-slate-900 hover:bg-slate-800 border border-slate-700 hover:border-cyan-500/50 rounded-lg transition-all disabled:opacity-50"
              >
                <div className="flex items-center gap-3">
                  <Cloud className="w-5 h-5 text-cyan-400" />
                  <div className="text-left">
                    <p className="text-sm font-bold text-slate-200">Kopia w Google Drive</p>
                    <p className="text-xs text-slate-500">Zapisz historię na swoim Dysku</p>
                  </div>
                </div>
              </button>

              <button
                onClick={importFromDrive}
                disabled={isLoading}
                className="w-full flex items-center justify-between p-4 bg-slate-900 hover:bg-slate-800 border border-slate-700 hover:border-emerald-500/50 rounded-lg transition-all disabled:opacity-50"
              >
                <div className="flex items-center gap-3">
                  <DownloadCloud className="w-5 h-5 text-emerald-400" />
                  <div className="text-left">
                    <p className="text-sm font-bold text-slate-200">Import z Google Drive</p>
                    <p className="text-xs text-slate-500">Przywróć dane z ostatniej kopii</p>
                  </div>
                </div>
              </button>
            </div>

            {message && (
              <div className="mt-4 p-3 bg-cyan-900/20 border border-cyan-800 rounded text-xs text-cyan-300 font-mono flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 shrink-0" />
                {message}
              </div>
            )}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-8 space-y-6">
            <Share2 className="w-12 h-12 text-slate-600 mb-2" />
            <p className="text-sm text-slate-400 text-center px-4">
              Twoja przeglądarka blokuje dostęp do funkcji Google, dopóki nie zostaniesz zalogowany za pomocą konta Google.
            </p>
            <button 
              onClick={handleLogin}
              disabled={isLoggingIn}
              className="gsi-material-button bg-white text-slate-900 rounded shadow py-2 px-4 flex items-center gap-3 hover:bg-slate-100 transition-colors"
            >
              <div className="gsi-material-button-icon">
                <svg version="1.1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48" className="w-5 h-5">
                  <path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z"></path>
                  <path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z"></path>
                  <path fill="#FBBC05" d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z"></path>
                  <path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z"></path>
                  <path fill="none" d="M0 0h48v48H0z"></path>
                </svg>
              </div>
              <span className="font-medium text-sm">Sign in with Google</span>
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
