export default function SocialCard({
  title,
  handle,
  desc,
  href,
  Icon,
  color = "#5C4033",
}) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noreferrer"
      className="
        group block h-full
        rounded-2xl border border-gray-200
        bg-white shadow-sm
        transition-all duration-300
        hover:-translate-y-1 hover:shadow-lg
        active:scale-[0.98]
      "
    >
      <div className="p-5 flex items-start gap-4">
        {/* Icon */}
        <div className="transition-transform duration-300 group-hover:scale-110">
          <Icon
            className="w-7 h-7"
            style={{ color }}
          />
        </div>

        {/* Content */}
        <div className="min-w-0">
          {/* Judul */}
          <h3 className="text-base font-semibold text-[#5C4033]">
            {title}
          </h3>

          {/* Handle */}
          {handle && (
            <p className="text-sm font-medium text-[#8B6F47] mt-0.5">
              {handle}
            </p>
          )}

          {/* Deskripsi */}
          {desc && (
            <p className="text-sm text-[#8B6F47] mt-2 leading-relaxed line-clamp-2">
              {desc}
            </p>
          )}

          {/* CTA */}
          <span
            className="
              mt-3 inline-flex items-center gap-1
              text-sm font-semibold
              transition-transform duration-200
              group-hover:translate-x-0.5
            "
            style={{ color }}
          >
            Kunjungi
            <span aria-hidden>→</span>
          </span>
        </div>
      </div>
    </a>
  );
}
