import Link from "next/link";
import { Home, Search } from "lucide-react";

export default function NotFound() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-alabaster px-4">
      <div className="text-center">
        <p className="font-editorial text-7xl font-bold text-forest-800">404</p>
        <h1 className="mt-4 font-heading text-3xl font-extrabold text-navy-900">
          Page not found
        </h1>
        <p className="mx-auto mt-2 max-w-md text-navy-500">
          The page you are looking for doesn't exist or may have been moved.
        </p>
        <div className="mt-8 flex flex-wrap justify-center gap-3">
          <Link href="/" className="btn-primary">
            <Home className="h-4 w-4" /> Back to Home
          </Link>
          <Link href="/plots" className="btn-outline">
            <Search className="h-4 w-4" /> Explore Plots
          </Link>
        </div>
      </div>
    </div>
  );
}
