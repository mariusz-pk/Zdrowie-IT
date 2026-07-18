// Generator partii kodów dostępu.
//
// Uruchomienie:  node scripts/generate-codes.mjs [ile] [etykieta]
// Przyklad:      node scripts/generate-codes.mjs 200 partia-01
//
// Do repozytorium trafiaja WYLACZNIE hashe (src/lib/accessCodes.ts).
// Kody jawne laduja poza repo, w D:\Claude_Env\docs\kody-dostepu\ — repo jest
// publiczne, wiec lista kodow w repo byla by widoczna dla kazdego.

import { webcrypto as crypto } from 'node:crypto';
import { mkdirSync, writeFileSync, existsSync, readFileSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const KATALOG_PROJEKTU = join(dirname(fileURLToPath(import.meta.url)), '..');
const PLIK_HASHY = join(KATALOG_PROJEKTU, 'src', 'lib', 'accessCodes.ts');
const KATALOG_KODOW = 'D:\\Claude_Env\\docs\\kody-dostepu';

// Bez znaków mylących przy przepisywaniu: I, O, 0, 1.
const ALFABET = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
const GRUP = 3;
const ZNAKOW_W_GRUPIE = 4;

const ile = Number(process.argv[2] ?? 200);
const etykieta = process.argv[3] ?? new Date().toISOString().slice(0, 10);

// Parametry muszą być identyczne z src/lib/access.ts, inaczej kody nie przejdą.
const SALT = 'IT-Health-v2-access-2026';
const ITERACJE = 150_000;

async function hashKodu(kod) {
  const enc = new TextEncoder();
  const klucz = await crypto.subtle.importKey('raw', enc.encode(kod), 'PBKDF2', false, ['deriveBits']);
  const bity = await crypto.subtle.deriveBits(
    { name: 'PBKDF2', salt: enc.encode(SALT), iterations: ITERACJE, hash: 'SHA-256' },
    klucz,
    256,
  );
  return [...new Uint8Array(bity)].map((b) => b.toString(16).padStart(2, '0')).join('');
}

function losowyKod() {
  const bajty = new Uint8Array(GRUP * ZNAKOW_W_GRUPIE);
  crypto.getRandomValues(bajty);
  const znaki = [...bajty].map((b) => ALFABET[b % ALFABET.length]);
  const grupy = [];
  for (let i = 0; i < GRUP; i++) {
    grupy.push(znaki.slice(i * ZNAKOW_W_GRUPIE, (i + 1) * ZNAKOW_W_GRUPIE).join(''));
  }
  return `ITH-${grupy.join('-')}`;
}

// Dotychczasowe hashe zostaja — kolejne partie dopisujemy, zeby nie uniewaznic
// kodow juz sprzedanych.
function wczytajIstniejaceHashe() {
  if (!existsSync(PLIK_HASHY)) return [];
  return [...readFileSync(PLIK_HASHY, 'utf8').matchAll(/'([0-9a-f]{64})'/g)].map((m) => m[1]);
}

const istniejace = wczytajIstniejaceHashe();
const kody = new Set();
while (kody.size < ile) kody.add(losowyKod());

const nowe = [];
for (const kod of kody) nowe.push({ kod, hash: await hashKodu(kod) });

const wszystkieHashe = [...new Set([...istniejace, ...nowe.map((n) => n.hash)])];

writeFileSync(
  PLIK_HASHY,
  `// PLIK GENEROWANY — nie edytuj recznie.
// Zrodlo: scripts/generate-codes.mjs
//
// Zawiera wylacznie hashe PBKDF2-SHA256 kodow dostepu. Kodow jawnych tu nie ma
// i byc nie moze: repozytorium jest publiczne.

export const ACCESS_CODE_HASHES: readonly string[] = [
${wszystkieHashe.map((h) => `  '${h}',`).join('\n')}
];
`,
  'utf8',
);

mkdirSync(KATALOG_KODOW, { recursive: true });
const plikKodow = join(KATALOG_KODOW, `kody-${etykieta}.csv`);
writeFileSync(
  plikKodow,
  ['kod,partia,wygenerowano', ...nowe.map((n) => `${n.kod},${etykieta},${new Date().toISOString()}`)].join('\n') + '\n',
  'utf8',
);

console.log(`Wygenerowano ${nowe.length} kodow (partia: ${etykieta}).`);
console.log(`  hashe w repo:  src/lib/accessCodes.ts (lacznie ${wszystkieHashe.length})`);
console.log(`  kody jawne:    ${plikKodow}  <-- NIE commituj`);
console.log(`\n  Przyklad: ${nowe[0].kod}`);
