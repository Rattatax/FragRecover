import { useState, useCallback } from "react";
import jsPDF from "jspdf";

const styles = `
  @import url('https://fonts.googleapis.com/css2?family=Rajdhani:wght@400;600;700&family=Barlow+Condensed:wght@400;600;700&display=swap');

  * { box-sizing: border-box; margin: 0; padding: 0; }

  body {
    background: #2b2b2b;
    color: #e8dcc8;
    font-family: 'Barlow Condensed', sans-serif;
  }

  .app { min-height: 100vh; background: #2b2b2b; }

  .header {
    background: #1e1e1e;
    position: relative;
    overflow: hidden;
    border-bottom: 3px solid #f07030;
  }

  .header-inner { display: flex; align-items: stretch; height: 64px; }

  .logo-block {
    background: #f07030;
    padding: 0 48px 0 32px;
    display: flex;
    align-items: center;
    clip-path: polygon(0 0, 100% 0, 88% 100%, 0 100%);
  }

  .logo {
    font-family: 'Rajdhani', sans-serif;
    font-size: 24px; font-weight: 700;
    color: #1e1e1e;
    letter-spacing: 4px;
    text-transform: uppercase;
    white-space: nowrap;
  }

  .header-mid { flex: 1; display: flex; align-items: center; padding: 0 32px; }
  .header-tag { font-size: 10px; letter-spacing: 3px; color: #888; text-transform: uppercase; }
  .header-right { display: flex; align-items: center; padding-right: 24px; gap: 24px; }
  .stat { text-align: center; }
  .stat-val { font-family: 'Rajdhani', sans-serif; font-size: 18px; font-weight: 700; color: #f07030; line-height: 1; }
  .stat-label { font-size: 9px; letter-spacing: 2px; color: #666; text-transform: uppercase; }

  .header::after {
    content: ''; position: absolute;
    top: 0; right: 180px;
    width: 4px; height: 100%;
    background: #f07030;
    transform: skewX(-12deg);
    opacity: 0.3;
  }

  .main { max-width: 980px; margin: 0 auto; padding: 36px 24px; }
  .section { margin-bottom: 32px; }

  .label { display: flex; align-items: center; margin-bottom: 14px; }
  .label-tag {
    background: #f07030; color: #1e1e1e;
    font-family: 'Rajdhani', sans-serif;
    font-weight: 700; font-size: 11px;
    letter-spacing: 3px;
    padding: 3px 14px 3px 10px;
    clip-path: polygon(0 0, 100% 0, 92% 100%, 0 100%);
    text-transform: uppercase;
  }
  .label-line { flex: 1; height: 1px; background: linear-gradient(90deg, #f0703044, transparent); }

  .dropzone {
    border: 1px solid #4a4a4a; background: #222;
    padding: 48px; text-align: center; cursor: pointer;
    position: relative; overflow: hidden;
    transition: all 0.2s;
    clip-path: polygon(0 0, 100% 0, 100% calc(100% - 16px), calc(100% - 16px) 100%, 0 100%);
  }
  .dropzone::before {
    content: ''; position: absolute;
    top: 0; left: 0; width: 4px; height: 100%;
    background: #f07030; opacity: 0.5;
  }
  .dropzone:hover, .dropzone.hover { border-color: #f07030; background: #2a2018; }
  .dropzone:hover::before, .dropzone.hover::before { opacity: 1; }

  .drop-icon { font-size: 32px; margin-bottom: 12px; display: block; color: #f07030; }
  .drop-text { color: #e8dcc8; font-size: 15px; font-weight: 600; letter-spacing: 2px; margin-bottom: 4px; text-transform: uppercase; }
  .drop-sub { color: #666; font-size: 11px; letter-spacing: 1px; text-transform: uppercase; }

  .file-input { position: absolute; inset: 0; opacity: 0; cursor: pointer; width: 100%; height: 100%; }

  .previews { display: flex; gap: 10px; flex-wrap: wrap; margin-top: 14px; }
  .preview-card { position: relative; border: 1px solid #4a4a4a; background: #1e1e1e; padding: 3px; transition: border-color 0.15s; }
  .preview-card:hover { border-color: #f07030; }
  .preview-img { width: 78px; height: 116px; object-fit: cover; display: block; }
  .preview-num {
    position: absolute; bottom: 4px; left: 4px;
    background: #f07030; color: #1e1e1e;
    font-family: 'Rajdhani', sans-serif;
    font-weight: 700; font-size: 10px;
    padding: 1px 6px; letter-spacing: 1px;
  }
  .remove-btn {
    position: absolute; top: 4px; right: 4px;
    background: rgba(0,0,0,0.7); color: #e8dcc8;
    border: none; cursor: pointer; font-size: 10px;
    padding: 2px 5px; font-family: 'Barlow Condensed', sans-serif;
    transition: background 0.15s;
  }
  .remove-btn:hover { background: #f07030; color: #1e1e1e; }

  .controls { display: flex; gap: 12px; }
  .select {
    flex: 1; background: #1e1e1e;
    border: 1px solid #4a4a4a; border-left: 3px solid #f07030;
    color: #e8dcc8; padding: 10px 14px; font-size: 13px;
    font-family: 'Barlow Condensed', sans-serif;
    letter-spacing: 1px; outline: none; cursor: pointer;
    appearance: none; text-transform: uppercase;
    transition: border-color 0.2s;
  }
  .select:focus { border-color: #f07030; }

  .textarea {
    width: 100%; background: #1e1e1e;
    border: 1px solid #4a4a4a; border-left: 3px solid #f07030;
    color: #e8dcc8; padding: 12px 14px; font-size: 13px;
    font-family: 'Barlow Condensed', sans-serif;
    letter-spacing: 0.5px; resize: vertical; min-height: 72px;
    outline: none; margin-top: 12px;
    transition: border-color 0.2s;
  }
  .textarea::placeholder { color: #555; text-transform: uppercase; font-size: 12px; }
  .textarea:focus { border-color: #f07030; }

  .btn {
    background: #f07030; color: #1e1e1e;
    border: none; padding: 13px 48px 13px 36px;
    font-family: 'Rajdhani', sans-serif;
    font-weight: 700; font-size: 14px;
    letter-spacing: 3px; text-transform: uppercase;
    cursor: pointer;
    clip-path: polygon(0 0, 100% 0, 96% 100%, 0 100%);
    transition: background 0.15s, transform 0.1s;
  }
  .btn:hover:not(:disabled) { background: #ff8840; transform: translateX(2px); }
  .btn:disabled { opacity: 0.3; cursor: not-allowed; transform: none; }

  .loading-row { display: flex; align-items: center; gap: 12px; color: #888; font-size: 12px; padding: 14px 0; letter-spacing: 2px; text-transform: uppercase; }
  .spinner { width: 14px; height: 14px; border: 2px solid #3a3a3a; border-top: 2px solid #f07030; border-radius: 50%; animation: spin 0.7s linear infinite; flex-shrink: 0; }
  @keyframes spin { to { transform: rotate(360deg); } }
  .error-row { color: #e05020; font-size: 12px; padding: 12px 0; letter-spacing: 1px; text-transform: uppercase; }

  .divider { border: none; height: 1px; background: linear-gradient(90deg, #f07030, #4a4a4a44); margin: 32px 0; }

  .result-box {
    border: 1px solid #4a4a4a; background: #1e1e1e;
    position: relative;
    clip-path: polygon(0 0, 100% 0, 100% calc(100% - 20px), calc(100% - 20px) 100%, 0 100%);
  }
  .result-box::before { content: ''; position: absolute; top: 0; left: 0; width: 4px; height: 100%; background: #f07030; }

  .result-header {
    background: #252525; border-bottom: 1px solid #3a3a3a;
    padding: 10px 16px 10px 20px;
    display: flex; justify-content: space-between; align-items: center;
  }
  .result-header-text {
    font-family: 'Rajdhani', sans-serif;
    font-size: 13px; font-weight: 700;
    letter-spacing: 3px; color: #e8dcc8;
    text-transform: uppercase;
  }
  .confidence-pill {
    font-family: 'Rajdhani', sans-serif;
    font-size: 11px; font-weight: 700;
    padding: 3px 14px; letter-spacing: 2px;
    text-transform: uppercase;
    clip-path: polygon(6px 0, 100% 0, calc(100% - 6px) 100%, 0 100%);
  }
  .conf-high { background: #f07030; color: #1e1e1e; }
  .conf-med  { background: #c89030; color: #1e1e1e; }
  .conf-low  { background: #5a5a5a; color: #e8dcc8; }

  .result-body {
    padding: 24px 24px 24px 28px;
    font-size: 13px; line-height: 1.85;
    color: #c8bcaa; white-space: pre-wrap;
    font-family: 'Barlow Condensed', sans-serif;
    letter-spacing: 0.3px;
  }

  .info-box {
    border: 1px solid #3a3a3a; border-left: 3px solid #f07030;
    background: #222; padding: 14px 18px;
    font-size: 12px; color: #666;
    line-height: 1.7; letter-spacing: 0.5px;
    text-transform: uppercase;
  }
  .info-title {
    color: #f07030; font-family: 'Rajdhani', sans-serif;
    font-weight: 700; letter-spacing: 3px;
    margin-bottom: 6px; font-size: 11px;
  }
`;

