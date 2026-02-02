import { Geist, Geist_Mono, Playfair, Raleway } from "next/font/google";
export const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

export const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const appBodyFont = Raleway({
  variable: "--app-body-font",
  subsets: ["latin"],
});

export const playFair = Playfair({
  variable: "--app-body-font",
  subsets: ["latin"],
});
