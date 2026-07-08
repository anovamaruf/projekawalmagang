'use client';
import Link from 'next/link';
import { motion } from 'framer-motion';

export default function HomePage() {
  return (
    <div className="min-h-screen bg-neutral-950 text-white font-sans flex flex-col justify-between">

      <nav className="border-b border-neutral-800 bg-neutral-900/50 backdrop-blur-md px-6 py-4 flex justify-between items-center sticky top-0 z-50">
        <div className="text-xl font-bold text-emerald-500 flex items-center gap-2">
           fynooOutdoorRent
        </div>
        <div className="flex gap-6 text-sm font-medium">
          <Link href="/" className="text-emerald-500">Home</Link>
          <Link href="/katalog" className="text-neutral-400 hover:text-emerald-400 transition">Katalog</Link>
          <Link href="/admin" className="text-neutral-400 hover:text-emerald-400 transition">Admin Panel</Link>
        </div>
      </nav>

      <main className="flex-1 flex flex-col items-center justify-center text-center px-4 max-w-3xl mx-auto py-20">
        <motion.div 
          initial={{ opacity: 0, y: 20 }} 
          animate={{ opacity: 1, y: 0 }}
          className="px-4 py-1.5 bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 rounded-full text-xs font-semibold uppercase tracking-widest mb-6"
        >
          Siap Menjadi Teman Mendaki Anda
        </motion.div>
        
        <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight mb-6 text-white">
          Penyewaan Alat Outdoor <br/>
          <span className="text-emerald-500">Mudah, Lengkap & Terpercaya</span>
        </h1>
        
        <p className="text-neutral-400 text-lg mb-10 max-w-xl">
          Tempat Penyewaan dan perlengkapan Alat gunung terbaik tanpa ribet. Tinggal pilih, checkout, dan langsung gas muncak!
        </p>
        
        <div className="flex flex-col sm:flex-row gap-4 w-full justify-center">
          <Link 
            href="/katalog" 
            className="bg-emerald-600 hover:bg-emerald-500 text-white font-bold px-8 py-4 rounded-xl transition text-lg shadow-lg shadow-emerald-900/20"
          >
            Sewa Alat 
          </Link>
          <Link 
            href="/admin" 
            className="bg-neutral-900 border border-neutral-800 hover:border-neutral-700 text-neutral-300 font-medium px-8 py-4 rounded-xl transition text-lg"
          >
            Kelola Gudang
          </Link>
        </div>
      </main>

      <footer className="border-t border-neutral-900 py-8 text-center text-sm text-neutral-600">
        © 2026 fynooOutdoorRent App.
      </footer>

    </div>
  );
}