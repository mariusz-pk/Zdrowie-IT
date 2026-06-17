# DOKUMENTACJA TECHNICZNA: IT Health V2.0 by WszystkokolwiekWFormie

## 1. Stos Technologiczny
Aplikacja została zbudowana w oparciu o nowoczesny, frontendowy stos technologiczny:
- **Framework:** React 19 (z włączonym StrictMode)
- **Język:** TypeScript (ES2022)
- **Bundler:** Vite
- **Styling:** Tailwind CSS (v4) - wyłączne wykorzystanie klas użytkowych oraz dyrektyw `@theme`.
- **Animacje:** Motion (fka Framer Motion) - `motion/react` do płynnych przejść i animowanych komponentów.
- **Ikony:** Lucide React (`lucide-react`).
- **PWA (Progressive Web App):** Aplikacja spełniająca standardy PWA z plikiem `manifest.json` oraz podstawowym uwierzytelnieniem pobierania Offline (Service Worker). 

## 2. Architektura Aplikacji
Aplikacja działa w trybie Single Page Application (SPA), a jej głównym kontenerem jest komponent `App.tsx`, przełączający zakładki na podstawie stanu wbudowanego routingu (zmienna `activeTab`). Interfejs jest zamknięty w maksymalnej szerokości `max-w-md` w celu wymuszenia formatu stricte mobilnego nawet na desktopie.

### 2.1 Struktura katalogów
- `/src/App.tsx` - Główny widok integrujący wszystkie moduły.
- `/src/components/` - Katalog zawierający wszystkie główne ekrany (moduły funkcyjne).
- `/src/hooks/` - Niestandardowe hooki React (szczególnie warstwa abstrakcji do `localStorage`).
- `/src/data.ts` - Statyczna baza danych zawierająca definicje produktów, receptur eliksirów oraz wskazówek.
- `/public/` - Zasoby publiczne aplikacji (Service Worker, Manifest PWA, pliki graficzne).

## 3. Zarządzanie Stanem danych (Local state engine)
Aplikacja zachowuje postępy sesyjne oraz długoterminowe całkowicie po stronie klienta, korzystając z interfejsu przeglądarki Web Storage API (`localStorage`). 

Za zapis odpowiada niestandardowy hook `useLocalStorage.ts`. Gwarantuje on reaktywne aktualizowanie interfejsu (poprzez synchronizację z `useState`) w momencie modyfikacji danych.

### 3.1 Modele Danych i Klucze Pamięci
1. **`v2_dailyCronHistory_v2`** - (Time-Series State Management): Obiekt, którego kluczami są daty systemowe w formacie `YYYY-MM-DD`. Przechowuje dzienny ranking dla zakładek "DAILY CRON" (zaznaczone sekwencje, ustawiona energia i jakość snu). Jeżeli uruchomiony zostaje nowy dzień, generuje się nowy, pusty obiekt.
2. **`v2_acquiredDeps`** - Tablica stringów przetrzymująca kupione produkty z zakładki DEPENDENCIES.
3. **`v2_incidentLogs`** - Tablica obiektów `TelemetryLog` (ID rekordu, Data zapisu, RHR, SpO2, tablica wyłapanych Symptomów). Logi są układane od najnowszego (prepend).

## 4. Architektura Komponentów i Modułów

### 4.1 DailyCron (`/src/components/DailyCron.tsx`)
- Oblicza na żywo wskaźnik "System Stability Score". Zmieniając wartości stanów Boolean (checkboxy) lub liczbowych (suwaki), na podstawie useEffect wyliczany jest docelowy Score w skali od 0 do 100%. Wykres progressu bazuje na parametrze `strokeDashoffset` natywnego SVG.
- Posiada ulepszone pola wprowadzania danych (np. konfigurowalny "Dzienny limit kroków" wykorzystujący manualny przycisk zapisu/potwierdzenia). Wszelkie zmiany potwierdzane wizualnie komunikatem 'Zapisano' poprawiają interaktywność i UX użytkownika.
- Posiada mechanikę odczytywania historycznych dni.

### 4.2 Dependencies (`/src/components/Dependencies.tsx`)
- Posiada zagnieżdżoną logikę SubTabów (Monthly/Weekly).
- Implementuje procentowy pasek progresu zebranych zasobów na podstawie przecięcia elementów w tablicy stanu z pełnymi listami w `data.ts`.
- Automatycznie dopasowuje tematyczne ikony z biblioteki `lucide-react` (oraz niestandardowe ikony SVG, np. dla borówki) na podstawie zawartości tekstu z podziałem na szczegółowe grupy (np. kiszonki, owoce, awokado, kurkuma, imbir).
- Oddzielne rozpoznanie wystąpień dla imbiru i kurkumy w celu nadania osobnych wyróżnień wizualnych.

