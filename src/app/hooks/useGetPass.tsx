import { useState } from "react";
import { startAuthentication } from "@simplewebauthn/browser";

export const useGetPass = () => {
  const [error, setError] = useState("");

  const getPass = async (email: string, option_id: string) => {
    setError(""); // Clear any previous errors
    try {
      const NEXT_PUBLIC_API_URL = process.env.NEXT_PUBLIC_API_URL;
      const resp = await fetch(NEXT_PUBLIC_API_URL + "/start_verification", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Cache-Control": "no-store",
          authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify({ email }),
      });

      if (!resp.ok) {
        setError(
          resp.status === 400
            ? "User Not Found"
            : `Server error: ${resp.status} ${resp.statusText}`
        );
        return null;
      }

      const data = await resp.json();
      if (!data || !data.publicKey) {
        setError("Invalid server response: missing publicKey");
        return null;
      }

      const obj = data.publicKey;
      const attResp = await startAuthentication({ optionsJSON: obj });

      const verificationResp = await fetch(NEXT_PUBLIC_API_URL + "/getpass", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Cache-Control": "no-store",
          authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify({
          email,
          public_key_credential: attResp,
          option_id: option_id,
        }),
      });

      const verificationJSON = await verificationResp.json();
      const token = verificationJSON.vote_token;
      return token;
    } catch (err) {
      setError("Network error during Login");
      console.error("Fetch error:", err);
      return null;
    }
  };

  return { getPass, error };
};
