# Botta Bloom

[English](README.md) | Türkçe

Adana Cemalpaşa'daki butik kafe **Botta Bloom** için tasarladığım ve geliştirdiğim web sitesi: kaydırmayla canlanan bir vitrin, Google ile girişli sadakat kartı, kupon sistemi ve teknik bilgi gerektirmeden kullanılan bir yönetim paneli.

**Canlı demo:** https://botta-bloom.web.app

> Bu çalışma Botta Bloom için hazırlanmış bir tasarım önerisidir. Marka adı, menü içeriği ve görseller ilgili işletmeye aittir.

## Fikir

Kafenin kimliği üç şeyin birleşimi: kahve, mutfak ve çiçek. Siteyi de bu üçlünün her biri bir "sahne" olacak şekilde kurguladım. Ziyaretçi kaydırdıkça fincanın içinde çiçekler açıyor, mini burger katlarına ayrılıyor, soğuk içecekler sahneye giriyor. Sayfanın sonunda ise ziyaretçinin kendi çiçeğini dikebildiği küçük bir bahçe var.

Amaç, sıradan bir menü sayfası yerine kafenin atmosferini hissettiren ve aynı zamanda gerçekten işe yarayan bir site yapmaktı: müşteri menüye bakar, etkinlikleri görür, damga biriktirir; kafe sahibi her şeyi kendi başına günceller.

## Özellikler

**Ziyaretçi tarafı**
- Kaydırmaya bağlı animasyonlu ana sayfa: çiçek açan fincan, katlarına ayrılan burger, sırayla öne çıkan içecek bardakları
- Fincana tıklayınca yaprak saçılan, göz kırpan ve imleci takip eden hero
- Kategorili, aranabilir menü
- Etkinlikler sayfası (yaklaşan ve geçmiş)
- Alt kısımda etkileşimli çiçek bahçesi: boş yere dokununca yeni çiçek açıyor, çiçekler imlece doğru eğiliyor
- Şu an açık mı / kapalı mı bilgisini saatten hesaplayan alt bilgi, adres ve telefon için tek dokunuşla kopyalama

**Sadakat sistemi**
- Google ile giriş (Firebase Authentication)
- Üyeye özel kod, her ziyarette damga, hedefe ulaşınca ödül
- Kampanya bazlı kuponlar: üye "kuponu al" der, kasada kod ile kullanıldı işaretlenir
- Instagram uygulama içi tarayıcısında Google girişi çalışmadığı için, bu durumda kullanıcıya uyarı gösteriliyor

**Yönetim paneli**
- Menü: kategori ve ürün ekleme, düzenleme, fotoğraf yükleme
- Kampanyalar, etkinlikler, site ayarları (adres, saat, telefon, bağlantılar)
- Kasa ekranı: üyeyi koddan, adından veya e-postasından bul, damga ekle, ödül ver, kuponu kullanıldı işaretle
- Yalnızca yönetici listesinde olan hesaplar girebiliyor; diğerleri ana sayfaya yönlendiriliyor

## Teknik tercihler

| Alan | Seçim |
| --- | --- |
| Arayüz | React 19, TypeScript, Vite |
| Yönlendirme | React Router |
| Animasyon | GSAP + ScrollTrigger, SVG çizimleri |
| Kimlik doğrulama | Firebase Authentication (Google) |
| Veritabanı | Cloud Firestore |
| Fotoğraf barındırma | Cloudinary (unsigned upload, otomatik WebP/AVIF) |
| Yayın | Firebase Hosting |

**Neden Firebase?** Küçük bir işletme için sürekli çalışması ve ücretsiz kotanın rahat yetmesi önemliydi. Ücretsiz planda hareketsizlik yüzünden projeyi durduran çözümlerden bilerek uzak durdum. Fotoğraflar için Firebase Storage ücretli plan istediğinden Cloudinary kullandım.

**Okuma sayısını düşük tutma.** Menü ve site ayarları tek bir belgede tutuluyor ve oturum başına bir kez okunuyor. Bir ziyaretçi sayfalar arasında gezerken Firestore'a tekrar gitmiyor.

