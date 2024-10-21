"use client";
import React from "react";
import useLogin from "@/app/hooks/useLogin";
import LoginForm from "@/app/components/auth/LoginForm";

const Login: React.FC = () => {
  const { handleLogin, error } = useLogin();

  return (
    <div>
      <LoginForm onLogin={handleLogin} error={error} />
    </div>
  );
};

export default Login;
