<<<<<<< Updated upstream

#Bagian Penjelasan Fitur Admin
Sisi Admin pada aplikasi ini berfungsi untuk mengelola data kost, mulai dari menambah data baru, mengedit data yang sudah ada, hingga menghapus data. Halaman Admin dirancang dengan antarmuka yang sederhana, responsif, dan terstruktur menggunakan Tailwind CSS serta komponen UI seperti Button dan Badge.
Struktur utama fitur Admin terdiri dari:
src/
 ├─ components/
 │   └─ admin/
 │        ├─ AdminHeader.jsx
 │        ├─ FormData.jsx
 │        └─ DataTable.jsx
 └─ pages/
      └─ Admin
             └─Dashboard.jsx

1) AdminDashboard.jsx
AdminDashboard adalah halaman utama Admin yang menggabungkan seluruh komponen Admin, yaitu:
- AdminHeader: Menampilkan judul "Dashboard" dan deskripsi pendek.
- FormData: Form untuk menambah dan mengedit data kost.
- DataTable: Tabel yang menampilkan daftar kost serta tombol Edit dan Hapus untuk setiap baris.
Halaman ini juga menangani integrasi form dan tabel melalui state editingKost, sehingga admin dapat berpindah dari mode tambah ke mode edit dengan mudah. Selain itu, halaman admin mampu menerima data kost dari sisi user melalui:
navigate("/dashboard", {
  state: { selectedKost: kost }
});
Sehingga ketika user menekan tombol Sewa di Katalog, data kost dapat otomatis masuk ke dashboard dan diproses oleh admin.

2) AdminHeader.jsx
Komponen yang menampilkan header dashboard dengan tampilan minimalis dan profesional.
Berisi judul Dashboard, serta siap dikembangkan untuk memuat elemen tambahan seperti tombol logout atau profil admin. Tujuannya adalah memberikan konteks visual bahwa pengguna sedang berada di area admin.

3) FormData.jsx 
Komponen ini menjadi pusat input data pada Admin. Fungsi utamanya:
- Tambah Data Kost
- Edit Data Kost
- Reset Form
- Batal Edit
Form ini menggunakan state React (useState) untuk mengelola inputan dan useEffect untuk mengisi form ketika admin menekan tombol Edit dari tabel. 
- Pada mode edit, form otomatis terisi dengan data kost yang dipilih.
- Pada mode tambah, form akan kosong.
Contoh alur:
1. Admin klik tombol Edit → form terisi otomatis.
2. Admin klik Simpan → data diperbarui.
3. Admin klik Tambah → membuat data baru dengan crypto.randomUUID() sebagai ID. Untuk Checkpoint 1, semua aksi tombol masih berupa console.log sebagai simulasi.

4) DataTable.jsx
Komponen ini menampilkan semua data kost dalam bentuk tabel. Fasilitas yang tersedia:
- Menampilkan nama kost
- Menampilkan tipe kost
- Menampilkan harga
- Tombol Edit (memulai proses edit)
- Tombol Hapus (menghapus data)
Setiap tombol dihubungkan ke fungsi handler (onStartEdit dan onDelete) yang dikirim dari AdminDashboard.jsx. Selain itu, DataTable memiliki mekanisme fallback, yaitu:

if (!rows.length) {
  return <p>Data kost belum ada.</p>
}

Sehingga tampilan tetap rapi saat data masih kosong.

5) Integrasi User → Admin
Salah satu fitur unik aplikasi ini adalah kemampuan untuk menerima data dari sisi User ke Admin melalui tombol Sewa pada Katalog.
Ketika user menekan tombol tersebut, komponen KostCard akan mengirim data kost ke halaman Admin melalui React Router:

navigate("/dashboard", {
  state: { selectedKost: kost }
});

Bagian ini memungkinkan admin untuk langsung meninjau kost yang sedang diminati oleh user nya.
=======
Bagian Penjelasan Fitur User

Sisi **User** pada aplikasi **PAW KOST** berfungsi sebagai antarmuka utama bagi pengguna untuk **melihat katalog kost**, **mengetahui detail kost**, serta **melakukan interaksi awal** seperti melihat detail dan menyatakan minat sewa.
Pada **Checkpoint 1**, User Side difokuskan pada **UI statis**, **dummy data**, dan **event handling dasar**, tanpa integrasi backend.

Antarmuka User dirancang **bersih, responsif, dan mudah dipahami** menggunakan **Tailwind CSS** serta **komponen UI dari shadcn/ui** seperti `Button` dan `Badge`.

Struktur utama fitur User terdiri dari:

