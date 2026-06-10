// ============ HAYAT YOLU — Oyun Motoru ============

const SAVE_PREFIX = "hayatYolu_slot";
const SLOTS = 3;
let S = null; // oyun durumu

// localStorage engelliyse (gizli mod, kısıtlı görüntüleyici) bellekte tut
const MEM_STORE = {};
function storeGet(k) { try { return localStorage.getItem(k); } catch (e) { return MEM_STORE[k] || null; } }
function storeSet(k, v) { try { localStorage.setItem(k, v); } catch (e) { MEM_STORE[k] = v; } }
function storeDel(k) { try { localStorage.removeItem(k); } catch (e) { delete MEM_STORE[k]; } }

// ---------- Yardımcılar ----------
const $ = id => document.getElementById(id);
const rnd = (a, b) => Math.floor(Math.random() * (b - a + 1)) + a;
const pick = arr => arr[Math.floor(Math.random() * arr.length)];
const clamp = (v, a = 0, b = 100) => Math.max(a, Math.min(b, v));
const money = n => "₺" + Math.round(n).toLocaleString("tr-TR");
const chance = p => Math.random() < p;

function randomName(gender) {
  return pick(gender === "m" ? DATA.maleNames : DATA.femaleNames);
}

// ---------- Durum Oluşturma ----------
function newState(name, gender, city, difficulty) {
  const ranges = { easy: [50, 90], normal: [30, 80], hard: [15, 60] };
  const [lo, hi] = ranges[difficulty];
  const surname = pick(DATA.surnames);
  const motherAge = rnd(20, 38), fatherAge = rnd(22, 42);

  return {
    name: name || randomName(gender),
    surname, gender, city, difficulty,
    age: 0,
    stats: { health: rnd(lo + 10, hi + 10), happiness: rnd(lo, hi), smarts: rnd(lo, hi), looks: rnd(lo, hi) },
    money: 0,
    fame: 0,
    diseases: [],
    siblings: Array.from({ length: rnd(0, 2) }, () => {
      const g = chance(.5) ? "m" : "f";
      return { name: randomName(g), gender: g, age: rnd(1, 8), rel: rnd(55, 90), alive: true };
    }),
    slot: 0,
    trait: pick(DATA.traits),
    edu: { level: 0, stage: "yok", uniYearsLeft: 0, major: null, masterYearsLeft: 0 },
    job: null, jobYears: 0, performance: 50,
    partTime: null,
    retired: false, pension: 0,
    partner: null,
    parents: {
      mother: { name: randomName("f"), age: motherAge, rel: rnd(60, 95), alive: true },
      father: { name: randomName("m"), age: fatherAge, rel: rnd(50, 95), alive: true },
    },
    children: [],
    pets: [],
    cars: [], homes: [],
    prison: 0,
    karma: 0,
    alive: true,
    deathCause: null,
    achievements: [],
    used: {},          // bu yıl kullanılan aksiyonlar
    counters: { crimes: 0, vacations: 0, booksRead: 0, jobsHeld: 0 },
    log: [],
  };
}

// ---------- Günlük ----------
function log(text, cls = "", fx = null) {
  let html = text;
  if (fx) {
    const parts = [];
    const map = { health: "❤️", happiness: "😊", smarts: "🧠", looks: "✨" };
    for (const k in map) if (fx[k]) parts.push(`${map[k]} ${fx[k] > 0 ? "+" : ""}${fx[k]}`);
    if (fx.money) parts.push(`💰 ${fx.money > 0 ? "+" : ""}${money(fx.money)}`);
    if (parts.length) html += `<span class="fx">${parts.join("  ·  ")}</span>`;
  }
  S.log.push({ html, cls });
  if (S.log.length > 250) S.log.shift();
  appendLogEntry({ html, cls });
}

function appendLogEntry(e) {
  const el = document.createElement("div");
  el.className = "log-entry " + e.cls;
  el.innerHTML = e.html;
  $("ui-log").appendChild(el);
  $("ui-log").scrollTop = $("ui-log").scrollHeight;
}

function rebuildLog() {
  $("ui-log").innerHTML = "";
  S.log.forEach(appendLogEntry);
}

// ---------- Efekt Uygulama ----------
function applyFx(fx) {
  if (!fx) return;
  for (const k of ["health", "happiness", "smarts", "looks"]) {
    if (fx[k]) S.stats[k] = clamp(S.stats[k] + fx[k]);
  }
  if (fx.money) S.money = Math.max(0, S.money + fx.money);
}

// ---------- Başarımlar ----------
function unlock(id) {
  if (S.achievements.includes(id)) return;
  const a = DATA.achievements.find(x => x.id === id);
  if (!a) return;
  S.achievements.push(id);
  toast(`${a.emoji} Başarım: ${a.name}!`, "gold");
  log(`${a.emoji} <b>Başarım kazandın:</b> ${a.name} — ${a.desc}`, "good");
}

function checkAchievements() {
  if (S.money >= 1000000) unlock("milyoner");
  if (S.money >= 10000000) unlock("multimilyoner");
  if (S.age >= 100) unlock("asirlik");
  if (S.homes.length) unlock("evsahibi");
  if (S.job && (S.job.id === "doktor" || S.job.id === "cerrah")) unlock("doktor");
  if (S.fame >= 50) unlock("unlu");
  if (S.fame >= 90) unlock("efsane");
}

function toast(msg, cls = "") {
  const t = document.createElement("div");
  t.className = "toast " + cls;
  t.textContent = msg;
  $("toast-wrap").appendChild(t);
  setTimeout(() => t.remove(), 3000);
}

// ---------- Arayüz Güncelleme ----------
function avatarEmoji() {
  const m = S.gender === "m";
  if (S.age < 3) return "👶";
  if (S.age < 13) return m ? "👦" : "👧";
  if (S.age < 30) return m ? "🧑" : "👩";
  if (S.age < 55) return m ? "👨" : "👩‍🦰";
  if (S.age < 72) return m ? "👨‍🦳" : "👩‍🦳";
  return m ? "👴" : "👵";
}

function statusLine() {
  if (!S.alive) return "💀 Vefat etti";
  if (S.prison > 0) return `⛓️ Mahkum (${S.prison} yıl kaldı)`;
  if (S.retired) return "🌴 Emekli";
  if (S.job) return `${S.job.emoji} ${S.job.title}`;
  if (S.edu.stage === "uni") return `🎓 Üniversite — ${S.edu.major.name}`;
  if (S.edu.masterYearsLeft > 0) return "🎓 Yüksek Lisans";
  if (S.edu.stage !== "yok" && S.age < 18) return `📚 Öğrenci (${S.edu.stage})`;
  if (S.age < 6) return `${S.trait.emoji} ${S.trait.name} bir çocuk`;
  return "🪑 İşsiz";
}

function render() {
  $("ui-avatar").textContent = avatarEmoji();
  $("ui-age").textContent = S.age;
  $("ui-name").textContent = `${S.name} ${S.surname}`;
  $("ui-sub").textContent = `${statusLine()} · 📍${S.city}`;
  $("ui-money").textContent = money(S.money);
  for (const k of ["happiness", "health", "smarts", "looks"]) {
    $("bar-" + k).style.width = S.stats[k] + "%";
    $("val-" + k).textContent = Math.round(S.stats[k]);
  }
  $("row-fame").style.display = S.fame > 0 ? "" : "none";
  $("bar-fame").style.width = clamp(S.fame) + "%";
  $("val-fame").textContent = Math.round(S.fame);
}

// ---------- Modal Sistemi ----------
let modalLocked = false;

