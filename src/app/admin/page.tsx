'use client';
import { useState, useEffect } from 'react';
import { auth, db } from '../firebase'; // Pastikan path ini benar
import { signInWithEmailAndPassword, signOut, onAuthStateChanged, User } from 'firebase/auth';
import { ref, onValue, remove } from 'firebase/database';
import toast, { Toaster } from 'react-hot-toast';
import { Player } from '../../lib/algorithm'; // Import interface Player

export default function AdminPage() {
  const [user, setUser] = useState<User | null>(null);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(true);
  
  // Data Dashboard
  const [players, setPlayers] = useState<(Player & { key: string })[]>([]);
  const [searchTerm, setSearchTerm] = useState('');

  // 1. Cek Status Login
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      setLoading(false);
      
      if (currentUser) {
        // Kalau Login Sukses, Ambil Data
        fetchData();
      }
    });
    return () => unsubscribe();
  }, []);

  // 2. Fungsi Ambil Data Realtime
  const fetchData = () => {
    const playersRef = ref(db, 'players');
    onValue(playersRef, (snapshot) => {
      const data = snapshot.val();
      if (data) {
        // Convert Object ke Array + Masukkan Key (ID)
        const parsedData = Object.entries(data).map(([key, value]: any) => ({
          key,
          ...value
        }));
        // Urutkan dari yang terbaru (Waktu)
        setPlayers(parsedData.sort((a, b) => b.waktu - a.waktu));
      } else {
        setPlayers([]);
      }
    });
  };

  // 3. Fungsi Login
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await signInWithEmailAndPassword(auth, email, password);
      toast.success("Welcome, Admin! 🕶️");
    } catch (err) {
      toast.error("Email atau Password salah!");
    }
  };

  // 4. Fungsi Logout
  const handleLogout = async () => {
    await signOut(auth);
    toast.success("Bye bye! 👋");
  };

  // 5. Fungsi Hapus Data (CRUD - Delete)
  const handleDelete = async (id: string) => {
    if (confirm("Yakin mau hapus data ini?")) {
      try {
        await remove(ref(db, `players/${id}`));
        toast.success("Data terhapus! 🗑️");
      } catch (err) {
        toast.error("Gagal menghapus.");
      }
    }
  };

  // --- RENDER: LOADING ---
  if (loading) return <div className="min-h-screen bg-[#020617] flex items-center justify-center text-white">Loading Admin...</div>;

  // --- RENDER: LOGIN FORM (JIKA BELUM LOGIN) ---
  if (!user) {
    return (
      <div className="min-h-screen bg-[#020617] flex items-center justify-center p-4 font-sans">
        <Toaster position="top-center" />
        <div className="w-full max-w-md bg-gray-900 border border-gray-800 p-8 rounded-3xl shadow-2xl">
          <div className="text-center mb-8">
            <div className="text-4xl mb-2">🔐</div>
            <h1 className="text-2xl font-bold text-white">Admin Access</h1>
            <p className="text-gray-500 text-sm">Hanya untuk Sultan Pemilik Web</p>
          </div>
          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="text-xs text-gray-400 ml-1">Email</label>
              <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} className="w-full bg-black/50 border border-gray-700 rounded-xl p-3 text-white focus:border-blue-500 outline-none transition-all" placeholder="admin@mystery.com" required />
            </div>
            <div>
              <label className="text-xs text-gray-400 ml-1">Password</label>
              <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} className="w-full bg-black/50 border border-gray-700 rounded-xl p-3 text-white focus:border-blue-500 outline-none transition-all" placeholder="••••••••" required />
            </div>
            <button type="submit" className="w-full bg-blue-600 hover:bg-blue-500 text-white font-bold py-3 rounded-xl transition-all shadow-lg shadow-blue-900/20">
              Masuk Dashboard
            </button>
          </form>
          <div className="mt-6 text-center text-[10px] text-gray-600">
            Mystery Fate 2026 Admin Panel
          </div>
        </div>
      </div>
    );
  }

  // --- RENDER: DASHBOARD (JIKA SUDAH LOGIN) ---
  const filteredPlayers = players.filter(p => p.nama.toLowerCase().includes(searchTerm.toLowerCase()));

  return (
    <div className="min-h-screen bg-[#020617] text-white p-4 md:p-8 font-sans">
      <Toaster position="top-center" />
      
      {/* HEADER */}
      <div className="max-w-6xl mx-auto flex flex-col md:flex-row justify-between items-center mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-400">Dashboard Admin</h1>
          <p className="text-gray-500 text-sm">Total Data: <span className="text-white font-bold">{players.length}</span> Pemain</p>
        </div>
        <button onClick={handleLogout} className="px-5 py-2 bg-red-900/30 text-red-400 border border-red-900/50 rounded-lg hover:bg-red-900/50 transition-all text-sm font-bold">
          Keluar 🚪
        </button>
      </div>

      {/* SEARCH BAR */}
      <div className="max-w-6xl mx-auto mb-6">
        <input 
          type="text" 
          placeholder="Cari nama toxic..." 
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full md:w-1/3 bg-gray-900 border border-gray-800 rounded-xl p-3 text-sm text-white focus:border-purple-500 outline-none"
        />
      </div>

      {/* TABLE DATA */}
      <div className="max-w-6xl mx-auto bg-gray-900/50 border border-gray-800 rounded-2xl overflow-hidden shadow-2xl backdrop-blur-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-gray-800 text-gray-400 uppercase text-xs">
              <tr>
                <th className="p-4">Waktu</th>
                <th className="p-4">Nama</th>
                <th className="p-4">Skor</th>
                <th className="p-4">Karakter</th>
                <th className="p-4 text-center">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-800">
              {filteredPlayers.map((player) => (
                <tr key={player.key} className="hover:bg-white/5 transition-colors">
                  <td className="p-4 text-gray-500 whitespace-nowrap">
                    {new Date(player.waktu).toLocaleTimeString()} <br/>
                    <span className="text-[10px]">{new Date(player.waktu).toLocaleDateString()}</span>
                  </td>
                  <td className="p-4 font-bold text-white">{player.nama}</td>
                  <td className="p-4">
                    <span className={`px-2 py-1 rounded text-xs font-bold ${player.skor > 80 ? 'bg-yellow-900/30 text-yellow-400 border border-yellow-700/50' : 'bg-gray-800 text-gray-300'}`}>
                      {player.skor}%
                    </span>
                  </td>
                  <td className="p-4 text-gray-300">{player.karakter}</td>
                  <td className="p-4 text-center">
                    <button 
                      onClick={() => handleDelete(player.key)}
                      className="text-red-500 hover:text-red-400 hover:bg-red-900/20 p-2 rounded-lg transition-all"
                      title="Hapus Data"
                    >
                      🗑️
                    </button>
                  </td>
                </tr>
              ))}
              {filteredPlayers.length === 0 && (
                <tr>
                  <td colSpan={5} className="p-8 text-center text-gray-500">
                    Tidak ada data ditemukan.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}