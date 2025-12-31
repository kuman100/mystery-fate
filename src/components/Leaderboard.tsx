'use client';

import { useEffect, useState } from 'react';
import { db } from '../app/firebase';
import { ref, onValue, query, orderByChild, limitToLast } from 'firebase/database';
import { Player } from '../lib/gameData';

export default function Leaderboard() {
  const [leaderboard, setLeaderboard] = useState<Player[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Ambil 50 data terakhir
    const playersRef = query(ref(db, 'players'), orderByChild('skor'), limitToLast(50));
    
    const unsubscribe = onValue(playersRef, (snapshot) => {
      const data: Player[] = [];
      if (snapshot.exists()) {
        snapshot.forEach((child) => {
          data.push(child.val() as Player);
        });
      }
      setLeaderboard(data.reverse());
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  return (
    // PERUBAHAN: Hapus h-full, biarkan tingginya menyesuaikan konten tapi dibatasi
    <div className="w-full bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl p-4 md:p-6 shadow-2xl flex flex-col relative overflow-hidden">
      
      {/* Header */}
      <div className="flex items-center justify-between mb-4 flex-shrink-0 border-b border-white/10 pb-3">
        <h3 className="text-sm font-bold text-yellow-400 uppercase tracking-widest flex items-center gap-2">
          🏆 Top 5 Family
        </h3>
        <span className="text-[10px] bg-red-600/80 text-white px-2 py-0.5 rounded font-bold animate-pulse border border-red-400">
          LIVE
        </span>
      </div>

      {/* PERUBAHAN UTAMA DI SINI:
          max-h-[350px] -> Membatasi tinggi agar cuma muat +/- 5 orang
          overflow-y-auto -> Sisanya di-scroll
      */}
      <div className="overflow-y-auto custom-scrollbar space-y-2 pr-2 max-h-[300px] md:max-h-[350px]">
        
        {loading && <div className="text-center py-10 text-gray-500 animate-pulse text-xs">Memuat data...</div>}

        {!loading && leaderboard.length === 0 && (
          <div className="py-10 flex flex-col items-center justify-center opacity-30 text-center">
            <span className="text-3xl mb-2">👻</span>
            <p className="text-xs">Belum ada korban...</p>
          </div>
        )}

        {leaderboard.map((player, idx) => (
          <div key={idx} className={`flex items-center gap-3 p-3 rounded-xl border transition-all cursor-default ${player.isEasterEgg ? 'bg-yellow-900/20 border-yellow-500/30' : 'bg-black/20 border-white/5 hover:bg-white/5'}`}>
            {/* Nomor Ranking */}
            <div className={`w-8 h-8 flex-shrink-0 flex items-center justify-center rounded-lg font-bold text-sm shadow-lg ${idx === 0 ? "bg-gradient-to-br from-yellow-300 to-yellow-600 text-yellow-900" : idx === 1 ? "bg-gradient-to-br from-gray-300 to-gray-500 text-gray-900" : idx === 2 ? "bg-gradient-to-br from-orange-400 to-amber-700 text-amber-100" : "bg-white/5 text-gray-500"}`}>
              {idx === 0 ? '👑' : idx + 1}
            </div>

            {/* Info */}
            <div className="flex-1 min-w-0">
              <div className={`font-bold text-sm truncate ${player.isEasterEgg ? 'text-yellow-400' : 'text-white'}`}>{player.nama}</div>
              <div className="text-[10px] text-gray-400 truncate">{player.karakter}</div>
            </div>

            {/* Skor */}
            <div className="text-right">
              <span className={`block font-black ${idx < 3 ? 'text-yellow-400' : 'text-gray-500'} text-sm`}>{player.skor}%</span>
            </div>
          </div>
        ))}
      </div>
      
      {/* Indikator Scroll Kecil di Bawah */}
      <div className="text-center mt-2 text-[9px] text-gray-600 italic">
        Scroll untuk lihat lainnya ↓
      </div>
    </div>
  );
}