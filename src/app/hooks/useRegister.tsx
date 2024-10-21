"use client";
// src/hooks/useRegister.ts
import { useState } from "react";
import { startRegistration } from "@simplewebauthn/browser";
import { useRouter } from "next/navigation";

export const useRegister = () => {
  const Router = useRouter();
  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [error, setError] = useState("");

  const handleRegister = async (e: React.FormEvent<HTMLFormElement>) => {
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
        console.log("Registration response:", attResp);

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

        const verificationJSON = await verificationResp.json();
        console.log("Verification response:", verificationJSON);

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

  return {
    email,
    username,
    error,
    setEmail,
    setUsername,
    handleRegister,
  };
};