function getConfidenceClass(c) {
  if (!c) return "";
  const u = c.toUpperCase();
  if (u.includes("HIGH")) return "conf-high";
  if (u.includes("MED")) return "conf-med";
  return "conf-low";
}

function parseResult(text) {
  const m = text.match(/confidence[:\s]+(high|medium|low)/i);
  return { confidence: m ? m[1] : null, text };
}

export default function App() {
  const [images, setImages] = useState([]);
  const [context, setContext] = useState("");
  const [shredType, setShredType] = useState("strip");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [hover, setHover] = useState(false);
  const [error, setError] = useState(null);

  const handleFiles = useCallback((files) => {
    const imgs = Array.from(files)
      .filter(f => f.type.startsWith("image/"))
      .map(f => ({ file: f, url: URL.createObjectURL(f) }));
    setImages(prev => [...prev, ...imgs]);
    setResult(null);
  }, []);

  const onDrop = (e) => {
    e.preventDefault();
    setHover(false);
    handleFiles(e.dataTransfer.files);
  };

  const resizeAndEncode = (file, maxDim = 1600) =>
    new Promise((res, rej) => {
      const img = new Image();
      img.onload = () => {
        const scale = Math.min(1, maxDim / Math.max(img.width, img.height));
        const w = Math.round(img.width * scale);
        const h = Math.round(img.height * scale);
        const canvas = document.createElement("canvas");
        canvas.width = w; canvas.height = h;
        canvas.getContext("2d").drawImage(img, 0, 0, w, h);
        const dataUrl = canvas.toDataURL("image/jpeg", 0.85);
        res({ data: dataUrl.split(",")[1], mediaType: "image/jpeg" });
      };
      img.onerror = rej;
      img.src = URL.createObjectURL(file);
    });

  const analyze = async () => {
    if (!images.length) return;
    setLoading(true);
    setError(null);
    setResult(null);
    try {
      const imageContents = await Promise.all(
        images.map(async ({ file }) => {
          const { data, mediaType } = await resizeAndEncode(file);
          return { type: "image", source: { type: "base64", media_type: mediaType, data } };
        })
      );

      const shredDesc = shredType === "strip"
        ? "straight-cut strip shredding (vertical strips)"
        : shredType === "crosscut"
        ? "cross-cut shredding (rectangular confetti pieces)"
        : "micro-cut shredding (very small particles)";

      const response = await fetch("https://api.anthropic.com/v1/messages", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-api-key": import.meta.env.VITE_ANTHROPIC_API_KEY,
          "anthropic-version": "2023-06-01",
          "anthropic-dangerous-direct-browser-access": "true",
        },
        body: JSON.stringify({
          model: "claude-sonnet-4-6",
          max_tokens: 1000,
          messages: [{
            role: "user",
            content: [
              ...imageContents,
              {
                type: "text",
                text: `You are a forensic document reconstruction specialist analyzing ${images.length} image(s) of a shredded document that used ${shredDesc}.

${context ? `Investigator-provided context: "${context}"` : "No additional context provided."}

IMPORTANT: The strips may be out of their original order. Do not simply list fragments — actively attempt to REASSEMBLE the document:

1. Read every visible text fragment across all strips.
2. Use content, grammar, and document conventions to infer the correct ordering of fragments, even when their physical arrangement is scrambled.
3. Reconstruct the most probable original document, filling gaps using linguistic context.
4. Clearly distinguish text you can DIRECTLY READ from text you INFERRED — wrap inferred content in [brackets].
5. Where you cannot determine content, mark it as [illegible] rather than guessing wildly.

Structure your response as:

--- EXTRACTED FRAGMENTS ---
(Readable fragments, grouped by apparent region of the document)

--- RECONSTRUCTED DOCUMENT ---
(Your best full reconstruction, with [inferred text] in brackets)

--- ANALYSIS NOTES ---
(Document type, how you ordered the fragments, what's certain vs. inferred, remaining gaps)

--- CONFIDENCE: [HIGH / MEDIUM / LOW] ---
(Overall confidence and reasoning)`
              }
            ]
          }]
        })
      });

      const data = await response.json();
      if (data.error) throw new Error(data.error.message);
      const text = data.content.filter(b => b.type === "text").map(b => b.text).join("\n");
      setResult(parseResult(text));
    } catch (err) {
      setError(err.message || "Analysis failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const exportPDF = () => {
    if (!result) return;

    const pdf = new jsPDF({ unit: "pt", format: "letter" });
    const margin = 54;
    const pageWidth = pdf.internal.pageSize.getWidth();
    const pageHeight = pdf.internal.pageSize.getHeight();
    const contentWidth = pageWidth - margin * 2;
    let y = margin;

    pdf.setFont("helvetica", "bold");
    pdf.setFontSize(18);
    pdf.text("FRAG·RECOVER", margin, y);
    y += 22;

    pdf.setFont("helvetica", "normal");
    pdf.setFontSize(10);
    pdf.setTextColor(100);
    pdf.text("Forensic Document Reconstruction Report", margin, y);
    y += 24;

    pdf.setTextColor(0);
    pdf.setFontSize(10);
    pdf.text(`Generated: ${new Date().toLocaleString()}`, margin, y); y += 14;
    pdf.text(`Shred type: ${shredType}`, margin, y); y += 14;
    pdf.text(`Images analyzed: ${images.length}`, margin, y); y += 14;
    if (context) {
      const ctxLines = pdf.splitTextToSize(`Context: ${context}`, contentWidth);
      pdf.text(ctxLines, margin, y);
      y += ctxLines.length * 14;
    }
    if (result.confidence) {
      pdf.setFont("helvetica", "bold");
      pdf.text(`Confidence: ${result.confidence.toUpperCase()}`, margin, y);
      pdf.setFont("helvetica", "normal");
      y += 20;
    }

    pdf.setDrawColor(200);
    pdf.line(margin, y, pageWidth - margin, y);
    y += 16;

    pdf.setFontSize(11);
    const lines = pdf.splitTextToSize(result.text, contentWidth);
    const lineHeight = 14;
    lines.forEach((line) => {
      if (y + lineHeight > pageHeight - margin) {
        pdf.addPage();
        y = margin;
      }
      pdf.text(line, margin, y);
      y += lineHeight;
    });

    const safeTime = new Date().toISOString().replace(/[:.]/g, "-");
    pdf.save(`frag-recover-report-${safeTime}.pdf`);
  };

  return (
    <>
      <style>{styles}</style>
      <div className="app">

        <header className="header">
          <div className="header-inner">
            <div className="logo-block">
              <div className="logo">Frag·Recover</div>
            </div>
            <div className="header-mid">
              <span className="header-tag">// Forensic Document Reconstruction System</span>
            </div>
            <div className="header-right">
              <div className="stat">
                <div className="stat-val">AI</div>
                <div className="stat-label">Powered</div>
              </div>
              <div className="stat">
                <div className="stat-val">v1.5</div>
                <div className="stat-label">Build</div>
              </div>
            </div>
          </div>
        </header>

        <main className="main">

          <div className="section">
            <div className="label">
              <div className="label-tag">01 — Upload</div>
              <div className="label-line" />
            </div>
            <div
              className={`dropzone${hover ? " hover" : ""}`}
              onDragOver={e => { e.preventDefault(); setHover(true); }}
              onDragLeave={() => setHover(false)}
              onDrop={onDrop}
            >
              <input type="file" accept="image/*" multiple className="file-input"
                onChange={e => handleFiles(e.target.files)} />
              <span className="drop-icon">⬡</span>
              <p className="drop-text">Drop images here or click to browse</p>
              <p className="drop-sub">Photograph each strip separately · JPEG · PNG · WEBP</p>
            </div>

            {images.length > 0 && (
              <div className="previews">
                {images.map(({ url }, i) => (
                  <div key={i} className="preview-card">
                    <img src={url} alt={`Strip ${i+1}`} className="preview-img" />
                    <span className="preview-num">#{String(i+1).padStart(2,"0")}</span>
                    <button className="remove-btn" onClick={() => {
                      setImages(p => p.filter((_,j) => j !== i));
                      setResult(null);
                    }}>✕</button>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="section">
            <div className="label">
              <div className="label-tag">02 — Configure</div>
              <div className="label-line" />
            </div>
            <div className="controls">
              <select className="select" value={shredType} onChange={e => setShredType(e.target.value)}>
                <option value="strip">Strip-Cut (Vertical Strips)</option>
                <option value="crosscut">Cross-Cut (Rectangular Pieces)</option>
                <option value="microcut">Micro-Cut (Tiny Particles)</option>
              </select>
            </div>
            <textarea
              className="textarea"
              placeholder="Optional context — document type, date range, subject matter..."
              value={context}
              onChange={e => setContext(e.target.value)}
            />
          </div>

          <div className="section">
            <div className="label">
              <div className="label-tag">03 — Execute</div>
              <div className="label-line" />
            </div>
            <button className="btn" onClick={analyze} disabled={loading || !images.length}>
              {loading ? "Analyzing..." : "▶  Reconstruct Document"}
            </button>
            {loading && (
              <div className="loading-row">
                <div className="spinner" />
                Reading fragments and reconstructing content...
              </div>
            )}
            {error && <div className="error-row">⚠ {error}</div>}
          </div>

          {result && (
            <>
              <div className="divider" />
              <div className="section">
                <div className="label">
                  <div className="label-tag">04 — Output</div>
                  <div className="label-line" />
                </div>
                <div className="result-box">
                  <div className="result-header">
                    <span className="result-header-text">◈ Forensic Analysis Complete</span>
                    {result.confidence && (
                      <span className={`confidence-pill ${getConfidenceClass(result.confidence)}`}>
                        {result.confidence} Confidence
                      </span>
                    )}
                  </div>
                  <div className="result-body">{result.text}</div>
                </div>
              </div>

              <div className="section">
                <button className="btn" onClick={exportPDF}>
                  ⬇  Export Report as PDF
                </button>
              </div>
            </>
          )}

          <div className="divider" />
          <div className="info-box">
            <div className="info-title">⚠ Operational Notice</div>
            Strip-cut documents reconstruct best — photograph each strip individually in sequence.
            Cross-cut and micro-cut recovery is harder; provide context for better results.
            All reconstructions are AI-inferred estimates — treat as investigative leads only.
          </div>

        </main>
      </div>
    </>
  );
}