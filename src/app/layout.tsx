// src/app/layout.tsx
export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es">
      <body>
        {children} {/* Aquí se renderizan los layouts y páginas anidados */}
      </body>
    </html>
  );
}
