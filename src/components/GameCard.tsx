'use client';
import { useState, useRef, useEffect } from 'react';
import { db } from '../app/firebase';
import { ref, push, get, query, orderByChild, equalTo, onValue, runTransaction } from 'firebase/database';
import { toPng } from 'html-to-image'; 
import confetti from 'canvas-confetti';
import toast, { Toaster } from 'react-hot-toast';
import QRCode from 'react-qr-code';

import { daftarKarakter, auraColors } from '../lib/database';
import { checkEasterEgg, generateSmartData, isBadWord, Player } from '../lib/algorithm';
import { playSfx } from './AudioPlayer';

const StatBar = ({ label, val, hexColor }: { label: string, val: number, hexColor: string }) => (
  <div className="mb-3 w-full relative group">
    <div className="flex justify-between text-[10px] md:text-xs mb-1 z-10 relative">
      <span className="font-bold text-gray-200 tracking-wider flex items-center gap-1">{label}</span>
      <span className="font-mono text-white font-bold">{val}%</span>
    </div>
    <div className="w-full rounded-full h-3 bg-gray-800/50 border border-white/5 overflow-hidden backdrop-blur-sm relative">
      <div 
        className="h-full rounded-full transition-all duration-1000 relative" 
        style={{ 
            width: `${val}%`, 
            background: `linear-gradient(90deg, ${hexColor}88, ${hexColor})`,
            boxShadow: `0 0 10px ${hexColor}66`
        }}
      >
          <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-r from-transparent via-white/30 to-transparent animate-shimmer" style={{ backgroundSize: '200% 100%' }}></div>
      </div>
    </div>
  </div>
);

