import { ReactNode } from "react";

type LayoutProps = {
  children: ReactNode;
};

export default function Layout({ children }: LayoutProps) {
  return (
    <div style={{ padding: "2rem", fontFamily: "sans-serif" }}>
      <header>
        <h1>My Next.js App</h1>
      </header>
      <main>{children}</main>
    </div>
  );
}
