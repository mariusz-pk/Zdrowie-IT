// Kontrola po edycji (CLAUDE.md, sekcja „Komendy”). PostToolUse na Edit/Write/MultiEdit.
//
// - .ts/.tsx           -> tsc --noEmit (to samo co `npm run lint`)
// - konfiguracja Firebase -> scripts/check-firebase-config.mjs (to samo co `npm run rules:check`)
// - firestore.rules    -> dodatkowo przypomnienie, ze zmiana w repo nie jest jeszcze wdrozona
//
// Bledy kontroli wracaja do Claude'a jako decision=block (edycja zostaje, Claude ma ja poprawic).
// Bledy samego skryptu albo brak node_modules = przepuszczenie. Hook ma pilnowac, nie blokowac pracy.

import { spawnSync } from 'node:child_process';
import { existsSync } from 'node:fs';
import { join } from 'node:path';

const PROJEKT = process.env.CLAUDE_PROJECT_DIR || process.cwd();
const TSC = join(PROJEKT, 'node_modules', 'typescript', 'bin', 'tsc');
const KONFIG_FIREBASE = /(^|\/)(firestore\.rules|firebase\.json|\.firebaserc|firebase-applet-config\.json)$/;
const MAX_ZNAKOW = 4000;

function uruchom(args) {
  const w = spawnSync(process.execPath, args, { cwd: PROJEKT, encoding: 'utf8', timeout: 80_000 });
  return { ok: w.status === 0, wyjscie: `${w.stdout ?? ''}${w.stderr ?? ''}`.trim() };
}

function zakoncz(wynik) {
  process.stdout.write(JSON.stringify(wynik));
  process.exit(0);
}

let wejscie = '';
process.stdin.on('data', (c) => (wejscie += c));
process.stdin.on('end', () => {
  let sciezka;
  try {
    sciezka = String(JSON.parse(wejscie).tool_input?.file_path ?? '').replace(/\\/g, '/');
  } catch {
    process.exit(0);
  }
  if (!sciezka || sciezka.includes('/node_modules/')) process.exit(0);

  if (/\.tsx?$/.test(sciezka)) {
    if (!existsSync(TSC)) process.exit(0); // brak `npm install` — nie ma czym sprawdzic
    const { ok, wyjscie } = uruchom([TSC, '--noEmit']);
    if (!ok) {
      zakoncz({
        decision: 'block',
        reason: `tsc --noEmit zgłasza błędy po edycji ${sciezka}. Popraw je przed dalszą pracą:\n\n${wyjscie.slice(0, MAX_ZNAKOW)}`,
      });
    }
    process.exit(0);
  }

  if (KONFIG_FIREBASE.test(sciezka)) {
    const { ok, wyjscie } = uruchom([join(PROJEKT, 'scripts', 'check-firebase-config.mjs')]);
    if (!ok) {
      zakoncz({
        decision: 'block',
        reason: `rules:check: konfiguracja wdrożenia nie zgadza się z aplikacją po edycji ${sciezka}:\n\n${wyjscie.slice(0, MAX_ZNAKOW)}`,
      });
    }
    if (sciezka.endsWith('firestore.rules')) {
      zakoncz({
        hookSpecificOutput: {
          hookEventName: 'PostToolUse',
          additionalContext:
            'firestore.rules zmienione tylko w repo — działająca aplikacja nadal ma stare reguły. ' +
            'Wdrożenie: `npm run rules:deploy`, wyłącznie na wyraźną prośbę właściciela. ' +
            'Po wdrożeniu właściciel musi sprawdzić zapis w aplikacji (odznaczyć nawyk, przeładować).',
        },
      });
    }
  }
  process.exit(0);
});
