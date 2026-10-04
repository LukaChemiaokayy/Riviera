(function () {
const S = window.SITE;
const page = document.body.dataset.page || 'menu';

const I18N = {
 ka:{main:'მთავარი',about:'ჩვენ შესახებ',contact:'დაგვიკავშირდით',categories:'კატეგორიები',bottle:'ბოთლი',glass:'ჭიქა',add:'დამატება',cart:'კალათა',waiter:'ოფიციანტის გამოძახება',order:'თქვენი შეკვეთა',total:'სულ',send:'შეკვეთის გაგზავნა სამზარეულოში',empty:'კალათა ცარიელია!',added:'დაემატა კალათას',wifi:'ეს ფუნქცია მხოლოდ რესტორნის Wi-Fi-ზე მუშაობს',sent:'შეკვეთა გაიგზავნა!',called:'ოფიციანტი გამოძახებულია, მაგიდა',err:'შეცდომა. სცადეთ თავიდან.',loadFail:'მენიუს ჩატვირთვა ვერ მოხერხდა.',hours:'სამუშაო საათები',find:'გვიპოვეთ',touch:'დაგვიკავშირდით',sec:'წმ'},
 en:{main:'Main',about:'About Us',contact:'Contact Us',categories:'Categories',bottle:'Bottle',glass:'Glass',add:'Add',cart:'Cart',waiter:'Call Waiter',order:'Your Order',total:'Total',send:'Send Order to Kitchen',empty:'Your cart is empty!',added:'added to cart',wifi:'Only available on the restaurant Wi-Fi',sent:'Order sent to the kitchen!',called:'Waiter called, table',err:'Something went wrong. Try again.',loadFail:'Failed to load the menu.',hours:'Opening Hours',find:'Find Us',touch:'Get in Touch',sec:'s'},
 ru:{main:'Главная',about:'О нас',contact:'Связаться',categories:'Категории',bottle:'Бутылка',glass:'Бокал',add:'Добавить',cart:'Корзина',waiter:'Позвать официанта',order:'Ваш заказ',total:'Итого',send:'Отправить заказ на кухню',empty:'Корзина пуста!',added:'добавлено в корзину',wifi:'Доступно только в Wi-Fi ресторана',sent:'Заказ отправлен на кухню!',called:'Официант вызван, столик',err:'Ошибка. Попробуйте снова.',loadFail:'Не удалось загрузить меню.',hours:'Часы работы',find:'Как нас найти',touch:'Связаться с нами',sec:'с'}
};
const FLAG = { ka:['ge','GE'], en:['gb','EN'], ru:['ru','RU'] };

const P = new URLSearchParams(location.search);
let lang = P.get('lang') || (()=>{try{return localStorage.getItem('lang')}catch(e){}})() || S.defaultLang;
if (!S.langs.includes(lang)) lang = S.defaultLang;
try { localStorage.setItem('lang', lang); } catch (e) {}
const t = k => (I18N[lang] && I18N[lang][k]) || I18N.en[k] || k;
const table = P.get('table') || '';
const esc = s => String(s == null ? '' : s).replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const qs = (l = lang) => `?lang=${l}` + (table ? `&table=${encodeURIComponent(table)}` : '');
const $ = id => document.getElementById(id);
const num = v => Number(String(v == null ? '' : v).replace(',', '.')) || 0;
const m = n => Math.round(n * 100) / 100;

document.documentElement.lang = lang;
document.title = S.name;
Object.entries(S.theme || {}).forEach(([k, v]) => document.documentElement.style.setProperty('--' + k, v));
if (page === 'about') document.body.classList.add('about-body');
const ic = document.createElement('link'); ic.rel = 'icon'; ic.href = S.logo; document.head.appendChild(ic);

/* ---------- Layout ---------- */
const here = page === 'about' ? 'about.html' : 'index.html';
const links = [['index.html', t('main')], ['about.html', t('about')]];
const langHtml = S.langs.map(l => `<a href="${here}${qs(l)}" class="lang-item"><img src="https://flagcdn.com/w40/${FLAG[l][0]}.png" alt="${l}" class="flag-icon"><span>${FLAG[l][1]}</span></a>`).join('');
const linkLi = (cls) => links.map(([h, l]) => `<li${cls}><a href="${h}${qs()}">${l}</a></li>`).join('') + `<li${cls}><a href="tel:${esc(S.phone)}">${t('contact')}</a></li>`;

let html = `
<header><nav>
 <div class="left-side"><img id="navlogo" src="${esc(S.logo)}" alt=""><span id="nametext">${esc(S.name)}</span></div>
 <ul class="desktop-nav">${linkLi(' class="buttons"')}<li class="buttons dropdown"><div class="lang-dropdown">${langHtml}</div></li></ul>
 <button class="menu-toggle-btn" data-toggle-menu aria-label="Menu"><span></span><span></span><span></span></button>
</nav></header>
<div class="mobile-menu-overlay" id="mobile-menu-overlay" data-toggle-menu></div>
<div class="mobile-menu-drawer" id="mobile-menu-drawer">
 <div class="mobile-menu-header"><span>${esc(S.name)}</span><span class="close-mobile-menu" data-toggle-menu>&times;</span></div>
 <ul class="mobile-menu-list">${linkLi('')}</ul>
 <div class="mobile-lang-switch">${langHtml}</div>
</div>
<div id="toast-container" aria-live="polite"></div>`;

if (page === 'menu') {
 html += `
<div class="slider" id="slider" hidden><div class="slide-track" id="slide-track"></div></div>
<section class="category-section"><h2 class="section-title">${t('categories')}</h2><div class="category-grid" id="category-grid-container"></div></section>
<div id="sub-menus-container"></div>
<div class="bottom-action-bar">
 <button class="call-waiter-btn" id="waiter-btn">🔔 ${t('waiter')}</button>
 <button class="cart-btn" data-toggle-cart>🛒 ${t('cart')} (<span id="cart-count">0</span>) - <span id="cart-total">0</span> ${esc(S.currency)}</button>
</div>
<div id="cart-modal" class="cart-modal"><div class="cart-content">
 <div class="cart-header"><h3>${t('order')}</h3><span class="close-cart" data-toggle-cart>&times;</span></div>
 <div id="cart-items-list"></div>
 <div class="cart-footer"><h4>${t('total')}: <span id="modal-cart-total">0</span> ${esc(S.currency)}</h4><button class="send-order-btn" id="send-btn">${t('send')}</button></div>
</div></div>`;
} else {
 const a = S.about[lang] || S.about[S.defaultLang];
 const r = s => esc(s).replace(/\{name\}/g, esc(S.name));
 html += `
<section class="about-hero"><div class="about-hero-inner"><span class="about-eyebrow">${r(a.eyebrow)}</span><h1 class="about-title">${r(a.title)}</h1><p class="about-lede">${r(a.lede)}</p></div></section>
<section class="about-section"><div class="about-container"><p class="about-p">${r(a.story)}</p></div></section>
<section class="about-section about-section-alt"><div class="about-container"><div class="info-grid">
 <div class="info-card"><h3 class="info-title">${t('hours')}</h3><ul class="hours-list">${a.hours.map(h => `<li><span>${esc(h[0])}</span><span>${esc(h[1])}</span></li>`).join('')}</ul></div>
 <div class="info-card"><h3 class="info-title">${t('find')}</h3><p class="info-text">${r(a.address)}</p></div>
 <div class="info-card"><h3 class="info-title">${t('touch')}</h3><p class="info-text"><a class="info-link" href="tel:${esc(S.phone)}">${esc(S.phone)}</a></p></div>
</div></div></section>`;
}
$('app').innerHTML = html;

/* ---------- Toast ---------- */
function toast(msg, type = 'success', ms = 3200) {
 const c = $('toast-container'), el = document.createElement('div');
 el.className = 'toast toast-' + type;
 el.innerHTML = `<span class="toast-icon">${{success:'✓',error:'✕',warning:'!'}[type]}</span><span class="toast-message"></span>`;
 el.querySelector('.toast-message').textContent = msg;
 c.appendChild(el);
 requestAnimationFrame(() => el.classList.add('toast-show'));
 setTimeout(() => { el.classList.remove('toast-show'); el.classList.add('toast-hide'); setTimeout(() => el.remove(), 300); }, ms);
}
const demo = () => S.orderEndpoint ? '' : ' (DEMO)';

function toggleMobile() {
 const d = $('mobile-menu-drawer').classList.toggle('active');
 $('mobile-menu-overlay').classList.toggle('active', d);
 document.body.style.overflow = d ? 'hidden' : '';
}

if (page === 'menu') {
 /* ---------- Cart ---------- */
 let cart = [];
 const sum = () => m(cart.reduce((s, i) => s + i.price * i.qty, 0));
 function renderCart() {
  $('cart-count').textContent = cart.reduce((s, i) => s + i.qty, 0);
  $('cart-total').textContent = $('modal-cart-total').textContent = sum();
  $('cart-items-list').innerHTML = cart.map((i, n) => `<div class="cart-item"><span>${esc(i.name)} x${i.qty}</span><span>${m(i.price * i.qty)} ${esc(S.currency)}</span><button data-remove="${n}">❌</button></div>`).join('');
 }
 const toggleCart = () => $('cart-modal').classList.toggle('active');

 /* ---------- Menu ---------- */
 function itemHtml(it) {
  const name = it['name_' + lang] || it.name || '';
  const desc = it['description_' + lang] || it.description || '';
  const glass = num(it.price_glass != null && it.price_glass !== '' ? it.price_glass : it.price);
  const bottle = num(it.price_bottle);
  const img = it.item_image ? `<div class="item-image"><img loading="lazy" src="${esc(it.item_image)}" alt="${esc(name)}"></div>` : '';
  return `<div class="menu-item" data-id="${esc(it.id != null ? it.id : name)}" data-name="${esc(name)}" data-glass="${glass}" data-bottle="${bottle}" data-variant="glass">${img}
   <div class="item-info"><span class="item-name">${esc(name)}</span><span class="item-desc">${esc(desc)}</span></div>
   <div class="item-price-action"><span class="price">${glass} ${esc(S.currency)}</span>
    ${bottle ? `<button class="toggle-variant">${t('bottle')}</button>` : ''}
    <button class="add-to-cart-btn">${bottle ? '+' : '+ ' + t('add')}</button></div></div>`;
 }

 function renderSlider(urls) {
  if (!urls.length) return;
  let s = []; while (s.length < 8) s = s.concat(urls);
  $('slide-track').innerHTML = s.concat(s).map(u => `<div class="slide"><img src="${esc(u)}" alt=""></div>`).join('');
  $('slider').hidden = false;
 }

 async function loadMenu() {
  try {
   const data = await (await fetch(S.sheetUrl)).json();
   const cats = new Map();
   data.forEach(it => { if (!cats.has(it.category)) cats.set(it.category, []); cats.get(it.category).push(it); });
   let grid = '', subs = '', n = 0;
   cats.forEach((items, cat) => {
    const id = 'cat-' + n++, f = items[0], label = f['category_' + lang] || cat;
    const ci = f.image || (items.find(i => i.item_image) || {}).item_image;
    grid += `<div class="category-card" data-menu="${id}"><div class="category-image">${ci ? `<img src="${esc(ci)}" alt="${esc(label)}">` : ''}</div><span class="category-name">${esc(label.toUpperCase())}</span></div>`;
    subs += `<div id="${id}" class="sub-menu-container"><h3>${esc(label)}</h3><div class="menu-items-list">${items.map(itemHtml).join('')}</div></div>`;
   });
   $('category-grid-container').innerHTML = grid;
   $('sub-menus-container').innerHTML = subs;
   renderSlider(S.slides && S.slides.length ? S.slides : data.map(i => i.item_image || i.image).filter(Boolean).slice(0, 8));
  } catch (e) { console.error(e); toast(t('loadFail'), 'error'); }
 }

 /* ---------- Orders ---------- */
 async function onWifi() {
  if (!S.allowedIps || !S.allowedIps.length) return true;
  try { return S.allowedIps.includes((await (await fetch('https://api.ipify.org?format=json')).json()).ip); } catch (e) { return false; }
 }
 async function post(payload) {
  if (!S.orderEndpoint) { await new Promise(r => setTimeout(r, 400)); return true; }
  return (await fetch(S.orderEndpoint, { method: 'POST', headers: { 'Content-Type': 'text/plain' }, body: JSON.stringify(payload) })).ok;
 }
 function cooldown(btn, secs, label) {
  let left = secs; btn.disabled = true; btn.classList.add('cooldown-active'); btn.textContent = `⏳ ${left}${t('sec')}`;
  const iv = setInterval(() => {
   if (--left <= 0) { clearInterval(iv); btn.disabled = false; btn.classList.remove('cooldown-active'); btn.textContent = label; }
   else btn.textContent = `⏳ ${left}${t('sec')}`;
  }, 1000);
 }
 async function callWaiter(btn) {
  if (btn.disabled) return;
  if (!(await onWifi())) return toast(t('wifi'), 'warning');
  try {
   if (await post({ type: 'waiter', table })) { toast(`${t('called')} №${table || '?'}${demo()}`); cooldown(btn, 60, `🔔 ${t('waiter')}`); }
   else toast(t('err'), 'error');
  } catch (e) { toast(t('err'), 'error'); }
 }
 async function sendOrder(btn) {
  if (btn.disabled) return;
  if (!cart.length) return toast(t('empty'), 'warning');
  if (!(await onWifi())) return toast(t('wifi'), 'warning');
  try {
   if (await post({ type: 'order', table, total: sum(), items: cart.map(({ name, price, qty }) => ({ name, price, qty })) })) {
    toast(t('sent') + demo()); cooldown(btn, 20, t('send')); cart = []; renderCart(); toggleCart();
   } else toast(t('err'), 'error');
  } catch (e) { toast(t('err'), 'error'); }
 }

 /* ---------- Events (delegation) ---------- */
 document.addEventListener('click', e => {
  const T = e.target;
  if (T.id === 'cart-modal') return toggleCart();
  if (T.closest('[data-toggle-cart]')) return toggleCart();
  if (T.closest('#waiter-btn')) return callWaiter($('waiter-btn'));
  if (T.closest('#send-btn')) return sendOrder($('send-btn'));
  const rm = T.closest('[data-remove]'); if (rm) { cart.splice(+rm.dataset.remove, 1); return renderCart(); }
  const card = T.closest('.category-card');
  if (card) {
   document.querySelectorAll('.sub-menu-container').forEach(m => { if (m.id !== card.dataset.menu) m.classList.remove('active'); });
   const m = $(card.dataset.menu); m.classList.toggle('active');
   if (m.classList.contains('active')) setTimeout(() => m.scrollIntoView({ behavior: 'smooth' }), 200);
   return;
  }
  const row = T.closest('.menu-item'); if (!row) return;
  const toggleBtn = T.closest('.toggle-variant');
  if (toggleBtn) {
   const v = row.dataset.variant === 'glass' ? 'bottle' : 'glass';
   row.dataset.variant = v;
   row.querySelector('.price').textContent = `${row.dataset[v]} ${S.currency}`;
   toggleBtn.textContent = v === 'glass' ? t('bottle') : t('glass');
   toggleBtn.classList.toggle('bottle-active', v === 'bottle');
   return;
  }
  if (T.closest('.add-to-cart-btn')) {
   const v = row.dataset.variant, hasBottle = +row.dataset.bottle > 0;
   const name = row.dataset.name + (hasBottle ? ` (${t(v)})` : '');
   const key = row.dataset.id + '|' + v, price = +row.dataset[v];
   const ex = cart.find(i => i.key === key);
   if (ex) ex.qty++; else cart.push({ key, name, price, qty: 1 });
   renderCart(); toast(`${name} — ${t('added')}`, 'success', 1800);
  }
 });
 document.addEventListener('DOMContentLoaded', () => {});
 loadMenu();
}

document.addEventListener('click', e => { if (e.target.closest('[data-toggle-menu]')) toggleMobile(); });
})();
