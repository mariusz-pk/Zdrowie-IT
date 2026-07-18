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
- `/src/lib/` - Warstwa integracji zewnętrznych i logiki niezwiązanej z widokiem (`auth.ts` — Firebase, `access.ts` — weryfikacja kodów dostępu, `accessCodes.ts` — wygenerowane hashe).
- `/src/data.ts` - Statyczna baza danych zawierająca definicje produktów, receptur eliksirów oraz wskazówek.
- `/public/` - Zasoby publiczne aplikacji (Service Worker, Manifest PWA, pliki graficzne).
- `/scripts/` - Narzędzia uruchamiane ręcznie, poza procesem budowania (generator kodów dostępu).

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
- Posiada ulepszone pola wprowadzania danych (np. konfigurowalny "Dzienny limit kroków" wykorzystujący manualny przycisk zapisu/potwierdzenia). Wszelkie zmiany potwierdzane wizualnie komunikatem 'Zapisano' (odpowiednio wypozycjonowanym jako tooltip nad polem edycji kroków) poprawiają interaktywność i jasno wskazują powiązane pole.
- Posiada mechanikę odczytywania historycznych dni. Opcja wyboru dat archiwalnych (selekcja sprintu) wyznacza pełen, ciągły przedział czasowy, rozpoczynając od dnia najstarszego wprowadzonego wpisu do bazy przez użytkownika, a kończąc na dniu bieżącym. Eliminuje to braki między datami (luki w dniach bez wdrożonej rutyny).

### 4.2 Dependencies (`/src/components/Dependencies.tsx`)
- Posiada zagnieżdżoną logikę SubTabów (Monthly/Weekly).
- Podział list na wyspecjalizowane grupy tematyczne: na przykład "Miesięczne Core" kategoryzuje produkty na m.in. "ADAPTOGENY" (zawierające Soplówkę jeżowatą, Różeniec Górski, Cordyceps, Macę, Reishi, Ashwagandhę), "ZDROWE TŁUSZCZE I ORZECHY", "SUPLEMENTY", "NABIAŁ I JAJA" (np. jajka klasa 0/1, mleko A2), czy "MIĘSO I RYBY" (dzikie ryby). "Weekly Patches" podzielono na warzywa oraz owoce/inne (zawierające np. rokitnik wspierający odporność).
- Implementuje procentowy pasek progresu zebranych zasobów na podstawie przecięcia elementów w tablicy stanu z pełnymi listami wszystkich grup w `data.ts`.
- Lista zoptymalizowana i pozbawiona ikon zewnętrznych linków.
- Automatycznie dopasowuje tematyczne ikony z biblioteki `lucide-react` (oraz niestandardowe ikony SVG, np. dla borówki) na podstawie zawartości tekstu z podziałem na szczegółowe grupy (np. kiszonki, owoce, awokado, kurkuma, imbir).
- Oddzielne rozpoznanie wystąpień dla imbiru i kurkumy w celu nadania osobnych wyróżnień wizualnych.

### 4.3 RuntimeElixirs (`/src/components/RuntimeElixirs.tsx`)
- Architektura interfejsu `ElixirRecipe` wyodrębnia dedykowane pole `adaptogens` od zwykłych składników, by lepiej formatować je na interfejsie jako osobny i wyróżniony moduł ("🔥 Twój adaptogen:").
- Logika formatowania Adaptogenów: jeśli występuje jeden adaptogen, jest renderowany jako pojedynczy obustronnie wyjustowany akapit. Jeżeli występuje ich więcej, renderowane są jako zgrabne punktory (również wyjustowane).
- Dodano "Rytuał Kawowy" do rozpiski bazy danych z instrukcją przygotowania kawy bulletproof w sekcji PORANEK.
- W bazie `data.ts` ustandaryzowano gramatury i frazy w składnikach (m.in. ujednolicenie wystąpień "Pół łyżeczki" na "1/2 łyżeczki").
- Wdraża komponent `HydrationLogger` wyposażony we własny lokalny stan operujący logowaniem wypitej wody, konfigurowalnym celem dziennym (odblokowane wprowadzanie tekstowe w granicach 0 - 9000 ml dostępne po wciśnięciu 'Zmień cel' – proces zatwierdzany przyciskiem) oraz tablicą zapisującą historię dodawania ostatnich wpisów nawodnienia.
- Grupuje listę receptur (`RUNTIME_ELIXIRS`) na 4 odrębne kategorie czasowe na podstawie pola `category`, z dedykowanymi ikonami i kolorystyką dla każdego bloku oznaczających inną porę dnia. Receptury napojów roślinnych otrzymały uściślenie w postaci dopisku o rekomendowanym użyciu "(mleko A2 bio)" ze źródła bazy (`data.ts`).
- Renderuje dynamiczny, reagujący na interakcję akordeon na bazie komponentu z `motion`. Pole instrukcji zostało skonfigurowane z użyciem klasy `text-justify` (Tailwind), zapewniając równe marginesy tekstu z lewej i prawej strony. Nagłówki "SKŁADNIKI:" oraz "INSTRUKCJA PRZYGOTOWANIA:" ukształtowano w formie czystego ALL-CAPS (pozbawionego pogrubienia fontu).
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
- Renderuje dynamiczny wykres słupkowy na podstawie sztywnych danych z ostatnich 7 dni. Wykres generuje widok w oparciu o stan `chartData` i posiada funkcje przesuwania poziomego (scroll) oraz stałą (sticky) oś Y.
- Wykres wyświetla na bieżąco uzyskane wyniki procentowe nad szczytami słupków dla lepszej czytelności.
- Prezentuje "Raport: Ostatnie 30 dni", na który składają się średni zadeklarowany wynik score, odnotowana ciągłość używania (Consistency), średnia zgłoszona moc procesora (Energia) oraz downtime (Jakość Snu).
- Rozbija poszczególne zadania procesów zadeklarowane na przestrzeni 30 dni - wyliczając procentowe wskaźniki pomyślności wykonania operacji, na przykład Poranny Izotonik czy ilość zarejestrowanych kroków średnio na dobę.

