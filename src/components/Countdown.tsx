'use client';
import { useState, useEffect } from 'react';
import confetti from 'canvas-confetti'; // Kita pakai efek kembang api disini juga

export default function Countdown() {
  const [timeLeft, setTimeLeft] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 });
  const [isNewYear, setIsNewYear] = useState(false); // State untuk cek apakah sudah jam 00:00

  useEffect(() => {
    // Target: 1 Januari 2026 jam 00:00:00
    const targetDate = new Date(2026, 0, 1, 0, 0, 0).getTime();

    const interval = setInterval(() => {
      const now = new Date().getTime();
      const distance = targetDate - now;

      // JIKA WAKTU HABIS (Distance < 0)
      if (distance < 0) {
        clearInterval(interval);
        if (!isNewYear) {
            setIsNewYear(true);
            triggerNewYearCelebration(); // Rayakan!
        }
      } else {
        // JIKA BELUM, LANJUT HITUNG
        setTimeLeft({
          days: Math.floor(distance / (1000 * 60 * 60 * 24)),
          hours: Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
          minutes: Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60)),
          seconds: Math.floor((distance % (1000 * 60)) / 1000),
        });
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [isNewYear]);

  // Fungsi Pesta Kembang Api
  const triggerNewYearCelebration = () => {
    const duration = 5 * 1000; // 5 Detik Pesta
    const animationEnd = Date.now() + duration;
    const defaults = { startVelocity: 30, spread: 360, ticks: 60, zIndex: 0 };

    const randomInRange = (min: number, max: number) => Math.random() * (max - min) + min;

    const interval: any = setInterval(function() {
      const timeLeft = animationEnd - Date.now();

      if (timeLeft <= 0) {
        return clearInterval(interval);
      }

      const particleCount = 50 * (timeLeft / duration);
      // Tembak dari kiri dan kanan
      confetti({ ...defaults, particleCount, origin: { x: randomInRange(0.1, 0.3), y: Math.random() - 0.2 } });
      confetti({ ...defaults, particleCount, origin: { x: randomInRange(0.7, 0.9), y: Math.random() - 0.2 } });
    }, 250);
  };

  // --- TAMPILAN JIKA SUDAH TAHUN BARU (00:00:00) ---
  if (isNewYear) {
    return (
       <div className="animate-bounce my-6 text-center z-50">
         <h2 className="text-4xl md:text-6xl font-black text-transparent bg-clip-text bg-gradient-to-r from-yellow-300 via-white to-yellow-300 drop-shadow-[0_0_25px_rgba(250,204,21,0.8)]">
           🎉 HAPPY NEW YEAR! 🎉
         </h2>
         <p className="text-white text-sm md:text-base mt-2 font-bold tracking-widest text-yellow-100">
           WELCOME 2026
         </p>
       </div>
    );
  }

  // --- TAMPILAN COUNTDOWN BIASA (DENGAN LABEL) ---
  return (
    <div className="flex flex-col items-center mt-2 mb-6">
      {/* Label Penjelas (Biar gak bingung) */}
      <p className="text-[10px] md:text-xs text-yellow-200 uppercase tracking-[0.3em] mb-3 font-bold opacity-80 animate-pulse border-b border-yellow-500/30 pb-1">
        Menuju Pergantian Tahun
      </p>

      {/* Kotak Waktu */}
      <div className="flex justify-center gap-2 md:gap-4 scale-90 md:scale-100 origin-top">
        <TimeBox val={timeLeft.days} label="HARI" />
        <TimeBox val={timeLeft.hours} label="JAM" />
        <TimeBox val={timeLeft.minutes} label="MENIT" />
        <TimeBox val={timeLeft.seconds} label="DETIK" />
      </div>
    </div>
  );
}

function TimeBox({ val, label }: { val: number, label: string }) {
  return (
    <div className="flex flex-col items-center bg-black/30 backdrop-blur-md border border-white/10 p-2 md:p-3 rounded-lg md:rounded-xl shadow-lg w-14 md:w-20 group hover:border-yellow-500/50 transition-colors">
      <span className="text-lg md:text-2xl font-black text-white font-mono leading-none group-hover:text-yellow-200 transition-colors">
        {val < 10 ? `0${val}` : val}
      </span>
      <span className="text-[7px] md:text-[10px] text-gray-400 font-bold mt-1 tracking-widest group-hover:text-white transition-colors">
        {label}
      </span>
    </div>
  );
}