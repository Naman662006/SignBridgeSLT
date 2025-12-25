import HandCamera from "./HandCamera"
import { useState } from 'react'

function App() {
  const [translatedText, setTranslatedText] = useState('')

  function handleTranslate(word) {
    setTranslatedText(prev => {
      if (prev.endsWith(word)) return prev
      return prev ? prev + '\n' + word : word
    })
  }

  return (
    <>
      <div className="app">
        {/* also fix this without changing anything else */}

        {/* HEADER */}
        <header className="app-header">
          <h1>👋 Sign Language to Text Converter</h1>
          <p>
            Real-time sign language recognition using your camera.
            Communicate seamlessly by translating gestures into text.
          </p>
        </header>

        {/* MAIN CONTENT */}
        <main className="main">
          {/* CAMERA CARD */}
          <section className="card">
            <h2>📷 Camera Feed</h2>

            <div className="camera-box">
              <HandCamera onTranslate={handleTranslate} />
            </div>

            <div className="btn-group">
              <button className="btn primary">▶ Start Camera</button>
              <button className="btn">■ Stop Camera</button>
              <button className="btn">✋ Capture Gesture</button>
            </div>

            <div className="status">
              <span className="dot"></span>
              Camera active - Sign in front of the camera
            </div>
          </section>

          {/* TEXT CARD */}
          <section className="card">
            <h2>🔤 Translated Text</h2>

            <textarea
              className="output"
              value={translatedText}
              readOnly
            />

            <div className="controls">
              <div>
                🌐 Output Language:{' '}
                <select>
                  <option>English</option>
                </select>
              </div>

              <button className="btn small">🧹 Clear Text</button>
            </div>

            <div className="confidence">
              <span>Recognition Confidence</span>
              <span>77%</span>
            </div>

            <div className="progress">
              <div className="progress-bar"></div>
            </div>
          </section>
        </main>
      </div>

      {/* STYLES */}
      <style>{`
        * {
          box-sizing: border-box;
          font-family: 'Inter', system-ui, sans-serif;
        }

        body {
          margin: 0;
          background: radial-gradient(circle at top, #1c2b3a, #0b1622);
          color: #e5f4f7;
        }

        .app {
          padding: 40px;
        }

        .app-header {
          text-align: center;
          margin-bottom: 40px;
        }

        .app-header h1 {
          margin: 0;
          font-size: 32px;
          color: #4fd1e0;
        }

        .app-header p {
          color: #b8c7d9;
          max-width: 700px;
          margin: 12px auto 0;
        }

        .main {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 30px;
        }

        .card {
          background: linear-gradient(180deg, #1b2a38, #16222e);
          border-radius: 16px;
          padding: 24px;
          box-shadow: 0 20px 40px rgba(0,0,0,0.4);
        }

        .card h2 {
          margin-top: 0;
          color: #7fe7f3;
        }

        .camera-box {
          border-radius: 12px;
          border: 2px solid #2d4156;
          background: #0f1b26;
          margin: 16px 0 20px;
        }

        .btn-group {
          display: flex;
          gap: 12px;
          flex-wrap: wrap;
        }

        .btn {
          padding: 10px 16px;
          border-radius: 999px;
          border: none;
          background: #2a3d4f;
          color: white;
          cursor: pointer;
          font-weight: 500;
        }

        .btn.primary {
          background: linear-gradient(90deg, #1fb6ff, #4fd1e0);
        }

        .btn.small {
          padding: 8px 14px;
        }

        .status {
          margin-top: 16px;
          display: flex;
          align-items: center;
          gap: 10px;
          font-size: 14px;
          color: #cdeff3;
        }

        .dot {
          width: 10px;
          height: 10px;
          border-radius: 50%;
          background: #3ddc84;
        }

        .output {
          width: 100%;
          height: 260px;
          border-radius: 12px;
          background: #0f1b26;
          border: 2px solid #2d4156;
          color: white;
          padding: 16px;
          resize: none;
          font-size: 18px;
          line-height: 1.6;
        }

        .controls {
          margin-top: 16px;
          display: flex;
          justify-content: space-between;
          align-items: center;
        }

        select {
          background: #0f1b26;
          color: white;
          border: 1px solid #2d4156;
          padding: 6px 10px;
          border-radius: 8px;
        }

        .confidence {
          margin-top: 20px;
          display: flex;
          justify-content: space-between;
          font-size: 14px;
        }

        .progress {
          margin-top: 8px;
          height: 8px;
          background: #243849;
          border-radius: 999px;
          overflow: hidden;
        }

        .progress-bar {
          width: 77%;
          height: 100%;
          background: linear-gradient(90deg, #facc15, #f97316);
        }

        @media (max-width: 900px) {
          .main {
            grid-template-columns: 1fr;
          }
        }
      `}</style>
    </>
  )
}

export default App
