import Navbar from "../../components/public/Navbar";
import KostCard from "../../components/public/KostCard";
import { kosts } from "../../data/kosts";

export default function Home() {
  return (
    <>
      <main className="max-w-7xl mx-auto px-6 py-10">
        <h1 className="text-2xl font-bold mb-6">
          Daftar Kamar Kost
        </h1>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {kosts.map((kost) => (
            <KostCard key={kost.id} kost={kost} />
          ))}
        </div>
      </main>
    </>
  );
}