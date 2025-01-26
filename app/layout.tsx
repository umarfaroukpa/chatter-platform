import "../styles/globals.css";

import Header from "../components/Header";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        <title>Chatter App</title>
        <meta name="description" content="Join our dev community!" />
        <link rel="icon" href="/logo.png" />
      </head>
      <body>

        <Header />
        <main>{children}</main>
      </body>
    </html>
  );
}
