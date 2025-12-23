import { Link } from "react-router-dom";

export default function Navbar() {
  return (
    <nav className="border-b bg-white">
      <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
        <Link to="/" className="text-xl font-bold text-indigo-600">
          Paw Kost
        </Link>

        <div className="text-sm text-gray-600">
          Temukan kost impianmu
        </div>
      </div>
    </nav>
  );
}