"use client";
import React, { useState } from "react";
import { startAuthentication } from "@simplewebauthn/browser";
import { useRouter } from "next/navigation";
import jwt from "jsonwebtoken";
import { useDispatch } from "react-redux";
import { loginSuccess } from "@/app/store/authSlice";

const Register: React.FC = () => {
  const Router = useRouter();
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const dispatch = useDispatch();

  const handleRegister = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(""); // Clear any previous errors
    try {
      const NEXT_PUBLIC_API_URL = process.env.NEXT_PUBLIC_API_URL;
      const resp = await fetch(NEXT_PUBLIC_API_URL + "/login/start", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Cache-Control": "no-store",
        },
        body: JSON.stringify({
          email,
        }),
      });

      if (!resp.ok) {
        if (resp.status === 400) {
          setError("User Not Found");
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
      console.log(data);
      try {
        const obj = data.publicKey;
        const attResp = await startAuthentication({ optionsJSON: obj });
        console.log("Login response:", attResp); // Debug log

        // POST the response to the endpoint that calls
        // @simplewebauthn/server -> verifyRegistrationResponse()
        const NEXT_PUBLIC_API_URL = process.env.NEXT_PUBLIC_API_URL;
        const verificationResp = await fetch(
          NEXT_PUBLIC_API_URL + "/login/finish",
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
        // Save token to localStorage
        const token = verificationJSON.token;
        localStorage.setItem("token", token);

        // Decode token to get user info
        const decodedToken = jwt.decode(token);
        if (!decodedToken || typeof decodedToken !== "object") {
          throw new Error("Invalid token");
        }
        const user = decodedToken.sub;

        // Dispatch login success
        dispatch(loginSuccess({ user, token }));
        Router.replace("/polls");
      } catch (error) {
        if (error instanceof Error) {
          console.error("Login error:", error);
          setError(`Login error: ${error.name} - ${error.message}`);
        } else {
          setError("An unknown error occurred during Login");
        }
      }
    } catch (err) {
      console.error("Fetch error:", err);
      setError("Network error during Login");
    }
  };

  return (
    <>
      <div className="relative flex flex-col rounded-xl bg-transparent items-center justify-center">
        <h4 className="block text-xl font-medium text-slate-800">Login</h4>
        <p className="text-slate-500 font-light">Enter Credentials</p>
        <form
          className="mt-8 mb-2 w-80 max-w-screen-lg sm:w-96"
          onSubmit={handleRegister}
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
