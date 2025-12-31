'use client';

import React, { useEffect, useState } from 'react';

export default function SnowEffect() {
  const [snowflakes, setSnowflakes] = useState<React.ReactNode[]>([]);

  useEffect(() => {
    // Kita generate salju hanya di sisi Client agar tidak error "Hydration Mismatch"
    const flakes = Array.from({ length: 30 }).map((_, i) => (
      <div 
        key={i} 
        className="snowflake" 
        style={{
          left: `${Math.random() * 100}vw`, 
          animationDuration: `${Math.random() * 3 + 5}s`, 
          animationDelay: `${Math.random() * 5}s`, 
          opacity: Math.random() * 0.5
        }}
      >
        ❄
      </div>
    ));
    setSnowflakes(flakes);
  }, []);

  return (
    <div className="fixed inset-0 pointer-events-none z-0">
      {snowflakes}
    </div>
  );
}