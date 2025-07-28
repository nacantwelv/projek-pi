import logoApps from '../assets/logo potato.png'
import '../App.css'

const Navbar = () => {
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
            <a className="nav-link active text-success fw-bold" aria-current="page" href="#">
              Beranda
            </a>
            <a className="nav-link fw-bold" href="#deteksi">
              Deteksi
            </a>
            <a className="nav-link fw-bold" href="#tentang">
              Tentang Kami
            </a>
          </div>
        </div>
      </div>
    </nav>
    

  );
  
}

export default Navbar
