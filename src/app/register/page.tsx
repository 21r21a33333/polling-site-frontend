"use client";
import React, { useState } from "react";
import { startRegistration } from "@simplewebauthn/browser";

const Register: React.FC = () => {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");

  const handleRegister = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(""); // Clear any previous errors
    try {
      const resp = await fetch("http://localhost:3001/register/start", {
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
        const verificationResp = await fetch(
          "http://localhost:3001/register/finish",
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
    <form onSubmit={handleRegister}>
      <h1>Register</h1>
      <br />
      <label>
        Username:
        <input
          className="bg-gray-200 text-black"
          type="text"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          required
        />
      </label>
      <br />
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
      <button type="submit">Register</button>
      {error && <p className="text-red-500">{error}</p>}
    </form>
  );
};

export default Register;
