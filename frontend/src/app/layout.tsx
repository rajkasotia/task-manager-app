import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Task Manager App",
  description: "A simple task management app",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body style={{ fontFamily: "sans-serif" }}>
        <div style={{ padding: "2rem" }}>
          <header>
            <h1>My Next.js App</h1>
          </header>
          <main>{children}</main>
        </div>
      </body>
    </html>
  );
}