function openModal(title, bodyHTML, locked = false) {
  modalLocked = locked;
  $("modal-title").innerHTML = title;
  $("modal-body").innerHTML = bodyHTML;
  $("modal-close").style.display = locked ? "none" : "";
  $("overlay").classList.add("show");
}

function closeModal() {
  if (modalLocked) return;
  $("overlay").classList.remove("show");
}

function forceCloseModal() {
  modalLocked = false;
  $("overlay").classList.remove("show");
}

function optHTML(emoji, title, sub, right, onclick, disabled = false) {
  return `<button class="opt" ${disabled ? "disabled" : ""} onclick="${onclick}">
    <span class="opt-emoji">${emoji}</span>
    <span class="opt-text"><span class="opt-title">${title}</span>
    ${sub ? `<div class="opt-sub">${sub}</div>` : ""}</span>
    ${right ? `<span class="opt-right">${right}</span>` : ""}
  </button>`;
}

// ---------- Olay Motoru ----------
let pendingEvents = [];

function gatherEvents() {
  const out = [];
  for (const ev of DATA.events) {
    if (S.age < ev.min || S.age > ev.max) continue;
    if (ev.cond && !ev.cond(S)) continue;
    let p = ev.chance;
    if (S.trait.name === "Asi" && ev.choices) p *= 1.3;
    if (chance(p)) out.push(ev);
    if (out.length >= 2) break;
  }
  return out;
}

function processNextEvent() {
  const ev = pendingEvents.shift();
  if (!ev) { afterYear(); return; }
  const text = ev.text.replace("{anne}", S.gender === "m" ? "baba" : "anne");
  if (!ev.choices) {
    applyFx(ev.fx);
    log(text, (ev.fx && (ev.fx.health < 0 || ev.fx.happiness < 0 || ev.fx.money < 0)) ? "bad" : "good", ev.fx);
    processNextEvent();
    return;
  }
  // seçimli olay → kilitli modal
  window.__event = ev;
  const body = `<p class="modal-desc">${text}</p>` +
    ev.choices.map((c, i) => optHTML(c.emoji, c.label, "", "", `chooseEvent(${i})`)).join("");
  openModal("🎲 Bir şeyler oluyor...", body, true);
}

function chooseEvent(i) {
  const ev = window.__event;
  window.__event = null;
  const c = ev.choices[i];
  applyFx(c.fx);
  log(`<b>${ev.text.replace("{anne}", "anne")}</b><br>➜ ${c.label}: ${c.msg}`, "choice", c.fx);
  if (c.bonus) { applyFx(c.bonus); }
  if (c.karma) S.karma += c.karma;
  if (c.risk) {
    if (chance(c.risk.chance)) {
      applyFx(c.risk.fx);
      log(c.risk.msg, c.risk.fx && (c.risk.fx.money > 0 || c.risk.fx.happiness > 0) ? "good" : "bad", c.risk.fx);
    } else if (c.risk.failMsg) {
      applyFx(c.risk.failFx);
      log(c.risk.failMsg, "bad", c.risk.failFx);
    }
  }
  forceCloseModal();
  render();
  setTimeout(processNextEvent, 250);
}

// ---------- Yaş Alma ----------
function ageUp() {
  if (!S.alive) return;
  S.age++;
  S.used = {};
  log(`🎂 ${S.age} Yaşındasın`, "year");

  if (S.prison > 0) { prisonYear(); return; }

  educationYear();
  workYear();
  familyYear();
  diseasesYear();
  petsYear();
  expensesYear();
  statDrift();

  pendingEvents = gatherEvents();
  processNextEvent(); // bitince afterYear() çağrılır
}

function afterYear() {
  // eğitim dönüm noktaları (modal gerektirenler)
  if (S.edu.stage === "lise-mezun" && S.age >= 18 && !S.used.uniModal) {
    S.used.uniModal = true;
    showUniversityChoice();
    return;
  }
  finishYear();
}

function finishYear() {
  if (!checkDeath()) {
    checkAchievements();
    render();
    save();
  }
}

function prisonYear() {
  S.prison--;
  S.stats.happiness = clamp(S.stats.happiness - 8);
  S.stats.health = clamp(S.stats.health - 3);
  if (S.prison <= 0) {
    log("🔓 Cezanı çektin ve özgürlüğüne kavuştun! Temiz bir sayfa açma vakti.", "good");
  } else {
    log(`⛓️ Demir parmaklıklar ardında bir yıl daha geçti. (${S.prison} yıl kaldı)`, "bad");
  }
  finishYear();
}

// ---------- Eğitim ----------
function educationYear() {
  const e = S.edu;
  if (S.age === 6) { e.stage = "ilkokul"; log("🏫 İlkokula başladın! Sırt çantan senden büyük.", "good"); }
  if (S.age === 11) { e.stage = "ortaokul"; log("📘 Ortaokula geçtin.", "good"); }
  if (S.age === 14) { e.stage = "lise"; e.level = 1; log("📗 Liseye başladın. Hayat artık daha karmaşık.", "good"); }
  if (S.age === 18 && e.stage === "lise") {
    e.stage = "lise-mezun";
    const grade = S.stats.smarts >= 70 ? "takdirle" : S.stats.smarts >= 45 ? "başarıyla" : "zar zor";
    log(`🎉 Liseden ${grade} mezun oldun!`, "good", { happiness: 8 });
    S.stats.happiness = clamp(S.stats.happiness + 8);
  }
  // okul performansı zekayı besler
  if (["ilkokul", "ortaokul", "lise"].includes(e.stage)) {
    const gain = S.trait.name === "Meraklı" ? 3 : 2;
    S.stats.smarts = clamp(S.stats.smarts + gain);
  }
  // üniversite
  if (e.stage === "uni") {
    e.uniYearsLeft--;
    S.stats.smarts = clamp(S.stats.smarts + 3);
    if (e.uniYearsLeft <= 0) {
      e.stage = "uni-mezun";
      e.level = e.major.id === "tip" ? 3 : 2;
      log(`🎓 <b>${e.major.name}</b> bölümünden mezun oldun! Kepini havaya fırlattın!`, "good", { happiness: 15 });
      S.stats.happiness = clamp(S.stats.happiness + 15);
      unlock("uni");
    } else {
      log(`📖 Üniversitede bir yıl daha bitti. (${e.uniYearsLeft} yıl kaldı)`);
    }
  }
  if (e.masterYearsLeft > 0) {
    e.masterYearsLeft--;
    S.stats.smarts = clamp(S.stats.smarts + 4);
    if (e.masterYearsLeft <= 0) {
      e.level = 3;
      log("🎓 Yüksek lisansını tamamladın! Artık alanında uzmansın.", "good", { happiness: 10 });
      S.stats.happiness = clamp(S.stats.happiness + 10);
    }
  }
}

function showUniversityChoice() {
  const eligible = DATA.majors.filter(m => S.stats.smarts >= m.smarts);
  let body = `<p class="modal-desc">Liseden mezun oldun. Hayatının yol ayrımındasın — üniversite sınav sonuçların geldi. Zekan: <b>${Math.round(S.stats.smarts)}</b></p>`;
  body += `<div class="section-title">Kazandığın Bölümler</div>`;
  if (eligible.length) {
    body += eligible.map(m =>
      optHTML(m.emoji, m.name, `${m.years} yıl · min zeka ${m.smarts}`, "", `chooseMajor('${m.id}')`)
    ).join("");
  } else {
    body += `<p class="modal-desc">😔 Puanın hiçbir bölüme yetmedi. Belki de çalışma hayatı senin yolundur.</p>`;
  }
  body += `<div class="section-title">Diğer Yollar</div>`;
  body += optHTML("💼", "Çalışma hayatına atıl", "Kariyer sekmesinden iş başvurusu yap", "", "skipUniversity()");
  openModal("🎓 Üniversite Tercihi", body, true);
}

