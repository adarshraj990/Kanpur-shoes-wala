import type { Metadata } from "next";
import { Montserrat, Inter } from "next/font/google";
import "./globals.css";
import { CartProvider } from "@/context/CartContext";
import { AuthProvider } from "@/context/AuthContext";
import { VisitorTracker } from "@/components/VisitorTracker";

const montserrat = Montserrat({
  variable: "--font-montserrat",
  subsets: ["latin"],
  weight: ["400", "600", "700", "800", "900"],
  display: "swap",
});

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "Kanpur Shoes Wala — Premium Footwear Direct from Kanpur",
  description:
    "Shop premium handcrafted shoes from Kanpur. Direct-to-consumer pricing. Leather shoes, sneakers, slides & more. Free shipping across India.",
  keywords: "Kanpur shoes, buy shoes online India, handcrafted shoes, D2C footwear",
  openGraph: {
    title: "Kanpur Shoes Wala — Premium D2C Footwear",
    description: "Eliminating the middleman. Handcrafted footwear from Kanpur, delivered to your door.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${montserrat.variable} ${inter.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col font-inter bg-white text-[#1A1A1A]">
        <AuthProvider>
          <CartProvider>
            <VisitorTracker />
            {children}
          </CartProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
