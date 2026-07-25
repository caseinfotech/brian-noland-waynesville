import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Brian K. Noland | Waynesville Real Estate",
  description:
    "Brian K. Noland is a residential and commercial broker serving Waynesville, Haywood County, and Western North Carolina.",
  openGraph: {
    title: "Brian K. Noland | Western North Carolina Real Estate",
    description:
      "Residential and commercial guidance grounded in eight generations of local knowledge.",
    images: ["/images/belmont-drive.jpg"],
  },
  twitter: {
    card: "summary_large_image",
    title: "Brian K. Noland | Western North Carolina Real Estate",
    description:
      "Residential and commercial guidance grounded in eight generations of local knowledge.",
    images: ["/images/belmont-drive.jpg"],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="scroll-smooth">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin="anonymous"
        />
        <link
          href="https://fonts.googleapis.com/css2?family=DM+Serif+Display:ital@0;1&family=Manrope:wght@300;400;500;600&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="bg-bone font-sans text-ink antialiased">{children}</body>
    </html>
  );
}
