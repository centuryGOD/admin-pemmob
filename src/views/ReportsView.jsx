import React, { useState } from 'react';
import { Search, Eye, X, ShieldAlert, Phone, User, Calendar, MapPin, CheckCircle, Navigation } from 'lucide-react';

export default function ReportsView({ reports, onUpdateStatus, selectedReport, setSelectedReport }) {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');

  // Filter & Search Logic
  const filteredReports = reports.filter(report => {
    const matchesSearch = 
      report.deskripsi.toLowerCase().includes(searchTerm.toLowerCase()) ||
      report.nama_pelapor.toLowerCase().includes(searchTerm.toLowerCase()) ||
      report.nik_pelapor.includes(searchTerm);

    const matchesStatus = statusFilter === 'All' || report.status === statusFilter;

    return matchesSearch && matchesStatus;
  });

  const handleOpenDetail = (report) => {
    setSelectedReport(report);
  };

  const handleCloseDetail = () => {
    setSelectedReport(null);
  };

  const getStatusClass = (status) => {
    switch (status) {
      case 'Selesai': return 'status-pill selesai';
      case 'Diproses': return 'status-pill diproses';
      default: return 'status-pill pending';
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      
      {/* Table Card */}
      <div className="card table-card">
        
        {/* Table Controls (Search & Filter) */}
        <div className="table-header-controls">
          
          <div className="search-input-wrapper">
            <Search className="search-icon" size={18} />
            <input
              type="text"
              className="search-input"
              placeholder="Cari deskripsi, NIK, atau nama..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          <div className="filter-btn-group">
            {['All', 'Pending', 'Diproses', 'Selesai'].map((status) => (
              <button
                key={status}
                className={`filter-btn ${statusFilter === status ? 'active' : ''}`}
                onClick={() => setStatusFilter(status)}
              >
                {status === 'All' ? 'Semua Laporan' : status}
              </button>
            ))}
          </div>

        </div>

        {/* Data Table */}
        <div className="table-wrapper">
          <table className="custom-table">
            <thead>
              <tr>
                <th>Tanggal</th>
                <th>Pelapor</th>
                <th>Deskripsi Laporan</th>
                <th>Koordinat</th>
                <th>Status</th>
                <th style={{ textAlign: 'center' }}>Aksi</th>
              </tr>
            </thead>
            <tbody>
              {filteredReports.length > 0 ? (
                filteredReports.map((report) => (
                  <tr key={report.id}>
                    <td style={{ whiteSpace: 'nowrap' }}>
                      {new Date(report.created_at).toLocaleDateString('id-ID')}
                    </td>
                    <td>
                      <div style={{ fontWeight: 600 }}>{report.nama_pelapor}</div>
                      <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>NIK: {report.nik_pelapor}</div>
                    </td>
                    <td>
                      <div style={{
                        maxWidth: '300px',
                        display: '-webkit-box',
                        WebkitLineClamp: '2',
                        WebkitBoxOrient: 'vertical',
                        overflow: 'hidden',
                        textOverflow: 'ellipsis'
                      }}>
                        {report.deskripsi}
                      </div>
                    </td>
                    <td style={{ whiteSpace: 'nowrap', fontSize: '0.8rem', fontFamily: 'monospace' }}>
                      {report.latitude.toFixed(6)}, {report.longitude.toFixed(6)}
                    </td>
                    <td>
                      <span className={getStatusClass(report.status)}>{report.status}</span>
                    </td>
                    <td>
                      <div style={{ display: 'flex', justifyContent: 'center', gap: '8px' }}>
                        <button 
                          className="btn-icon" 
                          onClick={() => handleOpenDetail(report)}
                          title="Lihat Detail"
                        >
                          <Eye size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="6" style={{ textAlign: 'center', padding: '40px', color: 'var(--text-secondary)', fontWeight: 500 }}>
                    Tidak ada laporan ditemukan yang cocok dengan kriteria pencarian.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

      </div>

      {/* Report Detail Modal */}
      {selectedReport && (
        <div className="modal-overlay" onClick={handleCloseDetail}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            
            <div className="modal-header">
              <h2>Detail Laporan Kerusakan</h2>
              <button className="modal-close" onClick={handleCloseDetail}>
                <X size={20} />
              </button>
            </div>

            <div className="modal-body">
              
              {/* Left Side: Photo & Location Map Link */}
              <div>
                <img 
                  className="modal-detail-photo" 
                  src={selectedReport.foto_url} 
                  alt="Bukti kerusakan"
                />
                
                <div className="card" style={{ padding: '16px', backgroundColor: 'var(--bg-primary)' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px', color: 'var(--accent)', fontWeight: 600, fontSize: '0.9rem', marginBottom: '8px' }}>
                    <MapPin size={18} />
                    <span>Titik Koordinat Geospasial</span>
                  </div>
                  <p style={{ fontFamily: 'monospace', fontSize: '0.85rem', marginBottom: '12px' }}>
                    Latitude: {selectedReport.latitude}<br />
                    Longitude: {selectedReport.longitude}
                  </p>
                  <a 
                    href={`https://www.google.com/maps/search/?api=1&query=${selectedReport.latitude},${selectedReport.longitude}`}
                    target="_blank"
                    rel="noreferrer"
                    className="btn-primary"
                    style={{ textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: '8px', fontSize: '0.8rem', padding: '6px 12px' }}
                  >
                    <Navigation size={14} /> Buka Google Maps
                  </a>
                </div>
              </div>

              {/* Right Side: Citizen & Report Details */}
              <div className="info-group">
                
                <div style={{ borderBottom: '1px solid var(--border-color)', paddingBottom: '12px', marginBottom: '12px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontWeight: 600, color: 'var(--text-secondary)', fontSize: '0.8rem', textTransform: 'uppercase', marginBottom: '8px' }}>
                    <User size={14} />
                    <span>Informasi Pelapor</span>
                  </div>
                  <div className="info-row" style={{ marginBottom: '8px' }}>
                    <span className="info-label">Nama Lengkap</span>
                    <span className="info-value">{selectedReport.nama_pelapor}</span>
                  </div>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                    <div className="info-row">
                      <span className="info-label">NIK (Nomor Induk)</span>
                      <span className="info-value" style={{ fontFamily: 'monospace' }}>{selectedReport.nik_pelapor}</span>
                    </div>
                    <div className="info-row">
                      <span className="info-label">No. Telepon</span>
                      <span className="info-value" style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                        <Phone size={12} style={{ color: 'var(--text-secondary)' }} />
                        {selectedReport.no_telp_pelapor}
                      </span>
                    </div>
                  </div>
                </div>

                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontWeight: 600, color: 'var(--text-secondary)', fontSize: '0.8rem', textTransform: 'uppercase', marginBottom: '8px' }}>
                    <ShieldAlert size={14} />
                    <span>Laporan & Deskripsi</span>
                  </div>
                  
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '12px' }}>
                    <div className="info-row">
                      <span className="info-label">Tanggal Masuk</span>
                      <span className="info-value" style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                        <Calendar size={12} style={{ color: 'var(--text-secondary)' }} />
                        {new Date(selectedReport.created_at).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })}
                      </span>
                    </div>
                    <div className="info-row">
                      <span className="info-label">Status Penanganan</span>
                      <div>
                        <span className={getStatusClass(selectedReport.status)}>{selectedReport.status}</span>
                      </div>
                    </div>
                  </div>

                  <div className="info-row">
                    <span className="info-label">Kronologi / Detail Kejadian</span>
                    <p style={{ fontSize: '0.9rem', lineHeight: '1.5', color: 'var(--text-primary)', backgroundColor: 'var(--bg-primary)', padding: '12px', borderRadius: '8px', border: '1px solid var(--border-color)' }}>
                      {selectedReport.deskripsi}
                    </p>
                  </div>
                </div>

              </div>

            </div>

            {/* Modal Actions (Change Status) */}
            <div className="modal-footer">
              <button 
                className="filter-btn" 
                onClick={handleCloseDetail}
              >
                Tutup
              </button>
              
              {selectedReport.status === 'Pending' && (
                <button 
                  className="btn-primary"
                  style={{ backgroundColor: 'var(--status-proses)', borderColor: 'var(--status-proses)' }}
                  onClick={() => {
                    onUpdateStatus(selectedReport.id, 'Diproses');
                    handleCloseDetail();
                  }}
                >
                  Proses Laporan
                </button>
              )}

              {selectedReport.status === 'Diproses' && (
                <button 
                  className="btn-primary"
                  style={{ backgroundColor: 'var(--status-selesai)', borderColor: 'var(--status-selesai)' }}
                  onClick={() => {
                    onUpdateStatus(selectedReport.id, 'Selesai');
                    handleCloseDetail();
                  }}
                >
                  Selesaikan Penanganan
                </button>
              )}
            </div>

          </div>
        </div>
      )}

    </div>
  );
}
