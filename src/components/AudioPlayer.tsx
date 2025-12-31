'use client';
import { useState, useEffect, useRef } from 'react';

export default function AudioPlayer() {
  const [isPlaying, setIsPlaying] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    // Setup Audio
    audioRef.current = new Audio('/sounds/bgm.mp3');
    audioRef.current.loop = true;
    audioRef.current.volume = 0.3; // Volume 30% biar gak berisik
  }, []);

  const togglePlay = () => {
    if (!audioRef.current) return;
    
    if (isPlaying) {
      audioRef.current.pause();
    } else {
      audioRef.current.play().catch((e) => console.log("Perlu interaksi user dulu:", e));
    }
    setIsPlaying(!isPlaying);
  };

  return (
    <div className="fixed top-4 right-4 z-50">
      <button 
        onClick={togglePlay}
        className="bg-white/10 backdrop-blur-md border border-white/20 p-3 rounded-full hover:bg-white/20 transition-all shadow-lg animate-pulse-slow"
      >
        {isPlaying ? '🔊' : '🔇'}
      </button>
    </div>
  );
}

// Helper function untuk memutar SFX (Sound Effect) dari file lain
export const playSfx = (type: 'click' | 'win') => {
  const sfx = new Audio(`/sounds/${type}.mp3`);
  sfx.volume = 0.5;
  sfx.play().catch(() => {}); // Abaikan error kalau file gak ada
};