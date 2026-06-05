import React, { useEffect, useRef, useState } from 'react';
import L from 'leaflet';
import { AlertCircle, CheckCircle2, Clock, FileText, ArrowRight } from 'lucide-react';

export default function DashboardView({ reports, onViewReportDetail, onViewAllReports }) {
  const mapRef = useRef(null);
  const mapInstance = useRef(null);
  const markersRef = useRef([]);
  const [stats, setStats] = useState({ total: 0, pending: 0, diproses: 0, selesai: 0 });

  // 1. Hitung Statistik Ringkasan
  useEffect(() => {
    const total = reports.length;
    const pending = reports.filter(r => r.status === 'Pending').length;
    const diproses = reports.filter(r => r.status === 'Diproses').length;
    const selesai = reports.filter(r => r.status === 'Selesai').length;
    setStats({ total, pending, diproses, selesai });
  }, [reports]);

  // 2. Inisialisasi Peta (Hanya dijalankan sekali)
  useEffect(() => {
    if (!mapInstance.current && mapRef.current) {
      // Fokus peta di koordinat Kampus UPI Cibiru, Bandung
      mapInstance.current = L.map(mapRef.current).setView([-6.9392, 107.7285], 15);

      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; OpenStreetMap contributors'
      }).addTo(mapInstance.current);
    }
  }, []);

  // 3. Update Pin Koordinat di Peta saat data Laporan dimuat/berubah
  useEffect(() => {
    if (mapInstance.current) {
      // Hapus marker lama dari peta
      markersRef.current.forEach(marker => mapInstance.current.removeLayer(marker));
      markersRef.current = [];

      // Tambahkan marker baru untuk setiap laporan
      reports.forEach(report => {
        if (report.latitude && report.longitude) {
          const markerColor = 
            report.status === 'Selesai' ? 'green' : 
            report.status === 'Diproses' ? 'orange' : 'red';
          
          // Menggunakan SVG marker kustom agar sesuai dengan tema warna tanpa dependensi asset gambar
          const customIcon = L.divIcon({
            html: `<div style="background-color: ${markerColor}; width: 14px; height: 14px; border-radius: 50%; border: 2px solid white; box-shadow: 0 0 4px rgba(0,0,0,0.5);"></div>`,
            className: 'custom-pin-icon',
            iconSize: [14, 14],
            iconAnchor: [7, 7]
          });

          const marker = L.marker([report.latitude, report.longitude], { icon: customIcon })
            .addTo(mapInstance.current)
            .bindPopup(`
              <div style="font-family: 'Outfit', sans-serif; font-size: 0.85rem; width: 200px;">
                <h4 style="margin-bottom: 6px; font-weight: 700;">Laporan Geotagging</h4>
                <p style="margin-bottom: 6px; color: #555; display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical; overflow: hidden;">${report.deskripsi}</p>
                <div style="display: flex; justify-content: space-between; align-items: center; margin-top: 8px;">
                  <span style="font-size: 0.75rem; font-weight: 600; color: ${markerColor};">${report.status}</span>
                  <button id="btn-popup-${report.id}" style="background-color: var(--accent); color: white; border: none; padding: 4px 8px; border-radius: 4px; font-size: 0.7rem; font-weight: 600; cursor: pointer;">Detail</button>
                </div>
              </div>
            `);

          // Penanganan event klik tombol detail di dalam popup peta Leaflet
          marker.on('popupopen', () => {
            document.getElementById(`btn-popup-${report.id}`).addEventListener('click', () => {
              onViewReportDetail(report);
            });
          });

          markersRef.current.push(marker);
        }
      });
    }
  }, [reports, onViewReportDetail]);

  // Urutkan laporan terbaru (Limit 5 untuk daftar aktivitas baru)
  const recentActivities = [...reports]
    .sort((a, b) => new Date(b.created_at) - new Date(a.created_at))
    .slice(0, 5);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}>
      
      {/* 4. Statistik Cards */}
      <div className="stats-container">
        
        <div className="card">
          <div className="stat-icon" style={{ backgroundColor: 'rgba(59, 130, 246, 0.1)', color: '#3b82f6' }}>
            <FileText size={24} />
          </div>
          <div className="stat-value">{stats.total}</div>
          <div className="stat-label">Total Laporan Masuk</div>
        </div>

        <div className="card">
          <div className="stat-icon" style={{ backgroundColor: 'rgba(239, 68, 68, 0.1)', color: 'var(--status-pending)' }}>
            <AlertCircle size={24} />
          </div>
          <div className="stat-value">{stats.pending}</div>
          <div className="stat-label">Laporan Baru (Pending)</div>
        </div>

        <div className="card">
          <div className="stat-icon" style={{ backgroundColor: 'rgba(245, 158, 11, 0.1)', color: 'var(--status-proses)' }}>
            <Clock size={24} />
          </div>
          <div className="stat-value">{stats.diproses}</div>
          <div className="stat-label">Laporan Sedang Diproses</div>
        </div>

        <div className="card">
          <div className="stat-icon" style={{ backgroundColor: 'rgba(16, 185, 129, 0.1)', color: 'var(--status-selesai)' }}>
            <CheckCircle2 size={24} />
          </div>
          <div className="stat-value">{stats.selesai}</div>
          <div className="stat-label">Laporan Selesai Ditangani</div>
        </div>

      </div>

      {/* 5. Grid Peta & Aktivitas Terbaru */}
      <div className="dashboard-grid">
        
        {/* Peta Sebaran Spasial */}
        <div className="card map-card">
          <h2>Peta Spasial Sebaran Titik Kerusakan</h2>
          <div ref={mapRef} className="leaflet-container" />
        </div>

        {/* Daftar Aktivitas Laporan Terbaru */}
        <div className="card activity-card">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
            <h2 style={{ margin: 0, fontSize: '1.25rem', fontWeight: 600 }}>Laporan Terbaru</h2>
            <button 
              onClick={onViewAllReports}
              style={{ background: 'none', border: 'none', color: 'var(--accent)', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '4px', fontSize: '0.85rem', fontWeight: 600 }}
            >
              Lihat Semua <ArrowRight size={14} />
            </button>
          </div>

          <div className="activity-list">
            {recentActivities.map((report) => {
              const statusColor = 
                report.status === 'Selesai' ? 'var(--status-selesai)' :
                report.status === 'Diproses' ? 'var(--status-proses)' : 'var(--status-pending)';
              const statusBg = 
                report.status === 'Selesai' ? 'var(--status-selesai-bg)' :
                report.status === 'Diproses' ? 'var(--status-proses-bg)' : 'var(--status-pending-bg)';

              return (
                <div key={report.id} className="activity-item" style={{ cursor: 'pointer' }} onClick={() => onViewReportDetail(report)}>
                  <div className="activity-icon" style={{ backgroundColor: statusBg, color: statusColor }}>
                    {report.status === 'Selesai' ? <CheckCircle2 size={16} /> : 
                     report.status === 'Diproses' ? <Clock size={16} /> : <AlertCircle size={16} />}
                  </div>
                  <div className="activity-info" style={{ flexGrow: 1 }}>
                    <h4>{report.nama_pelapor}</h4>
                    <p>{report.deskripsi}</p>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '4px' }}>
                      <span className="activity-time">{new Date(report.created_at).toLocaleDateString('id-ID', { hour: '2-digit', minute: '2-digit' })}</span>
                      <span style={{ fontSize: '0.75rem', fontWeight: 600, color: statusColor }}>{report.status}</span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

      </div>

    </div>
  );
}
