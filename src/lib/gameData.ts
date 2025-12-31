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

// =========================================
// 1. DATABASE RAKSASA (TIER SYSTEM V6)
// =========================================

// --- TIER SULTAN (Skor 85 - 100) ---
// Barang Mewah & Khodam Berkelas
const itemsSultan = [
  "Kunci Ferrari", "Black Card BCA", "Sertifikat Pulau", "Saham Google", "Iphone 16 Pro Max", 
  "Jam Rolex Emas", "Kunci Penthouse", "Emas Batangan 1kg", "Jet Pribadi", "Yacht Mewah", 
  "Sepatu Jordan Dior", "Tas Hermes Birkin", "Kartu Member Golf", "Villa di Bali", 
  "Crypto Bitcoin", "Rubicon Hitam", "Sertifikat Tanah Jaksel", "Helikopter Pribadi",
  "Mahkota Berlian", "Kartu Visa Infinite", "Paspor Diplomatik", "Lukisan Monalisa KW Super",
  "Pulau Pribadi", "Tambang Batubara", "Franchise Indomaret", "Hotel Bintang 5"
];
const khodamsSultan = [
  "Naga Emas", "Harimau Putih Siliwangi", "Ratu Pantai Selatan", "King Phoenix", "CEO Ghaib", 
  "Garuda Wisnu", "Singa Padang Pasir", "Raja Minyak", "Sultan Arab", "Dewa Judi", 
  "Ratu Adil", "Kuda Sembrani", "Elang Emas", "Penyihir Putih", "Guardian Angel",
  "Samurai Sepuh", "Raja Hutan", "Dewa Rezeki", "Kaisar Langit", "Panglima Perang"
];

// --- TIER MENENGAH / WARGA (Skor 45 - 84) ---
// Barang Sehari-hari & Khodam Standar/Lucu
const itemsWarga = [
  "Charger Original", "Helm Bogo", "Tupperware Emak", "Voucher Gofood", "Powerbank Xiaomi", 
  "Kipas Angin Portable", "Token Listrik 50rb", "Motor Beat", "Laptop Asus", "Sepatu Converse",
  "Kemeja Flanel", "Kartu BPJS Kelas 1", "Member Gym", "Kopi Starbucks", "Netflix Premium",
  "Paket Data Unlimited", "Headset Bluetooth", "Tumblr Corkcicle", "Kacamata Hitam", "Jaket Denim",
  "Jam Tangan Casio", "Parfum Minimarket", "Tas Selempang Eiger", "Dompet Kulit", "Uang Kaget"
];
const khodamsWarga = [
  "Kucing Oren", "Vario Getar", "Poci Gaul", "Badarawuhi", "Mio Mirza", 
  "Siluman Capybara", "Kura-kura Ninja", "Macan Cisewu", "Kodok Zuma", "Ayam Jago",
  "Kancil Bijak", "Burung Beo", "Kucing Kampung", "Anjing Husky", "Musang King",
  "Semut Pekerja", "Lebah Ganteng", "Kumbang Badak", "Belalang Tempur", "Kelelawar Malam"
];

// --- TIER APES / NOLEP (Skor 0 - 44) ---
// Barang Ngenes & Khodam Beban
const itemsApes = [
  "Sendal Putus", "Galon Kosong", "Tisu Magic Bekas", "Struk Hutang", "Karet Gelang Nasi Uduk", 
  "Dompet Kosong", "Mie Instan Kadaluarsa", "Sempak Bolong", "Korek Curanrek", "Hape Layar Retak",
  "Charger Rusak", "Motor Mogok", "Cicilan Paylater", "Kartu Perdana Hangus", "Baju Belum Dicuci",
  "Botol Kecap Kosong", "Sikat Gigi Mekar", "Sabun Batang Tipis", "Gayung Pecah", "Ember Bocor",
  "Kasur Kapuk Keras", "Bantal Iler", "Celana Sobek", "Uang Mainan", "Janji Manis"
];
const khodamsApes = [
  "Kecoa Terbang", "Cicak Kejepit", "Tuyul Magang", "Beban Keluarga", "Sempak Firaun", 
  "Setan Kredit", "Jin Pengangguran", "Hantu Galau", "Kuntilanak Sumbing", "Genderuwo Insecure",
  "Pocong Lompat Tali", "Sundel Bolong Oplas", "Jenglot Dehidrasi", "Siluman Biawak", "Tikus Kantor",
  "Lalat Ijo", "Nyamuk DBD", "Cacing Kremi", "Kutu Beras", "Sigung Bau"
];

