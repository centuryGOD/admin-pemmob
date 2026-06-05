// Data tiruan (mock data) untuk Sistem Pelaporan Kerusakan Infrastruktur Kelurahan
// Menggunakan area koordinat nyata di sekitar Kampus UPI Cibiru, Bandung

export const mockUsers = [
  {
    id: "usr-1",
    nik: "3273010203040001",
    nama: "Galih Nugraha",
    tempat_lahir: "Bandung",
    tanggal_lahir: "2004-08-12",
    no_telepon: "081234567890",
    role: "warga"
  },
  {
    id: "usr-2",
    nik: "3273010203040002",
    nama: "Fathur Ramadhan",
    tempat_lahir: "Jakarta",
    tanggal_lahir: "2004-02-19",
    no_telepon: "082345678901",
    role: "warga"
  },
  {
    id: "usr-3",
    nik: "3273010203040003",
    nama: "M. Athaa Illah F.W",
    tempat_lahir: "Surabaya",
    tanggal_lahir: "2004-07-03",
    no_telepon: "083456789012",
    role: "warga"
  },
  {
    id: "usr-4",
    nik: "3273010203040004",
    nama: "Verrel Kenzie",
    tempat_lahir: "Cirebon",
    tanggal_lahir: "2004-06-15",
    no_telepon: "084567890123",
    role: "warga"
  }
];

export const mockReports = [
  {
    id: "rep-1",
    pelapor_id: "usr-1",
    nama_pelapor: "Galih Nugraha",
    nik_pelapor: "3273010203040001",
    no_telp_pelapor: "081234567890",
    deskripsi: "Jalan utama berlubang cukup dalam di dekat persimpangan jalan masuk kampus. Sangat membahayakan pengendara motor saat malam hari atau hujan karena tertutup genangan air.",
    foto_url: "https://images.unsplash.com/photo-1515162305285-0293e4767cc2?auto=format&fit=crop&w=800&q=80",
    latitude: -6.938902,
    longitude: 107.728912,
    status: "Pending",
    created_at: "2026-06-01T09:12:00Z",
    updated_at: "2026-06-01T09:12:00Z"
  },
  {
    id: "rep-2",
    pelapor_id: "usr-2",
    nama_pelapor: "Fathur Ramadhan",
    nik_pelapor: "3273010203040002",
    no_telp_pelapor: "082345678901",
    deskripsi: "Saluran drainase air di samping jalan tersumbat oleh tumpukan sampah plastik dan lumpur tebal, mengakibatkan air meluap membanjiri bahu jalan utama setiap kali terjadi hujan deras.",
    foto_url: "https://images.unsplash.com/photo-1541888946425-d81bb19240f5?auto=format&fit=crop&w=800&q=80",
    latitude: -6.939524,
    longitude: 107.727548,
    status: "Diproses",
    created_at: "2026-05-30T14:30:00Z",
    updated_at: "2026-05-31T08:00:00Z"
  },
  {
    id: "rep-3",
    pelapor_id: "usr-3",
    nama_pelapor: "M. Athaa Illah F.W",
    nik_pelapor: "3273010203040003",
    no_telp_pelapor: "083456789012",
    deskripsi: "Lampu penerangan jalan umum (PJU) mati total sebanyak 3 titik beruntun. Kondisi jalan menjadi sangat gelap gulita di malam hari dan rawan tindakan kriminalitas.",
    foto_url: "https://images.unsplash.com/photo-1509024644558-2f56ce76c490?auto=format&fit=crop&w=800&q=80",
    latitude: -6.937512,
    longitude: 107.731055,
    status: "Selesai",
    created_at: "2026-05-28T21:05:00Z",
    updated_at: "2026-05-29T10:15:00Z"
  },
  {
    id: "rep-4",
    pelapor_id: "usr-4",
    nama_pelapor: "Verrel Kenzie",
    nik_pelapor: "3273010203040004",
    no_telp_pelapor: "084567890123",
    deskripsi: "Pondasi jembatan penghubung antar RW terlihat retak cukup lebar setelah banjir bandang minggu lalu. Khawatir struktur jembatan akan ambruk jika terus dilalui kendaraan berat.",
    foto_url: "https://images.unsplash.com/photo-1582234372722-50d7ccc30ebd?auto=format&fit=crop&w=800&q=80",
    latitude: -6.941015,
    longitude: 107.729562,
    status: "Pending",
    created_at: "2026-06-02T10:00:00Z",
    updated_at: "2026-06-02T10:00:00Z"
  },
  {
    id: "rep-5",
    pelapor_id: "usr-1",
    nama_pelapor: "Galih Nugraha",
    nik_pelapor: "3273010203040001",
    no_telp_pelapor: "081234567890",
    deskripsi: "Tumpukan sampah liar menumpuk di pinggir jalan umum menimbulkan bau yang sangat busuk mengganggu warga sekitar dan pejalan kaki yang lewat.",
    foto_url: "https://images.unsplash.com/photo-1611284446314-60a58ac0deb9?auto=format&fit=crop&w=800&q=80",
    latitude: -6.936045,
    longitude: 107.726512,
    status: "Selesai",
    created_at: "2026-05-25T08:15:00Z",
    updated_at: "2026-05-27T16:00:00Z"
  }
];
