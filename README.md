# Quantix Frontend

Quantix API için React 19 ve Vite 6 ile geliştirilmiş kişisel finans takip arayüzü.

## Özellikler 

- **Arayüz:** Koyu tema ve küçük ekranlara uyumlu yerleşim.
- **Kimlik Doğrulama:** Kayıt, giriş, e-posta doğrulama ve JWT oturum yönetimi.
- **Dashboard:** İşlemlerden hesaplanan bakiye, gelir/gider özeti ve son işlemler.
- **İşlem Yönetimi:** Gelir ve gider ekleme, düzenleme, silme.
- **Kategori Yönetimi:** Admin paneli üzerinden dinamik kategori yönetimi.
- **Admin Panel:** Kullanıcıları görüntüleme ve yasaklama (Ban/Unban) özellikleri.

## Teknolojiler 

- **React 19**
- **Vite 6**
- **React Router DOM 7**
- **Axios** (API İletişimi)
- **CSS3** (Custom Properties & Responsive Design)
- **Lucide React** (İkon Seti)

## Kurulum ve Çalıştırma 

Node.js 22 veya üzeri ve npm gereklidir. Proje dizininde terminali açın:

1. **Bağımlılıkları Yükleyin:**
   ```bash
   npm ci
   ```

2. **API adresini ayarlayın (PowerShell):**
   ```powershell
   Copy-Item .env.example .env
   ```
   Varsayılan adres `http://localhost:5000/api`'dir. Farklı bir backend adresi kullanıyorsanız `.env` içindeki `VITE_API_URL` değerini değiştirin. Bu değer tarayıcıya gönderilir; burada parola veya başka gizli bilgi saklamayın.

3. **Geliştirme Sunucusunu Başlatın:**
   ```bash
   npm run dev
   ```

4. **Tarayıcıda Açın:**
   `http://localhost:3000` adresine gidin.

Backend API, MySQL ve e-posta ayarları için kardeş `Quantix_Backend` projesinin README dosyasını kullanın. Backend'in CORS ayarında frontend adresine izin verilmelidir. Kayıt sonrasında e-posta doğrulama bağlantısı `/verify-email?userId=...&token=...` sayfasını açar; bu sayfa API'ye doğrulama isteği gönderir.

## Kontrol ve Derleme

```bash
npm run build
npm run preview
```

Derleme çıktısı `dist/` klasörüne yazılır. `preview` varsayılan olarak `http://localhost:4173` adresinde açılır; bu adresle API kullanmak için backend CORS yapılandırmasına da eklenmelidir. Canlı sunucuda React Router sayfaları için bulunamayan sayfa isteklerini `index.html` dosyasına yönlendirin.

## Veri Kuralları

- Tutar API'ye pozitif sayı olarak gönderilir. Gelir/gider ayrımı `categoryType` alanından gelir: `0` gelir, `1` gider.
- Dashboard özeti tutar işaretinden veya kategori isminden tahmin edilmez; kategori türüne göre hesaplanır.
- Tarih formu yerel günü kullanır. Opsiyonel doğum tarihi seçilmezse API'ye `null` gönderilir.
- Admin bağlantılarının gizlenmesi arayüz davranışıdır; gerçek yetki denetimini backend yapar.
- JWT tarayıcının `localStorage` alanında tutulur. Bu portföy projesinde HttpOnly çerez veya token yenileme akışı bulunmaz.
- Grafik, bütçe limiti, filtreleme ve sayfalama uygulanmamıştır.

## Proje Yapısı 

```
src/
├── components/   # Sidebar, Modal, Layout vb.
├── context/      # AuthContext (Oturum yönetimi)
├── pages/        # Dashboard, Login, Transactions vb.
├── services/     # Axios, hata mesajları ve işlem hesaplamaları
├── App.jsx       # Sayfa rotaları
└── index.css     # Global stiller ve kullanılan utility sınıfları
```


