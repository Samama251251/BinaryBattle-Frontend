import type { Metadata } from "next";
import "./globals.css";
import SessionWrapper from "./components/SessionWrapper";
import Sidebar from "./components/Sidebar";
import { WebSocketProvider } from "./contexts/WebSocketContext";
import { Toaster } from "react-hot-toast";


export const metadata: Metadata = {
  title: "Create Next App",
  description: "Generated by create next app",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">

      <body
        className={`text-base-content`}>
        <SessionWrapper>
          <WebSocketProvider>
            <Sidebar />
            {children}
            <Toaster />
          </WebSocketProvider>
        </SessionWrapper>
      </body>
    </html>
  );
}
