# OPIS DZIAŁANIA APLIKACJI: IT Health Console (v2.0)

Aplikacja **IT Health Console (v2.0)** to narzędzie wspomagające zarządzanie zdrowiem (biohacking), przeznaczone w głównej mierze dla osób mających siedzący tryb życia (m.in. pracowników branży IT). Jej zadaniem jest budowanie pozytywnych, regularnych rutyn oraz stałe monitorowanie postępów i stanu witalnego.

Można ją zainstalować na własnym ekranie telefonu jako w pełni natywnie wyglądającą aplikację typu "Progressive Web App" (funkcja: *Dodaj do ekranu głównego* w opcjach przeglądarki).

Aplikacja podzielona jest funkcjonalnie na 4 główne działy, dostępne poprzez dolne menu nawigacyjne nawiązujące formą do urządzeń mobilnych:

## 1. CRON (Interaktywny Tracker KPI - Daily Cron)
Sekcja zaprojektowana na wzór skryptów systemowych (crontab). Służy do zaznaczania swoich dziennych, najważniejszych nawyków prozdrowotnych (poranne nawodnienie, opóźnianie picia kawy o 90 minut, porcja witaminy D3 + K2 MK7 z tłuszczami, wieczorna dawka suplementów, limit minimalnej dziennej liczby kroków).

- **System Stability Score:** Na górze ekranu znajduje się wskaźnik pokazujący aktualny dzienny wynik. Jest to procentowa wartość obliczana dynamicznie. Zaznaczanie każdego nawyku lub odpowiednie przesunięcie w dół/w górę suwaków z ocenami subiektywnej energii/snu zwiększa ten wskaźnik. Wynik 100% oznacza wykonanie pełnego cyklu dziennego.
- **Archiwum Nawyków:** Aplikacja automatycznie zeruje te wartości równo o północy. Ogranicza też wgląd do dni archiwalnych – na górnym module widnieje wybór daty, pozwalający wejść w każdy dotychczasowy dzień tylko w celu sprawdzenia swojego "wyniku" (zablokowany tryb odczytu archiwalnego).

## 2. DEPS (Spiżarnia Biohackera / Lista Zależności)
Interaktywna "lista zakupów" dla organizmu skoncentrowana wokoło odpowiednich dla mózgu mikroskładników odżywczych (materiały budulcowe m.in. dla hormonów i systemu nerwowego).
- Wyświetla towary niezbędne do kupienia i zaopatrzenia swojej domowej apteczki. Lista podzielona jest na dwie kategorie: stałe produkty ogólne (miesięczne CORE) i produkty do regularnego odświeżania na dany tydzień (Weekly Patches).
- Asortyment zyskuje zindywidualizowane ikony ułatwiające orientację w liście zakupów, kategoryzujące pozycje na precyzyjne typy produktów (w tym m.in. kiszonki, borówki czy wydzielone kąciki przypraw).
- Udaną "instalację" zależnosci (zakup) odklikuje się symbolem 'ptaszka', co dodaje produkt do zasobów zaliczonych. Lista podlicza zdobyte pozycje ukazując stan wyposażenia "spiżarni".

## 3. ELIXIRS (Napoje Mocy - Receptury Czasowe)
Katalog autorskich receptur napojów wspierających odporność i witalność przez całą dobę. 
- **Monitor Nawodnienia (Hydration Logger):** Interaktywny panel pozwalający na ustawienie indywidualnego dziennego celu nawodnienia oraz szybkie logowanie spożytych płynów (w porcjach po 250 ml). Wskazuje procentowy progres oraz wyświetla historię 5 ostatnich operacji.
- **Katalog Napojów:** Przepisy pogrupowane są na 4 pory dnia (PORANEK, W TRAKCIE DNIA, WIECZÓR, DOWOLNA PORA). Każdy moduł można otworzyć (rozwijany mechanizm "akordeonu"), odsłaniając jego pełny skład oraz sposób przygotowania (instrukcję/flow).
- **Automatyzacja przygotowania:** Napoje, które muszą się parzyć określony czas, wyposażone są we wbudowany stoper odliczający dedykowany czas. Po upływie tego czasu na urządzeniach mobilnych dochodzi do krótkiej potrójnej wibracji sygnalizującej skończone parzenie.

## 4. INCIDENT (Raportowanie Zdarzeń Zdrowotnych / Telemetria)
Twoja klinika wewnątrzkonsolowa; miejsce gdzie wchodzisz podczas porannych diagnoz, bądź po zgłoszeniu problemów zdrowotnych (incydentów).
- Użytkownik wklepuje codzienne logi RHR (poranne tętno spoczynkowe po wstaniu w uderzeniach/min), stopień natlenienia / saturacji (SpO2 w %).
- Czuła diagnoza analityczna wygeneruje właściwe reakcje:
  - Powyżej 80 uderzeń RHR: system generuje Alert, prosząc o wprowadzenie ćwiczeń oddechowych (oznaka dużego stresu lub choroby w układzie).
  - Poniżej 95% Saturacji: generowane jest pomarańczowe ostrzeżenie systemu zalecające głębokie wdychanie lub wejście na świeże powietrze.
- Tryb zgłaszania defektów (Bug Reporting): Gdy pojawia się gorsze samopoczucie (np. zgłoszenie "Mgła Mózgowa"), aplikacja wygeneruje spersonalizowaną podpowiedź co można zrobić aby poczuć się lepiej.
- **Logi Systemowe (Historia):** U dołu zakładki zlokalizowany jest agregator wszystkich zalogowanych skanów wraz z przypisanymi im ostrzeżeniami czy błędami. Są one sortowane od najświeższego do najstarszego wpisu z przypisaną datą i pełnym profilem telemetrycznym. 

## 5. STATS (System Analytics / Raporty)
Zestawienie analityczne śledzące konsekwencję w wykonywaniu rutyn zaznaczanych w głównym module **CRON**. 
- **Historia Wydajności:** Poziomy, przewijany panel wizualizacyjny prezentujący codzienne wyniki (score) punktacji generowane od momentu rozpoczęcia korzystania z aplikacji. Wyższe słupki z czytelnym wskaźnikiem procentowym oznaczają wyższą powtarzalność na przestrzeni historii danych.
- **Raport: Ostatnie 30 dni:** Szybki rzut oka na dłuższą perspektywę – średni wynik punktowy, stopień ciągłości działania w aplikacji ("Konsekwencja"), oraz średnia ocena odczuwalnej Energii (Mocy Procesora) i jakości Snu (Downtime).
- **Rozbicie Procesów:** Szczegółowe widoki częstotliwości wykonywania przypisanych logów – ile razy na przestrzeni 30 dni wdrożony był Poranny Izotonik, czy systematycznie odcinano kofeinę, i jaka uśredniona ilość kroków widniała w logach telemetrycznych poszczególnego użytkownika.

---
Zastosowane pojęcia informatyczne (IT) wspierają przyjazny i zrozumiały "gamifikacyjny" układ polecany dla inżynierów i specjalistów poszukujących motywacji we własnym języku specjalistycznym.
