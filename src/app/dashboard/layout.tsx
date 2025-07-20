export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es">
      <body className="bg-black text-white">
        {children}
      </body>
    </html>
  )
}
