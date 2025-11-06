// 🇯🇵 Jepang
export const BRANDS_JDM = [
  "Toyota","Nissan","Mitsubishi","Honda","Mazda","Subaru","Suzuki","Daihatsu",
  "Lexus","Infiniti","Acura","Isuzu"
];

// 🇪🇺 Eropa
export const BRANDS_EU = [
  "BMW","Mercedes-Benz","Audi","Volkswagen","Porsche","Ferrari","Lamborghini","Volvo",
  "Peugeot","Renault","Alfa Romeo","Skoda","Seat","Aston Martin","Bentley","Rolls-Royce",
  "McLaren","Mini","Jaguar","Land Rover","Bugatti","Citroën","Opel","Dacia",
  "Fiat","Maserati","Cupra","Smart","Lancia","Lotus"
];

// 🇺🇸 Amerika
export const BRANDS_US = [
  "Ford","Chevrolet","Dodge","Tesla","Cadillac","Jeep","GMC","Lincoln",
  "Rivian","Lucid","Chrysler","Buick","RAM","Hummer","Pontiac","Plymouth"
];

// 🇰🇷 Korea
export const BRANDS_KR = ["Hyundai","Kia","Genesis"];

// 🇨🇳 China
export const BRANDS_CN = [
  "BYD","NIO","XPeng","Geely","Chery","Great Wall","Haval","Wuling",
  "MG","Ora","Lynk & Co","Zeekr","Li Auto","Hongqi","Leapmotor","Aion","Neta","Seres"
];

// 🇮🇳 India
export const BRANDS_IN = ["Tata","Mahindra","Maruti Suzuki","Force Motors"];

// Gabungan semua
export const ALL_BRANDS: string[] = [
  ...BRANDS_JDM, ...BRANDS_EU, ...BRANDS_US, ...BRANDS_KR, ...BRANDS_CN, ...BRANDS_IN
];

// Asal negara
export const BRAND_ORIGIN: Record<string,string> = {
  // Jepang
  Toyota:"Jepang", Nissan:"Jepang", Mitsubishi:"Jepang", Honda:"Jepang", Mazda:"Jepang", Subaru:"Jepang",
  Suzuki:"Jepang", Daihatsu:"Jepang", Lexus:"Jepang", Infiniti:"Jepang", Acura:"Jepang", Isuzu:"Jepang",

  // Eropa
  BMW:"Jerman", "Mercedes-Benz":"Jerman", Audi:"Jerman", Volkswagen:"Jerman", Porsche:"Jerman",
  Ferrari:"Italia", Lamborghini:"Italia", "Alfa Romeo":"Italia", Maserati:"Italia", Fiat:"Italia", Lancia:"Italia",
  Volvo:"Swedia",
  Peugeot:"Prancis", Renault:"Prancis", Citroën:"Prancis", Bugatti:"Prancis", Dacia:"Rumania",
  Skoda:"Ceko", Seat:"Spanyol", Cupra:"Spanyol", Opel:"Jerman", Smart:"Jerman",
  "Aston Martin":"Inggris", Bentley:"Inggris", "Rolls-Royce":"Inggris", McLaren:"Inggris",
  Mini:"Inggris", Jaguar:"Inggris", "Land Rover":"Inggris", Lotus:"Inggris",

  // Amerika
  Ford:"Amerika Serikat", Chevrolet:"Amerika Serikat", Dodge:"Amerika Serikat", Tesla:"Amerika Serikat",
  Cadillac:"Amerika Serikat", Jeep:"Amerika Serikat", GMC:"Amerika Serikat", Lincoln:"Amerika Serikat",
  Rivian:"Amerika Serikat", Lucid:"Amerika Serikat", Chrysler:"Amerika Serikat", Buick:"Amerika Serikat",
  RAM:"Amerika Serikat", Hummer:"Amerika Serikat", Pontiac:"Amerika Serikat", Plymouth:"Amerika Serikat",

  // Korea
  Hyundai:"Korea Selatan", Kia:"Korea Selatan", Genesis:"Korea Selatan",

  // China
  BYD:"Tiongkok", NIO:"Tiongkok", XPeng:"Tiongkok", Geely:"Tiongkok", Chery:"Tiongkok", "Great Wall":"Tiongkok",
  Haval:"Tiongkok", Wuling:"Tiongkok", MG:"Tiongkok", Ora:"Tiongkok", "Lynk & Co":"Tiongkok",
  Zeekr:"Tiongkok", "Li Auto":"Tiongkok", Hongqi:"Tiongkok", Leapmotor:"Tiongkok", Aion:"Tiongkok", Neta:"Tiongkok", Seres:"Tiongkok",

  // India
  Tata:"India", Mahindra:"India", "Maruti Suzuki":"India", "Force Motors":"India",
};

