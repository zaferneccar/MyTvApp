// لوحة الملاحظات: بتقرأ Google Sheet منشور كـ CSV وبتعرضه.
// بتكتب من تلفونك بتطبيق Google Sheets، وبتطلع على التلفزيون خلال دقيقة أو دقيقتين.
(function () {
  var seen = {};
  var firstLoad = true;

  // محلّل CSV صغير (بيدعم "علامات تنصيص" وفواصل وأسطر جوا الخلية)
  function parseCSV(text) {
    var rows = [], row = [], cell = '', q = false;
    for (var i = 0; i < text.length; i++) {
      var c = text[i];
      if (q) {
        if (c === '"' && text[i + 1] === '"') { cell += '"'; i++; }
        else if (c === '"') q = false;
        else cell += c;
      } else if (c === '"') q = true;
      else if (c === ',') { row.push(cell); cell = ''; }
      else if (c === '\n') { row.push(cell); rows.push(row); row = []; cell = ''; }
      else if (c !== '\r') cell += c;
    }
    if (cell || row.length) { row.push(cell); rows.push(row); }
    return rows;
  }

  function render(rows, max) {
    var box = document.getElementById('notes');
    var list = document.getElementById('notesList');
    var items = rows
      .map(function (r) { return { text: (r[0] || '').trim(), who: (r[1] || '').trim() }; })
      .filter(function (n) { return n.text; })
      .slice(0, max);

    list.innerHTML = '';
    items.forEach(function (n) {
      var li = document.createElement('li');
      li.textContent = n.text;
      if (n.who) {
        var who = document.createElement('span');
        who.className = 'who';
        who.textContent = '— ' + n.who;
        li.appendChild(who);
      }
      var key = n.text + '|' + n.who;
      if (!firstLoad && !seen[key]) li.className = 'new';
      seen[key] = true;
      list.appendChild(li);
    });
    box.hidden = items.length === 0;
    firstLoad = false;
  }

  function load(cfg) {
    var url = cfg.csvUrl + (cfg.csvUrl.indexOf('?') < 0 ? '?' : '&') + 't=' + Date.now();
    fetch(url, { cache: 'no-store' })
      .then(function (r) { if (!r.ok) throw new Error(r.status); return r.text(); })
      .then(function (t) { render(parseCSV(t), cfg.max || 6); })
      .catch(function (e) { console.log('notes:', e); }); // منخلي آخر نسخة ظاهرة
  }

  window.notes = {
    start: function (cfg) {
      if (!cfg || !cfg.csvUrl) return;
      load(cfg);
      setInterval(function () { load(cfg); }, (cfg.refreshSeconds || 60) * 1000);
    },
    _parse: parseCSV, _render: render
  };
})();
