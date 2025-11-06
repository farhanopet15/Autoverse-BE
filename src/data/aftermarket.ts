// /data/aftermarket.ts
export const SEGMENTS = [
  "Kei/City Car","Compact Hatchback","Hatchback","Subcompact Sedan","Compact Sedan","Mid-size Sedan","Full-size Sedan",
  "Coupe","Convertible","Roadster","Grand Tourer (GT)","Sports Car","Supercar","Hypercar",
  "Wagon","Shooting Brake","SUV","Compact SUV","Mid-size SUV","Full-size SUV","Crossover","Crossover Coupe",
  "Off-road/4x4","Pickup","Truck","Van","MPV/Minivan","Luxury","Executive","Performance","EV/Hybrid","Commercial","Taxi/Utility"
];

export const BODY_STYLES = [
  "2-door","3-door","4-door","5-door",
  "Fastback","Liftback","Notchback","Shooting Brake",
  "Roadster","Convertible","Targa","T-top","Spider","Cabriolet",
  "Coupe-SUV","Crossover","SUV","MPV","Van","Minivan",
  "Crew Cab","Double Cab","Single Cab","Extended Cab",
  "Pickup","Panel Van","Utility","Off-roader"
];

export const POWERTRAINS = [
  "NA (Naturally Aspirated)","Turbocharged","Twin-Turbo","Supercharged","Bi-Turbo","Quad-Turbo",
  "Mild-Hybrid (MHEV)","Hybrid (HEV)","Plug-in Hybrid (PHEV)","Range-Extender Hybrid",
  "EV (Battery Electric)","Fuel Cell (FCEV)","Hydrogen Combustion","Rotary Range Extender",
  "Diesel","Petrol","E85 Flex-Fuel","Biofuel","CNG/LPG","Hydrogen ICE"
];

export const DRIVETRAINS = [
  "FWD","RWD","AWD","4WD","Part-time 4x4","Full-time 4x4","Rear-biased AWD","Front-biased AWD",
  "Selectable AWD","On-demand AWD","Torsen AWD","e-AWD (Electric AWD)"
];

export const AFTERMARKET = {
  engine: [
    "HKS","Tomei","Greddy","BLITZ","Mugen","TRD","Nismo","Ralliart","Spoon Sports","AEM",
    "K&N","Cobb","APR","Roush","ABT","Edelbrock","Mountune","Revo","Skunk2","Toda Racing",
    "Cusco","TDI Tuning","Hennessey Performance","Litchfield","Amuse","APR Stage"
  ],
  exhaust: [
    "Akrapovic","Tomei Expreme Ti","Armytrix","Remus","Borla","Invidia","Greddy","HKS Hi-Power",
    "Milltek","Capristo","Fi Exhaust","IPE","Kreissieg","Supersprint","AWE Tuning","J's Racing",
    "Trust Power Extreme","Amuse R1 Titan","Japspeed","Flowmaster"
  ],
  suspension: [
    "TEIN","KW","Ohlins","Bilstein","Cusco","HKS Hipermax","BC Racing","Eibach","H&R","Koni",
    "ST Suspensions","Hotchkis","Fortune Auto","Air Lift Performance","Megan Racing","Tanabe",
    "Swift Springs","Buddy Club","Greddy Performance Damper"
  ],
  brake: [
    "Brembo","AP Racing","Endless","Project μ","StopTech","Alcon","Wilwood","Tarox","D2 Racing",
    "EBC Brakes","Power Stop","Rotora","Ferodo","Carbotech","K-Sport"
  ],
  wheel: [
    "Rays/Volk Racing TE37","BBS","Enkei","OZ Racing","Work","SSR","Advan Racing","Rotiform","HRE",
    "Vossen","Forgiato","American Racing","Konig","Fifteen52","WedsSport","Nismo LMGT4","Gram Lights","Motegi","Rohana"
  ],
  electronics: [
    "ECUtek","Cobb","Bootmod3","Haltech","LinkECU","Hondata","MoTeC","Syvecs","AEM Infinity",
    "MegaSquirt","UpRev","HP Tuners","OpenFlash Tablet","RaceChip","ECUMaster","DinanTronics","BimmerCode"
  ],
  aero: [
    "Varis","Voltex","APR Performance","Liberty Walk","Rocket Bunny/Pandem","TRD Aero","Mugen Aero",
    "Nismo Aero","Ralliart Aero","Top Secret","Veilside","Chargespeed","C-West","Abflug","Kuhl Racing",
    "RE Amemiya","LB Performance","Garage Mak","Tommykaira","Duke Dynamics","Vorsteiner"
  ],
  tire: [
    "Michelin Pilot Sport","Bridgestone Potenza","Pirelli P Zero","Continental SportContact","Yokohama Advan",
    "Toyo Proxes","Nitto NT","Hankook Ventus","Goodyear Eagle F1","Dunlop Direzza","Kumho Ecsta","Falken Azenis",
    "Maxxis Victra","Achilles ATR","Federal 595RS-R","Nankang AR-1","GT Radial Champiro"
  ]
} as const;