// --- AURA COLORS (Ditambah) ---
export const auraColors = [
  "Merah Merona", "Hijau Stabilo", "Ungu Janda", "Hitam Legam", "Pink Unyu", "Emas Berkilau", 
  "Putih Suci", "Pelangi", "Biru Langit", "Neon Cyber", "Jingga Senja", "Abu Monyet", 
  "Coklat Tanah", "Silver Metalik", "Transparan", "Merah Marun"
];

// --- DESKRIPSI KARAKTER (Lebih Variatif) ---
export const daftarKarakter = [
  { 
    min: 85, title: "KING OF HOKI 2026 👑", 
    desc: ["Rezeki deras banget!", "Fix jadi Sultan!", "Definisi 'Ganteng + Kaya'.", "Tahun depan mandi uang!", "Semesta merestui dompetmu."], 
    color: "text-yellow-300" 
  },
  { 
    min: 65, title: "GACOR PARAH 🔥", 
    desc: ["Otw sukses jalur langit.", "Full senyum tahun depan.", "Aura orang kaya kelihatan.", "Karir melesat tajam!", "Banyak peluang emas datang."], 
    color: "text-emerald-300" 
  },
  { 
    min: 45, title: "PEJUANG TANGGUH 💪", 
    desc: ["Kerja keras bagai kuda.", "Masih aman terkendali.", "Kurangin scroll TikTok!", "Sedikit lagi sukses, semangat!", "Hasil tidak mengkhianati usaha."], 
    color: "text-blue-300" 
  },
  { 
    min: 25, title: "KAUM MENDANG-MENDING 🤔", 
    desc: ["Hati-hati kantong jebol.", "Ujian hidup agak banyak.", "Kurangin jajan kopi!", "Tabungan mulai menipis.", "Jangan kebanyakan gaya dulu."], 
    color: "text-orange-300" 
  },
  { 
    min: 0,  title: "BUTUH RUQYAH 👻", 
    desc: ["Bau-bau sengkuni.", "Aura gelap banget bang.", "Sabar... ini cobaan berat.", "Banyakin ibadah ya.", "Apes banget sumpah."], 
    color: "text-red-400" 
  }
];

// =========================================
// 2. ALGORITMA SINKRONISASI (Logic V6)
// =========================================
export function generateSmartData(skor: number) {
  const rand = (arr: string[]) => arr[Math.floor(Math.random() * arr.length)];
  const randNum = (min: number, max: number) => Math.floor(Math.random() * (max - min + 1) + min);

  let item, khodam, love, money, health;

  // LOGIKA KASTA (TIER LOCKING)
  // Memastikan Item & Stats 100% Sesuai Skor
  
  if (skor >= 85) { 
    // === TIER SULTAN (85-100) ===
    item = rand(itemsSultan);
    khodam = rand(khodamsSultan);
    // Sultan stats: Semuanya Hijau (Tinggi)
    money = randNum(90, 100); 
    love = randNum(80, 100);  
    health = randNum(85, 100);
  } 
  else if (skor >= 45) { 
    // === TIER WARGA (45-84) ===
    item = rand(itemsWarga);
    khodam = rand(khodamsWarga);
    // Warga stats: Variatif (Menengah)
    money = randNum(40, 80);  
    love = randNum(30, 90);   // Asmara bisa bagus/biasa
    health = randNum(50, 95); // Kesehatan rata-rata aman
  } 
  else { 
    // === TIER APES (0-44) ===
    item = rand(itemsApes);
    khodam = rand(khodamsApes);
    // Apes stats: Semuanya Merah (Rendah)
    money = randNum(1, 35);   // Uang seret
    love = randNum(0, 45);    // Asmara suram
    health = randNum(20, 60); // Gampang masuk angin
  }

  return {
    item,
    khodam,
    stats: { love, money, health }
  };
}

