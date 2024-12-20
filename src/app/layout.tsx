import type { Metadata } from "next";

import "./globals.css";



export const metadata: Metadata = {
  title: "Pentagram",
  description: "Real-time Image Diffusion Model",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`antialiased bg-black text-white min-h-screen`}
      >
        {children}
      </body>
    </html>
  );
}
