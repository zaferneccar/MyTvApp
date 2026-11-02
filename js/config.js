// ============================================================
//  إعدادات الشاشة الرئيسية — عدّل هون بس
// ============================================================
window.CONFIG = {
  familyName: 'عيلتنا',

  // الطقس (من open-meteo.com، مجاني وبدون مفتاح)
  // حط إحداثيات مدينتك، أو خلّيها null لتخفي الطقس
  weather: { lat: 33.51, lon: 36.29, city: 'دمشق' },

  // كل كم ثانية تتغير صورة العيلة
  slideSeconds: 12,

  // التطبيقات المهمة.  id = رقم التطبيق على webOS
  // لتعرف id أي تطبيق: افتحه على التلفزيون وشغّل  npm run running
  // icon: إما إيموجي، أو مسار صورة مثل 'icons/netflix.png'
  apps: [
    { name: 'YouTube',  id: 'youtube.leanback.v4',        icon: '▶️', color: '#e62117' },
    { name: 'Netflix',  id: 'netflix',                    icon: 'N',  color: '#b20710' },
    { name: 'التلفزيون', id: 'com.webos.app.livetv',       icon: '📺', color: '#2a6fdb' },
    { name: 'HDMI 1',   id: 'com.webos.app.hdmi1',        icon: '🎮', color: '#6b4fd8' },
    { name: 'المتصفح',   id: 'com.webos.app.browser',      icon: '🌐', color: '#13915f' },
    { name: 'الإعدادات', id: 'com.palm.app.settings',      icon: '⚙️', color: '#555b6e' }
  ],

  // تطبيقاتي اللي عاملها أنا (نفس الشكل)
  myApps: [
    // { name: 'تطبيقي', id: 'com.mytvapp.something', icon: '⭐', color: '#d98e04' }
  ]
};
