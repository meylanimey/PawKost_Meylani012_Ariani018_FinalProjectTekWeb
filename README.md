1.	Pada sisi user, aplikasi menggunakan client-side routing dengan react-router-dom di file App.jsx melalui BrowserRouter, Routes, dan Route untuk mengatur atau memudahkan perpindahan halaman. User dapat berpindah antara halaman Home, Detail Kost, Kontak, Pusat Bantuan,Kebijakan Privasi,serta Syarat dan Kettentuan tanpa reload browser, sehingga navigasi terasa lebih cepat dan nyaman. 

Home (/), Detail Kost (/detail/:id), Kontak (/kontak), Bantuan (/bantuan), Privasi (/privasi), dan Syarat (/syarat).



2.	Dynamic routing diterapkan pada halaman KostDetail dengan mengambil parameter id dari URL menggunakan useParams. Nilai id tersebut digunakan untuk mencari data kost yang sesuai dari Kosts. Dengan cara ini, satu halaman detail dapat menampilkan informasi kost yang berbeda berdasarkan ID yang dipilih pengguna.  Missal 

http://localhost:5173/detail/1

Cri kost

Navigasi dropdown “Cari Kost” pada Navbar memungkinkan user langsung menuju section tertentu di halaman beranda. Fitur ini dilengkapi scroll otomatis sehingga user tidak perlu mencari secara manual. Dengan demikian, navigasi menjadi lebih efisien dan nyaman.

3.	Pada sisi user, aplikasi mengintegrasikan komponen Shadcn UI seperti Card, Badge, dan Button pada halaman publik. Card digunakan pada KostCard.jsx, SocialCard.jsx, dan bagian daftar kost untuk menampilkan informasi secara terstruktur. Badge ditampilkan pada kartu kost untuk menunjukkan tipe atau kategori kost, sedangkan Button digunakan pada Navbar.jsx, SearchBar.jsx, KostCard.jsx, serta pada modal seperti BookingKostModal.jsx dan ContactKostModal.jsx sebagai aksi pengguna. Integrasi komponen ini membuat tampilan halaman publik lebih konsisten, interaktif, dan nyaman digunakan oleh user.


-“Fitur pencarian kost pada sisi User diimplementasikan secara terpisah antara tampilan dan logika.
Input pencarian ditampilkan melalui HeroSearch dan SearchBar, sedangkan proses filtering data kost dilakukan di Home.jsx.
Hasil pencarian kemudian ditampilkan dalam bentuk kartu melalui komponen KostCard.”

4.	Pada sisi user, aplikasi Kost Finder menggunakan Tailwind CSS untuk mengatur tata letak dan responsivitas tampilan. Styling ini membuat halaman publik seperti Beranda, Detail Kost, dan Kontak terlihat rapi, konsisten, dan nyaman digunakan oleh user.