## 5. Integracje z Chmurą (Cloud)
Moduł uwierzytelniania zlokalizowany w `/src/components/Integrations.tsx` oraz procesy bazodanowe dystrybuowane poprzez `/src/hooks/useCloudSync.ts`.
- **Firebase Auth:**  Zaimplementowano bezpieczne uwierzytelnianie użytkowników opierające się na dostawcy Google OAuth (Sign in with Google), likwidujące uciążliwe limity dostępu (np. limit 99 osób w testowym Google Drive API) i prośby o restrykcyjne dostępy dla uprawnień dyskowych. Wdrożono wymuszanie wyboru konta Google (`prompt: 'select_account'`), aby zapobiec problemom z pustym ekranem logowania.
- **Obsługa Błędów Autoryzacji:** Aplikacja inteligentnie wyłapuje błędy niezgodności domen (np. przy wdrożeniu na Vercel) i prezentuje użytkownikowi czytelną instrukcję z prośbą o autoryzację nowej domeny w ustawieniach Firebase.
- **Firebase / Firestore:** Asynchroniczna i w pełni automatyczna synchronizacja parametrów historii `v2_dailyCronHistory_v2` w tle za pośrednictwem hooka `useCloudSync`. Tworzy połączony most z platformą Cloud ubezpieczając lokalny `localStorage`.

## 6. Powiadomienia Systemowe (Browser Notifications API)
- W module integracji umieszczono zarządzanie stanami uprawnień dla technologii powiadomień. Przy aktywowaniu opcji, aplikacja dokonuje odpytania "requestPermission()" na obiekcie natywnym `Notification`. Zapewnia to natywny format informowania na poziomie Operating System (komputera bądź Smartfona).
- Sprawdzacz stanu (poller umieszczony w sercu rutera aplikacji) odpytuje o nieukończone na dany dzień procesy i wysyła zaplanowane komunikaty (przypomnienia o rutynie) dbając również o stan wstrzymania dla Visibility API. Zmiana widoczności ekranu ("visibilitychange") błyskawicznie re-uruchamia serwisy powiadomień. 

## 7. Standardy PWA i Integracja
- Aplikacja korzysta z wtyczki `vite-plugin-pwa` z konfiguracją dla Vite. Wtyczka w locie generuje plik Service Workera (z mechanizmem `autoUpdate`) oraz Web Manifest dla PWA. Ustala parametry mobilne (`display: 'standalone'`, `orientation: 'portrait'`) i rejestruje zdefiniowaną nazwę główną "IT Health v2.0".
- Nowa, zintegrowana ikona główna `Icon_App_Health_IT.png` przyporządkowywana jest dla całego spektrum formatów w PWA oraz na ekranie głównym (Splash Screenie) podczas startu aplikacji. Zaimplementowano kompletny pakiet standardowych ikon PWA (`icon-192.png`, `icon-512.png`) oraz zrzutów ekranu (`screenshot-desktop.png`, `screenshot-mobile.png`) wymaganych do poprawnego pakowania aplikacji dla sklepów (np. w narzędziach typu PWABuilder). Dodatkowo zoptymalizowano proces budowy manifestu dostosowując limit wagi plików do cache (`maximumFileSizeToCacheInBytes`), aby obsłużyć pliki wysokiej rozdzielczości bez kompresji.
- Aby ulepszyć wrażenia z korzystania po instalacji PWA, zaimplementowano natywny Splash Screen (ekran powitalny) osadzony całkowicie jako komponent na poziomie wirtualnego drzewa React (`showSplash`). Ukazuje on dużą animowaną wersję ikony z dynamicznie pulsującą barwą w tle, wielkoformatowy gradientowy napis "IT Health v2.0" na środku oraz podpis "by WszystkokolwiekWFormie" na stopce. Ekran naturalnie odlicza wygaszenie podczas ładowania modułów komponentowych aplikacji po upływie ~2.5 sekundy.
- Całość konfiguracji generacyjnej oparta jest o elastyczny bundler, nie obciążając bezpośrednio zadeklarowanej ręki struktury plików PWA (odchodzi potrzeba trzymania ręcznego pliku `manifest.json` oraz `sw.js` wewnątrz `./public`).

