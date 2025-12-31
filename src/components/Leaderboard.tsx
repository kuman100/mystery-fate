'use client';
import { useEffect, useState } from 'react';
import { db } from '../app/firebase';
import { ref, query, orderByChild, limitToLast, limitToFirst, onValue } from 'firebase/database';
import { Player } from '../lib/algorithm';

export default function Leaderboard() {
  const [activeTab, setActiveTab] = useState<'sultan' | 'ngenes'>('sultan');
  const [sultans, setSultans] = useState<Player[]>([]);
  const [ngenes, setNgenes] = useState<Player[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // 1. Ambil 10 Sultan (Skor Tertinggi)
    const sultanRef = query(ref(db, 'players'), orderByChild('skor'), limitToLast(10));
    // 2. Ambil 10 Ngenes (Skor Terendah)
    const ngenesRef = query(ref(db, 'players'), orderByChild('skor'), limitToFirst(10));

    const unsubSultan = onValue(sultanRef, (snapshot) => {
      const data: Player[] = [];
      snapshot.forEach((child) => { data.push(child.val()); });
      // Firebase urutannya Ascending (kecil ke besar), jadi untuk Sultan harus dibalik
      setSultans(data.reverse());
    });

    const unsubNgenes = onValue(ngenesRef, (snapshot) => {
      const data: Player[] = [];
      snapshot.forEach((child) => { data.push(child.val()); });
      // Ngenes tidak perlu dibalik karena sudah Ascending (kecil ke besar)
      setNgenes(data);
      setLoading(false);
    });

    return () => { unsubSultan(); unsubNgenes(); };
  }, []);

  const ListPlayer = ({ data, type }: { data: Player[], type: 'sultan' | 'ngenes' }) => (
    <div className="space-y-3 mt-4 h-[400px] overflow-y-auto pr-2 custom-scrollbar">
      {data.map((p, i) => (
        <div key={i} className={`p-3 rounded-xl border flex items-center justify-between transition-all hover:scale-[1.02] ${
            type === 'sultan' 
            ? 'bg-gradient-to-r from-yellow-900/20 to-transparent border-yellow-500/20' 
            : 'bg-gradient-to-r from-gray-800/40 to-transparent border-gray-700/50'
        }`}>
            <div className="flex items-center gap-3">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm ${
                    i === 0 ? 'bg-yellow-500 text-black' : 
                    i === 1 ? 'bg-gray-400 text-black' : 
                    i === 2 ? 'bg-orange-700 text-white' : 'bg-gray-800 text-gray-400'
                }`}>
                    {i + 1}
                </div>
                <div>
                    <div className="font-bold text-sm text-white capitalize">{p.nama}</div>
                    <div className="text-[10px] text-gray-400">{p.karakter}</div>
                </div>
            </div>
            <div className={`font-black text-xl ${type === 'sultan' ? 'text-yellow-400' : 'text-gray-400'}`}>
                {p.skor}%
            </div>
        </div>
      ))}
      {data.length === 0 && !loading && (
          <div className="text-center text-gray-500 text-xs py-10">Belum ada data...</div>
      )}
    </div>
  );

  return (
    <div className="w-full h-full bg-gray-900/50 border border-white/10 rounded-3xl p-5 backdrop-blur-sm flex flex-col">
      <h3 className="text-xl font-black text-center mb-4 uppercase tracking-wider text-white">🏆 Klasemen Hoki</h3>
      
      {/* TABS */}
      <div className="flex p-1 bg-black/40 rounded-xl mb-2">
        <button 
            onClick={() => setActiveTab('sultan')}
            className={`flex-1 py-2 text-xs font-bold rounded-lg transition-all ${
                activeTab === 'sultan' ? 'bg-yellow-600 text-white shadow-lg' : 'text-gray-500 hover:text-white'
            }`}
        >
            👑 TOP SULTAN
        </button>
        <button 
            onClick={() => setActiveTab('ngenes')}
            className={`flex-1 py-2 text-xs font-bold rounded-lg transition-all ${
                activeTab === 'ngenes' ? 'bg-gray-700 text-white shadow-lg' : 'text-gray-500 hover:text-white'
            }`}
        >
            👻 TOP NGENES
        </button>
      </div>

      {/* LIST CONTENT */}
      {loading ? (
          <div className="flex-1 flex items-center justify-center text-gray-500 text-xs animate-pulse">Memuat Data...</div>
      ) : (
          activeTab === 'sultan' ? <ListPlayer data={sultans} type="sultan"/> : <ListPlayer data={ngenes} type="ngenes"/>
      )}
    </div>
  );
}