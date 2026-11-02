// بينسخ ملفات التطبيق بس (بدون node_modules وغيرها) لمجلد build/ قبل التغليف
const fs = require('fs');
const path = require('path');

const root = path.join(__dirname, '..');
const out = path.join(root, 'build');
const include = ['appinfo.json', 'index.html', 'icon.png', 'largeIcon.png', 'css', 'js', 'photos', 'icons'];

fs.rmSync(out, { recursive: true, force: true });
fs.mkdirSync(out);
for (const f of include) {
  const src = path.join(root, f);
  if (fs.existsSync(src)) fs.cpSync(src, path.join(out, f), { recursive: true });
}
console.log('✔ build/ جاهز');
