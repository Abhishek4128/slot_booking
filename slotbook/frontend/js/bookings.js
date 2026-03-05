/* ══════════════════════════════════════════
   bookings.js — Book a slot, Cancel,
                 My Bookings page rendering
═══════════════════════════════════════════ */

const bookings = {

  data:           [],
  selectedSlot:   null,
  activeFilter:   'all',

  // ── OPEN BOOK PAGE ────────────────────────────────────────────────────────

  openBookPage(slotId) {
    if (!auth.isLoggedIn()) { router.go('login'); return; }

    const s = slots.data.find(x => x.id === slotId);
    if (!s) return;
    this.selectedSlot = s;

    // Render the book page FIRST
    router.go('book');

    // Then fill in the data AFTER page is rendered
    setTimeout(() => {
        document.getElementById('bookSlotName').textContent = s.title;
        document.getElementById('sumTitle').textContent     = s.title;
        document.getElementById('sumDate').textContent      = ui.formatDate(s.slot_date);
        document.getElementById('sumTime').textContent      = `${ui.fmt12(s.start_time)} – ${ui.fmt12(s.end_time)}`;
        document.getElementById('sumLocation').textContent  = s.location || 'TBD';
        document.getElementById('sumSpots').textContent     = `${s.available_spots} of ${s.capacity}`;
        document.getElementById('sumUser').textContent      = auth.user.full_name || auth.user.username;
        document.getElementById('bookNotes').value          = '';
    }, 0);
},

  // ── CONFIRM BOOKING ───────────────────────────────────────────────────────

  async confirm() {
    if (!this.selectedSlot) return;

    const btn   = document.getElementById('confirmBtn');
    const notes = document.getElementById('bookNotes').value;

    btn.disabled  = true;
    btn.innerHTML = '<div class="spinner"></div> Booking...';

    const result = await api.bookSlot(this.selectedSlot.id, notes);

    btn.disabled  = false;
    btn.innerHTML = '✓ Confirm Booking';

    if (result.success) {
      ui.toast(result.message, 'success');
      await slots.load();
      await this.load();
      router.go('mybookings');
    } else {
      ui.toast(result.error, 'error');
    }
  },

  // ── CANCEL BOOKING ────────────────────────────────────────────────────────

  async cancel(bookingId) {
    if (!confirm('Are you sure you want to cancel this booking?')) return;

    const result = await api.cancelBooking(bookingId);

    if (result.success) {
      ui.toast(result.message, 'success');
      await this.load();
      await slots.load();
    } else {
      ui.toast(result.error, 'error');
    }
  },

  // ── LOAD MY BOOKINGS ──────────────────────────────────────────────────────

  async load() {
    if (!auth.isLoggedIn()) { router.go('login'); return; }

    const result = await api.getMyBookings();
    if (!result.success) { ui.toast(result.error, 'error'); return; }

    this.data = result.bookings;
    this.renderStats();
    this.render();
  },

  // ── RENDER STATS ─────────────────────────────────────────────────────────

  renderStats() {
    const confirmed = this.data.filter(b => b.status === 'confirmed').length;
    const cancelled = this.data.filter(b => b.status === 'cancelled').length;

    document.getElementById('mbConfirmed').textContent = confirmed;
    document.getElementById('mbCancelled').textContent = cancelled;
    document.getElementById('mbTotal').textContent     = this.data.length;
  },

  // ── SWITCH TAB ────────────────────────────────────────────────────────────

  switchTab(name, btn) {
    document.querySelectorAll('.tab').forEach(t => t.classList.remove('active'));
    btn.classList.add('active');
    this.activeFilter = name;
    this.render();
  },

  // ── RENDER BOOKING LIST ───────────────────────────────────────────────────

  render() {
    const list = document.getElementById('bookingList');
    if (!list) return;

    let items = this.data;
    if (this.activeFilter !== 'all') {
      items = items.filter(b => b.status === this.activeFilter);
    }

    if (!items.length) {
      const icon = this.activeFilter === 'cancelled' ? '✨' : '📭';
      list.innerHTML = `
        <div class="empty-state">
          <div class="empty-icon">${icon}</div>
          <h3>No ${this.activeFilter} bookings</h3>
          <p style="margin-top:0.75rem;">
            <button class="btn btn-primary btn-sm" onclick="router.go('home')">Browse Slots →</button>
          </p>
        </div>`;
      return;
    }

    list.innerHTML = items.map((b, i) => this.itemHTML(b, i)).join('');
  },

  itemHTML(b, index) {
    const statusLabel = { confirmed: '✓ Confirmed', cancelled: '✕ Cancelled', pending: '● Pending' };
    return `
      <div class="booking-item ${b.status === 'cancelled' ? 'cancelled' : ''}"
           style="animation-delay:${index * 0.05}s">
        <div>
          <span class="badge badge-${b.status}">${statusLabel[b.status] || b.status}</span>
          <div class="booking-name">${b.title}</div>
          <div class="booking-meta-row">
            <div class="bm">📅 ${ui.formatDate(b.slot_date)}</div>
            <div class="bm">🕐 ${ui.fmt12(b.start_time)} – ${ui.fmt12(b.end_time)}</div>
            <div class="bm">📍 ${b.location || 'N/A'}</div>
          </div>
          ${b.notes ? `<p style="font-size:0.78rem;color:var(--text-3);margin-top:0.4rem;font-style:italic;">"${b.notes}"</p>` : ''}
          <div class="bid">Booking #${b.id} · Booked ${new Date(b.booked_at).toLocaleDateString()}</div>
        </div>
        <div>
          ${b.status === 'confirmed'
            ? `<button class="btn btn-danger btn-sm" onclick="bookings.cancel(${b.id})">Cancel</button>`
            : ''}
        </div>
      </div>`;
  },

};
