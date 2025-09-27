import React, { useState } from "react";
import axios from "axios";
import "./App.css"; // optional for extra styling

function App() {
  const [image, setImage] = useState(null);
  const [preview, setPreview] = useState("");
  const [ocrText, setOcrText] = useState("");
  const [loading, setLoading] = useState(false);
  const [dragOver, setDragOver] = useState(false);

  // Backend URL
  const BACKEND_URL = "https://wordscanner-backend-4zhs.onrender.com";

  // Handle image selection
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    setImage(file);
    setPreview(URL.createObjectURL(file));
    setOcrText("");
  };

  // Handle drag events
  const handleDragOver = (e) => {
    e.preventDefault();
    setDragOver(true);
  };

  const handleDragLeave = () => {
    setDragOver(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setDragOver(false);
    const file = e.dataTransfer.files[0];
    if (file) {
      setImage(file);
      setPreview(URL.createObjectURL(file));
      setOcrText("");
    }
  };

  // Send image to backend for OCR
  const handleUpload = async () => {
    if (!image) return;
    setLoading(true);

    const formData = new FormData();
    formData.append("image", image);

    try {
      const res = await axios.post(`${BACKEND_URL}/ocr`, formData);
      setOcrText(res.data.text);
    } catch (err) {
      console.error(err);
      setOcrText("Error While Extracting text");
    } finally {
      setLoading(false);
    }
  };

  // Reset uploaded data
  const handleReset = () => {
    setImage(null);
    setPreview("");
    setOcrText("");
  };

  // Copy text
  const handleCopy = () => {
    navigator.clipboard.writeText(ocrText);
    alert("Copied to clipboard!");
  };

  // Download as .txt
  const handleDownload = () => {
    const element = document.createElement("a");
    const file = new Blob([ocrText], { type: "text/plain" });
    element.href = URL.createObjectURL(file);
    element.download = "word_extraction.txt";
    document.body.appendChild(element);
    element.click();
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        width: "100%",
        backgroundImage: "url('/background.png')",
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
        position: "relative",
        color: "white",
        fontFamily: "Arial, sans-serif",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        textAlign: "center",
        padding: "50px 20px",
      }}
    >
      {/* Overlay */}
      <div
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          height: "100%",
          width: "100%",
          backgroundColor: "rgba(0,0,0,0.5)",
          zIndex: 1,
        }}
      />

      {/* Content */}
      <div style={{ position: "relative", zIndex: 2, width: "100%", maxWidth: "900px" }}>
        <h1
          style={{
            fontSize: "4rem",
            color: "offwhite",
            marginBottom: "10px",
            textShadow: "2px 2px 4px rgba(0, 0, 0, 0.68)",
          }}
        >
          Word Scanner
        </h1>
        <p
          style={{
            fontSize: "1.5rem",
            marginBottom: "30px",
            color: "#fff940ff",
            textShadow: "1px 1px 2px rgba(0,0,0,0.7)",
          }}
        >
          Upload an image and extract text instantly...Inspired by Google Lens!
        </p>

        {/* Drag + Drop Zone (same area as choose file) */}
        <div
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          style={{
            border: dragOver ? "3px dashed #00E676" : "3px dashed lightgreen",
            borderRadius: "10px",
            padding: "20px",
            marginBottom: "30px",
            background: dragOver ? "rgba(0, 230, 118, 0.2)" : "rgba(255,255,255,0.1)",
            cursor: "pointer",
          }}
        >
          <p style={{ marginBottom: "10px", color: "#f5ff40ee" }}>
            Drag & Drop an image here OR click below!
          </p>
          <input
            type="file"
            accept="image/*"
            onChange={handleFileChange}
            style={{
              padding: "10px",
              fontSize: "1rem",
              borderRadius: "5px",
              border: "2px solid lightgreen",
              background: "white",
              color: "black",
              cursor: "pointer",
            }}
          />
        </div>

        {/* Buttons */}
        <div style={{ marginBottom: "30px" }}>
          <button
            onClick={handleUpload}
            style={{
              padding: "10px 20px",
              fontSize: "1rem",
              backgroundColor: "#3f22ffff",
              color: "#fff",
              border: "none",
              borderRadius: "5px",
              cursor: "pointer",
              boxShadow: "2px 2px 5px rgba(0,0,0,0.5)",
              marginRight: "10px",
            }}
          >
            Extract Text
          </button>
          <button
            onClick={handleReset}
            style={{
              padding: "10px 20px",
              fontSize: "1rem",
              backgroundColor: "gray",
              color: "#fff",
              border: "none",
              borderRadius: "5px",
              cursor: "pointer",
            }}
          >
            Reset
          </button>
        </div>

        {/* Loading Spinner */}
        {loading && (
          <div style={{ marginBottom: "20px", fontSize: "1.2rem", color: "#FFD740" }}>
            Processing... ⏳
          </div>
        )}

        {/* Preview uploaded image */}
        {preview && (
          <div style={{ marginBottom: "30px" }}>
            <h3 style={{ color: "#00E676" }}>Image Uploaded</h3>
            <img
              src={preview}
              alt="preview"
              style={{
                maxWidth: "600px",
                borderRadius: "10px",
                boxShadow: "0 0 20px rgba(0,0,0,0.5)",
              }}
            />
          </div>
        )}

        {/* Display OCR text */}
        {ocrText && (
          <div
            style={{
              maxWidth: "800px",
              backgroundColor: "rgba(0, 0, 0, 0.7)",
              padding: "20px",
              borderRadius: "10px",
              boxShadow: "0 0 20px rgba(0,0,0,0.5)",
            }}
          >
            <h3 style={{ color: "#00E676" }}>Extracted Text:</h3>
            <pre style={{ whiteSpace: "pre-wrap", color: "#FFD740", fontSize: "1.2rem" }}>
              {ocrText}
            </pre>

            {/* Copy & Download buttons */}
            <div style={{ marginTop: "15px" }}>
              <button
                onClick={handleCopy}
                style={{
                  padding: "8px 16px",
                  backgroundColor: "#00E676",
                  color: "black",
                  border: "none",
                  borderRadius: "5px",
                  cursor: "pointer",
                  marginRight: "10px",
                }}
              >
                Copy
              </button>
              <button
                onClick={handleDownload}
                style={{
                  padding: "8px 16px",
                  backgroundColor: "#2979FF",
                  color: "#fff",
                  border: "none",
                  borderRadius: "5px",
                  cursor: "pointer",
                }}
              >
                Download
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default App;
