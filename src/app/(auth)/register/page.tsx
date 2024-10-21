"use client";
import React, { useState } from "react";
import { startRegistration } from "@simplewebauthn/browser";
import { useRouter } from "next/navigation";
const Register: React.FC = () => {
  const Router = useRouter();
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");

  const handleLogin = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(""); // Clear any previous errors
    try {
      const NEXT_PUBLIC_API_URL = process.env.NEXT_PUBLIC_API_URL;
      const resp = await fetch(NEXT_PUBLIC_API_URL + "/register/start", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Cache-Control": "no-store",
        },
        body: JSON.stringify({
          email,
          display_name: username,
        }),
      });

      if (!resp.ok) {
        if (resp.status === 400) {
          setError("User already exists");
        } else {
          setError(`Server error: ${resp.status} ${resp.statusText}`);
        }
        return;
      }

      const data = await resp.json();
      if (!data || !data.publicKey) {
        setError("Invalid server response: missing publicKey");
        return;
      }

      try {
        const obj = data.publicKey;
        const attResp = await startRegistration({ optionsJSON: obj });
        console.log("Registration response:", attResp); // Debug log

        // POST the response to the endpoint that calls
        // @simplewebauthn/server -> verifyRegistrationResponse()
        const NEXT_PUBLIC_API_URL = process.env.NEXT_PUBLIC_API_URL;
        const verificationResp = await fetch(
          NEXT_PUBLIC_API_URL + "/register/finish",
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              "Cache-Control": "no-store",
            },
            body: JSON.stringify({
              email,
              public_key_credential: attResp,
            }),
          }
        );

        // Wait for the results of verification
        console.log("Waiting for verification response..."); // Debug log
        const verificationJSON = await verificationResp.json();
        console.log("Verification response:", verificationJSON); // Debug log
        // Handle successful registration (e.g., redirect or update UI)
        Router.push("/login");
      } catch (error) {
        if (error instanceof Error) {
          console.error("Registration error:", error);
          setError(`Registration error: ${error.name} - ${error.message}`);
        } else {
          setError("An unknown error occurred during registration");
        }
      }
    } catch (err) {
      console.error("Fetch error:", err);
      setError("Network error during registration");
    }
  };

  return (
    <>
      <div className="relative flex flex-col rounded-xl bg-transparent items-center justify-center">
        <h4 className="block text-xl font-medium text-slate-800">Register</h4>
        <p className="text-slate-500 font-light">Enter Credentials</p>
        <form
          className="mt-8 mb-2 w-80 max-w-screen-lg sm:w-96"
          onSubmit={handleLogin}
        >
          <div className="mb-1 flex flex-col gap-6">
            <div className="w-full max-w-sm min-w-[200px]">
              <label className="block mb-2 text-sm text-slate-600">Email</label>
              <input
                type="email"
                className="w-full bg-transparent placeholder:text-slate-400 text-slate-700 text-sm border border-slate-200 rounded-md px-3 py-2 transition duration-300 ease focus:outline-none focus:border-slate-400 hover:border-slate-300 shadow-sm focus:shadow"
                placeholder="Your Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
          </div>
          <div className="mb-1 flex flex-col gap-6">
            <div className="w-full max-w-sm min-w-[200px]">
              <label className="block mb-2 text-sm text-slate-600">
                UserName
              </label>
              <input
                type="text"
                className="w-full bg-transparent placeholder:text-slate-400 text-slate-700 text-sm border border-slate-200 rounded-md px-3 py-2 transition duration-300 ease focus:outline-none focus:border-slate-400 hover:border-slate-300 shadow-sm focus:shadow"
                placeholder="Your Email"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
              />
            </div>
          </div>

          <button
            className="mt-4 w-full rounded-md bg-slate-800 py-2 px-4 border border-transparent text-center text-sm text-white transition-all shadow-md hover:shadow-lg focus:bg-slate-700 focus:shadow-none active:bg-slate-700 hover:bg-slate-700 active:shadow-none disabled:pointer-events-none disabled:opacity-50 disabled:shadow-none"
            type="submit"
          >
            Login
          </button>
        </form>
        {error && <p className="text-red-500">{error}</p>}
      </div>
    </>
  );
};

export default Register;
