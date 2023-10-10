import './globals.css'
import { Inter } from 'next/font/google'
import NextAuthProvider from "@/context/NextAuthProvider";


const inter = Inter({ subsets: ['latin'] })

export const metadata = {
  title: 'KAITO - Knowledge work AI tool',
  description: 'Your AI research assistant',
}

export default function RootLayout({children}: {children: React.ReactNode}) {
  return (
    <html lang="en">
      <body
        className={
          inter.className + " bg-gradient-to-r from-teal-100 to-teal-100"
        }
      >
        <NextAuthProvider>{children}</NextAuthProvider>
      </body>
    </html>
  );
}
