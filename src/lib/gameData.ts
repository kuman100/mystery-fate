// src/lib/gameData.ts

export interface Player {
  id?: string;
  nama: string;
  skor: number;
  karakter: string;
  deskripsi: string;
  luckyItem: string;
  auraColor: string;
  khodam: string;
  stats: {
    love: number;
    money: number;
    health: number;
  };
  waktu: number;
  isEasterEgg?: boolean;
}

export const luckyItems = [
  "Cincin Akik", "Kucing Oren", "Koin 500 Melati", "Sapu Lidi", 
  "Charger Ori", "Seblak Ceker", "Doa Ibu", "Helm Bogo", 
  "Kartu BPJS", "Powerbank", "Tisu Magic", "Voucher Gofood", 
  "Kipas Angin", "Gantungan Kunci", "Sendal Jepit Swallow",
  "Tupperware Emak", "Galon Le Minerale", "Token Listrik 20rb"
];

export const auraColors = [
  "Merah Merona", "Hijau Stabilo", "Ungu Janda", "Hitam Legam", 
  "Pink Unyu", "Emas Berkilau", "Putih Suci", "Pelangi", 
  "Biru Langit", "Jingga Senja", "Abu Monyet", "Neon Cyber"
];

export const khodamList = [
  "Harimau Sumbing", "Kulkas 2 Pintu", "Nyi Blorong KW", "Tuyul Insyaf", 
  "Vario Getar", "Kosong (Khodam Cuti)", "Raja Lele", "Cicak Dinding",
  "Poci Gaul", "Badarawuhi", "Mio Mirza", "Skibidi Toilet", "Beban Keluarga", 
  "Kuntilanak Merah", "Amba Tukam", "Rusdi Ngawi", "Kak Gem", "Sempak Firaun",
  "Buaya Darat", "Siluman Capybara", "Kecoa Terbang"
];

export const daftarKarakter = [
  { min: 90, title: "KING OF HOKI 2026 👑", desc: ["Rezeki deras banget!", "Fix jadi Sultan!", "Definisi 'Ganteng + Kaya'."], color: "text-yellow-300", bgGradient: "from-yellow-600/40 to-amber-800/40" },
  { min: 75, title: "GACOR PARAH 🔥", desc: ["Otw sukses jalur langit.", "Full senyum tahun depan.", "Aura orang kaya kelihatan."], color: "text-emerald-300", bgGradient: "from-emerald-600/40 to-green-800/40" },
  { min: 50, title: "PEJUANG TANGGUH 💪", desc: ["Kerja keras bagai kuda.", "Masih aman terkendali.", "Kurangin scroll TikTok!"], color: "text-blue-300", bgGradient: "from-blue-600/40 to-indigo-800/40" },
  { min: 30, title: "KAUM MENDANG-MENDING 🤔", desc: ["Hati-hati kantong jebol.", "Ujian hidup agak banyak.", "Kurangin jajan kopi!"], color: "text-orange-300", bgGradient: "from-orange-600/40 to-red-800/40" },
  { min: 0,  title: "BUTUH RUQYAH 👻", desc: ["Bau-bau sengkuni.", "Aura gelap banget bang.", "Sabar... ini cobaan."], color: "text-red-400", bgGradient: "from-red-900/60 to-black/60" }
];

// --- ALGORITMA V4: LOGIKA "MIRROR FATE" ---
export function generateSmartStats(mainScore: number) {
  // Helper biar angka gak tembus 100 atau min 0
  const clamp = (val: number) => Math.min(100, Math.max(0, val));
  const rand = (min: number, max: number) => Math.floor(Math.random() * (max - min + 1) + min);

  // 1. KEUANGAN: Erat banget sama Hoki (± 10%)
  // Kalau Hoki 12%, Uang cuma berkisar 2-22%. (Miskin beneran).
  let money = clamp(mainScore + rand(-10, 10));

  // 2. ASMARA: Mengikuti Hoki dengan variasi sedang (± 25%)
  // Kalau Hoki 12%, Asmara maks 37%. (Susah dapet jodoh kalau hidup lagi susah).
  let love = clamp(mainScore + rand(-25, 25));

  // 3. KESEHATAN: Base 30 + Setengah Hoki
  // Kalau Hoki 12% -> Base 30 + 6 + variasi = Sekitar 40-50%. (Agak sakit karena stres).
  // Kalau Hoki 90% -> Base 30 + 45 + variasi = Sekitar 80-90%. (Sehat walafiat).
  let health = clamp(30 + (mainScore * 0.5) + rand(-10, 15));

  return { love, money, health };
}

