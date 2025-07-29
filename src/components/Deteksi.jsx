import { useRef, useState, useEffect } from "react"
import imgBackground from '../assets/Brush.png'
import icondaun from '../assets/icon-daun.png'
import iconceklis from '../assets/icon-ceklis.png'
import heroKentang2 from '../assets/hero-kentang2.png'

const getKeteranganByLabel = (label) => {
  switch (label) {
    case "Healthy Leaf":
      return {
        deskripsi: "Daun sehat berwarna hijau rata, tidak ada bercak atau lubang, dan tidak mudah layu. Cara Menjaga Daun Tetap Sehat",
        saran: "Gunakan pupuk seimbang (NPK) agar tanaman kuat.",
        saran2: "Lakukan rotasi tanaman, jangan tanam kentang terus-menerus di tempat yang sama",
        saran3: "⁠Cek daun secara rutin — kalau ada bercak, langsung buang.",
        saran4: "⁠Semprot air di pagi hari, hindari daun tetap basah di malam hari.",
        solusi: ""
      }
    case "Early Blight":
      return {
        deskripsi: "Penyakit ini disebabkan oleh jamur Alternaria solani, yang menyerang daun kentang tua. Muncul bercak bulat berwarna cokelat gelap dengan lingkaran seperti mata banteng. Jika dibiarkan, bisa menyebabkan daun rontok dan gagal panen.",
        saran: "Jangan tanam terlalu rapat agar tanaman tidak lembap.",
        saran2: "Gunakan bibit sehat dan tanah yang tidak terlalu basah",
        saran3: "Semprot dengan jamur baik (Trichoderma) atau cairan dari daun mimba (neem) untuk mencegah jamur jahat tumbuh.",
        saran4: "",
        solusi: "⁠Segera buang dan bakar daun yang terkena.",
        solusi2: "Semprotkan obat anti jamur (fungisida) seperti chlorothalonil atau carbendazim + mancozeb sesuai dosis yang dianjurkan di label."
      }
    case "Late Blight":
      return {
        deskripsi: "Penyakit ini disebabkan oleh jamur air bernama Phytophthora infestans. Biasanya muncul saat cuaca lembap dan dingin. Gejalanya: daun jadi cokelat kehitaman, cepat layu, dan menyebar ke batang atau umbi.",
        saran: "Gunakan bibit unggul yang tahan penyakit.",
        saran2: "Jaga jarak tanam dan hindari penyiraman berlebihan.",
        saran3: "Bersihkan sisa daun dan batang setelah panen.",
        saran4: "",
        solusi: "Cabut dan bakar tanaman yang parah agar tidak menular",
        solusi2: "Semprot fungisida seperti metalaxyl + mancozeb saat muncul gejala awal"
      }
    default:
      return {
        deskripsi: "Tidak diketahui.",
        saran: "",
        saran2: "",
        saran3: "",
        saran4: "",
        solusi: "Silakan coba ulangi atau pastikan kualitas gambar baik."
      }
  }
}

