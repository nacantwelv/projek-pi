import { useState } from 'react'
import useScrollEffect from './hooks/useScrollEffect'
import Navbar from './components/Navbar'
import Beranda from './components/Beranda'
import Deteksi from './components/Deteksi'
import Footer from './components/Footer'
import './App.css'

function App() {
  const [scrolled, setScrolled] = useState(false)

  useScrollEffect(setScrolled)

  return (
    <>
      <Navbar scrolled={scrolled} />
      <Beranda />
      <Deteksi />
      <Footer />
    </>
  )
}

export default App