### 4.3 RuntimeElixirs (`/src/components/RuntimeElixirs.tsx`)
- Wdraża komponent `HydrationLogger` wyposażony we własny lokalny stan operujący logowaniem wypitej wody, konfigurowalnym celem dziennym (odblokowane wprowadzanie tekstowe w granicach 0 - 9000 ml dostępne po wciśnięciu 'Zmień cel' – proces zatwierdzany przyciskiem) oraz tablicą zapisującą historię dodawania ostatnich wpisów nawodnienia.
- Grupuje listę receptur (`RUNTIME_ELIXIRS`) na 4 odrębne kategorie czasowe na podstawie pola `category`, z dedykowanymi ikonami i kolorystyką dla każdego bloku oznaczających inną porę dnia. Receptury napojów roślinnych otrzymały uściślenie w postaci dopisku o rekomendowanym użyciu "(mleko A2 bio)" ze źródła bazy (`data.ts`).
- Renderuje dynamiczny, reagujący na interakcję akordeon na bazie komponentu z `motion`. Pole instrukcji zostało skonfigurowane z użyciem klasy `text-justify` (Tailwind), zapewniając równe marginesy tekstu z lewej i prawej strony.
- Zawiera wbudowany moduł zliczania czasu (klasa `BrewTimer`) wywołująca pętlę asynchroniczną przypisaną do instancji lokalnego okna (timer `setInterval(..., 1000)`). Po osiągnięciu 0:00 wywołuje natywne wibracje urządzenia (dzięki API `navigator.vibrate()`).

### 4.4 IncidentResponse (`/src/components/IncidentResponse.tsx`)
- Kalkuluje na żywo (bezpośrednie mapowanie) alertów telemetrii po zapisaniu interwencji (wielostanowa flaga).
- Posiada wyrównane kontrolki wejścia (tętno spoczynkowe ułożone na równej linii z saturacją poprzez flex z uwarunkowaniem `mt-auto`), wymuszające spójne ułożenie na wspólnym horyzoncie niezależnie od długości treści etykiet tekstowych.
- Warunkowo formatuje alerty:
  - Zagrożeniowe: Serce > 80 BPM (`text-rose-500`).
  - Optymalne: 40-80 BPM (`text-emerald-500`).
  - Ostrzeżenia: Saturacja < 95% (`text-amber-500`).

### 4.5 Analytics (`/src/components/Analytics.tsx`)
- Widok agregacyjny (System Analytics) przetwarzający postępy zadeklarowane w module `DailyCron`.
- Renderuje dynamiczny wykres słupkowy na podstawie pełnej historii (od pierwszego wprowadzonego dnia). Wykres generuje widok w oparciu o stan `chartData` i posiada funkcje przesuwania poziomego (scroll) oraz stałą (sticky) oś Y.
- Wykres wyświetla na bieżąco uzyskane wyniki procentowe nad szczytami słupków dla lepszej czytelności.
- Prezentuje "Raport: Ostatnie 30 dni", na który składają się średni zadeklarowany wynik score, odnotowana ciągłość używania (Consistency), średnia zgłoszona moc procesora (Energia) oraz downtime (Jakość Snu).
- Rozbija poszczególne zadania procesów zadeklarowane na przestrzeni 30 dni - wyliczając procentowe wskaźniki pomyślności wykonania operacji, na przykład Poranny Izotonik czy ilość zarejestrowanych kroków średnio na dobę.

## 5. Integracje z Chmurą (Cloud)
Moduł uwierzytelniania zlokalizowany w `/src/components/Integrations.tsx` oraz procesy bazodanowe dystrybuowane poprzez `/src/hooks/useCloudSync.ts`.
- **Firebase Auth:**  Zaimplementowano bezpieczne uwierzytelnianie użytkowników opierające się na dostawcy Google OAuth (Sign in with Google), likwidujące uciążliwe limity dostępu (np. limit 99 osób w testowym Google Drive API) i prośby o restrykcyjne dostępy dla uprawnień dyskowych.
- **Firebase / Firestore:** Asynchroniczna i w pełni automatyczna synchronizacja parametrów historii `v2_dailyCronHistory_v2` w tle za pośrednictwem hooka `useCloudSync`. Tworzy połączony most z platformą Cloud ubezpieczając lokalny `localStorage`.

## 6. Powiadomienia Systemowe (Browser Notifications API)
- W module integracji umieszczono zarządzanie stanami uprawnień dla technologii powiadomień. Przy aktywowaniu opcji, aplikacja dokonuje odpytania "requestPermission()" na obiekcie natywnym `Notification`. Zapewnia to natywny format informowania na poziomie Operating System (komputera bądź Smartfona).
- Sprawdzacz stanu (poller umieszczony w sercu rutera aplikacji) odpytuje o nieukończone na dany dzień procesy i wysyła zaplanowane komunikaty (przypomnienia o rutynie) dbając również o stan wstrzymania dla Visibility API. Zmiana widoczności ekranu ("visibilitychange") błyskawicznie re-uruchamia serwisy powiadomień. 

## 7. Standardy PWA i Integracja
- Aplikacja posiada plik `/public/manifest.json` z określeniem parametrów mobilnych (`display: 'standalone'`, `orientation: 'portrait'`). Zmieniono w nim nazwę z 'IT Health v2.0' na 'IT Health V2.0 by WszystkokolwiekWFormie', co przełoży się na tytuł ikony na ekranie głównym. Oznacza to, że zainstalowana na urządzeniu wymusza brak "chrome'u" okna przeglądarki.
- Podłączony jest `sw.js` (Service Worker) zapewniający prostą strategię Network-First chroniącą przed całkowitym brakiem odpowiedzi podczas chwilowych utrat połączenia sieciowego.
- Globalny `index.html` posiada tagi przystosowane do web-aplikacji nadające kompatybilność urządzeniom obsługiwanym przez iOS (`apple-mobile-web-app-capable`).
