import { ACCESS_CODE_HASHES } from './accessCodes';

// Parametry muszą być identyczne z scripts/generate-codes.mjs.
const SALT = 'IT-Health-v2-access-2026';
const ITERACJE = 150_000;

const KLUCZ_AKTYWACJI = 'v2_access_activated';
const KLUCZ_KODU = 'v2_access_code_hash';

/**
 * Faza 1: wejście do aplikacji wymaga kodu, a każdy kto wszedł ma pełną wersję.
 *
 * Faza 2 (LITE/PRO): ustaw na false. Aplikacja wpuści wtedy każdego, a kod
 * będzie przełączał wyłącznie isPro — moduły PRO wystarczy owinąć warunkiem.
 * Poza tą stałą nic więcej nie trzeba zmieniać.
 */
export const WYMAGAJ_KODU_NA_WEJSCIU = true;

/** Sprowadza to, co wpisał użytkownik, do postaci kanonicznej ITH-XXXX-XXXX-XXXX. */
export function normalizujKod(wejscie: string): string {
  const znaki = wejscie.toUpperCase().replace(/[^A-Z0-9]/g, '');
  const bezPrefiksu = znaki.startsWith('ITH') ? znaki.slice(3) : znaki;
  const grupy = bezPrefiksu.match(/.{1,4}/g) ?? [];
  return `ITH-${grupy.join('-')}`;
}

async function hashKodu(kod: string): Promise<string> {
  const enc = new TextEncoder();
  const klucz = await crypto.subtle.importKey('raw', enc.encode(kod), 'PBKDF2', false, ['deriveBits']);
  const bity = await crypto.subtle.deriveBits(
    { name: 'PBKDF2', salt: enc.encode(SALT), iterations: ITERACJE, hash: 'SHA-256' },
    klucz,
    256,
  );
  return [...new Uint8Array(bity)].map((b) => b.toString(16).padStart(2, '0')).join('');
}

/** Weryfikuje kod i przy powodzeniu trwale zapisuje aktywację. */
export async function aktywujKodem(wejscie: string): Promise<boolean> {
  const kod = normalizujKod(wejscie);
  const hash = await hashKodu(kod);
  if (!ACCESS_CODE_HASHES.includes(hash)) return false;

  try {
    localStorage.setItem(KLUCZ_AKTYWACJI, 'true');
    localStorage.setItem(KLUCZ_KODU, hash);
  } catch {
    // Tryb prywatny bez dostępu do localStorage — aktywacja zadziała do końca sesji.
  }
  return true;
}

export function czyAktywowano(): boolean {
  try {
    return localStorage.getItem(KLUCZ_AKTYWACJI) === 'true';
  } catch {
    return false;
  }
}

export function cofnijAktywacje(): void {
  try {
    localStorage.removeItem(KLUCZ_AKTYWACJI);
    localStorage.removeItem(KLUCZ_KODU);
  } catch {
    // brak dostępu do localStorage — nic do zrobienia
  }
}
