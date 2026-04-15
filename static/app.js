/* ═══════════════════════════════════════════════════════════════════
   Bangladesh Gazette Archive — Client-side filtering & interaction
   ═══════════════════════════════════════════════════════════════════ */

document.addEventListener('DOMContentLoaded', function () {
  var cards = document.querySelectorAll('.card[data-category]');
  var filterCat = document.getElementById('filter-category');
  var filterMin = document.getElementById('filter-ministry');
  var filterMon = document.getElementById('filter-month');
  var filterSort = document.getElementById('filter-sort');
  var resultCount = document.getElementById('result-count');
  var noResults = document.getElementById('no-results');
  var cardGrid = document.querySelector('.card-grid');

  if (!cards.length) return;

  /* ── Apply filters ────────────────────────────────────────────── */
  function applyFilters() {
    var cat = filterCat ? filterCat.value : '';
    var min = filterMin ? filterMin.value : '';
    var mon = filterMon ? filterMon.value : '';
    var visible = 0;

    cards.forEach(function (c) {
      var show = true;
      if (cat && c.dataset.category !== cat) show = false;
      if (min && c.dataset.ministry !== min) show = false;
      if (mon && c.dataset.month !== mon) show = false;
      c.style.display = show ? '' : 'none';
      if (show) visible++;
    });

    if (resultCount) resultCount.textContent = visible;
    if (noResults) {
      noResults.classList.toggle('visible', visible === 0);
    }
  }

  /* ── Sort cards ───────────────────────────────────────────────── */
  function sortCards() {
    if (!cardGrid || !filterSort) return;
    var dir = filterSort.value;
    var arr = Array.prototype.slice.call(cards);
    arr.sort(function (a, b) {
      var da = a.dataset.date || '';
      var db = b.dataset.date || '';
      return dir === 'oldest' ? da.localeCompare(db) : db.localeCompare(da);
    });
    arr.forEach(function (c) { cardGrid.appendChild(c); });
  }

  /* ── Bind events ──────────────────────────────────────────────── */
  if (filterCat) filterCat.addEventListener('change', applyFilters);
  if (filterMin) filterMin.addEventListener('change', applyFilters);
  if (filterMon) filterMon.addEventListener('change', applyFilters);
  if (filterSort) filterSort.addEventListener('change', function () {
    sortCards();
    applyFilters();
  });

  /* ── Reset ────────────────────────────────────────────────────── */
  var resetBtn = document.getElementById('filter-reset');
  if (resetBtn) {
    resetBtn.addEventListener('click', function () {
      if (filterCat) filterCat.value = '';
      if (filterMin) filterMin.value = '';
      if (filterMon) filterMon.value = '';
      if (filterSort) filterSort.value = 'newest';
      sortCards();
      applyFilters();
    });
  }

  /* ── Mobile sidebar toggle ────────────────────────────────────── */
  var toggle = document.querySelector('.mobile-filter-toggle');
  var sidebar = document.querySelector('.sidebar');
  if (toggle && sidebar) {
    sidebar.classList.add('collapsed');
    toggle.addEventListener('click', function () {
      sidebar.classList.toggle('collapsed');
      toggle.textContent = sidebar.classList.contains('collapsed')
        ? '\u09AB\u09BF\u09B2\u09CD\u099F\u09BE\u09B0 \u09A6\u09C7\u0996\u09BE\u09A8 \u25BC'   /* ফিল্টার দেখান ▼ */
        : '\u09AB\u09BF\u09B2\u09CD\u099F\u09BE\u09B0 \u09B2\u09C1\u0995\u09BE\u09A8 \u25B2';   /* ফিল্টার লুকান ▲ */
    });
  }

  /* ── Initial count ────────────────────────────────────────────── */
  if (resultCount) resultCount.textContent = cards.length;
});
