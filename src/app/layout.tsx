import type { Metadata } from "next";
import "./globals.css";
import { pressStart2P } from './fonts'


export const metadata: Metadata = {
  title: "Exospectra!",
  description: "View stars from everywhere ✨",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={pressStart2P.className}>
      <body>
        {children}
      </body>
    </html>
  );
}
