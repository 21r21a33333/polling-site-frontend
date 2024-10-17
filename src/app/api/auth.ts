// api/auth.ts
import { RegisterStartRequest, RegisterStartResponse } from "@/types";

export const startRegistration = async (
  username: string
): Promise<RegisterStartResponse> => {
  const response = await fetch("http://localhost:3001/registrationstart", {
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
