// app/hooks/useAuth.js
"use client";

import { useEffect } from "react";
import { useDispatch } from "react-redux";
import jwt from "jsonwebtoken";
import { loginSuccess, logoutSuccess } from "../store/authSlice";

export function useAuth() {
  const dispatch = useDispatch();

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      const decodedToken = jwt.decode(token);
      if (
        decodedToken &&
        typeof decodedToken === "object" &&
        "sub" in decodedToken
      ) {
        const user = decodedToken.sub;

        dispatch(loginSuccess({ user, token }));
      } else {
        dispatch(logoutSuccess());
      }
    } else {
      dispatch(logoutSuccess());
    }
  }, [dispatch]);
}
