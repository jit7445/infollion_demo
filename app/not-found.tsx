import Link from "next/link";

export default function NotFound() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center text-center px-4 bg-[#FDFCF7] text-[#3C3A38]">
      <h1 className="text-8xl font-black text-[#ec9324] mb-4">404</h1>
      <h2 className="text-2xl font-bold uppercase tracking-widest mb-8 text-[#3C3A38]">Page Not Found</h2>
      <p className="max-w-md opacity-60 mb-12 text-[#3C3A38]">
        The expert you're looking for or the page you've requested seems to have moved or doesn't exist.
      </p>
      <Link 
        href="/"
        className="px-8 py-3 bg-[#ec9324] text-white font-bold rounded-full uppercase tracking-widest text-xs transition-all hover:scale-105 active:scale-95"
      >
        Return to Home
      </Link>
    </div>
  );
}
