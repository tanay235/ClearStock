import './globals.css';

export const metadata = {
  title: 'AnnSeva — Connecting Surplus Food With Those Who Need It Most',
  description:
    'AnnSeva is a real-time food donation platform that connects restaurants, hotels, and mess facilities with NGOs, shelters, and volunteers — reducing food waste and fighting hunger in your community.',
  keywords: 'food donation, NGO, surplus food, food waste, hunger, community, AnnSeva',
  openGraph: {
    title: 'AnnSeva — Save Food. Serve Lives.',
    description:
      'Real-time food donation platform connecting donors with NGOs and communities in need.',
    type: 'website',
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800;900&display=swap"
          rel="stylesheet"
        />
        <link rel="icon" href="/favicon.ico" />
      </head>
      <body>{children}</body>
    </html>
  );
}
