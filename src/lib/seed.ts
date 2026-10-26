import type { Campaign, CafeEvent, MenuDoc, MenuItem, SiteSettings } from './types'

// Görseller şimdilik Trendyol Go CDN'inden geliyor; admin panelinden kendi fotoğraflarınızla değiştirebilirsiniz.
const IMG = 'https://cdn.tgoapps.com/mnresize/256/-/tgo2/spm/prod/meal/media/images/product/129183/'

let n = 0
const it = (
  categoryId: string,
  name: string,
  description: string,
  price: number,
  img = '',
  featured = false,
): MenuItem => ({
  id: `i${++n}`,
  name,
  description,
  price,
  categoryId,
  image: img ? IMG + img : '',
  featured,
  available: true,
})

export const seedMenu: MenuDoc = {
  categories: [
    { id: 'kahvalti', name: 'Kahvaltılık' },
    { id: 'sandvic', name: 'Sandviçler' },
    { id: 'burger', name: 'Hamburgerler' },
    { id: 'izgara', name: 'Izgaralar' },
    { id: 'makarna', name: 'Makarnalar' },
    { id: 'bowl', name: 'Bowllar' },
    { id: 'salata', name: 'Salatalar' },
    { id: 'atistirmalik', name: 'Atıştırmalık' },
    { id: 'sogukkahve', name: 'Soğuk Kahveler' },
    { id: 'sogukicecek', name: 'Soğuk İçecekler' },
    { id: 'tatli', name: 'Tatlılar' },
  ],
  items: [
    // Kahvaltılık
    it('kahvalti', 'Tost Tabağı', 'Taze kaşar, el yapımı tost ekmeği, domates, salatalık, kapya biber, zeytin', 355, '16859290_1792483915597.jpg'),
    it('kahvalti', 'Karışık Tost Tabağı', 'Taze kaşar, el yapımı tost ekmeği, jambon, sucuk, salatalık, domates, kapya biber ve zeytin.', 410, '16859291_1792483979579.jpg'),
    it('kahvalti', 'Beyaz Tost', 'Beyaz peynir, el yapımı tost ekmeği, domates, zeytin ezmesi, pesto sos, salatalık, kapya biber ve zeytin.', 380, '16859292_1792484543934.jpg'),
    it('kahvalti', 'Hindi Füme Tost', 'Hindi füme, el yapımı tost ekmeği, dil peyniri, sezar sos, salatalık, domates, kapya biber, turşu ve zeytin.', 380, '16859293_1792483962329.jpg'),
    it('kahvalti', 'Fit Kahvaltı (3 XL)', '2 adet yumurta, avokado, sürk salatası (salatalık, domates, kapya biber), akdeniz yeşillikleri, labne peynirli hindi füme, ceviz, halhalı zeytin ve botta sos.', 640, '16859294_1792484095403.jpg'),
    it('kahvalti', 'Fit Kahvaltı (XL)', 'Ekşi mayalı bruschetta (kuru domates, labne avokado, kapya biber), 2 adet yumurta (haşlanmış), akdeniz yeşilliği, domates, salatalık, ceviz ve botta sos', 530, '16859295_1792484060636.jpg', true),
    it('kahvalti', 'Fit Kahvaltı (XS)', 'Sebzeli (mantar ve kapya biber) yulaflı omlet (2 adet yumurta), salatalık, domates, kapya biber, ezine peyniri, zeytin, akdeniz yeşillikleri.', 500, '16859296_1792484061866.jpg'),
    it('kahvalti', 'Sade Omlet', '2 adet yumurta, salatalık, domates, kapya biber ve zeytin.', 260, '17101251_1770017237529.png', true),
    it('kahvalti', 'Avokado Brunch', 'Akdeniz yeşillikleri, pancar, karakılçık ekmeği, avokado, labne, hindi füme, ceviz, ezine peynir ve çırpılmış yumurta.', 425, '17681361_1792484233967.jpg', true),
    it('kahvalti', 'Füme Sosis ve Peynirli Omlet', 'Izgara füme sosis (90 gr), mozzarella peynirli omlet (2 adet yumurta), yeşil botta salata (havuç, cherry domates, mısır, iceberg)', 430, '21832247_1792485862109.jpg'),
    it('kahvalti', 'Fransız Tostu', 'Shokupan ekmeğinden yapılmış fransız tostu, akçaağaç şurubu, yaban mersini ve çilek', 375, '21832303_1792485499595.jpg'),
    it('kahvalti', 'Smoothie Bowl', 'Yulaf ezmesi, chia tohumu, yoğurt, süt, bal, muz, frambuaz, böğürtlen, yaban mersini ve botta granola.', 410, '16859322_1792484175856.jpg', true),

    // Sandviçler
    it('sandvic', 'Sosisli Sandviç', 'El yapımı sandviç ekmeği ile ızgara füme sosis (90 gr), karamelize soğan, hardal, ketçap ve cheddar sos', 480, '21824887_1792483667064.png'),
    it('sandvic', 'Rozbif Sandviç', 'El yapımı ciabatta ekmeği ile dana rozbif, mozzarella, labne, domates, roka ve pesto sos', 650, '21824922_1792483656046.jpg'),
    it('sandvic', 'İtalyan Köfteli Sandviç', 'El yapımı ciabatta ekmeği ile italyan usulü domates soslu dana kıymadan mini köfteler (120 gr), mozzarella ve fesleğen sos', 515, '21824963_1792483694002.jpg'),
    it('sandvic', 'Tavuklu Caesar Sandviç', 'El yapımı ciabatta ekmeği ile pane çıtır tavuk (170 gr), kıvırcık marul, caesar sos ve parmesan peyniri', 495),
    it('sandvic', 'Peynirli Sandviç', 'El yapımı ciabatta ekmeği (tereyağlı), cheddar, labne, kaşar peyniri, parmesan ve roka', 480, '21832494_1792483741320.jpg'),

    // Hamburgerler
    it('burger', 'Etli Mini Burger 5\'li', 'Botta\'nın el yapımı mini hamburger ekmeği, mini el yapımı hamburger köftesi (150 gr), göbek marul, domates, cheddar, botta özel sos, baharatlı patates kızartması.', 580, '16859335_1792483815868.png', true),
    it('burger', 'Tavuklu Mini Burger 5\'li', 'Botta\'nın el yapımı mini hamburger ekmeği, el yapımı tavuk köfte (150 g), göbek marul, botta özel sos, baharatlı patates kızartması.', 510, '16859334_1792483801310.jpg', true),
    it('burger', 'Trüf Burger', 'Botta\'nın el yapımı hamburger ekmeği, 150 gr el yapımı hamburger köftesi, bacon, trüf mantar sosu, domates, göbek marul, acur turşusu, mantar sote, botta özel sos, baharatlı patates kızartması.', 620, '16859336_1770378952580.jpg', true),
    it('burger', 'Meşwrap Burger', 'Tortilla ekmeği (30 cm), 150 gr el yapımı hamburger köftesi, çıtır soğan, domates, göbek marul, mantar sote, botta özel sos, baharatlı patates kızartması.', 600, '16859337_1792483923509.jpg'),
    it('burger', 'Vegan Burger', 'Botta\'nın el yapımı tortilla ekmeği, 180 gr. el yapımı vegan hamburger köftesi, domates, göbek marul, özel vegan sos, turşu, baharatlı patates kızartması.', 600),
    it('burger', 'Tavuklu Mini Burger 3\'lü', 'Bottanın el yapımı mini hamburger ekmeği, mini el yapımı tavuk köfte (90 gr), göbek marul, botta sos, baharatlı patates kızartması ve burger sos', 330, '21825089_1792485734582.jpg'),
    it('burger', 'Etli Mini Burger 3\'lü', 'Botta\'nın el yapımı mini hamburger ekmeği, mini el yapımı hamburger köftesi (90 gr), göbek marul, domates, cheddar, botta sos, baharatlı patates kızartması ve burger sos', 400, '21825123_1792484354136.jpg'),
    it('burger', 'Etli Mini Trüf Burger 3\'lü', 'Botta\'nın el yapımı mini hamburger ekmeği, trüf mantar sos, çıtır soğan, mini el yapımı hamburger köftesi (90 gr), göbek marul, domates, cheddar, botta sos, baharatlı patates kızartması ve burger sos', 420, '21825166_1792485843656.jpg'),
    it('burger', 'Etli Mini Trüf Burger 5\'li', 'Botta\'nın el yapımı mini hamburger ekmeği, trüf mantar sos, çıtır soğan, mini el yapımı hamburger köftesi (150 gr), göbek marul, domates, cheddar, botta sos, baharatlı patates kızartması ve burger sos', 610, '21825210_1792484476482.png'),
    it('burger', 'Etli Mini Trüf Burger 10\'lu', 'Botta\'nın el yapımı mini hamburger ekmeği, trüf mantar sos, çıtır soğan, mini el yapımı hamburger köftesi (300 gr), göbek marul, domates, cheddar, botta sos, baharatlı patates kızartması ve burger sos', 1160),
    it('burger', 'Tavuklu Mini Burger 10\'lu', 'Botta\'nın el yapımı mini burger ekmeği, el yapımı tavuk köfte (300 gr), göbek marul, botta özel sos ve baharatlı patates kızartması.', 980, '17099369_1770385065713.jpg'),
    it('burger', 'Etli Mini Burger 10\'lu', 'Botta\'nın el yapımı mini hamburger ekmeği, mini el yapımı hamburger köftesi (300 gr), göbek marul, domates, cheddar, botta özel sos ve baharatlı patates kızartması.', 1090, '16859510_1770381951628.jpg'),
    it('burger', 'Tavuklu Mini Burger 20\'li', 'Botta\'nın el yapımı mini burger ekmeği, el yapımı tavuk köfte, göbek marul, botta özel sos ve baharatlı patates kızartması.', 1780, '16859448_1770384990066.jpg'),
    it('burger', 'Etli Mini Burger 20\'li', 'Botta\'nın el yapımı mini hamburger ekmeği, mini el yapımı hamburger köftesi, göbek marul, domates, cheddar, botta özel sos ve baharatlı patates kızartması.', 1900, '16859512_1770385065134.jpg'),

    // Izgaralar
    it('izgara', 'Ispanaklı Izgara Tavuk', '250 gr tavuk bonfile, ıspanak, sote (soğan, kapya biber, mantar), yeşil roka salata (havuç, cherry domates, mısır, iceberg)', 680, '16859317_1792485259045.jpg', true),
    it('izgara', 'Sebzeli ve Kekikli Tavuk But', '200gr ızgara tavuk but, sebze sote (istiridye mantarı, beyaz mantar, kapya biber ve soğan), tereyağlı ve cevizli siyez eriştesi, yeşil Botta salata (havuç, cherry domates, mısır, iceberg)', 745, '21829743_1792485259007.jpg'),

    // Makarnalar
    it('makarna', 'Pesto Soslu Spagetti', 'Cenova usulü pesto sos (fesleğen, sarımsak, parmesan peyniri, yer fıstığı ve zeytinyağı) ve parmesan', 495, '21825609_1792484633222.jpg'),
    it('makarna', 'Köfteli Spagetti', 'Dana kıymadan mini köfteler (120 gr), maydanoz, domates sos ve parmesan', 540, '21825627_1792484631359.jpg'),
    it('makarna', 'Kremalı Mantarlı Tavuklu Penne', 'Tavuklu bonfile (150 gr), istiridye mantarı, beyaz mantar, krema, sarımsak ve parmesan', 520, '21825663_1792484659872.jpg'),
    it('makarna', 'Ton Balıklı Penne', 'Ton balığı (85 gr), domates, soğan, roka, limon ve domates sos ile', 495, '21825691_1792484709343.jpg'),

    // Bowllar
    it('bowl', 'Tavuk Root Pilates Bowl', '200 gr tavuk göğüs, sotelenmiş kabak, havuç, mantar, kapya biber, çarliston, yeşillik, susam, pancar ve botta sos.', 640),
    it('bowl', 'Köfte Bowl', 'Izgara köfte, basmati pirinç pilavı, akdeniz yeşillikleri, cevizli yoğurtlu pancar, brüksel lahanası, havuç ve asya sos.', 690, '17681202_1792572505486.jpg', true),

    // Salatalar
    it('salata', 'Parmesanlı Avokado Salatası', 'Yeşil botta salata (havuç, cherry domates, mısır, iceberg) parmesan, avokado, yeşil elma, ceviz, botta sos.', 520, '16859312_1792484714226.jpg'),
    it('salata', 'Tavuklu Caesar Salata', 'Tavuk bonfile (200 gr), yeşil botta salata (havuç, cherry domates, mısır, iceberg) caesar sos, kruton ekmek, parmesan peyniri ve botta sos.', 580, '16859313_1792484711493.jpg', true),
    it('salata', 'Falafelli Salatası (Vegan)', 'Yeşil botta salata (havuç, cherry domates, mısır, iceberg) falafel, pancar, ceviz, çilekli sos ve botta sos.', 560, '16859315_1792484760693.jpg'),

    // Atıştırmalık
    it('atistirmalik', 'Patates Kızartması', '300 gr baharatlı patates kızartması.', 290, '16859303_1792484720787.jpg'),
    it('atistirmalik', 'Patates Kızartması (XL)', '500 gr baharatlı patates kızartması.', 395, '16859309_1770384854487.jpg'),
    it('atistirmalik', 'Bira Tabağı Vann', '200 gr baharatlı patates kızartması, çıtır peynir topları, jalapeno topları ve burger sos.', 485, '16859304_1792484759537.jpg'),
    it('atistirmalik', 'Bira Tabağı Tuuu', '200 gr baharatlı patates kızartması, panelde çıtır tavuk ve burger sos.', 500, '16859305_1792484820343.jpg'),
    it('atistirmalik', 'Bira Tabağı Triiiiii', '200 gr baharatlı patates kızartması, soğan halkası, falafel ve burger sos.', 430, '16859306_1792484834720.jpg'),
    it('atistirmalik', 'Bira Tabağı Forrrr', '200 gr. baharatlı patates kızartması, el yapımı sigara böreği, el yapımı muska böreği ve burger sos.', 500, '16859307_1792484877122.jpg'),
    it('atistirmalik', 'Bira Tabağı Kombo', '300 gr. baharatlı patates kızartması, soğan halkası, falafel, pane çıtır tavuk, çıtır peynir topları, jalapeno topları, el yapımı sigara böreği, el yapımı muska böreği ve burger sos.', 845, '16859308_1792484937232.jpg'),
    it('atistirmalik', 'Corn Dog', '200 gr. baharatlı patates kızartması, mısır hamuru ile kaplanmış 4 adet füme sosis ve burger sos', 460, '21824703_1792484950958.jpg'),

    // Soğuk kahveler
    it('sogukkahve', 'Cold Brew', '18 saatte demlenir. Portakal ve çubuk tarçın ile servis edilir.', 330, '16859205_1770384564814.jpg'),
    it('sogukkahve', 'Cold Brew Sofy', '18 saat demlenen cold brew, portakal, vanilya, beyaz çikolata, taze nane, tarçın.', 340),
    it('sogukkahve', 'Ice Americano', '', 290, '16859207_1770379052756.jpg'),
    it('sogukkahve', 'Ice Latte', '', 320, '16859208_1770379059971.jpg'),
    it('sogukkahve', 'Ice Mocha', '', 330, '16859209_1770379010686.jpg'),
    it('sogukkahve', 'Ice Cappuccino', '', 320, '16859210_1770382103386.jpg'),
    it('sogukkahve', 'Ice Chai Latte', 'Tarçın ile servis edilir', 330, '16859211_1770382159339.jpg'),
    it('sogukkahve', 'Frappe', 'Sıcak çikolata tozu, espresso, süt', 330, '16859212_1773126504085.png'),
    it('sogukkahve', 'Ice Matcha Latte', '', 360, '16859213_1770384561180.jpg'),
    it('sogukkahve', 'Ice Muzlu Matcha Latte', '', 390, '16859215_1770384973611.jpg'),
    it('sogukkahve', 'Ice Vanilyalı Matcha Latte', '', 390),

    // Soğuk içecekler
    it('sogukicecek', 'Muzlu Smoothie', 'Yoğurt, süt, bal, chia tohumu, muz.', 325, '16859233_1773126498779.png'),
    it('sogukicecek', 'Çilekli Smoothie', 'Yoğurt, süt, bal, chia tohumu, çilek.', 325, '16859234_1773127378291.png'),
    it('sogukicecek', 'Tropic Smoothie', 'Yoğurt, süt, bal, chia tohumu, ananas, şeftali, muz.', 340),
    it('sogukicecek', 'Fresh Smoothie', 'Yoğurt, süt, bal, chia tohumu, avokado, yeşil elma, limon, nane.', 340),
    it('sogukicecek', 'Coca Cola 330 ml', '', 100, '16859240_1782896758613.jpg'),
    it('sogukicecek', 'Fanta 330 ml', '', 100, '16859242_1776866042225.png'),
    it('sogukicecek', 'Churchill', '', 120, '16859243_1773126519170.png'),
    it('sogukicecek', 'Soda', '', 90, '16859244_1773132252993.png'),
    it('sogukicecek', 'Su', '', 45, '16859245_1773134123586.jpg'),
    it('sogukicecek', 'Lipton Şeftali 330 ml', '', 90),
    it('sogukicecek', 'Lipton Mango 330 ml', '', 90),
    it('sogukicecek', 'Lipton Limon 330 ml', '', 90),

    // Tatlılar
    it('tatli', 'Magnolia', '', 295),
    it('tatli', 'Çikolatalı Cup', '', 295),
    it('tatli', 'Mozaik Pasta', '', 285, '16859227_1792485046686.jpg'),
    it('tatli', 'Vişneli Brownie', '', 285, '16859228_1792484994710.jpg'),
    it('tatli', 'Fıt Brownie', '', 285, '16859229_1792485001664.jpg'),
    it('tatli', 'Lavantalı Cheesecake', '', 330, '17233278_1792485066590.jpg'),
    it('tatli', 'Limonlu Cheesecake', '', 330, '22281314_1792485176407.jpg'),
  ],
}

export const defaultSettings: SiteSettings = {
  name: 'Botta Bloom',
  tagline: 'Kahve, mutfak ve çiçek',
  heroTitle: 'Çiçeklerin arasında bir kahve molası',
  heroText:
    'Adana Cemalpaşa\'da; taze demlenen kahveler, el yapımı ekmeklerle hazırlanan tabaklar ve çiçeklerle dolu bir masa.',
  heroImage: 'https://cdn.tgoapps.com/orangeprod150/de1226d2-3e87-4de7-8367-79261a785225.jpeg',
  phone: '',
  address: 'Cemalpaşa Mah., Adana',
  hours: 'Her gün 09:00 – 23:00',
  instagram: 'https://www.instagram.com/bottabloom/',
  orderUrl: 'https://tgoyemek.com/restoranlar/129183',
  mapUrl: '',
  stampGoal: 8,
  rewardText: 'Bir kahve bizden',
}

export const seedCampaigns: Campaign[] = [
  {
    id: 'demo1',
    title: 'Hoş geldin kuponu',
    description: 'İlk ziyaretinizde kahvelerde geçerli.',
    discountText: '%15 indirim',
    active: true,
    endsAt: '',
  },
]

export const seedEvents: CafeEvent[] = []
