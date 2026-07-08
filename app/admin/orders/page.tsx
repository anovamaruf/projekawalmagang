'use client';
import { useEffect, useState } from 'react';
import Link from 'next/link';

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState<any[]>([]);

  async function fetchOrders() {
    try {
      const res = await fetch('/api/orders');
      const hasil = await res.json();
      if (hasil.success) setOrders(hasil.data);
    } catch (err) { console.error("Gagal ambil data:", err); }
  }

  const updateStatus = async (id: string, newStatus: string) => {
    try {
      const res = await fetch(`/api/orders/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus }),
      });
      if ((await res.json()).success) fetchOrders();
      else alert("Gagal update status");
    } catch (err) { alert("Error saat update"); }
  };

  const prosesPengembalian = async (order: any) => {
    try {
      const res = await fetch(`/api/orders/${order._id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: 'Selesai' }),
      });
      
      const hasil = await res.json();
      if (hasil.success) {
        for (const item of order.items) {
          await fetch(`/api/inputbarang/${item._id}`, {
            method: 'PATCH',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ action: 'TAMBAH', jumlah: item.qty }),
          });
        }
        fetchOrders();
      } else {
        alert("Gagal memproses pengembalian");
      }
    } catch (err) { 
      console.error(err);
      alert("Error saat memproses"); 
    }
  };

  const hapusOrder = async (id: string) => {
    if (!confirm("Yakin ingin menghapus pesanan ini?")) return;
    try {
      const res = await fetch(`/api/orders/${id}`, { method: 'DELETE' });
      if ((await res.json()).success) setOrders(orders.filter(o => o._id !== id));
      else alert("Gagal menghapus!");
    } catch (err) { alert("Error saat menghapus"); }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  return (
    <div className="p-6 md:p-10 bg-neutral-950 text-white min-h-screen">
      <div className="flex justify-between items-center mb-8 max-w-5xl mx-auto bg-neutral-900 p-4 rounded-xl border border-neutral-800">
        <h1 className="text-xl font-bold text-green-500">Dashboard Pesanan</h1>
        <div className="flex gap-2">
          <Link href="/" className="bg-neutral-800 hover:bg-neutral-700 px-4 py-2 rounded-lg text-sm transition">Beranda</Link>
          <Link href="/admin" className="bg-green-600 hover:bg-green-700 px-4 py-2 rounded-lg text-sm transition font-bold">Admin</Link>
        </div>
      </div>

      <div className="max-w-5xl mx-auto space-y-6">
        {orders.length === 0 ? (
          <p className="text-neutral-500 text-center py-10">Belum ada pesanan masuk.</p>
        ) : (
          orders.map((o: any) => (
            <div key={o._id} className="bg-neutral-900 p-6 rounded-2xl border border-neutral-800 shadow-lg relative">
              <div className="flex justify-between items-start border-b border-neutral-800 pb-4 mb-4">
                <div>
                  <h2 className="text-lg font-bold text-white">{o.customerName || o.namaPenyewa || "Tanpa Nama"}</h2>
                  <p className="text-sm text-neutral-400">WA: {o.nomorHp || o.whatsapp || "-"}</p>
                </div>
                
                <div className="flex items-center gap-3">
                  <span className={`text-[10px] uppercase px-3 py-1 rounded-full font-bold border ${
                    o.status === 'Selesai' ? 'bg-green-900/30 text-green-400 border-green-800' : 'bg-orange-900/30 text-orange-400 border-orange-800'
                  }`}>
                    {o.status || "Pending"}
                  </span>

                  {o.status === 'Pending' && (
                    <button 
                      onClick={() => updateStatus(o._id, 'Dipinjam')}
                      className="px-4 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-500 text-white text-[11px] font-bold transition-all"
                    >
                      ALAT DIAMBIL
                    </button>
                  )}

                  {o.status === 'Dipinjam' && (
                    <button 
                      onClick={() => prosesPengembalian(o)}
                      className="px-4 py-1.5 rounded-lg bg-green-600 hover:bg-green-500 text-white text-[11px] font-bold transition-all"
                    >
                      ALAT DIKEMBALIKAN
                    </button>
                  )}

                  <button 
                    onClick={() => hapusOrder(o._id)}
                    className="px-4 py-1.5 rounded-lg bg-neutral-800 hover:bg-red-900/50 text-neutral-400 hover:text-red-400 text-[11px] font-bold transition-all border border-neutral-700"
                  >
                    HAPUS
                  </button>
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <h3 className="text-xs font-bold text-neutral-500 uppercase mb-2">Data Diri & Pengiriman</h3>
                  <p className="text-sm">Tanggal: {o.tanggalSewa || "-"}</p>
                  <p className="text-sm">Durasi: {o.durasiSewa || "-"} Hari</p>
                  <p className="text-sm">Opsi: {o.opsiPengambilan || "-"}</p>
                  <p className="text-sm text-neutral-300 italic">Alamat: {o.alamatLengkap || "-"}</p>
                </div>
                <div>
                  <h3 className="text-xs font-bold text-neutral-500 uppercase mb-2">Rincian Barang</h3>
                  <ul className="space-y-1">
                    {o.items?.map((item: any, idx: number) => (
                      <li key={idx} className="flex justify-between text-sm bg-neutral-950 p-2 rounded">
                        <span>{item.name || "Barang"} <span className="text-neutral-500">x{item.qty || 1}</span></span>
                        <span className="font-bold text-green-500">Rp {Number(item.pricePerDay || 0).toLocaleString()}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}