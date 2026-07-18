import { useCallback, useState } from 'react';
import { czyAktywowano, cofnijAktywacje, WYMAGAJ_KODU_NA_WEJSCIU } from '../lib/access';

/**
 * Jedno źródło prawdy o dostępie.
 *
 * Faza 1: kod jest bramką wejściową, więc kto wszedł, ten ma pełną wersję.
 * Faza 2: po ustawieniu WYMAGAJ_KODU_NA_WEJSCIU = false aplikacja wpuszcza
 * każdego, a isPro dalej odpowiada na pytanie "czy ma wykupioną wersję" —
 * moduły PRO wystarczy wtedy owinąć warunkiem `isPro`.
 */
export function useAccess() {
  const [aktywowano, setAktywowano] = useState(czyAktywowano);

  const odswiez = useCallback(() => setAktywowano(czyAktywowano()), []);

  const wyloguj = useCallback(() => {
    cofnijAktywacje();
    setAktywowano(false);
  }, []);

  return {
    /** Czy użytkownik podał prawidłowy kod. */
    isActivated: aktywowano,
    /** Czy ma dostęp do modułów PRO. */
    isPro: aktywowano,
    /** Czy trzeba pokazać ekran aktywacji. */
    wymagaAktywacji: WYMAGAJ_KODU_NA_WEJSCIU && !aktywowano,
    odswiez,
    wyloguj,
  };
}
