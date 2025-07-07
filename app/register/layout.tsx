import type { Metadata } from 'next'
import { Toaster } from '@/components/ui/toaster'
import '../globals.css'

export const metadata: Metadata = {
  title: 'Cadastro - WT Work Treinamentos',
  description: 'Crie sua conta na plataforma de gerenciamento de treinamentos',
}

export default function RegisterLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="pt-BR">
      <body>
        {children}
        <Toaster />
      </body>
    </html>
  )
}