// --- CHEAT CODES TETAP ADA ---
export function checkEasterEgg(nama: string): Player | null {
  const lowerName = nama.toLowerCase().trim();
  const now = Date.now();

  if (lowerName === "!admin" || lowerName === "!creator") {
    return {
      nama: "THE CREATOR 🛠️", skor: 9999, karakter: "GOD MODE",
      deskripsi: "Anda yang mengatur takdir, bukan diatur takdir.",
      luckyItem: "Infinity Gauntlet", auraColor: "Neon RGB", khodam: "Server Pusat",
      stats: { love: 100, money: 100, health: 100 }, waktu: now, isEasterEgg: true
    };
  }

  if (lowerName === "galau" || lowerName === "sadboy") {
    return {
      nama: "DUTA SADBOY 🥀", skor: 12, karakter: "AURA MENDUNG",
      deskripsi: "Langit bisakah kau turunkan hujan...",
      luckyItem: "Tisu Magic", auraColor: "Abu-abu", khodam: "Mantan Terindah",
      stats: { love: 0, money: 80, health: 60 }, waktu: now, isEasterEgg: true
    };
  }
  
  if (lowerName === "!wibu" || lowerName === "wibu") {
    return {
      nama: "RAJA ISEKAI ⚔️", skor: 88, karakter: "MAIN CHARACTER",
      deskripsi: "Kekuatan persahabatan menyertaimu!",
      luckyItem: "Dakimakura", auraColor: "Pink Neon", khodam: "Hatsune Miku",
      stats: { love: 5, money: 40, health: 100 }, waktu: now, isEasterEgg: true
    };
  }

  if (lowerName === "!kpop" || lowerName === "army") {
    return {
      nama: "ISTRINYA BIAS 🫰", skor: 95, karakter: "VISUAL CENTER",
      deskripsi: "Siap war tiket konser!",
      luckyItem: "Photocard", auraColor: "Ungu BTS", khodam: "Lightstick",
      stats: { love: 100, money: 10, health: 90 }, waktu: now, isEasterEgg: true
    };
  }

  if (lowerName === "!mahasiswa" || lowerName === "skripsi") {
    return {
      nama: "PEJUANG REVISI 🎓", skor: 45, karakter: "AURA BEGADANG",
      deskripsi: "Dosen pembimbing menghilang...",
      luckyItem: "Kopi Sachet", auraColor: "Mata Panda", khodam: "Dosen Killer",
      stats: { love: 10, money: 5, health: 30 }, waktu: now, isEasterEgg: true
    };
  }
  
  if (lowerName === "!koruptor") {
    return {
      nama: "TIKUS KANTOR 🐀", skor: -99, karakter: "BURONAN KPK",
      deskripsi: "Uang banyak tapi tidur gak nyenyak.",
      luckyItem: "Rompi Oranye", auraColor: "Hijau Duit", khodam: "Orang Dalem",
      stats: { love: 50, money: 100, health: 90 }, waktu: now, isEasterEgg: true
    };
  }

  if (lowerName === "!bocil" || lowerName === "epep") {
    return {
      nama: "PRO PLAYER 🎮", skor: 77, karakter: "SPUH SEPUH",
      deskripsi: "Ingat dek, sekolah nomor 1, top up nomor 2.",
      luckyItem: "Alok Gratis", auraColor: "Biru Es", khodam: "Admin Moonton",
      stats: { love: 10, money: 5, health: 100 }, waktu: now, isEasterEgg: true
    };
  }

  return null;
}