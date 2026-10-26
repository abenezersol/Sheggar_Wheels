import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Sheggar Wheels | Peer-to-Peer Car Rental in Addis Ababa",
  description: "Rent cars from locals in Addis Ababa. Fast, secure, and easy.",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">

      <body className="antialiased bg-slate-50 text-slate-900 min-h-screen">{children}</body>

    </html>
  );
}
