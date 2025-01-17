import "./globals.css";


export default function RootLaout({ children }: { children: React.ReactNode }) {
  return (
    <html>
      <body> {children} </body>
    </html>
  );
}
