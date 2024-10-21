"use client";
// src/pages/register.tsx
import React from "react";
import { useRegister } from "@/app/hooks/useRegister";
import RegisterForm from "@/app/components/auth/RegisterForm";

const Register: React.FC = () => {
  const { email, username, error, setEmail, setUsername, handleRegister } =
    useRegister();

  return (
    <RegisterForm
      email={email}
      username={username}
      error={error}
      setEmail={setEmail}
      setUsername={setUsername}
      handleRegister={handleRegister}
    />
  );
};

export default Register;
