// ============ HAYAT YOLU — Oyun Verileri ============

const DATA = {

  maleNames: ["Ahmet", "Mehmet", "Emre", "Burak", "Can", "Deniz", "Efe", "Kerem", "Mert", "Onur", "Arda", "Baran", "Çınar", "Doruk", "Ege", "Kaan", "Toprak", "Umut", "Yiğit", "Alp"],
  femaleNames: ["Ayşe", "Elif", "Zeynep", "Defne", "Ecrin", "Su", "Nehir", "Asya", "Mira", "Lina", "Azra", "Duru", "Eylül", "İpek", "Melis", "Nil", "Selin", "Yağmur", "Derin", "Ada"],
  surnames: ["Yılmaz", "Kaya", "Demir", "Çelik", "Şahin", "Öztürk", "Aydın", "Arslan", "Doğan", "Kılıç", "Aslan", "Çetin", "Koç", "Kurt", "Özdemir", "Erdoğan", "Yıldız", "Güneş", "Bulut", "Korkmaz"],

  cities: ["İstanbul", "Ankara", "İzmir", "Bursa", "Antalya", "Adana", "Konya", "Gaziantep", "Trabzon", "Eskişehir", "Mersin", "Diyarbakır", "Samsun", "Kayseri", "Muğla"],

  traits: [
    { name: "Meraklı", emoji: "🔍", desc: "Zekası hızlı gelişir" },
    { name: "Karizmatik", emoji: "😎", desc: "İlişkilerde şanslı" },
    { name: "Dayanıklı", emoji: "🛡️", desc: "Hastalıklara dirençli" },
    { name: "Sanatçı Ruhlu", emoji: "🎨", desc: "Mutluluğu kolay artar" },
    { name: "Girişimci", emoji: "💡", desc: "Para kazanmada şanslı" },
    { name: "Asi", emoji: "🔥", desc: "Risk sever, başı belaya girer" },
  ],

  // ---- Meslekler ----
  // edu: 0 = eğitimsiz, 1 = lise, 2 = üniversite, 3 = yüksek lisans/doktora
  jobs: [
    { id: "garson",     title: "Garson",              emoji: "🍽️", salary: 96000,   edu: 0, smarts: 0 },
    { id: "kurye",      title: "Moto Kurye",          emoji: "🛵", salary: 108000,  edu: 0, smarts: 0 },
    { id: "kasiyer",    title: "Market Kasiyeri",     emoji: "🛒", salary: 102000,  edu: 0, smarts: 5 },
    { id: "guvenlik",   title: "Güvenlik Görevlisi",  emoji: "🦺", salary: 120000,  edu: 1, smarts: 10 },
    { id: "berber",     title: "Kuaför / Berber",     emoji: "💈", salary: 132000,  edu: 1, smarts: 10 },
    { id: "sofor",      title: "Otobüs Şoförü",       emoji: "🚌", salary: 144000,  edu: 1, smarts: 15 },
    { id: "asci",       title: "Aşçı",                emoji: "👨‍🍳", salary: 156000,  edu: 1, smarts: 20 },
    { id: "elektrikci", title: "Elektrik Teknisyeni", emoji: "⚡", salary: 180000,  edu: 1, smarts: 30 },
    { id: "polis",      title: "Polis Memuru",        emoji: "👮", salary: 240000,  edu: 1, smarts: 40 },
    { id: "emlakci",    title: "Emlak Danışmanı",     emoji: "🏘️", salary: 216000,  edu: 1, smarts: 35 },
    { id: "ogretmen",   title: "Öğretmen",            emoji: "📚", salary: 288000,  edu: 2, smarts: 50 },
    { id: "hemsire",    title: "Hemşire",             emoji: "💉", salary: 300000,  edu: 2, smarts: 50 },
    { id: "muhasebeci", title: "Mali Müşavir",        emoji: "🧾", salary: 336000,  edu: 2, smarts: 55 },
    { id: "mimar",      title: "Mimar",               emoji: "📐", salary: 420000,  edu: 2, smarts: 60 },
    { id: "muhendis",   title: "Yazılım Mühendisi",   emoji: "💻", salary: 540000,  edu: 2, smarts: 65 },
    { id: "pilot",      title: "Pilot",               emoji: "✈️", salary: 720000,  edu: 2, smarts: 70 },
    { id: "avukat",     title: "Avukat",              emoji: "⚖️", salary: 600000,  edu: 2, smarts: 70 },
    { id: "doktor",     title: "Doktor",              emoji: "🩺", salary: 840000,  edu: 3, smarts: 75 },
    { id: "cerrah",     title: "Beyin Cerrahı",       emoji: "🧠", salary: 1440000, edu: 3, smarts: 85 },
    { id: "profesor",   title: "Profesör",            emoji: "🎓", salary: 660000,  edu: 3, smarts: 80 },
  ],

  partTimeJobs: [
    { id: "pt_bulasik", title: "Bulaşıkçılık",      emoji: "🧽", salary: 36000 },
    { id: "pt_dagitim", title: "Broşür Dağıtma",    emoji: "📄", salary: 30000 },
    { id: "pt_garson",  title: "Kafede Çalışma",    emoji: "☕", salary: 42000 },
    { id: "pt_ders",    title: "Özel Ders Verme",   emoji: "✏️", salary: 54000, smarts: 60 },
  ],

  majors: [
    { id: "tip",      name: "Tıp",                 emoji: "🩺", years: 6, smarts: 70 },
    { id: "hukuk",    name: "Hukuk",               emoji: "⚖️", years: 4, smarts: 60 },
    { id: "muh",      name: "Mühendislik",         emoji: "⚙️", years: 4, smarts: 55 },
    { id: "mimarlik", name: "Mimarlık",            emoji: "📐", years: 4, smarts: 55 },
    { id: "isletme",  name: "İşletme",             emoji: "📊", years: 4, smarts: 40 },
    { id: "egitim",   name: "Eğitim Fakültesi",    emoji: "📚", years: 4, smarts: 40 },
    { id: "saglik",   name: "Sağlık Bilimleri",    emoji: "💉", years: 4, smarts: 45 },
    { id: "sanat",    name: "Güzel Sanatlar",      emoji: "🎨", years: 4, smarts: 30 },
  ],

  // Hangi bölüm hangi mesleklerin kapısını açar
  majorJobs: {
    tip:      ["doktor", "cerrah", "profesor"],
    hukuk:    ["avukat", "profesor"],
    muh:      ["muhendis", "pilot", "profesor"],
    mimarlik: ["mimar", "profesor"],
    isletme:  ["muhasebeci", "emlakci", "profesor"],
    egitim:   ["ogretmen", "profesor"],
    saglik:   ["hemsire", "doktor", "profesor"],
    sanat:    ["ogretmen", "profesor"],
  },

  // ---- Varlıklar ----
  cars: [
    { id: "bisiklet",  name: "Bisiklet",            emoji: "🚲", price: 15000,    happiness: 4 },
    { id: "motor",     name: "Motosiklet",          emoji: "🏍️", price: 180000,   happiness: 8 },
    { id: "eskiaraba", name: "İkinci El Araba",     emoji: "🚗", price: 450000,   happiness: 10 },
    { id: "yeniaraba", name: "Sıfır Araba",         emoji: "🚙", price: 1300000,  happiness: 16 },
    { id: "luksaraba", name: "Lüks Spor Araba",     emoji: "🏎️", price: 6500000,  happiness: 28 },
  ],
  homes: [
    { id: "studyo", name: "Stüdyo Daire",          emoji: "🚪", price: 1500000,  happiness: 8 },
    { id: "daire",  name: "3+1 Daire",             emoji: "🏢", price: 4200000,  happiness: 14 },
    { id: "mustakil", name: "Müstakil Ev",         emoji: "🏡", price: 8500000,  happiness: 20 },
    { id: "villa",  name: "Deniz Manzaralı Villa", emoji: "🏖️", price: 25000000, happiness: 32 },
  ],
  pets: [
    { id: "balik", name: "Akvaryum Balığı", emoji: "🐠", price: 2000,   happiness: 4,  life: 4 },
    { id: "kus",   name: "Muhabbet Kuşu",   emoji: "🦜", price: 5000,   happiness: 6,  life: 8 },
    { id: "kedi",  name: "Kedi",            emoji: "🐱", price: 12000,  happiness: 12, life: 15 },
    { id: "kopek", name: "Köpek",           emoji: "🐶", price: 20000,  happiness: 14, life: 13 },
  ],

  // ---- Rastgele Olaylar ----
  // chance: yıl başına gerçekleşme olasılığı (0-1). cond(s) ile koşullanabilir.
  events: [
    // --- Bebeklik / Çocukluk (0-12) ---
    { min: 1, max: 3, chance: .25, text: "İlk kelimeni söyledin: «{anne}». Annen sevinçten ağladı.", fx: { happiness: 5 } },
    { min: 2, max: 5, chance: .2, text: "Parkta düşüp dizini kanattın. 😢", fx: { health: -4, happiness: -3 } },
    { min: 3, max: 7, chance: .2, text: "Anaokulunda resim yarışmasını kazandın! 🖍️", fx: { happiness: 7, smarts: 3 } },
    { min: 4, max: 9, chance: .18, text: "Bir sokak kedisiyle arkadaş oldun. 🐈", fx: { happiness: 6 } },
    { min: 5, max: 10, chance: .15, text: "Suçiçeği oldun ve bir hafta evde yattın.", fx: { health: -8, happiness: -4 } },
    {
      min: 6, max: 12, chance: .22, text: "Okulda bir zorba sana sataşıyor. Ne yapacaksın?",
      choices: [
        { label: "Karşı koy", emoji: "✊", fx: { happiness: 6, health: -5 }, msg: "Karşı koydun! Zorba bir daha sataşmadı ama yumruk yedin." },
        { label: "Öğretmene söyle", emoji: "🗣️", fx: { happiness: 3, smarts: 2 }, msg: "Öğretmen duruma el koydu. Akıllıca davrandın." },
        { label: "Görmezden gel", emoji: "🙈", fx: { happiness: -6 }, msg: "İçine attın. Bir süre moralin bozuk gezdin." },
      ]
    },
    { min: 7, max: 12, chance: .15, text: "Matematik yarışmasında okul birincisi oldun! 🏆", fx: { smarts: 6, happiness: 6 }, cond: s => s.stats.smarts > 55 },
    { min: 8, max: 13, chance: .15, text: "Bisikletten düştün, kolun alçıya alındı.", fx: { health: -10, happiness: -5 } },

    // --- Gençlik (13-17) ---
    { min: 13, max: 16, chance: .2, text: "Sivilcelerin çıktı, aynaya bakmak istemiyorsun. 😩", fx: { looks: -4, happiness: -3 } },
    { min: 13, max: 17, chance: .18, text: "Okul takımına seçildin! ⚽", fx: { health: 6, happiness: 7 } },
    {
      min: 14, max: 17, chance: .22, text: "Arkadaşların dersi asıp maça gitmeyi teklif ediyor.",
      choices: [
        { label: "Onlarla git", emoji: "🎉", fx: { happiness: 8, smarts: -4 }, msg: "Efsane bir gün geçirdin ama dersten geri kaldın.", risk: { chance: .3, fx: { happiness: -6 }, msg: "Müdür yakaladı! Ailene haber verildi, ceza aldın." } },
        { label: "Derste kal", emoji: "📖", fx: { smarts: 4, happiness: -2 }, msg: "Derste kaldın. Sıkıcıydı ama sınavda işine yaradı." },
      ]
    },
    { min: 15, max: 17, chance: .15, text: "İlk aşkını yaşadın ama karşılıksız çıktı. 💔", fx: { happiness: -7 } },
    {
      min: 15, max: 17, chance: .15, text: "Bir partide sana sigara uzattılar.",
      choices: [
        { label: "Reddet", emoji: "🚭", fx: { happiness: 1, health: 2 }, msg: "Reddettin. Sağlığın sana teşekkür ediyor." },
        { label: "Dene", emoji: "🚬", fx: { health: -6, happiness: 3 }, msg: "Denedin, öksürdün. Kötü bir alışkanlığın kapısını araladın." },
      ]
    },

    // --- Yetişkinlik (18-50) ---
    { min: 18, max: 60, chance: .1, text: "Grip oldun, bir hafta yataktan çıkamadın. 🤒", fx: { health: -7, happiness: -3 } },
    { min: 18, max: 70, chance: .08, text: "Eski bir arkadaşınla karşılaştın, saatlerce sohbet ettiniz. ☕", fx: { happiness: 6 } },
    { min: 20, max: 55, chance: .07, text: "Cüzdanını kaybettin! 😱", fx: { money: -8000, happiness: -4 } },
    { min: 20, max: 60, chance: .06, text: "Sokakta para buldun! 🍀", fx: { money: 5000, happiness: 4 } },
    {
      min: 18, max: 60, chance: .08, text: "Bir arkadaşın senden borç para istiyor (₺25.000).",
      cond: s => s.money >= 25000,
      choices: [
        { label: "Borç ver", emoji: "🤝", fx: { money: -25000, happiness: 3 }, msg: "Borç verdin.", risk: { chance: .5, fx: { money: 35000, happiness: 5 }, msg: "Arkadaşın borcunu faiziyle geri ödedi! Dostluğunuz pekişti." } },
        { label: "Reddet", emoji: "🙅", fx: { happiness: -3 }, msg: "Reddettin. Arkadaşın kırıldı ama paran cebinde kaldı." },
      ]
    },
    {
      min: 22, max: 55, chance: .07, text: "İnternette riskli ama kazançlı görünen bir yatırım fırsatı buldun.",
      cond: s => s.money >= 50000,
      choices: [
        { label: "₺50.000 yatır", emoji: "📈", fx: { money: -50000 }, msg: "Yatırımı yaptın...", risk: { chance: .45, fx: { money: 140000, happiness: 10 }, msg: "Yatırım patladı! Paran neredeyse 3 katına çıktı! 🚀", failMsg: "Yatırım çöktü. Paran buhar oldu. 📉", failFx: { happiness: -10 } } },
        { label: "Uzak dur", emoji: "🛑", fx: {}, msg: "Riske girmedin. Belki de en doğrusu buydu." },
      ]
    },
    { min: 25, max: 60, chance: .05, text: "Trafik kazası geçirdin! Hastanede uyandın. 🚑", fx: { health: -20, happiness: -8, money: -15000 } },
    { min: 18, max: 80, chance: .05, text: "Piyangodan amorti çıktı! 🎰", fx: { money: 10000, happiness: 5 } },
    { min: 30, max: 65, chance: .05, text: "Belin tutuldu, bir hafta dik yürüyemedin.", fx: { health: -8, happiness: -4 } },
    {
      min: 18, max: 75, chance: .06, text: "Gece yarısı sokakta cüzdan dolusu para buldun. İçinde kimlik var.",
      choices: [
        { label: "Sahibine ulaştır", emoji: "😇", fx: { happiness: 8 }, msg: "Sahibini bulup teslim ettin. Adam sana ₺5.000 ödül verdi!", bonus: { money: 5000 } },
        { label: "Cebe at", emoji: "😈", fx: { money: 20000, happiness: -3 }, msg: "Parayı aldın. Vicdanın biraz sızlıyor...", karma: -1 },
      ]
    },

    // --- Yaşlılık (60+) ---
    { min: 60, max: 100, chance: .12, text: "Eklemlerin ağrıyor, merdivenler eskisi gibi kolay değil.", fx: { health: -6 } },
    { min: 62, max: 100, chance: .1, text: "Torun sevgisi gibisi yok. Parkta harika bir gün geçirdiniz. 👴👶", fx: { happiness: 8 }, cond: s => s.children.length > 0 },
    { min: 65, max: 100, chance: .08, text: "Eski fotoğraflara bakıp gençliğini andın. 📷", fx: { happiness: 4 } },
    { min: 70, max: 100, chance: .1, text: "Kalp çarpıntısı yüzünden hastaneye kaldırıldın.", fx: { health: -15, happiness: -5, money: -20000 } },
  ],

  // ---- Suçlar ----
  crimes: [
    { id: "kapkac",  name: "Kapkaç",          emoji: "👜", gain: [5000, 30000],    catchChance: .35, jail: 1 },
    { id: "dukkan",  name: "Dükkan Soygunu",  emoji: "🏪", gain: [30000, 120000],  catchChance: .45, jail: 3 },
    { id: "araba",   name: "Araba Hırsızlığı",emoji: "🚗", gain: [100000, 400000], catchChance: .55, jail: 5 },
    { id: "banka",   name: "Banka Soygunu",   emoji: "🏦", gain: [500000, 3000000],catchChance: .75, jail: 12 },
  ],

  // ---- Başarımlar ----
  achievements: [
    { id: "uni",       name: "Diplomalı",         emoji: "🎓", desc: "Üniversiteden mezun ol" },
    { id: "evlilik",   name: "Evet, Evet!",       emoji: "💍", desc: "Evlen" },
    { id: "ebeveyn",   name: "Ebeveyn",           emoji: "👶", desc: "Çocuğun olsun" },
    { id: "milyoner",  name: "Milyoner",          emoji: "💰", desc: "₺1.000.000 biriktir" },
    { id: "multimilyoner", name: "Multimilyoner", emoji: "🤑", desc: "₺10.000.000 biriktir" },
    { id: "evsahibi",  name: "Ev Sahibi",         emoji: "🏡", desc: "Bir ev satın al" },
    { id: "asirlik",   name: "Asırlık Çınar",     emoji: "🌳", desc: "100 yaşına ulaş" },
    { id: "doktor",    name: "Beyaz Önlük",       emoji: "🩺", desc: "Doktor ol" },
    { id: "sabikali",  name: "Firari",            emoji: "⛓️", desc: "Hapse gir" },
    { id: "dede",      name: "Emektar",           emoji: "👴", desc: "Emekli ol" },
  ],

  causesOfDeath: {
    health: ["kalp yetmezliği", "uzun süren bir hastalık", "ağır bir enfeksiyon"],
    old: ["yaşlılık — uykusunda huzur içinde", "doğal nedenler", "yorgun ama dolu dolu yaşanmış bir hayatın sonunda"],
  },
};
