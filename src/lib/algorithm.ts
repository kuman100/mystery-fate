// src/lib/algorithm.ts
import { 
  itemsSultan, itemsWarga, itemsApes,
  khodamsSultan, khodamsWarga, khodamsApes,
  resolutionsSultan, resolutionsWarga, resolutionsApes
} from './database';

export interface Player {
  id?: string;
  nama: string;
  skor: number;
  karakter: string;
  deskripsi: string;
  luckyItem: string;
  auraColor: string;
  khodam: string;
  resolusi: string;
  stats: {
    love: number;
    money: number;
    health: number;
  };
  waktu: number;
  isEasterEgg?: boolean;
}

// --- 1. FITUR FILTER KATA KASAR (YANG HILANG TADI) ---
const badWords = [
  "anjing", "babi", "kontol", "memek", "jembut", "bangsat", "tolol", "goblok", 
  "pantek", "ngentot", "meki", "titit", "peju", "fuck", "shit", "bitch", "lonte",
  "kntl", "mmk", "ajg", "bgst", "jancok", "asu"
];

export function isBadWord(text: string): boolean {
  const lower = text.toLowerCase();
  // Cek apakah mengandung kata kasar
  return badWords.some(word => lower.includes(word));
}

// Helper Random
const randArr = (arr: string[]) => arr[Math.floor(Math.random() * arr.length)];
const randNum = (min: number, max: number) => Math.floor(Math.random() * (max - min + 1) + min);

// --- 2. GENERATOR LOGIC V8 (RATA-RATA MURNI) ---
export function generateSmartData() {
  // A. Tentukan Nasib Dasar (Random 0-100 untuk menentukan Tier)
  const baseLuck = Math.floor(Math.random() * 101);
  
  let item, khodam, resolusi, love, money, health;

  // B. Generate Statistik Berdasarkan Tier
  if (baseLuck >= 85) { 
    // SULTAN (Stats Tinggi)
    item = randArr(itemsSultan); khodam = randArr(khodamsSultan); resolusi = randArr(resolutionsSultan);
    money = randNum(85, 100); love = randNum(80, 100); health = randNum(85, 100);
  } 
  else if (baseLuck >= 45) { 
    // WARGA (Stats Menengah)
    item = randArr(itemsWarga); khodam = randArr(khodamsWarga); resolusi = randArr(resolutionsWarga);
    money = randNum(40, 80); love = randNum(30, 90); health = randNum(50, 95);
  } 
  else { 
    // APES (Stats Rendah)
    item = randArr(itemsApes); khodam = randArr(khodamsApes); resolusi = randArr(resolutionsApes);
    money = randNum(5, 35); love = randNum(0, 40); health = randNum(20, 60);
  }

  // C. HITUNG SKOR UTAMA DARI RATA-RATA (Matematika Pasti Benar)
  // Rumus: (Cinta + Uang + Sehat) dibagi 3
  const finalScore = Math.round((love + money + health) / 3);

  return {
    skor: finalScore, // Skor ini yang dipakai
    item, khodam, resolusi, 
    stats: { love, money, health }
  };
}

// --- 3. CHEAT CODES ---
export function checkEasterEgg(nama: string): Player | null {
  const lowerName = nama.toLowerCase().trim();
  const now = Date.now();

  const createCheat = (
    namaCheat: string, skor: number, karakter: string, deskripsi: string, 
    item: string, aura: string, khodam: string, resolusi: string,
    love: number, money: number, health: number
  ) => ({
    nama: namaCheat, skor, karakter, deskripsi, luckyItem: item, auraColor: aura, khodam, resolusi,
    stats: { love, money, health }, waktu: now, isEasterEgg: true
  });

  if (lowerName === "!admin" || lowerName === "!creator") 
    return createCheat("THE CREATOR 🛠️", 100, "GOD MODE", "Anda yang mengatur takdir.", "Infinity Gauntlet", "Neon RGB", "Server Pusat", "Menguasai Alam Semesta", 100, 100, 100);

  if (lowerName === "galau" || lowerName === "sadboy") 
    return createCheat("DUTA SADBOY 🥀", 46, "AURA MENDUNG", "Langit bisakah kau turunkan hujan...", "Tisu Magic", "Abu-abu", "Mantan Terindah", "Balikan sama mantan (Mimpi)", 0, 80, 60); 
  
  if (lowerName === "!wibu" || lowerName === "wibu") 
    return createCheat("RAJA ISEKAI ⚔️", 48, "MAIN CHARACTER", "Kekuatan persahabatan menyertaimu!", "Dakimakura Waifu", "Pink Neon", "Hatsune Miku", "Menikah dengan 2D", 5, 40, 100);

  if (lowerName === "!kpop" || lowerName === "army") 
    return createCheat("ISTRINYA BIAS 🫰", 66, "VISUAL CENTER", "Siap war tiket konser tahun depan!", "Photocard Rare", "Ungu BTS", "Oppa Korea", "Debut jadi Idol", 100, 10, 90);

  if (lowerName === "!skripsi" || lowerName === "mahasiswa") 
    return createCheat("PEJUANG REVISI 🎓", 15, "AURA BEGADANG", "Dosen pembimbing menghilang...", "Kopi Sachet", "Hitam Mata Panda", "Dosen Killer", "Lulus tahun ini (Amin)", 10, 5, 30);

  if (lowerName === "!bocil" || lowerName === "epep") 
    return createCheat("SEPUH EPEP 🔫", 36, "PRO PLAYER", "Sekolah no 1, Top up no 2.", "Voucher Topup", "Biru Es", "Admin Garena", "Jadi Top Global", 5, 5, 100);

  if (lowerName === "!jomblo" || lowerName === "jomblo") 
    return createCheat("BEBAN KELUARGA 🏠", 33, "NPC ABADI", "Jodohmu masih nyasar di Google Maps.", "Sabun Batang", "Transparan", "Cicak Dinding", "Dapet pacar (Mustahil)", 0, 20, 80);

  return null;
}