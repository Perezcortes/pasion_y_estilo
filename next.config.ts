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
      }
    ],
    // Opcional: ajustes de calidad y formatos
    formats: ['image/avif', 'image/webp'],
    // Opcional: deshabilita la optimización en desarrollo
    disableStaticImages: process.env.NODE_ENV === 'development',
  },
  // Otras configuraciones de Next.js que puedas necesitar
  reactStrictMode: true,
  swcMinify: true,
  // Configuración para TypeScript (opcional)
  typescript: {
    ignoreBuildErrors: false,
  },
};

export default nextConfig;