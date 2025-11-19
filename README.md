# Autoverse Backend (Autoverse-BE)

Backend service untuk aplikasi **Auto Verse**.  
Ngurusin semua logic di belakang layar: auth user, manajemen kendaraan, riwayat service, dan parts.

Repo frontend: https://github.com/farhanopet15/Autoverse-FE  

---

## ✨ Fitur Utama

- 🔐 **Authentication & Authorization**
  - Register & login user
  - Proteksi endpoint pake token (misal JWT / bearer token)

- 🚗 **Manajemen kendaraan**
  - CRUD data kendaraan (merek, model, tahun, nomor polisi, dsb.)
  - Relasi ke user yang punya kendaraan

- 🧾 **Service history**
  - Catat riwayat service per kendaraan
  - Simpan info: tanggal, km, deskripsi, biaya, dll.

- 🧰 **Parts & maintenance**
  - Kelola parts yang pernah dipakai di kendaraan
  - Bisa dipakai buat tracking penggantian parts

- 📦 **RESTful API**
  - Endpoint rapi dan konsisten
  - Siap dikonsumsi sama frontend (Next.js) atau client lain

---

## 🧱 Tech Stack

- Node.js
- TypeScript
- Express.js
- Database SUPABASE
- Tooling:
  - ts-node / nodemon (development)
  - ESLint
