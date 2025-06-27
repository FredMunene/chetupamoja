import Image from "next/image";
import Link from "next/link";

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-sky-100 via-white to-amber-50 dark:from-neutral-900 dark:via-neutral-950 dark:to-sky-950 font-sans p-0">
      {/* Hero Section */}
      <section className="w-full py-12 px-4 flex flex-col items-center bg-sky-200/60 dark:bg-sky-900/60">
        <h1 className="text-4xl sm:text-5xl font-extrabold mb-2 text-sky-700 dark:text-sky-200 text-center tracking-tight font-[Inter,Helvetica,sans-serif]">
          Tech Challenge Feeding Program
        </h1>
        <p className="text-lg sm:text-xl text-sky-900 dark:text-sky-100 mb-4 text-center max-w-xl font-[Inter,Helvetica,sans-serif]">
          Help us fuel young minds with snacks and smiles during our upcoming tech challenge!
        </p>
        <Link href="/donate">
          <button className="mt-2 px-8 py-3 rounded-full bg-sky-600 hover:bg-sky-700 text-white font-semibold text-lg shadow-lg transition-colors focus:outline-none focus:ring-2 focus:ring-sky-400 focus:ring-offset-2">
            Donate Now
          </button>
        </Link>
      </section>

      {/* Info Card Section */}
      <section className="w-full flex justify-center py-10 px-4 bg-white dark:bg-neutral-900">
        <div className="w-full max-w-lg bg-amber-50 dark:bg-neutral-800 rounded-3xl shadow-xl border border-sky-100 dark:border-sky-900 p-8 flex flex-col items-center">
          <h2 className="text-2xl font-bold mb-3 text-sky-700 dark:text-sky-200 text-center font-[Inter,Helvetica,sans-serif]">
            Why Your Donation Matters
          </h2>
          <p className="mb-4 text-sky-900 dark:text-sky-100 text-center text-base font-[Inter,Helvetica,sans-serif]">
            Every shilling you give will go directly to providing healthy snacks and refreshments for kids participating in our tech challenge. Your support keeps their energy high, their minds sharp, and their hearts inspired to learn and create!
          </p>
          <ul className="w-full grid gap-2 sm:grid-cols-2 list-none mb-4">
            <li className="flex items-center gap-2 p-2 rounded-lg bg-sky-100 dark:bg-sky-950/40 text-sm">
              <span className="text-sky-600 dark:text-sky-300 font-bold">🍎</span>
              Nutritious snacks
            </li>
            <li className="flex items-center gap-2 p-2 rounded-lg bg-sky-100 dark:bg-sky-950/40 text-sm">
              <span className="text-sky-600 dark:text-sky-300 font-bold">🤝</span>
              Teamwork & creativity
            </li>
            <li className="flex items-center gap-2 p-2 rounded-lg bg-sky-100 dark:bg-sky-950/40 text-sm">
              <span className="text-sky-600 dark:text-sky-300 font-bold">💡</span>
              Fuels innovation
            </li>
            <li className="flex items-center gap-2 p-2 rounded-lg bg-sky-100 dark:bg-sky-950/40 text-sm">
              <span className="text-sky-600 dark:text-sky-300 font-bold">🌟</span>
              Memorable experience
            </li>
          </ul>
          <p className="text-md text-sky-700 dark:text-sky-200 text-center font-semibold mt-4 font-[Inter,Helvetica,sans-serif]">
            Your donation will put a smile on a child's face and help spark the next generation of tech innovators. Thank you for making a difference!
          </p>
        </div>
      </section>

      {/* Footer */}
      <footer className="w-full max-w-2xl text-center text-xs text-sky-700 dark:text-sky-200 mt-8 pb-4 font-[Inter,Helvetica,sans-serif]">
        &copy; {new Date().getFullYear()} Tech Challenge Feeding Program. Powered by ChetuPamoja.
      </footer>
    </div>
  );
}
