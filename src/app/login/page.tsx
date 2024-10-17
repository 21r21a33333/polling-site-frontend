"use client";
import React, { useState } from "react";
import { startAuthentication } from "@simplewebauthn/browser";

const Register: React.FC = () => {
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");

  const handleRegister = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(""); // Clear any previous errors
    try {
      const resp = await fetch("http://localhost:3001/login/start", {
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
        const verificationResp = await fetch(
          "http://localhost:3001/login/finish",
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
    <form onSubmit={handleRegister}>
      <h1>Login</h1>
      <br />
      <label>
        Email:
        <input
          className="bg-gray-200 text-black"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
      </label>
      <br />
      <br />
      <button type="submit">Login</button>
      {error && <p className="text-red-500">{error}</p>}
    </form>
  );
};

export default Register;
