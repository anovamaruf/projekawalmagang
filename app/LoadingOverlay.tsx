'use client';
import { useState, useEffect } from 'react';

export default function LoadingOverlay() {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 1500);
    return () => clearTimeout(timer);
  }, []);

  if (!loading) return null;

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-neutral-950">
      <div className="flex flex-col items-center">
        <div className="w-12 h-12 border-4 border-emerald-500/30 border-t-emerald-500 rounded-full animate-spin"></div>
        <p className="mt-4 text-emerald-500 font-bold animate-pulse">Memuat web fynooOutdoorRent punya nopa ganteng</p>
      </div>
    </div>
  );
}