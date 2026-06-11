import { useState, useEffect } from 'react';
import { Share2, Cloud, CheckCircle2, Bell, BellOff } from 'lucide-react';
import { User } from 'firebase/auth';
import { googleSignIn, initAuth, logout } from '../lib/auth';

export function Integrations() {
  const [needsAuth, setNeedsAuth] = useState(true);
  const [user, setUser] = useState<User | null>(null);
  const [isLoggingIn, setIsLoggingIn] = useState(false);
  const [message, setMessage] = useState('');

  // Notifications state
  const [notifEnabled, setNotifEnabled] = useState(false);
  const [notifTime, setNotifTime] = useState('18:00');
  const [permissionState, setPermissionState] = useState<NotificationPermission>('default');

  useEffect(() => {
    // Load notification settings
    const savedEnabled = localStorage.getItem('v2_notif_enabled') === 'true';
    const savedTime = localStorage.getItem('v2_notif_time') || '18:00';
    setNotifEnabled(savedEnabled);
    setNotifTime(savedTime);
    
    if ('Notification' in window) {
      setPermissionState(Notification.permission);
    }
  }, []);

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

  const handleToggleNotif = async () => {
    if (!notifEnabled) {
      if (!('Notification' in window)) {
        alert('Twoja przeglądarka nie obsługuje powiadomień.');
        return;
      }
      if (Notification.permission !== 'granted') {
        const perm = await Notification.requestPermission();
        setPermissionState(perm);
        if (perm !== 'granted') {
           alert('Brak uprawnień do wyświetlania powiadomień.');
           return;
        }
      }
      setNotifEnabled(true);
      localStorage.setItem('v2_notif_enabled', 'true');
    } else {
      setNotifEnabled(false);
      localStorage.setItem('v2_notif_enabled', 'false');
    }
  };

  const handleTimeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setNotifTime(val);
    localStorage.setItem('v2_notif_time', val);
  };

  return (
    <div className="space-y-6 pb-8 animate-in fade-in duration-300">
      <div className="flex flex-col mb-4">
        <h2 className="text-xl font-bold tracking-tight text-slate-200">Cloud & Opcje</h2>
        <p className="text-sm text-slate-500 font-mono mt-1">Ustawienia, kopie zapasowe i przypomnienia</p>
      </div>

      <div className="cyber-panel p-5 space-y-6">
        {/* Sekcja Powiadomień */}
        <div>
           <h3 className="text-xs font-bold font-mono tracking-widest text-slate-400 uppercase mb-3 border-b border-slate-800 pb-2">Przypomnienia (CRON)</h3>
           <div className="p-4 bg-slate-900/50 border border-slate-800 rounded-lg">
              <div className="flex items-center justify-between gap-3 mb-4">
                 <div className="flex gap-3">
                   {notifEnabled ? <Bell className="w-5 h-5 text-cyan-400 mt-0.5 shrink-0" /> : <BellOff className="w-5 h-5 text-slate-600 mt-0.5 shrink-0" />}
                   <div>
                     <p className="text-sm font-bold text-slate-200 mb-1">Powiadomienie o zadaniach</p>
                     <p className="text-xs text-slate-500 leading-relaxed max-w-[200px]">
                       Przypomni Ci o odznaczeniu boxów w CRON o wybranej godzinie.
                     </p>
                   </div>
                 </div>
                 
                 <button
                    onClick={handleToggleNotif}
                    className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none ${notifEnabled ? 'bg-cyan-500' : 'bg-slate-700'}`}
                 >
                    <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${notifEnabled ? 'translate-x-6' : 'translate-x-1'}`} />
                 </button>
              </div>
              
              {notifEnabled && (
                <div className="mt-4 pt-4 border-t border-slate-800/50 flex flex-col gap-2">
                   <div className="flex justify-between items-center">
                     <span className="text-xs text-slate-400 font-mono">Godzina przypomnienia:</span>
                     <input 
                       type="time" 
                       value={notifTime}
                       onChange={handleTimeChange}
                       className="bg-slate-950 border border-slate-800 rounded px-2 py-1 text-sm text-cyan-400 focus:outline-none focus:border-cyan-500 font-mono"
                     />
                   </div>
                   <p className="text-[10px] text-cyan-700 font-mono mt-1 text-right">
                     * Działa, gdy aplikacja jest otwarta w urządzeniu / przeglądarce.
                   </p>
                   {permissionState === 'denied' && (
                     <p className="text-xs text-red-400 mt-2">Brak uprawnień. Zmień ustawienia w przeglądarce.</p>
                   )}
                </div>
              )}
           </div>
        </div>

        <div>
        <h3 className="text-xs font-bold font-mono tracking-widest text-slate-400 uppercase mb-3 border-b border-slate-800 pb-2">Synchronizacja z chmurą</h3>
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

            <div className="p-4 bg-emerald-900/20 border border-emerald-800/50 rounded-lg">
               <div className="flex gap-3">
                 <Cloud className="w-5 h-5 text-emerald-500 mt-0.5 shrink-0" />
                 <div>
                   <p className="text-sm text-emerald-100 font-bold mb-1">Backup automatyczny</p>
                   <p className="text-xs text-emerald-400/80 leading-relaxed">
                     Twoje postępy są automatycznie zabezpieczane na Twoim własnym koncie w chmurze bez limitów.
                   </p>
                 </div>
               </div>
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
    </div>
  );
}
