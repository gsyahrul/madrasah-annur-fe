import { useState } from 'react';
import { FiCalendar, FiUsers, FiClipboard, FiCheckCircle, FiArrowRight, FiFileText, FiUser, FiDollarSign, FiSend } from 'react-icons/fi';
import { createPPDBRegistration } from '../lib/directus';
import './PPDBPage.css';

const PPDBPage = () => {
    const [formData, setFormData] = useState({
        namaLengkap: '',
        tempatLahir: '',
        tanggalLahir: '',
        jenisKelamin: '',
        asalSekolah: '',
        nisn: '',
        namaOrtu: '',
        noHp: '',
        alamat: '',
        jurusan: '',
    });
    const [submitting, setSubmitting] = useState(false);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSubmitting(true);
        try {
            await createPPDBRegistration({
                nama_lengkap: formData.namaLengkap,
                tempat_lahir: formData.tempatLahir,
                tanggal_lahir: formData.tanggalLahir,
                jenis_kelamin: formData.jenisKelamin,
                asal_sekolah: formData.asalSekolah,
                nisn: formData.nisn,
                nama_ortu: formData.namaOrtu,
                no_hp: formData.noHp,
                alamat: formData.alamat,
                jurusan: formData.jurusan,
                verification_status: 'pending',
            });
            alert('Formulir pendaftaran berhasil dikirim! Tim PPDB akan segera menghubungi Anda untuk verifikasi pembayaran.');
            setFormData({ namaLengkap: '', tempatLahir: '', tanggalLahir: '', jenisKelamin: '', asalSekolah: '', nisn: '', namaOrtu: '', noHp: '', alamat: '', jurusan: '' });
        } catch (err) {
            alert('Gagal mengirim pendaftaran: ' + err.message);
        } finally {
            setSubmitting(false);
        }
    };

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
        { num: 2, title: 'Upload Berkas', desc: 'Lengkapi dan kumpulkan dokumen persyaratan ke sekolah', icon: <FiFileText /> },
        { num: 3, title: 'Tes Seleksi', desc: 'Ikuti tes baca Al-Quran, tes akademik, dan wawancara orang tua', icon: <FiUser /> },
        { num: 4, title: 'Pengumuman', desc: 'Cek hasil seleksi penerimaan pada tanggal yang telah ditentukan', icon: <FiCheckCircle /> },
    ];

    return (
        <div className="ppdb-page">
            {/* Hero Banner */}
            <div className="ppdb-hero">
                <div className="container">
                    <div className="ppdb-hero-badge">
                        <FiCalendar /> Tahun Ajaran 2026/2027
                    </div>
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
                                        <div className="ppdb-checklist-icon">
                                            <FiCheckCircle />
                                        </div>
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
                                        <input
                                            type="text"
                                            name="namaLengkap"
                                            className="form-input"
                                            placeholder="Nama lengkap siswa"
                                            value={formData.namaLengkap}
                                            onChange={handleChange}
                                            required
                                        />
                                    </div>
                                    <div className="form-group">
                                        <label>NISN</label>
                                        <input
                                            type="text"
                                            name="nisn"
                                            className="form-input"
                                            placeholder="Nomor Induk Siswa Nasional"
                                            value={formData.nisn}
                                            onChange={handleChange}
                                        />
                                    </div>
                                </div>

                                <div className="ppdb-form-row">
                                    <div className="form-group">
                                        <label>Tempat Lahir *</label>
                                        <input
                                            type="text"
                                            name="tempatLahir"
                                            className="form-input"
                                            placeholder="Kota kelahiran"
                                            value={formData.tempatLahir}
                                            onChange={handleChange}
                                            required
                                        />
                                    </div>
                                    <div className="form-group">
                                        <label>Tanggal Lahir *</label>
                                        <input
                                            type="date"
                                            name="tanggalLahir"
                                            className="form-input"
                                            value={formData.tanggalLahir}
                                            onChange={handleChange}
                                            required
                                        />
                                    </div>
                                </div>

                                <div className="ppdb-form-row">
                                    <div className="form-group">
                                        <label>Jenis Kelamin *</label>
                                        <select
                                            name="jenisKelamin"
                                            className="form-input"
                                            value={formData.jenisKelamin}
                                            onChange={handleChange}
                                            required
                                        >
                                            <option value="">Pilih</option>
                                            <option value="L">Laki-laki</option>
                                            <option value="P">Perempuan</option>
                                        </select>
                                    </div>
                                    <div className="form-group">
                                        <label>Jurusan Pilihan *</label>
                                        <select
                                            name="jurusan"
                                            className="form-input"
                                            value={formData.jurusan}
                                            onChange={handleChange}
                                            required
                                        >
                                            <option value="">Pilih Jurusan</option>
                                            <option value="IPA">IPA (Ilmu Pengetahuan Alam)</option>
                                            <option value="IPS">IPS (Ilmu Pengetahuan Sosial)</option>
                                            <option value="Keagamaan">Keagamaan</option>
                                        </select>
                                    </div>
                                </div>

                                <div className="form-group">
                                    <label>Asal Sekolah (SMP/MTs) *</label>
                                    <input
                                        type="text"
                                        name="asalSekolah"
                                        className="form-input"
                                        placeholder="Nama sekolah asal"
                                        value={formData.asalSekolah}
                                        onChange={handleChange}
                                        required
                                    />
                                </div>

                                <div className="ppdb-form-row">
                                    <div className="form-group">
                                        <label>Nama Orang Tua / Wali *</label>
                                        <input
                                            type="text"
                                            name="namaOrtu"
                                            className="form-input"
                                            placeholder="Nama orang tua / wali"
                                            value={formData.namaOrtu}
                                            onChange={handleChange}
                                            required
                                        />
                                    </div>
                                    <div className="form-group">
                                        <label>No. HP / WhatsApp *</label>
                                        <input
                                            type="tel"
                                            name="noHp"
                                            className="form-input"
                                            placeholder="08xxxxxxxxxx"
                                            value={formData.noHp}
                                            onChange={handleChange}
                                            required
                                        />
                                    </div>
                                </div>

                                <div className="form-group">
                                    <label>Alamat Lengkap *</label>
                                    <textarea
                                        name="alamat"
                                        className="form-input"
                                        placeholder="Alamat lengkap tempat tinggal"
                                        rows="3"
                                        value={formData.alamat}
                                        onChange={handleChange}
                                        required
                                        style={{ resize: 'vertical' }}
                                    />
                                </div>

                                <button type="submit" className="ppdb-submit-btn">
                                    <FiSend /> Kirim Pendaftaran
                                </button>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default PPDBPage;
