import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "TheJoblessPeoples – Jobs, Freelance & Career Network",
  description:
    "A hybrid social platform combining Twitter-style feed, LinkedIn profiles, and Upwork marketplace for job seekers and companies.",
  keywords: "jobs, freelance, career, hiring, network, react developer, india",
  openGraph: {
    title: "TheJoblessPeoples",
    description: "Find Jobs, Post Projects, Build Your Career",
    type: "website",
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
      </head>
      <body className="antialiased min-h-screen" style={{ backgroundColor: "#000000" }}>{children}</body>
    </html>
  );
}