function chooseMajor(id) {
  const m = DATA.majors.find(x => x.id === id);
  S.edu.stage = "uni";
  S.edu.major = m;
  S.edu.uniYearsLeft = m.years;
  log(`🎓 <b>${m.name}</b> bölümünü kazandın! Üniversite hayatı başlıyor. (${m.years} yıl)`, "good");
  forceCloseModal();
  finishYear();
}

function skipUniversity() {
  S.edu.stage = "calisma";
  log("💼 Üniversiteye gitmemeyi seçtin. Hayat okulu seni bekliyor.");
  forceCloseModal();
  finishYear();
}

// ---------- İş ----------
function workYear() {
  if (S.retired) {
    S.money += S.pension;
    log(`🌴 Emekli maaşın yattı.`, "", { money: S.pension });
    return;
  }
  if (S.partTime) {
    S.money += S.partTime.salary;
    log(`${S.partTime.emoji} Ek işinden para kazandın.`, "", { money: S.partTime.salary });
    if (S.age > 24) { log("Ek işini bıraktın, artık tam zamanlı bir hayat lazım."); S.partTime = null; }
  }
  if (!S.job) return;

  // şöhret kariyeri: gelir üne bağlı, beslenmezse ün söner
  if (S.job.fameType) {
    S.jobYears++;
    const inc = fameIncome();
    S.money += inc;
    log(`${S.job.emoji} Şöhret gelirlerin (konser, telif, reklam) hesabına yattı.`, "", { money: inc });
    S.fame = clamp(S.fame - 2);
    return;
  }

  S.jobYears++;
  S.money += S.job.salary;
  log(`${S.job.emoji} Yıllık maaşını aldın.`, "", { money: S.job.salary });

  // performans ve zam/terfi
  S.performance = clamp(S.performance + rnd(-10, 12) + (S.stats.smarts > 60 ? 4 : 0));
  if (S.performance > 70 && chance(.3)) {
    const raise = Math.round(S.job.salary * (rnd(10, 20) / 100));
    S.job.salary += raise;
    log(`📈 Harika performansın sayesinde terfi aldın! Maaşına yıllık ${money(raise)} zam yapıldı.`, "good");
  } else if (S.performance < 25 && chance(.35)) {
    log(`🚪 Performansın çok düşüktü... <b>Kovuldun.</b>`, "bad", { happiness: -12 });
    S.stats.happiness = clamp(S.stats.happiness - 12);
    S.job = null; S.jobYears = 0; S.performance = 50;
  }
}

// ---------- Aile ----------
function familyYear() {
  // ebeveynler
  for (const key of ["mother", "father"]) {
    const p = S.parents[key];
    if (!p.alive) continue;
    p.age++;
    if (p.age > 70 && chance((p.age - 70) * 0.035)) {
      p.alive = false;
      const kim = key === "mother" ? "Annen" : "Baban";
      log(`🕊️ ${kim} ${p.name}, ${p.age} yaşında hayata gözlerini yumdu. Başın sağ olsun...`, "bad", { happiness: -18 });
      S.stats.happiness = clamp(S.stats.happiness - 18);
      // miras
      if (S.age >= 18 && chance(.7)) {
        const inh = rnd(50000, 800000);
        S.money += inh;
        log(`📜 Sana ${money(inh)} miras kaldı.`, "", { money: inh });
      }
    } else {
      p.rel = clamp(p.rel + rnd(-4, 2));
    }
  }
  // partner
  if (S.partner) {
    const pa = S.partner;
    pa.age++;
    pa.years++;
    pa.rel = clamp(pa.rel + rnd(-7, 4) + (S.trait.name === "Karizmatik" ? 2 : 0));
    if (pa.age > 72 && chance((pa.age - 70) * 0.035)) {
      log(`🕊️ ${pa.married ? "Eşin" : "Sevgilin"} ${pa.name} vefat etti. Dünyan başına yıkıldı.`, "bad", { happiness: -25 });
      S.stats.happiness = clamp(S.stats.happiness - 25);
      S.partner = null;
    } else if (pa.rel < 25 && chance(.4)) {
      log(`💔 ${pa.name} ilişkinize yeterince özen göstermediğini söyleyip ${pa.married ? "boşanma davası açtı" : "senden ayrıldı"}.`, "bad", { happiness: -15 });
      S.stats.happiness = clamp(S.stats.happiness - 15);
      if (pa.married) S.money = Math.round(S.money * 0.6);
      S.partner = null;
    }
  }
  // çocuklar
  for (const c of S.children) {
    c.age++;
    c.rel = clamp(c.rel + rnd(-3, 3));
    if (c.age === 18) log(`🧳 ${c.name} 18 yaşına bastı ve kendi hayatını kurmak için evden ayrıldı.`, "", { happiness: -3 });
  }
  // kardeşler
  if (S.age <= 8 && S.siblings.length < 3 && chance(.07) && S.parents.mother.alive) {
    const g = chance(.5) ? "m" : "f";
    const baby = { name: randomName(g), gender: g, age: 0, rel: 80, alive: true };
    S.siblings.push(baby);
    log(`👶 Bir ${g === "m" ? "erkek kardeşin" : "kız kardeşin"} oldu: <b>${baby.name}</b>!`, "good", { happiness: 6 });
    S.stats.happiness = clamp(S.stats.happiness + 6);
  }
  for (const k of S.siblings) {
    if (!k.alive) continue;
    k.age++;
    k.rel = clamp(k.rel + rnd(-3, 2));
    if (k.age > 70 && chance((k.age - 70) * 0.035)) {
      k.alive = false;
      log(`🕊️ Kardeşin ${k.name}, ${k.age} yaşında vefat etti. Çocukluğunuz gözünün önünden film şeridi gibi geçti...`, "bad", { happiness: -12 });
      S.stats.happiness = clamp(S.stats.happiness - 12);
    }
  }
}

// ---------- Hastalıklar ----------
function diseasesYear() {
  // mevcut hastalıklar her yıl hasar verir
  for (const d of S.diseases) {
    S.stats.health = clamp(S.stats.health - d.dmg);
    if (chance(.4)) log(`${d.emoji} ${d.name} seni yıpratıyor. Tedavi için hastaneye gitmelisin. (Aktiviteler → Hastane)`, "bad");
  }
  // yeni hastalık riski: yaş ve düşük sağlıkla artar
  let p = 0.01 + Math.max(0, S.age - 50) * 0.0035 + (S.stats.health < 40 ? 0.025 : 0);
  if (S.trait.name === "Dayanıklı") p *= 0.5;
  if (chance(p)) {
    const eligible = DATA.diseases.filter(d => S.age >= d.minAge && !S.diseases.some(x => x.id === d.id));
    if (eligible.length) {
      // hafif hastalıklar ağırlara göre 3 kat daha olası
      const weighted = eligible.flatMap(d => Array(d.surgery ? 1 : 3).fill(d));
      const d = { ...pick(weighted) };
      S.diseases.push(d);
      log(`${d.emoji} Doktorlar sana <b>${d.name}</b> teşhisi koydu. Tedavi olmazsan sağlığın her yıl kötüleşecek.`, "bad", { happiness: -10 });
      S.stats.happiness = clamp(S.stats.happiness - 10);
    }
  }
}

