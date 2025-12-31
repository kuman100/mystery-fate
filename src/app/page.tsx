'use client';

// ... (Import sama seperti sebelumnya) ...
import { Mountains_of_Christmas, Poppins } from 'next/font/google';
import AudioPlayer from '../components/AudioPlayer';
import GameCard from '../components/GameCard';
import Leaderboard from '../components/Leaderboard';
import SnowEffect from '../components/SnowEffect';
import Countdown from '../components/Countdown';

const fontNatal = Mountains_of_Christmas({ weight: ['400', '700'], subsets: ['latin'] });
const fontBody = Poppins({ weight: ['400', '600', '800'], subsets: ['latin'] });

export default function Home() {
  return (
    <main className={`min-h-screen w-full bg-[#050912] text-white flex flex-col items-center relative overflow-y-auto ${fontBody.className}`}>
      
      <SnowEffect />
      <AudioPlayer />
      
      {/* Background Glow */}
      <div className="fixed inset-0 pointer-events-none z-0">
        <div className="absolute -top-[10%] left-[20%] w-[400px] h-[400px] bg-red-600/10 rounded-full blur-[100px] animate-pulse"></div>
        <div className="absolute -bottom-[10%] right-[20%] w-[400px] h-[400px] bg-green-600/10 rounded-full blur-[100px] animate-pulse delay-1000"></div>
      </div>

      {/* WRAPPER UTAMA */}
      <div className="z-10 w-full max-w-5xl flex flex-col p-4 md:p-6 gap-6 md:gap-8">
        
        {/* HEADER */}
        <div className="text-center flex-shrink-0 mt-4 md:mt-0">
          <h1 className={`text-4xl md:text-6xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-red-500 via-amber-200 to-green-500 drop-shadow-sm leading-tight ${fontNatal.className}`}>
            Mystery Fate 2026
          </h1>
          <Countdown />
        </div>

        {/* MAIN GRID */}
        {/* items-start: Agar jika tinggi beda, tidak memaksa stretching aneh */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pb-10 items-start">
          
          {/* Kolom Kiri: Game Card */}
          <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl p-5 md:p-6 shadow-2xl relative group min-h-[420px] flex flex-col justify-center">
             <div className="absolute inset-0 rounded-3xl border border-white/0 group-hover:border-white/10 transition-colors pointer-events-none"></div>
             <GameCard />
          </div>

          {/* Kolom Kanan: Leaderboard */}
          <div className="w-full">
             <Leaderboard />
          </div>

        </div>

        <div className="text-center text-[10px] text-gray-600 pb-4">
          Happy New Year 2026 🎆
        </div>

      </div>
    </main>
  );
}