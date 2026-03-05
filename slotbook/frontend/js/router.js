const router = {

  current: 'home',

  pages: {

    home: () => `
      <div style="position:relative;z-index:1;">
        <div class="hero">
          <div class="hero-eyebrow"><span class="hero-eyebrow-dot"></span>Live Availability</div>
          <h1>Book Your<br><em>Perfect Slot</em><span class="line2">instantly & effortlessly</span></h1>
          <p>Browse available time slots, reserve your spot, and manage all your bookings in one place.</p>
        </div>
        <div class="stats-row">
          <div class="stat-card"><div class="stat-num" style="color:var(--accent)" id="statTotal">—</div><div class="stat-lbl">Total Slots</div></div>
          <div class="stat-card"><div class="stat-num" style="color:var(--emerald)" id="statAvail">—</div><div class="stat-lbl">Available</div></div>
          <div class="stat-card"><div class="stat-num" style="color:var(--rose)" id="statFull">—</div><div class="stat-lbl">Full</div></div>
        </div>
        <div class="container">
          <div class="filter-bar">
            <div class="fg"><label class="flabel">Filter by Date</label><input type="date" class="finput" id="filterDate"></div>
            <div class="fg"><label class="flabel">Status</label><select class="finput" id="filterStatus"><option value="">All Statuses</option><option value="available">Available</option><option value="full">Full</option></select></div>
            <button class="btn btn-primary btn-sm" onclick="slots.load()">Apply Filter</button>
            <button class="btn btn-outline btn-sm" onclick="slots.clearFilters()">Clear</button>
          </div>
          <div class="section-heading"><h2>Upcoming Slots</h2><hr><span class="count" id="slotCount"></span></div>
          <div class="slots-grid" id="slotsGrid"><div class="empty-state"><div class="empty-icon">🔄</div><h3>Loading slots...</h3></div></div>
        </div>
      </div>`,

    login: () => `
      <div class="auth-wrap">
        <div class="auth-card">
          <div class="auth-brand"><div class="auth-brand-logo">Slot<span>Book</span></div></div>
          <div class="auth-title">Welcome back</div>
          <div class="auth-sub">Sign in to manage your bookings</div>
          <div class="error-box" id="loginError"></div>
          <div class="fg"><label class="flabel">Username</label><input class="finput" type="text" id="loginUsername" placeholder="your_username" autofocus></div>
          <div class="fg"><label class="flabel">Password</label><input class="finput" type="password" id="loginPassword" placeholder="••••••••" onkeydown="if(event.key==='Enter') auth.login()"></div>
          <button class="btn btn-primary btn-full" onclick="auth.login()" id="loginBtn">Sign In →</button>
          <div class="auth-switch">No account? <a onclick="router.go('register')">Create one →</a></div>
        </div>
      </div>`,

    register: () => `
      <div class="auth-wrap" style="max-width:480px;">
        <div class="auth-card">
          <div class="auth-brand"><div class="auth-brand-logo">Slot<span>Book</span></div></div>
          <div class="auth-title">Create Account</div>
          <div class="auth-sub">Join to start booking slots instantly</div>
          <div class="error-box" id="regError"></div>
          <div class="two-col">
            <div class="fg" style="margin:0;"><label class="flabel">Full Name</label><input class="finput" type="text" id="regName" placeholder="Your Name" autofocus></div>
            <div class="fg" style="margin:0;"><label class="flabel">Username</label><input class="finput" type="text" id="regUsername" placeholder="username123"></div>
          </div>
          <div class="fg" style="margin-top:1rem;"><label class="flabel">Email</label><input class="finput" type="email" id="regEmail" placeholder="you@email.com"></div>
          <div class="fg"><label class="flabel">Password</label><input class="finput" type="password" id="regPassword" placeholder="••••••••" onkeydown="if(event.key==='Enter') auth.register()"></div>
          <button class="btn btn-primary btn-full" onclick="auth.register()" id="regBtn">Create Account →</button>
          <div class="auth-switch">Have an account? <a onclick="router.go('login')">Sign in →</a></div>
        </div>
      </div>`,

    mybookings: () => `
      <div class="page-wrap">
        <div class="back-link" onclick="router.go('home')">← Back to Home</div>
        <div class="page-hdr"><h1>My Bookings</h1><p>Manage all your reservations in one place</p></div>
        <div class="my-stats">
          <div class="my-stat"><div class="my-stat-num" style="color:var(--emerald)" id="mbConfirmed">0</div><div class="my-stat-lbl">Confirmed</div></div>
          <div class="my-stat"><div class="my-stat-num" style="color:var(--rose)" id="mbCancelled">0</div><div class="my-stat-lbl">Cancelled</div></div>
          <div class="my-stat"><div class="my-stat-num" style="color:var(--accent)" id="mbTotal">0</div><div class="my-stat-lbl">Total</div></div>
        </div>
        <div class="tabs">
          <button class="tab active" onclick="bookings.switchTab('all', this)">All</button>
          <button class="tab" onclick="bookings.switchTab('confirmed', this)">Confirmed</button>
          <button class="tab" onclick="bookings.switchTab('cancelled', this)">Cancelled</button>
        </div>
        <div class="booking-list" id="bookingList"><div class="empty-state"><div class="empty-icon">🔄</div><h3>Loading...</h3></div></div>
      </div>`,

    book: () => `
      <div style="padding:2rem 0;position:relative;z-index:1;">
        <div style="max-width:860px;margin:0 auto;padding:0 2rem;">
          <div class="back-link" onclick="router.go('home')">← Back to slots</div>
        </div>
        <div class="book-grid">
          <div class="book-card">
            <div class="book-title">Confirm Booking</div>
            <div class="book-sub">You are reserving a spot in <strong id="bookSlotName" style="color:var(--accent);"></strong></div>
            <div class="fg"><label class="flabel">Notes <span style="color:var(--text-3);font-size:0.7rem;">(optional)</span></label><textarea class="finput" id="bookNotes" rows="3" placeholder="Any special requests..."></textarea></div>
            <div style="display:flex;gap:0.75rem;">
              <button class="btn btn-primary" style="flex:1;padding:0.85rem;border-radius:var(--r-sm);" onclick="event.preventDefault();bookings.confirm();" id="confirmBtn">✓ Confirm Booking</button>
              <button class="btn btn-outline" style="padding:0.85rem 1.2rem;border-radius:var(--r-sm);" onclick="router.go('home')">Cancel</button>
            </div>
          </div>
          <div class="summary-card">
            <div class="summary-label">Booking Summary</div>
            <div class="summary-name" id="sumTitle"></div>
            <div class="sum-row"><span class="sum-key">Date</span><span class="sum-val" id="sumDate"></span></div>
            <div class="sum-row"><span class="sum-key">Time</span><span class="sum-val" id="sumTime"></span></div>
            <div class="sum-row"><span class="sum-key">Location</span><span class="sum-val" id="sumLocation"></span></div>
            <div class="sum-row"><span class="sum-key">Spots left</span><span class="sum-val" id="sumSpots" style="color:var(--emerald);font-weight:700;"></span></div>
            <div class="sum-row"><span class="sum-key">Booking as</span><span class="sum-val" id="sumUser" style="color:var(--accent);"></span></div>
            <div class="info-box">✓ You can cancel anytime from My Bookings.</div>
          </div>
        </div>
      </div>`,
  },

  go(page) {
    if (!this.pages[page]) return;
    this.current = page;
    document.getElementById('app').innerHTML = this.pages[page]();
    window.scrollTo(0, 0);
    if (page === 'home')       slots.load();
    if (page === 'mybookings') bookings.load();
  },

};