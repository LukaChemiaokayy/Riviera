/* ====== RIVIERA (Batumi) — demo config ====== */
window.SITE = {
  name: "Riviera",
  logo: "assets/logo.webp",          // <- ჩადე რივიერას ლოგო (Instagram/Facebook-იდან)
  phone: "+995574555544",
  currency: "GEL",

  // <- ჩასვი რივიერას ახალი Google Sheet-ის Apps Script /exec ბმული
  sheetUrl: "https://script.google.com/macros/s/AKfycbyk0DwfOuSgpEr-AaCMeBiIsfVTKYxwBbanZ2bfeEHw9bXha_YSz7ypTbPoh3_RbVui/exec",

  orderEndpoint: "",                  // ცარიელი = DEMO რეჟიმი
  allowedIps: [],

  langs: ["ka", "en", "ru"],
  defaultLang: "ka",
  slides: [],                         // ცარიელი = მენიუს ფოტოებიდან

  // ზღვის თემა: ღრმა ლურჯი + ტალღისფერი + ქვიშისფერი
  theme: {
    "charcoal": "#0e2a36", "charcoal-soft": "#14394a",
    "parchment": "#f3f0e8", "parchment-dim": "#e3e0d3",
    "ink": "#1c2a30", "ink-soft": "#58666b",
    "brass": "#c9a45c", "brass-bright": "#e0bd78",
    "wine": "#0f6e7a", "wine-bright": "#158795"
  },

  about: {
    ka: { eyebrow: "ჩვენ შესახებ", title: "კეთილი იყოს თქვენი მობრძანება {name}-ში",
      lede: "ზღვის პროდუქტების რესტორანი ბათუმში — გემრიელი საჭმელი და თბილი გარემო.",
      story: "რივიერაში გელით ზღვის პროდუქტები, ხინკალი, ხაჭაპური და ქათმის წვნიანი. შეგიძლიათ ისადილოთ ადგილზე, წაიღოთ თან ან შეუკვეთოთ მიწოდებით.",
      address: "თამარ მეფის ქუჩა 46, ბათუმი, საქართველო",
      hours: [["დახურვა", "02:00"]] },
    en: { eyebrow: "About Us", title: "Welcome to {name}",
      lede: "A seafood restaurant in Batumi — good food and a warm atmosphere.",
      story: "At Riviera you'll find seafood, khinkali, khachapuri and chicken soup. Dine in, take away, or order delivery.",
      address: "46 Tamar Mepe St, Batumi, Georgia",
      hours: [["Closing time", "02:00"]] },
    ru: { eyebrow: "О нас", title: "Добро пожаловать в {name}",
      lede: "Ресторан морепродуктов в Батуми — вкусная еда и тёплая атмосфера.",
      story: "В Ривьере вас ждут морепродукты, хинкали, хачапури и куриный суп. Можно поужинать в зале, взять с собой или заказать доставку.",
      address: "ул. Тамар Мепе, 46, Батуми, Грузия",
      hours: [["Закрытие", "02:00"]] }
  }
};
