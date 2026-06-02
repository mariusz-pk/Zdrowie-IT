import { useState } from 'react';
import { useLocalStorage } from '../hooks/useLocalStorage';
import { ExternalLink, Check } from 'lucide-react';
import { MONTHLY_CORE_DEPENDENCIES, WEEKLY_PATCHES_DEPENDENCIES } from '../data';

export function Dependencies() {
  const [activeSubTab, setActiveSubTab] = useState<'monthly' | 'weekly'>('monthly');
  const [acquired, setAcquired] = useLocalStorage<string[]>('v2_acquiredDeps', []);

  const toggleItem = (item: string) => {
    setAcquired(prev => 
      prev.includes(item) ? prev.filter(i => i !== item) : [...prev, item]
    );
  };

  const getList = () => activeSubTab === 'monthly' ? MONTHLY_CORE_DEPENDENCIES : WEEKLY_PATCHES_DEPENDENCIES;
  
  const currentList = getList();
  const progress = Math.round((currentList.filter(i => acquired.includes(i)).length / currentList.length) * 100) || 0;

  return (
    <div className="space-y-4 pb-8 animate-in fade-in duration-300">
      
      {/* Sub tabs */}
      <div className="flex rounded-lg overflow-hidden border border-cyan-900/50 bg-slate-900/50 p-1">
        <button 
          onClick={() => setActiveSubTab('monthly')}
          className={`flex-1 py-2 text-sm text-center rounded-md font-medium transition-all ${activeSubTab === 'monthly' ? 'bg-cyan-950/80 text-cyan-300 shadow-sm' : 'text-slate-500 hover:text-slate-300'}`}
        >
          Miesięczne Core
        </button>
        <button 
          onClick={() => setActiveSubTab('weekly')}
          className={`flex-1 py-2 text-sm text-center rounded-md font-medium transition-all ${activeSubTab === 'weekly' ? 'bg-cyan-950/80 text-cyan-300 shadow-sm' : 'text-slate-500 hover:text-slate-300'}`}
        >
          Tygodniowe Patches
        </button>
      </div>

      <div className="flex items-center justify-between px-2">
        <span className="text-xs text-slate-400 uppercase tracking-wider">Packages Loaded</span>
        <span className="text-xs text-cyan-400 font-mono font-bold">{progress}% [{currentList.filter(i => acquired.includes(i)).length}/{currentList.length}]</span>
      </div>

      <div className="cyber-panel divide-y divide-cyan-900/30">
        {currentList.map(item => {
          const isAcquired = acquired.includes(item);
          return (
            <div 
              key={item} 
              onClick={() => toggleItem(item)}
              className={`p-3 sm:p-4 flex items-center justify-between gap-3 cursor-pointer transition-colors hover:bg-slate-800/40 ${isAcquired ? 'opacity-50' : 'opacity-100'}`}
            >
              <div className="flex items-center gap-3">
                <div className={`w-5 h-5 shrink-0 rounded flex items-center justify-center border transition-all duration-200 ${isAcquired ? 'bg-cyan-600 border-cyan-500 text-slate-950' : 'border-slate-600 bg-slate-900'}`}>
                  {isAcquired && <Check strokeWidth={3} className="w-3.5 h-3.5" />}
                </div>
                <span className={`text-sm md:text-base transition-all duration-200 ${isAcquired ? 'line-through text-slate-500' : 'text-slate-200'}`}>
                  {item}
                </span>
              </div>
              <button 
                onClick={(e) => { e.stopPropagation(); /* external link logic */ }}
                className="text-slate-600 hover:text-cyan-400 p-1 transition-colors rounded-full"
                title="Wyszukaj produkt"
              >
                <ExternalLink className="w-4 h-4" />
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
}
