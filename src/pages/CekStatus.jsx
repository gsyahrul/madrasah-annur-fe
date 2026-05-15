import { useState, useRef } from 'react';
import { FiSearch, FiAlertCircle, FiClock, FiDownload, FiArrowLeft, FiCalendar, FiCheckCircle } from 'react-icons/fi';
import { GiMoon } from 'react-icons/gi';
import { cekStatusPPDB } from '../lib/directus';
import html2pdf from 'html2pdf.js';
import './CekStatus.css';

const CekStatus = () => {
    const [nisn, setNisn] = useState('');
    const [loading, setLoading] = useState(false);
    const [result, setResult] = useState(null);
    const [error, setError] = useState('');
    const [downloading, setDownloading] = useState(false);
    const [downloaded, setDownloaded] = useState(false);
    const kartuRef = useRef(null);

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!nisn.trim()) return;

        setLoading(true);
        setResult(null);
        setError('');
        setDownloaded(false);

        try {
            const data = await cekStatusPPDB(nisn.trim());
            if (!data) {
                setResult('not_found');
            } else {
                setResult(data);
            }
        } catch (err) {
            setError(err.message || 'Terjadi kesalahan. Silakan coba lagi.');
        } finally {
            setLoading(false);
        }
    };

    const handleDownloadPDF = async () => {
        if (!kartuRef.current) return;
        setDownloading(true);
        try {
            const element = kartuRef.current;
            // B4 size: 250mm × 353mm
            const opt = {
                margin:       [15, 15, 15, 15],
                filename:     `Kartu_Peserta_Tes_${result.nama_lengkap?.replace(/\s+/g, '_') || 'PPDB'}.pdf`,
                image:        { type: 'jpeg', quality: 0.98 },
                html2canvas:  { scale: 2, useCORS: true, letterRendering: true },
                jsPDF:        { unit: 'mm', format: [250, 353], orientation: 'portrait' },
            };
            await html2pdf().set(opt).from(element).save();
            setDownloaded(true);
        } catch (err) {
            alert('Gagal mengunduh PDF: ' + err.message);
        } finally {
            setDownloading(false);
        }
    };

    const handleReset = () => {
        setResult(null);
        setNisn('');
        setError('');
        setDownloaded(false);
    };

    const formatDate = (dateStr) => {
        if (!dateStr) return '-';
        try {
            return new Date(dateStr).toLocaleDateString('id-ID', {
                weekday: 'long',
                day: 'numeric',
                month: 'long',
                year: 'numeric',
            });
        } catch {
            return dateStr;
        }
    };

    const isVerified = result && typeof result === 'object' && result.verification_status === 'verified';
    const isPending  = result && typeof result === 'object' && result.verification_status === 'pending';
    const notFound   = result === 'not_found';

    return (
        <div className="cek-status-page">
            <div className="container">
                {/* Hero */}
                <div className="cek-status-hero">
                    <div className="badge-label">
                        <FiSearch /> Cek Status Pendaftaran
                    </div>
                    <h1>Status Pendaftaran PPDB</h1>
                    <p>Masukkan NISN Anda untuk mengecek status verifikasi pendaftaran dan mengunduh Kartu Peserta Tes</p>
                </div>

                {/* ---- Search Form (show when NOT verified) ---- */}
                {!isVerified && (
                    <div className="search-card">
                        <h3>🔍 Cek Status</h3>
                        <p className="search-subtitle">Masukkan NISN yang digunakan saat pendaftaran</p>

                        <form onSubmit={handleSubmit}>
                            <div className="form-group">
                                <label htmlFor="nisn-input">NISN (Nomor Induk Siswa Nasional)</label>
                                <input
                                    id="nisn-input"
                                    type="text"
                                    className="form-control"
                                    placeholder="Contoh: 0012345678"
                                    value={nisn}
                                    onChange={(e) => setNisn(e.target.value)}
                                    maxLength={20}
                                    required
                                />
                            </div>
                            <button type="submit" className="btn-search" disabled={loading || !nisn.trim()}>
                                {loading ? (
                                    <>
                                        <span className="spinner-inline"></span>
                                        Mencari...
                                    </>
                                ) : (
                                    <>
                                        <FiSearch /> Cek Status
                                    </>
                                )}
                            </button>
                        </form>
                    </div>
                )}

                {/* ---- Error Alert ---- */}
                {error && (
                    <div className="cek-status-alert alert-danger">
                        <FiAlertCircle size={20} />
                        <span>{error}</span>
                    </div>
                )}

                {/* ---- Not Found ---- */}
                {notFound && (
                    <div className="cek-status-alert alert-danger">
                        <FiAlertCircle size={20} />
                        <span>Data pendaftaran dengan NISN tersebut tidak ditemukan. Pastikan NISN yang Anda masukkan sudah benar.</span>
                    </div>
                )}

                {/* ---- Pending ---- */}
                {isPending && (
                    <div className="cek-status-alert alert-warning">
                        <FiClock size={20} />
                        <span>
                            Data Anda ditemukan atas nama <strong>{result.nama_lengkap}</strong>.
                            Status pendaftaran sedang dalam proses verifikasi oleh Admin. Silakan cek kembali nanti.
                        </span>
                    </div>
                )}

                {/* ---- Verified → Kartu Peserta Tes (ID Card Style) ---- */}
                {isVerified && (
                    <div className="kartu-section">
                        <div className="kartu-actions-top">
                            <button className="btn-back" onClick={handleReset}>
                                <FiArrowLeft /> Cari Ulang
                            </button>
                        </div>

                        {/* ID Card — exported to PDF */}
                        <div className="kartu-peserta" ref={kartuRef}>
                            {/* Decorative top stripe */}
                            <div className="kartu-stripe"></div>

                            {/* Header / Kop */}
                            <div className="kartu-kop">
                                <div className="kartu-logo">
                                    <GiMoon />
                                </div>
                                <div className="kartu-kop-text">
                                    <div className="kartu-institution">MADRASAH ALIYAH ANNUR</div>
                                    <div className="kartu-address">Jl. Pendidikan No. 1 — Terakreditasi A</div>
                                </div>
                            </div>

                            {/* Title Band */}
                            <div className="kartu-title-band">
                                <span>KARTU PESERTA TES MASUK</span>
                                <span className="kartu-tahun">T.A 2026/2027</span>
                            </div>

                            {/* Main Body */}
                            <div className="kartu-body">
                                {/* Photo placeholder + Info side-by-side */}
                                <div className="kartu-main-layout">
                                    {/* Photo area */}
                                    <div className="kartu-photo-area">
                                        <div className="kartu-photo-placeholder">
                                            <span>FOTO</span>
                                            <span className="photo-size">3×4</span>
                                        </div>
                                        <div className="kartu-no-peserta">
                                            <div className="no-peserta-label">NO. PESERTA</div>
                                            <div className="no-peserta-value">{String(result.id).padStart(4, '0')}</div>
                                        </div>
                                    </div>

                                    {/* Data fields */}
                                    <div className="kartu-info">
                                        <table className="kartu-table">
                                            <tbody>
                                                <tr>
                                                    <td className="td-label">Nama Lengkap</td>
                                                    <td className="td-sep">:</td>
                                                    <td className="td-value">{result.nama_lengkap}</td>
                                                </tr>
                                                <tr>
                                                    <td className="td-label">NISN</td>
                                                    <td className="td-sep">:</td>
                                                    <td className="td-value">{result.nisn}</td>
                                                </tr>
                                                <tr>
                                                    <td className="td-label">Asal Sekolah</td>
                                                    <td className="td-sep">:</td>
                                                    <td className="td-value">{result.asal_sekolah}</td>
                                                </tr>
                                                <tr>
                                                    <td className="td-label">Jurusan Pilihan</td>
                                                    <td className="td-sep">:</td>
                                                    <td className="td-value">{result.jurusan}</td>
                                                </tr>
                                                <tr>
                                                    <td className="td-label">Jenis Kelamin</td>
                                                    <td className="td-sep">:</td>
                                                    <td className="td-value">{result.jenis_kelamin === 'L' ? 'Laki-laki' : 'Perempuan'}</td>
                                                </tr>
                                            </tbody>
                                        </table>
                                    </div>
                                </div>

                                {/* Jadwal Tes Banner */}
                                <div className="kartu-jadwal">
                                    <div className="jadwal-header">
                                        <FiCalendar /> JADWAL TES MASUK
                                    </div>
                                    <div className="jadwal-grid">
                                        <div className="jadwal-item">
                                            <div className="jadwal-icon-circle">📅</div>
                                            <div className="jadwal-detail">
                                                <div className="jadwal-label">Hari / Tanggal</div>
                                                <div className="jadwal-value">{formatDate(result.jadwal_tes_tanggal)}</div>
                                            </div>
                                        </div>
                                        <div className="jadwal-item">
                                            <div className="jadwal-icon-circle">🕐</div>
                                            <div className="jadwal-detail">
                                                <div className="jadwal-label">Waktu</div>
                                                <div className="jadwal-value">{result.jadwal_tes_waktu || '-'} WIB</div>
                                            </div>
                                        </div>
                                        <div className="jadwal-item">
                                            <div className="jadwal-icon-circle">📍</div>
                                            <div className="jadwal-detail">
                                                <div className="jadwal-label">Tempat</div>
                                                <div className="jadwal-value">{result.jadwal_tes_lokasi || 'Gedung Utama MA Annur'}</div>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* Footer note */}
                                <div className="kartu-catatan">
                                    <p><strong>Catatan:</strong> Kartu ini wajib dibawa saat mengikuti tes masuk. Peserta harap hadir 30 menit sebelum tes dimulai.</p>
                                </div>

                                {/* Signature area */}
                                <div className="kartu-signature">
                                    <div className="sig-block">
                                        <div className="sig-label">Peserta,</div>
                                        <div className="sig-space"></div>
                                        <div className="sig-name">{result.nama_lengkap}</div>
                                    </div>
                                    <div className="sig-block">
                                        <div className="sig-label">Panitia PPDB,</div>
                                        <div className="sig-space"></div>
                                        <div className="sig-name">____________________</div>
                                    </div>
                                </div>
                            </div>

                            {/* Bottom stripe */}
                            <div className="kartu-stripe-bottom"></div>
                        </div>

                        {/* Download button — OUTSIDE the kartu ref so it won't appear in PDF */}
                        {!downloaded ? (
                            <div className="kartu-download-area">
                                <button className="btn-download" onClick={handleDownloadPDF} disabled={downloading}>
                                    {downloading ? (
                                        <>
                                            <span className="spinner-inline"></span>
                                            Mengunduh...
                                        </>
                                    ) : (
                                        <>
                                            <FiDownload size={20} /> Unduh Kartu Peserta (PDF)
                                        </>
                                    )}
                                </button>
                            </div>
                        ) : (
                            <div className="kartu-download-area">
                                <div className="download-success">
                                    <FiCheckCircle size={20} />
                                    <span>Kartu peserta berhasil diunduh! Silakan cetak dan bawa saat tes.</span>
                                </div>
                            </div>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
};

export default CekStatus;
