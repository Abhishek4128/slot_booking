/* ══════════════════════════════════════════
   auth.js — Login, Register, Logout logic
═══════════════════════════════════════════ */

const auth = {

  // Current logged-in user (null if not logged in)
  user:  null,
  token: null,

  // ── INIT ──────────────────────────────────────────────────────────────────

  init() {
    const token = localStorage.getItem(CONFIG.TOKEN_KEY);
    const user  = localStorage.getItem(CONFIG.USER_KEY);
    if (token && user) {
      this.token = token;
      this.user  = JSON.parse(user);
    }
  },

  isLoggedIn() {
    return !!this.user;
  },

  // ── SAVE / CLEAR SESSION ─────────────────────────────────────────────────

  saveSession(token, user) {
    this.token = token;
    this.user  = user;
    localStorage.setItem(CONFIG.TOKEN_KEY, token);
    localStorage.setItem(CONFIG.USER_KEY,  JSON.stringify(user));
  },

  clearSession() {
    this.token = null;
    this.user  = null;
    localStorage.removeItem(CONFIG.TOKEN_KEY);
    localStorage.removeItem(CONFIG.USER_KEY);
  },

  // ── LOGIN ─────────────────────────────────────────────────────────────────

  async login() {
    const username = document.getElementById('loginUsername').value.trim();
    const password = document.getElementById('loginPassword').value;
    const errEl    = document.getElementById('loginError');
    const btn      = document.getElementById('loginBtn');

    errEl.style.display = 'none';
    btn.disabled        = true;
    btn.innerHTML       = '<div class="spinner"></div> Signing in...';

    const data = await api.login(username, password);

    btn.disabled  = false;
    btn.innerHTML = 'Sign In →';

    if (data.success) {
      this.saveSession(data.token, data.user);
      ui.renderNav();
      slots.load();
      ui.toast(`Welcome back, ${data.user.username}!`, 'success');
      router.go('home');
    } else {
      errEl.textContent   = data.error;
      errEl.style.display = 'block';
    }
  },

  // ── REGISTER ─────────────────────────────────────────────────────────────

  async register() {
    const fullName = document.getElementById('regName').value.trim();
    const username = document.getElementById('regUsername').value.trim();
    const email    = document.getElementById('regEmail').value.trim();
    const password = document.getElementById('regPassword').value;
    const errEl    = document.getElementById('regError');
    const btn      = document.getElementById('regBtn');

    errEl.style.display = 'none';
    btn.disabled        = true;
    btn.innerHTML       = '<div class="spinner"></div> Creating...';

    const data = await api.register(username, email, password, fullName);

    btn.disabled  = false;
    btn.innerHTML = 'Create Account →';

    if (data.success) {
      this.saveSession(data.token, data.user);
      ui.renderNav();
      slots.load();
      ui.toast(`Welcome, ${data.user.username}! 🎉`, 'success');
      router.go('home');
    } else {
      errEl.textContent   = data.error;
      errEl.style.display = 'block';
    }
  },

  // ── LOGOUT ───────────────────────────────────────────────────────────────

  async logout() {
    await api.logout();
    this.clearSession();
    ui.renderNav();
    slots.load();
    ui.toast('Signed out successfully.', 'info');
    router.go('home');
  },

};
