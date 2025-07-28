import imgBackground from '../assets/Brush.png'
const Footer = () => (
<footer id="tentang" className="position-relative" style={{ overflow: 'hidden' }}>
  {/* Gambar background di kanan bawah */}
  <img
    src={imgBackground}
    alt="Background"
    className="position-absolute"
    style={{
      bottom: 0,
      right: 0,
      zIndex: 0,
      maxWidth: '80%'
    }}
  />

  {/* Konten teks di atas gambar */}
  <div className="row justify-content-center position-relative pb-4" style={{ zIndex: 1 }}>
    <div className="col-9 mt-5">
      <p className="text-style fw-bold text-white fs-1">Tentang Kami</p>
    </div>
    <div className="col-9 mb-5">
        <p className="text-style text-white fs-3" style={{ textAlign: 'justify' }}>
        <span style={{ color: '#217756' }} className='fw-semibold'>Si</span>
        <span style={{ color: '#EFAE1D' }} className='fw-semibold'>Kentang</span> adalah webapp edukatif untuk mendeteksi penyakit pada daun kentang. 
        Saat ini, <span style={{ color: '#217756' }} className='fw-semibold'>Si</span>
        <span style={{ color: '#EFAE1D' }} className='fw-semibold'>Kentang</span> dapat mengenali <strong>Early Blight</strong>, <strong>Late Blight</strong>, dan daun yang <strong>sehat</strong>. 
        Kami terus mengembangkan teknologi ini agar semakin cerdas dan bermanfaat!
        </p>
    </div>
  </div>
</footer>

)
export default Footer
