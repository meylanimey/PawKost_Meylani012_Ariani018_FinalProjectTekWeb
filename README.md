# CHECKPOINT 1
# Bagian Penjelasan Fitur Admin
Sisi Admin pada aplikasi ini berfungsi untuk mengelola data kost, mulai dari menambah data baru, mengedit data yang sudah ada, hingga menghapus data. Halaman Admin dirancang dengan antarmuka yang sederhana, responsif, dan terstruktur menggunakan Tailwind CSS serta komponen UI seperti Button dan Badge.
Struktur utama fitur Admin terdiri dari:
```
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


# Bagian Penjelasan Fitur User

Sisi User pada aplikasi PAW KOST berfungsi sebagai antarmuka utama bagi pengguna untuk melihat katalog kost, mengetahui detail kost, serta melakukan interaksi awal seperti melihat detail dan menyatakan minat sewa.
Pada Checkpoint 1, User Side difokuskan pada UI statis, penggunaan dummy data, dan event handling dasar tanpa integrasi backend.

Antarmuka User dirancang bersih, responsif, dan mudah dipahami menggunakan Tailwind CSS serta komponen UI dari shadcn/ui seperti Button dan Badge.

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

1) Home.jsx

Home.jsx merupakan halaman utama User yang menampilkan katalog kost.

Fungsi utama halaman ini:

* Menampilkan daftar kost dalam bentuk grid
* Mengambil data dari file dummy kosts.js
* Melakukan mapping data kost ke komponen KostCard

Alur kerja:

1. Data kost diimpor dari kosts.js
2. Data di-loop menggunakan map()
3. Setiap item ditampilkan sebagai satu KostCard

Dengan pendekatan ini, Home.jsx berperan sebagai container page yang mengatur data dan layout, sementara detail tampilan diserahkan ke komponen atomic.


2) KostCard.jsx

KostCard.jsx adalah komponen atomic yang digunakan untuk menampilkan satu data kost dalam katalog.

Informasi yang ditampilkan:

* Gambar kost
* Tipe kost (Putri, Putra, Pet Friendly)
* Nama dan alamat kost
* Fasilitas utama
* Harga per bulan

Komponen ini memiliki dua tombol interaktif:

* Detail → mengarahkan user ke halaman detail kost menggunakan React Router (/detail/:id)
* Sewa → menjalankan event handling berupa console.log() sebagai simulasi sesuai Checkpoint 1

Contoh event handling:

```js
console.log("Sewa kost:", kost.id, kost.name);
```

KostCard dibuat reusable sehingga dapat digunakan kembali tanpa mengubah struktur utama halaman.


3) KostDetail.jsx

KostDetail.jsx adalah halaman untuk menampilkan informasi lengkap dari satu kost.

Fungsi utama:

* Mengambil parameter id dari URL menggunakan useParams
* Mencari data kost yang sesuai dari kosts.js
* Menampilkan detail lengkap seperti:

  * Gambar
  * Nama
  * Alamat
  * Deskripsi
  * Fasilitas
  * Harga

Halaman ini juga memiliki tombol:

* Kembali → kembali ke halaman sebelumnya
* Sewa dan Tanya Pemilik → event handling berupa console.log()

Jika data tidak ditemukan, halaman akan menampilkan pesan fallback:

```js
Data kost tidak ditemukan
```

Hal ini memastikan UI tetap aman dan tidak menimbulkan error.


4) Navbar.jsx

Navbar.jsx berfungsi sebagai navigasi utama pada sisi User.

Fitur utama:

* Menampilkan nama aplikasi PAW KOST
* Menu navigasi seperti:

  * Katalog
  * Kontak
  * Masuk
* Hamburger menu untuk tampilan mobile

Navbar diletakkan di layout utama sehingga muncul di semua halaman User.


5) Footer.jsx

Footer.jsx menampilkan informasi tambahan di bagian bawah halaman.

Isi footer:

* Deskripsi singkat aplikasi
* Menu navigasi (Beranda, Daftar Kost, Kontak)
* Informasi kontak (lokasi, nomor, email)

Footer berfungsi sebagai pelengkap UI agar tampilan aplikasi terlihat lebih profesional dan lengkap.


6) kosts.js (Dummy Data)

File kosts.js berisi data dummy berupa array objek kost.

Digunakan oleh:

* Home.jsx untuk menampilkan katalog
* KostDetail.jsx untuk menampilkan detail

Isi data meliputi:

* id
* name
* type
* address
* price
* facilities
* image
* description

Penggunaan dummy data ini sesuai dengan ketentuan Checkpoint 1, yaitu memastikan UI dapat berjalan tanpa backend.


7) Routing User

Routing User diatur menggunakan React Router pada App.jsx.

Rute yang tersedia:

* / → Home (Katalog Kost)
* /detail/:id → KostDetail

Routing ini memungkinkan navigasi antar halaman tanpa reload browser.


8) Kesesuaian dengan Checkpoint 1

User Side pada aplikasi ini telah memenuhi seluruh kriteria Checkpoint 1, yaitu:

* UI statis
* Struktur folder rapi
* Komponen atomic
* Dummy data
* Event handling sederhana
* Routing dasar
* Tampilan berhasil muncul di browser



# CHECKPOINT 2
# Bagian Penjelasan Fitur Admin
Fitur Admin – PAWKOST
Bagian Admin pada aplikasi PAWKOST digunakan untuk melakukan manajemen data kost. Halaman admin dipisahkan dari halaman publik dan diakses melalui route khusus menggunakan React Router DOM.

1) Admin Routes (Client-Side Routing)
Halaman admin diatur menggunakan nested routes pada React Router sebagai berikut:
/admin
/admin/add
/admin/edit/:id
Penjelasan:
/admin digunakan untuk menampilkan Dashboard Admin.
/admin/add digunakan untuk menambahkan data kost baru.
/admin/edit/:id digunakan untuk mengedit data kost berdasarkan ID tertentu.
Pemisahan ini bertujuan agar halaman admin tidak bercampur dengan halaman publik.

2) AdminLayout

File: src/components/admin/AdminLayout.jsx

AdminLayout berfungsi sebagai layout utama untuk seluruh halaman admin. Komponen ini berisi:

Sidebar navigasi (Dashboard, Tambah Kost, Keluar)

3) Header admin

Area konten utama yang ditampilkan menggunakan <Outlet />

Dengan AdminLayout, seluruh halaman admin memiliki tampilan yang konsisten.

4) Dashboard Admin

File: src/pages/admin/Dashboard.jsx

Dashboard Admin digunakan untuk mengelola seluruh data kost.

Fitur yang tersedia pada Dashboard Admin:

Menampilkan daftar kost dalam bentuk tabel

Fitur pencarian data kost

Filter data berdasarkan tipe kost

Ringkasan data:

Total kost

Kost tersedia

Kost tidak tersedia

Tombol navigasi ke halaman Tambah Kost

5) Tabel Data Kost

File: src/components/admin/DataTable.jsx

Tabel digunakan untuk menampilkan data kost secara terstruktur, meliputi:

Foto kost

Nama kost

Tipe kost

Status kost

Harga

Aksi (Edit dan Hapus)

Aksi pada tabel:

Edit: Mengarahkan admin ke halaman edit data kost berdasarkan ID.

Hapus: Menampilkan dialog konfirmasi sebelum data kost dihapus.

Tabel ini menggunakan komponen Shadcn/UI Table.

6) Tambah Kost

File: src/pages/admin/AddKost.jsx

Halaman Tambah Kost digunakan untuk menambahkan data kost baru.

Fitur pada halaman ini:

Form input data kost:

Nama kost

Tipe kost

Harga per bulan

Alamat

Deskripsi

Fasilitas

URL gambar

Validasi input agar seluruh data wajib diisi

Preview harga dan gambar

Tombol Simpan dan Batal

Data yang berhasil ditambahkan akan langsung muncul pada Dashboard Admin.

Edit Kost (Dynamic Routing)

File: src/pages/admin/EditKost.jsx

Halaman Edit Kost menggunakan dynamic routing dengan parameter ID:

/admin/edit/:id


Fitur yang tersedia:

Mengambil parameter ID dari URL menggunakan useParams

Menampilkan data kost lama ke dalam form (prefill)

Mengedit seluruh data kost

Mengubah status kost (Tersedia atau Tidak Tersedia)

Menambah dan menghapus fasilitas kost

7) State Management

Data kost disimpan di App.jsx menggunakan useState

Data dibagikan ke halaman admin melalui props

Proses tambah, edit, dan hapus data dikelola melalui fungsi:

handleAdd

handleEdit

handleDelete

Pendekatan ini sesuai untuk aplikasi React skala kecil dan memenuhi kebutuhan tugas.

# Bagian Penjelasan Fitur User (Aplikasi)
1. Deskripsi Umum (User Side)
PAWKOST merupakan sistem berbasis web yang digunakan untuk menampilkan dan menelusuri data kost secara terstruktur dan mudah dipahami oleh pengguna. Sistem ini memungkinkan pengguna untuk menemukan kost berdasarkan lokasi, harga, jenis kost, serta fasilitas yang tersedia tanpa perlu melakukan pencarian manual.
Data yang digunakan bersifat statis (dummy data) namun disusun menyerupai kondisi nyata di lapangan. Oleh karena itu, sistem ini dapat dimanfaatkan sebagai:
•	Media pembelajaran React
•	Katalog kost berbasis frontend
•	Dasar pengembangan sistem berskala lebih lanjut
PAWKOST difokuskan pada sisi pengguna (user), yaitu bagaimana pengguna berinteraksi dengan tampilan, menelusuri data kost, melihat detail informasi, serta berpindah halaman dengan navigasi yang jelas dan konsisten.

2. Tujuan Pembuatan (User Side)
Tujuan utama pembuatan PAWKOST adalah memberikan kemudahan bagi pengguna dalam menemukan kost yang sesuai dengan kebutuhan mereka. Sistem ini dirancang agar pengguna dapat memperoleh informasi kost secara cepat, akurat, dan terstruktur.
Selain itu, PAWKOST juga bertujuan untuk melatih penerapan React dalam pengelolaan data dan tampilan. Melalui sistem ini, konsep pencarian, filter data, serta navigasi halaman dapat diterapkan secara langsung pada sisi pengguna.

3. Cara Kerja Sistem (User Side)
Cara kerja PAWKOST pada sisi pengguna dimulai dari pemuatan data kost yang tersedia di dalam sistem. Data tersebut kemudian ditampilkan secara visual agar mudah dipahami dan ditelusuri oleh pengguna.
Alur kerja sistem secara umum adalah sebagai berikut:
  1.	Data kost dimuat dari file Kosts.js
  2.	Data ditampilkan pada halaman Home dalam bentuk kartu
  3.	Pengguna dapat:
    - Melakukan pencarian berdasarkan kata kunci
    - Memfilter kost berdasarkan jenis, lokasi, dan harga
  4.	Data hasil pencarian dan filter ditampilkan secara dinamis
  5.	Pengguna dapat membuka halaman detail kost
  6.	Pada halaman detail, pengguna dapat:
    - Melihat informasi dan fasilitas secara lengkap
    -	Menghubungi pemilik kost
    - Melakukan simulasi pemesanan
Seluruh proses tersebut berjalan di sisi frontend tanpa melibatkan backend, sehingga fokus utama berada pada pengalaman pengguna dalam menelusuri sistem.

4. Struktur Data Kost (User Side)
Setiap data kost direpresentasikan dalam bentuk object JavaScript yang memiliki struktur terstandarisasi. Struktur ini digunakan agar data mudah dikelola dan ditampilkan secara konsisten di seluruh halaman.
{
  id: string,
  name: string,
  type: string
  price: number,
  location: string,
  facilities: string[],
  image: string,
  description: string
}
Keterangan:
•	id berfungsi sebagai identitas unik setiap kost
•	name menyimpan nama kost
•	type menunjukkan jenis kost
•	price menyimpan harga sewa per bulan
•	location berisi alamat lengkap kost
•	facilities menampilkan daftar fasilitas
•	image menyimpan URL gambar kost
•	description berisi deskripsi singkat
Struktur ini memudahkan sistem dalam menampilkan data secara dinamis, terutama pada halaman Home dan halaman detail kost.

5. Penjelasan Folder dan File (User Side)
Struktur folder dan file disusun untuk memisahkan data, komponen tampilan, dan halaman utama agar sistem mudah dipahami dan dikembangkan.

- 5.2 Folder components/public
Folder ini berisi komponen yang digunakan secara berulang pada berbagai halaman sisi pengguna.

Navbar.jsx
Komponen ini digunakan untuk menampilkan navigasi utama dan mengatur perpindahan halaman. Navbar membantu pengguna berpindah antar halaman dengan mudah tanpa kehilangan konteks.

Footer.jsx
Footer menampilkan informasi umum serta tautan ke halaman tambahan. Komponen ini juga membantu menjaga konsistensi tampilan di seluruh halaman.

HeroSearch.jsx
Komponen ini menjadi bagian utama pada halaman Home. HeroSearch menampilkan judul sistem dan kolom pencarian sebagai titik awal interaksi pengguna.

SearchBar.jsx
SearchBar bertugas mengelola input pencarian dan filter. Komponen ini memungkinkan pengguna menyaring data kost secara langsung berdasarkan kebutuhan.

KostCard.jsx
KostCard menampilkan ringkasan informasi kost dalam bentuk kartu. Komponen ini memudahkan pengguna membandingkan beberapa kost secara cepat.

KostSection.jsx
Komponen ini digunakan untuk mengelompokkan data kost ke dalam beberapa bagian. Dengan pengelompokan ini, tampilan menjadi lebih terstruktur.

KostCarouselRow.jsx
KostCarouselRow menampilkan daftar kost secara horizontal. Komponen ini digunakan untuk memberikan variasi tampilan dan meningkatkan estetika antarmuka.

EmptyKost.jsx
Komponen ini ditampilkan ketika data hasil pencarian tidak ditemukan. EmptyKost memberikan umpan balik yang jelas kepada pengguna.

BookingKostModal.jsx
Komponen ini digunakan untuk simulasi pemesanan kost. Pengguna dapat melihat format pemesanan sebelum menghubungi pemilik kost.

ContactKostModal.jsx
ContactKostModal menyediakan pesan siap kirim untuk menghubungi pemilik kost. Komponen ini mempermudah interaksi pengguna tanpa harus mengetik pesan dari awal.

ContactForm.jsx
ContactForm digunakan pada halaman kontak untuk menampung pesan dari pengguna. Komponen ini melengkapi fitur komunikasi dalam sistem.


- 5.3 Folder pages/public
Folder ini berisi halaman utama yang diakses oleh pengguna.

Home.jsx
Halaman Home menampilkan seluruh data kost dan mengelola pencarian serta filter. Halaman ini menjadi pusat interaksi utama pengguna.

KostDetail.jsx
Halaman ini menampilkan detail kost berdasarkan ID yang dipilih. Informasi yang ditampilkan bersifat lengkap dan spesifik untuk satu kost.

Kontak.jsx
Halaman Kontak menampilkan informasi komunikasi dan form kontak. Halaman ini memudahkan pengguna untuk menghubungi pihak terkait.

Bantuan.jsx
Halaman Bantuan berisi panduan penggunaan sistem. Halaman ini membantu pengguna memahami cara menggunakan fitur yang tersedia.

Privasi.jsx
Halaman ini menampilkan kebijakan privasi. Informasi ini penting untuk memberikan transparansi kepada pengguna.

Syarat.jsx
Halaman Syarat menampilkan syarat dan ketentuan penggunaan sistem. Halaman ini berfungsi sebagai pedoman penggunaan bagi pengguna.

6. Routing dan Navigasi (User Side)
Routing dan navigasi diatur menggunakan React Router DOM untuk mendukung perpindahan halaman tanpa reload. Pendekatan ini meningkatkan kenyamanan pengguna saat berpindah antar halaman.
Rute utama yang digunakan meliputi:
•	/ untuk Home
•	/kost/:id untuk detail kost secara dinamis
•	/kontak untuk halaman kontak
•	/bantuan untuk halaman bantuan
•	/privasi dan /syarat untuk informasi tambahan
Penerapan routing ini mendukung navigasi yang rapi dan konsisten, sejalan dengan kebutuhan navigasi dan estetika antarmuka pada sisi pengguna.

7. Teknologi yang Digunakan
Sistem ini dibangun menggunakan teknologi frontend modern. Teknologi tersebut dipilih agar pengelolaan data dan tampilan dapat berjalan secara optimal.
Teknologi yang digunakan meliputi:
•	React
•	React Router DOM
•	JavaScript ES6
•	Tailwind CSS