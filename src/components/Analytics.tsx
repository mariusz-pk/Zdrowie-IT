import { useMemo, useRef, useEffect } from 'react';
import { useLocalStorage } from '../hooks/useLocalStorage';
import { TrendingUp, CalendarDays, Zap, Moon, Activity } from 'lucide-react';

type DailyCronState = {
  initScript: boolean;
  threadSleep: boolean;
  neatProcess: boolean;
  neatSteps: string;
  shutdownSequence: boolean;
  energia: number;
  sen: number;
  hydration: number;
};

const calculateScore = (state: DailyCronState | undefined) => {
  if (!state) return 0;
  let checks = 0;
  if (state.initScript) checks++;
  if (state.threadSleep) checks++;
  if (state.neatProcess) checks++;
  if (state.shutdownSequence) checks++;
  
  const energiaPoints = (state.energia / 10) * 15;
  const senPoints = (state.sen / 10) * 15;
  
  let currentGoal = 2500;
  try {
    const storedGoal = localStorage.getItem('v2_hydration_goal');
    if (storedGoal) currentGoal = parseInt(storedGoal.replace(/"/g, ''), 10) || 2500;
  } catch(e) {}
  
  const hydrationPoints = Math.min((state.hydration || 0) / currentGoal, 1) * 20;

  return Math.min(100, Math.max(0, Math.round((checks * 10) + energiaPoints + senPoints + hydrationPoints)));
};

const getLastNDays = (n: number) => {
  const dates = [];
  const today = new Date();
  for (let i = n - 1; i >= 0; i--) {
    const d = new Date(today);
    d.setDate(today.getDate() - i);
    const year = d.getFullYear();
    const month = String(d.getMonth() + 1).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');
    dates.push(`${year}-${month}-${day}`);
  }
  return dates;
};

export function Analytics() {
  const [history] = useLocalStorage<Record<string, DailyCronState>>('v2_dailyCronHistory_v2', {});

  const chartDates = useMemo(() => {
    const activeDates = Object.keys(history).sort();
    const todayStr = getLastNDays(1)[0];
    
    if (activeDates.length === 0) {
      return [todayStr];
    }
    
    const firstDate = new Date(activeDates[0]);
    const todayDate = new Date(todayStr); // Normalize to local midnight strings
    
    const diffTime = todayDate.getTime() - firstDate.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1;
    
    return getLastNDays(Math.max(1, diffDays));
  }, [history]);

  const monthDates = useMemo(() => getLastNDays(30), []);

  const chartData = useMemo(() => {
    return chartDates.map(date => {
      const state = history[date];
      return {
        date,
        dayName: new Date(date).toLocaleDateString('pl-PL', { weekday: 'short' }),
        dayStr: date.slice(8, 10) + '.' + date.slice(5, 7),
        score: calculateScore(state),
        energia: state?.energia || 0,
        sen: state?.sen || 0,
      };
    });
  }, [history, chartDates]);

  const monthStats = useMemo(() => {
    const daysWithData = monthDates.filter(d => history[d]);
    const totalDays = daysWithData.length;
    
    if (totalDays === 0) return { 
      avgScore: 0, avgEnergy: 0, avgSleep: 0, consistency: 0,
      initCount: 0, sleepCount: 0, neatCount: 0, shutdownCount: 0, avgSteps: 0, avgHydration: 0, hydrationCount: 0
    };

    let sumScore = 0, sumEnergy = 0, sumSleep = 0, activeDays = 0;
    let initCount = 0, sleepCount = 0, neatCount = 0, shutdownCount = 0, hydrationCount = 0, sumHydration = 0;
    let sumSteps = 0, daysWithSteps = 0;
    
    let currentGoal = 2500;
    try {
      const storedGoal = localStorage.getItem('v2_hydration_goal');
      if (storedGoal) currentGoal = parseInt(storedGoal.replace(/"/g, ''), 10) || 2500;
    } catch(e) {}
    
    monthDates.forEach(date => {
      const state = history[date];
      if (state) {
        sumScore += calculateScore(state);
        sumEnergy += state.energia;
        sumSleep += state.sen;
        if (calculateScore(state) > 0) activeDays++;

        if (state.initScript) initCount++;
        if (state.threadSleep) sleepCount++;
        if (state.neatProcess) neatCount++;
        if (state.shutdownSequence) shutdownCount++;
        if ((state.hydration || 0) >= currentGoal) hydrationCount++;
        sumHydration += (state.hydration || 0);

        const steps = parseInt(state.neatSteps, 10);
        if (!isNaN(steps) && steps > 0) {
          sumSteps += steps;
          daysWithSteps++;
        }
      }
    });

    return {
      avgScore: Math.round(sumScore / totalDays),
      avgEnergy: Number((sumEnergy / totalDays).toFixed(1)),
      avgSleep: Number((sumSleep / totalDays).toFixed(1)),
      avgHydration: Math.round(sumHydration / totalDays),
      hydrationCount,
      consistency: Math.round((activeDays / 30) * 100),
      initCount,
      sleepCount,
      neatCount,
      shutdownCount,
      avgSteps: daysWithSteps > 0 ? Math.round(sumSteps / daysWithSteps) : 0,
      daysWithData: totalDays
    };
  }, [history, monthDates]);

  const chartContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (chartContainerRef.current) {
      chartContainerRef.current.scrollLeft = chartContainerRef.current.scrollWidth;
    }
  }, [chartData]);

  return (
    <div className="space-y-6 pb-8 animate-in fade-in duration-300">
      
      {/* Performance Chart */}
      <div className="cyber-panel p-5 space-y-5">
        <div className="flex items-center gap-2 border-b border-cyan-900/50 pb-2">
          <CalendarDays className="w-4 h-4 text-cyan-500" />
          <h3 className="text-xs uppercase tracking-widest text-slate-300 font-mono">Historia Wydajności</h3>
        </div>
        
        <div ref={chartContainerRef} className="flex pt-6 h-48 gap-2 sm:gap-4 px-1 overflow-x-auto">
          {/* Y-Axis */}
          <div className="sticky left-0 bg-[#0B101E]/90 backdrop-blur-sm z-10 pr-2 pl-1 flex flex-col justify-between text-[10px] text-slate-500 font-mono text-right pb-[22px] min-w-[28px]">
            <span>100</span>
            <span>75</span>
            <span>50</span>
            <span>25</span>
            <span>0</span>
          </div>
          
          <div className="flex items-end flex-1 gap-2 sm:gap-4 h-full pb-1 min-w-max pr-4">
            {chartData.map((day, i) => (
              <div key={day.date} className="flex flex-col items-center group h-full w-8 sm:w-10 shrink-0">
                <div className="relative w-full flex justify-center h-full items-end bg-slate-900/50 rounded-t-sm border-b border-slate-700 pb-px">
                  <div 
                    className="w-full max-w-[24px] bg-cyan-500/80 rounded-t-sm transition-all duration-500 group-hover:bg-cyan-400 relative"
                    style={{ height: `${Math.max(day.score, 4)}%` }}
                  >
                    <div className="absolute -top-5 left-1/2 -translate-x-1/2 text-[9px] sm:text-[10px] text-cyan-300 font-mono font-bold">
                      {day.score}%
                    </div>
                  </div>
                </div>
                <div className="flex flex-col items-center mt-2">
                  <span className="text-[9px] uppercase text-slate-400 font-mono truncate">{day.dayName}</span>
                  <span className="text-[8px] text-slate-600 font-mono">{day.dayStr}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Monthly Summary */}
      <div className="cyber-panel p-5 space-y-4">
        <div className="flex items-center gap-2 border-b border-cyan-900/50 pb-2">
          <TrendingUp className="w-4 h-4 text-cyan-500" />
          <h3 className="text-xs uppercase tracking-widest text-slate-300 font-mono">Raport: Ostatnie 30 dni</h3>
        </div>

        <div className="grid grid-cols-2 gap-3 mt-4">
          <div className="bg-slate-900/50 border border-slate-800 p-3 rounded-lg flex flex-col items-center justify-center text-center">
            <Activity className="w-5 h-5 text-cyan-400 mb-1" />
            <span className="text-[10px] text-slate-500 uppercase tracking-widest">Średni Score</span>
            <span className="text-2xl font-bold font-mono text-slate-200 mt-1">{monthStats.avgScore}<span className="text-sm text-cyan-500">%</span></span>
          </div>
          
          <div className="bg-slate-900/50 border border-slate-800 p-3 rounded-lg flex flex-col items-center justify-center text-center">
            <TrendingUp className="w-5 h-5 text-emerald-400 mb-1" />
            <span className="text-[10px] text-slate-500 uppercase tracking-widest">Konsekwencja</span>
            <span className="text-2xl font-bold font-mono text-slate-200 mt-1">{monthStats.consistency}<span className="text-sm text-emerald-500">%</span></span>
          </div>

          <div className="bg-slate-900/50 border border-slate-800 p-3 rounded-lg flex flex-col items-center justify-center text-center">
            <Zap className="w-5 h-5 text-amber-400 mb-1" />
            <span className="text-[10px] text-slate-500 uppercase tracking-widest">Śr. Energia</span>
            <span className="text-xl font-bold font-mono text-slate-200 mt-1">{monthStats.avgEnergy.toFixed(1)}<span className="text-xs text-slate-500"> /10</span></span>
          </div>

          <div className="bg-slate-900/50 border border-slate-800 p-3 rounded-lg flex flex-col items-center justify-center text-center">
            <Moon className="w-5 h-5 text-indigo-400 mb-1" />
            <span className="text-[10px] text-slate-500 uppercase tracking-widest">Śr. Sen</span>
            <span className="text-xl font-bold font-mono text-slate-200 mt-1">{monthStats.avgSleep.toFixed(1)}<span className="text-xs text-slate-500"> /10</span></span>
          </div>
        </div>
      </div>

      {/* Process Tracking Summary */}
      <div className="cyber-panel p-5 space-y-4">
        <div className="flex items-center gap-2 border-b border-cyan-900/50 pb-2">
          <Activity className="w-4 h-4 text-cyan-500" />
          <h3 className="text-xs uppercase tracking-widest text-slate-300 font-mono">Rozbicie Procesów (30 dni)</h3>
        </div>

        <div className="space-y-4 mt-4">
          <div className="space-y-1">
            <div className="flex justify-between text-[11px] uppercase tracking-wider text-slate-400">
              <span>Poranny Izotonik (init_script)</span>
              <span className="font-mono text-cyan-400">{monthStats.initCount} / 30 dni</span>
            </div>
            <div className="h-1.5 w-full bg-slate-800 rounded overflow-hidden">
              <div className="h-full bg-cyan-500 transition-all" style={{ width: `${(monthStats.initCount / 30) * 100}%` }}></div>
            </div>
          </div>

          <div className="space-y-1">
            <div className="flex justify-between text-[11px] uppercase tracking-wider text-slate-400">
              <span>Kawa &gt;90 min (Thread.sleep)</span>
              <span className="font-mono text-cyan-400">{monthStats.sleepCount} / 30 dni</span>
            </div>
            <div className="h-1.5 w-full bg-slate-800 rounded overflow-hidden">
              <div className="h-full bg-cyan-500 transition-all" style={{ width: `${(monthStats.sleepCount / 30) * 100}%` }}></div>
            </div>
          </div>

          <div className="space-y-1">
            <div className="flex justify-between text-[11px] uppercase tracking-wider text-slate-400">
              <span>8000 Kroków (NEAT_Process)</span>
              <span className="font-mono text-cyan-400">{monthStats.neatCount} / 30 dni</span>
            </div>
            <div className="h-1.5 w-full bg-slate-800 rounded overflow-hidden">
              <div className="h-full bg-cyan-500 transition-all" style={{ width: `${(monthStats.neatCount / 30) * 100}%` }}></div>
            </div>
            {monthStats.avgSteps > 0 && (
              <p className="text-[10px] text-slate-500 font-mono text-right mt-0.5">Średnia: {monthStats.avgSteps} kroków</p>
            )}
          </div>

          <div className="space-y-1">
            <div className="flex justify-between text-[11px] uppercase tracking-wider text-slate-400">
              <span>Nawodnienie (Hydration)</span>
              <span className="font-mono text-cyan-400">{monthStats.hydrationCount} / 30 dni</span>
            </div>
            <div className="h-1.5 w-full bg-slate-800 rounded overflow-hidden">
              <div className="h-full bg-cyan-500 transition-all" style={{ width: `${(monthStats.hydrationCount / 30) * 100}%` }}></div>
            </div>
            {monthStats.avgHydration > 0 && (
              <p className="text-[10px] text-slate-500 font-mono text-right mt-0.5">Średnia: {monthStats.avgHydration} ml</p>
            )}
          </div>

          <div className="space-y-1">
            <div className="flex justify-between text-[11px] uppercase tracking-wider text-slate-400">
              <span>Wieczorny Magnez (shutdown_sequence)</span>
              <span className="font-mono text-cyan-400">{monthStats.shutdownCount} / 30 dni</span>
            </div>
            <div className="h-1.5 w-full bg-slate-800 rounded overflow-hidden">
              <div className="h-full bg-cyan-500 transition-all" style={{ width: `${(monthStats.shutdownCount / 30) * 100}%` }}></div>
            </div>
          </div>
        </div>
      </div>

    </div>
  );
}
