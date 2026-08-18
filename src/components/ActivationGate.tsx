import { useState, FormEvent } from 'react';
import { KeyRound, Loader2, ShieldCheck } from 'lucide-react';
import { aktywujKodem, normalizujKod } from '../lib/access';
import { MedicalDisclaimer } from './MedicalDisclaimer';

export function ActivationGate({ onActivated }: { onActivated: () => void }) {
  const [kod, setKod] = useState('');
  const [blad, setBlad] = useState('');
  const [sprawdzanie, setSprawdzanie] = useState(false);

  const wyslij = async (e: FormEvent) => {
    e.preventDefault();
    if (sprawdzanie || kod.trim() === '') return;

    setSprawdzanie(true);
    setBlad('');

    const ok = await aktywujKodem(kod);
    if (ok) {
      onActivated();
      return;
    }

    setBlad('Kod nieprawidłowy. Sprawdź, czy przepisałeś go dokładnie.');
    setSprawdzanie(false);
  };

  return (
    <div className="min-h-[100dvh] bg-slate-950 text-slate-50 font-sans flex flex-col items-center justify-center p-6 md:max-w-md md:mx-auto">
      {/* Bez animacji wejścia sterowanej JS: gdyby nie wystartowała, ekran zostałby
          przezroczysty i klient nie miałby jak wpisać kodu. */}
      <div className="w-full space-y-6">
        <div className="flex flex-col items-center text-center space-y-3">
          <div className="p-3 bg-slate-900 border border-cyan-900/50 rounded-xl">
            <KeyRound className="w-7 h-7 text-cyan-400" />
          </div>
          <h1 className="text-xl font-bold tracking-widest text-slate-200 uppercase font-mono">
            IT Health <span className="text-cyan-500">v2.0</span>
          </h1>
          <p className="text-sm text-slate-400">
            Wpisz kod dostępu, który otrzymałeś przy zakupie.
          </p>
        </div>

        <form onSubmit={wyslij} className="cyber-panel p-6 space-y-4">
          <label htmlFor="kod-dostepu" className="block text-[10px] uppercase tracking-widest text-cyan-600 font-mono">
            Kod dostępu
          </label>

          <input
            id="kod-dostepu"
            type="text"
            inputMode="text"
            autoCapitalize="characters"
            autoComplete="off"
            spellCheck={false}
            value={kod}
            onChange={(e) => {
              setKod(normalizujKod(e.target.value));
              if (blad) setBlad('');
            }}
            placeholder="ITH-XXXX-XXXX-XXXX"
            disabled={sprawdzanie}
            className="cyber-input w-full px-4 py-3 text-center text-lg font-mono tracking-widest disabled:opacity-60"
          />

          {blad && (
            <p role="alert" className="text-sm text-red-400 text-center">
              {blad}
            </p>
          )}

          <button
            type="submit"
            disabled={sprawdzanie || kod.trim() === ''}
            className="w-full py-3 bg-cyan-900/50 hover:bg-cyan-800/50 border border-cyan-800 text-white rounded-lg font-bold font-mono tracking-widest uppercase transition-colors disabled:opacity-40 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            {sprawdzanie ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                Sprawdzam
              </>
            ) : (
              'Aktywuj'
            )}
          </button>

          <p className="text-[11px] text-slate-500 text-center flex items-center justify-center gap-1.5 pt-1">
            <ShieldCheck className="w-3.5 h-3.5 flex-shrink-0" />
            Kod podajesz raz — aplikacja zapamięta aktywację.
          </p>
        </form>

        <MedicalDisclaimer />

        <p className="text-[10px] text-slate-600 tracking-wider uppercase text-center">
          by WszystkokolwiekWFormie
        </p>
      </div>
    </div>
  );
}
