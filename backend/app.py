from flask import Flask, request, jsonify
from flask_cors import CORS
import pytesseract
from PIL import Image
from googletrans import Translator
import io

app = Flask(__name__)
CORS(app)

# 🔥 IMPORTANT: Set Tesseract path
pytesseract.pytesseract.tesseract_cmd = r"C:\Program Files\Tesseract-OCR\tesseract.exe"

translator = Translator()

# ✅ OCR API
@app.route('/api/ocr', methods=['POST'])
def ocr():
    try:
        if 'file' not in request.files:
            return jsonify({"error": "No file uploaded"}), 400

        file = request.files['file']
        image = Image.open(file.stream)

        # Extract text
        text = pytesseract.image_to_string(image)

        return jsonify({"text": text})

    except Exception as e:
        return jsonify({"error": str(e)}), 500


# ✅ Translate API
@app.route('/api/translate', methods=['POST'])
def translate():
    try:
        data = request.get_json()

        text = data.get("text")
        lang = data.get("lang")

        if not text:
            return jsonify({"error": "No text provided"}), 400

        translated = translator.translate(text, dest=lang)

        return jsonify({"translatedText": translated.text})

    except Exception as e:
        return jsonify({"error": str(e)}), 500


# ✅ Run server
if __name__ == '__main__':
    app.run(debug=True)