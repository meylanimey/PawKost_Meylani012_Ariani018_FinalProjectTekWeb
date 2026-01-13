export default function EmptyKost({
  title = "Kost tidak ditemukan",

  description = "Coba ubah kata kunci pencarian atau filter yang kamu pilih.",

  onReset,
}) {
  return (
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

      <h3 className="text-lg md:text-xl font-bold text-[#6B4423]">{title}</h3>

      <p className="mt-2 text-sm text-[#9C7A4F] max-w-md px-4">{description}</p>

      {onReset && (
        <button
          onClick={onReset}
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