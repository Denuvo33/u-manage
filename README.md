# u-kelola

[![Vue 3](https://img.shields.io/badge/Vue.js-3-green?logo=vue.js)](https://vuejs.org/)
[![TailwindCSS](https://img.shields.io/badge/TailwindCSS-4-blue?logo=tailwind-css)](https://tailwindcss.com/)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](LICENSE)

**u-kelola** adalah aplikasi web sederhana untuk membantu pengelolaan keuangan berbasis kelompok atau komunitas.  
Aplikasi ini berfungsi untuk mencatat setoran anggota, pengeluaran, serta menampilkan ringkasan laporan keuangan.  

Semua data disimpan di **localStorage**, sehingga aplikasi dapat digunakan tanpa server atau database eksternal.

live preview https://u-kelola.web.app/

---

## Fitur Utama

- **Dashboard**
  - Total pemasukan, pengeluaran, dan saldo akhir.
  - Rekap per anggota: siapa sudah setor berapa.
  - <img width="1897" height="952" alt="image" src="https://github.com/user-attachments/assets/1d70a09b-d25a-4f57-ba56-4f241390e946" />

- **Manajemen Anggota**
  - Tambah, edit, dan hapus anggota.
  - Melihat total setoran per anggota.
  - <img width="1920" height="948" alt="image" src="https://github.com/user-attachments/assets/35ee438b-1005-42a3-b1f7-322d49342802" />


- **Setoran**
  - Mencatat setoran mingguan atau nominal tertentu.
  - Update saldo anggota secara otomatis.
  - <img width="1920" height="947" alt="image" src="https://github.com/user-attachments/assets/12367f6a-5ace-43ee-9def-118d8881adb4" />


- **Pengeluaran**
  - Form input pengeluaran (tanggal, deskripsi, nominal).
  - Riwayat pengeluaran tersimpan di localStorage.
  - Jenis Pengeluaran
  - Filter
  <img width="1917" height="944" alt="image" src="https://github.com/user-attachments/assets/f741f691-c902-4402-bffa-91df0c0fc933" />



- **Laporan**
  - Visualisasi pemasukan vs pengeluaran dengan grafik.
  - (Opsional) Ekspor data ke CSV.

- **UI & UX**
  - Responsive design.
  - Sidebar navigasi modern dengan [shadcn-vue](https://shadcn-vue.com) & [Lucide Icons](https://lucide.dev).
  - Styling menggunakan [TailwindCSS](https://tailwindcss.com).

---

## Teknologi yang Digunakan

- [Vue 3](https://vuejs.org/) - Frontend framework.
- [TailwindCSS](https://tailwindcss.com/) - Styling utility-first.
- [shadcn-vue](https://shadcn-vue.com) - UI components.
- [Lucide Vue Next](https://www.npmjs.com/package/lucide-vue-next) - Icon set.
- [Chart.js](https://www.chartjs.org/) + [vue-chartjs](https://vue-chartjs.org/) - Grafik laporan.
- [LocalStorage](https://developer.mozilla.org/docs/Web/API/Window/localStorage) - Penyimpanan data.

---

## Instalasi & Menjalankan

Pastikan sudah menginstal **Node.js (>=18)** dan **npm**.

```bash
# clone repositori
git clone https://github.com/username/u-kelola.git
cd u-kelola

# install dependencies
npm install

# jalankan di mode development
npm run dev

# build untuk production
npm run build
