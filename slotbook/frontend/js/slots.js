const slots = {

  data: [],
  userBookedIds: [],

  async load() {
    const filters = {
      date:   document.getElementById('filterDate')?.value   || '',
      status: document.getElementById('filterStatus')?.value || '',
    };
    const result = await api.getSlots(filters);
    if (!result.success) { ui.toast(result.error, 'error'); return; }
    this.data          = result.slots;
    this.userBookedIds = result.user_booked_ids || [];
    document.getElementById('statTotal').textContent = result.stats.total;
    document.getElementById('statAvail').textContent = result.stats.available;
    document.getElementById('statFull').textContent  = result.stats.full;
    document.getElementById('slotCount').textContent = `${result.slots.length} slots found`;
    this.render();
  },

  clearFilters() {
    document.getElementById('filterDate').value   = '';
    document.getElementById('filterStatus').value = '';
    this.load();
  },

  render() {
    const grid = document.getElementById('slotsGrid');
    if (!grid) return;
    if (!this.data.length) {
      grid.innerHTML = `<div class="empty-state"><div class="empty-icon">🗓</div><h3>No slots found</h3><p>Try adjusting your filters.</p></div>`;
      return;
    }
    grid.innerHTML = this.data.map((s, i) => this.cardHTML(s, i)).join('');
    this.data.forEach(s => {
      const card = document.getElementById(`slot-card-${s.id}`);
      if (card) card.addEventListener('click', () => slots.openModal(s.id));
    });
  },

  cardHTML(s, index) {
    const isBooked = this.userBookedIds.includes(s.id);
    const pct      = s.occupancy_percent || 0;
    const barColor = ui.progressColor(pct);
    const badge = s.status === 'available'
      ? `<span class="badge badge-available">● Available</span>`
      : `<span class="badge badge-full">✕ Full</span>`;
    let footer;
    if (isBooked) {
      footer = `<div class="booked-tag">✓ Booked</div><button class="btn btn-outline btn-sm" onclick="event.stopPropagation();event.preventDefault();router.go('mybookings');return false;">Manage →</button>`;
    } else if (s.status === 'available' && s.available_spots > 0) {
      footer = auth.isLoggedIn()
        ? `<button class="btn btn-primary" style="flex:1;" onclick="event.stopPropagation();event.preventDefault();bookings.openBookPage(${s.id});return false;">Book Now</button>`
        : `<button class="btn btn-primary" style="flex:1;" onclick="event.stopPropagation();event.preventDefault();router.go('login');return false;">Sign In to Book</button>`;
    } else {
      footer = `<button class="btn btn-outline" disabled style="flex:1;opacity:0.4;">Slot Full</button>`;
    }
    return `
      <div class="slot-card ${s.status === 'full' ? 'is-full' : ''} ${isBooked ? 'is-booked' : ''}"
           style="animation-delay:${index * 0.04}s" id="slot-card-${s.id}">
        <div class="card-top"><div class="card-title">${s.title}</div>${badge}</div>
        <div class="card-meta">
          <div class="meta-row"><span class="meta-icon">📅</span>${ui.formatDate(s.slot_date)}</div>
          <div class="meta-row"><span class="meta-icon">🕐</span>${ui.fmt12(s.start_time)} – ${ui.fmt12(s.end_time)}</div>
          ${s.location ? `<div class="meta-row"><span class="meta-icon">📍</span>${s.location}</div>` : ''}
        </div>
        <div class="cap-row"><span>Capacity</span><span class="cap-num">${s.booked_count}/${s.capacity}</span></div>
        <div class="prog" style="margin-bottom:0;"><div class="prog-fill" style="width:${pct}%;background:${barColor};"></div></div>
        <div class="card-footer" onclick="event.stopPropagation();">${footer}</div>
      </div>`;
  },

  openModal(id) {
    const s        = this.data.find(x => x.id === id);
    if (!s) return;
    const isBooked = this.userBookedIds.includes(s.id);
    const pct      = s.occupancy_percent || 0;
    document.getElementById('modalTitle').textContent = s.title;
    document.getElementById('modalBody').innerHTML = `
      <div style="display:flex;flex-direction:column;gap:0.75rem;">
        <div>${s.status === 'available' ? '<span class="badge badge-available">● Available</span>' : '<span class="badge badge-full">✕ Full</span>'}</div>
        ${s.description ? `<p style="color:var(--text-2);font-size:0.92rem;">${s.description}</p>` : ''}
        <div>
          ${ui.infoRow('📅 Date', ui.formatDate(s.slot_date))}
          ${ui.infoRow('🕐 Time', `${ui.fmt12(s.start_time)} – ${ui.fmt12(s.end_time)}`)}
          ${ui.infoRow('📍 Location', s.location || 'TBD')}
          ${ui.infoRow('👥 Capacity', `${s.booked_count}/${s.capacity} booked`)}
        </div>
        <div>
          <div style="display:flex;justify-content:space-between;font-size:0.75rem;color:var(--text-3);margin-bottom:0.35rem;"><span>Occupancy</span><span>${pct}%</span></div>
          <div class="prog"><div class="prog-fill" style="width:${pct}%;background:${ui.progressColor(pct)};"></div></div>
        </div>
        ${s.available_spots > 0 ? `<p style="color:var(--emerald);font-size:0.82rem;font-weight:600;">✓ ${s.available_spots} spot${s.available_spots > 1 ? 's' : ''} remaining</p>` : `<p style="color:var(--rose);font-size:0.82rem;font-weight:600;">✕ No spots available</p>`}
      </div>`;
    const actions = document.getElementById('modalActions');
    if (isBooked) {
      actions.innerHTML = `<div class="booked-tag" style="flex:1;">✓ You have booked this slot</div><button class="btn btn-outline btn-sm" onclick="ui.closeModal();router.go('mybookings')">Manage →</button>`;
    } else if (s.status === 'available' && s.available_spots > 0) {
      actions.innerHTML = auth.isLoggedIn()
        ? `<button class="btn btn-primary" style="flex:1;" onclick="ui.closeModal();bookings.openBookPage(${s.id})">Book This Slot →</button>`
        : `<button class="btn btn-primary" style="flex:1;" onclick="ui.closeModal();router.go('login')">Sign In to Book →</button>`;
    } else {
      actions.innerHTML = `<button class="btn btn-outline" disabled style="flex:1;opacity:0.4;">Slot is Full</button>`;
    }
    ui.openModal();
  },

};