// Pilnuje, by konfiguracja wdrozenia celowala w te sama baze, ktorej uzywa aplikacja.
//
// Aplikacja laczy sie z NAZWANA baza Firestore, nie z '(default)'. Gdyby
// firebase.json wskazywal inna baze, `firebase deploy` opublikowalby reguly
// w bazie, ktorej aplikacja nigdy nie dotyka — i zakonczyl sie sukcesem.
// Prawdziwe reguly pozostalyby niezmienione, a blad bylby niewidoczny.

import { readFileSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const katalog = join(dirname(fileURLToPath(import.meta.url)), '..');
const wczytaj = (plik) => JSON.parse(readFileSync(join(katalog, plik), 'utf8'));

const aplikacja = wczytaj('firebase-applet-config.json');
const wdrozenie = wczytaj('firebase.json');
const projekty = wczytaj('.firebaserc');

const cele = Array.isArray(wdrozenie.firestore) ? wdrozenie.firestore : [wdrozenie.firestore];
const bazy = cele.map((c) => c?.database);
const bledy = [];

if (!bazy.includes(aplikacja.firestoreDatabaseId)) {
  bledy.push(
    `firebase.json celuje w baze [${bazy.join(', ')}], a aplikacja uzywa '${aplikacja.firestoreDatabaseId}'.\n` +
      `   Wdrozenie trafiloby do niewlasciwej bazy i nie zmienilo nic w dzialajacej aplikacji.`,
  );
}

if (projekty.projects?.default !== aplikacja.projectId) {
  bledy.push(
    `.firebaserc wskazuje projekt '${projekty.projects?.default}', a aplikacja uzywa '${aplikacja.projectId}'.`,
  );
}

if (bledy.length > 0) {
  console.error('Konfiguracja wdrozenia nie zgadza sie z konfiguracja aplikacji:\n');
  bledy.forEach((b) => console.error(` - ${b}`));
  process.exit(1);
}

console.log(`OK  projekt ${aplikacja.projectId}, baza ${aplikacja.firestoreDatabaseId}`);
