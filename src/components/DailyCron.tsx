import { useEffect, useState, useMemo } from 'react';
import { useLocalStorage } from '../hooks/useLocalStorage';
import { useCloudSync, DailyCronState, DEFAULT_STATE } from '../hooks/useCloudSync';
import { Droplets, Pill, Coffee, Activity, Battery, Zap, Moon, Cloud, CloudOff, Save, Check } from 'lucide-react';
import { HydrationLogger } from './RuntimeElixirs';

const getLocalDateString = () => {
  const d = new Date();
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
};

export function DailyCron() {
  const [history, setHistory] = useLocalStorage<Record<string, DailyCronState>>('v2_dailyCronHistory_v2', {});
  const { user, isSyncing, syncUpdate } = useCloudSync(history, setHistory);

  const today = getLocalDateString();
  const [selectedDate, setSelectedDate] = useState<string>(today);

  const state = history[selectedDate] || DEFAULT_STATE;
  const isReadOnly = selectedDate !== today;

  const [score, setScore] = useState(0);
  const [showSavedMsg, setShowSavedMsg] = useState(false);

  const handleSaveSteps = () => {
    setShowSavedMsg(true);
    setTimeout(() => setShowSavedMsg(false), 2000);
  };

  const availableDates = useMemo(() => {
    let minDate = today;
    const historyDates = Object.keys(history);
    
    historyDates.forEach(date => {
      if (date < minDate) {
        minDate = date;
      }
    });

    const dates = [];
    const [startYear, startMonth, startDay] = minDate.split('-').map(Number);
    const [endYear, endMonth, endDay] = today.split('-').map(Number);
    
    const current = new Date(startYear, startMonth - 1, startDay, 12, 0, 0);
    const end = new Date(endYear, endMonth - 1, endDay, 12, 0, 0);
    
    while (current <= end) {
      const year = current.getFullYear();
      const month = String(current.getMonth() + 1).padStart(2, '0');
      const day = String(current.getDate()).padStart(2, '0');
      dates.push(`${year}-${month}-${day}`);
      
      current.setDate(current.getDate() + 1);
    }

    return dates.sort((a, b) => b.localeCompare(a));
  }, [history, today]);

  useEffect(() => {
    // Score Calculation
    let checks = 0;
    if (state.initScript) checks++;
    if (state.threadSleep) checks++;
    if (state.neatProcess) checks++;
    if (state.shutdownSequence) checks++;
    if (state.vitaminD3K2) checks++;
    
    // (5 checks * 10 points = max 50 points) + 15 (energia) + 15 (sen) + 20 (hydration) = 100
    const energiaPoints = (state.energia / 10) * 15;
    const senPoints = (state.sen / 10) * 15;
    
    // Fallback to 2500 if not found, removing quotes
    let currentGoal = 2500;
    try {
      const storedGoal = localStorage.getItem('v2_hydration_goal');
      if (storedGoal) currentGoal = parseInt(storedGoal.replace(/"/g, ''), 10) || 2500;
    } catch(e) {}
    
    const hydrationPoints = Math.min((state.hydration || 0) / currentGoal, 1) * 20;
    
    const calculatedScore = Math.round((checks * 10) + energiaPoints + senPoints + hydrationPoints);
    setScore(Math.min(100, Math.max(0, calculatedScore)));
  }, [state]);

  const updateState = (updates: Partial<DailyCronState>) => {
    if (isReadOnly) return;
    
    const newState = {
      ...(history[today] || DEFAULT_STATE),
      ...updates
    };
    
    setHistory(prev => ({
      ...prev,
      [today]: newState
    }));

    syncUpdate(today, newState);
  };

  const handleStepChange = (val: string) => {
    if (isReadOnly) return;
    const num = parseInt(val, 10);
    updateState({
      neatSteps: val,
      neatProcess: !isNaN(num) && num >= 8000 ? true : state.neatProcess
    });
  };

  const handleCheck = (key: keyof DailyCronState) => {
    if (isReadOnly) return;
    updateState({ [key]: !state[key] });
  };

  const handleSlider = (key: 'energia' | 'sen', val: number) => {
    if (isReadOnly) return;
    updateState({ [key]: val });
  };

  const radius = 60;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (score / 100) * circumference;

  return (
    <div className="space-y-8 pb-8 animate-in fade-in zoom-in-95 duration-300">
      
      {/* Date Selector */}
      <div className="flex justify-between items-center cyber-panel p-3">
        <label className="text-xs text-slate-400 uppercase tracking-widest font-mono flex items-center gap-2">
          Wybierz dzień sprintu:
          {user ? (
            isSyncing ? (
              <Cloud className="w-3 h-3 text-cyan-400 animate-pulse" title="Synchronizowanie..." />
            ) : (
              <Cloud className="w-3 h-3 text-cyan-500" title="Zsynchronizowano z chmurą" />
            )
          ) : (
            <CloudOff className="w-3 h-3 text-slate-500" title="Tryb lokalny (Offline)" />
          )}
        </label>
        <select 
          value={selectedDate}
          onChange={(e) => setSelectedDate(e.target.value)}
          className="cyber-input text-xs px-2 py-1 bg-slate-950 max-w-[140px]"
        >
          {availableDates.map(d => (
            <option key={d} value={d}>
              {d === today ? `Dzisiaj (${d})` : d}
            </option>
          ))}
        </select>
      </div>

      {isReadOnly && (
        <div className="text-xs text-cyan-400 bg-cyan-950/30 p-2 rounded text-center border border-cyan-900/50 uppercase tracking-widest font-mono select-none">
          Tryb tylko do odczytu (Dzień Archiwalny)
        </div>
      )}

      {/* Progress Ring */}
      <div className="flex flex-col items-center pt-4">
        <h2 className="text-cyan-400/80 uppercase tracking-[0.2em] text-xs font-bold mb-4 font-mono">System Stability Score</h2>
        <div className="relative w-40 h-40">
          <svg className="w-full h-full transform -rotate-90" viewBox="0 0 140 140">
            {/* Background ring */}
            <circle
              cx="70" cy="70" r={radius}
              className="stroke-slate-800" strokeWidth="8" fill="transparent"
            />
            {/* Animated progress ring */}
            <circle
              cx="70" cy="70" r={radius}
              className={isReadOnly ? "stroke-slate-500 drop-shadow-none transition-all duration-1000 ease-out" : "stroke-cyan-400 drop-shadow-[0_0_8px_rgba(34,211,238,0.8)] transition-all duration-1000 ease-out"}
              strokeWidth="8" fill="transparent"
              strokeDasharray={circumference}
              strokeDashoffset={strokeDashoffset}
              strokeLinecap="round"
            />
          </svg>
          <div className="absolute inset-0 flex items-center justify-center flex-col">
            <span className="text-4xl font-bold text-cyan-50 drop-shadow-md">{score}<span className="text-lg text-cyan-400">%</span></span>
            <span className="text-[10px] text-cyan-500/80 uppercase tracking-widest mt-1">Online</span>
          </div>
        </div>
      </div>

      {/* Routine Checks */}
      <div className={`cyber-panel p-5 space-y-4 ${isReadOnly ? 'opacity-80' : ''}`}>
        <h3 className="text-xs uppercase tracking-widest text-slate-400 border-b border-cyan-900/50 pb-2 mb-4">Daily Sequences</h3>
        
        <label className={`flex items-center gap-3 ${isReadOnly ? 'cursor-default' : 'cursor-pointer group'}`}>
          <input type="checkbox" checked={state.initScript} onChange={() => handleCheck('initScript')} disabled={isReadOnly}
            className="w-5 h-5 rounded border-cyan-700 bg-slate-900 text-cyan-400 focus:ring-cyan-500 focus:ring-offset-slate-900 transition-colors disabled:opacity-50" />
          <Droplets className={`w-4 h-4 shrink-0 transition-colors ${state.initScript ? 'text-cyan-400' : 'text-slate-500'}`} />
          <span className={`text-sm transition-colors ${state.initScript ? 'text-slate-200' : 'text-slate-400'} ${!isReadOnly && 'group-hover:text-cyan-300'}`}>Poranny Izotonik <span className="text-xs text-slate-500">- init_script</span></span>
        </label>

        <label className={`flex items-center gap-3 ${isReadOnly ? 'cursor-default' : 'cursor-pointer group'}`}>
          <input type="checkbox" checked={state.vitaminD3K2} onChange={() => handleCheck('vitaminD3K2')} disabled={isReadOnly}
            className="w-5 h-5 rounded border-cyan-700 bg-slate-900 text-cyan-400 focus:ring-cyan-500 focus:ring-offset-slate-900 transition-colors disabled:opacity-50" />
          <Pill className={`w-4 h-4 shrink-0 transition-colors ${state.vitaminD3K2 ? 'text-cyan-400' : 'text-slate-500'}`} />
          <span className={`text-sm transition-colors ${state.vitaminD3K2 ? 'text-slate-200' : 'text-slate-400'} ${!isReadOnly && 'group-hover:text-cyan-300'}`}>Witamina D3 + K2 MK7 (z tłuszczami) <span className="text-xs text-slate-500">- load_balancer</span></span>
        </label>

        <label className={`flex items-center gap-3 ${isReadOnly ? 'cursor-default' : 'cursor-pointer group'}`}>
          <input type="checkbox" checked={state.threadSleep} onChange={() => handleCheck('threadSleep')} disabled={isReadOnly}
            className="w-5 h-5 rounded border-cyan-700 bg-slate-900 text-cyan-400 focus:ring-cyan-500 focus:ring-offset-slate-900 transition-colors disabled:opacity-50" />
          <Coffee className={`w-4 h-4 shrink-0 transition-colors ${state.threadSleep ? 'text-cyan-400' : 'text-slate-500'}`} />
          <span className={`text-sm transition-colors ${state.threadSleep ? 'text-slate-200' : 'text-slate-400'} ${!isReadOnly && 'group-hover:text-cyan-300'}`}>Kawa &gt;90 min <span className="text-xs text-slate-500">- Thread.sleep</span></span>
        </label>

        <div className="flex flex-col sm:flex-row sm:items-center gap-3 relative">
          <label className={`flex items-center gap-3 flex-1 ${isReadOnly ? 'cursor-default' : 'cursor-pointer group'}`}>
            <input type="checkbox" checked={state.neatProcess} onChange={() => handleCheck('neatProcess')} disabled={isReadOnly}
              className="w-5 h-5 rounded border-cyan-700 bg-slate-900 text-cyan-400 focus:ring-cyan-500 focus:ring-offset-slate-900 transition-colors disabled:opacity-50" />
            <Activity className={`w-4 h-4 shrink-0 transition-colors ${state.neatProcess ? 'text-cyan-400' : 'text-slate-500'}`} />
            <span className={`text-sm transition-colors ${state.neatProcess ? 'text-slate-200' : 'text-slate-400'} ${!isReadOnly && 'group-hover:text-cyan-300'}`}>Dzienny limit kroków <span className="text-xs text-slate-500">- NEAT_Process</span></span>
          </label>
          <div className="flex items-center gap-2 ml-8 sm:ml-0 relative">
            <input 
              type="number" placeholder="8000"
              value={state.neatSteps} onChange={(e) => handleStepChange(e.target.value)}
              disabled={isReadOnly}
              className="cyber-input px-2 py-1.5 text-sm w-20 text-center shrink-0 disabled:opacity-50 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
            />
            <button 
              onClick={handleSaveSteps}
              disabled={isReadOnly}
              className="p-1.5 bg-slate-800/50 border border-cyan-900/50 rounded text-cyan-400 hover:bg-cyan-900/30 hover:text-cyan-300 transition-colors disabled:opacity-50 relative"
              title="Zapisz kroki"
            >
              <Save className="w-4 h-4" />
            </button>
            {showSavedMsg && (
              <div className="absolute -top-8 right-0 flex items-center gap-1 text-xs text-emerald-400 bg-slate-900/90 border border-emerald-900/30 px-2 py-1 rounded shadow-lg animate-in fade-in slide-in-from-bottom-1 whitespace-nowrap z-10 font-medium">
                <Check className="w-3 h-3" /> Zapisano
              </div>
            )}
          </div>
        </div>

        <label className={`flex items-center gap-3 ${isReadOnly ? 'cursor-default' : 'cursor-pointer group'}`}>
          <input type="checkbox" checked={state.shutdownSequence} onChange={() => handleCheck('shutdownSequence')} disabled={isReadOnly}
            className="w-5 h-5 rounded border-cyan-700 bg-slate-900 text-cyan-400 focus:ring-cyan-500 focus:ring-offset-slate-900 transition-colors disabled:opacity-50" />
          <Battery className={`w-4 h-4 shrink-0 transition-colors ${state.shutdownSequence ? 'text-cyan-400' : 'text-slate-500'}`} />
          <span className={`text-sm transition-colors ${state.shutdownSequence ? 'text-slate-200' : 'text-slate-400'} ${!isReadOnly && 'group-hover:text-cyan-300'}`}>Wieczorny Magnez <span className="text-xs text-slate-500">- shutdown_sequence</span></span>
        </label>
      </div>

      <HydrationLogger 
        hydration={state.hydration} 
        onHydrationChange={(val) => updateState({ hydration: val })}
        isReadOnly={isReadOnly}
      />

      {/* Diagnostics */}
      <div className={`cyber-panel p-5 space-y-6 ${isReadOnly ? 'opacity-80' : ''}`}>
        <h3 className="text-xs uppercase tracking-widest text-slate-400 border-b border-cyan-900/50 pb-2 mb-4">Diagnostics / Biometrics</h3>
        
        <div className="space-y-3">
          <div className="flex justify-between items-center text-sm">
            <span className="text-slate-300 flex items-center gap-2"><Zap className="w-4 h-4 text-cyan-400" /> Energia <span className="text-xs text-slate-500">- Moc procesora</span></span>
            <span className="text-cyan-400 font-bold">{state.energia} / 10</span>
          </div>
          <input 
            type="range" min="1" max="10" step="1" 
            value={state.energia} onChange={(e) => handleSlider('energia', parseInt(e.target.value))}
            disabled={isReadOnly}
            className="w-full disabled:opacity-50"
          />
        </div>

        <div className="space-y-3">
          <div className="flex justify-between items-center text-sm">
            <span className="text-slate-300 flex items-center gap-2"><Moon className="w-4 h-4 text-cyan-400" /> Jakość Snu <span className="text-xs text-slate-500">- Downtime</span></span>
            <span className="text-cyan-400 font-bold">{state.sen} / 10</span>
          </div>
          <input 
            type="range" min="1" max="10" step="1" 
            value={state.sen} onChange={(e) => handleSlider('sen', parseInt(e.target.value))}
            disabled={isReadOnly}
            className="w-full disabled:opacity-50"
          />
        </div>
      </div>

      <div className="flex justify-center pt-6">
        <img src="/WszystkokolwiekWFormie__Ciemne_Social.png" alt="IT Health v2.0 Logo" className="w-16 sm:w-20 object-contain rounded-xl drop-shadow-[0_0_15px_rgba(6,182,212,0.3)]" />
      </div>

    </div>
  );
}
