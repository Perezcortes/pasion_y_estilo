// src/app/(sitio)/layout.tsx
import Navbar from '../../components/Navbar';
import Footer from '../../components/Footer';
import '../globals.css';

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es">
      <body>
        <Navbar />
        {children}
        <Footer />
      </body>
    </html>
  );
}
