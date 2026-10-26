import "./globals.css";

export const metadata = {
  title: "Devis & Factures — ECO PUMP AFRIK",
  description:
    "Générateur de devis et factures avec en-tête officiel ECO PUMP AFRIK : calcul automatique TVA / TTC, montant en lettres et export PDF.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="fr">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
        <link
          href="https://fonts.googleapis.com/css2?family=Archivo:wght@500;600;700;800&family=Source+Sans+3:wght@400;600;700&display=swap"
          rel="stylesheet"
        />
      </head>
      <body>{children}</body>
    </html>
  );
}
