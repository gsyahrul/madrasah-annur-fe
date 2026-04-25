// =============================================================
// Directus API Helper — Madrasah Aliyah Annur
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

// --------------- Auth ---------------

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

// --------------- Assets ---------------

export function getAssetUrl(fileId) {
    if (!fileId) return '';
    return `${DIRECTUS_URL}/assets/${fileId}`;
}

// --------------- Berita (News) ---------------

export async function fetchBerita() {
    const res = await directusFetch(
        '/items/berita?filter[status][_eq]=published&sort=-date_published&fields=*,image'
    );
    return res.data;
}

export async function fetchAllBerita() {
    const res = await directusFetch('/items/berita?sort=-date_published&fields=*,image');
    return res.data;
}

export async function createBerita(data) {
    const res = await directusFetch('/items/berita', {
        method: 'POST',
        body: JSON.stringify(data),
    });
    return res.data;
}

export async function updateBerita(id, data) {
    const res = await directusFetch(`/items/berita/${id}`, {
        method: 'PATCH',
        body: JSON.stringify(data),
    });
    return res.data;
}

export async function deleteBerita(id) {
    await fetch(`${DIRECTUS_URL}/items/berita/${id}`, {
        method: 'DELETE',
        headers: authHeaders(),
    });
}

// --------------- Galeri (Gallery) ---------------

export async function fetchGaleri() {
    const res = await directusFetch(
        '/items/galeri?filter[status][_eq]=published&sort=-date_created&fields=*,image'
    );
    return res.data;
}

export async function fetchAllGaleri() {
    const res = await directusFetch('/items/galeri?sort=-date_created&fields=*,image');
    return res.data;
}

export async function createGaleri(data) {
    const res = await directusFetch('/items/galeri', {
        method: 'POST',
        body: JSON.stringify(data),
    });
    return res.data;
}

export async function deleteGaleri(id) {
    await fetch(`${DIRECTUS_URL}/items/galeri/${id}`, {
        method: 'DELETE',
        headers: authHeaders(),
    });
}

// --------------- PPDB Registrations ---------------

export async function fetchPPDBRegistrations() {
    const res = await directusFetch(
        '/items/ppdb_registrations?sort=-date_created&fields=*'
    );
    return res.data;
}

export async function createPPDBRegistration(data) {
    // Public — no auth needed
    const res = await fetch(`${DIRECTUS_URL}/items/ppdb_registrations`, {
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
    const res = await directusFetch(`/items/ppdb_registrations/${id}`, {
        method: 'PATCH',
        body: JSON.stringify(data),
    });
    return res.data;
}

// --------------- File Upload ---------------

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

// --------------- Dashboard Stats ---------------

export async function fetchDashboardStats() {
    const [beritaRes, galeriRes, ppdbRes, ppdbPendingRes] = await Promise.all([
        directusFetch('/items/berita?aggregate[count]=*'),
        directusFetch('/items/galeri?aggregate[count]=*'),
        directusFetch('/items/ppdb_registrations?aggregate[count]=*'),
        directusFetch('/items/ppdb_registrations?aggregate[count]=*&filter[verification_status][_eq]=pending'),
    ]);
    return {
        beritaCount: beritaRes.data[0]?.count ?? 0,
        galeriCount: galeriRes.data[0]?.count ?? 0,
        ppdbCount: ppdbRes.data[0]?.count ?? 0,
        ppdbPendingCount: ppdbPendingRes.data[0]?.count ?? 0,
    };
}

export { DIRECTUS_URL, getToken, clearToken };
