// الغلاف: بيتثبّت على التلفزيون مرة وحدة، وبيحمّل الشاشة من الإنترنت.
// إذا ما في نت، بيفتح النسخة المحلية (app/) اللي جوا الحزمة.
(function () {
  var REMOTE = 'https://zaferneccar.github.io/MyTvApp/';
  var LOCAL = 'app/index.html';
  var CHECK_MINUTES = 10;

  var frame = document.getElementById('screen');
  var loaded = null; // نسخة الصفحة المحمّلة حالياً ('local' أو رقم النسخة)

  function show(src, version) {
    loaded = version;
    frame.src = src;
  }

  function fetchVersion() {
    return new Promise(function (resolve, reject) {
      var done = false;
      var t = setTimeout(function () { done = true; reject(new Error('timeout')); }, 6000);
      fetch(REMOTE + 'version.json?t=' + Date.now(), { cache: 'no-store' })
        .then(function (r) { if (!r.ok) throw new Error(r.status); return r.json(); })
        .then(function (j) { if (!done) { clearTimeout(t); resolve(String(j.version)); } })
        .catch(function (e) { if (!done) { clearTimeout(t); reject(e); } });
    });
  }

  function check() {
    fetchVersion().then(function (v) {
      if (v !== loaded) show(REMOTE + '?v=' + encodeURIComponent(v), v); // في تحديث جديد
    }).catch(function () {
      if (loaded === null) show(LOCAL, 'local'); // أول تشغيل بدون نت
    });
  }

  // ---------- جسر Luna: الصفحة جوا الـ iframe بتطلب، والغلاف بينفّذ ----------
  var bridges = [];
  window.addEventListener('message', function (e) {
    if (e.source !== frame.contentWindow) return; // بس من شاشتنا
    var m = e.data || {};
    if (m.type !== 'luna' || typeof PalmServiceBridge === 'undefined') return;
    var b = new PalmServiceBridge();
    bridges.push(b);
    b.onservicecallback = function (msg) {
      bridges.splice(bridges.indexOf(b), 1);
      var res = {};
      try { res = JSON.parse(msg); } catch (err) {}
      frame.contentWindow.postMessage({ type: 'luna-res', rid: m.rid, res: res }, '*');
    };
    b.call(m.uri, JSON.stringify(m.params || {}));
  });

  // إذا الريموت ضغط والتركيز مو جوا الشاشة، منبعتلها الزر
  document.addEventListener('keydown', function (e) {
    if (frame.contentWindow) frame.contentWindow.postMessage({ type: 'key', keyCode: e.keyCode }, '*');
    e.preventDefault();
  });
  frame.addEventListener('load', function () { try { frame.focus(); } catch (err) {} });

  check();
  setInterval(check, CHECK_MINUTES * 60 * 1000);
  document.addEventListener('visibilitychange', function () { if (!document.hidden) check(); });
})();