function petsYear() {
  for (let i = S.pets.length - 1; i >= 0; i--) {
    const pet = S.pets[i];
    pet.yearsLeft--;
    S.stats.happiness = clamp(S.stats.happiness + 2);
    if (pet.yearsLeft <= 0) {
      log(`🌈 Sevgili ${pet.type.name.toLowerCase()}in ${pet.name} gökkuşağı köprüsünden geçti...`, "bad", { happiness: -10 });
      S.stats.happiness = clamp(S.stats.happiness - 10);
      S.pets.splice(i, 1);
    }
  }
}

function expensesYear() {
  if (S.age < 19) return;
  let cost = S.homes.length ? 18000 : 42000; // kira ya da aidat/fatura
  cost += S.children.filter(c => c.age < 18).length * 18000;
  cost += S.cars.length * 8000;
  if (S.money >= cost) {
    S.money -= cost;
  } else {
    S.money = 0;
    S.stats.happiness = clamp(S.stats.happiness - 6);
    log("📉 Faturaları ödemekte zorlandın, ay sonunu zor getirdin.", "bad");
  }
}

function statDrift() {
  // yaşla doğal değişim: gençken vücut kendini yeniler, yaşlandıkça yıpranır
  if (S.age < 40) S.stats.health = clamp(S.stats.health + 1);
  if (S.age > 50) S.stats.health = clamp(S.stats.health - Math.floor((S.age - 45) / 15) - (S.trait.name === "Dayanıklı" ? 0 : 1));
  if (S.age > 35) S.stats.looks = clamp(S.stats.looks - 1);
  S.stats.happiness = clamp(S.stats.happiness + rnd(-3, 2) + (S.trait.name === "Sanatçı Ruhlu" ? 1 : 0) + (S.stats.happiness < 30 ? 2 : 0));
  // mutluluk çok düşükse sağlık etkilenir
  if (S.stats.happiness < 15) S.stats.health = clamp(S.stats.health - 2);
  // şöhret kariyerini bırakanın ünü hızla söner
  if (S.fame > 0 && !(S.job && S.job.fameType)) S.fame = clamp(S.fame - 3);
}

// ---------- Ölüm ----------
function checkDeath() {
  let cause = null;
  if (S.stats.health <= 0) {
    const worst = S.diseases.length ? S.diseases.reduce((a, b) => (a.dmg > b.dmg ? a : b)) : null;
    // ancak gerçekten ağır bir hastalık ölüm nedeni sayılır
    cause = worst && worst.dmg >= 6 ? worst.name.toLowerCase() : pick(DATA.causesOfDeath.health);
  }
  else if (S.age >= 60) {
    const frailty = (1.7 - S.stats.health / 100);
    const p = Math.pow(S.age - 55, 2) / 7000 * frailty;
    if (chance(p)) cause = pick(DATA.causesOfDeath.old);
  }
  if (!cause) return false;
  S.alive = false;
  S.deathCause = cause;
  save();
  showDeathScreen();
  return true;
}

function showDeathScreen() {
  $("screen-game").classList.remove("active");
  $("death-name").textContent = `${S.name} ${S.surname}`;
  $("death-years").textContent = `${new Date().getFullYear() - S.age} — ${new Date().getFullYear()} · ${S.age} yaşında`;
  $("death-cause").textContent = `Ölüm nedeni: ${S.deathCause}`;

  const kids = S.children.length;
  const ach = S.achievements.map(id => DATA.achievements.find(a => a.id === id)).filter(Boolean);
  let sum = "";
  sum += `💼 Son meslek: <b>${S.job ? S.job.title : (S.retired ? "Emekli" : "Yok")}</b><br>`;
  sum += `🎓 Eğitim: <b>${["Eğitimsiz", "Lise", "Üniversite", "Yüksek Lisans"][S.edu.level]}${S.edu.major ? " (" + S.edu.major.name + ")" : ""}</b><br>`;
  sum += `💰 Bıraktığın servet: <b>${money(S.money)}</b><br>`;
  sum += `💞 ${S.partner ? (S.partner.married ? "Evliydin: " + S.partner.name : "Sevgilin vardı: " + S.partner.name) : "Hayatını yalnız noktaladın"}<br>`;
  sum += `👶 Çocuk: <b>${kids}</b> · ⚖️ İşlenen suç: <b>${S.counters.crimes}</b><br>`;
  if (S.fame > 0) sum += `🌟 Ün: <b>${Math.round(S.fame)}/100</b> — adın bir süre daha anılacak<br>`;
  sum += `🏆 Başarımlar (${ach.length}/${DATA.achievements.length}): ${ach.map(a => a.emoji).join(" ") || "—"}`;
  $("death-summary").innerHTML = sum;
  $("screen-death").classList.add("active");
  storeDel(SAVE_PREFIX + S.slot);
}

// ====================================================
//                    PANELLER
// ====================================================
function guardPrison() {
  if (S.prison > 0) {
    openModal("⛓️ Hapistesin", `<p class="modal-desc">Demir parmaklıklar ardındayken bunu yapamazsın. Cezanın bitmesine <b>${S.prison} yıl</b> var.</p>`);
    return true;
  }
  return false;
}

function once(key) {
  if (S.used[key]) { toast("Bunu bu yıl zaten yaptın! Önce yaş al."); return false; }
  S.used[key] = true;
  return true;
}

// ---------- KARİYER ----------
function openCareer() {
  if (guardPrison()) return;
  let b = "";

  if (S.age < 14) {
    openModal("💼 Kariyer", `<p class="modal-desc">Henüz çalışmak için çok küçüksün. Okuluna odaklan! 🧒</p>`);
    return;
  }

  // mevcut iş
  if (S.job && S.job.fameType) {
    b += `<div class="section-title">Şöhret Kariyerin</div>`;
    b += `<p class="modal-desc">${S.job.emoji} <b>${S.job.title}</b> · Ün: ${Math.round(S.fame)}/100 · Yıllık gelir: ${money(fameIncome())}</p>`;
    b += optHTML(S.job.actionEmoji, S.job.action, `Ününü artırır — ${S.job.statName} ne kadar yüksekse şansın o kadar fazla`, "", "fameAction()");
    if (S.fame >= 40) b += optHTML("🎟️", "Turne / imza günü düzenle", "Hayranlarından ciddi para kazan", "", "fameTour()");
    b += optHTML("🚪", "Şöhret hayatını bırak", "Ünün zamanla sönecek", "", "quitJob()");
  } else if (S.job) {
    b += `<div class="section-title">Mevcut İşin</div>`;
    b += `<p class="modal-desc">${S.job.emoji} <b>${S.job.title}</b> — yıllık ${money(S.job.salary)} · ${S.jobYears} yıldır çalışıyorsun · Performans: ${Math.round(S.performance)}/100</p>`;
    b += optHTML("💪", "Sıkı çalış", "Performansını artırır, biraz yorar", "", "workHard()");
    b += optHTML("🙏", "Zam iste", "Patronla zam pazarlığı yap", "", "askRaise()");
    b += optHTML("🚪", "İstifa et", "", "", "quitJob()");
    if (S.age >= 60) b += optHTML("🌴", "Emekli ol", `Yıllık ${money(Math.round(S.job.salary * 0.55))} emekli maaşı`, "", "retire()");
  }

  // yüksek lisans
  if (S.edu.level === 2 && S.edu.masterYearsLeft === 0 && S.edu.stage === "uni-mezun") {
    b += `<div class="section-title">Eğitim</div>`;
    b += optHTML("🎓", "Yüksek lisans yap", "2 yıl sürer, üst düzey meslekler açılır", money(80000), "startMaster()", S.money < 80000);
  }

  // iş ilanları
  if (!S.job && !S.retired && S.age >= 18 && S.edu.stage !== "uni") {
    b += `<div class="section-title">İş İlanları</div>`;
    const myMajorJobs = S.edu.major ? DATA.majorJobs[S.edu.major.id] || [] : [];
    const list = DATA.jobs.filter(j => j.edu <= S.edu.level && (j.edu < 2 || myMajorJobs.includes(j.id)));
    if (list.length) {
      b += list.map(j => {
        const ok = S.stats.smarts >= j.smarts;
        return optHTML(j.emoji, j.title, ok ? `Gereken zeka: ${j.smarts} ✔️` : `Gereken zeka: ${j.smarts} (senin: ${Math.round(S.stats.smarts)})`, money(j.salary) + "/yıl", `applyJob('${j.id}')`, !ok);
      }).join("");
    } else {
      b += `<p class="modal-desc">Şu an başvurabileceğin ilan yok.</p>`;
    }
  }

  // ünlü olma yolu
  if (!S.job && !S.retired && S.age >= 16) {
    b += `<div class="section-title">🌟 Ünlü Olma Yolu</div>`;
    b += DATA.fameJobs.map(f =>
      optHTML(f.emoji, f.title, `Başarı şansı ${f.statName} ile artar · Ün yükseldikçe gelir katlanır`, "", `startFame('${f.id}')`)
    ).join("");
  }

  // ek iş (öğrenciler)
  if (S.age >= 14 && S.age <= 24 && !S.job && !S.partTime) {
    b += `<div class="section-title">Ek İşler</div>`;
    b += DATA.partTimeJobs.map(j =>
      optHTML(j.emoji, j.title, j.smarts ? `Gereken zeka: ${j.smarts}` : "Herkes yapabilir", money(j.salary) + "/yıl", `takePartTime('${j.id}')`, j.smarts ? S.stats.smarts < j.smarts : false)
    ).join("");
  }

  // suç
  if (S.age >= 16) {
    b += `<div class="section-title">🌑 Yeraltı Dünyası</div>`;
    b += DATA.crimes.map(c =>
      optHTML(c.emoji, c.name, `Yakalanma riski: %${Math.round(c.catchChance * 100)} · Ceza: ${c.jail} yıl`, `${money(c.gain[0])}+`, `commitCrime('${c.id}')`)
    ).join("");
  }

  openModal("💼 Kariyer", b || `<p class="modal-desc">Şimdilik burada yapacak bir şey yok.</p>`);
}

