// بيجهّز مجلد build/ للتغليف:
//   الغلاف (shell/) + نسخة محلية من الشاشة بـ build/app/ للتشغيل بدون نت
const fs = require('fs');
const path = require('path');

const root = path.join(__dirname, '..');
const out = path.join(root, 'build');
const appFiles = ['index.html', 'css', 'js', 'photos', 'icons'];

fs.rmSync(out, { recursive: true, force: true });
fs.cpSync(path.join(root, 'shell'), out, { recursive: true });
for (const f of ['icon.png', 'largeIcon.png']) fs.copyFileSync(path.join(root, f), path.join(out, f));
for (const f of appFiles) {
  const src = path.join(root, f);
  if (fs.existsSync(src)) fs.cpSync(src, path.join(out, 'app', f), { recursive: true });
}
console.log('✔ build/ جاهز (غلاف + نسخة محلية)');
