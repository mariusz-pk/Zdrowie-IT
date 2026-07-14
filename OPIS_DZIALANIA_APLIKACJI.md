# OPIS DZIAŁANIA APLIKACJI: IT Health V2.0 by WszystkokolwiekWFormie

Aplikacja **IT Health V2.0 by WszystkokolwiekWFormie** to narzędzie wspomagające zarządzanie zdrowiem (biohacking), przeznaczone w głównej mierze dla osób mających siedzący tryb życia (m.in. pracowników branży IT). Jej zadaniem jest budowanie pozytywnych, regularnych rutyn oraz stałe monitorowanie postępów i stanu witalnego.

Można ją zainstalować na własnym ekranie telefonu jako w pełni natywnie wyglądającą aplikację typu "Progressive Web App" (funkcja: *Dodaj do ekranu głównego* w opcjach przeglądarki) lub łatwo spakować i zgłosić do sklepów z aplikacjami (narzędziami typu PWABuilder). Rozwiązanie to opiera się na wydajnym silniku generującym środowisko progresywne (Vite) zapewniającym automatyczne aktualizacje (auto-update). Zyskujesz nową, spójną ikonę instalacyjną oraz wysokiej jakości zrzuty ekranu wyświetlane podczas instalacji, a dzięki mechanizmom PWA uruchamianie aplikacji stało się bezramkowe. Przy starcie i każdym świeżym uruchomieniu z poziomu pulpitu przywitany zostaniesz profesjonalnego formatu Splash Screen'em (ekranem powitalnym) symulującym natywne uruchomienie aplikacji iOS/Android: pojawia się pulsująca w cieniu grafika z ikoną, wyrazisty tekst "IT Health v2.0" wraz ze stopką autora "by WszystkokolwiekWFormie", wygaszając interfejs po wejściu w sam program.

Aplikacja podzielona jest funkcjonalnie na 4 główne działy, dostępne poprzez dolne menu nawigacyjne nawiązujące formą do urządzeń mobilnych:

## 1. CRON (Interaktywny Tracker KPI - Daily Cron)
Sekcja zaprojektowana na wzór skryptów systemowych (crontab). Służy do zaznaczania swoich dziennych, najważniejszych nawyków prozdrowotnych (poranne nawodnienie, opóźnianie picia kawy o 90 minut, porcja witaminy D3 + K2 MK7 z tłuszczami, wieczorna dawka suplementów, zrządzanie ustalanym "Dziennym limitem kroków" ze swobodną edycją i poprawionym wizualnie systemem zapisu z kontekstowym powiadomieniem).

- **System Stability Score:** Na górze ekranu znajduje się wskaźnik pokazujący aktualny dzienny wynik. Jest to procentowa wartość obliczana dynamicznie. Zaznaczanie każdego nawyku lub odpowiednie przesunięcie w dół/w górę suwaków z ocenami subiektywnej energii/snu zwiększa ten wskaźnik. Wynik 100% oznacza wykonanie pełnego cyklu dziennego.
- **Archiwum Nawyków:** Aplikacja automatycznie zeruje te wartości równo o północy. Ogranicza też wgląd do dni archiwalnych – na górnym module widnieje wybór daty, pozwalający wejść w każdy dotychczasowy dzień tylko w celu sprawdzenia swojego "wyniku" (zablokowany tryb odczytu archiwalnego). Wybór zablokowany jest w ścisłym przedziale — od najstarszego dnia, w którym użytkownik zanotował postępy, z uzupełnieniem ciągłości poprzez wszystkie dni (bez przerywanych luk), aż do dnia dzisiejszego jako dnia ostatecznego zakresu.

