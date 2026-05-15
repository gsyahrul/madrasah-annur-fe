import { useState, useRef } from 'react';
import { FiCalendar, FiUsers, FiClipboard, FiCheckCircle, FiFileText, FiUser, FiDollarSign, FiSend, FiX, FiCopy, FiSearch, FiClock, FiAlertCircle, FiDownload, FiArrowLeft } from 'react-icons/fi';
import { GiMoon } from 'react-icons/gi';
import { createPPDBRegistration, cekStatusPPDB } from '../lib/directus';
import html2pdf from 'html2pdf.js';
import './PPDBPage.css';

const PPDBPage = () => {
    const [formData, setFormData] = useState({
        namaLengkap: '', tempatLahir: '', tanggalLahir: '', jenisKelamin: '',
        asalSekolah: '', nisn: '', namaOrtu: '', noHp: '', alamat: '', jurusan: '',
    });
    const [submitting, setSubmitting] = useState(false);
    const [paymentData, setPaymentData] = useState(null);
    const [copied, setCopied] = useState(false);

    // Cek Status state
    const [statusNisn, setStatusNisn] = useState('');
    const [statusLoading, setStatusLoading] = useState(false);
    const [statusResult, setStatusResult] = useState(null);
    const [statusError, setStatusError] = useState('');
    const [downloading, setDownloading] = useState(false);
    const [downloaded, setDownloaded] = useState(false);
    const kartuRef = useRef(null);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSubmitting(true);
        try {
            const result = await createPPDBRegistration({
                nama_lengkap: formData.namaLengkap, tempat_lahir: formData.tempatLahir,
                tanggal_lahir: formData.tanggalLahir, jenis_kelamin: formData.jenisKelamin,
                asal_sekolah: formData.asalSekolah, nisn: formData.nisn,
                nama_ortu: formData.namaOrtu, no_hp: formData.noHp,
                alamat: formData.alamat, jurusan: formData.jurusan,
            });
            setPaymentData(result);
            setFormData({ namaLengkap: '', tempatLahir: '', tanggalLahir: '', jenisKelamin: '', asalSekolah: '', nisn: '', namaOrtu: '', noHp: '', alamat: '', jurusan: '' });
        } catch (err) {
            alert('Gagal mengirim pendaftaran: ' + err.message);
        } finally {
            setSubmitting(false);
        }
    };

    const formatCurrency = (num) => {
        return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(num);
    };

    const handleCopyNominal = () => {
        if (!paymentData) return;
        navigator.clipboard.writeText(String(paymentData.nominal_pembayaran));
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    // === Cek Status ===
    const handleStatusSubmit = async (e) => {
        e.preventDefault();
        if (!statusNisn.trim()) return;
        setStatusLoading(true);
        setStatusResult(null);
        setStatusError('');
        setDownloaded(false);
        try {
            const data = await cekStatusPPDB(statusNisn.trim());
            setStatusResult(data || 'not_found');
        } catch (err) {
            setStatusError(err.message || 'Terjadi kesalahan.');
        } finally {
            setStatusLoading(false);
        }
    };

    const handleDownloadPDF = async () => {
        if (!kartuRef.current) return;
        setDownloading(true);
        try {
            const opt = {
                margin: [15, 15, 15, 15],
                filename: `Kartu_Peserta_Tes_${statusResult.nama_lengkap?.replace(/\s+/g, '_') || 'PPDB'}.pdf`,
                image: { type: 'jpeg', quality: 0.98 },
                html2canvas: { scale: 2, useCORS: true, letterRendering: true },
                jsPDF: { unit: 'mm', format: [250, 353], orientation: 'portrait' },
            };
            await html2pdf().set(opt).from(kartuRef.current).save();
            setDownloaded(true);
        } catch (err) {
            alert('Gagal mengunduh PDF: ' + err.message);
        } finally {
            setDownloading(false);
        }
    };

    const handleStatusReset = () => {
        setStatusResult(null);
        setStatusNisn('');
        setStatusError('');
        setDownloaded(false);
    };

    const formatDate = (dateStr) => {
        if (!dateStr) return '-';
        try {
            return new Date(dateStr).toLocaleDateString('id-ID', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' });
        } catch { return dateStr; }
    };

    const isVerified = statusResult && typeof statusResult === 'object' && statusResult.verification_status === 'verified';
    const isPending = statusResult && typeof statusResult === 'object' && statusResult.verification_status === 'pending';
    const notFound = statusResult === 'not_found';

    const infoCards = [
        { icon: <FiCalendar />, value: 'Juni - Juli 2026', label: 'Periode Pendaftaran' },
        { icon: <FiUsers />, value: '120 Siswa', label: 'Kuota Penerimaan' },
        { icon: <FiDollarSign />, value: 'Rp 150.000', label: 'Biaya Formulir' },
    ];

    const requirements = [
        'Fotokopi Ijazah / Surat Keterangan Lulus (SKL) SMP/MTs',
        'Fotokopi Rapor semester 1 sampai 5',
        'Fotokopi Kartu Keluarga (KK)',
        'Fotokopi Akta Kelahiran',
        'Pas foto berwarna ukuran 3x4 sebanyak 4 lembar',
        'Surat keterangan sehat dari dokter',
        'Fotokopi SKHUN (jika tersedia)',
        'Mengisi formulir pendaftaran online',
    ];

    const steps = [
        { num: 1, title: 'Registrasi Online', desc: 'Isi formulir pendaftaran secara online melalui halaman ini', icon: <FiClipboard /> },
        { num: 2, title: 'Pembayaran', desc: 'Transfer biaya formulir sesuai nominal unik yang diberikan', icon: <FiDollarSign /> },
        { num: 3, title: 'Tes Seleksi', desc: 'Ikuti tes baca Al-Quran, tes akademik, dan wawancara orang tua', icon: <FiUser /> },
        { num: 4, title: 'Pengumuman', desc: 'Cek hasil seleksi penerimaan pada tanggal yang telah ditentukan', icon: <FiCheckCircle /> },
    ];

    return (
        <div className="ppdb-page">
            {/* Hero Banner */}
            <div className="ppdb-hero">
                <div className="container">
                    <div className="ppdb-hero-badge"><FiCalendar /> Tahun Ajaran 2026/2027</div>
                    <h1>Penerimaan Peserta Didik Baru</h1>
                    <p>Bergabunglah bersama kami dan jadilah bagian dari keluarga besar Madrasah Aliyah Annur</p>
                </div>
            </div>

            {/* Info Cards */}
            <div className="container">
                <div className="ppdb-info-row">
                    {infoCards.map((card, i) => (
                        <div className="ppdb-info-card" key={i}>
                            <div className="ppdb-info-icon">{card.icon}</div>
                            <h3>{card.value}</h3>
                            <p>{card.label}</p>
                        </div>
                    ))}
                </div>
            </div>

            {/* Timeline Steps */}
            <div className="section">
                <div className="container">
                    <div className="section-header">
                        <h2>Alur Pendaftaran</h2>
                        <p>Ikuti langkah-langkah berikut untuk mendaftar sebagai siswa baru</p>
                    </div>
                    <div className="ppdb-timeline">
                        {steps.map((step) => (
                            <div className="timeline-step" key={step.num}>
                                <div className="timeline-number">{step.num}</div>
                                <div>
                                    <h4>{step.title}</h4>
                                    <p>{step.desc}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Form + Requirements */}
            <div className="ppdb-form-section">
                <div className="container">
                    <div className="ppdb-form-wrapper">
                        <div className="ppdb-form-info">
                            <h2>Persyaratan Pendaftaran</h2>
                            <p>
                                Pastikan Anda telah menyiapkan seluruh dokumen berikut sebelum
                                melakukan pendaftaran. Dokumen asli akan diverifikasi saat
                                proses daftar ulang.
                            </p>
                            <div className="ppdb-checklist">
                                {requirements.map((req, i) => (
                                    <div className="ppdb-checklist-item" key={i}>
                                        <div className="ppdb-checklist-icon"><FiCheckCircle /></div>
                                        <span>{req}</span>
                                    </div>
                                ))}
                            </div>
                        </div>

                        <div className="ppdb-form-card">
                            <h3>Formulir Pendaftaran</h3>
                            <p>Isi data berikut dengan lengkap dan benar</p>
                            <form className="ppdb-form" onSubmit={handleSubmit}>
                                <div className="ppdb-form-row">
                                    <div className="form-group">
                                        <label>Nama Lengkap *</label>
                                        <input type="text" name="namaLengkap" className="form-input" placeholder="Nama lengkap siswa" value={formData.namaLengkap} onChange={handleChange} required />
                                    </div>
                                    <div className="form-group">
                                        <label>NISN</label>
                                        <input type="text" name="nisn" className="form-input" placeholder="Nomor Induk Siswa Nasional" value={formData.nisn} onChange={handleChange} />
                                    </div>
                                </div>
                                <div className="ppdb-form-row">
                                    <div className="form-group">
                                        <label>Tempat Lahir *</label>
                                        <input type="text" name="tempatLahir" className="form-input" placeholder="Kota kelahiran" value={formData.tempatLahir} onChange={handleChange} required />
                                    </div>
                                    <div className="form-group">
                                        <label>Tanggal Lahir *</label>
                                        <input type="date" name="tanggalLahir" className="form-input" value={formData.tanggalLahir} onChange={handleChange} required />
                                    </div>
                                </div>
                                <div className="ppdb-form-row">
                                    <div className="form-group">
                                        <label>Jenis Kelamin *</label>
                                        <select name="jenisKelamin" className="form-input" value={formData.jenisKelamin} onChange={handleChange} required>
                                            <option value="">Pilih</option>
                                            <option value="L">Laki-laki</option>
                                            <option value="P">Perempuan</option>
                                        </select>
                                    </div>
                                    <div className="form-group">
                                        <label>Jurusan Pilihan *</label>
                                        <select name="jurusan" className="form-input" value={formData.jurusan} onChange={handleChange} required>
                                            <option value="">Pilih Jurusan</option>
                                            <option value="IPA">IPA (Ilmu Pengetahuan Alam)</option>
                                            <option value="IPS">IPS (Ilmu Pengetahuan Sosial)</option>
                                            <option value="Keagamaan">Keagamaan</option>
                                        </select>
                                    </div>
                                </div>
                                <div className="form-group">
                                    <label>Asal Sekolah (SMP/MTs) *</label>
                                    <input type="text" name="asalSekolah" className="form-input" placeholder="Nama sekolah asal" value={formData.asalSekolah} onChange={handleChange} required />
                                </div>
                                <div className="ppdb-form-row">
                                    <div className="form-group">
                                        <label>Nama Orang Tua / Wali *</label>
                                        <input type="text" name="namaOrtu" className="form-input" placeholder="Nama orang tua / wali" value={formData.namaOrtu} onChange={handleChange} required />
                                    </div>
                                    <div className="form-group">
                                        <label>No. HP / WhatsApp *</label>
                                        <input type="tel" name="noHp" className="form-input" placeholder="08xxxxxxxxxx" value={formData.noHp} onChange={handleChange} required />
                                    </div>
                                </div>
                                <div className="form-group">
                                    <label>Alamat Lengkap *</label>
                                    <textarea name="alamat" className="form-input" placeholder="Alamat lengkap tempat tinggal" rows="3" value={formData.alamat} onChange={handleChange} required style={{ resize: 'vertical' }} />
                                </div>
                                <button type="submit" className="ppdb-submit-btn" disabled={submitting}>
                                    {submitting ? 'Mengirim...' : <><FiSend /> Kirim Pendaftaran</>}
                                </button>
                            </form>
                        </div>
                    </div>
                </div>
            </div>

            {/* ======= CEK STATUS WIDGET ======= */}
            <div className="ppdb-status-section">
                <div className="container">
                    <div className="section-header">
                        <div className="ppdb-hero-badge" style={{ background: 'var(--sage-100)', color: 'var(--sage-700)' }}>
                            <FiSearch /> Cek Status Pendaftaran
                        </div>
                        <h2>Cek Status PPDB</h2>
                        <p>Masukkan NISN untuk mengecek status pendaftaran dan mengunduh Kartu Peserta Tes</p>
                    </div>

                    {!isVerified && (
                        <div className="status-widget-card">
                            <form onSubmit={handleStatusSubmit}>
                                <div className="status-widget-row">
                                    <input
                                        type="text" className="form-input" placeholder="Masukkan NISN (contoh: 0012345678)"
                                        value={statusNisn} onChange={(e) => setStatusNisn(e.target.value)} maxLength={20} required
                                    />
                                    <button type="submit" className="ppdb-submit-btn" disabled={statusLoading || !statusNisn.trim()} style={{ width: 'auto', minWidth: '160px' }}>
                                        {statusLoading ? 'Mencari...' : <><FiSearch /> Cek Status</>}
                                    </button>
                                </div>
                            </form>
                        </div>
                    )}

                    {/* Alerts */}
                    {statusError && (
                        <div className="status-alert alert-danger"><FiAlertCircle size={20} /><span>{statusError}</span></div>
                    )}
                    {notFound && (
                        <div className="status-alert alert-danger"><FiAlertCircle size={20} /><span>Data pendaftaran dengan NISN tersebut tidak ditemukan. Pastikan NISN yang Anda masukkan sudah benar.</span></div>
                    )}
                    {isPending && (
                        <div className="status-alert alert-warning"><FiClock size={20} />
                            <span>Data Anda ditemukan atas nama <strong>{statusResult.nama_lengkap}</strong>. Status pendaftaran sedang dalam proses verifikasi oleh Admin. Silakan cek kembali nanti.</span>
                        </div>
                    )}

                    {/* Verified → Kartu Peserta */}
                    {isVerified && (
                        <div className="kartu-section">
                            <div className="kartu-actions-top">
                                <button className="btn-back" onClick={handleStatusReset}><FiArrowLeft /> Cari Ulang</button>
                            </div>
                            <div className="kartu-peserta" ref={kartuRef}>
                                <div className="kartu-stripe"></div>
                                <div className="kartu-kop">
                                    <div className="kartu-logo"><GiMoon /></div>
                                    <div className="kartu-kop-text">
                                        <div className="kartu-institution">MADRASAH ALIYAH ANNUR</div>
                                        <div className="kartu-address">Jl. Pendidikan No. 1 — Terakreditasi A</div>
                                    </div>
                                </div>
                                <div className="kartu-title-band">
                                    <span>KARTU PESERTA TES MASUK</span>
                                    <span className="kartu-tahun">T.A 2026/2027</span>
                                </div>
                                <div className="kartu-body">
                                    <div className="kartu-main-layout">
                                        <div className="kartu-photo-area">
                                            <div className="kartu-photo-placeholder"><span>FOTO</span><span className="photo-size">3×4</span></div>
                                            <div className="kartu-no-peserta">
                                                <div className="no-peserta-label">NO. PESERTA</div>
                                                <div className="no-peserta-value">{String(statusResult.id).padStart(4, '0')}</div>
                                            </div>
                                        </div>
                                        <div className="kartu-info">
                                            <table className="kartu-table"><tbody>
                                                {[
                                                    ['Nama Lengkap', statusResult.nama_lengkap],
                                                    ['NISN', statusResult.nisn],
                                                    ['Asal Sekolah', statusResult.asal_sekolah],
                                                    ['Jurusan Pilihan', statusResult.jurusan],
                                                    ['Jenis Kelamin', statusResult.jenis_kelamin === 'L' ? 'Laki-laki' : 'Perempuan'],
                                                ].map(([label, val], i) => (
                                                    <tr key={i}><td className="td-label">{label}</td><td className="td-sep">:</td><td className="td-value">{val}</td></tr>
                                                ))}
                                            </tbody></table>
                                        </div>
                                    </div>
                                    <div className="kartu-jadwal">
                                        <div className="jadwal-header"><FiCalendar /> JADWAL TES MASUK</div>
                                        <div className="jadwal-grid">
                                            <div className="jadwal-item"><div className="jadwal-icon-circle">📅</div><div className="jadwal-detail"><div className="jadwal-label">Hari / Tanggal</div><div className="jadwal-value">{formatDate(statusResult.jadwal_tes_tanggal)}</div></div></div>
                                            <div className="jadwal-item"><div className="jadwal-icon-circle">🕐</div><div className="jadwal-detail"><div className="jadwal-label">Waktu</div><div className="jadwal-value">{statusResult.jadwal_tes_waktu || '-'} WIB</div></div></div>
                                            <div className="jadwal-item"><div className="jadwal-icon-circle">📍</div><div className="jadwal-detail"><div className="jadwal-label">Tempat</div><div className="jadwal-value">{statusResult.jadwal_tes_lokasi || 'Gedung Utama MA Annur'}</div></div></div>
                                        </div>
                                    </div>
                                    <div className="kartu-catatan"><p><strong>Catatan:</strong> Kartu ini wajib dibawa saat mengikuti tes masuk. Peserta harap hadir 30 menit sebelum tes dimulai.</p></div>
                                    <div className="kartu-signature">
                                        <div className="sig-block"><div className="sig-label">Peserta,</div><div className="sig-space"></div><div className="sig-name">{statusResult.nama_lengkap}</div></div>
                                        <div className="sig-block"><div className="sig-label">Panitia PPDB,</div><div className="sig-space"></div><div className="sig-name">____________________</div></div>
                                    </div>
                                </div>
                                <div className="kartu-stripe-bottom"></div>
                            </div>
                            <div className="kartu-download-area">
                                {!downloaded ? (
                                    <button className="btn-download" onClick={handleDownloadPDF} disabled={downloading}>
                                        {downloading ? <><span className="spinner-inline"></span> Mengunduh...</> : <><FiDownload size={20} /> Unduh Kartu Peserta (PDF)</>}
                                    </button>
                                ) : (
                                    <div className="download-success"><FiCheckCircle size={20} /><span>Kartu peserta berhasil diunduh!</span></div>
                                )}
                            </div>
                        </div>
                    )}
                </div>
            </div>

            {/* ======= PAYMENT MODAL ======= */}
            {paymentData && (
                <div className="payment-modal-overlay" onClick={() => setPaymentData(null)}>
                    <div className="payment-modal" onClick={e => e.stopPropagation()}>
                        <button className="payment-modal-close" onClick={() => setPaymentData(null)}><FiX /></button>
                        <div className="payment-modal-icon"><FiCheckCircle /></div>
                        <h2>Pendaftaran Berhasil!</h2>
                        <p className="payment-modal-subtitle">Silakan lakukan pembayaran biaya formulir sesuai nominal berikut:</p>

                        <div className="payment-nominal-box">
                            <div className="payment-nominal-label">Total Pembayaran</div>
                            <div className="payment-nominal-value">{formatCurrency(paymentData.nominal_pembayaran)}</div>
                            <div className="payment-kode-unik">
                                Kode Unik: <strong>{String(paymentData.kode_unik).padStart(3, '0')}</strong>
                            </div>
                            <button className="payment-copy-btn" onClick={handleCopyNominal}>
                                <FiCopy /> {copied ? 'Tersalin!' : 'Salin Nominal'}
                            </button>
                        </div>

                        <div className="payment-info-box">
                            <h4>Instruksi Pembayaran</h4>
                            <div className="payment-info-item">
                                <span className="payment-info-label">Bank Tujuan</span>
                                <span className="payment-info-value">Bank Syariah Indonesia (BSI)</span>
                            </div>
                            <div className="payment-info-item">
                                <span className="payment-info-label">No. Rekening</span>
                                <span className="payment-info-value">1234-5678-9012</span>
                            </div>
                            <div className="payment-info-item">
                                <span className="payment-info-label">Atas Nama</span>
                                <span className="payment-info-value">Yayasan MA Annur</span>
                            </div>
                        </div>

                        <div className="payment-warning">
                            <FiAlertCircle />
                            <span>Transfer <strong>tepat</strong> sesuai nominal di atas (termasuk 3 digit terakhir). Kode unik membantu admin memverifikasi pembayaran Anda.</span>
                        </div>

                        <button className="payment-done-btn" onClick={() => setPaymentData(null)}>Saya Sudah Mengerti</button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default PPDBPage;
