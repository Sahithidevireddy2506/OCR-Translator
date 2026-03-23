import React, { useState } from "react";
import { uploadImage, translateText } from "../api/javascript";

function ImageCapture() {
  const [image, setImage] = useState(null);
  const [text, setText] = useState("");
  const [translated, setTranslated] = useState("");
  const [lang, setLang] = useState("en");

  const handleUpload = async () => {
    const formData = new FormData();
    formData.append("image", image);

    const res = await uploadImage(formData);

    if (res.text) {
      setText(res.text);
    }
  };

  const handleTranslate = async () => {
    const res = await translateText(text, lang);

    if (res.translated) {
      setTranslated(res.translated);
    }
  };

  return (
    <div style={{ padding: "20px" }}>
      <h2>📄 OCR + Translator</h2>

      <input type="file" onChange={(e) => setImage(e.target.files[0])} />
      <br /><br />

      <button onClick={handleUpload}>Extract Text</button>

      <h3>📝 Extracted Text:</h3>
      <textarea value={text} rows={6} cols={50} readOnly />

      <br /><br />

      <select onChange={(e) => setLang(e.target.value)}>
        <option value="en">English</option>
        <option value="te">Telugu</option>
        <option value="hi">Hindi</option>
      </select>

      <button onClick={handleTranslate}>Translate</button>

      <h3>🌐 Translated Text:</h3>
      <textarea value={translated} rows={6} cols={50} readOnly />
    </div>
  );
}

export default ImageCapture;