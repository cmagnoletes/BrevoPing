import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "BrevoPing",
  description: "Get notified when Brevo creates a new contact.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
