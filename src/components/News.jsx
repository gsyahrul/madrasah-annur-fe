import { useState, useEffect } from 'react';
import { FiCalendar, FiUser, FiArrowRight } from 'react-icons/fi';
import { fetchBerita, getAssetUrl } from '../lib/directus';
import './News.css';

const News = () => {
    const [articles, setArticles] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchBerita()
            .then(setArticles)
            .catch(() => setArticles([]))
            .finally(() => setLoading(false));
    }, []);

    if (loading) {
        return (
            <section className="section news" id="berita">
                <div className="container">
                    <div className="section-header">
                        <h2>Berita & Kegiatan Terbaru</h2>
                        <p>Memuat data...</p>
                    </div>
                </div>
            </section>
        );
    }

    if (articles.length === 0) {
        return (
            <section className="section news" id="berita">
                <div className="container">
                    <div className="section-header">
                        <h2>Berita & Kegiatan Terbaru</h2>
                        <p>Belum ada berita yang dipublikasikan</p>
                    </div>
                </div>
            </section>
        );
    }

    return (
        <section className="section news" id="berita">
            <div className="container">
                <div className="section-header">
                    <h2>Berita & Kegiatan Terbaru</h2>
                    <p>Ikuti perkembangan terbaru dari berbagai kegiatan dan prestasi Madrasah Aliyah Annur</p>
                </div>

                <div className="news-grid">
                    {articles.map((article, idx) => (
                        <div
                            className={`news-card ${idx === 0 ? 'news-featured' : ''}`}
                            key={article.id}
                        >
                            <div className="news-card-image">
                                <span className="news-card-badge">{article.category}</span>
                                <img
                                    src={article.image ? getAssetUrl(article.image) : '/images/gallery-1.png'}
                                    alt={article.title}
                                />
                            </div>
                            <div className="news-card-body">
                                <div className="news-card-meta">
                                    <span><FiCalendar /> {article.date_published || '-'}</span>
                                    <span><FiUser /> {article.author || 'Admin'}</span>
                                </div>
                                <h4>{article.title}</h4>
                                <p>{article.excerpt}</p>
                                <a href="#" className="news-read-more">
                                    Baca Selengkapnya <FiArrowRight />
                                </a>
                            </div>
                        </div>
                    ))}
                </div>

                <div className="news-cta">
                    <a href="/berita" className="btn-secondary">
                        Lihat Semua Berita <FiArrowRight />
                    </a>
                </div>
            </div>
        </section>
    );
};

export default News;
