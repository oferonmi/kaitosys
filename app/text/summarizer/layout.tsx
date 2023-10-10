import 'app/globals.css'
import { Inter } from 'next/font/google'
import { Header } from '../../../components/Header'
import { Footer } from '../../../components/Footer'

const inter = Inter({ subsets: ['latin'] })

export const metadata = {
  title: "KAITO - Summarizer",
  description: "Your AI research assistant",
};

export default function SummarizerLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body
        className={
          inter.className + " bg-gradient-to-r from-teal-100 to-teal-100"
        }
      >
        <Header />
        {children}
        {/* <Footer /> */}
      </body>
    </html>
  );
}