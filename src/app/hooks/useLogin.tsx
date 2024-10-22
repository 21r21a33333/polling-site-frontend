"use client";
import { useState } from "react";
import { startAuthentication } from "@simplewebauthn/browser";
import { useRouter } from "next/navigation";
import jwt from "jsonwebtoken";
import { useDispatch } from "react-redux";
import { loginSuccess } from "@/app/store/authSlice";

export default function useLogin() {
  const Router = useRouter();
  const dispatch = useDispatch();
  const [error, setError] = useState("");

  const handleLogin = async (email: string) => {
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
      const attResp = await startAuthentication({
        optionsJSON: data.publicKey,
      });

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

      const verificationJSON = await verificationResp.json();
      console.log("Login response:", verificationJSON);
      const token = verificationJSON.token;
      localStorage.setItem("token", token);

      const decodedToken = jwt.decode(token);
      if (!decodedToken || typeof decodedToken !== "object") {
        throw new Error("Invalid token");
      }

      const user = decodedToken.sub;
      dispatch(loginSuccess({ user, token }));

      Router.replace("/polls");
    } catch (error) {
      if (error instanceof Error) {
        setError(`Login error: ${error.name} - ${error.message}`);
      } else {
        setError("An unknown error occurred during Login");
      }
    }
  };

  return { handleLogin, error };
}
