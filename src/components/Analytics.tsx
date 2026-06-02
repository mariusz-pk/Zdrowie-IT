import { useMemo } from 'react';
import { useLocalStorage } from '../hooks/useLocalStorage';
import { BarChart3, TrendingUp, CalendarDays, Zap, Moon, Activity } from 'lucide-react';

type DailyCronState = {
  initScript: boolean;
  threadSleep: boolean;
  neatProcess: boolean;
  neatSteps: string;
  shutdownSequence: boolean;
  energia: number;
  sen: number;
};

const calculateScore = (state: DailyCronState | undefined) => {
  if (!state) return 0;
  let checks = 0;
  if (state.initScript) checks++;
  if (state.threadSleep) checks++;
  if (state.neatProcess) checks++;
  if (state.shutdownSequence) checks++;
  const energiaPoints = (state.energia / 10) * 30;
  const senPoints = (state.sen / 10) * 30;
  return Math.min(100, Math.max(0, Math.round((checks * 10) + energiaPoints + senPoints)));
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

  const weekDates = useMemo(() => getLastNDays(7), []);
  const monthDates = useMemo(() => getLastNDays(30), []);

  const weekData = useMemo(() => {
    return weekDates.map(date => {
      const state = history[date];
      return {
        date,
        dayName: new Date(date).toLocaleDateString('pl-PL', { weekday: 'short' }),
        score: calculateScore(state),
        energia: state?.energia || 0,
        sen: state?.sen || 0,
      };
    });
  }, [history, weekDates]);

  const monthStats = useMemo(() => {
    const daysWithData = monthDates.filter(d => history[d]);
    const totalDays = daysWithData.length;
    
    if (totalDays === 0) return { 
      avgScore: 0, avgEnergy: 0, avgSleep: 0, consistency: 0,
      initCount: 0, sleepCount: 0, neatCount: 0, shutdownCount: 0, avgSteps: 0 
    };

    let sumScore = 0, sumEnergy = 0, sumSleep = 0, activeDays = 0;
    let initCount = 0, sleepCount = 0, neatCount = 0, shutdownCount = 0;
    let sumSteps = 0, daysWithSteps = 0;
    
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
      consistency: Math.round((activeDays / 30) * 100),
      initCount,
      sleepCount,
      neatCount,
      shutdownCount,
      avgSteps: daysWithSteps > 0 ? Math.round(sumSteps / daysWithSteps) : 0,
      daysWithData: totalDays
    };
  }, [history, monthDates]);

  return (
    <div className="space-y-6 pb-8 animate-in fade-in duration-300">
      
      <div className="flex items-center gap-3 cyber-panel p-4 mb-2">
        <div className="p-2 bg-slate-800 rounded-lg">
          <BarChart3 className="w-5 h-5 text-cyan-400" />
        </div>
        <div>
          <h2 className="text-lg font-bold text-cyan-50">System Analytics</h2>
          <p className="text-xs text-slate-400 font-mono">Telemetry & Stability Reports</p>
        </div>
      </div>

      {/* Weekly Chart */}
      <div className="cyber-panel p-5 space-y-5">
        <div className="flex items-center gap-2 border-b border-cyan-900/50 pb-2">
          <CalendarDays className="w-4 h-4 text-cyan-500" />
          <h3 className="text-xs uppercase tracking-widest text-slate-300 font-mono">Wydajność: Ostatnie 7 dni</h3>
        </div>
        
        <div className="flex items-end justify-between h-40 pt-4 gap-1 sm:gap-2">
          {weekData.map((day, i) => (
            <div key={day.date} className="flex flex-col items-center flex-1 group">
              <div className="relative w-full flex justify-center h-full items-end bg-slate-900/50 rounded-t-sm border-b border-slate-700">
                <div 
                  className="w-full max-w-[24px] bg-cyan-500/80 rounded-t-sm transition-all duration-500 group-hover:bg-cyan-400 relative"
                  style={{ height: `${Math.max(day.score, 4)}%` }}
                >
                  <div className="absolute -top-6 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity text-[10px] text-cyan-300 font-mono bg-slate-950 px-1 py-0.5 rounded border border-cyan-900/50 z-10 pointer-events-none">
                    {day.score}%
                  </div>
                </div>
              </div>
              <span className="text-[9px] uppercase mt-2 text-slate-500 font-mono">{day.dayName}</span>
            </div>
          ))}
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
