'use client';
import { useEffect, useState } from 'react';
import Link from 'next/link';

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState<any[]>([]);

  useEffect(() => {
    async function fetchOrders() {
      try {
        const res = await fetch('/api/orders');
        const hasil = await res.json();
        if (hasil.success) setOrders(hasil.data);
      } catch (err) { console.error("Gagal ambil data:", err); }
    }
    fetchOrders();
  }, []);

  return (
    <div className="p-10 bg-neutral-950 text-white min-h-screen">
      <div className="flex justify-between items-center mb-8 max-w-5xl mx-auto bg-neutral-900 p-4 rounded-xl border border-neutral-800">
        <h1 className="text-xl font-bold text-green-500">Dashboard Pesanan</h1>
        <div className="flex gap-2">
          <Link href="/" className="bg-neutral-800 hover:bg-neutral-700 px-4 py-2 rounded-lg text-sm transition">Beranda</Link>
          <Link href="/katalog" className="bg-neutral-800 hover:bg-neutral-700 px-4 py-2 rounded-lg text-sm transition">Katalog</Link>
          <Link href="/admin" className="bg-green-600 hover:bg-green-700 px-4 py-2 rounded-lg text-sm transition font-bold">Admin</Link>
        </div>
      </div>

      <div className="max-w-5xl mx-auto bg-neutral-900 p-6 rounded-2xl border border-neutral-800">
        {orders.length === 0 ? (
          <p className="text-neutral-500 text-center py-10">Belum ada pesanan masuk saat ini.</p>
        ) : (
          <ul className="space-y-4">
            {orders.map((o: any) => (
              <li key={o._id} className="border-b border-neutral-800 pb-4 flex justify-between">
                <span>Pesanan dari: <strong>{o.customerName || "Customer"}</strong></span>
                <span className="text-green-400">Rp {o.totalPrice?.toLocaleString()}</span>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}