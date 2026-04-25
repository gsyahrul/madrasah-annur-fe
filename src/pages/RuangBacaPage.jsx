import { useState } from 'react';
import { FiBookOpen, FiBook, FiGlobe, FiClock, FiAward } from 'react-icons/fi';
import './PageStyles.css';

const RuangBacaPage = () => {
    const [activeTab, setActiveTab] = useState('kelas-x');

    const tabs = [
        { id: 'kelas-x', label: 'Kelas X' },
        { id: 'kelas-xi', label: 'Kelas XI' },
        { id: 'kelas-xii', label: 'Kelas XII' },
        { id: 'hiburan', label: 'Hiburan' },
        { id: 'sejarah', label: 'Sejarah' },
        { id: 'referensi', label: 'Referensi' },
    ];

    const bookData = {
        'kelas-x': [
            { title: 'Matematika Wajib Kls X', author: 'Kemendikbud', color: '#4a7a4a', icon: <FiBookOpen />, badge: 'Kurikulum' },
            { title: 'Bahasa Indonesia Kls X', author: 'Kemendikbud', color: '#059669', icon: <FiBook />, badge: 'Kurikulum' },
            { title: 'Bahasa Inggris Kls X', author: 'Kemendikbud', color: '#2d4d32', icon: <FiGlobe />, badge: 'Kurikulum' },
            { title: 'Fisika Kelas X', author: 'Kemendikbud', color: '#065f46', icon: <FiBookOpen />, badge: 'IPA' },
            { title: 'Kimia Kelas X', author: 'Kemendikbud', color: '#3a6340', icon: <FiBook />, badge: 'IPA' },
            { title: 'Biologi Kelas X', author: 'Kemendikbud', color: '#047857', icon: <FiBookOpen />, badge: 'IPA' },
            { title: 'Aqidah Akhlak Kls X', author: 'Kemenag', color: '#1e3522', icon: <FiAward />, badge: 'Agama' },
            { title: 'Fiqih Kelas X', author: 'Kemenag', color: '#5a8f5a', icon: <FiBook />, badge: 'Agama' },
        ],
        'kelas-xi': [
            { title: 'Matematika Wajib Kls XI', author: 'Kemendikbud', color: '#4a7a4a', icon: <FiBookOpen />, badge: 'Kurikulum' },
            { title: 'Bahasa Indonesia Kls XI', author: 'Kemendikbud', color: '#059669', icon: <FiBook />, badge: 'Kurikulum' },
            { title: 'Bahasa Inggris Kls XI', author: 'Kemendikbud', color: '#2d4d32', icon: <FiGlobe />, badge: 'Kurikulum' },
            { title: 'Fisika Kelas XI', author: 'Kemendikbud', color: '#065f46', icon: <FiBookOpen />, badge: 'IPA' },
            { title: 'Kimia Kelas XI', author: 'Kemendikbud', color: '#3a6340', icon: <FiBook />, badge: 'IPA' },
            { title: 'Sejarah Indonesia Kls XI', author: 'Kemendikbud', color: '#047857', icon: <FiClock />, badge: 'Kurikulum' },
        ],
        'kelas-xii': [
            { title: 'Matematika Wajib Kls XII', author: 'Kemendikbud', color: '#4a7a4a', icon: <FiBookOpen />, badge: 'Kurikulum' },
            { title: 'Bahasa Indonesia Kls XII', author: 'Kemendikbud', color: '#059669', icon: <FiBook />, badge: 'Kurikulum' },
            { title: 'Bahasa Inggris Kls XII', author: 'Kemendikbud', color: '#2d4d32', icon: <FiGlobe />, badge: 'Kurikulum' },
            { title: 'Fisika Kelas XII', author: 'Kemendikbud', color: '#065f46', icon: <FiBookOpen />, badge: 'IPA' },
            { title: 'Sosiologi Kelas XII', author: 'Kemendikbud', color: '#047857', icon: <FiBook />, badge: 'IPS' },
        ],
        'hiburan': [
            { title: 'Kumpulan Cerpen Islami', author: 'Asma Nadia', color: '#f59e0b', icon: <FiBook />, badge: 'Fiksi' },
            { title: 'Laskar Pelangi', author: 'Andrea Hirata', color: '#10b981', icon: <FiBook />, badge: 'Novel' },
            { title: 'Negeri 5 Menara', author: 'A. Fuadi', color: '#3a6340', icon: <FiBook />, badge: 'Novel' },
            { title: 'Ayat-Ayat Cinta', author: 'Habiburrahman', color: '#1e3522', icon: <FiBook />, badge: 'Novel' },
        ],
        'sejarah': [
            { title: 'Sejarah Peradaban Islam', author: 'Dr. Badri Yatim', color: '#92400e', icon: <FiClock />, badge: 'Islami' },
            { title: 'Sejarah Indonesia Modern', author: 'M.C. Ricklefs', color: '#4a7a4a', icon: <FiClock />, badge: 'Nasional' },
            { title: 'Tarikh Khulafaur Rasyidin', author: 'Imam As-Suyuthi', color: '#1e3522', icon: <FiClock />, badge: 'Islami' },
            { title: 'Sejarah Dunia Kuno', author: 'Susan Bauer', color: '#065f46', icon: <FiGlobe />, badge: 'Dunia' },
        ],
        'referensi': [
            { title: 'Kamus Besar B. Indonesia', author: 'KBBI Daring', color: '#2d4d32', icon: <FiBook />, badge: 'Kamus' },
            { title: 'Oxford English Dictionary', author: 'Oxford Press', color: '#047857', icon: <FiGlobe />, badge: 'Kamus' },
            { title: 'Ensiklopedia Islam', author: 'Dewan Redaksi', color: '#1e3522', icon: <FiAward />, badge: 'Ensiklopedia' },
            { title: 'Atlas Dunia Lengkap', author: 'National Geographic', color: '#059669', icon: <FiGlobe />, badge: 'Atlas' },
            { title: 'Kamus Arab-Indonesia', author: 'Mahmud Yunus', color: '#5a8f5a', icon: <FiBook />, badge: 'Kamus' },
        ],
    };

    const books = bookData[activeTab] || [];

    return (
        <div className="page-wrapper">
            <div className="page-hero">
                <div className="container">
                    <div className="page-hero-badge">📚 Perpustakaan Digital</div>
                    <h1>Ruang Baca Digital</h1>
                    <p>Jelajahi koleksi pustaka digital untuk mendukung kegiatan belajar mengajar</p>
                </div>
            </div>

            <div className="page-content">
                <div className="container">
                    {/* Tabs */}
                    <div style={{
                        display: 'flex', justifyContent: 'center', flexWrap: 'wrap',
                        gap: '0.5rem', marginBottom: '2rem'
                    }}>
                        {tabs.map((tab) => (
                            <button
                                key={tab.id}
                                onClick={() => setActiveTab(tab.id)}
                                style={{
                                    padding: '10px 24px',
                                    background: activeTab === tab.id
                                        ? 'linear-gradient(135deg, var(--sage-500), var(--emerald-600))'
                                        : 'var(--white)',
                                    border: activeTab === tab.id
                                        ? '2px solid transparent'
                                        : '2px solid var(--gray-200)',
                                    borderRadius: '9999px',
                                    fontWeight: activeTab === tab.id ? 600 : 500,
                                    fontSize: '0.9rem',
                                    color: activeTab === tab.id ? 'var(--white)' : 'var(--gray-500)',
                                    cursor: 'pointer',
                                    transition: 'all 0.3s ease',
                                    boxShadow: activeTab === tab.id ? '0 4px 12px rgba(90,143,90,0.3)' : 'none'
                                }}
                            >
                                {tab.label}
                            </button>
                        ))}
                    </div>

                    {/* Book Grid */}
                    <div style={{
                        display: 'grid',
                        gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))',
                        gap: '1.5rem'
                    }}>
                        {books.map((book, i) => (
                            <div key={`${activeTab}-${i}`} style={{
                                background: 'var(--white)', borderRadius: '16px', overflow: 'hidden',
                                boxShadow: '0 1px 3px rgba(0,0,0,0.08)', transition: 'all 0.3s ease', cursor: 'pointer'
                            }}
                                onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-6px)'; e.currentTarget.style.boxShadow = '0 10px 30px rgba(0,0,0,0.1)'; }}
                                onMouseLeave={e => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = '0 1px 3px rgba(0,0,0,0.08)'; }}
                            >
                                <div style={{
                                    width: '100%', aspectRatio: '3/4',
                                    background: `linear-gradient(135deg, ${book.color}, ${book.color}dd)`,
                                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                                    position: 'relative', overflow: 'hidden'
                                }}>
                                    <svg width="100%" height="100%" style={{ position: 'absolute', inset: 0, opacity: 0.15 }}>
                                        <pattern id={`bp-${activeTab}-${i}`} x="0" y="0" width="40" height="40" patternUnits="userSpaceOnUse">
                                            <circle cx="20" cy="20" r="8" fill="rgba(255,255,255,0.3)" />
                                        </pattern>
                                        <rect width="100%" height="100%" fill={`url(#bp-${activeTab}-${i})`} />
                                    </svg>
                                    <div style={{ position: 'relative', zIndex: 1, fontSize: '2.5rem', color: 'rgba(255,255,255,0.9)' }}>
                                        {book.icon}
                                    </div>
                                </div>
                                <div style={{ padding: '1rem 1.25rem' }}>
                                    <h4 style={{
                                        fontSize: '0.9rem', color: 'var(--gray-800)', marginBottom: '4px',
                                        display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden'
                                    }}>{book.title}</h4>
                                    <p style={{ fontSize: '0.8rem', color: 'var(--gray-400)' }}>{book.author}</p>
                                    <span style={{
                                        display: 'inline-block', padding: '2px 10px', background: 'var(--emerald-50)',
                                        color: 'var(--emerald-700)', fontSize: '0.7rem', fontWeight: 600,
                                        borderRadius: '9999px', marginTop: '6px'
                                    }}>{book.badge}</span>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default RuangBacaPage;
