import { useState } from "react";

const API = "http://localhost:5000";

const LANGUAGES = [
  { code: "en", label: "English" },
  { code: "hi", label: "Hindi" },
  { code: "te", label: "Telugu" },
  { code: "ta", label: "Tamil" },
  { code: "fr", label: "French" },
  { code: "de", label: "German" },
  { code: "es", label: "Spanish" },
  { code: "ar", label: "Arabic" },
  { code: "zh-CN", label: "Chinese" },
  { code: "ja", label: "Japanese" },
  { code: "ko", label: "Korean" },
  { code: "ru", label: "Russian" },
  { code: "pt", label: "Portuguese" },
];

export default function App() {
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [targetLang, setTargetLang] = useState("te");
  const [extractedText, setExtractedText] = useState("");
  const [translatedText, setTranslatedText] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleFileChange = (e) => {
    const selected = e.target.files[0];
    if (!selected) return;
    setFile(selected);
    setPreview(URL.createObjectURL(selected));
    setExtractedText("");
    setTranslatedText("");
    setError("");
  };

  const handleExtract = async () => {
    if (!file) { setError("Please select an image first."); return; }

    setLoading(true);
    setError("");
    setExtractedText("");
    setTranslatedText("");

    try {
      // Step 1: OCR
      const formData = new FormData();
      formData.append("image", file);

      const ocrRes = await fetch(`${API}/api/ocr`, {
        method: "POST",
        body: formData,
      });
      const ocrData = await ocrRes.json();

      if (!ocrRes.ok) throw new Error(ocrData.error || "OCR failed");

      const text = ocrData.text;
      setExtractedText(text);

      // Step 2: Translate
      const trRes = await fetch(`${API}/api/translate`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text, target: targetLang }),
      });
      const trData = await trRes.json();

      if (!trRes.ok) throw new Error(trData.error || "Translation failed");

      setTranslatedText(trData.translated_text);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleTranslateOnly = async () => {
    if (!extractedText) { setError("Extract text first."); return; }

    setLoading(true);
    setError("");

    try {
      const res = await fetch(`${API}/api/translate`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text: extractedText, target: targetLang }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Translation failed");
      setTranslatedText(data.translated_text);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={styles.page}>
      <div style={styles.container}>
        <h1 style={styles.title}>📷 OCR + Translator</h1>
        <p style={styles.subtitle}>Extract text from images and translate instantly</p>

        {/* Upload */}
        <div style={styles.card}>
          <label style={styles.label}>Upload Image</label>
          <input
            type="file"
            accept="image/*"
            onChange={handleFileChange}
            style={styles.fileInput}
          />
          {preview && (
            <img src={preview} alt="preview" style={styles.preview} />
          )}
        </div>

        {/* Language Selector */}
        <div style={styles.card}>
          <label style={styles.label}>Translate To</label>
          <select
            value={targetLang}
            onChange={(e) => setTargetLang(e.target.value)}
            style={styles.select}
          >
            {LANGUAGES.map((l) => (
              <option key={l.code} value={l.code}>{l.label}</option>
            ))}
          </select>
        </div>

        {/* Buttons */}
        <button
          onClick={handleExtract}
          disabled={loading || !file}
          style={{ ...styles.btn, opacity: loading || !file ? 0.5 : 1 }}
        >
          {loading ? "⏳ Processing..." : "Extract Text & Translate"}
        </button>

        {/* Error */}
        {error && (
          <div style={styles.errorBox}>
            ⚠️ {error}
          </div>
        )}

        {/* Extracted Text */}
        {extractedText && (
          <div style={styles.card}>
            <div style={styles.resultHeader}>
              <label style={styles.label}>📄 Extracted Text</label>
              <button
                onClick={handleTranslateOnly}
                style={styles.retranslateBtn}
                disabled={loading}
              >
                Re-translate
              </button>
            </div>
            <textarea
              value={extractedText}
              onChange={(e) => setExtractedText(e.target.value)}
              style={styles.textarea}
              rows={5}
            />
          </div>
        )}

        {/* Translated Text */}
        {translatedText && (
          <div style={styles.card}>
            <label style={styles.label}>🌐 Translated Text</label>
            <div style={styles.resultBox}>{translatedText}</div>
            <button
              onClick={() => navigator.clipboard.writeText(translatedText)}
              style={styles.copyBtn}
            >
              Copy
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

const styles = {
  page: {
    minHeight: "100vh",
    background: "#f0f4ff",
    display: "flex",
    justifyContent: "center",
    padding: "2rem 1rem",
    fontFamily: "Segoe UI, sans-serif",
  },
  container: {
    width: "100%",
    maxWidth: "600px",
    display: "flex",
    flexDirection: "column",
    gap: "1rem",
  },
  title: {
    fontSize: "1.8rem",
    fontWeight: "bold",
    color: "#1a1a2e",
    margin: 0,
  },
  subtitle: {
    color: "#666",
    margin: 0,
    fontSize: "0.9rem",
  },
  card: {
    background: "#fff",
    borderRadius: "12px",
    padding: "1.25rem",
    boxShadow: "0 2px 8px rgba(0,0,0,0.08)",
    display: "flex",
    flexDirection: "column",
    gap: "0.75rem",
  },
  label: {
    fontWeight: "600",
    fontSize: "0.85rem",
    color: "#333",
    textTransform: "uppercase",
    letterSpacing: "0.5px",
  },
  fileInput: {
    fontSize: "0.9rem",
    cursor: "pointer",
  },
  preview: {
    maxWidth: "100%",
    maxHeight: "200px",
    borderRadius: "8px",
    objectFit: "contain",
    border: "1px solid #e0e0e0",
  },
  select: {
    padding: "0.6rem 0.9rem",
    borderRadius: "8px",
    border: "1px solid #ddd",
    fontSize: "0.95rem",
    background: "#fafafa",
    cursor: "pointer",
  },
  btn: {
    padding: "0.9rem",
    background: "linear-gradient(135deg, #667eea, #764ba2)",
    color: "#fff",
    border: "none",
    borderRadius: "10px",
    fontSize: "1rem",
    fontWeight: "700",
    cursor: "pointer",
    transition: "opacity 0.2s",
  },
  errorBox: {
    background: "#fff0f0",
    border: "1px solid #fcc",
    color: "#c0392b",
    padding: "0.75rem 1rem",
    borderRadius: "8px",
    fontSize: "0.9rem",
  },
  resultHeader: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
  },
  textarea: {
    padding: "0.75rem",
    borderRadius: "8px",
    border: "1px solid #ddd",
    fontSize: "0.9rem",
    fontFamily: "monospace",
    resize: "vertical",
    lineHeight: "1.6",
    background: "#fafafa",
  },
  resultBox: {
    padding: "0.75rem",
    background: "#f0f7ff",
    border: "1px solid #c8e0ff",
    borderRadius: "8px",
    fontSize: "0.95rem",
    lineHeight: "1.7",
    whiteSpace: "pre-wrap",
    wordBreak: "break-word",
  },
  copyBtn: {
    alignSelf: "flex-end",
    padding: "0.4rem 1rem",
    background: "#e8f0fe",
    border: "1px solid #c5d5f5",
    borderRadius: "6px",
    fontSize: "0.8rem",
    cursor: "pointer",
    color: "#3366cc",
    fontWeight: "600",
  },
  retranslateBtn: {
    padding: "0.35rem 0.8rem",
    background: "#f0f0f0",
    border: "1px solid #ddd",
    borderRadius: "6px",
    fontSize: "0.78rem",
    cursor: "pointer",
    color: "#555",
  },
};