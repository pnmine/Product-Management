import { Geist, Geist_Mono,Prompt } from "next/font/google";
import "./globals.css";
import Navbar from "../components/NavBar";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata = {
  title: "Product Management",
  description: "Product Management",
};

const prompt = Prompt({ 
  subsets: ['thai', 'latin'],
  weight: ['100', '200', '300', '400', '500', '600', '700', '800', '900']
});

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body
        className={`${prompt.className} bg-gradient-to-t from-slate-300  to-slate-50 h-full`}
      >
        <Navbar/>
        {children}
      </body>
    </html>
  );
}
