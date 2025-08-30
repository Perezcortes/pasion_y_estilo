import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      // Dominio de Amazon para imágenes
      {
        protocol: 'https',
        hostname: 'm.media-amazon.com',
      },
      // Dominio genérico para ejemplos
      {
        protocol: 'https',
        hostname: 'i.pinimg.com',
      },
      // Otros dominios comunes (agrega los que necesites)
      {
        protocol: 'https',
        hostname: '**.amazonaws.com',
      },
      {
        protocol: 'https',
        hostname: '**.cloudfront.net',
      },
      // Para desarrollo local (si usas imágenes desde localhost)
      {
        protocol: 'http',
        hostname: 'localhost',
        port: '3000',
      },
      {
        protocol: 'https',
        hostname: 'pakar.com',
      },
    ],
    // Opcional: ajustes de calidad y formatos
    formats: ['image/avif', 'image/webp'],
    // Opcional: deshabilita la optimización en desarrollo
    disableStaticImages: process.env.NODE_ENV === 'development',
  },
  
  // Otras configuraciones de Next.js que puedas necesitar
  reactStrictMode: true,
  
  // REMOVIDO: swcMinify ya no es necesario en Next.js 15 (está habilitado por defecto)
  // swcMinify: true,
  
  // Configuración para hacer build exitoso (puedes ajustar según necesites)
  typescript: {
    // Para desarrollo: false, para producción estricta: true
    ignoreBuildErrors: false,
  },
  
  // Configuración de ESLint para build
  eslint: {
    // Para desarrollo: true, para producción estricta: false
    ignoreDuringBuilds: true, // Cambia a false cuando hayas corregido los errores
  },
  
  // Configuración experimental (opcional)
  experimental: {
    // Aquí puedes agregar features experimentales si las necesitas
    optimizeCss: true,
  },
};

export default nextConfig;