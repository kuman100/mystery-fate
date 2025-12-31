'use client';
import { useState, useRef } from 'react';
import { db } from '../app/firebase';
// Tambahkan import 'get', 'equalTo', 'orderByChild', 'query'
import { ref, push, get, query, orderByChild, equalTo } from 'firebase/database';
import html2canvas from 'html2canvas'; 
import confetti from 'canvas-confetti';
import { daftarKarakter, luckyItems, auraColors, khodamList, checkEasterEgg, generateSmartStats, Player } from '../lib/gameData';
import { playSfx } from './AudioPlayer';

export default function GameCard() {
  const [nama, setNama] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<Player | null>(null);
  
  const cardRef = useRef<HTMLDivElement>(null);

  const mainkanGacha = async () => {
    const cleanName = nama.trim();
    if (!cleanName) return alert("Isi nama dulu dong!");

    playSfx('click');
    setLoading(true);

    // --- TAHAP 1: CEK NAMA DUPLIKAT (Hanya untuk pemain biasa) ---
    // Cek apakah ini cheat code?
    const isCheat = checkEasterEgg(cleanName);

    // Jika BUKAN cheat, kita cek di database apakah nama sudah ada
    if (!isCheat) {
      const playersRef = query(ref(db, 'players'), orderByChild('nama'), equalTo(cleanName));
      const snapshot = await get(playersRef);

      if (snapshot.exists()) {
        setLoading(false);
        alert(`Nama "${cleanName}" sudah dipakai orang lain! 😅\nCoba pakai nama lain, misal: "${cleanName} 2"`);
        return; // Berhenti di sini, jangan lanjut
      }
    }

    // --- TAHAP 2: PROSES GACHA ---
    await new Promise(r => setTimeout(r, 2000));

    let dataBaru = isCheat; // Jika cheat, pakai data cheat yang sudah dicek di atas

    // Jika bukan cheat, generate random
    if (!dataBaru) {
      const skor = Math.floor(Math.random() * 101);
      const char = daftarKarakter.find(k => skor >= k.min)!;
      const smartStats = generateSmartStats(skor);

      dataBaru = {
        nama: cleanName,
        skor: skor,
        karakter: char.title,
        deskripsi: char.desc[Math.floor(Math.random() * char.desc.length)],
        luckyItem: luckyItems[Math.floor(Math.random() * luckyItems.length)],
        auraColor: auraColors[Math.floor(Math.random() * auraColors.length)],
        khodam: khodamList[Math.floor(Math.random() * khodamList.length)],
        stats: smartStats,
        waktu: Date.now()
      };
    }

    setResult(dataBaru);
    setLoading(false);

    // --- TAHAP 3: SIMPAN KE DATABASE (LOGIKA BARU) ---
    // HANYA simpan jika BUKAN Cheat Code (isEasterEgg false/undefined)
    if (!dataBaru.isEasterEgg) {
      push(ref(db, 'players'), dataBaru);
    } else {
      // Kalau Cheat, cuma muncul notif kecil di console (biar developer tau)
      console.log("Mode Cheat Aktif: Data tidak disimpan ke Leaderboard.");
    }

    // Efek Menang
    if (dataBaru.skor > 60 || dataBaru.isEasterEgg) {
      playSfx('win');
      confetti({ particleCount: 150, spread: 70, origin: { y: 0.6 } });
    }
  };

  const resetGame = () => { playSfx('click'); setResult(null); setNama(''); };

  const downloadImage = async () => {
    if (cardRef.current) {
      playSfx('click');
      try {
        await document.fonts.ready; 
        const canvas = await html2canvas(cardRef.current, {
          backgroundColor: '#0f172a',
          scale: 2, 
          useCORS: true,
          allowTaint: false,
        });
        const image = canvas.toDataURL("image/png");
        const link = document.createElement('a');
        link.href = image;
        link.download = `Ramalan-${result?.nama}-${Date.now()}.png`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
      } catch (error) {
        console.error(error);
        alert("Gagal simpan gambar. Coba di Chrome/Desktop.");
      }
    }
  };

  const StatBar = ({ label, val, hexColor }: { label: string, val: number, hexColor: string }) => (
    <div className="mb-2" style={{ fontFamily: 'sans-serif' }}>
      <div className="flex justify-between text-[10px] md:text-xs mb-1">
        <span style={{ color: '#d1d5db', fontWeight: 'bold' }}>{label}</span>
        <span style={{ color: '#ffffff' }}>{val ?? 0}%</span>
      </div>
      <div className="w-full rounded-full h-2" style={{ backgroundColor: 'rgba(0,0,0,0.4)' }}>
        <div 
          className="h-full rounded-full" 
          style={{ width: `${val ?? 0}%`, backgroundColor: hexColor }}
        ></div>
      </div>
    </div>
  );

  if (result) {
    const isSpecial = result.isEasterEgg;
    const bgStyle = isSpecial 
      ? { backgroundColor: '#000000', border: '2px solid #eab308' } 
      : { background: 'linear-gradient(to bottom right, #111827, #000000)', border: '1px solid #374151' };
    
    const titleColor = isSpecial ? '#facc15' : '#fb923c'; 
    const scoreColor = isSpecial ? '#fef08a' : '#ffffff';

    return (
      <div className="flex flex-col animate-in zoom-in duration-300 h-full w-full">
        <div 
          ref={cardRef}
          id="card-capture"
          className="p-5 rounded-3xl relative overflow-hidden flex flex-col items-center flex-1 justify-center"
          style={bgStyle}
        >
          <div className="absolute top-3 right-4 text-[8px] tracking-widest font-bold uppercase" style={{ color: 'rgba(255,255,255,0.3)' }}>
            Mystery Fate 2026
          </div>
          <div className="text-center mb-4 z-10 w-full mt-2">
            <h2 className="text-xl md:text-2xl font-black uppercase leading-tight mb-2" style={{ color: titleColor }}>
              {result.karakter}
            </h2>
            <div className="text-6xl md:text-7xl font-black tracking-tighter" style={{ color: scoreColor, textShadow: '0 4px 10px rgba(0,0,0,0.5)' }}>
              {result.skor}%
            </div>
            <p className="italic text-xs mt-2 px-4 leading-relaxed" style={{ color: '#9ca3af' }}>
              "{result.deskripsi}"
            </p>
          </div>
          <div className="w-full p-4 rounded-xl mb-4 z-10 shadow-inner backdrop-blur-sm" style={{ backgroundColor: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.05)' }}>
            <StatBar label="❤️ ASMARA" val={result.stats?.love} hexColor="#ec4899" />
            <StatBar label="💸 KEUANGAN" val={result.stats?.money} hexColor="#10b981" />
            <StatBar label="🏥 KESEHATAN" val={result.stats?.health} hexColor="#3b82f6" />
          </div>
          <div className="grid grid-cols-2 gap-2 w-full text-xs z-10 mb-2">
             <div className="p-2 rounded-lg text-center" style={{ backgroundColor: 'rgba(0,0,0,0.3)', border: '1px solid rgba(255,255,255,0.1)' }}>
               <span className="block text-[9px] uppercase tracking-wider mb-1" style={{ color: '#6b7280' }}>Khodam</span>
               <span className="font-bold text-[10px]" style={{ color: '#d8b4fe' }}>{result.khodam}</span>
             </div>
             <div className="p-2 rounded-lg text-center" style={{ backgroundColor: 'rgba(0,0,0,0.3)', border: '1px solid rgba(255,255,255,0.1)' }}>
               <span className="block text-[9px] uppercase tracking-wider mb-1" style={{ color: '#6b7280' }}>Item Hoki</span>
               <span className="font-bold text-[10px]" style={{ color: '#fde047' }}>{result.luckyItem}</span>
             </div>
          </div>
          <div className="mt-4 text-[8px] font-mono" style={{ color: '#4b5563' }}>
            Mainkan di: <b>mystery-fate.vercel.app</b>
          </div>
        </div>
        <div className="mt-4 flex gap-3">
            <button onClick={downloadImage} className="flex-1 bg-indigo-600 hover:bg-indigo-500 text-white py-3 rounded-xl font-bold text-sm shadow-lg shadow-indigo-900/30 transition-all flex items-center justify-center gap-2 active:scale-95">
                📸 Simpan
            </button>
            <button onClick={resetGame} className="w-1/3 bg-white/10 hover:bg-white/20 text-white py-3 rounded-xl font-bold text-sm transition-colors border border-white/10 active:scale-95">
                🔄 Lagi
            </button>
        </div>
      </div>
    );
  }
  return (
    <div className="w-full h-full flex flex-col justify-center items-center relative py-6 md:py-10">
      <div className="mb-6 text-6xl animate-bounce">🔮</div>
      <div className="text-center w-full max-w-xs space-y-4">
        <div>
           <p className="text-yellow-200 font-bold mb-2 tracking-widest text-xs uppercase">✨ Ramalan Paling Akurat ✨</p>
           <input type="text" value={nama} onChange={(e) => setNama(e.target.value)} className="w-full bg-black/40 border-2 border-white/10 rounded-2xl p-4 text-center text-lg font-bold focus:border-red-500 focus:ring-4 focus:ring-red-500/10 outline-none transition-all placeholder-gray-600 shadow-inner text-white" placeholder="Ketik Nama Panggilan..." />
        </div>
        <button onClick={mainkanGacha} disabled={loading} className={`w-full py-4 rounded-2xl font-black text-xl shadow-xl transition-all active:scale-95 group relative overflow-hidden ${loading ? 'bg-gray-700 cursor-not-allowed grayscale' : 'bg-gradient-to-r from-red-600 via-red-500 to-rose-600 border-b-4 border-red-800 hover:border-red-700 hover:-translate-y-1'}`}>
          <span className="relative z-10 flex items-center justify-center gap-2">{loading ? "⏳ MERACIK..." : "BUKA NASIB 🎲"}</span>
          {!loading && <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300"></div>}
        </button>
      </div>
      <p className="text-[10px] text-gray-600 mt-8 absolute bottom-0 opacity-50">Edisi Spesial 2026</p>
    </div>
  );
}