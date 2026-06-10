// Hızlı duman testi: DOM'u taklit edip yüzlerce hayat simüle eder.
// Çalıştır: node test-sim.js

const fs = require("fs");

const elements = {};
function fakeEl(id) {
  if (!elements[id]) {
    elements[id] = {
      id, innerHTML: "", textContent: "", value: "İstanbul",
      style: {}, dataset: {},
      classList: { add() {}, remove() {}, contains: () => false },
      appendChild() {}, remove() {}, scrollTop: 0, scrollHeight: 0,
      querySelectorAll: () => [], onclick: null,
    };
  }
  return elements[id];
}

global.document = {
  getElementById: fakeEl,
  createElement: () => fakeEl("tmp" + Math.random()),
  querySelector: sel => ({ dataset: { val: sel.includes("diff") ? "normal" : "m" } }),
  querySelectorAll: () => [],
  addEventListener() {},
};
global.localStorage = { getItem: () => null, setItem() {}, removeItem() {} };
global.window = global;
const realSetTimeout = setTimeout;
global.setTimeout = fn => fn(); // olay zincirini senkron çalıştır

const gameCode = fs.readFileSync("./data.js", "utf8") + "\n" + fs.readFileSync("./game.js", "utf8");

const testCode = `
let deaths = 0, errors = 0, totalAge = 0;
const causes = {};

for (let life = 0; life < 100; life++) {
  try {
    birth();
    let guard = 0;
    while (S.alive && guard++ < 130) {
      ageUp();
      while (window.__event && S.alive) {
        const n = window.__event.choices.length;
        chooseEvent(Math.floor(Math.random() * n));
      }
      if (S.alive && S.edu.stage === "lise-mezun" && S.used.uniModal) {
        const ok = DATA.majors.filter(m => S.stats.smarts >= m.smarts);
        if (ok.length && Math.random() < .7) chooseMajor(ok[Math.floor(Math.random() * ok.length)].id);
        else skipUniversity();
      }
      if (S.alive && Math.random() < .5) {
        const acts = [
          () => S.age >= 18 && !S.job && S.edu.stage !== "uni" && applyJob(DATA.jobs[0].id),
          () => S.age >= 16 && !S.partner && findLove(),
          () => S.partner && dateNight(),
          () => S.partner && (S.partner.married || S.partner.rel >= 80) && S.age <= 50 && S.children.length < 4 && tryBaby(),
          () => S.partner && !S.partner.married && S.age >= 18 && S.money >= 50000 && propose(),
          () => S.age >= 16 && Math.random() < .1 && commitCrime("kapkac"),
          () => S.age >= 8 && doActivity("kosu"),
          () => S.money >= 20000 && doActivity("doktor"),
          () => S.age >= 10 && doActivity("medit"),
          () => S.money >= 20000 && S.age >= 18 && gamble(),
          () => S.job && workHard(),
          () => S.job && S.age >= 60 && retire(),
          () => S.money >= DATA.pets[0].price && buyPet("balik"),
          () => S.money >= DATA.cars[2].price && buyCar("eskiaraba"),
          () => S.money >= DATA.homes[0].price && buyHome("studyo"),
        ];
        for (let i = 0; i < 3; i++) acts[Math.floor(Math.random() * acts.length)]();
      }
    }
    if (!S.alive) {
      deaths++;
      totalAge += S.age;
      causes[S.deathCause] = (causes[S.deathCause] || 0) + 1;
    }
  } catch (e) {
    errors++;
    console.error("HATA (hayat " + life + ", yaş " + (S && S.age) + "):", e.message);
    if (errors > 3) break;
  }
}

console.log("\\n--- SONUÇ ---");
console.log("100 hayat simüle edildi · " + deaths + " ölüm · " + errors + " hata");
console.log("Ortalama ömür: " + (totalAge / Math.max(1, deaths)).toFixed(1) + " yıl");
console.log("Ölüm nedenleri:", causes);
if (errors) process.exitCode = 1;
`;

(0, eval)(gameCode + "\n" + testCode);
