import { useRef, useState, useEffect } from "react"
import imgBackground from '../assets/Brush.png'
import icondaun from '../assets/icon-daun.png'
import iconceklis from '../assets/icon-ceklis.png'
import heroKentang2 from '../assets/hero-kentang2.png'

// Fungsi untuk mengambil deskripsi & solusi berdasarkan label
const getKeteranganByLabel = (label) => {
  switch (label) {
    case "Healthy":
      return {
        deskripsi: "Tanaman dalam kondisi sehat. Tidak ditemukan tanda-tanda penyakit.",
        solusi: "Pertahankan pola perawatan seperti penyiraman, pemupukan, dan pengawasan rutin."
      }
    case "Early Blight":
      return {
        deskripsi: "Early Blight biasanya disebabkan oleh jamur Alternaria solani, menyerang daun tua terlebih dahulu.",
        solusi: "Buang daun yang terinfeksi, gunakan fungisida berbahan aktif seperti chlorothalonil, dan hindari kelembaban berlebih."
      }
    case "Late Blight":
      return {
        deskripsi: "Late Blight disebabkan oleh Phytophthora infestans, menyebar cepat saat udara lembap dan dingin.",
        solusi: "Gunakan fungisida sistemik, perbaiki drainase lahan, dan hindari penyiraman dari atas pada malam hari."
      }
    default:
      return {
        deskripsi: "Tidak diketahui.",
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
  const [solusi, setSolusi] = useState("")
  const [cameraOn, setCameraOn] = useState(false)
  const [loading, setLoading] = useState(false)
  const [classes, setClasses] = useState([])

  const URL = "/model/" // Sesuaikan path folder model di public/

  // Load model saat komponen mount
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

  // Start kamera
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

  // Stop kamera
  const stopCamera = () => {
    streamRef.current?.getTracks().forEach((track) => track.stop())
    setCameraOn(false)
  }

  // Tangkap frame dari video ke canvas
  const captureImage = () => {
    const canvas = document.createElement("canvas")
    canvas.width = videoRef.current.videoWidth
    canvas.height = videoRef.current.videoHeight
    const ctx = canvas.getContext("2d")
    ctx.drawImage(videoRef.current, 0, 0, canvas.width, canvas.height)
    return canvas
  }

  // Prediksi langsung dengan model lokal
  const sendToAPI = async () => {
    const canvas = captureImage()
    setLoading(true)
    setPrediction("Mendeteksi...")
    setConfidence("")
    setDeskripsi("")
    setSolusi("")

    try {
      if (!model) throw new Error("Model belum diload")

      // model.predict mengembalikan array {className, probability}
      const predictionResult = await model.predict(canvas)
      const highest = predictionResult.reduce((prev, current) =>
        prev.probability > current.probability ? prev : current
      )

      setPrediction(highest.className)
      setConfidence((highest.probability * 100).toFixed(2) + "%")

      // Ambil deskripsi & solusi
      const keterangan = getKeteranganByLabel(highest.className)
      setDeskripsi(keterangan.deskripsi)
      setSolusi(keterangan.solusi)

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
                      <div className="row text-style text-deskrip mb-1">
                        <div className="col-12 fw-bold">Pencegahan</div>
                        <div className="col-2 pe-0"><img src={icondaun} alt="" className="img-fluid " style={{ maxWidth: '40px' }}/></div>
                        <div className="col-9 ps-0" style={{textAlign: "justify"}}>{solusi}</div>
                      </div>
                      <div className="row text-style text-deskrip mb-1">
                        <div className="col-12 fw-bold">Pengendaliaan saat terjadi</div>
                        <div className="col-2 pe-0"><img src={icondaun} alt="" className="img-fluid " style={{ maxWidth: '40px' }}/></div>
                        <div className="col-9 ps-0 mb-5" style={{textAlign: "justify"}}>{solusi}</div>
                      </div>
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
