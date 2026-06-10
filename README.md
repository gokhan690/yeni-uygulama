# 🌱 Hayat Yolu — Yaşam Simülasyonu

BitLife tarzı ama daha gerçekçi, daha derin ve daha şık bir **hayat simülasyonu oyunu**. Tamamen Türkçe, kurulum gerektirmez, tarayıcıda çalışır.

## 🎮 Nasıl Oynanır?

`index.html` dosyasını herhangi bir tarayıcıda aç — hepsi bu! İnternet bağlantısı bile gerekmez.

> İpucu: **Boşluk tuşu** ile hızlıca yaş alabilirsin.

## ✨ Özellikler

- **Karakter oluşturma** — isim, cinsiyet, doğum şehri ve 3 zorluk seviyesi
- **Doğuştan gelen kişilik özellikleri** — Meraklı, Karizmatik, Dayanıklı, Asi... her biri oyunu farklı etkiler
- **Gerçekçi eğitim sistemi** — ilkokuldan üniversiteye, 8 farklı bölüm, yüksek lisans; zekan hangi bölümü kazanacağını belirler
- **20 meslek** — garsonluktan beyin cerrahlığına; mülakatlar, terfiler, zam pazarlığı, kovulma ve emeklilik
- **İlişkiler** — flört, evlilik teklifi (reddedilebilirsin!), düğün, çocuklar, boşanma ve nafaka
- **Aile** — ebeveynlerinle ilişkini güçlendir, miras kalabilir; çocukların büyüyüp evden ayrılır
- **Varlıklar** — bisikletten lüks spor arabaya, stüdyo daireden deniz manzaralı villaya; evcil hayvanlar (onlar da yaşlanır 🌈)
- **Yeraltı dünyası** — kapkaççılıktan banka soygununa; yakalanırsan hapse girersin
- **30+ rastgele hayat olayı** — bazıları seçim ister ve sonuçları yıllarca peşini bırakmaz
- **Gerçekçi yaşlanma** — gençken vücudun kendini yeniler, 50'den sonra sağlığına dikkat etmen gerekir; mutsuzluk sağlığını yer
- **10 başarım**, ölüm ekranında hayat özeti ve **otomatik kayıt** (kapatıp devam edebilirsin)

## 🧪 Test

Oyun mantığı başsız (headless) simülasyonla test edilebilir:

```bash
node test-sim.js
```

100 hayat simüle eder; hata olup olmadığını, ortalama ömrü ve ölüm nedenlerini raporlar.

## 🛠️ Teknoloji

Saf HTML + CSS + JavaScript. Hiçbir bağımlılık, derleme adımı veya sunucu yok.

| Dosya | Görev |
|---|---|
| `index.html` | Arayüz iskeleti (4 ekran: oluşturma, oyun, modal, ölüm) |
| `style.css` | Glassmorphism tasarım, animasyonlar, mobil uyumlu |
| `data.js` | Meslekler, bölümler, olaylar, varlıklar, başarımlar |
| `game.js` | Oyun motoru: yaş alma, olay zinciri, ekonomi, kayıt |
