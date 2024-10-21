"use client";
import "./globals.css";
import { store } from "./store/store";
import { Provider } from "react-redux";
import { useAuth } from "./hooks/useAuth";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        <Provider store={store}>
          <AuthWrapper>
            <div className="container mx-auto">{children}</div>
          </AuthWrapper>
        </Provider>
      </body>
    </html>
  );
}

// Separate component to ensure useAuth is called inside the Redux provider
function AuthWrapper({ children }: { children: React.ReactNode }) {
  useAuth(); // Now this will have access to dispatch
  return children;
}
