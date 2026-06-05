import React, { useState } from 'react';
import { Search, UserCheck } from 'lucide-react';

export default function UsersView({ users }) {
  const [searchTerm, setSearchTerm] = useState('');

  // Filter users based on search
  const filteredUsers = users.filter(user => 
    user.nama.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.nik.includes(searchTerm) ||
    user.no_telepon.includes(searchTerm) ||
    user.tempat_lahir.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      
      {/* Users Card Table */}
      <div className="card table-card">
        
        {/* Controls */}
        <div className="table-header-controls">
          <div className="search-input-wrapper">
            <Search className="search-icon" size={18} />
            <input
              type="text"
              className="search-input"
              placeholder="Cari NIK, nama, atau no. telp..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', fontWeight: 500 }}>
            Total Warga Terdaftar: <span style={{ color: 'var(--accent)', fontWeight: 700 }}>{users.length}</span>
          </div>
        </div>

        {/* Table */}
        <div className="table-wrapper">
          <table className="custom-table">
            <thead>
              <tr>
                <th>NIK (Nomor Induk)</th>
                <th>Nama Lengkap</th>
                <th>Tempat, Tanggal Lahir</th>
                <th>No. Telepon</th>
                <th>Peran</th>
                <th>Status Akun</th>
              </tr>
            </thead>
            <tbody>
              {filteredUsers.length > 0 ? (
                filteredUsers.map((user) => (
                  <tr key={user.id}>
                    <td style={{ fontFamily: 'monospace', fontWeight: 600 }}>{user.nik}</td>
                    <td>{user.nama}</td>
                    <td>{user.tempat_lahir}, {new Date(user.tanggal_lahir).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })}</td>
                    <td>{user.no_telepon}</td>
                    <td style={{ textTransform: 'capitalize' }}>
                      <span style={{ 
                        display: 'inline-flex', 
                        padding: '4px 8px', 
                        borderRadius: '4px', 
                        fontSize: '0.75rem', 
                        fontWeight: 600, 
                        backgroundColor: 'var(--bg-primary)', 
                        color: 'var(--text-primary)' 
                      }}>
                        {user.role}
                      </span>
                    </td>
                    <td>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: 'var(--status-selesai)', fontWeight: 600, fontSize: '0.85rem' }}>
                        <UserCheck size={16} />
                        <span>Terverifikasi</span>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="6" style={{ textAlign: 'center', padding: '40px', color: 'var(--text-secondary)', fontWeight: 500 }}>
                    Tidak ada data warga ditemukan.
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
