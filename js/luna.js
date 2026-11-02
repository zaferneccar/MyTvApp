// اتصال بخدمات نظام webOS (Luna) بدون مكتبات خارجية.
// على الكمبيوتر (بالمتصفح) ما في PalmServiceBridge، فبنطبع بس بالـ console.
(function () {
  var pending = []; // منحتفظ بالـ bridge لحتى يرجع الرد

  window.luna = function (uri, params) {
    return new Promise(function (resolve, reject) {
      if (typeof PalmServiceBridge === 'undefined') {
        console.log('[معاينة] luna', uri, params);
        reject(new Error('مو على التلفزيون'));
        return;
      }
      var bridge = new PalmServiceBridge();
      pending.push(bridge);
      bridge.onservicecallback = function (msg) {
        pending.splice(pending.indexOf(bridge), 1);
        var res = {};
        try { res = JSON.parse(msg); } catch (e) {}
        if (res.returnValue === false) reject(res); else resolve(res);
      };
      bridge.call(uri, JSON.stringify(params || {}));
    });
  };

  window.launchApp = function (id, params) {
    return luna('luna://com.webos.applicationManager/launch', { id: id, params: params || {} });
  };
})();
