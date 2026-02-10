# Quantix Frontend

Quantix API için geliştirilmiş, modern ve premium tasarımlı kişisel finans takip uygulaması frontendi. React + Vite ile geliştirilmiştir.

## Özellikler 

- **Premium UI:** Dark mode odaklı, modern fintech arayüz tasarımı.
- **Güvenli Kimlik Doğrulama:** JWT token ile güvenli login, register ve email doğrulama süreçleri.
- **Dashboard:** Anlık bakiye, gelir/gider özeti ve interaktif grafikler (hazırlık).
- **İşlem Yönetimi:** Gelir ve gider ekleme, düzenleme, silme.
- **Kategori Yönetimi:** Admin paneli üzerinden dinamik kategori yönetimi.
- **Admin Panel:** Kullanıcıları görüntüleme ve yasaklama (Ban/Unban) özellikleri.

## Teknolojiler 

- **React 18**
- **Vite**
- **React Router Dom 6**
- **Axios** (API İletişimi)
- **CSS3** (Custom Properties & Responsive Design)
- **Lucide React** (İkon Seti)

## Kurulum ve Çalıştırma 

Proje dizininde terminali açın:

1. **Bağımlılıkları Yükleyin:**
   ```bash
   npm install
   ```

2. **Geliştirme Sunucusunu Başlatın:**
   ```bash
   npm run dev
   ```

3. **Tarayıcıda Açın:**
   `http://localhost:3000` adresine gidin.

> **Not:** Uygulamanın çalışması için Quantix Backend API servisinin (`http://localhost:5000`) çalışıyor olması gereklidir.

## Proje Yapısı 

```
src/
├── components/   # Sidebar, Modal, Layout vb.
├── context/      # AuthContext (Oturum yönetimi)
├── pages/        # Dashboard, Login, Transactions vb.
├── services/     # API istekleri (Axios yapılandırması)
└── styles/       # Global stiller ve değişkenler
```


