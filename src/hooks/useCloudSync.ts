import { useState, useEffect, useRef } from 'react';
import { onAuthStateChanged, User } from 'firebase/auth';
import { collection, query, onSnapshot, setDoc, doc, serverTimestamp } from 'firebase/firestore';
import { auth, db } from '../lib/auth';

// Zapamiętane ostatnio zsynchronizowane konto — pozwala wykryć zmianę użytkownika
// i nie pokazać / nie przejąć danych poprzedniego konta na tym samym urządzeniu.
const LAST_UID_KEY = 'v2_last_synced_uid';

const readLastUid = (): string | null => {
  try {
    return localStorage.getItem(LAST_UID_KEY);
  } catch {
    return null;
  }
};

const writeLastUid = (uid: string | null) => {
  try {
    if (uid) localStorage.setItem(LAST_UID_KEY, uid);
    else localStorage.removeItem(LAST_UID_KEY);
  } catch {
    // tryb prywatny bez dostępu do localStorage — pomijamy
  }
};

export type DailyCronState = {
  initScript: boolean;
  threadSleep: boolean;
  neatProcess: boolean;
  neatSteps: string;
  shutdownSequence: boolean;
  vitaminD3K2: boolean;
  energia: number;
  sen: number;
  hydration: number;
};

export const DEFAULT_STATE: DailyCronState = {
  initScript: false,
  threadSleep: false,
  neatProcess: false,
  neatSteps: '8000',
  shutdownSequence: false,
  vitaminD3K2: false,
  energia: 5,
  sen: 5,
  hydration: 0,
};

export function useCloudSync(localHistory: Record<string, DailyCronState>, setLocalHistory: (val: any) => void) {
  const [user, setUser] = useState<User | null>(null);
  const [isSyncing, setIsSyncing] = useState(true);
  const wasAuthedRef = useRef(false);

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (u) => {
      setUser(u);
      if (u) {
        wasAuthedRef.current = true;
      } else {
        // Rozróżniamy prawdziwe wylogowanie od zimnego startu bez sesji:
        // czyścimy dane konta tylko jeśli w tej sesji ktoś BYŁ zalogowany.
        // Dzięki temu użytkownik korzystający wyłącznie lokalnie (sam kod, bez
        // logowania Google) nigdy nie traci swoich danych przy starcie aplikacji.
        if (wasAuthedRef.current) {
          wasAuthedRef.current = false;
          writeLastUid(null);
          setLocalHistory({});
        }
        setIsSyncing(false);
      }
    });
    return () => unsub();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (!user) return;

    setIsSyncing(true);

    // Wykryj zmianę konta na tym urządzeniu.
    const previousUid = readLastUid();
    const isFirstEverLogin = previousUid === null;
    const isAccountSwitch = previousUid !== null && previousUid !== user.uid;

    // Przy zmianie konta natychmiast czyścimy widok, żeby nowy użytkownik ani
    // przez chwilę nie zobaczył danych poprzedniego konta.
    if (isAccountSwitch) {
      setLocalHistory({});
    }
    writeLastUid(user.uid);

    const q = query(collection(db, 'users', user.uid, 'cron_history'));
    const unsub = onSnapshot(q, (snapshot) => {
      const cloudData: Record<string, DailyCronState> = {};
      snapshot.forEach(d => {
        const data = d.data() as DailyCronState;
        cloudData[d.id] = {
          initScript: data.initScript || false,
          threadSleep: data.threadSleep || false,
          neatProcess: data.neatProcess || false,
          neatSteps: data.neatSteps || '8000',
          shutdownSequence: data.shutdownSequence || false,
          vitaminD3K2: data.vitaminD3K2 || false,
          energia: data.energia || 5,
          sen: data.sen || 5,
          hydration: data.hydration || 0,
        };
      });

      // Migrujemy dane lokalne do chmury TYLKO przy pierwszym logowaniu na tym
      // urządzeniu (użytkownik korzystał z appki lokalnie i teraz włącza backup).
      // Przy zmianie konta świadomie nie migrujemy — te dane należą do poprzedniego
      // konta i nie mogą trafić do chmury nowego użytkownika.
      const toUpload: { date: string; data: DailyCronState }[] = [];

      if (isFirstEverLogin) {
        for (const date of Object.keys(localHistory)) {
          if (!cloudData[date]) {
            cloudData[date] = localHistory[date];
            toUpload.push({ date, data: localHistory[date] });
          }
        }
      }

      setLocalHistory((prev: any) => {
         // Po zmianie konta bazujemy wyłącznie na danych z chmury nowego konta.
         const base = isAccountSwitch ? {} : prev;
         return { ...base, ...cloudData };
      });

      if (toUpload.length > 0) {
        Promise.all(toUpload.map(item => 
          updateCloudDay(user.uid, item.date, item.data)
        )).catch(console.error);
      }

      setIsSyncing(false);
    }, (error) => {
      console.error('Firestore Error:', error);
      setIsSyncing(false);
    });

    return () => unsub();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user]);

  const updateCloudDay = async (uid: string, date: string, data: DailyCronState) => {
    try {
      await setDoc(doc(db, 'users', uid, 'cron_history', date), {
        ...data,
        userId: uid,
        updatedAt: serverTimestamp()
      }, { merge: true });
    } catch (e) {
      console.error("Cloud write failed", e);
    }
  };

  const syncUpdate = (date: string, state: DailyCronState) => {
    if (user) {
      updateCloudDay(user.uid, date, state);
    }
  };

  return { user, isSyncing, syncUpdate };
}
