import React, { useState, useEffect } from 'react';
import { LayoutDashboard, FileSpreadsheet, Users, LogOut, Sun, Moon, MapPin } from 'lucide-react';
import { supabase } from './supabaseClient';

// Import Views
import Login from './views/Login';
import DashboardView from './views/DashboardView';
import ReportsView from './views/ReportsView';
import UsersView from './views/UsersView';

export default function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [currentView, setCurrentView] = useState('dashboard'); // Options: 'dashboard', 'reports', 'users'
  const [theme, setTheme] = useState('light');
  const [reports, setReports] = useState([]);
  const [users, setUsers] = useState([]);
  const [selectedReport, setSelectedReport] = useState(null);
  const [loading, setLoading] = useState(false);

  // 1. Sinkronisasi Tema dengan Atribut Dokumen HTML
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme(prev => prev === 'light' ? 'dark' : 'light');
  };

  // 2. Mengambil data dari Supabase ketika login berhasil
  useEffect(() => {
    if (!isLoggedIn) return;

    const fetchData = async () => {
      setLoading(true);

      // Ambil data laporan/pengaduan beserta info profil pelapor (Join)
      const { data: reportsData, error: reportsError } = await supabase
        .from('laporan')
        .select(`
          *,
          profiles (
            id,
            NIK,
            nama,
            no_telpon
          )
        `)
        .order('created_at', { ascending: false });

      if (reportsError) {
        console.error('Error fetching reports:', reportsError);
      } else {
        const mappedReports = (reportsData || []).map(report => ({
          id: report.id_laporan, // Map id_laporan ke id agar memecahkan warning "key" prop di React
          id_laporan: report.id_laporan,
          pelapor_id: report.pelapor_id,
          nama_pelapor: report.profiles?.nama || 'Anonim',
          nik_pelapor: report.profiles?.NIK || '-',
          no_telp_pelapor: report.profiles?.no_telpon || '-',
          deskripsi: report.deskripsi,
          foto_url: report.foto_url,
          latitude: report.latitude,
          longitude: report.longitude,
          status: report.status,
          created_at: report.created_at,
          updated_at: report.updated_at
        }));
        setReports(mappedReports);
      }

      // Ambil data warga/users
      const { data: usersData, error: usersError } = await supabase
        .from('profiles')
        .select('*')
        .order('nama', { ascending: true });

      if (usersError) {
        console.error('Error fetching users:', usersError);
      } else {
        const mappedUsers = (usersData || []).map(user => ({
          ...user,
          nik: user.NIK || '-',
          no_telepon: user.no_telpon || '-'
        }));
        setUsers(mappedUsers);
      }

      setLoading(false);
    };

    fetchData();
  }, [isLoggedIn]);

  // 3. Mengubah Status Laporan ke Supabase
  const handleUpdateStatus = async (id, statusBaru) => {
    const updatedAt = new Date().toISOString();

    const { error } = await supabase
      .from('laporan')
      .update({ status: statusBaru, updated_at: updatedAt })
      .eq('id_laporan', id);

    if (error) {
      console.error('Error updating report status:', error);
      alert('Gagal memperbarui status: ' + error.message);
      return;
    }

    setReports(prevReports =>
      prevReports.map(report => {
        if (report.id === id) {
          return {
            ...report,
            status: statusBaru,
            updated_at: updatedAt
          };
        }
        return report;
      })
    );

    // Update selectedReport state if currently opened in modal
    if (selectedReport && selectedReport.id === id) {
      setSelectedReport(prev => ({
        ...prev,
        status: statusBaru,
        updated_at: updatedAt
      }));
    }
  };

  // Fungsi navigasi khusus untuk membuka detail laporan langsung dari peta/aktivitas terbaru
  const handleViewReportDetail = (report) => {
    setSelectedReport(report);
    setCurrentView('reports');
  };

  // 3. Render View Aktif
  const renderView = () => {
    switch (currentView) {
      case 'dashboard':
        return (
          <DashboardView
            reports={reports}
            onViewReportDetail={handleViewReportDetail}
            onViewAllReports={() => setCurrentView('reports')}
          />
        );
      case 'reports':
        return (
          <ReportsView
            reports={reports}
            onUpdateStatus={handleUpdateStatus}
            selectedReport={selectedReport}
            setSelectedReport={setSelectedReport}
          />
        );
      case 'users':
        return (
          <UsersView users={users} />
        );
      default:
        return <DashboardView reports={reports} />;
    }
  };

  // Jika belum login, tampilkan halaman Login
  if (!isLoggedIn) {
    return <Login onLoginSuccess={() => setIsLoggedIn(true)} />;
  }

  return (
    <div className="app-container">

      {/* SIDEBAR NAVIGATION */}
      <nav className="sidebar">
        <div className="sidebar-logo">
          <MapPin size={24} style={{ color: 'var(--accent)' }} />
          <span>Pelaporan Kerusakan</span>
        </div>

        <ul className="sidebar-menu">
          <li
            className={`menu-item ${currentView === 'dashboard' ? 'active' : ''}`}
            onClick={() => { setCurrentView('dashboard'); setSelectedReport(null); }}
          >
            <LayoutDashboard size={20} />
            <span>Dashboard</span>
          </li>
          <li
            className={`menu-item ${currentView === 'reports' ? 'active' : ''}`}
            onClick={() => setCurrentView('reports')}
          >
            <FileSpreadsheet size={20} />
            <span>Daftar Pengaduan</span>
          </li>
          <li
            className={`menu-item ${currentView === 'users' ? 'active' : ''}`}
            onClick={() => { setCurrentView('users'); setSelectedReport(null); }}
          >
            <Users size={20} />
            <span>Daftar Warga</span>
          </li>
        </ul>

        <div className="sidebar-footer">
          <button
            className="menu-item"
            style={{ width: '100%', background: 'none', border: 'none', textAlign: 'left', cursor: 'pointer' }}
            onClick={() => setIsLoggedIn(false)}
          >
            <LogOut size={20} style={{ color: 'var(--status-pending)' }} />
            <span style={{ color: 'var(--status-pending)', fontWeight: 600 }}>Keluar</span>
          </button>
        </div>
      </nav>

      {/* MAIN CONTENT AREA */}
      <main className="main-content">

        {/* HEADER BAR */}
        <header className="main-header">
          <div className="header-title">
            <h1>
              {currentView === 'dashboard' && 'Ringkasan Pemantauan'}
              {currentView === 'reports' && 'Kelola Laporan Pengaduan'}
              {currentView === 'users' && 'Data Warga Terdaftar'}
            </h1>
            <p>Kelurahan XXXXX, Kabupaten Bandung</p>
          </div>

          <div className="header-controls">
            {/* Theme Toggle Button */}
            <button className="theme-btn" onClick={toggleTheme} title="Ganti Tema">
              {theme === 'light' ? <Moon size={20} /> : <Sun size={20} />}
            </button>

            {/* Profile Info */}
            <div className="user-profile">
              <div className="avatar">AD</div>
              <div className="profile-info">
                <span className="profile-name">Administrator</span>
                <span className="profile-role">Staf Kelurahan</span>
              </div>
            </div>
          </div>
        </header>

        {/* ACTIVE VIEW CONTENT */}
        <div style={{ flexGrow: 1 }}>
          {loading ? (
            <div style={{
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'center',
              alignItems: 'center',
              height: '300px',
              gap: '16px',
              color: 'var(--text-secondary)'
            }}>
              <div style={{
                width: '40px',
                height: '40px',
                border: '4px solid var(--border-color)',
                borderTop: '4px solid var(--accent)',
                borderRadius: '50%',
                animation: 'spin 1s linear infinite'
              }}></div>
              <style>{`
                @keyframes spin {
                  0% { transform: rotate(0deg); }
                  100% { transform: rotate(360deg); }
                }
              `}</style>
              <span style={{ fontWeight: 600 }}>Memuat data dari database...</span>
            </div>
          ) : (
            renderView()
          )}
        </div>

      </main>

    </div>
  );
}
