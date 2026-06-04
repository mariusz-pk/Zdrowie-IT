import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ChevronDown, Timer as TimerIcon, Play, Square } from 'lucide-react';
import { RUNTIME_ELIXIRS, ElixirRecipe } from '../data';

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

function ElixirCard({ recipe, isOpen, toggleOpen }: { recipe: ElixirRecipe; isOpen: boolean; toggleOpen: () => void }) {
  return (
    <div className="cyber-panel overflow-hidden transition-all duration-300">
      <button 
        onClick={toggleOpen}
        className="w-full p-4 flex items-center justify-between text-left hover:bg-slate-800/40 transition-colors"
      >
        <div>
          <h3 className="font-medium text-cyan-50 pr-4">{recipe.name}</h3>
          <div className="flex items-center gap-2 mt-1 text-slate-500 text-xs">
            <TimerIcon className="w-3 h-3" />
            <span>{recipe.timeMin} min</span>
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

              {recipe.timeMin > 1 && <BrewTimer minutes={recipe.timeMin} />}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function HydrationLogger() {
  const [hydration, setHydration] = useState(0);
  const [isAdding, setIsAdding] = useState(false);
  const goal = 2500; // 2.5L goal

  const addHydration = () => {
    setIsAdding(true);
    setHydration((prev) => Math.min(prev + 250, goal));
    setTimeout(() => setIsAdding(false), 500);
  };

  const percentage = Math.min((hydration / goal) * 100, 100);

  return (
    <div className="cyber-panel p-4 mb-6">
      <div className="flex justify-between items-end mb-3">
        <div>
          <h3 className="text-[10px] uppercase tracking-widest text-cyan-500 font-bold font-mono">Nawodnienie (Hydration)</h3>
          <div className="text-2xl font-light text-slate-100 font-mono tracking-tight">
            {hydration} <span className="text-sm text-slate-500">/ {goal} ml</span>
          </div>
        </div>
        <button
          onClick={addHydration}
          className={`px-3 py-1.5 rounded bg-cyan-600/20 text-cyan-400 text-xs font-mono border border-cyan-800/50 hover:bg-cyan-600/30 transition-all flex items-center gap-1 ${
            isAdding ? 'scale-95 bg-cyan-500/40 text-cyan-300' : ''
          }`}
        >
          <motion.div
            animate={isAdding ? { y: [-2, 0, 0] } : {}}
            transition={{ duration: 0.3 }}
          >
            +250ml
          </motion.div>
        </button>
      </div>

      <div className="h-2 w-full bg-slate-900 rounded-full overflow-hidden border border-slate-800">
        <motion.div 
          className="h-full bg-gradient-to-r from-cyan-600 to-cyan-400"
          initial={{ width: 0 }}
          animate={{ width: `${percentage}%` }}
          transition={{ type: "spring", stiffness: 50, damping: 15 }}
        />
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
    </div>
  );
}

export function RuntimeElixirs() {
  const [openId, setOpenId] = useState<string | null>(null);

  return (
    <div className="space-y-4 pb-8 animate-in fade-in duration-300">
      <HydrationLogger />
      
      <p className="text-sm text-slate-400 mb-4 px-1">Załaduj jeden ze sprawdzonych eliksirów mocy, by zoptymalizować wydajność układu.</p>
      
      <div className="space-y-3">
        {RUNTIME_ELIXIRS.map(recipe => (
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
}