// =========================================
// 3. CHEAT CODES (EASTER EGGS)
// =========================================
export function checkEasterEgg(nama: string): Player | null {
  const lowerName = nama.toLowerCase().trim();
  const now = Date.now();

  // 1. GOD MODE
  if (lowerName === "!admin" || lowerName === "!creator" || lowerName === "ganteng") {
    return {
      nama: "THE CREATOR 🛠️", skor: 9999, karakter: "GOD MODE",
      deskripsi: "Anda yang mengatur takdir, bukan diatur takdir.",
      luckyItem: "Infinity Gauntlet", auraColor: "Neon RGB", khodam: "Server Pusat",
      stats: { love: 100, money: 100, health: 100 }, waktu: now, isEasterEgg: true
    };
  }

  // 2. MODE GALAU
  if (lowerName === "galau" || lowerName === "sadboy" || lowerName === "sadgirl") {
    return {
      nama: "DUTA SADBOY 🥀", skor: 11, karakter: "AURA MENDUNG",
      deskripsi: "Langit bisakah kau turunkan hujan dengan petir...",
      luckyItem: "Tisu Magic", auraColor: "Abu-abu", khodam: "Mantan Terindah",
      stats: { love: 0, money: 80, health: 60 }, waktu: now, isEasterEgg: true
    };
  }

  // 3. MODE WIBU
  if (lowerName === "!wibu" || lowerName === "wibu" || lowerName === "otaku") {
    return {
      nama: "RAJA ISEKAI ⚔️", skor: 88, karakter: "MAIN CHARACTER",
      deskripsi: "Kekuatan persahabatan menyertaimu!",
      luckyItem: "Dakimakura Waifu", auraColor: "Pink Neon", khodam: "Hatsune Miku",
      stats: { love: 5, money: 40, health: 100 }, waktu: now, isEasterEgg: true
    };
  }

  // 4. MODE KPOP
  if (lowerName === "!kpop" || lowerName === "army" || lowerName === "blink" || lowerName === "nctzen") {
    return {
      nama: "ISTRINYA BIAS 🫰", skor: 95, karakter: "VISUAL CENTER",
      deskripsi: "Siap war tiket konser tahun depan!",
      luckyItem: "Photocard Rare", auraColor: "Ungu BTS", khodam: "Oppa Korea",
      stats: { love: 100, money: 10, health: 90 }, waktu: now, isEasterEgg: true
    };
  }

  // 5. MODE SKRIPSI
  if (lowerName === "!skripsi" || lowerName === "mahasiswa" || lowerName === "semester akhir") {
    return {
      nama: "PEJUANG REVISI 🎓", skor: 45, karakter: "AURA BEGADANG",
      deskripsi: "Dosen pembimbing tiba-tiba menghilang...",
      luckyItem: "Kopi Sachet", auraColor: "Hitam Mata Panda", khodam: "Dosen Killer",
      stats: { love: 10, money: 5, health: 30 }, waktu: now, isEasterEgg: true
    };
  }

  // 6. MODE GAMER
  if (lowerName === "!bocil" || lowerName === "epep" || lowerName === "mlbb") {
    return {
      nama: "SEPUH EPEP 🔫", skor: 77, karakter: "PRO PLAYER",
      deskripsi: "Ingat dek, sekolah nomor 1, top up nomor 2.",
      luckyItem: "Voucher Topup", auraColor: "Biru Es", khodam: "Admin Garena",
      stats: { love: 10, money: 5, health: 100 }, waktu: now, isEasterEgg: true
    };
  }

  // 7. MODE JOMBLO
  if (lowerName === "!jomblo" || lowerName === "jomblo") {
    return {
      nama: "BEBAN KELUARGA 🏠", skor: 5, karakter: "NPC ABADI",
      deskripsi: "Jodohmu masih nyasar di Google Maps.",
      luckyItem: "Sabun Batang", auraColor: "Transparan", khodam: "Cicak Dinding",
      stats: { love: 0, money: 20, health: 80 }, waktu: now, isEasterEgg: true
    };
  }

  return null;
}