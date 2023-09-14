import 'app/globals.css'
import { Inter } from 'next/font/google'
import { Header } from '../../components/Header'
import { Footer } from '../../components/Footer'

const inter = Inter({ subsets: ['latin'] })

export const metadata = {
  title: 'KAITO - Chat',
  description: 'Your AI research assistant',
}

export default function ChatLayout({children}: {children: React.ReactNode}) {
  return (
    <html lang="en">
      <body
        className={
          inter.className
        }
      >
        <Header />
        {children}
        {/* <Footer /> */}
      </body>
    </html>
  );
}
