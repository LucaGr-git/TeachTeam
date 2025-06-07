import Link from "next/link";
import { useRouter } from "next/router";

const Navigation = () => {
  const router = useRouter();

  return (
    <nav className="bg-gray-800 p-4">
      <div className="container mx-auto flex space-x-4">
        <Link
          href="/pets"
          className={`text-white hover:text-gray-300 px-3 py-2 rounded-md ${
            router.pathname === "/pets" ? "bg-gray-900" : ""
          }`}
        >
          Pets
        </Link>
        <Link
          href="/"
          className={`text-white hover:text-gray-300 px-3 py-2 rounded-md ${
            router.pathname === "/" ? "bg-gray-900" : ""
          }`}
        >
          Profiles
        </Link>
      </div>
    </nav>
  );
};

export default Navigation;