const NoiseOverlay = () => (
  <div style={{
    position: 'absolute', inset: 0, zIndex: -1, opacity: 0.07,
    backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`
  }}></div>
);

const getTheme = (skor: number, isEasterEgg?: boolean) => {
  if (isEasterEgg) return {
    bgWeb: 'border-yellow-500/50 bg-black', bgPoster: '#000000', accent: '#facc15',
    gradient: 'radial-gradient(circle at 50% 0%, #422006 0%, #000000 60%)'
  };
  if (skor >= 85) return { 
    bgWeb: 'border-yellow-500/30 bg-gradient-to-br from-gray-900 via-[#1a1500] to-black', bgPoster: '#0f0a00', accent: '#fcd34d',
    gradient: 'radial-gradient(circle at 50% 0%, #422006 0%, #0f0a00 60%)'
  };
  if (skor >= 45) return { 
    bgWeb: 'border-blue-500/30 bg-gradient-to-br from-gray-900 via-[#020617] to-black', bgPoster: '#020617', accent: '#60a5fa',
    gradient: 'radial-gradient(circle at 50% 0%, #1e1b4b 0%, #020617 60%)'
  };
  return {
    bgWeb: 'border-gray-700/30 bg-gradient-to-br from-gray-800 via-[#111] to-black grayscale-[0.8]', bgPoster: '#111111', accent: '#9ca3af',
    gradient: 'radial-gradient(circle at 50% 0%, #374151 0%, #111111 60%)'
  };
};

export default function GameCard() {
  const [nama, setNama] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<Player | null>(null);
  const [slotChar, setSlotChar] = useState("???"); 
  const [totalPlays, setTotalPlays] = useState(0); 

  const posterRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const countRef = ref(db, 'stats/total_played');
    const unsubscribe = onValue(countRef, (snapshot) => {
        const val = snapshot.val();
        setTotalPlays(val || 0);
    });
    return () => unsubscribe();
  }, []);

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (loading) {
      interval = setInterval(() => {
        const randomChar = daftarKarakter[Math.floor(Math.random() * daftarKarakter.length)].title;
        setSlotChar(randomChar);
      }, 80);
    }
    return () => clearInterval(interval);
  }, [loading]);

  const vibrate = (pattern: number | number[]) => {
      if (typeof navigator !== 'undefined' && navigator.vibrate) {
          navigator.vibrate(pattern);
      }
  };

  const mainkanGacha = async () => {
    const cleanName = nama.trim();
    if (!cleanName) { playSfx('click'); vibrate(100); toast.error("Nama tidak boleh kosong!", { icon: '🚫' }); return; }
    if (isBadWord(cleanName)) { playSfx('click'); vibrate(100); toast.error("Gunakan nama yang sopan ya.", { icon: '🤬' }); return; }

    const lastPlayed = localStorage.getItem('lastPlayedTimer');
    if (lastPlayed) {
        const diff = Date.now() - parseInt(lastPlayed);
        if (diff < 30000) { 
            const sisa = Math.ceil((30000 - diff) / 1000);
            playSfx('click'); vibrate([50, 50, 50]); 
            toast.error(`Tunggu ${sisa} detik lagi ya! ⏳`, { icon: '✋' });
            return;
        }
    }

    playSfx('click'); vibrate(50); setLoading(true);

    const isCheat = checkEasterEgg(cleanName);
    if (!isCheat) {
      try {
        const playersRef = query(ref(db, 'players'), orderByChild('nama'), equalTo(cleanName));
        const snapshot = await get(playersRef);
        if (snapshot.exists()) {
          setLoading(false);
          toast.error(`Nama "${cleanName}" sudah ada!`, { icon: '👯‍♂️' });
          return;
        }
      } catch (err) { console.error(err); }
    }

    await new Promise(r => setTimeout(r, 2000));
    
    let dataBaru = isCheat;
    if (!dataBaru) {
      const smartData = generateSmartData();
      const char = daftarKarakter.find(k => smartData.skor >= k.min)!;
      dataBaru = {
        nama: cleanName, skor: smartData.skor, karakter: char.title,
        deskripsi: char.desc[Math.floor(Math.random() * char.desc.length)],
        luckyItem: smartData.item, khodam: smartData.khodam, resolusi: smartData.resolusi,
        stats: smartData.stats, auraColor: auraColors[Math.floor(Math.random() * auraColors.length)],
        waktu: Date.now()
      };
      try {
        const countRef = ref(db, 'stats/total_played');
        runTransaction(countRef, (currentCount) => (currentCount || 0) + 1);
      } catch (e) { console.error("Counter Error", e); }
    }
    
    setResult(dataBaru); setLoading(false);
    localStorage.setItem('lastPlayedTimer', Date.now().toString());
    
    if (!dataBaru.isEasterEgg) push(ref(db, 'players'), dataBaru);
    
    if (dataBaru.skor > 60 || dataBaru.isEasterEgg) {
      playSfx('win'); vibrate([100, 50, 100, 50, 200]);
      confetti({ particleCount: 150, spread: 70, origin: { y: 0.6 } });
      toast.success("Ramalan terbuka!", { icon: '✨' });
    } else {
        vibrate(300); toast("Nasibmu sudah ditentukan...", { icon: '📜' });
    }
  };

  const resetGame = () => { playSfx('click'); vibrate(30); setResult(null); setNama(''); };

  const shareResult = async () => {
    playSfx('click'); vibrate(30);
    if (!result) return;
    const text = `Ramalan 2026 gw nih! 🤣\nNama: ${result.nama}\nKarakter: ${result.karakter}\nSkor Hoki: ${result.skor}%\n\nCek hoki lu disini:`;
    const url = 'https://mystery-fate.vercel.app';
    const fullText = `${text} ${url}`;

    if (navigator.share) {
      try { await navigator.share({ title: 'Mystery Fate 2026', text: fullText }); toast.success("Berhasil dibagikan!", { icon: '🚀' }); } 
      catch (err) { fallbackCopy(fullText); }
    } else { fallbackCopy(fullText); }
  };

  const fallbackCopy = async (textToCopy: string) => {
    try {
        if (navigator.clipboard && navigator.clipboard.writeText) {
            await navigator.clipboard.writeText(textToCopy);
            toast.success("Link disalin! (Share Manual ya)", { icon: '📋' });
        } else { throw new Error("Clipboard API error"); }
    } catch (err) {
        const textArea = document.createElement("textarea");
        textArea.value = textToCopy; textArea.style.position = "fixed"; textArea.style.left = "-9999px";
        document.body.appendChild(textArea); textArea.focus(); textArea.select();
        try { document.execCommand('copy'); toast.success("Link disalin!", { icon: '📋' }); } 
        catch (e) { toast.error("Gagal share."); } 
        finally { document.body.removeChild(textArea); }
    }
  };

  const downloadImage = async () => {
    if (posterRef.current) {
      playSfx('click'); vibrate(30);
      const toastId = toast.loading("Mencetak Poster HD...");
      try {
        await document.fonts.ready; await new Promise(r => setTimeout(r, 500));
        const theme = getTheme(result?.skor || 0, result?.isEasterEgg);
        const dataUrl = await toPng(posterRef.current, { cacheBust: true, pixelRatio: 2, backgroundColor: theme.bgPoster });
        const link = document.createElement('a');
        link.download = `MysteryFate-${result?.nama}.png`;
        link.href = dataUrl;
        link.click();
        toast.success("Poster Tersimpan!", { id: toastId, icon: '🖼️' });
      } catch (error) { console.error(error); toast.error("Gagal cetak poster.", { id: toastId }); }
    }
  };

  if (!result) {
    return (
      <div className="w-full h-full flex flex-col justify-center items-center relative py-6 md:py-10 animate-in fade-in zoom-in duration-500">
        <Toaster position="top-center" toastOptions={{ style: { background: '#1e293b', color: '#fff', border: '1px solid #334155' } }} />
        {totalPlays > 0 && (
            <div className="absolute top-0 right-0 m-4 px-3 py-1 bg-white/10 rounded-full border border-white/10 text-[10px] text-gray-400 font-mono animate-pulse">
                🔴 LIVE: {totalPlays.toLocaleString()} Played
            </div>
        )}
        <div className="mb-8 relative group cursor-pointer">
             <div className="text-7xl animate-bounce relative z-10">🔮</div>
             <div className="absolute inset-0 bg-purple-600 blur-[50px] opacity-20 group-hover:opacity-40 transition-opacity"></div>
        </div>
        <div className="text-center w-full max-w-xs space-y-6">
            <div className="relative">
              <div className="absolute -inset-0.5 bg-gradient-to-r from-pink-600 to-purple-600 rounded-2xl blur opacity-75 animate-pulse"></div>
              <div className="relative bg-gray-900 rounded-2xl p-1">
                 <input type="text" value={nama} onChange={(e) => setNama(e.target.value)} className="w-full bg-gray-900/90 rounded-xl p-4 text-center text-lg font-bold text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-500/50 transition-all uppercase tracking-widest" placeholder="NAMA PANGGILAN" />
              </div>
            </div>
            <button onClick={mainkanGacha} disabled={loading} className="w-full group relative px-8 py-4 bg-white text-black font-black text-xl rounded-2xl overflow-hidden transition-all hover:scale-[1.02] active:scale-95 shadow-[0_0_20px_rgba(255,255,255,0.3)]">
              <div className="absolute inset-0 w-full h-full bg-gradient-to-r from-transparent via-white/50 to-transparent -translate-x-full group-hover:animate-shimmer"></div>
              <span className="relative flex items-center justify-center gap-2">
                {loading ? (<span className="font-mono">{slotChar}</span>) : (<>BUKA TAKDIR <span className="text-xs align-top">2026</span></>)}
              </span>
            </button>
        </div>
        <p className="text-[10px] text-gray-500 mt-10 tracking-[0.2em] opacity-60">MYSTERY FATE PROJECT</p>
      </div>
    );
  }

  const theme = getTheme(result.skor, result.isEasterEgg);
  const titleColor = result.isEasterEgg ? '#fbbf24' : (result.skor >= 85 ? '#fcd34d' : (result.skor >= 45 ? '#fb923c' : '#9ca3af'));
  const scoreColor = '#ffffff';
  
  const posterStyle: React.CSSProperties = {
    width: '540px', height: '960px', backgroundColor: theme.bgPoster, backgroundImage: theme.gradient,
    display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'space-between', 
    padding: '30px 30px 35px 30px', fontFamily: 'sans-serif', position: 'absolute', top: 0, left: 0, zIndex: -50,
  };

  return (
    <div className="flex flex-col animate-in zoom-in duration-500 h-full w-full relative">
      <Toaster position="top-center" toastOptions={{ style: { background: '#1e293b', color: '#fff' } }} />

      <div className={`p-6 rounded-[32px] border backdrop-blur-md relative overflow-hidden flex flex-col items-center flex-1 justify-center shadow-2xl ${theme.bgWeb}`}>
        <div className={`absolute -top-20 -right-20 w-40 h-40 ${result.skor >= 45 ? 'bg-yellow-600' : 'bg-gray-600'} rounded-full blur-[80px] opacity-20`}></div>
        <div className="text-center mb-6 z-10 w-full mt-2 relative">
          <div className="inline-block px-3 py-1 rounded-full bg-white/5 border border-white/10 text-[10px] tracking-widest text-gray-400 mb-2">MYSTERY FATE 2026</div>
          <h2 className="text-2xl font-black uppercase leading-none mb-2 drop-shadow-lg" style={{ color: titleColor }}>{result.karakter}</h2>
          <div className="text-7xl font-black tracking-tighter drop-shadow-2xl my-2" style={{ color: scoreColor }}>{result.skor}%</div>
          <p className="italic text-gray-300 text-xs px-2 opacity-80">"{result.deskripsi}"</p>
        </div>
        
        <div className="w-full bg-white/5 border border-white/10 p-3 rounded-2xl mb-4 text-center relative overflow-hidden group">
            <p className="text-[9px] uppercase tracking-widest font-bold mb-1" style={{ color: theme.accent }}>Resolusi Tahun Depan</p>
            <p className="text-white text-xs font-bold leading-relaxed">"{result.resolusi}"</p>
        </div>
        
        <div className="w-full bg-black/20 p-4 rounded-2xl border border-white/5 mb-4 z-10">
          <StatBar label="❤️ ASMARA" val={result.stats?.love} hexColor="#ec4899" />
          <StatBar label="💸 KEUANGAN" val={result.stats?.money} hexColor="#10b981" />
          <StatBar label="🏥 KESEHATAN" val={result.stats?.health} hexColor="#3b82f6" />
        </div>
        
        <div className="grid grid-cols-2 gap-3 w-full text-xs z-10 mb-2">
            <div className="bg-white/5 p-3 rounded-2xl border border-white/5 text-center">
                <span className="block text-gray-500 text-[9px] uppercase tracking-widest mb-1">Khodam</span>
                <span className="font-bold text-purple-300 text-sm">{result.khodam}</span>
            </div>
            <div className="bg-white/5 p-3 rounded-2xl border border-white/5 text-center">
                <span className="block text-gray-500 text-[9px] uppercase tracking-widest mb-1">Item Hoki</span>
                <span className="font-bold text-yellow-300 text-sm">{result.luckyItem}</span>
            </div>
        </div>
      </div>

      <div className="mt-4 flex gap-3">
          <button onClick={downloadImage} className="flex-1 bg-white text-black py-3 rounded-2xl font-black text-sm shadow-lg hover:bg-gray-200 active:scale-95 transition-all flex items-center justify-center gap-2">📸 Simpan Poster</button>
          <button onClick={shareResult} className="w-14 bg-emerald-600 hover:bg-emerald-500 text-white rounded-2xl flex items-center justify-center font-bold text-xl active:scale-95 shadow-lg transition-colors">🚀</button>
          <button onClick={resetGame} className="w-14 bg-gray-800 text-white rounded-2xl flex items-center justify-center font-bold text-xl active:scale-95 border border-gray-700 hover:bg-gray-700 transition-colors">🔄</button>
      </div>

      {/* 👇👇👇 TOMBOL SAWERIA (MONETISASI) 👇👇👇 */}
      {/* JANGAN LUPA GANTI USERNAME "saweria.co/username" DENGAN PUNYA ANDA SENDIRI */}
      <a 
        href="https://saweria.co/damelarto" 
        target="_blank" 
        rel="noopener noreferrer"
        className="mt-3 w-full py-3 bg-[#eab308] hover:bg-[#ca8a04] text-black font-bold rounded-2xl flex items-center justify-center gap-2 transition-all shadow-lg active:scale-95"
      >
        ☕ Traktir Admin Kopi (Saweria)
      </a>

      {/* POSTER RAHASIA */}
      <div style={{ position: 'fixed', top: 0, left: 0, width: 0, height: 0, overflow: 'hidden' }}>
        <div ref={posterRef} style={posterStyle}>
            <NoiseOverlay />
            <div style={{ width: '100%', textAlign: 'center', position: 'relative', zIndex: 10 }}>
                <div style={{ display: 'inline-block', padding: '8px 24px', borderRadius: '100px', background: 'linear-gradient(90deg, #4b5563 0%, #1f2937 100%)', border: '1px solid rgba(255,255,255,0.2)', boxShadow: '0 4px 15px rgba(0,0,0,0.5)', color: '#e5e7eb', fontSize: '10px', fontWeight: '900', letterSpacing: '3px', marginBottom: '15px' }}>✨ MYSTERY FATE 2026</div>
                <div style={{ fontSize: '56px', color: '#ffffff', fontWeight: '900', textTransform: 'uppercase', lineHeight: '1', textShadow: '0 0 30px rgba(255,255,255,0.3)', marginBottom: '8px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{result.nama}</div>
                <div style={{ width: '100px', height: '2px', background: 'linear-gradient(90deg, transparent, #fbbf24, transparent)', margin: '0 auto' }}></div>
            </div>
            <div style={{ width: '100%', flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.05)', borderRadius: '30px', margin: '20px 0', padding: '15px', backdropFilter: 'blur(10px)' }}>
                <h1 style={{ fontSize: '40px', fontWeight: '900', textTransform: 'uppercase', lineHeight: '1', color: titleColor, marginBottom: '5px', textAlign: 'center' }}>{result.karakter}</h1>
                <div style={{ fontSize: '150px', fontWeight: '900', lineHeight: '0.9', color: scoreColor, textShadow: '0 15px 50px rgba(0,0,0,0.5)', margin: '10px 0' }}>{result.skor}%</div>
                <div style={{ fontSize: '20px', fontStyle: 'italic', color: '#94a3b8', textAlign: 'center', maxWidth: '95%' }}>"{result.deskripsi}"</div>
                <div style={{ marginTop: '20px', padding: '12px 20px', borderRadius: '15px', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', textAlign: 'center', width: '90%' }}>
                    <div style={{ fontSize: '10px', color: theme.accent, fontWeight: 'bold', letterSpacing: '2px', textTransform: 'uppercase' }}>Resolusi 2026</div>
                    <div style={{ fontSize: '16px', color: '#ffffff', fontWeight: 'bold', marginTop: '2px' }}>"{result.resolusi}"</div>
                </div>
            </div>
            <div style={{ width: '100%' }}>
                <div style={{ marginBottom: '20px' }}>
                    {[{ l: "ASMARA", v: result.stats?.love, c: "#ec4899" }, { l: "KEUANGAN", v: result.stats?.money, c: "#10b981" }, { l: "KESEHATAN", v: result.stats?.health, c: "#3b82f6" }].map((s, i) => (
                    <div key={i} style={{ marginBottom: '10px' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', color: '#cbd5e1', fontSize: '14px', fontWeight: 'bold', marginBottom: '3px', letterSpacing: '1px' }}><span>{s.l}</span><span>{s.v}%</span></div>
                        <div style={{ width: '100%', height: '10px', background: 'rgba(255,255,255,0.1)', borderRadius: '100px', overflow: 'hidden' }}><div style={{ width: `${s.v}%`, height: '100%', background: s.c, borderRadius: '100px', boxShadow: `0 0 10px ${s.c}` }}></div></div>
                    </div>
                    ))}
                </div>
                <div style={{ display: 'flex', gap: '15px', borderTop: '1px solid rgba(255,255,255,0.1)', paddingTop: '20px' }}>
                    <div style={{ flex: 1, textAlign: 'center' }}><div style={{ fontSize: '10px', color: '#64748b', textTransform: 'uppercase', letterSpacing: '2px', fontWeight: 'bold' }}>Khodam</div><div style={{ fontSize: '20px', fontWeight: 'bold', color: '#d8b4fe', marginTop: '2px' }}>{result.khodam}</div></div>
                    <div style={{ width: '1px', height: '40px', background: 'rgba(255,255,255,0.1)' }}></div>
                    <div style={{ flex: 1, textAlign: 'center' }}><div style={{ fontSize: '10px', color: '#64748b', textTransform: 'uppercase', letterSpacing: '2px', fontWeight: 'bold' }}>Item Hoki</div><div style={{ fontSize: '20px', fontWeight: 'bold', color: '#fde047', marginTop: '2px' }}>{result.luckyItem}</div></div>
                </div>
            </div>
            <div style={{ marginTop: '25px', display: 'flex', alignItems: 'center', gap: '15px', padding: '10px 20px', borderRadius: '20px', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)' }}>
                <div style={{ background: 'white', padding: '5px', borderRadius: '5px' }}>
                    <QRCode value="https://mystery-fate.vercel.app" size={50} />
                </div>
                <div>
                    <div style={{ color: '#94a3b8', fontSize: '10px', textTransform: 'uppercase', fontWeight: 'bold', letterSpacing: '1px' }}>Scan untuk main</div>
                    <div style={{ color: theme.accent, fontSize: '14px', fontWeight: 'bold' }}>mystery-fate.vercel.app</div>
                </div>
            </div>
        </div>
      </div>
    </div>
  );
}