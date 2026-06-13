import React, { useState, useEffect } from 'react';
import { useLocalStorage } from '../hooks/useLocalStorage';
import { motion, AnimatePresence } from 'motion/react';
import { ChevronDown, Timer as TimerIcon, Play, Square, Sunrise, Sun, Sunset, Clock, Droplets, Leaf, Coffee, TestTube, Zap, Brain, Moon, Battery, Hexagon, GlassWater, Save, Check } from 'lucide-react';
import { RUNTIME_ELIXIRS, ElixirRecipe } from '../data';

const iconMap: Record<string, React.ElementType> = {
  "Poranny Izotonik": Droplets,
  "Zielona Matcha Latte": Leaf,
  "Złoty Eliksir Imbirowy": Coffee,
  "Szot z Zakwasu Buraka": TestTube,
  "Matcha-Mate Turbo": Zap,
  "Kakao Adaptogenne": Brain,
  "Złote Mleko Kardamonowe": Moon,
  "Lemoniada Magnezowa": Battery,
  "Eliksir z Pyłku Pszczelego": Hexagon,
  "Woda Chia Fresca": GlassWater,
};

// Internal Timer Component
function BrewTimer({ minutes }: { minutes: number }) {
  const [timeLeft, setTimeLeft] = useState(minutes * 60);
  const [isRunning, setIsRunning] = useState(false);

  useEffect(() => {
    let interval: number;
    if (isRunning && timeLeft > 0) {
      interval = window.setInterval(() => {
        setTimeLeft(t => t - 1);
      }, 1000);
    } else if (timeLeft === 0 && isRunning) {
      setIsRunning(false);
      if (navigator.vibrate) navigator.vibrate([200, 100, 200]);
    }
    return () => clearInterval(interval);
  }, [isRunning, timeLeft]);

  const toggleTimer = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (timeLeft === 0) setTimeLeft(minutes * 60); // reset if finished
    setIsRunning(!isRunning);
  };

  const mins = Math.floor(timeLeft / 60);
  const secs = timeLeft % 60;
  const timeStr = `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  
  const percentage = 100 - (timeLeft / (minutes * 60)) * 100;

  return (
    <div className="mt-4 p-3 bg-slate-950/80 rounded-lg border border-cyan-900/60 flex items-center justify-between" onClick={e => e.stopPropagation()}>
      <div className="flex items-center gap-3">
        <button 
          onClick={toggleTimer}
          className={`w-10 h-10 rounded-full flex items-center justify-center transition-colors ${isRunning ? 'bg-rose-500/20 text-rose-400 hover:bg-rose-500/30' : 'bg-cyan-500/20 text-cyan-400 hover:bg-cyan-500/30'}`}
        >
          {isRunning ? <Square className="w-4 h-4 fill-current" /> : <Play className="w-5 h-5 ml-1 fill-current" />}
        </button>
        <div>
          <div className="font-mono text-xl font-bold text-slate-100 tracking-wider w-20">{timeStr}</div>
          <div className="text-[10px] uppercase tracking-widest text-slate-500">Uruchom timer parzenia</div>
        </div>
      </div>
      <div className="w-16 h-1 bg-slate-800 rounded-full overflow-hidden self-end mb-2">
        <div className="h-full bg-cyan-400 transition-all duration-1000 ease-linear" style={{ width: `${percentage}%` }}></div>
      </div>
    </div>
  );
}

const ElixirCard: React.FC<{ recipe: ElixirRecipe; isOpen: boolean; toggleOpen: () => void }> = ({ recipe, isOpen, toggleOpen }) => {
  const Icon = iconMap[recipe.name] || Coffee;

  return (
    <div className="cyber-panel overflow-hidden transition-all duration-300">
      <button 
        onClick={toggleOpen}
        className="w-full p-4 flex items-center justify-between text-left hover:bg-slate-800/40 transition-colors"
      >
        <div className="flex items-center gap-4">
          <div className="p-2 rounded-lg bg-slate-900 border border-slate-700/50">
            <Icon className="w-5 h-5 text-cyan-400" />
          </div>
          <div>
            <h3 className="font-medium text-cyan-50 pr-4">{recipe.name}</h3>
            {recipe.timeMin && (
              <div className="flex items-center gap-2 mt-1 text-slate-500 text-xs">
                <TimerIcon className="w-3 h-3" />
                <span>{recipe.timeMin} min</span>
              </div>
            )}
          </div>
        </div>
        <div className={`p-2 rounded-full border border-slate-700 bg-slate-900 transition-transform duration-300 ${isOpen ? 'rotate-180 bg-cyan-900/30 border-cyan-800' : ''}`}>
          <ChevronDown className={`w-4 h-4 ${isOpen ? 'text-cyan-400' : 'text-slate-400'}`} />
        </div>
      </button>

      <AnimatePresence initial={false}>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease: 'easeInOut' }}
            className="overflow-hidden bg-slate-900/50 border-t border-cyan-900/30"
          >
            <div className="p-4 space-y-4">
              <div>
                <h4 className="text-[10px] uppercase tracking-widest text-cyan-600 mb-2 font-bold font-mono">Składniki (Source Code)</h4>
                <ul className="space-y-1">
                  {recipe.ingredients.map((ing, i) => (
                    <li key={i} className="text-sm text-slate-300 pl-3 border-l hover:border-cyan-500 border-slate-700 py-0.5 transition-colors">
                      {ing}
                    </li>
                  ))}
                </ul>
              </div>
              
              <div>
                <h4 className="text-[10px] uppercase tracking-widest text-cyan-600 mb-2 font-bold font-mono">Instrukcja (Execution Flow)</h4>
                <p className="text-sm text-slate-400 leading-relaxed bg-slate-950/40 p-3 rounded-lg border-l-2 border-slate-800">
                  {recipe.instructions}
                </p>
              </div>

              {recipe.timeMin && recipe.timeMin > 0 && <BrewTimer minutes={recipe.timeMin} />}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

type LogEntry = {
  time: string;
  amount: number;
};

interface HydrationLoggerProps {
  hydration: number;
  onHydrationChange: (val: number) => void;
  isReadOnly?: boolean;
}

export function HydrationLogger({ hydration, onHydrationChange, isReadOnly }: HydrationLoggerProps) {
  const [isAdding, setIsAdding] = useState(false);
  const [history, setHistory] = useLocalStorage<LogEntry[]>('v2_hydration_history', []);
  const [goal, setGoal] = useLocalStorage('v2_hydration_goal', 2500); // 2.5L goal
  const [isEditingGoal, setIsEditingGoal] = useState(false);
  const [tempGoal, setTempGoal] = useState(goal.toString());
  const [showSavedMsg, setShowSavedMsg] = useState(false);

  const addHydration = () => {
    setIsAdding(true);
    
    // Add to history
    const now = new Date();
    const timeStr = `${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}`;
    setHistory(prev => [{ time: timeStr, amount: 250 }, ...prev].slice(0, 5));
    
    onHydrationChange(Math.min(hydration + 250, goal));
    setTimeout(() => setIsAdding(false), 500);
  };

  const saveGoal = () => {
    let val = parseInt(tempGoal, 10);
    if (!isNaN(val)) {
      if (val < 0) val = 0;
      if (val > 9000) val = 9000;
      setGoal(val);
      onHydrationChange(Math.min(hydration, val));
      setShowSavedMsg(true);
      setTimeout(() => setShowSavedMsg(false), 2000);
    } else {
      setTempGoal(goal.toString());
    }
    setIsEditingGoal(false);
  };

  const percentage = Math.min((hydration / goal) * 100, 100);

  return (
    <div className="cyber-panel p-4 mb-6">
      <div className="flex justify-between items-end mb-3">
        <div>
          <h3 className="text-[10px] uppercase tracking-widest text-cyan-500 font-bold font-mono">Nawodnienie (Hydration)</h3>
          <div className="text-2xl font-light text-slate-100 font-mono tracking-tight flex items-center gap-1">
            <span>{hydration}</span>
            <span className="text-sm text-slate-500 flex items-center">
              / 
              {isEditingGoal ? (
                <div className="flex items-center gap-1 relative ml-1">
                  <input 
                    type="number" 
                    min="0"
                    max="9000"
                    value={tempGoal}
                    onChange={(e) => setTempGoal(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && saveGoal()}
                    className="w-16 bg-slate-900 border border-cyan-800 text-cyan-300 px-1 py-0.5 rounded outline-none text-xs [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                    autoFocus
                  />
                  <button 
                    onClick={saveGoal}
                    className="p-1 bg-slate-800/50 border border-cyan-900/50 rounded text-cyan-400 hover:bg-cyan-900/30 hover:text-cyan-300 transition-colors"
                  >
                    <Save className="w-3 h-3" />
                  </button>
                </div>
              ) : (
                <div className="flex items-center gap-2">
                  <span className="ml-1">{goal} ml</span>
                  {!isReadOnly && (
                    <button onClick={() => setIsEditingGoal(true)} className="text-[10px] uppercase bg-slate-800/50 px-1.5 py-0.5 rounded hover:bg-slate-700/50 transition-colors text-slate-400">Zmień cel</button>
                  )}
                </div>
              )}
            </span>
          </div>
        </div>
        <div className="relative">
          <button
            onClick={addHydration}
            disabled={isReadOnly}
            className={`px-3 py-1.5 rounded bg-cyan-600/20 text-cyan-400 text-xs font-mono border border-cyan-800/50 hover:bg-cyan-600/30 transition-all flex items-center gap-1 ${
              isAdding ? 'scale-95 bg-cyan-500/40 text-cyan-300' : ''
            } ${isReadOnly ? 'opacity-50 cursor-not-allowed' : ''}`}
          >
            <motion.div
              animate={isAdding ? { y: [-2, 0, 0] } : {}}
              transition={{ duration: 0.3 }}
            >
              +250ml
            </motion.div>
          </button>
          {showSavedMsg && (
            <div className="absolute -bottom-6 right-0 flex items-center gap-1 text-xs text-emerald-400 animate-in fade-in slide-in-from-top-1 px-2 whitespace-nowrap">
              <Check className="w-3 h-3" /> Zapisano
            </div>
          )}
        </div>
      </div>

      <div className="flex items-center gap-3">
        <div className="h-2 w-full bg-slate-900 rounded-full overflow-hidden border border-slate-800 flex-1">
          <motion.div 
            className="h-full bg-gradient-to-r from-cyan-600 to-cyan-400"
            initial={{ width: 0 }}
            animate={{ width: `${percentage}%` }}
            transition={{ type: "spring", stiffness: 50, damping: 15 }}
          />
        </div>
        <div className="text-xs font-mono text-cyan-400 min-w-[36px] text-right">
          {percentage.toFixed(0)}%
        </div>
      </div>
      
      {hydration >= goal && (
        <motion.div 
          initial={{ opacity: 0, y: 10 }} 
          animate={{ opacity: 1, y: 0 }} 
          className="mt-3 text-xs text-center text-emerald-400 font-mono"
        >
          Cel dzienny osiągnięty. System nawodniony.
        </motion.div>
      )}

      {history.length > 0 && (
        <div className="mt-4 pt-3 border-t border-slate-800">
          <h4 className="text-[9px] uppercase tracking-widest text-slate-500 font-mono mb-2">Ostatni wpis</h4>
          <div className="space-y-1.5">
            {history.slice(0, 1).map((log, i) => (
              <div key={i} className="flex justify-between items-center text-xs font-mono text-slate-400">
                <div className="flex items-center gap-2">
                  <div className="w-1.5 h-1.5 rounded-full bg-cyan-500/50"></div>
                  <span>{log.time}</span>
                </div>
                <span className="text-cyan-400">+{log.amount} ml</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

export function RuntimeElixirs() {
  const [openId, setOpenId] = useState<string | null>(null);

  const categories = [
    { name: "PORANEK (Aktywacja i Rozruch)", icon: Sunrise, color: "text-amber-400", border: "border-amber-400/30" },
    { name: "W TRAKCIE DNIA (Wydajność i Skupienie)", icon: Sun, color: "text-emerald-400", border: "border-emerald-400/30" },
    { name: "WIECZÓR (Wyciszenie i Sen)", icon: Sunset, color: "text-rose-400", border: "border-rose-400/30" },
    { name: "DOWOLNA PORA (Wsparcie Całodobowe)", icon: Clock, color: "text-cyan-400", border: "border-cyan-400/30" }
  ];

  return (
    <div className="space-y-6 pb-8 animate-in fade-in duration-300">
      
      <div className="space-y-6 mt-6">
        {categories.map((cat, idx) => {
          const categoryElixirs = RUNTIME_ELIXIRS.filter(r => r.category === cat.name);
          
          if (categoryElixirs.length === 0) return null;
          
          const Icon = cat.icon;
          
          return (
            <div key={idx} className="space-y-3">
              <div className={`flex items-center gap-2 pb-2 border-b ${cat.border}`}>
                <Icon className={`w-4 h-4 ${cat.color}`} />
                <h2 className="text-[10px] uppercase tracking-widest font-bold text-slate-300">
                  {cat.name}
                </h2>
              </div>
              
              <div className="space-y-3">
                {categoryElixirs.map(recipe => (
                  <ElixirCard 
                    key={recipe.id} 
                    recipe={recipe} 
                    isOpen={openId === recipe.id} 
                    toggleOpen={() => setOpenId(openId === recipe.id ? null : recipe.id)} 
                  />
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
