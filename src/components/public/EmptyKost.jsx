// Komponen EmptyKost
// Digunakan untuk menampilkan state kosong (tidak ada data kost)
export default function EmptyKost({
  // Judul pesan (default jika tidak dikirim dari parent)
  title = "Kost tidak ditemukan",

  // Deskripsi penjelasan tambahan
  description = "Coba ubah kata kunci pencarian atau filter yang kamu pilih.",

  // Callback opsional untuk reset pencarian / filter
  onReset,
}) {
  return (
    // Container utama tampilan empty state
    <div
      className="
        w-full py-14
        flex flex-col items-center justify-center
        text-center
        rounded-2xl
        border border-[#E6D5BC]
        bg-[#FFF8ED]
        transition-all duration-500
        animate-fade-in
      "
    >
      {/* Icon ilustrasi (emoji rumah) */}
      <div
        className="
          w-16 h-16 mb-4
          rounded-full
          bg-[#F3E6D4]
          border border-[#E6D5BC]
          flex items-center justify-center
          text-3xl
        "
      >
        🏠
      </div>

      {/* Judul empty state */}
      <h3 className="text-lg md:text-xl font-bold text-[#6B4423]">
        {title}
      </h3>

      {/* Deskripsi empty state */}
      <p className="mt-2 text-sm text-[#9C7A4F] max-w-md px-4">
        {description}
      </p>

      {/* Tombol reset hanya muncul jika onReset dikirim */}
      {onReset && (
        <button
          onClick={onReset} // Panggil fungsi reset saat tombol diklik
          className="
            mt-5 px-6 py-2
            rounded-lg
            bg-[#EFE6DA] text-[#6B4423]
            font-semibold
            border border-[#E6D5BC]
            transition-all duration-300
            hover:bg-[#E6D5BC]
            active:scale-95
          "
        >
          Reset Pencarian
        </button>
      )}
    </div>
  );
}