function applyJob(id) {
  if (!once("applyJob")) return;
  const j = DATA.jobs.find(x => x.id === id);
  const p = 0.6 + (S.stats.smarts - j.smarts) / 200 + (S.stats.looks > 60 ? 0.08 : 0);
  if (chance(p)) {
    S.job = { ...j };
    S.partTime = null;
    S.jobYears = 0; S.performance = 55;
    S.counters.jobsHeld++;
    log(`🎉 Mülakatı geçtin! Artık bir <b>${j.title}</b>sin. (${money(j.salary)}/yıl)`, "good", { happiness: 10 });
    S.stats.happiness = clamp(S.stats.happiness + 10);
  } else {
    log(`📩 ${j.title} başvurun reddedildi. "Size dönüş yapacağız" dediler ama yapmadılar.`, "bad", { happiness: -5 });
    S.stats.happiness = clamp(S.stats.happiness - 5);
  }
  closeModal(); render(); save();
}

function takePartTime(id) {
  const j = DATA.partTimeJobs.find(x => x.id === id);
  S.partTime = { ...j };
  log(`${j.emoji} Ek iş buldun: <b>${j.title}</b>. Harçlığını kendin kazanıyorsun artık.`, "good");
  closeModal(); render(); save();
}

function workHard() {
  if (!once("workHard")) return;
  S.performance = clamp(S.performance + rnd(8, 16));
  S.stats.health = clamp(S.stats.health - 3);
  log("💪 Bu yıl işine asıldın. Patronun gözünde yıldızın parladı.", "good", { health: -3 });
  closeModal(); render(); save();
}

function askRaise() {
  if (!once("askRaise")) return;
  if (chance(0.3 + S.performance / 250)) {
    const raise = Math.round(S.job.salary * (rnd(8, 18) / 100));
    S.job.salary += raise;
    log(`🤑 Zam pazarlığını kazandın! Maaşın yıllık ${money(raise)} arttı.`, "good", { happiness: 6 });
    S.stats.happiness = clamp(S.stats.happiness + 6);
  } else {
    log(`😤 Patron zam isteğini "bütçe yok" diyerek reddetti.`, "bad", { happiness: -4 });
    S.stats.happiness = clamp(S.stats.happiness - 4);
  }
  closeModal(); render(); save();
}

function quitJob() {
  log(`🚪 ${S.job.title} işinden istifa ettin. Yeni ufuklar seni bekliyor.`, "", { happiness: 3 });
  S.stats.happiness = clamp(S.stats.happiness + 3);
  S.job = null; S.jobYears = 0; S.performance = 50;
  closeModal(); render(); save();
}

function retire() {
  S.retired = true;
  S.pension = Math.round(S.job.salary * 0.55);
  log(`🌴 ${S.jobYears} yıllık ${S.job.title} kariyerinin ardından emekli oldun! Artık keyif zamanı.`, "good", { happiness: 12 });
  S.stats.happiness = clamp(S.stats.happiness + 12);
  S.job = null;
  unlock("dede");
  closeModal(); render(); save();
}

function startMaster() {
  S.money -= 80000;
  S.edu.masterYearsLeft = 2;
  log("🎓 Yüksek lisansa başladın. Önümüzdeki 2 yıl yoğun geçecek.", "good", { money: -80000 });
  closeModal(); render(); save();
}

// ---------- Şöhret ----------
function fameIncome() {
  return Math.round(S.job.base + S.fame * S.fame * 300);
}

function startFame(id) {
  const f = DATA.fameJobs.find(x => x.id === id);
  S.job = { ...f, fameType: true, salary: 0 };
  S.partTime = null;
  S.jobYears = 0;
  S.counters.jobsHeld++;
  log(`${f.emoji} <b>${f.title}</b> olma yoluna girdin! Şöhret merdivenini tırmanma vakti.`, "good", { happiness: 8 });
  S.stats.happiness = clamp(S.stats.happiness + 8);
  closeModal(); render(); save();
}

function fameAction() {
  if (!once("fameAction")) return;
  const f = S.job;
  if (chance(.45 + S.stats[f.stat] / 220)) {
    const gain = rnd(7, 16);
    S.fame = clamp(S.fame + gain);
    const bonus = rnd(2, 5) * 10000 + Math.round(S.fame) * 3000;
    S.money += bonus;
    log(`${f.actionEmoji} <b>${f.action}</b> hamlen ses getirdi! Ünün ${gain} puan arttı. 🌟`, "good", { money: bonus, happiness: 8 });
    S.stats.happiness = clamp(S.stats.happiness + 8);
  } else {
    S.fame = clamp(S.fame - 3);
    log(`${f.actionEmoji} ${f.action} denemen pek tutmadı... Eleştirmenler acımasızdı.`, "bad", { happiness: -5 });
    S.stats.happiness = clamp(S.stats.happiness - 5);
  }
  checkAchievements();
  closeModal(); render(); save();
}

function fameTour() {
  if (!once("fameTour")) return;
  const gain = Math.round(S.fame) * rnd(8, 15) * 1000;
  S.money += gain;
  S.stats.health = clamp(S.stats.health - 4);
  S.stats.happiness = clamp(S.stats.happiness + 6);
  log(`🎟️ Turneye çıktın! Salonlar doldu taştı, hayranların seni coşkuyla karşıladı.`, "good", { money: gain, happiness: 6, health: -4 });
  closeModal(); render(); save();
}

