import { useEffect, useRef, useState } from 'react'

function HandCamera() {
  const videoRef = useRef(null)
  const canvasRef = useRef(null)
  const cameraRef = useRef(null)
  const handsRef = useRef(null)
  const [started, setStarted] = useState(false)

  useEffect(() => {
    if (!started) return
    let active = true

    const start = async () => {
      const handsModule = await import(
        'https://cdn.jsdelivr.net/npm/@mediapipe/hands/hands.js'
      )
      const cameraModule = await import(
        'https://cdn.jsdelivr.net/npm/@mediapipe/camera_utils/camera_utils.js'
      )
      const drawingModule = await import(
        'https://cdn.jsdelivr.net/npm/@mediapipe/drawing_utils/drawing_utils.js'
      )

      if (!active) return

      const Hands = handsModule.Hands || window.Hands
      const HAND_CONNECTIONS =
        handsModule.HAND_CONNECTIONS || window.HAND_CONNECTIONS
      const Camera = cameraModule.Camera || window.Camera
      const drawConnectors =
        drawingModule.drawConnectors || window.drawConnectors
      const drawLandmarks =
        drawingModule.drawLandmarks || window.drawLandmarks

      const video = videoRef.current
      const canvas = canvasRef.current
      const ctx = canvas.getContext('2d')

      handsRef.current = new Hands({
        locateFile: (file) =>
          `https://cdn.jsdelivr.net/npm/@mediapipe/hands/${file}`,
      })

      handsRef.current.setOptions({
        maxNumHands: 1,
        modelComplexity: 1,
        minDetectionConfidence: 0.7,
        minTrackingConfidence: 0.7,
      })

      handsRef.current.onResults((results) => {
        if (!results.image) return

        canvas.width = results.image.width
        canvas.height = results.image.height

        ctx.clearRect(0, 0, canvas.width, canvas.height)
        ctx.drawImage(results.image, 0, 0, canvas.width, canvas.height)

        if (results.multiHandLandmarks) {
          for (const landmarks of results.multiHandLandmarks) {
            drawConnectors(ctx, landmarks, HAND_CONNECTIONS, {
              color: '#00ffcc',
              lineWidth: 2,
            })
            drawLandmarks(ctx, landmarks, {
              color: '#ffcc00',
              radius: 3,
            })
          }
        }
      })

      cameraRef.current = new Camera(video, {
        onFrame: async () => {
          await handsRef.current.send({ image: video })
        },
      })

      cameraRef.current.start()
    }

    start()

    return () => {
      active = false
      cameraRef.current?.stop()
      handsRef.current?.close()
    }
  }, [started])

  return (
    <>
      {!started && (
        <button className="start-btn" onClick={() => setStarted(true)}>
          ▶ Start Camera
        </button>
      )}

      <div className="camera-wrapper">
        <video ref={videoRef} autoPlay playsInline muted />
        <canvas ref={canvasRef} />
      </div>

      {/* ✅ RESPONSIVE CSS VARIABLES */}
      <style>{`
        :root {
          --cam-width: clamp(280px, 80vw, 640px);
          --cam-radius: clamp(10px, 2vw, 16px);
          --btn-padding: clamp(10px, 2vw, 14px);
          --font-size: clamp(14px, 2vw, 16px);
        }

        .start-btn {
          padding: var(--btn-padding) calc(var(--btn-padding) * 1.8);
          border-radius: 999px;
          border: none;
          background: linear-gradient(90deg, #1fb6ff, #4fd1e0);
          font-weight: 600;
          font-size: var(--font-size);
          cursor: pointer;
          margin-bottom: 12px;
        }

        .camera-wrapper {
          position: relative;
          width: var(--cam-width);
          aspect-ratio: 4 / 3;
          border-radius: var(--cam-radius);
          overflow: hidden;
          background: #0f1b26;
        }

        video,
        canvas {
          position: absolute;
          inset: 0;
          width: 100%;
          height: 100%;
          object-fit: cover;
        }
      `}</style>
    </>
  )
}

export default HandCamera
