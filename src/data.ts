export const MONTHLY_CORE_DEPENDENCIES = [
  "Kasza jaglana",
  "Gryczana niepalona",
  "Komosa ryżowa (quinoa)",
  "Siemię lniane (całe)",
  "Nasiona chia",
  "Pestki dyni",
  "Słonecznik (pestki)",
  "Orzechy włoskie",
  "Migdały",
  "Orzechy brazylijskie",
  "Olej lniany (tłoczony na zimno)",
  "Oliwa z oliwek extra virgin",
  "Olej kokosowy",
  "Pyłek pszczeli",
  "Kakao ceremonialne",
  "Miód spadziowy (lub lipowy)",
  "Szałwia lekarska (susz)",
  "Melisa (susz)",
  "Szyszki chmielu (susz)",
  "Krwawnik pospolity (susz)",
  "Cynamon cejloński",
  "Kardamon",
  "Pieprz cayenne / czarny pieprz",
  "Sól kłodawska (niejodowana)",
  "Magnez (jabłczan lub diglicynian)",
  "Witamina D3+K2",
  "Omega-3 (suplement)",
  "Kreatyna",
  "Adaptogeny (np. Ashwagandha)",
  "Kurkumina z piperyną",
  "Ocet jabłkowy mętny (BIO)",
  "Kawa w ziarnach (jakościowa)",
  "Zielona Matcha"
];

export const WEEKLY_PATCHES_DEPENDENCIES = [
  "Brokuły",
  "Kalafior",
  "Kapusta (biała lub czerwona)",
  "Buraki",
  "Marchew",
  "Pietruszka (korzeń i natka)",
  "Seler",
  "Szpinak",
  "Jarmuż",
  "Rukola",
  "Kiszonki (domowa kapusta, ogórki, zakwas z buraka)",
  "Dzika borówka (może być mrożona)",
  "Cytryny",
  "Awokado",
  "Czosnek",
  "Cebula",
  "Świeży imbir / Świeża kurkuma"
];

export interface ElixirRecipe {
  id: string;
  name: string;
  timeMin: number;
  ingredients: string[];
  instructions: string;
}