```
src/
 ├─ components/
 │   └─ public/
 │        ├─ Navbar.jsx
 │        ├─ KostCard.jsx
 │        └─ Footer.jsx
 │
 ├─ pages/
 │   └─ public/
 │        ├─ Home.jsx
 │        └─ KostDetail.jsx
 │
 └─ data/
      └─ kosts.js
```

---

## 1) Home.jsx

`Home.jsx` merupakan **halaman utama User** yang menampilkan **katalog kost**.

Fungsi utama halaman ini:

* Menampilkan daftar kost dalam bentuk grid
* Mengambil data dari file dummy `kosts.js`
* Melakukan mapping data kost ke komponen `KostCard`

Alur kerja:

1. Data kost diimpor dari `kosts.js`
2. Data di-loop menggunakan `.map()`
3. Setiap item ditampilkan sebagai satu `KostCard`

Dengan pendekatan ini, Home.jsx berperan sebagai **container page** yang mengatur data dan layout, sementara detail tampilan diserahkan ke komponen atomic.

---

## 2) KostCard.jsx

`KostCard.jsx` adalah **komponen atomic** yang digunakan untuk menampilkan **satu data kost** dalam katalog.

Informasi yang ditampilkan:

* Gambar kost
* Tipe kost (Putri / Putra / Pet Friendly)
* Nama dan alamat kost
* Fasilitas utama
* Harga per bulan

Komponen ini juga memiliki **dua tombol interaktif**:

* **Detail** → mengarahkan user ke halaman detail kost menggunakan React Router (`/detail/:id`)
* **Sewa** → menjalankan event handling berupa `console.log()` sebagai simulasi (sesuai CP1)

Contoh event handling:

```js
console.log("Sewa kost:", kost.id, kost.name);
```

KostCard dibuat reusable sehingga dapat digunakan kembali tanpa mengubah struktur utama halaman.

---

## 3) KostDetail.jsx

`KostDetail.jsx` adalah halaman untuk menampilkan **informasi lengkap** dari satu kost.

Fungsi utama:

* Mengambil parameter `id` dari URL menggunakan `useParams`
* Mencari data kost yang sesuai dari `kosts.js`
* Menampilkan detail lengkap seperti:

  * Gambar
  * Nama
  * Alamat
  * Deskripsi
  * Fasilitas
  * Harga

Selain itu, halaman ini memiliki tombol:

* **Kembali** → kembali ke halaman sebelumnya
* **Sewa / Tanya Pemilik** → event handling berupa `console.log()`

Jika data tidak ditemukan, halaman akan menampilkan pesan fallback:

```js
Data kost tidak ditemukan
```

Hal ini memastikan UI tetap aman dan tidak error.

---

## 4) Navbar.jsx

`Navbar.jsx` berfungsi sebagai **navigasi utama** pada sisi User.

Fitur utama:

* Menampilkan nama aplikasi **PAW KOST**
* Menu navigasi seperti:

  * Katalog
  * Kontak
  * Masuk
* Hamburger menu untuk tampilan mobile

Navbar diletakkan di **layout utama** sehingga muncul di semua halaman User.

---

## 5) Footer.jsx

`Footer.jsx` menampilkan informasi tambahan di bagian bawah halaman.

Isi footer:

* Deskripsi singkat aplikasi
* Menu navigasi (Beranda, Daftar Kost, Kontak)
* Informasi kontak (lokasi, nomor, email)

Footer berfungsi sebagai pelengkap UI agar tampilan aplikasi terlihat **lebih profesional dan lengkap**.

---

## 6) kosts.js (Dummy Data)

File `kosts.js` berisi **data dummy** berupa array objek kost.

Digunakan oleh:

* Home.jsx → menampilkan katalog
* KostDetail.jsx → menampilkan detail

Isi data meliputi:

* id
* name
* type
* address
* price
* facilities
* image
* description

Penggunaan dummy data ini sesuai dengan ketentuan **Checkpoint 1**, yaitu memastikan UI dapat berjalan tanpa backend.

---

## 7) Routing User

Routing User diatur menggunakan **React Router** pada `App.jsx`.

Rute yang tersedia:

* `/` → Home (Katalog Kost)
* `/detail/:id` → KostDetail

Routing ini memungkinkan navigasi antar halaman tanpa reload.

---

## 8) Kesesuaian dengan Checkpoint 1

User Side pada aplikasi ini telah memenuhi seluruh kriteria **Checkpoint 1**, yaitu:

* UI statis
* Struktur folder rapi
* Komponen atomic
* Dummy data
* Event handling sederhana
* Routing dasar
* Tampilan berhasil muncul di browser

>>>>>>> Stashed changes
