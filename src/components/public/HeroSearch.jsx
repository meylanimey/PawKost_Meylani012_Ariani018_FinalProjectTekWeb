import { useState } from "react";

import SearchBar from "@/components/public/SearchBar";

export default function HeroSearch({ onSearch }) {
  const [query, setQuery] = useState("");

  return (
    <section className="w-full">
      <div className="mx-auto max-w-6xl px-4 pt-8 pb-6">
        <div className="flex justify-center items-center gap-3">
          <h1 className="mt-4 text-2xl md:text-3xl font-bold text-[#6B4423]">
            Maw Cari Kost Apa?
          </h1>

          <div>
            {
              <img
                src="/images/cat.png"
                alt="cat"
                className="w-24 md:w-24 -mb-6"
              />
            }
          </div>
        </div>

        <div className="mt-3">
          <SearchBar
            value={query}
            onChange={setQuery}
            onSubmit={(payload) => {
              onSearch?.(payload);
            }}
          />
        </div>
      </div>
    </section>
  );
}