export const RUNTIME_ELIXIRS: ElixirRecipe[] = [
  {
    id: "e1",
    name: "Poranny Izotonik (Komórkowe Nawodnienie)",
    timeMin: 2,
    ingredients: [
      "200 ml ciepłej wody",
      "1 łyżka octu jabłkowego",
      "1 łyżka kreatyny",
      "Szczypta soli kłodawskiej",
      "Pół łyżeczki miodu",
      "Wzmacniacz: 1 tabletka kurkuminy z piperyną (opcjonalnie)"
    ],
    instructions: "Wlej do naczynia 200 ml ciepłej wody. Dodaj ocet jabłkowy, kreatynę, sól kłodawska oraz miód. Całość dokładnie wymieszaj do rozpuszczenia się składników. Pobudza wydzielanie soków żołądkowych."
  },
  {
    id: "e2",
    name: "Poranny Napój Mocy",
    timeMin: 2,
    ingredients: [
      "Ciepła woda",
      "Ocet jabłkowy",
      "Sól kłodawska",
      "Kreatyna"
    ],
    instructions: "Połączenie octu i soli kłodawskiej idealnie nawadnia komórki od środka, przywracając równowagę elektrolitową po nocy. Kreatyna służy jako paliwo dla mózgu. Wymieszaj i wypij na czczo."
  },
  {
    id: "e3",
    name: "Eliksir z Pyłkiem Pszczelim (Multiwitamina)",
    timeMin: 1, // Excludes night soaking
    ingredients: [
      "1 łyżeczka pyłku pszczelego (namoczony na noc)",
      "200 ml letniej wody",
      "Świeży sok z cytryny"
    ],
    instructions: "Wieczorem wsyp 1 łyżeczkę pyłku pszczelego do szklanki i zalej go 200 ml letniej wody. Zostaw w wodzie na całą noc, by rozbić otoczkę (zwiększa przyswajalność o 60-80%). Rano dodaj sok z cytryny i dokładnie wymieszaj."
  },
  {
    id: "e4",
    name: "Kawa (Złote Zasady / Kuloodporna)",
    timeMin: 5,
    ingredients: [
      "Kawa przelewowa / czarna",
      "Kardamon (do smaku i na kwasowość)",
      "Opcjonalnie: masło klarowane i olej kokosowy"
    ],
    instructions: "Pij kawę zawsze minimum 90-120 minut po przebudzeniu, po posiłku. Aby zapobiec spadkom energii i złagodzić kwasowość dodaj kardamon, lub przygotuj wersję kuloodporną (blendując z masłem i olejem MTC/kokosowym)."
  },
  {
    id: "e5",
    name: "Złoty napój odpornościowy (Złote Przebudzenie)",
    timeMin: 5,
    ingredients: [
      "200 ml ciepłej wody",
      "Sok z 1 świeżej cytryny",
      "1 łyżeczka miodu",
      "Szczypta kurkumy",
      "1-2 plasterki świeżego imbiru",
      "Opcjonalnie: Szczypta czarnego pieprzu"
    ],
    instructions: "Do szklanki wciśnij świeży sok z cytryny, dodaj szczyptę kurkumy oraz plasterki imbiru. Zalej ciepłą wodą. Po przestygnięciu dodaj miodu, by zachował zdrowotne właściwości. Dokładnie wymieszaj i pij jako pancerz ochronny."
  },
  {
    id: "e6",
    name: "Zielona Matcha Latte",
    timeMin: 4,
    ingredients: [
      "1 łyżeczka Matchy",
      "50 ml wody (temperatura ok. 80°C)",
      "150 ml napoju roślinnego",
      "Miód (opcjonalnie)"
    ],
    instructions: "Wsyp łyżeczkę Matchy do naczynia i zalej ją 50 ml sfermentowanej/wody term. 80°C. Dokładnie wymieszaj Matchę z wodą (najlepiej miotełką chasen) aż do powstania gęstej pianki. Podgrzej i spień napój roślinny, następnie dolej do bazy."
  },
  {
    id: "e7",
    name: "Złote Mleko Kardamonowe",
    timeMin: 5,
    ingredients: [
      "Mleko roślinne (1 kubek)",
      "Kurkuma (szczypta/pół łyżeczki)",
      "Cynamon i Kardamon",
      "5g oleju kokosowego",
      "Miód"
    ],
    instructions: "Podgrzej mleko roślinne tak, aby było ciepłe (nie wrzące). Dodaj kurkumę, cynamon, kardamon oraz olej kokosowy i wymieszaj. Miód dodaj na samym końcu do ostudzonego napoju. Idealny rytuał wyciszający na wieczór."
  },
  {
    id: "e8",
    name: "Napar z szałwii i krwawnika",
    timeMin: 10,
    ingredients: [
      "1-2 łyżki suszu szałwii lekarskiej",
      "Susz krwawnika pospolitego (1 łyżka)",
      "1 szklanka wrzątku"
    ],
    instructions: "Zalej przygotowany susz z szałwii i krwawnika szklanką wrzątku. Zaparzaj napar pod przykryciem, a po 10 minutach przed wypiciem dokładnie przecedź. Wspiera naczynia krwionośne i redukuje stany zapalne."
  },
  {
    id: "e9",
    name: "Koktajl \"Czerwona Energia\"",
    timeMin: 5,
    ingredients: [
      "Surowy sok z buraka (lub 1 mały burak)",
      "Sok z cytryny",
      "Świeży imbir (kawałek)"
    ],
    instructions: "Zmiksuj surowy sok z buraka z sokiem z cytryny i świeżym imbirem w blenderze do pożądanej konsystencji. To napój o potężnym doładowaniu tlenkiem azotu (poprawa wydolności) i witaminą C."
  },
  {
    id: "e10",
    name: "Herbatki Funkcyjne (Lipa / Hibiskus / Melisa)",
    timeMin: 10,
    ingredients: [
      "Wybrany susz: Lipa, Hibiskus lub Melisa",
      "Wrzątek"
    ],
    instructions: "Zalej ulubiony susz gorącą wodą. Zaparzaj 10 minut. Wybierz lipę na przeziębienie i wypocenie, hibiskus na naturalne obniżenie ciśnienia krwi, a melisę na łagodzenie lekkiego stresu i spokojny sen wieczorem."
  }
];
