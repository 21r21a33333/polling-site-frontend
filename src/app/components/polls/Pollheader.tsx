"use client";
import React, { useState } from "react";
import Link from "next/link";
import { useSelector } from "react-redux";
import { RootState } from "@/app/store/store";

function Pollheader() {
  const user = useSelector((state: RootState) => state.auth.user);
  const [isDropdownOpen, setDropdownOpen] = useState(false);
  const handleLogout = () => {
    // Remove the token from localStorage
    localStorage.removeItem("token");

    window.location.href = "/login";
  };

  const toggleDropdown = () => {
    setDropdownOpen(!isDropdownOpen);
  };
  return (
    <header className="border-b border-gray-200 bg-gray-50 mb-12">
      <div className="mx-auto max-w-screen-xl px-4 py-8 sm:px-6 sm:py-12 lg:px-8">
        <div className="flex flex-col items-start gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <Link href={"/polls"}>
              <h1 className="text-2xl font-bold text-gray-900 sm:text-3xl">
                Polls
              </h1>
            </Link>

            <p className="mt-1.5 text-sm text-gray-500">
              participate in the polls and share your opinion
            </p>
          </div>

          <div className="flex items-center gap-4">
            <Link href="/polls/manage">
              <button
                className="inline-flex items-center justify-center gap-1.5 rounded border border-gray-200 bg-white px-5 py-3 text-gray-900 transition hover:text-gray-700 focus:outline-none focus:ring"
                type="button"
              >
                <span className="text-sm font-medium"> My Polls </span>

                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="size-4"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth="2"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
                  />
                </svg>
              </button>
            </Link>
            <Link href="/polls/newpoll">
              <button
                className="inline-flex items-center justify-center gap-1.5 rounded border border-gray-200 bg-white px-5 py-3 text-gray-900 transition hover:text-gray-700 focus:outline-none focus:ring"
                type="button"
              >
                <span className="text-sm font-medium"> Create a poll </span>

                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="size-4"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth="2"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
                  />
                </svg>
              </button>
            </Link>
            {/* Profile Dropdown */}
            <div className="relative">
              <button
                onClick={toggleDropdown}
                className="inline-flex items-center justify-center gap-1.5 rounded border border-gray-200 bg-white px-5 py-3 text-gray-900 transition hover:text-gray-700 focus:outline-none focus:ring"
                type="button"
              >
                <span className="text-sm font-medium text-gray-500">
                  {user}
                </span>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fillRule="evenodd"
                    d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                    clipRule="evenodd"
                  />
                </svg>
              </button>

              {isDropdownOpen && (
                <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg z-20">
                  <ul className="py-1 text-gray-700">
                    <li>
                      <button
                        onClick={handleLogout}
                        className="w-full text-left px-4 py-2 hover:bg-gray-100"
                      >
                        Logout
                      </button>
                    </li>
                  </ul>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}

export default Pollheader;
