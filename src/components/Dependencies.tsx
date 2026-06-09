import { useState } from 'react';
import { useLocalStorage } from '../hooks/useLocalStorage';
import { ExternalLink, Check, Sprout, Activity, Circle, Droplet, Hexagon, Leaf, Flame, Pill, Coffee, Package, TestTube, Wheat, Nut, Dna, LeafyGreen, Carrot, Container, Grape, Citrus, Egg, Bean, Hop, Beaker, Diamond, Zap } from 'lucide-react';
import { MONTHLY_CORE_DEPENDENCIES, WEEKLY_PATCHES_DEPENDENCIES } from '../data';

const BlueberryIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    {...props}
  >
    <circle cx="12" cy="7" r="4.5" />
    <path d="M12 6.5v1" />
    <path d="M11 7l2 0" />
    <circle cx="7" cy="15" r="4.5" />
    <path d="M7 14.5v1" />
    <path d="M6 15l2 0" />
    <circle cx="17" cy="15" r="4.5" />
    <path d="M17 14.5v1" />
    <path d="M16 15l2 0" />
  </svg>
);

const getDepIcon = (name: string) => {
  const n = name.toLowerCase();
  
  if (n.includes("kasza") || n.includes("gryczana") || n.includes("komosa")) return Wheat;
  if (n.includes("siemię") || n.includes("chia") || n.includes("pestki") || n.includes("słonecznik")) return Sprout;
  if (n.includes("orzech") || n.includes("migdały")) return Nut;
  if (n.includes("olej") || n.includes("oliwa")) return Droplet;
  if (n.includes("pyłek") || n.includes("miód")) return Hexagon;
  if (n.includes("kakao")) return Bean;
  if (n.includes("szałwia") || n.includes("melisa") || n.includes("krwawnik")) return Leaf;
  if (n.includes("chmiel")) return Hop;
  if (n.includes("cynamon") || n.includes("kardamon") || n.includes("pieprz")) return Flame;
  if (n.includes("sól")) return Diamond;
  if (n.includes("ocet")) return Beaker;
  if (n.includes("magnez") || n.includes("witamina") || n.includes("omega") || n.includes("kreatyna") || n.includes("adaptogeny") || n.includes("kurkumina")) return Pill;
  if (n.includes("kawa") || n.includes("matcha")) return Coffee;
  if (n.includes("brokuły") || n.includes("kalafior") || n.includes("kapusta") && !n.includes("kiszonki") || n.includes("szpinak") || n.includes("jarmuż") || n.includes("rukola")) return LeafyGreen;
  if (n.includes("buraki") || n.includes("marchew") || n.includes("pietruszka") || n.includes("seler")) return Carrot;
  if (n.includes("kiszonki") || n.includes("zakwas")) return Container;
  if (n.includes("borówka")) return BlueberryIcon;
  if (n.includes("cytryn")) return Citrus;
  if (n.includes("awokado")) return Egg;
  if (n.includes("czosnek") || n.includes("cebula")) return Circle;
  if (n.includes("imbir") || n.includes("kurkuma")) return Zap;
  
  return Package;
};

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
          const Icon = getDepIcon(item);
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
                <div className="flex items-center gap-3">
                  <Icon className={`w-4 h-4 ${isAcquired ? 'text-slate-500' : 'text-cyan-400'}`} />
                  <span className={`text-sm md:text-base transition-all duration-200 ${isAcquired ? 'line-through text-slate-500' : 'text-slate-200'}`}>
                    {item}
                  </span>
                </div>
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
