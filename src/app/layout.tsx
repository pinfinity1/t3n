import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "T3N Confidential Sentinel | Enterprise Autonomous Agent",
  description:
    "Hardware TEE-enforced settlement and compliance agent built on Terminal 3 ADK",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="h-full antialiased dark">
      <body className="min-h-full flex flex-col bg-slate-950 text-slate-100 font-sans selection:bg-indigo-500 selection:text-white">
        {children}
      </body>
    </html>
  );
}
