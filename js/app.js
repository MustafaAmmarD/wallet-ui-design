/**
 * app.js — منطق التطبيق
 * التنقل بين الشاشات + القائمة الجانبية + Bottom Sheet + تبديل اللغة
 * محفظتي - تصميم واجهة المستخدم
 */

/* ============================================================
   1. التنقل بين الشاشات (Screen Navigation)
   ============================================================ */
const screens = {};

/** تهيئة مراجع الشاشات */
function initScreens() {
  document.querySelectorAll('.screen').forEach(screen => {
    screens[screen.id] = screen;
  });
}

/** إظهار شاشة وإخفاء باقي الشاشات */
function showScreen(screenId) {
  // إخفاء كل الشاشات
  document.querySelectorAll('.screen').forEach(s => {
    s.classList.remove('active');
  });

  // إظهار الشاشة المطلوبة
  const target = document.getElementById(screenId);
  if (target) {
    target.classList.add('active');
    target.scrollTop = 0;

    // تحديث زر التنقل النشط
    document.querySelectorAll('.demo-nav button').forEach(btn => {
      btn.classList.toggle('active', btn.dataset.screen === screenId);
    });

    // إخفاء الطبقات المظللة
    closeDrawer();
    closeTransferSheet();
  } else {
    console.warn('Screen not found:', screenId);
  }
}

/* ============================================================
   2. القائمة الجانبية (Drawer)
   ============================================================ */
function openDrawer() {
  const drawer  = document.getElementById('drawer');
  const overlay = document.getElementById('drawer-overlay');
  if (drawer)  drawer.classList.add('active');
  if (overlay) overlay.classList.add('active');
  document.body.style.overflow = 'hidden';
}

function closeDrawer() {
  const drawer  = document.getElementById('drawer');
  const overlay = document.getElementById('drawer-overlay');
  if (drawer)  drawer.classList.remove('active');
  if (overlay) overlay.classList.remove('active');
  document.body.style.overflow = '';
}

/* ============================================================
   3. Bottom Sheet (تحويل أموال - الخيارات)
   ============================================================ */
function openTransferSheet() {
  const sheet   = document.getElementById('transfer-sheet');
  const overlay = document.getElementById('sheet-overlay');
  if (sheet)   sheet.classList.add('active');
  if (overlay) overlay.classList.add('active');
}

function closeTransferSheet() {
  const sheet   = document.getElementById('transfer-sheet');
  const overlay = document.getElementById('sheet-overlay');
  if (sheet)   sheet.classList.remove('active');
  if (overlay) overlay.classList.remove('active');
}

/* ============================================================
   4. تبديل اللغة (Language Toggle RTL ↔ LTR)
   ============================================================ */
const translations = {
  ar: {
    dir: 'rtl',
    lang: 'ar',
    appName: 'محفظتي',
    loginTitle: 'تسجيل الدخول',
    loginWelcome: 'مرحباً بك',
    mobileLabel: 'رقم الموبايل',
    passwordLabel: 'كلمة المرور',
    forgotPassword: 'نسيت كلمة المرور؟',
    loginBtn: 'تسجيل الدخول',
    noAccount: 'ليس لديك حساب؟',
    newUser: 'مستخدم جديد',
    whatsapp: 'واتساب',
    contactUs: 'تواصل معنا',
    langBtn: 'English',
    logout: 'خروج',
    version: 'الإصدار 1.0.0',
    copied: 'تم النسخ!',
    currencySwapped: 'تم تبديل العملات',
    toggleOn: 'مفعّل',
    toggleOff: 'غير مفعّل',
  },
  en: {
    dir: 'ltr',
    lang: 'en',
    appName: 'My Wallet',
    loginTitle: 'Login',
    loginWelcome: 'Welcome Back',
    mobileLabel: 'Mobile Number',
    passwordLabel: 'Password',
    forgotPassword: 'Forgot Password?',
    loginBtn: 'Login',
    noAccount: "Don't have an account?",
    newUser: 'New User',
    whatsapp: 'WhatsApp',
    contactUs: 'Contact Us',
    langBtn: 'عربي',
    logout: 'Logout',
    version: 'Version 1.0.0',
    copied: 'Copied!',
    currencySwapped: 'Currencies swapped',
    toggleOn: 'Enabled',
    toggleOff: 'Disabled',
  }
};

let currentLang = 'ar';

function toggleLanguage() {
  currentLang = currentLang === 'ar' ? 'en' : 'ar';
  applyLanguage(currentLang);
}

