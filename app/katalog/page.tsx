'use client';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function KatalogPage() {
  const router = useRouter();
  const [listAlat, setListAlat] = useState([]);
  const [loading, setLoading] = useState(true);
  const [keranjang, setKeranjang] = useState<any[]>([]);
  const [durasiSewa, setDurasiSewa] = useState(1);

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

  const tambahKeKeranjang = (alat: any) => {
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
    alert(`⛺ ${alat.name} berhasil dimasukkan ke keranjang!`);
  };

  const hapusDariKeranjang = (id: string) => {
    const keranjangBaru = keranjang.filter((item) => item._id !== id);
    setKeranjang(keranjangBaru);
    localStorage.setItem('keranjang_outdoor', JSON.stringify(keranjangBaru));
  };

  const hitungTotalSemua = () => {
    const totalSatuHari = keranjang.reduce((total, item) => total + (Number(item.pricePerDay || 0) * item.qty), 0);
    return totalSatuHari * durasiSewa;
  };

  const simpanDanLanjutCheckout = () => {
    if (keranjang.length === 0) { alert('Keranjang kosong!'); return; }
    localStorage.setItem('durasi_sewa_outdoor', String(durasiSewa));
    router.push('/checkout');
  };

  if (loading) return <div className="text-center mt-10 text-gray-400">Memuat katalog...</div>;

  return (
    <div className="max-w-7xl mx-auto p-6 min-h-screen text-white font-sans">
      <nav className="border-b border-gray-800 bg-neutral-900/80 backdrop-blur px-6 py-4 flex justify-between items-center mb-6" style={{ borderRadius: '8px' }}>
        <Link href="/" className="text-xl font-bold text-green-500">fynooOutdoorRent</Link>
        <div className="flex gap-6 text-sm">
          <Link href="/" className="text-gray-300">Home</Link>
          <Link href="/katalog" className="text-green-500 font-bold">Katalog</Link>
          <Link href="/admin" className="text-gray-300">Admin</Link>
        </div>
      </nav>

      <div className="flex flex-col lg:flex-row gap-8">
        <div className="flex-1 grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          {listAlat.map((alat: any) => (
            <div key={alat._id} className="border border-gray-800 rounded-xl p-5 bg-neutral-900/80 hover:border-green-600 transition flex flex-col">
              <div className="w-full h-44 bg-neutral-800 rounded-lg overflow-hidden mb-4">
                <img src={alat.image} alt={alat.name} className="w-full h-full object-cover" />
              </div>
              <h2 className="text-xl font-bold capitalize">{alat.name}</h2>
              <p className="text-sm text-gray-400">Kategori: {alat.category}</p>
              <p className="text-orange-500 font-semibold mt-1">Rp {Number(alat.pricePerDay || 0).toLocaleString('id-ID')}/hari</p>
              <button onClick={() => tambahKeKeranjang(alat)} className="w-full mt-4 bg-green-600 hover:bg-green-700 py-2 rounded-lg font-bold">Sewa Sekarang</button>
            </div>
          ))}
        </div>

        <div className="w-full lg:w-80 bg-neutral-900/80 p-6 rounded-xl border border-gray-800 h-fit sticky top-6">
          <h2 className="text-xl font-bold mb-4 text-green-400">🛒 Keranjang ({keranjang.length})</h2>
          {keranjang.map((item) => (
            <div key={item._id} className="flex justify-between items-center border-b border-gray-800 pb-2 mb-2 text-sm">
              <div>{item.name} <br/> <span className="text-gray-400 text-xs">{item.qty} x Rp {item.pricePerDay}</span></div>
              <button onClick={() => hapusDariKeranjang(item._id)} className="text-red-500 text-xs">Hapus</button>
            </div>
          ))}
          <div className="mt-4">
            <label className="text-xs text-gray-400">Durasi Sewa (Hari):</label>
            <input type="number" value={durasiSewa} onChange={e => setDurasiSewa(Number(e.target.value))} className="w-full bg-neutral-800 p-2 rounded mt-1" />
            <div className="flex justify-between mt-4 font-bold text-lg"><span>Total:</span><span className="text-orange-500">Rp {hitungTotalSemua().toLocaleString('id-ID')}</span></div>
            <button onClick={simpanDanLanjutCheckout} className="w-full mt-4 bg-orange-500 py-3 rounded-lg font-bold">Lanjut Checkout</button>
          </div>
        </div>
      </div>
    </div>
  );
}