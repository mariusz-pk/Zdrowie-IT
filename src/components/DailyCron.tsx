import { useEffect, useState, useMemo } from 'react';
import { useLocalStorage } from '../hooks/useLocalStorage';

type DailyCronState = {
  initScript: boolean;
  threadSleep: boolean;
  neatProcess: boolean;
  neatSteps: string;
  shutdownSequence: boolean;
  energia: number;
  sen: number;
};

const getLocalDateString = () => {
  const d = new Date();
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
};

const DEFAULT_STATE: DailyCronState = {
  initScript: false,
  threadSleep: false,
  neatProcess: false,
  neatSteps: '',
  shutdownSequence: false,
  energia: 5,
  sen: 5,
};

export function DailyCron() {
  const [history, setHistory] = useLocalStorage<Record<string, DailyCronState>>('v2_dailyCronHistory_v2', {});
  const today = getLocalDateString();
  const [selectedDate, setSelectedDate] = useState<string>(today);

  const state = history[selectedDate] || DEFAULT_STATE;
  const isReadOnly = selectedDate !== today;

  const [score, setScore] = useState(0);

  const availableDates = useMemo(() => {
    const dates = Object.keys(history);
    if (!dates.includes(today)) {
      dates.push(today);
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
    
    const energiaPoints = (state.energia / 10) * 30;
    const senPoints = (state.sen / 10) * 30;
    
    const calculatedScore = Math.round((checks * 10) + energiaPoints + senPoints);
    setScore(Math.min(100, Math.max(0, calculatedScore)));
  }, [state]);

  const updateState = (updates: Partial<DailyCronState>) => {
    if (isReadOnly) return;
    setHistory(prev => ({
      ...prev,
      [today]: {
        ...(prev[today] || DEFAULT_STATE),
        ...updates
      }
    }));
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
        <label className="text-xs text-slate-400 uppercase tracking-widest font-mono">Wybierz dzień sprintu:</label>
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
          <span className={`text-sm transition-colors ${state.initScript ? 'text-slate-200' : 'text-slate-400'} ${!isReadOnly && 'group-hover:text-cyan-300'}`}>init_script <span className="text-xs text-slate-500">(Poranny Izotonik)</span></span>
        </label>

        <label className={`flex items-center gap-3 ${isReadOnly ? 'cursor-default' : 'cursor-pointer group'}`}>
          <input type="checkbox" checked={state.threadSleep} onChange={() => handleCheck('threadSleep')} disabled={isReadOnly}
            className="w-5 h-5 rounded border-cyan-700 bg-slate-900 text-cyan-400 focus:ring-cyan-500 focus:ring-offset-slate-900 transition-colors disabled:opacity-50" />
          <span className={`text-sm transition-colors ${state.threadSleep ? 'text-slate-200' : 'text-slate-400'} ${!isReadOnly && 'group-hover:text-cyan-300'}`}>Thread.sleep <span className="text-xs text-slate-500">(Kawa &gt;90 min)</span></span>
        </label>

        <div className="flex flex-col sm:flex-row sm:items-center gap-3">
          <label className={`flex items-center gap-3 flex-1 ${isReadOnly ? 'cursor-default' : 'cursor-pointer group'}`}>
            <input type="checkbox" checked={state.neatProcess} onChange={() => handleCheck('neatProcess')} disabled={isReadOnly}
              className="w-5 h-5 rounded border-cyan-700 bg-slate-900 text-cyan-400 focus:ring-cyan-500 focus:ring-offset-slate-900 transition-colors disabled:opacity-50" />
            <span className={`text-sm transition-colors ${state.neatProcess ? 'text-slate-200' : 'text-slate-400'} ${!isReadOnly && 'group-hover:text-cyan-300'}`}>NEAT_Process <span className="text-xs text-slate-500">(8 000 kroków)</span></span>
          </label>
          <input 
            type="number" placeholder="Liczba kroków..."
            value={state.neatSteps} onChange={(e) => handleStepChange(e.target.value)}
            disabled={isReadOnly}
            className="cyber-input px-3 py-1.5 text-sm w-32 shrink-0 ml-8 sm:ml-0 disabled:opacity-50"
          />
        </div>

        <label className={`flex items-center gap-3 ${isReadOnly ? 'cursor-default' : 'cursor-pointer group'}`}>
          <input type="checkbox" checked={state.shutdownSequence} onChange={() => handleCheck('shutdownSequence')} disabled={isReadOnly}
            className="w-5 h-5 rounded border-cyan-700 bg-slate-900 text-cyan-400 focus:ring-cyan-500 focus:ring-offset-slate-900 transition-colors disabled:opacity-50" />
          <span className={`text-sm transition-colors ${state.shutdownSequence ? 'text-slate-200' : 'text-slate-400'} ${!isReadOnly && 'group-hover:text-cyan-300'}`}>shutdown_sequence <span className="text-xs text-slate-500">(Wieczorny Magnez)</span></span>
        </label>
      </div>

      {/* Diagnostics */}
      <div className={`cyber-panel p-5 space-y-6 ${isReadOnly ? 'opacity-80' : ''}`}>
        <h3 className="text-xs uppercase tracking-widest text-slate-400 border-b border-cyan-900/50 pb-2 mb-4">Diagnostics / Biometrics</h3>
        
        <div className="space-y-3">
          <div className="flex justify-between items-center text-sm">
            <span className="text-slate-300">Moc Procesora <span className="text-xs text-slate-500">(Energia)</span></span>
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
            <span className="text-slate-300">Downtime <span className="text-xs text-slate-500">(Jakość Snu)</span></span>
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
        <img src="/WszystkokolwiekWFormie__Ciemne_Social.png" alt="WszystkokolwiekWFormie Logo" className="w-48 object-contain rounded-xl drop-shadow-[0_0_15px_rgba(6,182,212,0.3)]" />
      </div>

    </div>
  );
}
