// types/auth.ts
export interface RegisterStartRequest {
  username: string;
}

export interface RegisterStartResponse {
  challenge: string; // The challenge in base64url format
  user_id: string; // User ID (UUID)
}

export interface CredentialData {
  id: string; // The credential ID
  rawId: string; // Base64url encoded rawId
  response: {
    attestationObject: string; // Base64url encoded attestation object
    clientDataJSON: string; // Base64url encoded client data JSON
  };
  type: string; // The credential type
}