// Alias/typo populer (KEY HARUS lowercase)
export const BRAND_ALIASES: Record<string,string> = {
  // Jepang
  "toyta":"Toyota","totyota":"Toyota","hond":"Honda","hondaa":"Honda","madza":"Mazda","mzd":"Mazda",
  "nisan":"Nissan","mitsu":"Mitsubishi","suzi":"Suzuki","dayhatsu":"Daihatsu",
  "lexusis":"Lexus","infinitiq":"Infiniti","akura":"Acura","isuzu":"Isuzu",

  // Eropa
  "bmw":"BMW","bimmer":"BMW","bemer":"BMW","benw":"BMW",
  "mercedes":"Mercedes-Benz","mercy":"Mercedes-Benz","merc":"Mercedes-Benz","mb":"Mercedes-Benz",
  "audiq":"Audi","vw":"Volkswagen","vag":"Volkswagen",
  "porche":"Porsche","porshe":"Porsche",
  "lambo":"Lamborghini","lamborgini":"Lamborghini",
  "ferrari":"Ferrari","ferari":"Ferrari","ferarri":"Ferrari",
  "alfa":"Alfa Romeo","romeo":"Alfa Romeo",
  "peuge":"Peugeot","pug":"Peugeot",
  "renny":"Renault","reno":"Renault",
  "bugati":"Bugatti","bugatii":"Bugatti",
  "aston":"Aston Martin","am":"Aston Martin","astonmartin":"Aston Martin",
  "bently":"Bentley","bentlye":"Bentley",
  "rr":"Rolls-Royce","rolls":"Rolls-Royce","rrover":"Land Rover","rangerover":"Land Rover",
  "jag":"Jaguar","jaggy":"Jaguar","mini":"Mini",
  "citroen":"Citroën","opal":"Opel","opell":"Opel",
  "skodaa":"Skoda","seatcar":"Seat","cupra":"Cupra","lotuss":"Lotus",

  // Amerika
  "fordtruck":"Ford","mustang":"Ford",
  "chev":"Chevrolet","chevy":"Chevrolet","chevorlet":"Chevrolet","camaro":"Chevrolet","corvet":"Chevrolet",
  "dodg":"Dodge","challenger":"Dodge","charger":"Dodge",
  "teslaa":"Tesla","tesle":"Tesla","teslacar":"Tesla",
  "cadilac":"Cadillac","caddy":"Cadillac",
  "jeepcar":"Jeep","wrangler":"Jeep","rubicon":"Jeep",
  "gmcusa":"GMC","lincolin":"Lincoln","luciid":"Lucid","riviann":"Rivian",
  "ramtruck":"RAM","humer":"Hummer","pontiacgto":"Pontiac","plymoth":"Plymouth",

  // Korea
  "hyndai":"Hyundai","hyun":"Hyundai","hyundae":"Hyundai",
  "kiaa":"Kia","kiamotors":"Kia","genessis":"Genesis","genesi":"Genesis",

  // China
  "byd":"BYD","bidy":"BYD","nio":"NIO","xpeng":"XPeng",
  "geeli":"Geely","cheryy":"Chery","greatwall":"Great Wall","havalcar":"Haval","wulingair":"Wuling",
  "mgcar":"MG","oracar":"Ora","lynkco":"Lynk & Co","zeeker":"Zeekr","zeekar":"Zeekr","liauto":"Li Auto",
  "hongqi":"Hongqi","leap":"Leapmotor","aion":"Aion","neta":"Neta","seres":"Seres",

  // India
  "tataa":"Tata","mahindraa":"Mahindra","marutis":"Maruti Suzuki","marutisuzuki":"Maruti Suzuki",
  "forcemotor":"Force Motors",
};