const Deteksi = () => {
  const streamRef = useRef(null)
  const videoRef = useRef(null)
  const [model, setModel] = useState(null)
  const [prediction, setPrediction] = useState("")
  const [confidence, setConfidence] = useState("")
  const [deskripsi, setDeskripsi] = useState("")
  const [saran, setSaran] = useState("")
  const [saran2, setSaran2] = useState("")
  const [saran3, setSaran3] = useState("")
  const [saran4, setSaran4] = useState("")
  const [solusi, setSolusi] = useState("")
  const [solusi2, setSolusi2] = useState("")
  const [cameraOn, setCameraOn] = useState(false)
  const [loading, setLoading] = useState(false)
  const [classes, setClasses] = useState([])

  const URL = "/model/"

  useEffect(() => {
    const loadModel = async () => {
      try {
        const modelURL = URL + "model.json"
        const metadataURL = URL + "metadata.json"
        const loadedModel = await window.tmImage.load(modelURL, metadataURL)
        setModel(loadedModel)
        setClasses(loadedModel.getClassLabels())
      } catch (err) {
        console.error("Gagal load model:", err)
      }
    }
    loadModel()
  }, [])

  const startCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true })
      videoRef.current.srcObject = stream
      streamRef.current = stream
      setCameraOn(true)
    } catch (err) {
      console.error("Error accessing camera:", err)
    }
  }

  const stopCamera = () => {
    streamRef.current?.getTracks().forEach((track) => track.stop())
    setCameraOn(false)
  }

  const captureImage = () => {
    const canvas = document.createElement("canvas")
    canvas.width = videoRef.current.videoWidth
    canvas.height = videoRef.current.videoHeight
    const ctx = canvas.getContext("2d")
    ctx.drawImage(videoRef.current, 0, 0, canvas.width, canvas.height)
    return canvas
  }

  const sendToAPI = async () => {
    const canvas = captureImage()
    setLoading(true)
    setPrediction("Mendeteksi...")
    setConfidence("")
    setDeskripsi("")
    setSolusi("")
    setSolusi2("")
    setSaran("")
    setSaran2("")
    setSaran3("")
    setSaran4("")

    try {
      if (!model) throw new Error("Model belum diload")

      const predictionResult = await model.predict(canvas)
      const highest = predictionResult.reduce((prev, current) =>
        prev.probability > current.probability ? prev : current
      )

      setPrediction(highest.className)
      setConfidence((highest.probability * 100).toFixed(2) + "%")

      const keterangan = getKeteranganByLabel(highest.className)
      setDeskripsi(keterangan.deskripsi)
      setSaran(keterangan.saran)
      setSaran2(keterangan.saran2)
      setSaran3(keterangan.saran3)
      setSaran4(keterangan.saran4)
      setSolusi(keterangan.solusi)
      setSolusi2(keterangan.solusi2 || "")

    } catch (err) {
      console.error("Gagal memprediksi gambar:", err)
      setPrediction("Gagal memprediksi gambar")
    } finally {
      setLoading(false)
    }
  }

  return (
<section className="deteksi-section d-flex justify-content-center" id="deteksi">
      <div className="content-rotate-fix">
        <div className="row">
          <div className="col-12 col-md-6 order-1 order-md-2">
              <p className="text-deteksi-1  text-white  text-md-start text-center">
                Yuk, kenali daun kentangmu!
              </p>
              <p className="text-deteksi-2 text-white  text-md-start text-center">
                SiKentang sudah bisa mendeteksi dua penyakit utama:
                <strong> Early Blight</strong>, <strong>Late Blight</strong>,
                dan <strong>daun sehat.</strong>
              </p>
          </div>
          <div className="col-12 col-md-6 order-2 order-md-1 d-flex justify-content-center align-items-center">
            <div className="text-center">
              <div id="webcam-container">
                <video
                  ref={videoRef}
                  autoPlay
                  playsInline
                  width="100%"
                  height="100%"
                  style={{ display: cameraOn ? "block" : "none", marginBottom: "10px" }}
                />
              </div>
              <div className="button d-flex justify-content-center align-items-center  d-grid gap-2 mt-3">
                {!cameraOn ? (
                  <button
                    className="btn tombol btn-deteksi fw-bold text-white"
                    onClick={startCamera}
                  >
                    Mulai Deteksi
                  </button>
                ) : (
                  <>
                    <button
                      className="btn tombol btn-deteksi fw-bold text-white"
                      onClick={stopCamera}
                    >
                      Stop Deteksi
                    </button>
                    <button
                      className="btn tombol btn-mulai-deteksi fw-bold text-white"
                      onClick={sendToAPI}
                      disabled={loading}
                    >
                      {loading ? "Mendeteksi..." : "Deteksi Gambar"}
                    </button>
                  </>
                )}
              </div>
            </div>
          </div>
          <div className="col-12 col-md-12 order-3 order-md-3 d-flex justify-content-center align-items-center my-3">
          {confidence && (
            <div className="row justify-content-center mt-1">
              <div className="col-10 col-md-8 p-0">
                <div className="card">
                  <div className="card-body mx-4 p-0">
                    <div className="row justify-content-between  text-style text-size-pred mb-3 mt-3">
                      <div className="col fw-bold text-decoration-underline text-pred">{prediction || ""}</div>
                      <div className="col fw-bold text-end text-decoration-underline">Akurasi {confidence}</div>
                    </div>
                    <div className="row text-style text-deskrip">
                      <div className="row text-style text-deskrip mb-1">
                        <div className="col-12 fw-bold">Deskripsi</div>
                        <div className="col-2 pe-0"><img src={iconceklis} alt="" className="img-fluid " style={{ maxWidth: '40px' }}/></div>
                        <div className="col-9 ps-0 " style={{textAlign: "justify"}}>{deskripsi}</div>
                      </div>
                      <br />
                      {saran && (
                      <div className="row text-style text-deskrip mb-1">
                        <div className="col-12 fw-bold">Pencegahan</div>
                        <div className="col-2 pe-0"><img src={icondaun} alt="" className="img-fluid " style={{ maxWidth: '40px' }}/></div>
                        <div className="col-9 ps-0" style={{ textAlign: "justify" }}>
                        <p>- {saran}</p>
                        {saran2 && <p>- {saran2}</p>}
                        {saran3 && <p>- {saran3}</p>}
                        {saran4 && <p>- {saran4}</p>}
                      </div>
                      </div>
                        
                      )}
                      {solusi && (
                        <div className="row text-style text-deskrip mb-1">
                          <div className="col-12 fw-bold">Solusi saat terjadi</div>
                          <div className="col-2 pe-0"><img src={icondaun} alt="" className="img-fluid " style={{ maxWidth: '40px' }}/></div>
                          <div className="col-9 ps-0 mb-5" style={{textAlign: "justify"}}>
                            <p>- {solusi}</p>
                            {solusi2 && <p>- {solusi2}</p>}
                          </div>
                        </div>
                        
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
            )}
          </div>
        </div>
      </div>
    </section>

  )
}

export default Deteksi
