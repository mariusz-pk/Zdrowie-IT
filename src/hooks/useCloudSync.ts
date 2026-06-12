import { useState, useEffect } from 'react';
import { onAuthStateChanged, User } from 'firebase/auth';
import { collection, query, onSnapshot, setDoc, doc, serverTimestamp } from 'firebase/firestore';
import { auth, db } from '../lib/auth';

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
  neatSteps: '',
  shutdownSequence: false,
  vitaminD3K2: false,
  energia: 5,
  sen: 5,
  hydration: 0,
};

export function useCloudSync(localHistory: Record<string, DailyCronState>, setLocalHistory: (val: any) => void) {
  const [user, setUser] = useState<User | null>(null);
  const [isSyncing, setIsSyncing] = useState(true);

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (u) => {
      setUser(u);
      if (!u) {
        setIsSyncing(false);
      }
    });
    return () => unsub();
  }, []);

  useEffect(() => {
    if (!user) return;

    setIsSyncing(true);
    const q = query(collection(db, 'users', user.uid, 'cron_history'));
    const unsub = onSnapshot(q, (snapshot) => {
      const cloudData: Record<string, DailyCronState> = {};
      snapshot.forEach(d => {
        const data = d.data() as DailyCronState;
        cloudData[d.id] = {
          initScript: data.initScript || false,
          threadSleep: data.threadSleep || false,
          neatProcess: data.neatProcess || false,
          neatSteps: data.neatSteps || '',
          shutdownSequence: data.shutdownSequence || false,
          vitaminD3K2: data.vitaminD3K2 || false,
          energia: data.energia || 5,
          sen: data.sen || 5,
          hydration: data.hydration || 0,
        };
      });

      // Merge cloud data over local history. Overwrite local if conflict, assuming cloud is master.
      // One time initially, if local has data that cloud doesn't, we can upload it.
      let migrated = false;
      const toUpload = [];
      
      for (const date of Object.keys(localHistory)) {
        if (!cloudData[date]) {
          migrated = true;
          cloudData[date] = localHistory[date];
          toUpload.push({ date, data: localHistory[date] });
        }
      }

      setLocalHistory((prev: any) => {
         // Simple deep equality check could be done, but for now we just overwrite.
         return { ...prev, ...cloudData };
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
