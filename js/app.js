(function () {
  var C = window.CONFIG;

  // ---------- الترحيب ----------
  function greeting() {
    var h = new Date().getHours();
    if (h < 5) return 'تصبحوا على خير 🌙';
    if (h < 12) return 'صباح الخير ☀️';
    if (h < 18) return 'نهاركم سعيد 🌤️';
    return 'مساء الخير 🌆';
  }

  // ---------- الساعة والتاريخ ----------
  var DAYS = ['الأحد', 'الاثنين', 'الثلاثاء', 'الأربعاء', 'الخميس', 'الجمعة', 'السبت'];
  var MONTHS = ['كانون الثاني', 'شباط', 'آذار', 'نيسان', 'أيار', 'حزيران',
                'تموز', 'آب', 'أيلول', 'تشرين الأول', 'تشرين الثاني', 'كانون الأول'];
  function pad(n) { return (n < 10 ? '0' : '') + n; }

  function tick() {
    var d = new Date();
    document.getElementById('clock').textContent = pad(d.getHours()) + ':' + pad(d.getMinutes());
    document.getElementById('date').textContent =
      DAYS[d.getDay()] + '، ' + d.getDate() + ' ' + MONTHS[d.getMonth()] + ' ' + d.getFullYear();
    document.getElementById('hello').textContent = greeting();
  }

  // ---------- الطقس ----------
  var WMO = { 0: '☀️', 1: '🌤️', 2: '⛅', 3: '☁️', 45: '🌫️', 48: '🌫️', 51: '🌦️', 61: '🌧️',
              63: '🌧️', 65: '🌧️', 71: '🌨️', 73: '🌨️', 75: '❄️', 80: '🌦️', 95: '⛈️' };
  function weather() {
    var w = C.weather;
    if (!w) return;
    var url = 'https://api.open-meteo.com/v1/forecast?latitude=' + w.lat + '&longitude=' + w.lon +
              '&current=temperature_2m,weather_code';
    fetch(url).then(function (r) { return r.json(); }).then(function (j) {
      var cur = j.current;
      document.getElementById('weather').textContent =
        (WMO[cur.weather_code] || '🌡️') + ' ' + Math.round(cur.temperature_2m) + '° ' + (w.city || '');
    }).catch(function () {});
  }

  // ---------- صور العيلة ----------
  function slideshow() {
    var photos = (window.PHOTOS || []).slice();
    if (!photos.length) return;
    var slides = document.querySelectorAll('.slide');
    var i = Math.floor(Math.random() * photos.length), layer = 0;

    function next() {
      var img = slides[layer], other = slides[1 - layer];
      img.onload = function () {
        img.classList.add('show');
        other.classList.remove('show');
        layer = 1 - layer;
      };
      img.src = photos[i];
      i = (i + 1) % photos.length;
    }
    next();
    setInterval(next, (C.slideSeconds || 12) * 1000);
  }

  // ---------- التطبيقات ----------
  function toast(msg) {
    var t = document.getElementById('toast');
    t.textContent = msg;
    t.classList.add('show');
    clearTimeout(toast.timer);
    toast.timer = setTimeout(function () { t.classList.remove('show'); }, 2500);
  }

  function tile(app) {
    var el = document.createElement('div');
    el.className = 'tile';
    el.setAttribute('data-focus', '');
    el.style.background = app.color || '#333';

    var ico = document.createElement('div');
    ico.className = 'ico';
    if (/\.(png|jpe?g|webp|svg)$/i.test(app.icon || '')) {
      var img = document.createElement('img');
      img.src = app.icon;
      ico.appendChild(img);
    } else {
      ico.textContent = app.icon || app.name.charAt(0);
    }
    var name = document.createElement('div');
    name.className = 'name';
    name.textContent = app.name;

    el.appendChild(ico);
    el.appendChild(name);
    el.addEventListener('click', function () {
      toast('عم يفتح ' + app.name + '…');
      launchApp(app.id, app.params).catch(function (err) {
        toast('ما قدرت افتح ' + app.name + (err && err.errorText ? ' — ' + err.errorText : ''));
      });
    });
    return el;
  }

  function fill(containerId, list) {
    var box = document.getElementById(containerId);
    (list || []).forEach(function (a) { box.appendChild(tile(a)); });
    return (list || []).length;
  }

  // ---------- تشغيل ----------
  document.getElementById('family').textContent = C.familyName || '';
  fill('apps', C.apps);
  if (!fill('myApps', C.myApps)) document.getElementById('myAppsRow').style.display = 'none';

  tick();
  setInterval(tick, 10 * 1000);
  weather();
  setInterval(weather, 30 * 60 * 1000);
  slideshow();
  notes.start(C.notes);
  nav.first();
})();
