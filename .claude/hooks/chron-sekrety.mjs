// Straznik sekretow (CLAUDE.md, sekcja „Sekrety”). PreToolUse.
//
// - Edit/Write/MultiEdit/NotebookEdit na sekretach lub na src/lib/accessCodes.ts -> deny.
// - Read/Grep/Glob na sekretach -> deny (tresc trafilaby do kontekstu modelu).
// - Bash/PowerShell wspominajacy sekret albo `git add -f` -> ask (pytanie do wlasciciela).
//
// Kazdy blad skryptu = przepuszczenie w normalny tryb uprawnien. Hook ma chronic, nie blokowac pracy.

const SEKRET = [
  /(^|\/)\.env(\.[^/]+)?$/i, // .env, .env.local, .env.production...
  /(^|\/)kody-[^/]*\.csv$/i,
  /(^|\/)kody-dostepu(\/|$)/i,
];
const TYLKO_GENERATOR = /(^|\/)src\/lib\/accessCodes\.ts$/;

const jestSekretem = (p) => !/(^|\/)\.env\.example$/i.test(p) && SEKRET.some((r) => r.test(p));

// W poleceniu: .env (bez .env.example), kody-*.csv, kody-dostepu
const SEKRET_W_POLECENIU = [
  /(^|[\s"'=\/\\])\.env(?!\.example)(\.[\w.-]+)?(?=$|[\s"';|&>)])/i,
  /kody-[\w.-]*\.csv/i,
  /kody-dostepu/i,
];
const WYMUSZONY_ADD = /\bgit\s+add\b[^;&|]*\s(-f|--force)\b/;

function odpowiedz(decyzja, powod) {
  process.stdout.write(JSON.stringify({
    hookSpecificOutput: {
      hookEventName: 'PreToolUse',
      permissionDecision: decyzja,
      permissionDecisionReason: powod,
    },
  }));
  process.exit(0);
}

let wejscie = '';
process.stdin.on('data', (c) => (wejscie += c));
process.stdin.on('end', () => {
  let narzedzie, dane;
  try {
    ({ tool_name: narzedzie, tool_input: dane = {} } = JSON.parse(wejscie));
  } catch {
    process.exit(0);
  }

  if (narzedzie === 'Bash' || narzedzie === 'PowerShell') {
    const polecenie = String(dane.command ?? '');
    if (WYMUSZONY_ADD.test(polecenie)) {
      odpowiedz('ask', '`git add -f` omija .gitignore — w tym repo (publicznym) to droga do wycieku kodów lub .env. Zatwierdź tylko, jeśli wiesz, co dodajesz.');
    }
    if (SEKRET_W_POLECENIU.some((r) => r.test(polecenie))) {
      odpowiedz('ask', 'Polecenie dotyka sekretów (.env, kody-*.csv lub kody-dostepu). Repo jest publiczne, a treść trafi do kontekstu modelu. Zatwierdź tylko, jeśli to zamierzone.');
    }
    process.exit(0);
  }

  const sciezka = String(dane.file_path ?? dane.notebook_path ?? dane.path ?? dane.pattern ?? '').replace(/\\/g, '/');
  if (!sciezka) process.exit(0);

  if (jestSekretem(sciezka)) {
    odpowiedz('deny', `Zablokowane: ${sciezka} to sekret (CLAUDE.md, sekcja „Sekrety”). Kody jawne i .env nie mogą trafić do kontekstu ani do publicznego repo.`);
  }
  if (['Edit', 'Write', 'MultiEdit', 'NotebookEdit'].includes(narzedzie) && TYLKO_GENERATOR.test(sciezka)) {
    odpowiedz('deny', 'src/lib/accessCodes.ts zmienia wyłącznie generator: node scripts/generate-codes.mjs <ile> <etykieta>. Ręczna edycja może unieważnić sprzedane kody.');
  }
  process.exit(0);
});
