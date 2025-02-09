import "../styles/globals.css";
import Header from "../components/Header";
import { ReactNode } from 'react';
import { Metadata } from 'next';



export const metadata: Metadata = {
  title: 'Chatter App',
  description: 'Join our dev community!',
  icons: {
    icon: '/logo.png',
  },
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body>
        <Header />
        <main>{children}</main>
      </body>
    </html>
  );
}
