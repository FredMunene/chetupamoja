import { Geist, Geist_Mono, Inter } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

export const metadata = {
  title: "ChetuPamoja - Tech Challenge Feeding Program",
  description: "Help us fuel young minds with nutritious snacks and smiles during our upcoming tech challenge. Every donation makes a difference in inspiring the next generation of innovators.",
  keywords: "tech challenge, feeding program, donation, education, innovation, Kenya",
  authors: [{ name: "ChetuPamoja" }],
  openGraph: {
    title: "ChetuPamoja - Tech Challenge Feeding Program",
    description: "Help us fuel young minds with nutritious snacks and smiles during our upcoming tech challenge.",
    type: "website",
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} ${inter.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}