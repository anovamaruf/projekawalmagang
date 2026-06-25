'use client';
import Link from 'next/link';

export default function HomePage() {
  return (
    <div className="min-h-screen bg-neutral-950 text-white font-sans flex flex-col justify-between" style={{ backgroundColor: '#ebeaeada' }}>
      
      <nav className="border-b border-gray-800 bg-neutral-900 px-6 py-4 flex justify-between items-center" style={{ backgroundColor: '#141414', borderColor: '#262626' }}>
        <div className="text-xl font-bold text-green-500 flex items-center gap-2" style={{ color: '#22c55e' }}>
           fynooOutdoorRent
        </div>
        <div className="flex gap-6 text-sm font-medium">
          <Link href="/" className="text-green-500 hover:text-green-400" style={{ color: '#22c55e' }}>Home</Link>
          <Link href="/katalog" className="text-gray-300 hover:text-green-400 transition" style={{ color: '#d4d4d4' }}>Katalog</Link>
          <Link href="/admin" className="text-gray-300 hover:text-green-400 transition" style={{ color: '#d4d4d4' }}>Admin Panel</Link>
        </div>
      </nav>

      <div className="flex-1 flex flex-col items-center justify-center text-center px-4 max-w-3xl mx-auto py-20">
        <span className="px-3 py-1 bg-green-950 text-green-400 border border-green-800 rounded-full text-xs font-semibold uppercase tracking-wider mb-4" style={{ backgroundColor: '#052e16', color: '#4ade80', borderColor: '#166534' }}>
          Siap Menjadi Teman Mendaki Anda
        </span>
        <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight mb-6 text-white">
          Penyewaan Alat Outdoor <br/>
          <span className="text-green-500" style={{ color: '#22c55e' }}>Mudah, Lengkap & Terpercaya</span>
        </h1>
        <p className="text-gray-400 text-lg mb-8 max-w-xl" style={{ color: '#a3a3a3' }}>
          Tempat Penyewaan dan perlengkapan Alat gunung terbaik tanpa ribet. Tinggal pilih, checkout, dan langsung gas muncak!
        </p>
        
        <div className="flex flex-col sm:flex-row gap-4 w-full justify-center">
          <Link 
            href="/katalog" 
            className="bg-green-600 hover:bg-green-700 text-white font-bold px-8 py-4 rounded-xl transition text-lg shadow-lg"
            style={{ backgroundColor: '#16a34a', borderRadius: '12px' }}
          >
           Sewa Alat 🛒
          </Link>
          <Link 
            href="/admin" 
            className="border border-gray-700 hover:border-gray-500 bg-neutral-900 text-gray-300 font-medium px-8 py-4 rounded-xl transition text-lg"
            style={{ backgroundColor: '#171717', borderColor: '#404040', borderRadius: '12px', color: '#d4d4d4' }}
          >
            Kelola Gudang
          </Link>
        </div>
      </div>

      <footer className="border-t border-gray-900 py-6 text-center text-sm text-gray-600" style={{ borderColor: '#171717', color: '#525252' }}>
        © 2026 fynooOutdoorRent App. All Rights Reserved.
      </footer>

    </div>
  );
}