// اتصال بخدمات نظام webOS (Luna).
// - إذا الصفحة مفتوحة مباشرة على التلفزيون: منستعمل PalmServiceBridge.
// - إذا مفتوحة جوا الغلاف (iframe): منطلب من الغلاف ينفّذ عنا.
// - على الكمبيوتر: منطبع بالـ console بس.
(function () {
  var pending = [];
  var waiting = {};
  var nextId = 1;
  var inShell = window.parent && window.parent !== window;

  window.addEventListener('message', function (e) {
    var m = e.data || {};
    if (m.type !== 'luna-res' || e.source !== window.parent || !waiting[m.rid]) return;
    var w = waiting[m.rid];
    delete waiting[m.rid];
    clearTimeout(w.timer);
    if (m.res && m.res.returnValue === false) w.reject(m.res); else w.resolve(m.res);
  });

  window.luna = function (uri, params) {
    return new Promise(function (resolve, reject) {
      if (typeof PalmServiceBridge !== 'undefined') {
        var bridge = new PalmServiceBridge();
        pending.push(bridge);
        bridge.onservicecallback = function (msg) {
          pending.splice(pending.indexOf(bridge), 1);
          var res = {};
          try { res = JSON.parse(msg); } catch (e) {}
          if (res.returnValue === false) reject(res); else resolve(res);
        };
        bridge.call(uri, JSON.stringify(params || {}));
      } else if (inShell) {
        var rid = nextId++;
        waiting[rid] = {
          resolve: resolve, reject: reject,
          timer: setTimeout(function () { delete waiting[rid]; reject(new Error('ما في رد')); }, 8000)
        };
        window.parent.postMessage({ type: 'luna', rid: rid, uri: uri, params: params || {} }, '*');
      } else {
        console.log('[معاينة] luna', uri, params);
        reject(new Error('مو على التلفزيون'));
      }
    });
  };

  window.launchApp = function (id, params) {
    return luna('luna://com.webos.applicationManager/launch', { id: id, params: params || {} });
  };
})();
