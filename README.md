## 🎫 Gatepass QR App

Gatepass QR App adalah aplikasi manajemen event & ticketing berbasis Next.js 15 (App Router + TypeScript).

## Main Fitur

- 📅 Manajemen Event: Buat & kelola event dengan kategori, kuota, lokasi, dll.
- 🎟 Ticketing System: Peserta bisa registrasi & dapat QR code unik.
- 📲 QR Code Scanner: Validasi tiket peserta menggunakan kamera (real-time).
- 👥 Participant Management: Pantau status peserta (REGISTERED, ATTENDED, dsb).
- 🛠 Database ORM dengan Prisma
- 📝 Report PDF: Generate laporan event & peserta dalam format PDF.

## 📦 Tech Stack

- Next.js 15 – Fullstack React Framework (App Router)
- React 19 + React DOM 19 – UI Library terbaru
- TypeScript 5
- Prisma ORM 6.14 – Db ORM untuk MySQL
- MySQL – Relational Db
- Faker.js 10 – Generate untuk data dummy (seed)
- QRCode & react-qr-code / react-qr-reader / react-qr-scanner – Generate & scan QR Code
- Recharts – Charting
- React Data Table Component – Data table interaktif
- React Toastify 11 – UI notifikasi
- Tailwind CSS 4 + PostCSS + Autoprefixer – Utility-first CSS framework
- ESLint 9

## ⚙️ Installation

1. Clone repository:

```bash
git clone https://github.com/username/gatepass-qr-app.git
cd gatepass-qr-app
```

2. Install dependencies:

```bash
npm install
```

3. Buat ENV:

```bash
DATABASE_URL="mysql://user:password@localhost:3306/gatepass"
```

4. Push scheme ke db:

```bash
npx prisma db push
```

## Database Seeding

Untuk generate data dummy event, kategori, dan peserta, gunakan script seeding bawaan.

Compile TypeScript seed script dan run:

```bash
npx tsc -p prisma/tsconfig.json
node prisma/dist/seed.js
```
