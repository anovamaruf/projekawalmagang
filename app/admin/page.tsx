'use client';
import { useSession, signIn } from "next-auth/react";
import { useState, useEffect } from 'react';

export default function AdminPage() {
  const { data: session, status } = useSession();
  const [formData, setFormData] = useState({ name: '', category: 'Tenda', pricePerDay: '', stock: '', image: '' });
  const [listAlat, setListAlat] = useState([]);
  const [loading, setLoading] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editId, setEditId] = useState('');

  const fetchBarang = async () => {
    try {
      const res = await fetch('/api/inputbarang');
      const hasil = await res.json();
      if (hasil.success) setListAlat(hasil.data);
    } catch (err) { console.error("Gagal ambil data:", err); }
  };

  useEffect(() => {
    if (session) fetchBarang();
  }, [session]);

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const dataForm = new FormData();
    dataForm.append('file', file);
    try {
      const res = await fetch('/api/upload', { method: 'POST', body: dataForm });
      const hasil = await res.json();
      if (hasil.success) setFormData(prev => ({ ...prev, image: hasil.url }));
    } catch (err) { console.error(err); }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    const url = isEditing ? `/api/inputbarang/${editId}` : '/api/inputbarang';
    const res = await fetch(url, {
      method: isEditing ? 'PUT' : 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ...formData, pricePerDay: Number(formData.pricePerDay), stock: Number(formData.stock) }),
    });
    if ((await res.json()).success) {
      setFormData({ name: '', category: 'Tenda', pricePerDay: '', stock: '', image: '' });
      setIsEditing(false);
      fetchBarang();
    }
    setLoading(false);
  };

  if (status === "loading") return <div className="text-white p-10">Memuat...</div>;

  if (!session) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-neutral-950 text-white p-6">
        <button onClick={() => signIn()} className="bg-green-600 px-6 py-3 rounded-lg font-bold">
          Login Admin Terlebih Dahulu
        </button>
      </div>
    );
  }

const emailAdmin = "anovamaruf@gmail.com"; 

if (session?.user?.email !== emailAdmin) {
  return <div>Akses Ditolak! Kamu bukan Admin.</div>;
}

  return (
    <div className="min-h-screen bg-neutral-950 p-6 text-white font-sans">
      <h1 className="text-2xl font-bold text-green-500 mb-6">Admin Dashboard</h1>
      
      <div className="bg-neutral-900 border border-neutral-800 p-6 rounded-2xl max-w-2xl mx-auto">
        <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <input className="bg-neutral-800 p-3 rounded-lg border border-neutral-700 outline-none" placeholder="Nama Alat" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} />
          <select className="bg-neutral-800 p-3 rounded-lg border border-neutral-700 outline-none" value={formData.category} onChange={e => setFormData({...formData, category: e.target.value})}>
            <option>Tenda</option><option>Carrier</option><option>Sepatu</option><option>Sleeping Bag</option><option>Alat Bantu Mendaki</option><option>Alat Camping</option>
          </select>
          <input type="number" className="bg-neutral-800 p-3 rounded-lg border border-neutral-700 outline-none" placeholder="Harga/hari" value={formData.pricePerDay} onChange={e => setFormData({...formData, pricePerDay: e.target.value})} />
          <input type="number" className="bg-neutral-800 p-3 rounded-lg border border-neutral-700 outline-none" placeholder="Stok" value={formData.stock} onChange={e => setFormData({...formData, stock: e.target.value})} />
          <div className="col-span-1 md:col-span-2">
            <label className="flex items-center justify-center w-full py-3 bg-neutral-800 border-2 border-dashed border-gray-600 rounded-lg cursor-pointer hover:border-green-500 transition font-bold text-gray-300">
              {formData.image ? "✅ Foto Sudah Terpilih" : "📸 Tambahkan Gambar/Foto"}
              <input type="file" className="hidden" onChange={handleFileUpload} />
            </label>
          </div>
          <button className="col-span-1 md:col-span-2 bg-green-600 hover:bg-green-700 py-3 rounded-lg font-bold transition text-white">
            {loading ? 'Menyimpan...' : 'Simpan Inventaris'}
          </button>
        </form>
      </div>

      <div className="mt-8 overflow-x-auto">
        <table className="w-full bg-neutral-900 rounded-2xl overflow-hidden border border-neutral-800">
          <thead><tr className="text-green-500 text-left"><th className="p-4">Foto</th><th className="p-4">Nama</th><th className="p-4">Stok</th><th className="p-4">Harga</th><th className="p-4 text-center">Aksi</th></tr></thead>
          <tbody>
            {listAlat.map((alat: any) => (
              <tr key={alat._id} className="border-b border-neutral-800 hover:bg-neutral-800/50">
                <td className="p-4"><img src={alat.image} className="w-12 h-12 object-cover rounded-lg" /></td>
                <td className="p-4">{alat.name}</td>
                <td className="p-4 text-blue-400 font-bold">{alat.stock}</td>
                <td className="p-4 text-orange-400">Rp {Number(alat.pricePerDay || 0).toLocaleString('id-ID')}</td>
                <td className="p-4 text-center">
                  <button onClick={() => {setIsEditing(true); setEditId(alat._id); setFormData(alat)}} className="mr-3 text-blue-400 hover:underline">Edit</button>
                  <button onClick={() => fetch(`/api/inputbarang/${alat._id}`, {method:'DELETE'}).then(fetchBarang)} className="text-red-400 hover:underline">Hapus</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}