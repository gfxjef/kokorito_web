import type { Metadata } from 'next'
import './globals.css'
import { GlobalDataProvider } from '@/context/GlobalDataContext'
import WhatsAppToggle from '@/components/WhatsAppToggle'

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
      <head>
        <link href="https://fonts.googleapis.com/css2?family=Pacifico&display=swap" rel="stylesheet" />
      </head>
      <body className="font-sans antialiased">
        <GlobalDataProvider>
          {children}
          <WhatsAppToggle />
        </GlobalDataProvider>
      </body>
    </html>
  )
} 