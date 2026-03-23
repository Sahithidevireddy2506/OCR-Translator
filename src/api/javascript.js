export const uploadImage = async (formData) => {
  const res = await fetch('http://127.0.0.1:5000/api/ocr', {
    method: 'POST',
    body: formData,
  });
  return await res.json();
};

export const translateText = async (text, lang) => {
  const res = await fetch('http://127.0.0.1:5000/api/translate', {
    method: 'POST',
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ text, lang }),
  });
  return await res.json();
};