export const metadata = {
  title: "AnnSeva",
  description: "Connecting surplus food with those who need it most.",
};

import "./globals.css";

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}