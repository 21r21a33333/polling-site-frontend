// app/components/ProtectedRoute.js
"use client";
import { useSelector } from "react-redux";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function ProtectedRoute({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const isAuthenticated: boolean = useSelector(
    (state: { auth: { isAuthenticated: boolean } }) =>
      state.auth.isAuthenticated
  );
  const isLoading: boolean = useSelector(
    (state: { auth: { isLoading: boolean } }) => state.auth.isLoading
  );

  useEffect(() => {
    if (!isAuthenticated && !isLoading) {
      router.push("/login");
    }
  }, [isAuthenticated, router, isLoading]);

  return isAuthenticated ? children : null;
}
