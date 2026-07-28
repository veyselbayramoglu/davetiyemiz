# Zeyneb & Veysel Dijital Davetiye

Zeyneb ve Veysel'in kına gecesi ile nikâh töreni için hazırlanmış, mobil
öncelikli dijital davetiye sitesidir.

Canlı adres: https://davetiye.zeyneb.veyselbayramoglu.com.tr/

## Etkinlikler

- Kına gecesi: 21 Ağustos 2026 Cuma, 19.00
- Nikâh: 23 Ağustos 2026 Pazar, 15.30
- Nikâh ve kına için ayrı geri sayımlar
- Her iki mekân için Google Maps yol tarifi
- Davetlilerin fotoğraf yükleyebileceği anı paylaşım ekranı

23 Ağustos 2026 saat 16.00'dan itibaren program ve konum sayfalarının yerini
teşekkür sayfası alır. Fotoğraf paylaşım bölümü kullanılmaya devam eder.

## Özellikler

- Mühür dokunuşuyla açılan çift kanatlı kapak animasyonu
- Davetiye açıldıktan sonra başlayan arka plan müziği
- Kullanıcının müzik tercihini tarayıcıda saklama
- Sayfaya geri dönüldüğünde, kullanıcı kapatmadıysa müziği sürdürme
- Ekran ekran ilerleyen mobil uyumlu içerik
- İlk ziyarette kaydırma ipuçları
- Sosyal medya paylaşım önizlemesi
- Hareket azaltma tercihi için erişilebilirlik desteği

## Dosya yapısı

- `index.html`: Sayfa içeriği, etkinlik bilgileri ve dış bağlantılar
- `style.css`: Görsel tasarım, mobil uyumluluk ve animasyonlar
- `script.js`: Açılış, müzik, geri sayım, tarih sonrası görünüm ve geçişler
- `assets/`: Kapak, arka plan, mühür, önizleme görselleri ve müzik
- `CNAME`: GitHub Pages özel alan adı

## Yerel çalıştırma

Proje bağımlılık veya derleme adımı gerektirmeyen statik bir sitedir. Yerel bir
HTTP sunucusuyla proje dizinini yayınlayıp tarayıcıdan açmak yeterlidir.

Değişikliklerden sonra özellikle şu akışlar kontrol edilmelidir:

- Kapak ve mühür animasyonu
- Mobil kaydırma ve sayfa hizalama
- Müzik başlatma, durdurma ve sayfaya dönüş davranışı
- İki geri sayım
- Konum ve fotoğraf yükleme bağlantıları
- Küçük ekranlarda program, teşekkür ve fotoğraf sayfaları

## Güncelleme noktaları

- Etkinlik tarihleri ve geri sayımlar: `index.html` ve `script.js`
- Etkinlik sonrası geçiş zamanı: `script.js` içindeki `postEventDate`
- Konum ve fotoğraf yükleme bağlantıları: `index.html`
- Sosyal medya önizleme görseli: `index.html` ve `assets/preview.webp`
- Arka plan müziği: `assets/zv.mp3`

## Yayınlama

Site `main` dalından GitHub Pages ile yayınlanır. `CNAME` dosyası özel alan adı
ayarını korur. Yayına gönderilmeden önce çalışma ağacının ve değişikliklerin
kontrol edilmesi önerilir.
