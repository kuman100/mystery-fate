'use client';
import { useState, useEffect } from 'react';

export default function Countdown() {
  const [timeLeft, setTimeLeft] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 });

  useEffect(() => {
    const targetDate = new Date(2026, 0, 1, 0, 0, 0).getTime();
    const interval = setInterval(() => {
      const now = new Date().getTime();
      const distance = targetDate - now;
      if (distance < 0) clearInterval(interval);
      else setTimeLeft({
        days: Math.floor(distance / (1000 * 60 * 60 * 24)),
        hours: Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
        minutes: Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60)),
        seconds: Math.floor((distance % (1000 * 60)) / 1000),
      });
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    // Skala otomatis: kecil di HP, normal di Laptop
    <div className="flex justify-center gap-2 md:gap-4 my-2 md:my-4 scale-90 md:scale-100 origin-top">
      <TimeBox val={timeLeft.days} label="HARI" />
      <TimeBox val={timeLeft.hours} label="JAM" />
      <TimeBox val={timeLeft.minutes} label="MENIT" />
      <TimeBox val={timeLeft.seconds} label="DETIK" />
    </div>
  );
}

function TimeBox({ val, label }: { val: number, label: string }) {
  return (
    <div className="flex flex-col items-center bg-black/30 backdrop-blur-md border border-white/10 p-2 md:p-3 rounded-lg md:rounded-xl shadow-lg w-14 md:w-20">
      <span className="text-lg md:text-2xl font-black text-white font-mono leading-none">
        {val < 10 ? `0${val}` : val}
      </span>
      <span className="text-[7px] md:text-[10px] text-gray-400 font-bold mt-1 tracking-widest">
        {label}
      </span>
    </div>
  );
}