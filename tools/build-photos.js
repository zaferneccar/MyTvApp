// يقرأ كل الصور من مجلد photos/ ويكتب قائمتها في js/photos.js
// (التطبيق على التلفزيون ما بيقدر يقرأ محتوى المجلد لحاله)
const fs = require('fs');
const path = require('path');

const root = path.join(__dirname, '..');
const dir = path.join(root, 'photos');
const exts = ['.jpg', '.jpeg', '.png', '.webp'];

const files = fs.existsSync(dir)
  ? fs.readdirSync(dir).filter(f => exts.includes(path.extname(f).toLowerCase())).sort()
  : [];

const out = '// هالملف بيتولّد تلقائياً بـ: npm run photos — لا تعدّله يدوياً\n' +
  'window.PHOTOS = ' + JSON.stringify(files.map(f => 'photos/' + f), null, 2) + ';\n';

fs.writeFileSync(path.join(root, 'js', 'photos.js'), out);
console.log(`✔ ${files.length} صورة بـ js/photos.js`);
