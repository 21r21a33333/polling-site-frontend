// src/components/RegisterForm.tsx
import React from "react";

interface RegisterFormProps {
  email: string;
  username: string;
  error: string;
  setEmail: (email: string) => void;
  setUsername: (username: string) => void;
  handleRegister: (e: React.FormEvent<HTMLFormElement>) => void;
}

const RegisterForm: React.FC<RegisterFormProps> = ({
  email,
  username,
  error,
  setEmail,
  setUsername,
  handleRegister,
}) => {
  return (
    <div className="relative flex flex-col rounded-xl bg-transparent items-center justify-center">
      <h4 className="block text-xl font-medium text-slate-800">Register</h4>
      <p className="text-slate-500 font-light">Enter Credentials</p>
      <form
        className="mt-8 mb-2 w-80 max-w-screen-lg sm:w-96"
        onSubmit={handleRegister}
      >
        <div className="mb-1 flex flex-col gap-6">
          <div className="w-full max-w-sm min-w-[200px]">
            <label className="block mb-2 text-sm text-slate-600">Email</label>
            <input
              type="email"
              className="w-full bg-transparent placeholder:text-slate-400 text-slate-700 text-sm border border-slate-200 rounded-md px-3 py-2 transition duration-300 ease focus:outline-none focus:border-slate-400 hover:border-slate-300 shadow-sm focus:shadow"
              placeholder="Your Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
        </div>
        <div className="mb-1 flex flex-col gap-6">
          <div className="w-full max-w-sm min-w-[200px]">
            <label className="block mb-2 text-sm text-slate-600">
              Username
            </label>
            <input
              type="text"
              className="w-full bg-transparent placeholder:text-slate-400 text-slate-700 text-sm border border-slate-200 rounded-md px-3 py-2 transition duration-300 ease focus:outline-none focus:border-slate-400 hover:border-slate-300 shadow-sm focus:shadow"
              placeholder="Your Username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
            />
          </div>
        </div>

        <button
          className="mt-4 w-full rounded-md bg-slate-800 py-2 px-4 border border-transparent text-center text-sm text-white transition-all shadow-md hover:shadow-lg focus:bg-slate-700 focus:shadow-none active:bg-slate-700 hover:bg-slate-700 active:shadow-none disabled:pointer-events-none disabled:opacity-50 disabled:shadow-none"
          type="submit"
        >
          Register
        </button>
      </form>
      {error && <p className="text-red-500">{error}</p>}
    </div>
  );
};

export default RegisterForm;
