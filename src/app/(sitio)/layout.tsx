import { Toaster } from 'react-hot-toast';
import Navbar from '../../components/Navbar';
import Footer from '../../components/Footer';
import { AuthProvider } from '../../context/AuthContext';
import { SpeedInsights } from "@vercel/speed-insights/next"
import '../globals.css';

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <AuthProvider>
      <Navbar />
      <Toaster position="top-right" toastOptions={{ duration: 3000 }} />
      {children}
      <Footer />
      <SpeedInsights />
    </AuthProvider>
  );
}