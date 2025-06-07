import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'Kokorito - Las Mejores Tortas y Keks Online',
  description: 'Descubre las mejores tortas, keks y cupcakes artesanales. Delivery en Lima Metropolitana.',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="es">
      <body className="font-sans antialiased">
        {children}
      </body>
    </html>
  )
} 