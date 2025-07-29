import { useState, useEffect } from 'react'
import logoApps from '../assets/logo potato.png'
import '../App.css'

const Navbar = () => {
  const [activeLink, setActiveLink] = useState('beranda')

  // Tambahkan scroll listener untuk ubah activeLink berdasarkan scroll posisi
  useEffect(() => {
    const handleScroll = () => {
      const scrollY = window.scrollY
      const deteksi = document.getElementById("deteksi")
      const tentang = document.getElementById("tentang")

      if (tentang && scrollY >= tentang.offsetTop - 100) {
        setActiveLink('tentang')
      } else if (deteksi && scrollY >= deteksi.offsetTop - 100) {
        setActiveLink('deteksi')
      } else {
        setActiveLink('beranda')
      }
    }

    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  return (
    <nav className="navbar navbar-expand-lg fixed-top bg-white shadow">
      <div className="container-xxl navigasi">
        <a href="#" className="navbar-brand">
          <img src={logoApps} alt="logo" className="img-fluid img-logo" />
        </a>
        <button
          className="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarNavAltMarkup"
          aria-controls="navbarNavAltMarkup"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon"></span>
        </button>

        <div className="collapse navbar-collapse px-5" id="navbarNavAltMarkup">
          <div className="navbar-nav ms-auto">
            <a
              className={`nav-link fw-bold ${activeLink === 'beranda' ? 'text-success active' : ''}`}
              href="#"
              onClick={() => setActiveLink('beranda')}
            >
              Beranda
            </a>
            <a
              className={`nav-link fw-bold ${activeLink === 'deteksi' ? 'text-success active' : ''}`}
              href="#deteksi"
              onClick={() => setActiveLink('deteksi')}
            >
              Deteksi
            </a>
            <a
              className={`nav-link fw-bold ${activeLink === 'tentang' ? 'text-success active' : ''}`}
              href="#tentang"
              onClick={() => setActiveLink('tentang')}
            >
              Tentang Kami
            </a>
          </div>
        </div>
      </div>
    </nav>
  )
}

export default Navbar
