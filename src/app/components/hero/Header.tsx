import React from "react";
import Link from "next/link";

function Header() {
  return (
    <header className="border-b border-gray-200 bg-gray-50 mb-5">
      <div className="mx-auto max-w-screen-xl px-4 py-8 sm:px-6 sm:py-12 lg:px-8">
        <div className="flex flex-col items-start gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 sm:text-3xl">
              POLLY
            </h1>

            <p className="mt-1.5 text-sm text-gray-500">A simple polling app</p>
          </div>

          <div className="flex items-center gap-4">
            <Link href="/login">
              <button
                className="inline-block rounded bg-indigo-600 px-5 py-3 text-sm font-medium text-white transition hover:bg-indigo-700 focus:outline-none focus:ring"
                type="button"
              >
                Login
              </button>
            </Link>
            <Link href="/register">
              <button
                className="inline-block rounded bg-indigo-600 px-5 py-3 text-sm font-medium text-white transition hover:bg-indigo-700 focus:outline-none focus:ring"
                type="button"
              >
                Register
              </button>
            </Link>
          </div>
        </div>
      </div>
    </header>
  );
}

export default Header;
