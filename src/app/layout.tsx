import type { Metadata } from "next";
import "./globals.css";
import { ClerkProvider } from "@clerk/nextjs";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import Chatbot from "@/components/Chatbot";

export const metadata: Metadata = {
  title: "KrishokBondhu",
  description:
    "Help the farmers to detect diseases in their crops, recommend fertilizers and recommend crops to grow based on the soil type.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ClerkProvider dynamic>
    <html lang="en">
      <body>
      <Navbar />
        <main className="Relative overflow">
          {children}
          <Chatbot />
        </main>
        <Footer />
      </body>
    </html>
    </ClerkProvider>
  );
}
