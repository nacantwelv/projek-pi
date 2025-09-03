import imgHero from '../assets/hero-kentang.png'

const Beranda = () => (
<section className="beranda-section d-flex justify-content-center">
      <div className="row pt-5 mt-5">
        <div className="col-12 col-md-6 pt-3">
          <p className="text-black text-beranda-1 fw-bold">
            <strong>Deteksi Penyakit Daun Kentang Secara Cepat dan Mudah</strong>
          </p>
          <p className="text-black text-beranda-2 fst-normal">
            <strong>Webapp Edukasi untuk deteksi penyakit pada daun kentang dan solusinya</strong>
          </p>
          <a href="#deteksi" className="btn btn-mulai text-white w-25 mb-5">Mulai!</a>
        </div>
        <div className="col-12 col-md-6 text-end z-1">
          <img src={imgHero} alt="Gambar Daun Kentang" className="img-hero text-end" />
        </div>
      </div>
    </section>

)


export default Beranda
