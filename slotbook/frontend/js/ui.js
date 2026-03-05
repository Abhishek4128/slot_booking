const ui = {

  renderNav() {
    const el = document.getElementById('navRight');
    if (auth.isLoggedIn()) {
      el.innerHTML = `
        <span class="nav-username">👋 ${auth.user.username}</span>
        <button class="nav-btn nav-btn-ghost" onclick="router.go('mybookings')">My Bookings</button>
        <button class="nav-btn nav-btn-ghost" onclick="auth.logout()">Sign Out</button>
      `;
    } else {
      el.innerHTML = `
        <button class="nav-btn nav-btn-ghost" onclick="router.go('register')">Register</button>
        <button class="nav-btn nav-btn-accent" onclick="router.go('login')">Sign In →</button>
      `;
    }
  },

  toast(message, type = 'info') {
    const wrap = document.getElementById('toastWrap');
    const el   = document.createElement('div');
    el.className   = `toast ${type}`;
    el.textContent = message;
    el.onclick     = () => el.remove();
    wrap.appendChild(el);
    setTimeout(() => {
      el.style.animation = 'slideInRight 0.25s ease reverse';
      setTimeout(() => el.remove(), 250);
    }, 3500);
  },

  openModal()  { document.getElementById('slotModal').classList.add('open'); },
  closeModal() { document.getElementById('slotModal').classList.remove('open'); },
  handleOverlay(e) { if (e.target === document.getElementById('slotModal')) this.closeModal(); },

  formatDate(d) {
    if (!d) return '';
    const dt = new Date(d + 'T00:00:00');
    return dt.toLocaleDateString('en-IN', { weekday: 'short', month: 'short', day: 'numeric', year: 'numeric' });
  },

  fmt12(t) {
    if (!t) return '';
    const [h, m] = t.split(':');
    const hour = parseInt(h);
    const ampm = hour >= 12 ? 'PM' : 'AM';
    const h12  = hour % 12 || 12;
    return `${h12}:${m} ${ampm}`;
  },

  progressColor(pct) {
    if (pct >= 100) return 'var(--rose)';
    if (pct >= 70)  return 'var(--amber)';
    return 'var(--emerald)';
  },

  infoRow(key, val) {
    return `<div class="info-row"><span class="key">${key}</span><span class="val">${val}</span></div>`;
  },

};

document.addEventListener('keydown', e => {
  if (e.key === 'Escape') ui.closeModal();
});