## 2. DEPS (Spiżarnia Biohackera / Lista Zależności)
Interaktywna "lista zakupów" dla organizmu skoncentrowana wokoło odpowiednich dla mózgu mikroskładników odżywczych (materiały budulcowe m.in. dla hormonów i systemu nerwowego). Czysta lista zredukowana została do czytelnych, prostych nazw, by skupić użytkownika wyłącznie na kompletowaniu produktów.
- Wyświetla towary niezbędne do kupienia i zaopatrzenia swojej domowej apteczki. Lista podzielona jest na dwie zakładki: stałe produkty ogólne (miesięczne CORE) i produkty do regularnego odświeżania na dany tydzień (Weekly Patches).
- Asortyment w obrębie zakładek został dodatkowo precyzyjnie pogrupowany na tematyczne sekcje (np. Baza i węglowodany, Zdrowe tłuszcze, Adaptogeny, Suplementy, Nabiał i jaja, Mięso i ryby, Warzywa), co ułatwia i usprawnia poruszanie się po sklepie lub aptece. Dodano również wspierający odporność rokitnik.
- Asortyment zyskuje zindywidualizowane ikony ułatwiające orientację w liście zakupów, kategoryzujące pozycje na precyzyjne typy produktów (w tym m.in. kiszonki, borówki czy wydzielone kąciki przypraw).
- Udaną "instalację" zależnosci (zakup) odklikuje się symbolem 'ptaszka', co dodaje produkt do zasobów zaliczonych. Lista podlicza zdobyte pozycje ukazując stan wyposażenia "spiżarni".

## 3. ELIXIRS (Napoje Mocy - Receptury Czasowe)
Katalog autorskich receptur napojów wspierających odporność i witalność przez całą dobę. 
- **Monitor Nawodnienia (Hydration Logger):** Interaktywny panel pozwalający na ustawienie indywidualnego dziennego celu nawodnienia. Zawiera przycisk "Zmień cel", po którym uruchamia się w pełni edytowalne okno dialogowe - można wpisać interesującą nas wartość celową limitu w granicach [0 - 9000] ml i trwale potwierdzić dyskietką. Ponadto, logger pozwala na logowanie spożytych płynów "sztywnym" krokiem (w porcjach po 250 ml), wskazując procentowy progres oraz rejestrując historię akcji.
- **Katalog Napojów i Moduł Adaptogenów:** Przepisy pogrupowane są na 4 pory dnia (PORANEK, W TRAKCIE DNIA, WIECZÓR, DOWOLNA PORA), a obok tradycyjnych przepisów takich jak Matchy, Kakao czy Złotego Mleka dodano specjalistyczny "Rytuał Kawowy". 
- **Formatowanie Składników:** W interfejsie zastosowano elegancki podział oddzielający standardowe składniki od potężnych ziół. Sekcja "🔥 Twój adaptogen:" elegancko objaśnia dodatek adaptogenny z zachowaniem obustronnego wyjustowania, a także minimalistycznych punktorów w przypadku występowania kilku opcji naraz. Wartości podawane w recepturach zapisane są klarownie jako ułamki "1/2 łyżeczki", a główne sekcje instrukcyjne oddzielone rygorystycznymi nagłówkami drukowanymi.
- **Automatyzacja przygotowania:** Napoje, które muszą się parzyć określony czas, wyposażone są we wbudowany stoper odliczający dedykowany czas. Po upływie tego czasu na urządzeniach mobilnych dochodzi do krótkiej potrójnej wibracji sygnalizującej skończone parzenie.

## 4. INCIDENT (Raportowanie Zdarzeń Zdrowotnych / Telemetria)
Twoja klinika wewnątrzkonsolowa; miejsce gdzie wchodzisz podczas porannych diagnoz, bądź po zgłoszeniu problemów zdrowotnych (incydentów).
- Użytkownik wklepuje codzienne logi RHR (poranne tętno spoczynkowe po wstaniu w uderzeniach/min), stopień natlenienia / saturacji (SpO2 w %). Pola tekstowe w interfejsie są równe i wzajemnie wyrównane w płaszczyźnie poziomej dla lepszej spójności wizualnej.
- Czuła diagnoza analityczna wygeneruje właściwe reakcje:
  - Powyżej 80 uderzeń RHR: system generuje Alert, prosząc o wprowadzenie ćwiczeń oddechowych (oznaka dużego stresu lub choroby w układzie).
  - Poniżej 95% Saturacji: generowane jest pomarańczowe ostrzeżenie systemu zalecające głębokie wdychanie lub wejście na świeże powietrze.
