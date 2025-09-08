import Footer from "@/components/Footer";
import Header from "@/components/Header";
import "./globals.css";
import Providers from "./providers";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html suppressHydrationWarning className="!scroll-smooth" lang="en">
      <body>
        <Providers>
          <div className="isolate flex min-h-screen flex-col">
            <Header />

            <main className="flex-1">{children}</main>

            <Footer />
          </div>
        </Providers>
      </body>
    </html>
  );
}
