'use client';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function CheckoutPage() {
  const router = useRouter();
  const [keranjang, setKeranjang] = useState<any[]>([]);
  const [durasiSewa, setDurasiSewa] = useState(1);
  const [metodeBayar, setMetodeBayar] = useState('Transfer Bank');
  const [opsiPengambilan, setOpsiPengambilan] = useState('Ambil di Tempat'); 
  const [formData, setFormData] = useState({ namaPenyewa: '', nomorHp: '', tanggalSewa: '', alamatLengkap: '' });

  const [statusSewa, setStatusSewa] = useState<'form' | 'pending' | 'success'>('form');
  const [waktuMundur, setWaktuMundur] = useState(7);
  useEffect(() => {
    const isiKeranjang = localStorage.getItem('keranjang_outdoor');
    const isiDurasi = localStorage.getItem('durasi_sewa_outdoor');
    if (isiKeranjang) setKeranjang(JSON.parse(isiKeranjang));
    if (isiDurasi) setDurasiSewa(Number(isiDurasi));
  }, []);

  useEffect(() => {
    let timerPengecekan: any;
    if (statusSewa === 'pending' && waktuMundur > 0) {
      timerPengecekan = setTimeout(() => {
        setWaktuMundur(waktuMundur - 1);
      }, 1000);
    } else if (statusSewa === 'pending' && waktuMundur === 0) {
      localStorage.removeItem('keranjang_outdoor');
      localStorage.removeItem('durasi_sewa_outdoor');
      setStatusSewa('success');
    }
    return () => clearTimeout(timerPengecekan);
  }, [statusSewa, waktuMundur]);

  const hitungTotalSemua = () => {
    const totalSatuHari = keranjang.reduce((total, item) => total + (Number(item.pricePerDay || 0) * item.qty), 0);
    return totalSatuHari * durasiSewa;
  };

const buatBookingPending = async (e: React.FormEvent) => {
    e.preventDefault();
    if (keranjang.length === 0) return alert('Keranjang kamu kosong!');
    
    // Data yang akan dikirim ke database
    const payload = {
      ...formData,
      items: keranjang,
      totalPrice: hitungTotalSemua(),
      durasiSewa,
      opsiPengambilan,
      metodeBayar, // <--- Ini yang memastikan metode bayar masuk
      status: 'Pending'
    };

    try {
      const res = await fetch('/api/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      const hasil = await res.json();
      if (hasil.success) {
        setStatusSewa('pending');
        setWaktuMundur(7); 
      } else {
        alert('Gagal memproses booking: ' + hasil.error);
      }
    } catch (err) {
      alert('Terjadi kesalahan koneksi');
    }
  };

  if (statusSewa === 'success') {
    return (
      <div className="min-h-screen bg-neutral-950 text-white font-sans flex items-center justify-center p-6" style={{ backgroundColor: '#0a0a0a' }}>
        <div className="bg-neutral-900 p-8 rounded-2xl border border-green-600 text-center max-w-md w-full shadow-2xl" style={{ backgroundColor: '#171717', borderColor: '#166534', borderRadius: '16px' }}>
          <div className="w-20 h-20 bg-green-950 text-green-500 rounded-full flex items-center justify-center text-4xl mx-auto mb-6 border border-green-600" style={{ backgroundColor: '#052e16', color: '#22c55e', borderColor: '#166534' }}>
            ✓
          </div>
          <h1 className="text-2xl font-bold text-white mb-2">Pembayaran Berhasil!</h1>
          <p className="text-gray-400 text-sm mb-6" style={{ color: '#a3a3a3' }}>
            Sistem mendeteksi dana telah masuk. Nota {formData.namaPenyewa} dinyatakan **LUNAS**. Metode penyerahan: **{opsiPengambilan}**. Slot alat outdoor aman!
          </p>
          <button 
            onClick={() => router.push('/')}
            className="w-full bg-green-600 hover:bg-green-700 text-white font-bold py-3 rounded-xl transition text-center"
            style={{ backgroundColor: '#16a34a', borderRadius: '12px' }}
          >
            Kembali ke Beranda
          </button>
        </div>
      </div>
    );
  }

  if (statusSewa === 'pending') {
    return (
      <div className="min-h-screen bg-neutral-950 text-white font-sans flex items-center justify-center p-6" style={{ backgroundColor: '#0a0a0a' }}>
        <div className="bg-neutral-900 p-8 rounded-2xl border border-orange-500 max-w-md w-full text-center shadow-xl" style={{ backgroundColor: '#171717', borderColor: '#ea580c', borderRadius: '16px' }}>
          <div className="w-14 h-14 border-4 border-orange-500/20 border-t-orange-500 rounded-full animate-spin mx-auto mb-5"></div>
          <span className="px-3 py-1 bg-orange-950 text-orange-400 text-xs font-semibold rounded-full border border-orange-800 uppercase tracking-wider">
            Menunggu Pembayaran
          </span>
          <h2 className="text-xl font-bold mt-4 mb-2 text-white">Selesaikan Pembayaran Kamu</h2>
          <p className="text-sm text-gray-400 mb-6" style={{ color: '#a3a3a3' }}>
            Alat outdoor kamu sudah **Terbooking otomatis**. Silakan selesaikan transaksi agar status berubah.
          </p>

          <div className="bg-neutral-950 p-4 rounded-xl border border-gray-800 text-left mb-6 space-y-3" style={{ backgroundColor: '#0a0a0a', borderColor: '#262626' }}>
            <div className="flex justify-between text-sm border-b border-gray-800 pb-2" style={{ borderColor: '#262626' }}>
              <span className="text-gray-400">Total Tagihan:</span>
              <span className="font-bold text-orange-500" style={{ color: '#f97316' }}>Rp {hitungTotalSemua().toLocaleString('id-ID')}</span>
            </div>
            <div className="text-xs text-gray-400 border-b border-gray-800 pb-2" style={{ borderColor: '#262626' }}>
              <span>Metode Penyerahan: <strong>{opsiPengambilan}</strong></span>
              {opsiPengambilan === 'Diantar / Delivery' && <p className="mt-1 text-gray-300 italic">Tujuan: {formData.alamatLengkap}</p>}
            </div>
            {metodeBayar === 'Transfer Bank' ? (
              <div className="text-xs space-y-1">
                <p className="text-gray-400 font-medium">Silakan transfer via ATM / M-Banking ke: 0562677320</p>
                <p className="text-sm font-bold text-gray-200 font-mono">BANK BCA: 0562677320</p>
                <p className="text-gray-400 font-medium">a/n OutdoorRent Corp.</p>
              </div>
            ) : (
              <div className="text-center py-2">
                <div className="w-32 h-32 bg-white mx-auto flex items-center justify-center font-bold text-black rounded-lg text-xs">📷 [GAMBAR QRIS ASLI]</div>
                <p className="text-xs text-gray-400 mt-2">Buka aplikasi Dana/Gopay/OVO lalu scan barcode di atas</p>
              </div>
            )}
          </div>

          <p className="text-xs text-gray-500 animate-pulse" style={{ color: '#737373' }}>
            🔄 Menunggu verifikasi mutasi sistem otomatis... (Simulasi: {waktuMundur}s)
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-neutral-950 text-white font-sans" style={{ backgroundColor: '#0a0a0a' }}>
      <nav className="border-b border-gray-800 bg-neutral-900 px-6 py-4 flex justify-between items-center" style={{ backgroundColor: '#141414', borderColor: '#262626' }}>
        <Link href="/" className="text-xl font-bold text-green-500" style={{ color: '#22c55e' }}>fynooOutdoorRent</Link>
        <Link href="/katalog" className="text-sm text-gray-400 hover:text-white">← Kembali ke Katalog</Link>
      </nav>

      <div className="max-w-4xl mx-auto p-6 grid grid-cols-1 md:grid-cols-2 gap-8 mt-6">
        <div className="bg-neutral-900 p-6 rounded-xl border border-gray-800" style={{ backgroundColor: '#171717', borderColor: '#262626', borderRadius: '12px' }}>
          <h2 className="text-xl font-bold mb-4 text-green-500" style={{ color: '#22c55e' }}>Informasi Pengambilan Alat</h2>
          <form onSubmit={buatBookingPending} className="space-y-4">
            <div>
              <label className="text-sm text-gray-400 block mb-1">Nama Lengkap Sesuai KTP:</label>
              <input type="text" required value={formData.namaPenyewa} onChange={(e) => setFormData({...formData, namaPenyewa: e.target.value})} className="w-full bg-neutral-800 border border-gray-700 rounded p-2 text-white text-sm" style={{ backgroundColor: '#262626', borderColor: '#404040' }}/>
            </div>
            <div>
              <label className="text-sm text-gray-400 block mb-1">Nomor WhatsApp:</label>
              <input type="tel" required value={formData.nomorHp} onChange={(e) => setFormData({...formData, nomorHp: e.target.value})} className="w-full bg-neutral-800 border border-gray-700 rounded p-2 text-white text-sm" style={{ backgroundColor: '#262626', borderColor: '#404040' }}/>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-sm text-gray-400 block mb-1">Tanggal Mulai Sewa:</label>
                <input type="date" required value={formData.tanggalSewa} onChange={(e) => setFormData({...formData, tanggalSewa: e.target.value})} className="w-full bg-neutral-800 border border-gray-700 rounded p-2 text-white text-sm" style={{ backgroundColor: '#262626', borderColor: '#404040' }}/>
              </div>
              <div>
                <label className="text-sm text-gray-400 block mb-1">Durasi Sewa (Hari):</label>
                <input type="number" min="1" required value={durasiSewa} disabled className="w-full bg-neutral-800 border border-gray-700 rounded p-2 text-gray-400 text-sm cursor-not-allowed" style={{ backgroundColor: '#1f1f1f', borderColor: '#404040' }}/>
              </div>
            </div>

            <div className="pt-2">
              <label className="text-sm text-gray-400 block mb-2 font-semibold">Metode Penyerahan Alat:</label>
              <div className="grid grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() => setOpsiPengambilan('Ambil di Tempat')}
                  className="p-3 rounded-lg border font-medium text-sm transition text-center"
                  style={{ backgroundColor: opsiPengambilan === 'Ambil di Tempat' ? '#16a34a' : '#262626', borderColor: opsiPengambilan === 'Ambil di Tempat' ? '#22c55e' : '#404040', color: '#fff' }}
                >
                   Ambil di Tempat
                </button>
                <button
                  type="button"
                  onClick={() => setOpsiPengambilan('Diantar / Delivery')}
                  className="p-3 rounded-lg border font-medium text-sm transition text-center"
                  style={{ backgroundColor: opsiPengambilan === 'Diantar / Delivery' ? '#16a34a' : '#262626', borderColor: opsiPengambilan === 'Diantar / Delivery' ? '#22c55e' : '#404040', color: '#fff' }}
                >
                   Diantar / Delivery
                </button>
              </div>
            </div>

            {opsiPengambilan === 'Diantar / Delivery' && (
              <div className="p-3 rounded-lg border bg-neutral-950 border-gray-800 animate-fadeIn" style={{ backgroundColor: '#0a0a0a', borderColor: '#262626' }}>
                <label className="text-sm text-gray-400 block mb-1 font-medium text-orange-400">Alamat Lengkap Pengiriman:</label>
                <textarea 
                  required
                  rows={2}
                  placeholder="Ketik jalan, nomor rumah, nomor gang, atau patokan lokasi..."
                  value={formData.alamatLengkap} 
                  onChange={(e) => setFormData({...formData, alamatLengkap: e.target.value})} 
                  className="w-full bg-neutral-800 border border-gray-700 rounded p-2 text-white text-xs" 
                  style={{ backgroundColor: '#262626', borderColor: '#404040' }}
                />
              </div>
            )}

            <div className="pt-2">
              <label className="text-sm text-gray-400 block mb-2 font-semibold">Pilih Metode Pembayaran Mandiri:</label>
              <div className="space-y-2">
                <label className="flex items-center gap-3 p-3 bg-neutral-800 rounded border border-gray-700 cursor-pointer" style={{ backgroundColor: '#262626', borderColor: '#404040' }}>
                  <input type="radio" name="payment" value="Transfer Bank" checked={metodeBayar === 'Transfer Bank'} onChange={() => setMetodeBayar('Transfer Bank')}/>
                  <div className="text-sm"><p className="font-medium text-gray-200">Virtual Account / Bank Transfer</p></div>
                </label>
                <label className="flex items-center gap-3 p-3 bg-neutral-800 rounded border border-gray-700 cursor-pointer" style={{ backgroundColor: '#262626', borderColor: '#404040' }}>
                  <input type="radio" name="payment" value="QRIS" checked={metodeBayar === 'QRIS'} onChange={() => setMetodeBayar('QRIS')}/>
                  <div className="text-sm"><p className="font-medium text-gray-200">QRIS / E-Wallet Instant</p></div>
                </label>
              </div>
            </div>

            <button type="submit" className="w-full bg-green-600 hover:bg-green-700 text-white font-bold py-3 rounded-lg transition text-center mt-4" style={{ backgroundColor: '#16a34a', borderRadius: '8px' }}>
              Booking & Bayar Sekarang
            </button>
          </form>
        </div>

        <div className="bg-neutral-900 p-6 rounded-xl border border-gray-800 h-fit" style={{ backgroundColor: '#171717', borderColor: '#262626', borderRadius: '12px' }}>
          <h2 className="text-xl font-bold mb-4 text-orange-500" style={{ color: '#f97316' }}>Ringkasan Sewa</h2>
          <div className="divide-y divide-gray-800 mb-4" style={{ borderColor: '#262626' }}>
            {keranjang.map((item) => (
              <div key={item._id} className="py-3 flex justify-between items-center text-sm">
                <div>
                  <h4 className="font-medium text-gray-200 capitalize">{item.name}</h4>
                  <p className="text-xs text-gray-400">{item.qty} unit x Rp {Number(item.pricePerDay || 0).toLocaleString('id-ID')}/hari</p>
                </div>
                <span className="font-semibold text-gray-100">Rp {(item.pricePerDay * item.qty).toLocaleString('id-ID')}</span>
              </div>
            ))}
          </div>
          <div className="border-t border-gray-800 pt-4 space-y-2 text-sm" style={{ borderColor: '#262626' }}>
            <div className="flex justify-between text-gray-400"><span>Durasi Sewa:</span><span>{durasiSewa} Hari</span></div>
            <div className="flex justify-between font-bold text-lg border-t border-gray-800 pt-2 text-white" style={{ borderColor: '#262626' }}>
              <span>Total Pembayaran:</span><span className="text-orange-500" style={{ color: '#f97316' }}>Rp {hitungTotalSemua().toLocaleString('id-ID')}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}