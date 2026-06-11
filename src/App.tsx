import { useState, useEffect } from 'react';
import { Terminal, CheckSquare, List, Droplet, AlertOctagon, BarChart3, Settings } from 'lucide-react';
import { AnimatePresence, motion } from 'motion/react';
import { DailyCron } from './components/DailyCron';
import { Dependencies } from './components/Dependencies';
import { RuntimeElixirs } from './components/RuntimeElixirs';
import { IncidentResponse } from './components/IncidentResponse';
import { Analytics } from './components/Analytics';
import { Integrations } from './components/Integrations';

type Tab = 'cron' | 'deps' | 'elixirs' | 'incident' | 'stats' | 'integrations';

export default function App() {
  const [activeTab, setActiveTab] = useState<Tab>('cron');
  const [isMounted, setIsMounted] = useState(false);
  const [monitPendingCount, setMonitPendingCount] = useState<number>(0);

  // Prevent hydration mismatch for extensions/server
  useEffect(() => {
    setIsMounted(true);
    
    // Notification & Monit Checker
    const checkNotifications = () => {
      const isEnabled = localStorage.getItem('v2_notif_enabled') === 'true';
      if (!isEnabled) return;

      const notifTime = localStorage.getItem('v2_notif_time'); // "18:00"
      if (!notifTime) return;

      const now = new Date();
      const currentHour = now.getHours().toString().padStart(2, '0');
      const currentMinute = now.getMinutes().toString().padStart(2, '0');
      const currentTimeStr = `${currentHour}:${currentMinute}`;
      
      const todayDateStr = now.toISOString().split('T')[0]; // "YYYY-MM-DD"

      // Monit check (only if past the time and we haven't snoozed it today)
      if (currentTimeStr >= notifTime) {
        const snoozedDate = localStorage.getItem('v2_monit_snoozed_date');
        if (snoozedDate !== todayDateStr) {
          const historyRaw = localStorage.getItem('v2_dailyCronHistory_v2');
          let pendingTasks = 5; // Default if nothing is set
          if (historyRaw) {
            try {
               const history = JSON.parse(historyRaw);
               const todayState = history[todayDateStr];
               if (todayState) {
                 let checked = 0;
                 if (todayState.initScript) checked++;
                 if (todayState.threadSleep) checked++;
                 if (todayState.neatProcess) checked++;
                 if (todayState.shutdownSequence) checked++;
                 if (todayState.vitaminD3K2) checked++;
                 pendingTasks = 5 - checked;
               }
            } catch(e) {}
          }
          if (pendingTasks > 0) {
            setMonitPendingCount(pendingTasks);
          }
        }
      }

      // Classic push notification
      if ('Notification' in window && Notification.permission === 'granted') {
        const lastNotifiedDate = localStorage.getItem('v2_last_notified_date');
        if (currentTimeStr === notifTime && lastNotifiedDate !== todayDateStr) {
          new Notification('IT Health: CRON Przypomnienie', {
            body: 'Skontroluj swój dzisiejszy CRON i odznacz zakończone zadania przed pójściem spać.',
            icon: '/WszystkokolwiekWFormie__Ciemne_Social.png'
          });
          localStorage.setItem('v2_last_notified_date', todayDateStr);
        }
      }
    };

    // Check every minute
    const interval = setInterval(checkNotifications, 60000);
    // Initial check just in case we opened app exactly at the right minute
    checkNotifications();

    return () => clearInterval(interval);
  }, []);

  const dismissMonit = () => {
    const todayDateStr = new Date().toISOString().split('T')[0];
    localStorage.setItem('v2_monit_snoozed_date', todayDateStr);
    setMonitPendingCount(0);
    setActiveTab('cron');
  };

  if (!isMounted) return null;

  return (
    <div className="min-h-[100dvh] bg-slate-950 text-slate-50 font-sans flex flex-col md:max-w-md md:mx-auto md:border-x border-cyan-900/30 md:shadow-2xl overflow-hidden relative">
      
      {/* Header */}
      <header className="px-5 py-4 border-b border-cyan-900/50 bg-slate-950/80 backdrop-blur-xl sticky top-0 z-50 flex items-center gap-3 pt-safe">
        <div className="p-1.5 bg-slate-900 border border-slate-800 rounded-md">
          <Terminal className="text-cyan-400 w-5 h-5 flex-shrink-0" />
        </div>
        <div className="flex-1">
          <h1 className="text-sm font-bold tracking-widest text-slate-200 uppercase font-mono truncate">
            IT Health <span className="text-cyan-500">v2.0</span>
          </h1>
          <div className="text-[10px] text-cyan-600 font-mono flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-pulse"></span>
            SYSTEM ONLINE
          </div>
        </div>
        <div className="flex-shrink-0">
          <img src="/Ciemne-Social.jpg" alt="Social Profile Logo" className="w-10 h-10 object-contain drop-shadow-[0_0_8px_rgba(34,211,238,0.5)] rounded-full" />
        </div>
      </header>

      {/* Main content area */}
      <main className="flex-1 overflow-y-auto p-4 md:p-6 pb-[calc(env(safe-area-inset-bottom,1rem)+5rem)] scroll-smooth">
        <AnimatePresence mode="wait">
          {activeTab === 'cron' && <DailyCron key="cron" />}
          {activeTab === 'deps' && <Dependencies key="deps" />}
          {activeTab === 'elixirs' && <RuntimeElixirs key="elixirs" />}
          {activeTab === 'incident' && <IncidentResponse key="incident" />}
          {activeTab === 'stats' && <Analytics key="stats" />}
          {activeTab === 'integrations' && <Integrations key="integrations" />}
        </AnimatePresence>
      </main>

      {/* Bottom Navigation */}
      <nav className="fixed bottom-0 left-0 w-full md:max-w-md md:left-1/2 md:-translate-x-1/2 bg-slate-950/90 backdrop-blur-lg border-t border-cyan-900/50 pb-safe z-50">
        <div className="flex justify-around items-center h-16 px-1">
          
          <button 
            onClick={() => setActiveTab('cron')}
            className={`flex flex-col items-center justify-center w-full h-full space-y-1 transition-colors ${activeTab === 'cron' ? 'text-cyan-400' : 'text-slate-500 hover:text-slate-400'}`}
          >
            <CheckSquare className={`w-5 h-5 ${activeTab === 'cron' ? 'fill-cyan-900/50' : ''}`} />
            <span className="text-[9px] uppercase tracking-wider font-bold">Cron</span>
          </button>

          <button 
            onClick={() => setActiveTab('deps')}
            className={`flex flex-col items-center justify-center w-full h-full space-y-1 transition-colors ${activeTab === 'deps' ? 'text-cyan-400' : 'text-slate-500 hover:text-slate-400'}`}
          >
            <List className={`w-5 h-5 ${activeTab === 'deps' ? 'fill-cyan-900/50' : ''}`} />
            <span className="text-[9px] uppercase tracking-wider font-bold">Deps</span>
          </button>

          <button 
            onClick={() => setActiveTab('elixirs')}
            className={`flex flex-col items-center justify-center w-full h-full space-y-1 transition-colors ${activeTab === 'elixirs' ? 'text-cyan-400' : 'text-slate-500 hover:text-slate-400'}`}
          >
            <Droplet className={`w-5 h-5 ${activeTab === 'elixirs' ? 'fill-cyan-900/50' : ''}`} />
            <span className="text-[9px] uppercase tracking-wider font-bold">Elixirs</span>
          </button>

          <button 
            onClick={() => setActiveTab('incident')}
            className={`flex flex-col items-center justify-center w-full h-full space-y-1 transition-colors ${activeTab === 'incident' ? 'text-cyan-400' : 'text-slate-500 hover:text-slate-400'}`}
          >
            <AlertOctagon className={`w-5 h-5 ${activeTab === 'incident' ? 'fill-cyan-900/50' : ''}`} />
            <span className="text-[9px] uppercase tracking-wider font-bold">Incident</span>
          </button>

          <button 
            onClick={() => setActiveTab('stats')}
            className={`flex flex-col items-center justify-center w-full h-full space-y-1 transition-colors ${activeTab === 'stats' ? 'text-cyan-400' : 'text-slate-500 hover:text-slate-400'}`}
          >
            <BarChart3 className={`w-5 h-5 ${activeTab === 'stats' ? 'fill-cyan-900/50' : ''}`} />
            <span className="text-[9px] uppercase tracking-wider font-bold">Stats</span>
          </button>

          <button 
            onClick={() => setActiveTab('integrations')}
            className={`flex flex-col items-center justify-center w-full h-full space-y-1 transition-colors ${activeTab === 'integrations' ? 'text-cyan-400' : 'text-slate-500 hover:text-slate-400'}`}
          >
            <Settings className={`w-5 h-5 ${activeTab === 'integrations' ? 'fill-cyan-900/50' : ''}`} />
            <span className="text-[9px] uppercase tracking-wider font-bold">Cloud & Alerts</span>
          </button>

        </div>
      </nav>

      {/* Monit Modal */}
      <AnimatePresence>
        {monitPendingCount > 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] flex justify-center items-center p-4 bg-slate-950/80 backdrop-blur-sm"
          >
            <motion.div
              initial={{ scale: 0.95 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.95 }}
              className="cyber-panel p-6 max-w-sm w-full space-y-4"
            >
              <div className="flex justify-center mb-2 animate-bounce">
                <AlertOctagon className="w-12 h-12 text-cyan-400" />
              </div>
              <h2 className="text-xl font-bold tracking-tight text-slate-100 text-center uppercase font-mono">Dzień się kończy!</h2>
              <p className="text-sm text-slate-300 text-center mb-6">
                Masz <span className="font-bold text-cyan-400">{monitPendingCount}</span> {monitPendingCount === 1 ? 'niezaznaczone zadanie' : (monitPendingCount > 4 ? 'niezaznaczonych zadań' : 'niezaznaczone zadania')}. Zróbmy to teraz!
              </p>
              <button
                onClick={dismissMonit}
                className="w-full py-3 bg-cyan-900/50 hover:bg-cyan-800/50 border border-cyan-800 text-white rounded-lg font-bold font-mono tracking-widest uppercase transition-colors"
              >
                Przejdź do zadań
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