- Tryb zgłaszania defektów (Bug Reporting): Gdy pojawia się gorsze samopoczucie (np. zgłoszenie "Mgła Mózgowa"), aplikacja wygeneruje spersonalizowaną podpowiedź co można zrobić aby poczuć się lepiej.
- **Logi Systemowe (Historia):** U dołu zakładki zlokalizowany jest agregator wszystkich zalogowanych skanów wraz z przypisanymi im ostrzeżeniami czy błędami. Są one sortowane od najświeższego do najstarszego wpisu z przypisaną datą i pełnym profilem telemetrycznym. 

## 5. STATS (System Analytics / Raporty)
Zestawienie analityczne śledzące konsekwencję w wykonywaniu rutyn zaznaczanych w głównym module **CRON**. 
- **Historia Wydajności:** Poziomy, przewijany panel wizualizacyjny prezentujący codzienne wyniki (score) punktacji uwzględniające sztywny okres ostatnich 7 dni. Wyższe słupki z czytelnym wskaźnikiem procentowym oznaczają wyższą powtarzalność.
- **Raport: Ostatnie 30 dni:** Szybki rzut oka na dłuższą perspektywę – średni wynik punktowy, stopień ciągłości działania w aplikacji ("Konsekwencja"), oraz średnia ocena odczuwalnej Energii (Mocy Procesora) i jakości Snu (Downtime).
- **Rozbicie Procesów:** Szczegółowe widoki częstotliwości wykonywania przypisanych logów – ile razy na przestrzeni 30 dni wdrożony był Poranny Izotonik, czy systematycznie odcinano kofeinę, i jaka uśredniona ilość kroków widniała w logach telemetrycznych poszczególnego użytkownika.

## 6. CLOUD (Synchronizacja i kopie zapasowe)
Narzędzie do bezpieczeństwa danych oraz integracji chmurowej:
- **Synchronizacja Firebase (Firestore):** Automatycznie i w czasie rzeczywistym powiązane z Twoim kontem Google, przechowuje Twoje zaznaczenia w CRON w bezpiecznej przestrzeni chmurowej (Baza Danych Firestore). Nie posiada limitów współdzielenia (jak starsze wersje z Google Drive), dzięki czemu logowanie jest proste i postępy są odporne na utratę danych bez konieczności robienia manualnych zrzutów na Dysk.
- **Usprawnione Logowanie (Google Auth):** Logowanie wymusza teraz jawny wybór konta Google, co całkowicie eliminuje problem zawieszającego się, białego ekranu po wdrożeniu na zewnętrzne serwery (np. Vercel). System podpowie Ci również automatycznie, jeśli zapomnisz dodać nową domenę do autoryzowanych w Firebase.

## 7. SYSTEM POWIADOMIEŃ (Przypomnienia natywne)
Aplikacja została wyposażona w pełne wsparcie dla powiadomień na poziomie Systemu Operacyjnego.
- **Powiadomienia z przypomnieniami:** Po poprawnej darmowej aktywacji autoryzacji w ustawieniach ("OPCJE"), przeglądarka zapamięta zezwolenie i pozwoli wysyłać powiadomienia niezależnie.
- **Polityka re-angażowania:** Powiadomienie pojawia się za każdym razem gdy wchodzisz na zakładkę i system połączy fakty ze spóźnieniem w wypełnianiu Twojego Daily CRON - bądź robi to skrypt sprawdzający uruchamiający się w tłe gdy masz otwartą kartę.

---
Zastosowane pojęcia informatyczne (IT) wspierają przyjazny i zrozumiały "gamifikacyjny" układ polecany dla inżynierów i specjalistów poszukujących motywacji we własnym języku specjalistycznym.