function commitCrime(id) {
  if (!once("crime_" + id)) return;
  const c = DATA.crimes.find(x => x.id === id);
  if (chance(c.catchChance)) {
    S.prison = c.jail;
    S.counters.crimes++;
    if (S.job) { S.job = null; S.jobYears = 0; }
    log(`🚔 ${c.name} girişimin sırasında <b>yakalandın!</b> ${c.jail} yıl hapis cezası aldın.`, "bad", { happiness: -15 });
    S.stats.happiness = clamp(S.stats.happiness - 15);
    unlock("sabikali");
  } else {
    const gain = rnd(c.gain[0], c.gain[1]);
    S.money += gain;
    S.counters.crimes++;
    S.karma -= 2;
    log(`${c.emoji} ${c.name} işini temiz hallettin ve paçayı kurtardın...`, "choice", { money: gain });
  }
  closeModal(); render(); save();
}

// ---------- İLİŞKİLER ----------
function openRelations() {
  if (guardPrison()) return;
  let b = "";

  // ebeveynler
  b += `<div class="section-title">Ailen</div>`;
  for (const key of ["mother", "father"]) {
    const p = S.parents[key];
    const kim = key === "mother" ? "👩 Annen" : "👨 Baban";
    if (p.alive) {
      b += optHTML(key === "mother" ? "👩" : "👨", `${kim} — ${p.name}`, `${p.age} yaşında · İlişki: ${Math.round(p.rel)}/100`, "", `spendTimeParent('${key}')`);
    } else {
      b += `<p class="modal-desc">🕊️ ${kim} ${p.name} vefat etti.</p>`;
    }
  }

  // kardeşler
  if (S.siblings.some(k => k.alive)) {
    b += `<div class="section-title">Kardeşlerin</div>`;
    b += S.siblings.map((k, i) => {
      if (!k.alive) return "";
      const em = k.age < 13 ? (k.gender === "m" ? "👦" : "👧") : (k.gender === "m" ? "🧑" : "👩");
      return optHTML(em, k.name, `${k.age} yaşında · İlişki: ${Math.round(k.rel)}/100`, "", `spendTimeSibling(${i})`);
    }).join("");
  }

  // partner
  b += `<div class="section-title">Aşk Hayatı</div>`;
  if (S.partner) {
    const pa = S.partner;
    b += `<p class="modal-desc">${pa.married ? "💍 Eşin" : "❤️ Sevgilin"}: <b>${pa.name}</b>, ${pa.age} yaşında · ${pa.years} yıldır birliktesiniz · İlişki: ${Math.round(pa.rel)}/100</p>`;
    b += optHTML("🌹", "Vakit geçir", "İlişkinizi güçlendirir", "", "dateNight()");
    b += optHTML("🎁", "Hediye al", "Pahalı ama etkili", money(10000), "giveGift()", S.money < 10000);
    if (!pa.married && S.age >= 18) b += optHTML("💍", "Evlenme teklif et", pa.rel >= 65 ? "Kabul edebilir..." : "İlişkiniz henüz zayıf, riskli!", money(50000), "propose()", S.money < 50000);
    if (pa.married || pa.rel >= 80) b += optHTML("👶", "Bebek yapmayı dene", S.children.length >= 4 ? "Yeterince çocuğun var!" : "", "", "tryBaby()", S.children.length >= 4 || S.age > 50);
    b += optHTML("💔", pa.married ? "Boşan" : "Ayrıl", pa.married ? "Servetinin yarısı gider!" : "", "", "breakup()");
  } else if (S.age >= 16) {
    b += optHTML("💘", "Biriyle tanış", "Belki de hayatının aşkı...", "", "findLove()");
  } else {
    b += `<p class="modal-desc">Aşk için henüz çok erken. 🍼</p>`;
  }

  // çocuklar
  if (S.children.length) {
    b += `<div class="section-title">Çocukların</div>`;
    b += S.children.map((c, i) =>
      optHTML(c.age < 13 ? (c.gender === "m" ? "👦" : "👧") : (c.gender === "m" ? "🧑" : "👩"), c.name, `${c.age} yaşında · İlişki: ${Math.round(c.rel)}/100`, "", `spendTimeChild(${i})`)
    ).join("");
  }

  openModal("💞 İlişkiler", b);
}

function spendTimeParent(key) {
  if (!once("parent_" + key)) return;
  const p = S.parents[key];
  p.rel = clamp(p.rel + rnd(6, 12));
  S.stats.happiness = clamp(S.stats.happiness + 5);
  log(`☕ ${key === "mother" ? "Annenle" : "Babanla"} güzel vakit geçirdin.`, "good", { happiness: 5 });
  closeModal(); render(); save();
}

function findLove() {
  if (!once("findLove")) return;
  const luck = 0.5 + (S.stats.looks / 250) + (S.trait.name === "Karizmatik" ? 0.15 : 0);
  if (chance(luck)) {
    const g = S.gender === "m" ? "f" : "m";
    S.partner = { name: randomName(g) + " " + pick(DATA.surnames), gender: g, age: S.age + rnd(-3, 3), rel: rnd(50, 70), years: 0, married: false };
    log(`💘 ${S.partner.name} ile tanıştın ve aranızda kıvılcımlar uçuştu! Çıkmaya başladınız.`, "good", { happiness: 12 });
    S.stats.happiness = clamp(S.stats.happiness + 12);
  } else {
    log("😅 Birileriyle tanışmaya çalıştın ama kimseyle elektrik tutmadı.", "bad", { happiness: -3 });
    S.stats.happiness = clamp(S.stats.happiness - 3);
  }
  closeModal(); render(); save();
}

function dateNight() {
  if (!once("dateNight")) return;
  S.partner.rel = clamp(S.partner.rel + rnd(7, 14));
  S.stats.happiness = clamp(S.stats.happiness + 6);
  log(`🌹 ${S.partner.name} ile unutulmaz bir akşam geçirdiniz.`, "good", { happiness: 6 });
  closeModal(); render(); save();
}

function giveGift() {
  if (!once("giveGift")) return;
  S.money -= 10000;
  S.partner.rel = clamp(S.partner.rel + rnd(10, 18));
  log(`🎁 ${S.partner.name}'e güzel bir hediye aldın. Gözleri parladı!`, "good", { money: -10000 });
  closeModal(); render(); save();
}

function propose() {
  if (!once("propose")) return;
  S.money -= 50000;
  if (chance(S.partner.rel / 100)) {
    S.partner.married = true;
    log(`💍 Diz çöktün... ve <b>${S.partner.name} EVET dedi!</b> Muhteşem bir düğünle evlendiniz! 🎊`, "good", { happiness: 20, money: -50000 });
    S.stats.happiness = clamp(S.stats.happiness + 20);
    unlock("evlilik");
  } else {
    log(`💔 ${S.partner.name} teklifini reddetti... Yüzük elinde kaldı.`, "bad", { happiness: -15, money: -50000 });
    S.stats.happiness = clamp(S.stats.happiness - 15);
    S.partner.rel = clamp(S.partner.rel - 15);
  }
  closeModal(); render(); save();
}

