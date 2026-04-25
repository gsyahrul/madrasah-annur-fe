import { useState, useEffect } from 'react';
import { FiPlus, FiEdit2, FiTrash2, FiX } from 'react-icons/fi';
import { fetchAllBerita, createBerita, updateBerita, deleteBerita, uploadFile, getAssetUrl } from '../lib/directus';

const BeritaManager = () => {
    const [articles, setArticles] = useState([]);
    const [loading, setLoading] = useState(true);
    const [modalOpen, setModalOpen] = useState(false);
    const [editing, setEditing] = useState(null);
    const [form, setForm] = useState({ title: '', category: '', excerpt: '', date_published: '', author: 'Admin', status: 'published' });
    const [imageFile, setImageFile] = useState(null);
    const [saving, setSaving] = useState(false);

    const loadData = () => {
        setLoading(true);
        fetchAllBerita()
            .then(setArticles)
            .catch(() => setArticles([]))
            .finally(() => setLoading(false));
    };

    useEffect(() => { loadData(); }, []);

    const openAdd = () => {
        setEditing(null);
        setForm({ title: '', category: '', excerpt: '', date_published: new Date().toISOString().split('T')[0], author: 'Admin', status: 'published' });
        setImageFile(null);
        setModalOpen(true);
    };

    const openEdit = (a) => {
        setEditing(a);
        setForm({
            title: a.title || '',
            category: a.category || '',
            excerpt: a.excerpt || '',
            date_published: a.date_published || '',
            author: a.author || 'Admin',
            status: a.status || 'published',
        });
        setImageFile(null);
        setModalOpen(true);
    };

    const handleSave = async () => {
        if (!form.title || !form.category) return;
        setSaving(true);
        try {
            let imageId = editing?.image || null;
            if (imageFile) {
                const uploaded = await uploadFile(imageFile);
                imageId = uploaded.id;
            }
            const payload = { ...form, image: imageId };
            if (editing) {
                await updateBerita(editing.id, payload);
            } else {
                await createBerita(payload);
            }
            setModalOpen(false);
            loadData();
        } catch (err) {
            alert('Gagal menyimpan: ' + err.message);
        } finally {
            setSaving(false);
        }
    };

    const handleDelete = async (id) => {
        if (!confirm('Hapus berita ini?')) return;
        try {
            await deleteBerita(id);
            loadData();
        } catch (err) {
            alert('Gagal menghapus: ' + err.message);
        }
    };

    return (
        <div>
            <h2 style={{ marginBottom: '0.5rem', color: 'var(--gray-800)' }}>Kelola Berita</h2>
            <p style={{ color: 'var(--gray-500)', marginBottom: '2rem' }}>Tambah, edit, dan hapus artikel berita & kegiatan</p>

            <div className="admin-table-wrapper">
                <div className="admin-table-header">
                    <h3>Daftar Berita ({articles.length})</h3>
                    <button className="btn-add" onClick={openAdd}><FiPlus /> Tambah Berita</button>
                </div>
                <table className="admin-table">
                    <thead>
                        <tr>
                            <th>Gambar</th>
                            <th>Judul</th>
                            <th>Kategori</th>
                            <th>Tanggal</th>
                            <th>Status</th>
                            <th>Aksi</th>
                        </tr>
                    </thead>
                    <tbody>
                        {loading ? (
                            <tr><td colSpan="6" style={{ textAlign: 'center', padding: '2rem', color: 'var(--gray-400)' }}>Memuat...</td></tr>
                        ) : articles.length === 0 ? (
                            <tr><td colSpan="6" style={{ textAlign: 'center', padding: '2rem', color: 'var(--gray-400)' }}>Belum ada berita</td></tr>
                        ) : (
                            articles.map(a => (
                                <tr key={a.id}>
                                    <td>
                                        {a.image && <img src={getAssetUrl(a.image)} alt="" style={{ width: 48, height: 36, objectFit: 'cover', borderRadius: 6 }} />}
                                    </td>
                                    <td style={{ fontWeight: 500, color: 'var(--gray-700)', maxWidth: '300px' }}>{a.title}</td>
                                    <td><span className="status-badge success">{a.category}</span></td>
                                    <td>{a.date_published}</td>
                                    <td><span className={`status-badge ${a.status === 'published' ? 'success' : 'pending'}`}>{a.status}</span></td>
                                    <td>
                                        <div style={{ display: 'flex', gap: '0.5rem' }}>
                                            <button className="btn-action blue" onClick={() => openEdit(a)}><FiEdit2 /> Edit</button>
                                            <button className="btn-action red" onClick={() => handleDelete(a.id)}><FiTrash2 /> Hapus</button>
                                        </div>
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>

            {modalOpen && (
                <div className="admin-modal-overlay" onClick={() => setModalOpen(false)}>
                    <div className="admin-modal" onClick={e => e.stopPropagation()}>
                        <div className="admin-modal-header">
                            <h3>{editing ? 'Edit Berita' : 'Tambah Berita Baru'}</h3>
                            <button className="admin-modal-close" onClick={() => setModalOpen(false)}><FiX /></button>
                        </div>
                        <div className="admin-modal-body">
                            <div className="form-group">
                                <label>Judul Berita *</label>
                                <input className="form-input" value={form.title} onChange={e => setForm({ ...form, title: e.target.value })} placeholder="Masukkan judul berita" />
                            </div>
                            <div className="form-group">
                                <label>Kategori *</label>
                                <select className="form-input" value={form.category} onChange={e => setForm({ ...form, category: e.target.value })}>
                                    <option value="">Pilih kategori</option>
                                    <option value="Prestasi">Prestasi</option>
                                    <option value="Kegiatan">Kegiatan</option>
                                    <option value="Keagamaan">Keagamaan</option>
                                    <option value="Olahraga">Olahraga</option>
                                    <option value="Akademik">Akademik</option>
                                </select>
                            </div>
                            <div className="form-group">
                                <label>Ringkasan</label>
                                <textarea className="form-input" rows="3" value={form.excerpt} onChange={e => setForm({ ...form, excerpt: e.target.value })} placeholder="Ringkasan berita..." style={{ resize: 'vertical' }} />
                            </div>
                            <div className="form-group">
                                <label>Upload Gambar</label>
                                <input type="file" accept="image/*" className="form-input" onChange={e => setImageFile(e.target.files[0])} />
                                {editing?.image && !imageFile && (
                                    <p style={{ fontSize: '0.8rem', color: 'var(--gray-400)', marginTop: '4px' }}>Gambar saat ini akan dipertahankan jika tidak diubah</p>
                                )}
                            </div>
                            <div className="form-group">
                                <label>Tanggal</label>
                                <input type="date" className="form-input" value={form.date_published} onChange={e => setForm({ ...form, date_published: e.target.value })} />
                            </div>
                            <div className="form-group">
                                <label>Status</label>
                                <select className="form-input" value={form.status} onChange={e => setForm({ ...form, status: e.target.value })}>
                                    <option value="published">Published</option>
                                    <option value="draft">Draft</option>
                                </select>
                            </div>
                        </div>
                        <div className="admin-modal-footer">
                            <button className="btn-cancel" onClick={() => setModalOpen(false)}>Batal</button>
                            <button className="btn-add" onClick={handleSave} disabled={saving}>
                                {saving ? 'Menyimpan...' : editing ? 'Simpan Perubahan' : 'Tambah Berita'}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default BeritaManager;
