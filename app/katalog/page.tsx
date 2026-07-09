'use client';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';

export default function KatalogPage() {
  const router = useRouter();
  const [listAlat, setListAlat] = useState([]);
  const [loading, setLoading] = useState(true);
  const [keranjang, setKeranjang] = useState<any[]>([]);
  const [durasiSewa, setDurasiSewa] = useState(1);
  
  const [kategoriTerpilih, setKategoriTerpilih] = useState('Semua');
  const daftarKategori = ['Semua', 'Tenda', 'Carrier', 'Sepatu', 'Alat Bantu Mendaki', 'Alat Camping'];

  useEffect(() => {
    async function ambilData() {
      try {
        const res = await fetch('/api/inputbarang');
        const hasil = await res.json();
        if (hasil.success) setListAlat(hasil.data);
      } catch (error) { console.error("Gagal memuat data:", error); }
      finally { setLoading(false); }
    }
    ambilData();
    const isiKeranjangLama = localStorage.getItem('keranjang_outdoor');
    if (isiKeranjangLama) setKeranjang(JSON.parse(isiKeranjangLama));
  }, []);

  // Logika Filter Data
  const barangTampil = kategoriTerpilih === 'Semua' 
    ? listAlat 
    : listAlat.filter((alat: any) => alat.category === kategoriTerpilih);

  const tambahKeKeranjang = (alat: any) => {
    if(navigator.vibrate) navigator.vibrate(20);
    const sudahAda = keranjang.find((item) => item._id === alat._id);
    let keranjangBaru;
    if (sudahAda) {
      keranjangBaru = keranjang.map((item) => 
        item._id === alat._id ? { ...item, qty: item.qty + 1 } : item
      );
    } else {
      keranjangBaru = [...keranjang, { ...alat, qty: 1 }];
    }
    setKeranjang(keranjangBaru);
    localStorage.setItem('keranjang_outdoor', JSON.stringify(keranjangBaru));
  };

  const hapusDariKeranjang = (id: string) => {
    if(navigator.vibrate) navigator.vibrate(20);
    const keranjangBaru = keranjang.filter((item) => item._id !== id);
    setKeranjang(keranjangBaru);
    localStorage.setItem('keranjang_outdoor', JSON.stringify(keranjangBaru));
  };

  const hitungTotalSemua = () => {
    const totalSatuHari = keranjang.reduce((total, item) => total + (Number(item.pricePerDay || 0) * item.qty), 0);
    return totalSatuHari * durasiSewa;
  };

  const simpanDanLanjutCheckout = () => {
    if(navigator.vibrate) navigator.vibrate(50);
    if (keranjang.length === 0) { alert('Keranjang masih kosong!'); return; }
    localStorage.setItem('durasi_sewa_outdoor', String(durasiSewa));
    router.push('/checkout');
  };

  return (
    <div className="min-h-screen bg-neutral-950 text-white font-sans p-6 md:p-10">
      <nav className="max-w-7xl mx-auto mb-10 flex justify-between items-center bg-neutral-900/50 p-4 rounded-2xl border border-neutral-800 backdrop-blur">
        <Link href="/" className="text-xl font-bold text-emerald-500">fynooOutdoorRent</Link>
        <div className="flex gap-6 text-sm font-medium text-neutral-400">
          <Link href="/" className="hover:text-emerald-400 transition">Home</Link>
          <Link href="/katalog" className="text-emerald-500">Katalog</Link>
          <Link href="/admin" className="hover:text-emerald-400 transition">Admin</Link>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto flex flex-col lg:flex-row gap-8">
        <div className="flex-1">
          <div className="mb-8">
            <h2 className="text-2xl font-bold mb-4">Pilih Perlengkapan Anda</h2>
            <div className="flex flex-wrap gap-2">
              {daftarKategori.map((kat) => (
                <button 
                  key={kat}
                  onClick={() => { if(navigator.vibrate) navigator.vibrate(20); setKategoriTerpilih(kat); }}
                  className={`px-4 py-2 rounded-full text-sm font-bold transition active:scale-95 duration-100 ${
                    kategoriTerpilih === kat 
                      ? 'bg-emerald-600 text-white' 
                      : 'bg-neutral-900 border border-neutral-800 text-neutral-400 hover:border-emerald-500'
                  }`}
                >
                  {kat}
                </button>
              ))}
            </div>
          </div>

          {loading ? (
            <p className="text-neutral-500">Memuat katalog...</p>
          ) : (
            <motion.div 
              key={kategoriTerpilih} 
              initial={{ opacity: 0 }} 
              animate={{ opacity: 1 }}
              className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6"
            >
              {barangTampil.map((alat: any) => (
                <motion.div 
                  key={alat._id} 
                  initial={{ opacity: 0, y: 15 }} 
                  animate={{ opacity: 1, y: 0 }} 
                  transition={{ duration: 0.3 }}
                  className="bg-neutral-900 border border-neutral-800 rounded-2xl p-4 hover:border-emerald-500 transition"
                >
                  <img src={alat.image} alt={alat.name} className="w-full h-48 object-cover rounded-xl mb-4" />
                  
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-[10px] font-bold text-emerald-600 bg-emerald-500/10 px-2 py-1 rounded uppercase tracking-widest">
                      {alat.category}
                    </span>
                    <span className={`text-[10px] font-bold px-2 py-1 rounded uppercase tracking-widest ${
                      alat.stock > 0 ? 'bg-neutral-800 text-neutral-400' : 'bg-red-900/50 text-red-400'
                    }`}>
                      {alat.stock > 0 ? `Stok: ${alat.stock}` : 'Habis'}
                    </span>
                  </div>

                  <h3 className="font-bold text-lg mt-1">{alat.name}</h3>
                  <p className="text-emerald-400 font-bold my-2">Rp {Number(alat.pricePerDay || 0).toLocaleString('id-ID')}/hari</p>
                  
                  <button 
                    onClick={() => tambahKeKeranjang(alat)} 
                    disabled={alat.stock <= 0}
                    className={`w-full py-3 rounded-xl font-bold transition active:scale-95 duration-100 ${
                      alat.stock > 0 
                        ? 'bg-emerald-600 hover:bg-emerald-500 text-white' 
                        : 'bg-neutral-800 text-neutral-500 cursor-not-allowed'
                    }`}
                  >
                    {alat.stock > 0 ? 'Sewa Sekarang' : 'Stok Habis'}
                  </button>
                </motion.div>
              ))}
            </motion.div>
          )}
        </div>

        <div className="w-full lg:w-96 bg-neutral-900 border border-neutral-800 p-6 rounded-3xl h-fit sticky top-6">
          <h2 className="text-xl font-bold mb-6 flex items-center gap-2"> Keranjang <span className="bg-emerald-500/10 text-emerald-500 px-2 py-0.5 rounded-lg text-sm">{keranjang.length}</span></h2>
          <div className="space-y-4 mb-6">
            {keranjang.map((item) => (
              <div key={item._id} className="flex justify-between items-center bg-neutral-950 p-3 rounded-xl border border-neutral-800">
                <div className="text-sm">
                  <p className="font-bold">{item.name}</p>
                  <p className="text-neutral-400 text-xs">{item.qty} x Rp {item.pricePerDay}</p>
                </div>
                <button onClick={() => hapusDariKeranjang(item._id)} className="text-red-500 hover:text-red-400 text-xs">Hapus</button>
              </div>
            ))}
          </div>
          
          <div className="border-t border-neutral-800 pt-6">
            <label className="text-xs text-neutral-400 uppercase font-bold tracking-wider">Durasi Sewa (Hari)</label>
            <input type="number" value={durasiSewa} onChange={e => setDurasiSewa(Number(e.target.value))} className="w-full bg-neutral-950 border border-neutral-800 p-3 rounded-xl mt-2 mb-4 outline-none focus:border-emerald-500" />
            <div className="flex justify-between font-bold text-lg mb-6">
              <span>Total:</span>
              <span className="text-emerald-400">Rp {hitungTotalSemua().toLocaleString('id-ID')}</span>
            </div>
            <button onClick={simpanDanLanjutCheckout} className="w-full bg-emerald-600 hover:bg-emerald-500 py-4 rounded-xl font-bold transition active:scale-95 duration-100">Lanjut Checkout</button>
          </div>
        </div>
      </div>
    </div>
  );
}