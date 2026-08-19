import { Info } from 'lucide-react';

/**
 * Zastrzeżenie wymagane przez politykę Google Play „Health Content and Services":
 * aplikacja nie jest wyrobem medycznym ORAZ przypomnienie o konsultacji z lekarzem.
 *
 * Jedno źródło tekstu — używane na ekranie aktywacji (jedyny ekran widoczny bez
 * kodu, więc widzi go też recenzent sklepu) oraz w module INCIDENT, który zbiera
 * tętno i saturację. Zmiana treści = zmiana w tym jednym miejscu.
 */
export function MedicalDisclaimer({ className = '' }: { className?: string }) {
  return (
    <div
      className={`flex items-start gap-2 rounded-lg border border-slate-800 bg-slate-950/60 px-3 py-2.5 ${className}`}
    >
      <Info className="w-3.5 h-3.5 text-slate-500 flex-shrink-0 mt-0.5" />
      <p className="text-[11px] leading-relaxed text-slate-500 text-justify">
        Aplikacja ma charakter wyłącznie edukacyjny i informacyjny. Nie jest wyrobem
        medycznym i nie służy do diagnozowania, leczenia ani zapobiegania chorobom.
        W sprawach zdrowia skonsultuj się z lekarzem lub innym wykwalifikowanym specjalistą.
      </p>
    </div>
  );
}
