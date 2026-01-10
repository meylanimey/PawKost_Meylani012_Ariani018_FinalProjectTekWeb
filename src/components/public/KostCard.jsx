import { useNavigate } from "react-router-dom";


export default function KostCard({ kost }) {
  const navigate = useNavigate();


  const goToDetail = () => {
    navigate(`/detail/${kost.id}`);
  };


  return (
    <div
      onClick={goToDetail}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => e.key === "Enter" && goToDetail()}
      className="
        group cursor-pointer
        bg-[#FFF8ED]
        rounded-2xl border border-[#E6D5BC]
        shadow-sm overflow-hidden
        max-w-sm h-full
        transition-all duration-300
        hover:-translate-y-1 hover:shadow-md
        focus:outline-none focus:ring-2 focus:ring-[#E6D5BC]
        flex flex-col
      "
    >
      <div className="p-3">
        <div className="relative overflow-hidden rounded-xl shadow">
          <img
            src={kost.image}
            alt={kost.name}
            className="
              w-full h-48 object-cover
              transition-transform duration-500
              group-hover:scale-110
            "
          />
          <div className="absolute inset-0 bg-black/10 group-hover:bg-black/0 transition" />
        </div>
      </div>


      <div className="px-4 pb-4 flex flex-col flex-1">
        <div className="flex items-start justify-between gap-2">
          <h3 className="text-lg font-medium text-[#6B4423] leading-snug">
            {kost.name}
          </h3>


          {kost.type && (
            <span
              className="
                px-3 py-1 text-xs rounded-full
                bg-[#EFE6DA] text-[#6B4423]
                border border-[#E6D5BC]
                font-medium shrink-0
              "
            >
              {kost.type}
            </span>
          )}
        </div>


        <p className="mt-1 text-sm text-[#9C7A4F]">{kost.location}</p>


        <p className="mt-1 text-sm font-medium text-green-600">Tersedia</p>


        <div className="mt-3 flex flex-wrap gap-2">
          {kost.facilities?.slice(0, 5).map((f, i) => (
            <span
              key={i}
              className="
                px-3 py-1 text-xs rounded-full
                bg-[#F3E6D4] text-[#8B6F47]
                border border-[#E6D5BC]
              "
            >
              {f}
            </span>
          ))}
        </div>


        <p className="mt-4 text-lg font-medium text-[#8B4513]">
          Rp {kost.price.toLocaleString("id-ID")}
          <span className="text-sm font-normal text-[#6B4423]">
            {" "}
            / 3 bulan
          </span>
        </p>


        <div className="mt-auto pt-4">
          <button
            onClick={(e) => {
              e.stopPropagation();
              goToDetail();
            }}
            className="
              w-full py-2.5 rounded-lg
              bg-[#EFE6DA] text-[#6B4423]
              font-medium
              border border-[#E6D5BC]
              transition-all duration-300
              hover:bg-[#E6D5BC]
              active:scale-[0.98]
            "
          >
            Detail
          </button>
        </div>
      </div>
    </div>
  );
}



