/* ══════════════════════════════════════════
   api.js — All backend API calls
═══════════════════════════════════════════ */

const api = {

  // ── CORE FETCH ──────────────────────────────────────────────────────────

  async request(path, options = {}) {
    const headers = { 'Content-Type': 'application/json' };
    const token   = localStorage.getItem(CONFIG.TOKEN_KEY);
    if (token) headers['Authorization'] = `Bearer ${token}`;

    try {
      const res  = await fetch(CONFIG.API_BASE + path, { ...options, headers });
      const data = await res.json();
      return data;
    } catch (err) {
      console.error('API error:', err);
      return { success: false, error: 'Cannot connect to server. Is it running?' };
    }
  },

  get(path) {
    return this.request(path);
  },

  post(path, body) {
    return this.request(path, { method: 'POST', body: JSON.stringify(body) });
  },

  // ── SLOTS ───────────────────────────────────────────────────────────────

  getSlots(filters = {}) {
    const params = new URLSearchParams();
    if (filters.date)   params.set('date',   filters.date);
    if (filters.status) params.set('status', filters.status);
    const qs = params.toString();
    return this.get('/api/slots' + (qs ? '?' + qs : ''));
  },

  // ── BOOKINGS ─────────────────────────────────────────────────────────────

  getMyBookings() {
    return this.get('/api/my-bookings');
  },

  bookSlot(slotId, notes = '') {
    return this.post('/api/book', { slot_id: slotId, notes });
  },

  cancelBooking(bookingId) {
    return this.post('/api/cancel', { booking_id: bookingId });
  },

  // ── AUTH ─────────────────────────────────────────────────────────────────

  login(username, password) {
    return this.post('/api/login', { username, password });
  },

  register(username, email, password, full_name) {
    return this.post('/api/register', { username, email, password, full_name });
  },

  logout() {
    return this.post('/api/logout', {});
  },

  getMe() {
    return this.get('/api/me');
  },

};
