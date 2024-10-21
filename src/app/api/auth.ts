// api/auth.ts
import { RegisterStartRequest, RegisterStartResponse } from "@/types";

export const startRegistration = async (
  username: string
): Promise<RegisterStartResponse> => {
  const NEXT_PUBLIC_API_URL = process.env.NEXT_PUBLIC_API_URL;
  const response = await fetch(NEXT_PUBLIC_API_URL + "/registrationstart", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Cache-Control": "no-store",
    },
    body: JSON.stringify({ username } as RegisterStartRequest),
  });

  if (!response.ok) {
    throw new Error("Failed to start registration");
  }

  return response.json();
};
