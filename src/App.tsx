import { useState, useEffect } from 'react';
import { Terminal, CheckSquare, List, Droplet, AlertOctagon, BarChart3 } from 'lucide-react';
import { AnimatePresence } from 'motion/react';
import { DailyCron } from './components/DailyCron';
import { Dependencies } from './components/Dependencies';
import { RuntimeElixirs } from './components/RuntimeElixirs';
import { IncidentResponse } from './components/IncidentResponse';
import { Analytics } from './components/Analytics';

type Tab = 'cron' | 'deps' | 'elixirs' | 'incident' | 'stats';

export default function App() {
  const [activeTab, setActiveTab] = useState<Tab>('cron');
  const [isMounted, setIsMounted] = useState(false);

  // Prevent hydration mismatch for extensions/server
  useEffect(() => {
    setIsMounted(true);
  }, []);

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

        </div>
      </nav>
    </div>
  );
}
