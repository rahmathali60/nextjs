import { Inter } from 'next/font/google'
import ImageGenerator from '../components/imageGen'


const inter = Inter({ subsets: ['latin'] })

export default function Home() {
  return (
    <main className={inter.className}>
      < ImageGenerator />
    </main >
  )
}
