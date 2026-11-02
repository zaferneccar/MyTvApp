// التنقل بالريموت: الأسهم + OK. الماوس (Magic Remote) كمان شغّال.
(function () {
  var KEY = { LEFT: 37, UP: 38, RIGHT: 39, DOWN: 40, ENTER: 13, BACK: 461 };
  var current = null;

  function items() {
    return Array.prototype.slice.call(document.querySelectorAll('[data-focus]'));
  }

  function focus(el) {
    if (!el) return;
    if (current) current.classList.remove('focused');
    current = el;
    el.classList.add('focused');
  }

  // بندوّر على أقرب عنصر بالاتجاه المطلوب
  function move(dir) {
    if (!current) return focus(items()[0]);
    var a = current.getBoundingClientRect();
    var ax = a.left + a.width / 2, ay = a.top + a.height / 2;
    var best = null, bestScore = Infinity;

    items().forEach(function (el) {
      if (el === current) return;
      var b = el.getBoundingClientRect();
      var dx = b.left + b.width / 2 - ax, dy = b.top + b.height / 2 - ay;
      var ok = (dir === 'left' && dx < -1) || (dir === 'right' && dx > 1) ||
               (dir === 'up' && dy < -1) || (dir === 'down' && dy > 1);
      if (!ok) return;
      var main = (dir === 'left' || dir === 'right') ? Math.abs(dx) : Math.abs(dy);
      var side = (dir === 'left' || dir === 'right') ? Math.abs(dy) : Math.abs(dx);
      var score = main + side * 3;
      if (score < bestScore) { bestScore = score; best = el; }
    });
    if (best) focus(best);
  }

  document.addEventListener('keydown', function (e) {
    switch (e.keyCode) {
      case KEY.LEFT:  move('left');  break;
      case KEY.RIGHT: move('right'); break;
      case KEY.UP:    move('up');    break;
      case KEY.DOWN:  move('down');  break;
      case KEY.ENTER: if (current) current.click(); break;
      case KEY.BACK:  break; // نحنا الشاشة الرئيسية، ما في لوين نرجع
      default: return;
    }
    e.preventDefault();
  });

  document.addEventListener('mouseover', function (e) {
    var el = e.target;
    while (el && el.nodeType === 1 && !el.hasAttribute('data-focus')) el = el.parentNode;
    if (el && el.nodeType === 1) focus(el);
  });

  window.nav = { focus: focus, first: function () { focus(items()[0]); } };
})();
