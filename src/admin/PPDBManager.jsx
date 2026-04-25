import { useState, useEffect } from 'react';
import { FiCheckCircle, FiEye, FiX, FiCalendar, FiClock } from 'react-icons/fi';
import { fetchPPDBRegistrations, updatePPDBRegistration } from '../lib/directus';

const PPDBManager = () => {
    const [registrants, setRegistrants] = useState([]);
    const [loading, setLoading] = useState(true);
    const [detailModal, setDetailModal] = useState(null);
    const [verifyModal, setVerifyModal] = useState(null);
    const [jadwalTes, setJadwalTes] = useState({ tanggal: '', waktu: '', lokasi: 'Gedung Utama MA Annur' });
    const [saving, setSaving] = useState(false);

    const loadData = () => {
        setLoading(true);
        fetchPPDBRegistrations()
            .then(setRegistrants)
            .catch(() => setRegistrants([]))
            .finally(() => setLoading(false));
    };

    useEffect(() => { loadData(); }, []);

    const handleVerify = async () => {
        if (!jadwalTes.tanggal || !jadwalTes.waktu) return;
        setSaving(true);
        try {
            await updatePPDBRegistration(verifyModal.id, {
                verification_status: 'verified',
                jadwal_tes_tanggal: jadwalTes.tanggal,
                jadwal_tes_waktu: jadwalTes.waktu,
                jadwal_tes_lokasi: jadwalTes.lokasi,
            });
            setVerifyModal(null);
            setJadwalTes({ tanggal: '', waktu: '', lokasi: 'Gedung Utama MA Annur' });
            loadData();
        } catch (err) {
            alert('Gagal memverifikasi: ' + err.message);
        } finally {
            setSaving(false);
        }
    };

    const pendingCount = registrants.filter(r => r.verification_status === 'pending').length;
    const successCount = registrants.filter(r => r.verification_status === 'verified').length;

    return (
        <div>
            <h2 style={{ marginBottom: '0.5rem', color: 'var(--gray-800)' }}>Kelola PPDB</h2>
            <p style={{ color: 'var(--gray-500)', marginBottom: '2rem' }}>Verifikasi pembayaran dan atur jadwal tes masuk</p>

            {/* Summary */}
            <div style={{ display: 'flex', gap: '1rem', marginBottom: '2rem' }}>
                <div style={{
                    background: '#fef3c7', padding: '0.75rem 1.25rem', borderRadius: '10px',
                    display: 'flex', alignItems: 'center', gap: '0.5rem', fontWeight: 600, fontSize: '0.9rem', color: '#92400e'
                }}>
                    <FiClock /> {pendingCount} Menunggu Verifikasi
                </div>
                <div style={{
                    background: 'var(--emerald-100)', padding: '0.75rem 1.25rem', borderRadius: '10px',
                    display: 'flex', alignItems: 'center', gap: '0.5rem', fontWeight: 600, fontSize: '0.9rem', color: 'var(--emerald-800)'
                }}>
                    <FiCheckCircle /> {successCount} Terverifikasi
                </div>
            </div>

            <div className="admin-table-wrapper">
                <div className="admin-table-header">
                    <h3>Daftar Pendaftar ({registrants.length})</h3>
                </div>
                <table className="admin-table">
                    <thead>
                        <tr>
                            <th>Nama Lengkap</th>
                            <th>Asal Sekolah</th>
                            <th>Jurusan</th>
                            <th>No. HP</th>
                            <th>Tgl Daftar</th>
                            <th>Status</th>
                            <th>Aksi</th>
                        </tr>
                    </thead>
                    <tbody>
                        {loading ? (
                            <tr><td colSpan="7" style={{ textAlign: 'center', padding: '2rem', color: 'var(--gray-400)' }}>Memuat...</td></tr>
                        ) : registrants.length === 0 ? (
                            <tr><td colSpan="7" style={{ textAlign: 'center', padding: '2rem', color: 'var(--gray-400)' }}>Belum ada pendaftar. Calon siswa dapat mendaftar melalui halaman PPDB.</td></tr>
                        ) : (
                            registrants.map(r => (
                                <tr key={r.id}>
                                    <td style={{ fontWeight: 500, color: 'var(--gray-700)' }}>{r.nama_lengkap}</td>
                                    <td>{r.asal_sekolah}</td>
                                    <td>{r.jurusan}</td>
                                    <td>{r.no_hp}</td>
                                    <td>{r.date_created ? new Date(r.date_created).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' }) : '-'}</td>
                                    <td>
                                        <span className={`status-badge ${r.verification_status}`}>
                                            {r.verification_status === 'pending' ? '⏳ Pending' : '✅ Berhasil'}
                                        </span>
                                    </td>
                                    <td>
                                        <div style={{ display: 'flex', gap: '0.5rem' }}>
                                            <button className="btn-action blue" onClick={() => setDetailModal(r)}>
                                                <FiEye /> Detail
                                            </button>
                                            {r.verification_status === 'pending' && (
                                                <button className="btn-action green" onClick={() => setVerifyModal(r)}>
                                                    <FiCheckCircle /> Verifikasi
                                                </button>
                                            )}
                                        </div>
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>

            {/* Detail Modal */}
            {detailModal && (
                <div className="admin-modal-overlay" onClick={() => setDetailModal(null)}>
                    <div className="admin-modal" onClick={e => e.stopPropagation()}>
                        <div className="admin-modal-header">
                            <h3>Detail Pendaftar</h3>
                            <button className="admin-modal-close" onClick={() => setDetailModal(null)}><FiX /></button>
                        </div>
                        <div className="admin-modal-body">
                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                                {[
                                    ['Nama Lengkap', detailModal.nama_lengkap],
                                    ['NISN', detailModal.nisn || '-'],
                                    ['Tempat Lahir', detailModal.tempat_lahir],
                                    ['Tanggal Lahir', detailModal.tanggal_lahir || '-'],
                                    ['Jenis Kelamin', detailModal.jenis_kelamin === 'L' ? 'Laki-laki' : 'Perempuan'],
                                    ['Jurusan', detailModal.jurusan],
                                    ['Asal Sekolah', detailModal.asal_sekolah],
                                    ['Nama Orang Tua', detailModal.nama_ortu],
                                    ['No. HP', detailModal.no_hp],
                                    ['Tanggal Daftar', detailModal.date_created ? new Date(detailModal.date_created).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' }) : '-'],
                                ].map(([label, value], i) => (
                                    <div key={i}>
                                        <p style={{ fontSize: '0.78rem', color: 'var(--gray-400)', marginBottom: '2px' }}>{label}</p>
                                        <p style={{ fontSize: '0.9rem', color: 'var(--gray-700)', fontWeight: 500 }}>{value}</p>
                                    </div>
                                ))}
                            </div>
                            <div style={{ marginTop: '1rem' }}>
                                <p style={{ fontSize: '0.78rem', color: 'var(--gray-400)', marginBottom: '2px' }}>Alamat</p>
                                <p style={{ fontSize: '0.9rem', color: 'var(--gray-700)' }}>{detailModal.alamat}</p>
                            </div>
                            <div style={{ marginTop: '1rem', padding: '1rem', background: 'var(--gray-50)', borderRadius: '10px' }}>
                                <p style={{ fontSize: '0.78rem', color: 'var(--gray-400)', marginBottom: '4px' }}>Status Pembayaran</p>
                                <span className={`status-badge ${detailModal.verification_status}`}>
                                    {detailModal.verification_status === 'pending' ? '⏳ Pending' : '✅ Berhasil'}
                                </span>
                                {detailModal.jadwal_tes_tanggal && (
                                    <div style={{ marginTop: '0.75rem' }}>
                                        <p style={{ fontSize: '0.78rem', color: 'var(--gray-400)', marginBottom: '4px' }}>Jadwal Tes Masuk</p>
                                        <p style={{ fontSize: '0.9rem', color: 'var(--emerald-700)', fontWeight: 600 }}>
                                            📅 {detailModal.jadwal_tes_tanggal} • 🕐 {detailModal.jadwal_tes_waktu}
                                        </p>
                                        <p style={{ fontSize: '0.85rem', color: 'var(--gray-500)' }}>📍 {detailModal.jadwal_tes_lokasi}</p>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Verify Modal */}
            {verifyModal && (
                <div className="admin-modal-overlay" onClick={() => setVerifyModal(null)}>
                    <div className="admin-modal" onClick={e => e.stopPropagation()}>
                        <div className="admin-modal-header">
                            <h3>Verifikasi Pembayaran</h3>
                            <button className="admin-modal-close" onClick={() => setVerifyModal(null)}><FiX /></button>
                        </div>
                        <div className="admin-modal-body">
                            <div style={{
                                background: 'var(--emerald-50)', border: '1px solid var(--emerald-200)',
                                borderRadius: '10px', padding: '1rem', marginBottom: '1.5rem'
                            }}>
                                <p style={{ fontSize: '0.85rem', color: 'var(--emerald-700)' }}>
                                    Anda akan memverifikasi pembayaran untuk <strong>{verifyModal.nama_lengkap}</strong>.
                                    Setelah diverifikasi, status akan berubah menjadi "Berhasil" dan jadwal tes akan dikirimkan.
                                </p>
                            </div>

                            <div className="form-group">
                                <label><FiCalendar style={{ marginRight: '4px' }} /> Tanggal Tes *</label>
                                <input type="date" className="form-input" value={jadwalTes.tanggal} onChange={e => setJadwalTes({ ...jadwalTes, tanggal: e.target.value })} />
                            </div>
                            <div className="form-group">
                                <label><FiClock style={{ marginRight: '4px' }} /> Waktu Tes *</label>
                                <input type="time" className="form-input" value={jadwalTes.waktu} onChange={e => setJadwalTes({ ...jadwalTes, waktu: e.target.value })} />
                            </div>
                            <div className="form-group">
                                <label>Lokasi Tes</label>
                                <input className="form-input" value={jadwalTes.lokasi} onChange={e => setJadwalTes({ ...jadwalTes, lokasi: e.target.value })} />
                            </div>
                        </div>
                        <div className="admin-modal-footer">
                            <button className="btn-cancel" onClick={() => setVerifyModal(null)}>Batal</button>
                            <button className="btn-add" onClick={handleVerify} disabled={saving}>
                                {saving ? 'Memproses...' : <><FiCheckCircle /> Verifikasi & Kirim Jadwal</>}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default PPDBManager;