function tryBaby() {
  if (!once("tryBaby")) return;
  if (chance(0.75)) {
    const g = chance(.5) ? "m" : "f";
    const c = { name: randomName(g), gender: g, age: 0, rel: 90 };
    S.children.push(c);
    log(`👶 Bir ${g === "m" ? "oğlun" : "kızın"} oldu: <b>${c.name}</b>! Hayatının en mutlu günlerinden biri.`, "good", { happiness: 18 });
    S.stats.happiness = clamp(S.stats.happiness + 18);
    unlock("ebeveyn");
  } else {
    log("👶 Bebek denemeniz bu yıl sonuçsuz kaldı. Belki seneye...", "", { happiness: -2 });
  }
  closeModal(); render(); save();
}

function breakup() {
  const pa = S.partner;
  if (pa.married) {
    S.money = Math.round(S.money * 0.5);
    log(`⚖️ ${pa.name}'den boşandın. Avukatlar ve nafaka servetinin yarısını götürdü.`, "bad", { happiness: -12 });
  } else {
    log(`💔 ${pa.name}'den ayrıldın.`, "bad", { happiness: -8 });
  }
  S.stats.happiness = clamp(S.stats.happiness - (pa.married ? 12 : 8));
  S.partner = null;
  closeModal(); render(); save();
}

function spendTimeSibling(i) {
  if (!once("sibling_" + i)) return;
  const k = S.siblings[i];
  k.rel = clamp(k.rel + rnd(6, 12));
  S.stats.happiness = clamp(S.stats.happiness + 5);
  log(`🤗 Kardeşin ${k.name} ile güzel vakit geçirdin.`, "good", { happiness: 5 });
  closeModal(); render(); save();
}

function spendTimeChild(i) {
  if (!once("child_" + i)) return;
  const c = S.children[i];
  c.rel = clamp(c.rel + rnd(6, 12));
  S.stats.happiness = clamp(S.stats.happiness + 6);
  log(`🧸 ${c.name} ile harika vakit geçirdin.`, "good", { happiness: 6 });
  closeModal(); render(); save();
}

// ---------- AKTİVİTELER ----------
const ACTIVITIES = [
  { id: "kosu",   emoji: "🏃", name: "Koşuya çık",        sub: "Ücretsiz kardiyo",            min: 8,  cost: 0,      fx: { health: 5, happiness: 2 } },
  { id: "spor",   emoji: "🏋️", name: "Spor salonu",       sub: "Form tut",                    min: 14, cost: 5000,   fx: { health: 9, looks: 3 } },
  { id: "kitap",  emoji: "📖", name: "Kitap oku",         sub: "Zihnini geliştir",            min: 6,  cost: 0,      fx: { smarts: 5, happiness: 2 } },
  { id: "kurs",   emoji: "🧑‍🏫", name: "Kişisel gelişim kursu", sub: "Yoğun eğitim programı", min: 16, cost: 15000,  fx: { smarts: 9 } },
  { id: "doktor", emoji: "🩺", name: "Doktor kontrolü",   sub: "Check-up yaptır",             min: 0,  cost: 20000,  fx: { health: 14 } },
  { id: "kuafor", emoji: "💇", name: "Kuaför / bakım",    sub: "Kendine çeki düzen ver",      min: 12, cost: 6000,   fx: { looks: 7, happiness: 3 } },
  { id: "medit",  emoji: "🧘", name: "Meditasyon",        sub: "İç huzur",                    min: 10, cost: 0,      fx: { happiness: 6, health: 2 } },
  { id: "tatil",  emoji: "🏝️", name: "Tatile çık",        sub: "Deniz, kum, güneş",           min: 18, cost: 60000,  fx: { happiness: 16, health: 5 } },
  { id: "klup",   emoji: "🪩", name: "Gece kulübü",       sub: "Sabaha kadar eğlence",        min: 18, cost: 10000,  fx: { happiness: 9, health: -4 } },
  { id: "estetik",emoji: "💉", name: "Estetik operasyon", sub: "%15 ihtimalle kötü gider!",   min: 25, cost: 200000, fx: { looks: 20 }, risk: true },
];

function openActivities() {
  if (guardPrison()) return;
  let b = "";
  // hastane: mevcut hastalıkların tedavisi
  if (S.diseases.length) {
    b += `<div class="section-title">🏥 Hastane — Hastalıkların</div>`;
    b += S.diseases.map(d =>
      optHTML(d.emoji, (d.surgery ? "Ameliyat ol: " : "Tedavi gör: ") + d.name,
        `İyileşme şansı: %${Math.round(d.cure * 100)}${d.surgery ? " · riskli operasyon" : ""} · Yıllık hasar: -${d.dmg} sağlık`,
        money(d.cost), `treatDisease('${d.id}')`, S.money < d.cost)
    ).join("");
  }
  b += `<div class="section-title">Kendine Zaman Ayır</div>`;
  const acts = ACTIVITIES.filter(a => S.age >= a.min);
  b += acts.map(a =>
    optHTML(a.emoji, a.name, a.sub, a.cost ? money(a.cost) : "Ücretsiz", `doActivity('${a.id}')`, S.money < a.cost)
  ).join("");
  if (S.age >= 18) {
    b += `<div class="section-title">Kumar</div>`;
    b += optHTML("🎰", "Kumarhaneye git", "₺20.000 bas — %45 ihtimalle ikiye katla", money(20000), "gamble()", S.money < 20000);
  }
  openModal("🎯 Aktiviteler", b);
}

function doActivity(id) {
  const a = ACTIVITIES.find(x => x.id === id);
  if (!once("act_" + id)) return;
  S.money -= a.cost;
  if (a.risk && chance(0.15)) {
    S.stats.looks = clamp(S.stats.looks - 15);
    S.stats.health = clamp(S.stats.health - 8);
    log(`💉 Estetik operasyon <b>kötü gitti!</b> Aynaya bakamıyorsun...`, "bad", { looks: -15, health: -8, money: -a.cost });
  } else {
    applyFx(a.fx);
    log(`${a.emoji} ${a.name}: iyi geldi.`, "good", { ...a.fx, money: a.cost ? -a.cost : 0 });
  }
  closeModal(); render(); save();
}

function treatDisease(id) {
  if (!once("treat_" + id)) return;
  const i = S.diseases.findIndex(d => d.id === id);
  const d = S.diseases[i];
  S.money -= d.cost;
  if (chance(d.cure)) {
    S.diseases.splice(i, 1);
    S.stats.happiness = clamp(S.stats.happiness + 12);
    S.stats.health = clamp(S.stats.health + 10);
    log(`${d.emoji} ${d.surgery ? "Ameliyat başarılı geçti" : "Tedavi işe yaradı"} — <b>${d.name} hastalığını yendin!</b> 🎉`, "good", { happiness: 12, health: 10, money: -d.cost });
    if (d.surgery) unlock("savasci");
  } else {
    const dmg = d.surgery ? 10 : 3;
    S.stats.health = clamp(S.stats.health - dmg);
    log(`${d.emoji} ${d.surgery ? "Ameliyatta komplikasyon çıktı" : "Tedavi bu sefer işe yaramadı"}. Gelecek yıl tekrar deneyebilirsin.`, "bad", { health: -dmg, money: -d.cost });
  }
  closeModal(); render(); save();
}

function gamble() {
  if (!once("gamble")) return;
  S.money -= 20000;
  if (chance(0.45)) {
    S.money += 40000;
    log("🎰 Kazandın! Paranı ikiye katladın!", "good", { money: 20000, happiness: 8 });
    S.stats.happiness = clamp(S.stats.happiness + 8);
  } else {
    log("🎰 Kaybettin. Kasa her zaman kazanır...", "bad", { money: -20000, happiness: -6 });
    S.stats.happiness = clamp(S.stats.happiness - 6);
  }
  closeModal(); render(); save();
}

