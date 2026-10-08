# Zdrowie-IT (IT Health v2.0) — instrukcje dla Claude Code

PWA (React 19 + TypeScript + Vite 6 + Tailwind 4) z linii „Zdrowie w IT” marki Wszystkokolwiek.
Publikowana w Google Play jako TWA. Logowanie i synchronizacja: Firebase (Auth + Firestore).
Szczegóły architektury: `DOKUMENTACJA_TECHNICZNA.md`. Opis funkcji: `OPIS_DZIALANIA_APLIKACJI.md`.
Kontekst nadrzędny środowiska: `D:\Claude_Env\CLAUDE.md`.

## Komendy

```
npm run dev            # serwer deweloperski, port 3000
npm run build          # build produkcyjny (generuje też Service Worker i manifest)
npm run lint           # tsc --noEmit — jedyna automatyczna kontrola kodu, testów nie ma
npm run rules:check    # zgodność firebase.json z bazą, której używa aplikacja
npm run rules:deploy   # sprawdzian + publikacja reguł Firestore — tylko na wyraźną prośbę
```

Przed commitem zmian w `src/` uruchom `npm run lint`.

## Sekrety — repozytorium jest PUBLICZNE

- **Kody dostępu w postaci jawnej nigdy nie trafiają do repo.** W repo są wyłącznie hashe
  w `src/lib/accessCodes.ts`, a ten plik zmienia tylko generator:
  `node scripts/generate-codes.mjs <ile> <etykieta>`. Nie edytuj go ręcznie.
- Kody jawne leżą poza repo, w `D:\Claude_Env\produkty\zdrowie-it\kody-dostepu\`.
- `.env*` (poza `.env.example`), `kody-*.csv`, `kody-dostepu/` — nie czytaj, nie edytuj,
  nie dodawaj do gita (żadnego `git add -f`).
- Pilnuje tego hook `.claude/hooks/chron-sekrety.mjs` (PreToolUse). Hook przypomina —
  nie zastępuje ostrożności.

## Rzeczy, które łatwo zepsuć

- **Pliki binarne (PNG/JPG).** Edytor Google AI Studio zapisywał je jako tekst UTF-8 i nieodwracalnie
  niszczył (mojibake). Nigdy nie twórz ani nie zapisuj obrazów narzędziem do tekstu. Ikony odtwarza
  `node fix-icons.js`. CI (`weryfikacja-obrazow.yml`) sprawdza sygnatury przy każdym pushu.
- **Nazwana baza Firestore**, nie `(default)`. Identyfikator w `firebase.json` musi zgadzać się
  z `firebase-applet-config.json` — inaczej deploy reguł „uda się” na złej bazie.
  Zmiana `firestore.rules` w repo nic nie zmienia w działającej aplikacji, dopóki reguł nie wdrożysz.
- **Identyfikatory nie do zmiany po publikacji:** `manifest.id` (`/?app=ithealth` w `vite.config.ts`)
  i Package ID `pl.wszystkokolwiek.ithealth`. Zmiana = utrata aktualizacji u użytkowników
  albo nowa pozycja w sklepie.
- **`public/.well-known/assetlinks.json`** musi zawierać wszystkie klucze podpisujące (TWA).
- **Wymogi Google Play:** zastrzeżenie medyczne (`MedicalDisclaimer.tsx`), `public/prywatnosc.html`,
  `public/usuniecie-konta.html`. Nie usuwaj i nie ukrywaj.
- **Bramka dostępu** (`src/lib/access.ts`): `SALT` i `ITERACJE` muszą być identyczne
  z `scripts/generate-codes.mjs` — zmiana unieważnia wszystkie sprzedane kody.

## Zasady pracy

- `main` jest chroniony — zmiany tylko przez pull request z zielonym checkiem `sygnatury`.
- Prostota i chirurgiczne zmiany; bez nowych zależności bez pytania
  (pełna wersja: `D:\Claude_Env\.claude\rules\kod-aplikacji.md`).
- Przy większych zmianach: najpierw plan, akceptacja, dopiero potem edycja.
- Pozostałości szablonu AI Studio (`@google/genai`, `express`, `GEMINI_API_KEY` w `.env.example`)
  nie są używane przez aplikację — zgłoś, nie usuwaj bez pytania.
