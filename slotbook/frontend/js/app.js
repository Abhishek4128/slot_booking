/* ══════════════════════════════════════════
   app.js — Application entry point
   Initializes auth, nav, and default route
═══════════════════════════════════════════ */

window.addEventListener('load', () => {
  // 1. Restore session from localStorage
  auth.init();

  // 2. Render navigation based on auth state
  ui.renderNav();

  // 3. Load default page (home)
  router.go('home');
});