// ---------- VARLIKLAR ----------
function openAssets() {
  if (guardPrison()) return;
  let b = "";

  if (S.cars.length || S.homes.length || S.pets.length) {
    b += `<div class="section-title">Sahip Oldukların</div>`;
    b += S.homes.map(h => `<p class="modal-desc">${h.emoji} ${h.name}</p>`).join("");
    b += S.cars.map(c => `<p class="modal-desc">${c.emoji} ${c.name}</p>`).join("");
    b += S.pets.map(p => `<p class="modal-desc">${p.type.emoji} ${p.name} (${p.type.name})</p>`).join("");
  }

  if (S.age >= 18) {
    b += `<div class="section-title">🚗 Araçlar</div>`;
    b += DATA.cars.filter(c => !S.cars.some(x => x.id === c.id)).map(c =>
      optHTML(c.emoji, c.name, `+${c.happiness} mutluluk`, money(c.price), `buyCar('${c.id}')`, S.money < c.price)
    ).join("");
    b += `<div class="section-title">🏠 Emlak</div>`;
    b += DATA.homes.filter(h => !S.homes.some(x => x.id === h.id)).map(h =>
      optHTML(h.emoji, h.name, `+${h.happiness} mutluluk · kira derdine son`, money(h.price), `buyHome('${h.id}')`, S.money < h.price)
    ).join("");
  }
  b += `<div class="section-title">🐾 Evcil Hayvanlar</div>`;
  b += DATA.pets.map(p =>
    optHTML(p.emoji, p.name, `+${p.happiness} mutluluk · ~${p.life} yıl yaşar`, money(p.price), `buyPet('${p.id}')`, S.money < p.price || S.pets.length >= 3)
  ).join("");

  openModal("🏠 Varlıklar", b);
}

function buyCar(id) {
  const c = DATA.cars.find(x => x.id === id);
  S.money -= c.price;
  S.cars.push(c);
  S.stats.happiness = clamp(S.stats.happiness + c.happiness);
  log(`${c.emoji} Kendine bir <b>${c.name}</b> aldın!`, "good", { money: -c.price, happiness: c.happiness });
  closeModal(); render(); save();
}

function buyHome(id) {
  const h = DATA.homes.find(x => x.id === id);
  S.money -= h.price;
  S.homes.push(h);
  S.stats.happiness = clamp(S.stats.happiness + h.happiness);
  log(`${h.emoji} Tebrikler! Artık bir <b>${h.name}</b> sahibisin!`, "good", { money: -h.price, happiness: h.happiness });
  unlock("evsahibi");
  closeModal(); render(); save();
}

function buyPet(id) {
  const p = DATA.pets.find(x => x.id === id);
  S.money -= p.price;
  const name = pick(["Boncuk", "Paşa", "Duman", "Karamel", "Zeytin", "Fıstık", "Limon", "Pamuk", "Çakıl", "Mırnav"]);
  S.pets.push({ name, type: p, yearsLeft: p.life + rnd(-2, 2) });
  S.stats.happiness = clamp(S.stats.happiness + p.happiness);
  log(`${p.emoji} Ailene yeni bir üye katıldı: <b>${name}</b>!`, "good", { money: -p.price, happiness: p.happiness });
  closeModal(); render(); save();
}

// ---------- KAYIT (3 slot) ----------
function save() {
  if (!S || !S.alive) return;
  storeSet(SAVE_PREFIX + S.slot, JSON.stringify(S));
}

function slotInfo(i) {
  try {
    const raw = storeGet(SAVE_PREFIX + i);
    if (!raw) return null;
    const s = JSON.parse(raw);
    return s && s.alive ? s : null;
  } catch (e) { return null; }
}

function refreshSlots() {
  let html = "";
  for (let i = 0; i < SLOTS; i++) {
    const s = slotInfo(i);
    if (!s) continue;
    const job = s.job ? s.job.title : (s.retired ? "Emekli" : s.age < 18 ? "Öğrenci" : "İşsiz");
    html += `<div class="slot-row">
      <button class="slot-load" onclick="continueSlot(${i})">💾 <b>${s.name} ${s.surname}</b><br><small>${s.age} yaş · ${job} · ${money(s.money)}</small></button>
      <button class="slot-del" onclick="deleteSlot(${i})" title="Sil">🗑</button>
    </div>`;
  }
  $("slot-list").innerHTML = html;
  $("slots-group").style.display = html ? "" : "none";
}

function continueSlot(i) {
  const s = slotInfo(i);
  if (s) startGame(s);
}

function deleteSlot(i) {
  storeDel(SAVE_PREFIX + i);
  refreshSlots();
}

// ---------- BAŞLATMA ----------
function startGame(state) {
  S = state;
  $("screen-create").classList.remove("active");
  $("screen-death").classList.remove("active");
  $("screen-game").classList.add("active");
  rebuildLog();
  render();
}

function birth() {
  // boş kayıt yeri bul
  let slot = -1;
  for (let i = 0; i < SLOTS; i++) if (!slotInfo(i)) { slot = i; break; }
  if (slot === -1) {
    toast("Tüm kayıt yerleri dolu! Önce bir hayatı sil. 🗑");
    return;
  }

  const name = $("inp-name").value.trim();
  const gender = document.querySelector("#seg-gender button.active").dataset.val;
  const city = $("inp-city").value;
  const diff = document.querySelector("#seg-diff button.active").dataset.val;

  const s = newState(name, gender, city, diff);
  s.slot = slot;
  startGame(s);
  log(`👼 <b>${s.name} ${s.surname}</b>, ${s.city}'${["a","e","ı","i","o","ö","u","ü"].some(v => s.city.toLowerCase().endsWith(v)) ? "de" : "da"} dünyaya geldi!`, "year");
  log(`Annen ${s.parents.mother.name} ve baban ${s.parents.father.name} sana sevgiyle bakıyor. 🍼`);
  if (s.siblings.length) log(`${s.siblings.length === 1 ? "Bir" : s.siblings.length === 2 ? "İki" : "Üç"} kardeşin var: ${s.siblings.map(k => k.name).join(", ")}. 👧👦`);
  log(`${s.trait.emoji} Doğuştan <b>${s.trait.name}</b> birisin: ${s.trait.desc}`);
  save();
}

function init() {
  // şehir listesi
  $("inp-city").innerHTML = DATA.cities.map(c => `<option>${c}</option>`).join("");

  // segment butonları
  document.querySelectorAll(".seg").forEach(seg => {
    seg.querySelectorAll("button").forEach(btn => {
      btn.onclick = () => {
        seg.querySelectorAll("button").forEach(b => b.classList.remove("active"));
        btn.classList.add("active");
      };
    });
  });

  $("btn-start").onclick = birth;
  $("btn-age").onclick = ageUp;
  $("modal-close").onclick = closeModal;
  $("overlay").onclick = e => { if (e.target === $("overlay")) closeModal(); };

  document.querySelectorAll(".tab-btn").forEach(btn => {
    btn.onclick = () => {
      const p = btn.dataset.panel;
      if (p === "career") openCareer();
      else if (p === "relations") openRelations();
      else if (p === "activities") openActivities();
      else if (p === "assets") openAssets();
    };
  });

  $("btn-rebirth").onclick = () => {
    $("screen-death").classList.remove("active");
    $("screen-create").classList.add("active");
    refreshSlots();
  };

  // kayıtlı hayatları listele
  refreshSlots();

  // klavye kısayolu: boşluk = yaş al
  document.addEventListener("keydown", e => {
    if (e.code === "Space" && $("screen-game").classList.contains("active") && !$("overlay").classList.contains("show")) {
      e.preventDefault();
      ageUp();
    }
  });
}

init();
