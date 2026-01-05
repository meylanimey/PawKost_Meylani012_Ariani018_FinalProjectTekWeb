
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