"use client";
import { fetchPollStats } from "@/app/store/poolStatSlice";
import { AppDispatch } from "@/app/store/store";
import { useEffect } from "react";
import { toast } from "react-toastify";

// WebSocket handler component
export const WebSocketHandler: React.FC<{
  pollid: number;
  dispatch: AppDispatch;
  setLoading: (state: boolean) => void;
}> = ({ pollid, dispatch, setLoading }) => {
  let wsBaseUrl = process.env.NEXT_PUBLIC_API_URL || "ws://localhost:3001";
  wsBaseUrl = wsBaseUrl.split("//")[1];
  const wsUrl = `ws://${wsBaseUrl}/ws/${pollid}`;

  useEffect(() => {
    const socket = new WebSocket(wsUrl);

    socket.onopen = () => {
      console.log("Connected to WebSocket server.");
    };

    socket.onmessage = (event) => {
      toast.info("Update received from server");
      console.log("Message from server:", event.data);
      if (event.data.startsWith("update")) {
        setLoading(true);
        dispatch(fetchPollStats(pollid)).finally(() => setLoading(false));
      }
    };

    socket.onclose = () => {
      console.log("Disconnected from WebSocket server.");
    };

    socket.onerror = (error) => {
      console.error("WebSocket Error:", error);
    };

    return () => {
      socket.close();
    };
  }, [wsUrl, pollid, dispatch, setLoading]);

  return null;
};
