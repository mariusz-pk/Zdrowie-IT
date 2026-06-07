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
  timeMin?: number;
  ingredients: string[];
  instructions: string;
  category: "PORANEK (Aktywacja i Rozruch)" | "W TRAKCIE DNIA (Wydajność i Skupienie)" | "WIECZÓR (Wyciszenie i Sen)" | "DOWOLNA PORA (Wsparcie Całodobowe)";
}

export const RUNTIME_ELIXIRS: ElixirRecipe[] = [
  {
    id: "e1",
    name: "Poranny Izotonik",
    timeMin: 2,
    ingredients: [
      "200 ml ciepłej wody",
      "1 łyżka octu jabłkowego",
      "Szczypta soli kłodawskiej",
      "Pół łyżeczki miodu"
    ],
    instructions: "Wlej do naczynia 200 ml ciepłej wody. Dodaj ocet jabłkowy, sól kłodawska oraz miód. Całość dokładnie wymieszaj do rozpuszczenia się składników. Pobudza wydzielanie soków żołądkowych i nawadnia komórki.",
    category: "PORANEK (Aktywacja i Rozruch)"
  },
  {
    id: "e2",
    name: "Zielona Matcha Latte",
    timeMin: 2,
    ingredients: [
      "1 łyżeczka Matchy",
      "50 ml wody (temperatura ok. 80°C)",
      "150 ml napoju roślinnego"
    ],
    instructions: "Wsyp łyżeczkę Matchy do naczynia i zalej ją 50 ml wody term. 80°C. Dokładnie wymieszaj (najlepiej miotełką chasen) aż do powstania gęstej pianki. Podgrzej i spień napój roślinny, następnie dolej do bazy.",
    category: "PORANEK (Aktywacja i Rozruch)"
  },
  {
    id: "e3",
    name: "Złoty Eliksir Imbirowy",
    timeMin: 5,
    ingredients: [
      "200 ml ciepłej wody",
      "Świeży imbir i kurkuma",
      "Sok z cytryny",
      "Miód"
    ],
    instructions: "Zalej starty imbir i kurkumę gorącą wodą. Po przestygnięciu dodaj sok z cytryny i rozpuść miód. Działa silnie przeciwzapalnie.",
    category: "W TRAKCIE DNIA (Wydajność i Skupienie)"
  },
  {
    id: "e4",
    name: "Szot z Zakwasu Buraka",
    ingredients: [
      "100 ml zakwasu z buraka"
    ],
    instructions: "Wypij jednorazowo szot z zakwasu. Dostarcza bakterii probiotycznych, odbudowuje mikrobiom i silnie dotlenia krew po długim siedzeniu.",
    category: "W TRAKCIE DNIA (Wydajność i Skupienie)"
  },
  {
    id: "e5",
    name: "Matcha-Mate Turbo",
    timeMin: 3,
    ingredients: [
      "Matcha",
      "Yerba Mate",
      "Ciepła woda (ok. 75-80°C)"
    ],
    instructions: "Zaparz wspólnie matchę i yerba mate wodą o temp 75-80°C. Niezwykle mocne pobudzenie przeznaczone na największe kryzysy i spadki energii podczas pracy.",
    category: "W TRAKCIE DNIA (Wydajność i Skupienie)"
  },
  {
    id: "e6",
    name: "Kakao Adaptogenne",
    timeMin: 3,
    ingredients: [
      "Surowe kakao",
      "Adaptogeny (np. Ashwagandha, Soplówka jeżowata)",
      "Napój roślinny"
    ],
    instructions: "Podgrzej napój roślinny. Rozmieszaj dokładnie kakao i adaptogeny. Pij w momentach silnego stresu psychologicznego, aby wyciszyć układ nerwowy bez utraty ostrości umysłu.",
    category: "W TRAKCIE DNIA (Wydajność i Skupienie)"
  },
  {
    id: "e7",
    name: "Złote Mleko Kardamonowe",
    timeMin: 5,
    ingredients: [
      "Mleko roślinne (1 kubek)",
      "Kurkuma",
      "Cynamon i Kardamon",
      "5g oleju kokosowego",
      "Miód"
    ],
    instructions: "Podgrzej mleko roślinne tak, aby było ciepłe (nie wrzące). Dodaj kurkumę, cynamon, kardamon oraz olej kokosowy i wymieszaj. Miód dodaj na samym końcu do ostudzonego napoju. Idealny rytuał wyciszający na wieczór.",
    category: "WIECZÓR (Wyciszenie i Sen)"
  },
  {
    id: "e8",
    name: "Lemoniada Magnezowa",
    ingredients: [
      "Woda",
      "Sok z cytryny",
      "Glicynian magnezu"
    ],
    instructions: "Rozpuść magnez w letniej wodzie z odrobiną soku z cytryny. Potężnie stymuluje wyciszenie układu nerwowego, zapobiega skurczom i przygotowuje mózg na fazę snu głębokiego.",
    category: "WIECZÓR (Wyciszenie i Sen)"
  },
  {
    id: "e9",
    name: "Eliksir z Pyłku Pszczelego",
    timeMin: 5,
    ingredients: [
      "Pyłek pszczeli",
      "Woda",
      "Miód"
    ],
    instructions: "Rozpuść zmielony lub namoczony dzień wcześniej pyłek pszczeli z odrobiną miodu w letniej wodzie. Potężny koktajl aminokwasów i minerałów. Naturalny zastrzyk witalności.",
    category: "DOWOLNA PORA (Wsparcie Całodobowe)"
  },
  {
    id: "e10",
    name: "Woda Chia Fresca",
    ingredients: [
      "Nasiona chia",
      "Woda",
      "Sok z cytryny"
    ],
    instructions: "Zalej nasiona chia wodą z sokiem z cytryny i odczekaj kilkanaście minut. Pij regularnie. Zapewnia długotrwałe, stabilne nawodnienie komórkowe.",
    category: "DOWOLNA PORA (Wsparcie Całodobowe)"
  }
];
