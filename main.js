(function () {
  var root = document.documentElement;

  // Theme toggle (explicit choice wins over system setting)
  document.getElementById('theme-toggle').addEventListener('click', function () {
    var isDark = root.getAttribute('data-theme') === 'dark' ||
      (!root.getAttribute('data-theme') && window.matchMedia('(prefers-color-scheme: dark)').matches);
    root.setAttribute('data-theme', isDark ? 'light' : 'dark');
  });

  // Mobile menu
  var menuBtn = document.getElementById('menu-toggle');
  var nav = document.getElementById('site-nav');
  function setMenu(open) {
    nav.classList.toggle('open', open);
    menuBtn.setAttribute('aria-expanded', String(open));
    menuBtn.setAttribute('aria-label', open ? 'Close menu' : 'Open menu');
  }
  menuBtn.addEventListener('click', function () { setMenu(!nav.classList.contains('open')); });
  nav.addEventListener('click', function (e) { if (e.target.tagName === 'A') setMenu(false); });
  document.addEventListener('keydown', function (e) { if (e.key === 'Escape') setMenu(false); });

  // Waveform bars for the Deku card
  var wave = document.getElementById('wave');
  var heights = [30, 55, 80, 45, 95, 60, 100, 70, 40, 85, 50, 90, 35, 65, 25];
  heights.forEach(function (h) {
    var bar = document.createElement('i');
    bar.style.height = h + '%';
    wave.appendChild(bar);
  });

  document.getElementById('year').textContent = new Date().getFullYear();

  // Clipboard helper with fallback to selecting the text
  function copy(text, statusEl, selectEl) {
    function fail() {
      if (selectEl) { selectEl.focus(); if (selectEl.select) selectEl.select(); }
      statusEl.textContent = 'Copy is blocked here. The text is selected, so press Ctrl+C or Cmd+C.';
    }
    try {
      navigator.clipboard.writeText(text).then(function () {
        statusEl.textContent = 'Copied to clipboard.';
      }, fail);
    } catch (err) { fail(); }
  }

  var emailText = document.getElementById('email-text');
  document.getElementById('copy-email').addEventListener('click', function () {
    var status = document.getElementById('copy-status');
    copy(emailText.textContent, status, null);
    if (!navigator.clipboard) {
      var r = document.createRange(); r.selectNodeContents(emailText);
      var s = window.getSelection(); s.removeAllRanges(); s.addRange(r);
    }
  });

  // Message form
  var form = document.getElementById('msg-form');
  var fields = [
    { id: 'f-name', err: 'e-name', check: function (v) { return v.trim() ? '' : 'Enter your name.'; } },
    { id: 'f-email', err: 'e-email', check: function (v) { return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v.trim()) ? '' : 'Enter a valid email address, like name@example.com.'; } },
    { id: 'f-msg', err: 'e-msg', check: function (v) { return v.trim().length >= 10 ? '' : 'Write at least 10 characters so I know how to help.'; } }
  ];
  form.addEventListener('submit', function (e) {
    e.preventDefault();
    var firstBad = null;
    fields.forEach(function (f) {
      var el = document.getElementById(f.id);
      var msg = f.check(el.value);
      document.getElementById(f.err).textContent = msg;
      el.setAttribute('aria-invalid', msg ? 'true' : 'false');
      if (msg && !firstBad) firstBad = el;
    });
    if (firstBad) { firstBad.focus(); return; }
    var name = document.getElementById('f-name').value.trim();
    var email = document.getElementById('f-email').value.trim();
    var body = document.getElementById('f-msg').value.trim();
    var out = document.getElementById('out');
    out.value = 'To: ' + emailText.textContent + '\nSubject: Hello from ' + name + '\n\n' + body + '\n\n' + name + '\n' + email;
    document.getElementById('result').hidden = false;
    document.getElementById('msg-status').textContent = '';
    out.focus();
  });
  document.getElementById('copy-msg').addEventListener('click', function () {
    var out = document.getElementById('out');
    copy(out.value, document.getElementById('msg-status'), out);
  });
})();
