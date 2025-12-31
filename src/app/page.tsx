'use client';
import { Mountains_of_Christmas, Poppins } from 'next/font/google';
import AudioPlayer from '../components/AudioPlayer';
import GameCard from '../components/GameCard';
import Leaderboard from '../components/Leaderboard'; // Import Baru
import SnowEffect from '../components/SnowEffect';
import Countdown from '../components/Countdown';

const fontNatal = Mountains_of_Christmas({ 
  weight: ['400', '700'], 
  subsets: ['latin'],
  adjustFontFallback: false 
});

const fontBody = Poppins({ 
  weight: ['400', '600', '800'], 
  subsets: ['latin'] 
});

export default function Home() {
  return (
    <main className={`min-h-screen w-full bg-[#020617] text-white flex flex-col items-center relative overflow-x-hidden ${fontBody.className}`}>
      
      <SnowEffect />
      <AudioPlayer />
      
      {/* Background Glow */}
      <div className="fixed inset-0 pointer-events-none z-0">
        <div className="absolute -top-[10%] left-[20%] w-[500px] h-[500px] bg-purple-900/20 rounded-full blur-[120px] animate-pulse"></div>
        <div className="absolute -bottom-[10%] right-[20%] w-[500px] h-[500px] bg-blue-900/20 rounded-full blur-[120px] animate-pulse delay-1000"></div>
      </div>

      <div className="z-10 w-full max-w-6xl flex flex-col p-4 md:p-8 gap-6">
        
        {/* HEADER */}
        <div className="text-center flex-shrink-0 mt-4">
          <h1 className={`text-5xl md:text-7xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-yellow-200 via-purple-200 to-pink-200 drop-shadow-sm leading-tight ${fontNatal.className}`}>
            Mystery Fate 2026
          </h1>
          <p className="text-[10px] md:text-xs text-gray-500 tracking-[0.5em] uppercase mt-2 opacity-80">
            Cek Nasib & Keberuntunganmu
          </p>
          <div className="mt-4"><Countdown /></div>
        </div>

        {/* GRID LAYOUT: KIRI GAME, KANAN LEADERBOARD */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pb-10 items-start">
          
          {/* KOLOM KIRI: GAME */}
          <div className="w-full">
            <GameCard />
          </div>

          {/* KOLOM KANAN: LEADERBOARD */}
          <div className="w-full">
             <Leaderboard />
          </div>

        </div>

        {/* FOOTER */}
        <div className="text-center border-t border-white/5 pt-6 pb-8">
          <p className="text-[10px] text-gray-600">
            © 2025 Mystery Fate Project. For Entertainment Purpose Only.<br/>
            Dibuat dengan ☕ & 💻
          </p>
        </div>

      </div>
    </main>
  );
}