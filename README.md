# resnizi-brovi-backoffice

Beauty Space için ayrı repo — mobil uyumlu yönetim paneli.

Şu an: **Dashboard** → QR tarama sayısı (toplam + bugün), veriler **Neon Postgres**’te.

## Mimari

```
QR kod  →  /api/scan  →  INSERT qr_scans  →  redirect  →  resnizi-brovi.vercel.app
Dashboard  →  /api/stats  (COUNT sorguları, şifre korumalı)
```

Her QR okutma `qr_scans` tablosuna bir satır ekler; dashboard toplam ve bugünkü sayıyı SQL ile okur.

## Hızlı başlangıç

```bash
npm install
cp .env.example .env.local
# .env.local içine DATABASE_URL ekle
npm run db:init
npm run dev
```

- Panel: http://localhost:3000  
- Giriş: `ADMIN_PASSWORD` (varsayılan dev: `admin`)  
- Test scan: http://localhost:3000/api/scan  

## Neon kurulumu

1. [console.neon.tech](https://console.neon.tech) → proje oluştur (ücretsiz tier yeterli)  
2. **Connection string** kopyala (Vercel için **pooled** önerilir)  
3. `.env.local` ve Vercel’e ekle:

```
DATABASE_URL=postgresql://...
```

4. Tabloyu oluştur:

```bash
npm run db:init
```

5. Vercel’de redeploy  

`DATABASE_URL` yoksa local’de geçici **bellek** sayacı kullanılır (prod’da kullanmayın).

## Ortam değişkenleri

| Değişken | Zorunlu | Açıklama |
|----------|---------|----------|
| `DATABASE_URL` | Evet (prod) | Neon Postgres connection string |
| `ADMIN_PASSWORD` | Evet (prod) | Panel şifresi |
| `SESSION_SECRET` | Evet (prod) | Oturum imzası |
| `SITE_REDIRECT_URL` | Hayır | Scan sonrası yönlendirme |

## Veritabanı şeması

`db/schema.sql` — tek tablo:

```sql
qr_scans (id, scanned_at)
```

“Bugün” sayısı **Europe/Moscow** saat dilimine göre hesaplanır.

## Vercel deploy

1. Repo’yu GitHub’a push et  
2. Vercel → Import → env değişkenlerini gir  
3. Deploy sonrası `npm run db:init` (bir kez, DATABASE_URL ile) veya Neon SQL Editor’da `db/schema.sql` çalıştır  
4. Tracker URL: `https://SENIN-BACKOFFICE.vercel.app/api/scan`

## Ana site QR

QR içeriği tracker URL olmalı (ana site değil). Backoffice deploy URL’in belli olunca QR’ları güncelle.

## API

| Endpoint | Auth | Açıklama |
|----------|------|----------|
| `GET /api/scan` | Hayır | `INSERT` + siteye redirect |
| `GET /api/stats` | Evet | `{ total, today, storage }` |
| `POST /api/auth/login` | Hayır | `{ password }` → cookie |
| `POST /api/auth/logout` | Evet | Çıkış |