function applyLanguage(lang) {
  const t    = translations[lang];
  const html = document.documentElement;

  html.setAttribute('dir',  t.dir);
  html.setAttribute('lang', t.lang);

  // تحديث النصوص بالـ data-i18n
  document.querySelectorAll('[data-i18n]').forEach(el => {
    const key = el.dataset.i18n;
    if (t[key]) el.textContent = t[key];
  });

  // تحديث placeholder بالـ data-i18n-ph
  document.querySelectorAll('[data-i18n-ph]').forEach(el => {
    const key = el.dataset.i18nPh;
    if (t[key]) el.setAttribute('placeholder', t[key]);
  });
}

/* ============================================================
   5. Toggle Switches
   ============================================================ */
function initToggles() {
  document.querySelectorAll('.toggle input').forEach(toggle => {
    toggle.addEventListener('change', function() {
      const label = this.closest('.toggle-wrapper')?.querySelector('.toggle-label');
      if (label) {
        const t = translations[currentLang];
        label.textContent = this.checked ? t.toggleOn : t.toggleOff;
      }
    });
  });
}

/* ============================================================
   6. تبويبات الاستلام/الإلغاء (Receive Tabs)
   ============================================================ */
function switchTab(tabGroup, tabName) {
  const group = document.querySelector(`[data-tab-group="${tabGroup}"]`);
  if (!group) return;

  // تحديث التبويبات
  group.querySelectorAll('.tab-item').forEach(tab => {
    const isActive = tab.dataset.tab === tabName;
    tab.classList.remove('active', 'active-blue');
    if (isActive) {
      // تبويب الاستلام = برتقالي، تبويب الإلغاء = أزرق
      tab.classList.add(tabName === 'receive' ? 'active' : 'active-blue');
    }
  });

  // إظهار/إخفاء محتوى التبويب
  group.querySelectorAll('[data-tab-content]').forEach(content => {
    content.style.display = content.dataset.tabContent === tabName ? '' : 'none';
  });
}

/* ============================================================
   7. إخفاء/إظهار كلمة المرور
   ============================================================ */
function togglePassword(inputId) {
  const input = document.getElementById(inputId);
  const icon  = document.getElementById(inputId + '-eye');
  if (!input) return;

  if (input.type === 'password') {
    input.type = 'text';
    if (icon) icon.className = 'fa-solid fa-eye-slash input-icon clickable';
  } else {
    input.type = 'password';
    if (icon) icon.className = 'fa-solid fa-eye input-icon clickable';
  }
}

/* ============================================================
   8. نسخ النص إلى الحافظة
   ============================================================ */
function copyToClipboard(text) {
  if (navigator.clipboard) {
    navigator.clipboard.writeText(text).then(() => {
      showToast(translations[currentLang].copied);
    });
  }
}

/* ============================================================
   9. إشعار صغير (Toast)
   ============================================================ */
function showToast(message) {
  let toast = document.getElementById('app-toast');
  if (!toast) {
    toast = document.createElement('div');
    toast.id = 'app-toast';
    toast.style.cssText = `
      position: fixed;
      bottom: 80px;
      left: 50%;
      transform: translateX(-50%);
      background: rgba(0,0,0,0.75);
      color: white;
      padding: 8px 20px;
      border-radius: 20px;
      font-size: 13px;
      font-family: 'Cairo', sans-serif;
      z-index: 9999;
      pointer-events: none;
      transition: opacity 0.3s;
    `;
    document.body.appendChild(toast);
  }
  toast.textContent = message;
  toast.style.opacity = '1';
  setTimeout(() => { toast.style.opacity = '0'; }, 2000);
}

/* ============================================================
   10. اختيار الجنس (Gender Radio)
   ============================================================ */
function selectGender(gender) {
  document.querySelectorAll('.radio-btn[data-gender]').forEach(btn => {
    btn.classList.toggle('selected', btn.dataset.gender === gender);
  });
}

/* ============================================================
   11. تهيئة التطبيق (App Init)
   ============================================================ */
document.addEventListener('DOMContentLoaded', function() {
  initScreens();
  initToggles();

  // إظهار شاشة تسجيل الدخول افتراضياً
  showScreen('screen-login');

  // إغلاق الـ Overlay عند النقر عليها
  document.getElementById('drawer-overlay')?.addEventListener('click', closeDrawer);
  document.getElementById('sheet-overlay')?.addEventListener('click', closeTransferSheet);

  // زر تبديل اللغة في القائمة الجانبية
  document.getElementById('lang-toggle-btn')?.addEventListener('click', toggleLanguage);

  // تهيئة تبويبات الاستلام
  const receiveGroup = document.querySelector('[data-tab-group="receive"]');
  if (receiveGroup) {
    switchTab('receive', 'receive');
  }

  console.log('محفظتي - تم تهيئة التطبيق ✓');
});
