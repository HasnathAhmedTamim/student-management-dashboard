import type { Metadata } from "next";
import { Fraunces, Source_Sans_3 } from "next/font/google";
import { StoreProvider } from "@/store/provider";
import "./globals.css";

const sourceSans = Source_Sans_3({
  variable: "--font-source-sans",
  subsets: ["latin"],
});

const fraunces = Fraunces({
  variable: "--font-fraunces",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Student Management Dashboard | EduAyna",
  description:
    "Manage students with search, filters, and CRUD operations powered by Next.js, Redux Toolkit, and PostgreSQL.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${sourceSans.variable} ${fraunces.variable} min-h-screen antialiased`}
      >
        <StoreProvider>
          <main className="min-h-screen">{children}</main>
        </StoreProvider>
      </body>
    </html>
  );
}
