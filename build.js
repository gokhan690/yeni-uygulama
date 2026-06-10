// Tek dosyalık sürüm üretir: CSS ve JS'i index.html içine gömer.
// Çalıştır: node build.js  →  hayat-yolu.html
const fs = require("fs");

let html = fs.readFileSync("index.html", "utf8");
html = html.replace('<link rel="stylesheet" href="style.css">', "<style>\n" + fs.readFileSync("style.css", "utf8") + "\n</style>");
html = html.replace('<script src="data.js"></script>', "<script>\n" + fs.readFileSync("data.js", "utf8") + "\n</script>");
html = html.replace('<script src="game.js"></script>', "<script>\n" + fs.readFileSync("game.js", "utf8") + "\n</script>");

fs.writeFileSync("hayat-yolu.html", html);
console.log("hayat-yolu.html oluşturuldu (" + (html.length / 1024).toFixed(0) + " KB)");
