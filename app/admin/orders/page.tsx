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

  const hapusOrder = async (id: string) => {
    if (!confirm("Yakin ingin menghapus pesanan ini?")) return;
    try {
      const res = await fetch(`/api/orders/${id}`, { method: 'DELETE' });
      const hasil = await res.json();
      if (hasil.success) {
        setOrders(orders.filter(o => o._id !== id));
      } else {
        alert("Gagal menghapus!");
      }
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
                  {/* Cek kedua kemungkinan nama field */}
                  <h2 className="text-lg font-bold text-white">{o.customerName || o.namaPenyewa || "Tanpa Nama"}</h2>
                  <p className="text-sm text-neutral-400">WA: {o.nomorHp || o.whatsapp || "-"}</p>
                </div>
                <div className="text-right flex flex-col items-end gap-2">
                  <p className="text-green-500 font-bold text-lg">Rp {o.totalPrice?.toLocaleString() || "0"}</p>
                  <div className="flex items-center gap-3">
                    <span className="text-[10px] uppercase bg-neutral-800 px-2 py-1 rounded">{o.status || "Pending"}</span>
                    <button onClick={() => hapusOrder(o._id)} className="text-red-500 hover:text-red-400 text-xs font-bold underline">HAPUS</button>
                  </div>
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <h3 className="text-xs font-bold text-neutral-500 uppercase mb-2">Data Diri & Pengiriman</h3>
                  {/* Cek kedua kemungkinan field */}
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