## 8. Bramka dostępu (kody aktywacyjne)
Dostęp do aplikacji chroni jednorazowa aktywacja kodem. Rozwiązanie jest w całości po stronie
przeglądarki — nie ma serwera licencji.

- **Ekran aktywacji** (`/src/components/ActivationGate.tsx`) wyświetla się przy pierwszym uruchomieniu.
  Akceptuje kod w dowolnym zapisie (małe litery, spacje, brak myślników) i normalizuje go do postaci
  `ITH-XXXX-XXXX-XXXX`. Celowo nie korzysta z animacji sterowanej JS — gdyby ta nie wystartowała,
  ekran pozostałby przezroczysty i użytkownik nie miałby jak wpisać kodu.
- **Weryfikacja** (`/src/lib/access.ts`) liczy PBKDF2-SHA256 (150 000 iteracji) i porównuje wynik
  z listą hashy. Po sukcesie zapisuje aktywację w `localStorage` (`v2_access_activated`), więc
  aplikacja pyta o kod tylko raz. Kod jawny nie jest nigdzie przechowywany.
- **W repozytorium są wyłącznie hashe** (`/src/lib/accessCodes.ts`). Repozytorium jest publiczne,
  więc lista kodów jawnych nie może się w nim znaleźć. PBKDF2 z dużą liczbą iteracji sprawia,
  że odtworzenie kodów z samych hashy jest niepraktyczne.
- **Generowanie kolejnych partii:** `node scripts/generate-codes.mjs 200 partia-02`. Skrypt dopisuje
  nowe hashe do istniejących (kody już sprzedane pozostają ważne), a listę kodów jawnych zapisuje
  poza repozytorium, do `D:\Claude_Env\docs\kody-dostepu\`.
- **Flaga `isPro`** (`/src/hooks/useAccess.ts`) jest jednym źródłem prawdy o dostępie. W Fazie 1
  kod jest bramką wejściową, więc każdy kto wszedł ma pełną wersję. Przejście na model LITE/PRO
  sprowadza się do ustawienia `WYMAGAJ_KODU_NA_WEJSCIU = false` w `/src/lib/access.ts` — aplikacja
  wpuści wtedy każdego, a moduły PRO wystarczy owinąć warunkiem `isPro`.
- **Ograniczenie:** bramka działa po stronie klienta, więc osoba techniczna potrafi ją obejść
  (podmiana wpisu w `localStorage`). Przy tej skali dystrybucji jest to świadomy kompromis —
  hashowanie chroni przed realnym ryzykiem, czyli wyciekiem i odsprzedażą całej listy kodów.

## 9. Integralność zasobów graficznych
Zasoby PWA (`icon-192.png`, `icon-512.png`, `screenshot-desktop.png`, `screenshot-mobile.png`) ulegały
w przeszłości trzykrotnemu uszkodzeniu typu **mojibake UTF-8**: zapis pliku binarnego przez edytor
traktujący go jako tekst zamienia każdy bajt o wartości >= 0x80 na znak zastępczy U+FFFD, przez co
sygnatura PNG `\x89PNG` staje się ciągiem `efbfbd 50 4e 47`. Uszkodzenie jest nieodwracalne —
pliku nie da się naprawić, można go wyłącznie odtworzyć. Objawem był komunikat PWABuildera
*"manifest refers to an image that appears to be corrupt or invalid"* oraz nieotwierające się
podglądy plików w edytorze.

Wdrożono trzy zabezpieczenia:

- **`.gitattributes`** — oznacza rozszerzenia binarne (`*.png`, `*.jpg`, `*.ico`, `*.woff*`) jako
  `binary`, dzięki czemu git nie stosuje wobec nich konwersji tekstowych ani końców linii.
- **`.github/workflows/weryfikacja-obrazow.yml`** — przy każdym pushu i pull requeście sprawdza
  sygnatury wszystkich śledzonych plików PNG i JPEG. Wykrycie prefiksu `efbfbd` przerywa build
  i wypisuje komunikat wskazujący przyczynę oraz sposób odtworzenia pliku. Kontrola trwa kilka sekund.
- **Ochrona gałęzi `main`** — wymaga przejścia powyższego checku (`sygnatury`) i obejmuje również
  właściciela repozytorium (`enforce_admins`), więc zmiany trafiają na `main` wyłącznie przez
  pull requesta. Bezpośredni push kończy się odrzuceniem (`GH006: Protected branch update failed`).

Ikony odtwarza się skryptem `fix-icons.js`, który skaluje wzorcowy plik `public/Icon_App_Health_IT.png`
do wymaganych rozmiarów. Zrzuty ekranu wykonuje się z uruchomionej aplikacji w rozdzielczościach
zadeklarowanych w manifeście (1280x720 oraz 720x1280) — wcześniejsze wersje generowane były
przez skrypt skalujący logo `Ciemne-Social.jpg`, przez co nie przedstawiały interfejsu programu.
