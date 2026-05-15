// =============================================================
// Directus API Helper — Madrasah Aliyah Annur
// Uses custom endpoint extension at /madrasah-api/*
// =============================================================

const DIRECTUS_URL = 'http://localhost:8055';

// --------------- Auth Helpers ---------------

function getToken() {
    return localStorage.getItem('directus_token');
}

function setToken(access_token, refresh_token) {
    localStorage.setItem('directus_token', access_token);
    if (refresh_token) localStorage.setItem('directus_refresh_token', refresh_token);
}

function clearToken() {
    localStorage.removeItem('directus_token');
    localStorage.removeItem('directus_refresh_token');
}

function authHeaders() {
    const token = getToken();
    return token ? { Authorization: `Bearer ${token}` } : {};
}

// --------------- Generic Fetch ---------------

async function directusFetch(path, options = {}) {
    const { headers = {}, ...rest } = options;
    const res = await fetch(`${DIRECTUS_URL}${path}`, {
        headers: {
            'Content-Type': 'application/json',
            ...authHeaders(),
            ...headers,
        },
        ...rest,
    });
    if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error(err?.errors?.[0]?.message || `Directus error: ${res.status}`);
    }
    return res.json();
}

// --------------- Auth (uses built-in Directus endpoints) ---------------

export async function loginDirectus(email, password) {
    const res = await directusFetch('/auth/login', {
        method: 'POST',
        body: JSON.stringify({ email, password }),
    });
    const { access_token, refresh_token } = res.data;
    setToken(access_token, refresh_token);
    return res.data;
}

export async function logoutDirectus() {
    const refresh_token = localStorage.getItem('directus_refresh_token');
    try {
        await directusFetch('/auth/logout', {
            method: 'POST',
            body: JSON.stringify({ refresh_token }),
        });
    } catch {
        // ignore logout errors
    }
    clearToken();
}

export async function refreshAccessToken() {
    const refresh_token = localStorage.getItem('directus_refresh_token');
    if (!refresh_token) throw new Error('No refresh token');
    const res = await directusFetch('/auth/refresh', {
        method: 'POST',
        body: JSON.stringify({ refresh_token, mode: 'json' }),
    });
    const { access_token, refresh_token: newRefresh } = res.data;
    setToken(access_token, newRefresh);
    return access_token;
}

export async function getCurrentUser() {
    const res = await directusFetch('/users/me?fields=id,email,first_name,last_name,role.name');
    return res.data;
}

// --------------- Assets (uses built-in Directus endpoint) ---------------

export function getAssetUrl(fileId) {
    if (!fileId) return '';
    return `${DIRECTUS_URL}/assets/${fileId}`;
}

// --------------- Berita (News) — Custom Endpoint ---------------

export async function fetchBerita() {
    const res = await directusFetch('/madrasah-api/berita');
    return res.data;
}

export async function fetchAllBerita() {
    const res = await directusFetch('/madrasah-api/berita/all');
    return res.data;
}

export async function createBerita(data) {
    const res = await directusFetch('/madrasah-api/berita', {
        method: 'POST',
        body: JSON.stringify(data),
    });
    return res.data;
}

export async function updateBerita(id, data) {
    const res = await directusFetch(`/madrasah-api/berita/${id}`, {
        method: 'PATCH',
        body: JSON.stringify(data),
    });
    return res.data;
}

export async function deleteBerita(id) {
    await fetch(`${DIRECTUS_URL}/madrasah-api/berita/${id}`, {
        method: 'DELETE',
        headers: authHeaders(),
    });
}

// --------------- Galeri (Gallery) — Custom Endpoint ---------------

export async function fetchGaleri() {
    const res = await directusFetch('/madrasah-api/galeri');
    return res.data;
}

export async function fetchAllGaleri() {
    const res = await directusFetch('/madrasah-api/galeri/all');
    return res.data;
}

export async function createGaleri(data) {
    const res = await directusFetch('/madrasah-api/galeri', {
        method: 'POST',
        body: JSON.stringify(data),
    });
    return res.data;
}

export async function deleteGaleri(id) {
    await fetch(`${DIRECTUS_URL}/madrasah-api/galeri/${id}`, {
        method: 'DELETE',
        headers: authHeaders(),
    });
}

// --------------- PPDB Registrations — Custom Endpoint ---------------

export async function fetchPPDBRegistrations() {
    const res = await directusFetch('/madrasah-api/ppdb');
    return res.data;
}

export async function createPPDBRegistration(data) {
    // Public — no auth needed
    const res = await fetch(`${DIRECTUS_URL}/madrasah-api/ppdb`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
    });
    if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error(err?.errors?.[0]?.message || 'Gagal mengirim pendaftaran');
    }
    return (await res.json()).data;
}

export async function updatePPDBRegistration(id, data) {
    const res = await directusFetch(`/madrasah-api/ppdb/${id}`, {
        method: 'PATCH',
        body: JSON.stringify(data),
    });
    return res.data;
}

export async function cekStatusPPDB(nisn) {
    const res = await fetch(`${DIRECTUS_URL}/madrasah-api/ppdb/cek-status/${encodeURIComponent(nisn)}`, {
        headers: { 'Content-Type': 'application/json' },
    });
    if (res.status === 404) {
        return null; // Not found
    }
    if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error(err?.errors?.[0]?.message || 'Terjadi kesalahan server');
    }
    return (await res.json()).data;
}

// --------------- Buku (Books / Ruang Baca) — Custom Endpoint ---------------

export async function fetchBuku(category) {
    let url = '/madrasah-api/buku';
    if (category) {
        url += `?category=${category}`;
    }
    const res = await directusFetch(url);
    return res.data;
}

export async function fetchAllBuku() {
    const res = await directusFetch('/madrasah-api/buku/all');
    return res.data;
}

export async function createBuku(data) {
    const res = await directusFetch('/madrasah-api/buku', {
        method: 'POST',
        body: JSON.stringify(data),
    });
    return res.data;
}

export async function updateBuku(id, data) {
    const res = await directusFetch(`/madrasah-api/buku/${id}`, {
        method: 'PATCH',
        body: JSON.stringify(data),
    });
    return res.data;
}

export async function deleteBuku(id) {
    await fetch(`${DIRECTUS_URL}/madrasah-api/buku/${id}`, {
        method: 'DELETE',
        headers: authHeaders(),
    });
}

// --------------- File Upload (uses built-in Directus endpoint) ---------------

export async function uploadFile(file) {
    const formData = new FormData();
    formData.append('file', file);
    const res = await fetch(`${DIRECTUS_URL}/files`, {
        method: 'POST',
        headers: authHeaders(),
        body: formData,
    });
    if (!res.ok) throw new Error('Upload gagal');
    return (await res.json()).data;
}

// --------------- Dashboard Stats — Custom Endpoint ---------------

export async function fetchDashboardStats() {
    const res = await directusFetch('/madrasah-api/stats');
    return res.data;
}

export { DIRECTUS_URL, getToken, clearToken };
