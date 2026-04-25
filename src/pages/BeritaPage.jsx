import { FiCalendar, FiUser, FiArrowRight } from 'react-icons/fi';
import './PageStyles.css';

const BeritaPage = () => {
    const articles = [
        {
            id: 1,
            title: 'Siswa MA Annur Raih Juara 1 Olimpiade Sains Nasional Tingkat Provinsi',
            excerpt: 'Prestasi membanggakan diraih oleh siswa kelas XI, Muhammad Rafli, yang berhasil meraih medali emas di bidang Fisika pada ajang Olimpiade Sains Nasional tingkat Provinsi Jawa Barat. Keberhasilan ini merupakan buah dari persiapan intensif selama 6 bulan bersama tim pembina OSN madrasah.',
            image: '/images/gallery-1.png',
            date: '20 April 2026',
            author: 'Admin',
            category: 'Prestasi',
        },
        {
            id: 2,
            title: 'Festival Budaya Islam 2026: Menguatkan Karakter Islami Melalui Seni',
            excerpt: 'MA Annur sukses menggelar Festival Budaya Islam tahunan yang diikuti oleh seluruh siswa dengan menampilkan berbagai pertunjukan seni dan budaya Islami. Acara ini menjadi ajang kreativitas dan penguatan karakter keislaman para siswa.',
            image: '/images/gallery-2.png',
            date: '15 April 2026',
            author: 'Admin',
            category: 'Kegiatan',
        },
        {
            id: 3,
            title: 'Program Tahfidz: 25 Siswa Berhasil Hafal 5 Juz Al-Quran',
            excerpt: 'Alhamdulillah, program tahfidz Al-Quran semester ini telah menghasilkan 25 penghafal Al-Quran baru yang berhasil menyelesaikan target 5 juz. Program ini merupakan unggulan MA Annur.',
            image: '/images/gallery-3.png',
            date: '10 April 2026',
            author: 'Admin',
            category: 'Keagamaan',
        },
        {
            id: 4,
            title: 'Tim Basket Putra MA Annur Juara Turnamen Antar Madrasah Se-Bogor',
            excerpt: 'Tim basket putra berhasil mengalahkan 12 tim dari madrasah lain dan membawa pulang piala bergilir pada kejuaraan basket antar madrasah se-Kabupaten Bogor.',
            image: '/images/gallery-4.png',
            date: '5 April 2026',
            author: 'Admin',
            category: 'Olahraga',
        },
        {
            id: 5,
            title: 'Wisuda Angkatan 2025: Melepas Generasi Terbaik',
            excerpt: 'Seremoni wisuda angkatan 2025 berlangsung khidmat dengan dihadiri oleh orang tua, guru, dan pejabat dinas pendidikan. Sebanyak 120 siswa dinyatakan lulus dengan tingkat kelulusan 100%.',
            image: '/images/gallery-5.png',
            date: '28 Maret 2026',
            author: 'Admin',
            category: 'Akademik',
        },
        {
            id: 6,
            title: 'Pelatihan Coding & Robotika untuk Siswa Kelas X dan XI',
            excerpt: 'MA Annur bekerja sama dengan komunitas IT lokal mengadakan workshop coding Python dan robotika Arduino selama 3 hari untuk mempersiapkan siswa di era digital.',
            image: '/images/gallery-6.png',
            date: '20 Maret 2026',
            author: 'Admin',
            category: 'Akademik',
        },
    ];

    return (
        <div className="page-wrapper">
            <div className="page-hero">
                <div className="container">
                    <div className="page-hero-badge">📰 Ruang Informasi</div>
                    <h1>Berita & Kegiatan</h1>
                    <p>Ikuti perkembangan terbaru dari berbagai kegiatan dan prestasi Madrasah Aliyah Annur</p>
                </div>
            </div>

            <div className="page-content">
                <div className="container">
                    <div style={{
                        display: 'grid',
                        gridTemplateColumns: 'repeat(auto-fill, minmax(350px, 1fr))',
                        gap: '1.5rem'
                    }}>
                        {articles.map((article) => (
                            <div key={article.id} style={{
                                background: 'var(--white)', borderRadius: '16px', overflow: 'hidden',
                                boxShadow: '0 4px 14px rgba(0,0,0,0.08)', border: '1px solid var(--gray-100)',
                                transition: 'all 0.3s ease', cursor: 'pointer'
                            }}
                                onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-6px)'; e.currentTarget.style.boxShadow = '0 20px 50px rgba(0,0,0,0.12)'; }}
                                onMouseLeave={e => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = '0 4px 14px rgba(0,0,0,0.08)'; }}
                            >
                                <div style={{ position: 'relative', width: '100%', aspectRatio: '16/10', overflow: 'hidden' }}>
                                    <span style={{
                                        position: 'absolute', top: '12px', left: '12px', padding: '4px 14px',
                                        background: 'linear-gradient(135deg, var(--sage-500), var(--emerald-600))',
                                        color: 'var(--white)', fontSize: '0.75rem', fontWeight: 600,
                                        borderRadius: '9999px', zIndex: 2
                                    }}>{article.category}</span>
                                    <img src={article.image} alt={article.title}
                                        style={{ width: '100%', height: '100%', objectFit: 'cover', transition: 'transform 0.5s ease' }}
                                    />
                                </div>
                                <div style={{ padding: '1.5rem' }}>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '0.5rem', fontSize: '0.8rem', color: 'var(--gray-400)' }}>
                                        <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}><FiCalendar /> {article.date}</span>
                                        <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}><FiUser /> {article.author}</span>
                                    </div>
                                    <h4 style={{ fontSize: '1.05rem', color: 'var(--gray-800)', marginBottom: '0.5rem', lineHeight: 1.5 }}>{article.title}</h4>
                                    <p style={{
                                        fontSize: '0.9rem', color: 'var(--gray-500)', lineHeight: 1.7, marginBottom: '1rem',
                                        display: '-webkit-box', WebkitLineClamp: 3, WebkitBoxOrient: 'vertical', overflow: 'hidden'
                                    }}>{article.excerpt}</p>
                                    <a href="#" style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', fontSize: '0.9rem', fontWeight: 600, color: 'var(--sage-600)' }}>
                                        Baca Selengkapnya <FiArrowRight />
                                    </a>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default BeritaPage;