**Güvenlik kuralları.** Yetkilendirme istemcide değil, Firestore kurallarında yapılıyor (`firestore.rules`):
- Herkese açık içerik (menü, etkinlik, kampanya) herkes tarafından okunur, yalnızca yönetici yazabilir
- Yönetici listesi yalnızca Firebase Console'dan elle düzenlenebilir
- Üye yalnızca kendi profilini ve kuponlarını okuyabilir; damga sayısını artırmak, ödül vermek ve kuponu "kullanıldı" yapmak yalnızca yöneticiye açık
- Kupon belgesi kimliği kullanıcı ve kampanyaya bağlı olduğu için bir kampanyadan kullanıcı başına bir kupon alınabilir

**Hareket ve erişilebilirlik.** İşletim sisteminde "hareketi azalt" açıksa kaydırma animasyonları kurulmuyor, sahneler son halleriyle gösteriliyor. Mobilde sabit alt gezinme çubuğu, dokunmatik ekrana uygun boyutlar kullanılıyor.

**Performans.** Yazı tipleri (Fraunces, Figtree) siteden sunuluyor ve önceden yükleniyor. Açılışta stilsiz bir yedek metin göstermek yerine markanın renginde bir açılış ekranı var.

**SEO.** Her sayfanın kendi başlığı, açıklaması ve canonical adresi var. Open Graph ve Twitter kartları, `CafeOrCoffeeShop` şeması (JSON-LD), PWA manifest dosyası, derleme sırasında üretilen `robots.txt` ve `sitemap.xml` ekli. Yönetim ve sadakat sayfaları arama sonuçlarına alınmıyor.

## Demo modu

`.env` boşsa site örnek verilerle çalışır (Firebase bağlantısı gerekmez). Tasarımı hızlıca göstermek için kullanışlı.

## Yerelde çalıştırma

```bash
npm install
cp .env.example .env    # Firebase ve Cloudinary bilgilerini doldur
npm run dev             # geliştirme sunucusu
npm run build           # üretim derlemesi (dist/)
```

## Kurulum

1. **Firebase:** console.firebase.google.com → proje oluştur → Web uygulaması ekle, yapılandırma değerlerini `.env` dosyasına yaz.
2. **Giriş:** Authentication → Sign-in method → Google'ı etkinleştir.
3. **Veritabanı:** Firestore'u oluştur ve kuralları yükle: `npx firebase-tools deploy --only firestore:rules`
4. **İlk yönetici:** Siteye bir kez Google ile giriş yap. Authentication → Users sekmesinden hesabın **User UID** değerini kopyala; Firestore'da `admins` koleksiyonuna belge kimliği bu UID olacak şekilde bir belge ekle.
5. **İlk menü:** Yönetim → Menü → "Trendyol Go menüsünü yükle" ile örnek menü Firestore'a yazılır.
6. **Fotoğraf yükleme (isteğe bağlı):** Cloudinary → Settings → Upload → **unsigned** bir upload preset oluştur, cloud name ve preset adını `.env` dosyasına yaz.
7. **Yayın:**
   ```bash
   npm run build
   npx firebase-tools deploy --only hosting,firestore:rules
   ```

Yayın adresi proje kimliğinden otomatik alınır (`https://<proje>.web.app`). Kendi alan adın varsa `.env` içine `VITE_SITE_URL=https://alanadi.com` ekle; canonical, sitemap ve paylaşım görselleri o adresle üretilir.

## Klasör yapısı

```
src/
  components/   Layout, Footer, FooterGarden, Photo, form bileşenleri
  context/      Auth (kullanıcı, üyelik, yönetici durumu)
  lib/          Firebase, içerik okuma/yazma kancaları, Cloudinary, SEO kancası, örnek veri
  pages/        Ana sayfa, menü, etkinlikler, sadakat, yönetim
  scenes/       Kaydırmayla çalışan sahneler (hero, burger, içecekler)
public/         Simgeler, paylaşım görseli, yazı tipleri, manifest
firestore.rules Güvenlik kuralları
```

## Bilinen notlar

- Menü fotoğrafları başlangıçta Trendyol Go'dan geliyor; kalıcı çözüm için yönetim panelinden kendi fotoğraflarını yüklemek gerekir.
- Instagram uygulaması içindeki tarayıcıda Google girişi çalışmaz; Sadakat sayfası bu durumda uyarı gösterir.
- Telefon ve adres, yönetim panelindeki Site ayarları'ndan girilir.
