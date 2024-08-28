import { Inter } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/Navbar";
import { Toaster } from "react-hot-toast";
import Providers from "@/components/Providers";
import { createMetadata } from "@/lib/metadata";

const inter = Inter({ subsets: ["latin"] });

export async function generateMetadata() {
  return createMetadata({
    title: "Doug's Grubs",
    description: "A food blog by Doug",
    image: 'https://i.pinimg.com/736x/5e/99/52/5e99520776c93392211f7d41f043ed32.jpg', 
    imageAlt: 'hamburger emoji' 
  });
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <Providers>
          <Navbar />
          {children}
          <Toaster />
        </Providers>
      </body>
    </html>
  );
}
