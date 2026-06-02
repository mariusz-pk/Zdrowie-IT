import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { HeartPulse, AlertTriangle, ShieldCheck, History, Activity, AlertCircle } from 'lucide-react';
import { useLocalStorage } from '../hooks/useLocalStorage';

interface TelemetryLog {
  id: string;
  datetime: string;
  rhr: number;
  spo2: number;
  symptoms: string[];
}

const SYMPTOMS_LIST = [
  'Mgła mózgowa',
  'Ból karku / pleców',
  'Zjazd energetyczny',
  'Przepracowanie / Stres'
];

const RECOMMENDATIONS: Record<string, string> = {
  'Mgła mózgowa': 'Wykonaj szot z zakwasu z buraka lub weź 30-sekundowy zimny prysznic.',
  'Ból karku / pleców': 'Uruchom procedurę otwierania klatki piersiowej i zresetuj zginacze bioder przy biurku.',
  'Zjazd energetyczny': 'Zablokuj kofeinę. Wyjdź na 15-minutowy spacer NEAT w świetle dziennym.',
  'Przepracowanie / Stres': 'Wstrzymaj procesy analityczne i wykonaj 4 cykle oddechu kwadratowego Box Breathing.'
};

export function IncidentResponse() {
  const [logs, setLogs] = useLocalStorage<TelemetryLog[]>('v2_incidentLogs', []);
  const [rhr, setRhr] = useState('');
  const [spo2, setSpo2] = useState('');
  const [selectedSymptoms, setSelectedSymptoms] = useState<string[]>([]);
  const [lastScanResult, setLastScanResult] = useState<TelemetryLog | null>(null);

  const toggleSymptom = (symptom: string) => {
    setSelectedSymptoms(prev => 
      prev.includes(symptom) ? prev.filter(s => s !== symptom) : [...prev, symptom]
    );
  };

  const handleScan = () => {
    const rhrValue = parseInt(rhr, 10);
    const spo2Value = parseInt(spo2, 10);
    if (isNaN(rhrValue) || rhrValue <= 0 || isNaN(spo2Value) || spo2Value <= 0) return;

    const newLog: TelemetryLog = {
      id: Math.random().toString(36).slice(2, 9),
      datetime: new Date().toLocaleString('pl-PL'),
      rhr: rhrValue,
      spo2: spo2Value,
      symptoms: [...selectedSymptoms]
    };

    setLogs(prev => [newLog, ...prev]);
    setLastScanResult(newLog);
    setRhr(''); 
    setSpo2('');
  };

  const isHighRhr = lastScanResult && lastScanResult.rhr > 80;
  const isOptimalRhr = lastScanResult && lastScanResult.rhr >= 40 && lastScanResult.rhr <= 80;
  const isLowSpo2 = lastScanResult && lastScanResult.spo2 < 95;

  return (
    <div className="space-y-6 pb-8 animate-in fade-in duration-300">
      
      <div className="cyber-panel p-6 space-y-6">
        <div className="flex items-center gap-3 border-b border-cyan-900/50 pb-4">
          <div className="p-2 bg-slate-800 rounded-lg">
            <HeartPulse className="w-6 h-6 text-cyan-400" />
          </div>
          <div>
            <h2 className="text-lg font-bold text-cyan-50">Diagnostic Tool</h2>
            <p className="text-xs text-slate-400 font-mono">Resting Heart Rate & SpO2 Check</p>
          </div>
        </div>

        <div className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium text-slate-300 block">Poranne Tętno Spoczynkowe (RHR):</label>
              <input 
                type="number" 
                value={rhr}
                onChange={(e) => { setRhr(e.target.value); setLastScanResult(null); }}
                placeholder="bpm (np. 65)"
                className="cyber-input w-full px-4 py-3 font-mono text-lg bg-slate-950/80"
                onKeyDown={(e) => e.key === 'Enter' && handleScan()}
              />
            </div>
            
            <div className="space-y-2">
              <label className="text-sm font-medium text-slate-300 block">Saturacja krwi (SpO2):</label>
              <input 
                type="number" 
                value={spo2}
                onChange={(e) => { setSpo2(e.target.value); setLastScanResult(null); }}
                placeholder="% (np. 98)"
                className="cyber-input w-full px-4 py-3 font-mono text-lg bg-slate-950/80"
                onKeyDown={(e) => e.key === 'Enter' && handleScan()}
              />
            </div>
          </div>
        </div>

        <div className="space-y-3 pt-2">
          <label className="text-sm font-medium text-slate-300 block">Zgłoś aktywny defekt systemu (Symptomy):</label>
          <div className="grid grid-cols-2 gap-2">
            {SYMPTOMS_LIST.map(sym => (
              <button
                key={sym}
                onClick={() => toggleSymptom(sym)}
                className={`py-2 px-3 text-xs sm:text-sm rounded-lg transition-all border ${selectedSymptoms.includes(sym) ? 'bg-cyan-900/40 border-cyan-400 text-cyan-100 shadow-[0_0_10px_rgba(34,211,238,0.2)]' : 'bg-slate-950 border-slate-800 text-slate-400 hover:border-slate-600'}`}
              >
                {sym}
              </button>
            ))}
          </div>
          
          <AnimatePresence>
            {selectedSymptoms.length > 0 && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="overflow-hidden"
              >
                <div className="mt-3 space-y-2">
                  <h4 className="text-xs uppercase tracking-widest text-emerald-400 font-mono">Rekomendowany Hotfix:</h4>
                  {selectedSymptoms.map(sym => (
                    <div key={sym} className="bg-slate-900/50 border border-slate-700/50 p-3 rounded-lg flex items-start gap-3">
                      <Activity className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                      <div>
                        <span className="text-[10px] text-slate-500 uppercase tracking-wider block mb-1">{sym}</span>
                        <p className="text-sm text-slate-300">{RECOMMENDATIONS[sym]}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        <button 
          onClick={handleScan}
          disabled={!rhr || !spo2}
          className="w-full py-3 bg-cyan-600 hover:bg-cyan-500 disabled:opacity-50 disabled:hover:bg-cyan-600 text-slate-950 font-bold rounded-lg transition-colors shadow-[0_0_15px_rgba(6,182,212,0.3)] active:scale-95 text-sm uppercase tracking-wider mt-4"
        >
          Zapisz log
        </button>

        <AnimatePresence mode="wait">
          {(!lastScanResult || (!isHighRhr && !isOptimalRhr && !isLowSpo2)) ? null : (
            <motion.div 
              initial={{ opacity: 0, y: 10, height: 0 }}
              animate={{ opacity: 1, y: 0, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="space-y-3 overflow-hidden mt-4"
            >
              {isLowSpo2 && (
                <div className="border-l-4 border-amber-500 bg-amber-500/10 p-5 rounded-r-lg shadow-lg">
                  <div className="flex items-start gap-4">
                    <AlertCircle className="w-8 h-8 text-amber-500 shrink-0 animate-pulse" />
                    <div className="space-y-2">
                      <h3 className="text-amber-400 font-bold uppercase tracking-widest text-sm flex items-center gap-2">
                        <span className="w-2 h-2 rounded-full bg-amber-500 animate-ping"></span>
                        Ostrzeżenie Systemu
                      </h3>
                      <p className="text-amber-200/90 font-mono text-sm leading-relaxed">
                        [ ALERT: Wykryto niską wydajność wentylacji (SpO2 &lt; 95%). Otwórz okno i wdróż protokół głębokiego oddechu. ]
                      </p>
                    </div>
                  </div>
                </div>
              )}
              
              {isHighRhr && (
                <div className="border-l-4 border-rose-500 bg-rose-500/10 p-5 rounded-r-lg shadow-lg">
                  <div className="flex items-start gap-4">
                    <AlertTriangle className="w-8 h-8 text-rose-500 shrink-0 animate-pulse" />
                    <div className="space-y-2">
                      <h3 className="text-rose-400 font-bold uppercase tracking-widest text-sm flex items-center gap-2">
                        <span className="w-2 h-2 rounded-full bg-rose-500 animate-ping"></span>
                        Alert Systemu
                      </h3>
                      <p className="text-rose-200/90 font-mono text-sm leading-relaxed">
                        [ ALERT: Przeciążenie układu współczulnego. Uruchom natychmiast skrypt oddechowy 4-7-8! ]
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {isOptimalRhr && !isLowSpo2 && (
                <div className="border-l-4 border-emerald-500 bg-emerald-500/10 p-4 rounded-r-lg">
                  <div className="flex items-center gap-3">
                    <ShieldCheck className="w-6 h-6 text-emerald-500 shrink-0" />
                    <p className="text-emerald-400 text-sm font-mono">[ SYSTEM OK: RHR & SpO2 w normie. Gotowość operacyjna 100%. ]</p>
                  </div>
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>

      </div>

      <div className="cyber-panel p-5 space-y-4">
        <div className="flex items-center gap-2 text-slate-400 border-b border-cyan-900/50 pb-2">
          <History className="w-4 h-4" />
          <h3 className="text-xs uppercase tracking-widest font-mono">Historia logów telemetrycznych (System Logs)</h3>
        </div>
        
        {logs.length === 0 ? (
          <p className="text-xs text-slate-500 font-mono italic text-center py-4">Brak zarejestrowanych logów telemetrycznych.</p>
        ) : (
          <div className="space-y-3 max-h-80 overflow-y-auto pr-2">
            <AnimatePresence>
              {logs.map((log) => {
                const highRhr = log.rhr > 80;
                const lowSpo2 = log.spo2 < 95;
                const hasIssues = highRhr || lowSpo2;
                
                return (
                  <motion.div 
                    key={log.id}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="flex flex-col p-3 rounded-lg bg-slate-950/60 border border-slate-800 gap-2"
                  >
                    <div className="flex items-start justify-between">
                      <div>
                        <span className="text-[10px] text-slate-500 font-mono">{log.datetime}</span>
                        <div className="flex items-center gap-4 mt-1">
                          <div className="flex items-center gap-1.5">
                            <span className={`text-sm font-bold ${highRhr ? 'text-rose-400' : 'text-emerald-400'}`}>{log.rhr} bpm</span>
                            {highRhr && <AlertTriangle className="w-3 h-3 text-rose-500" />}
                          </div>
                          <div className="flex items-center gap-1.5">
                            <span className={`text-sm font-bold ${lowSpo2 ? 'text-amber-400' : 'text-emerald-400'}`}>{log.spo2}% SpO2</span>
                            {lowSpo2 && <AlertCircle className="w-3 h-3 text-amber-500" />}
                          </div>
                        </div>
                      </div>
                      <div className="text-[10px] uppercase tracking-wider shrink-0">
                        {hasIssues ? (
                          <span className="text-rose-500/80 bg-rose-500/10 px-2 py-1 rounded">Przeciążenie</span>
                        ) : (
                          <span className="text-emerald-500/80 bg-emerald-500/10 px-2 py-1 rounded">Norma</span>
                        )}
                      </div>
                    </div>
                    {log.symptoms && log.symptoms.length > 0 && (
                      <div className="flex flex-wrap gap-1 mt-1 pt-2 border-t border-slate-800/50">
                        {log.symptoms.map(s => (
                          <span key={s} className="text-[10px] bg-slate-800 text-slate-400 px-1.5 py-0.5 rounded">
                            {s}
                          </span>
                        ))}
                      </div>
                    )}
                  </motion.div>
                );
              })}
            </AnimatePresence>
          </div>
        )}
      </div>

    </div>
  );
}
