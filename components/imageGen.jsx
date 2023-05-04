"use client";
import { useState, useEffect } from "react";
import Image from "next/image";
import TypingAnimation from "../components/typingAnimation";




const ImageGenerator = () => {
  const [inputText, setInputText] = useState("");
  const [imageUrls, setImageUrls] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [controller, setController] = useState(null);

  useEffect(() => {
    return () => {
      if (controller !== null) {
        controller.abort();
      }
    };
  }, [controller]);
  const Apis =["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",
            "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", 
            "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",
            "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"
          ];

  const generateImage = async () => {
    setIsLoading(true);
    const abortController = new AbortController();
    setController(abortController);

    try {
      const promises = [
        fetch(
          "https://api-inference.huggingface.co/models/stabilityai/stable-diffusion-2-1",
          {
            method: "POST",
            headers: {
              "content-type": "application/json",
              Authorization: `Bearer ${Apis[0]}`,
            },
            body: JSON.stringify({ inputs: inputText }),
            signal: abortController.signal,
          }
        ),
        fetch(
          "https://api-inference.huggingface.co/models/stabilityai/stable-diffusion-2",
          {
            method: "POST",
            headers: {
              "content-type": "application/json",
              Authorization: `Bearer ${Apis[1]}`,
            },
            body: JSON.stringify({ inputs: inputText }),
            signal: abortController.signal,
          }
        ),
        fetch(
          "https://api-inference.huggingface.co/models/runwayml/stable-diffusion-v1-5",
          {
            method: "POST",
            headers: {
              "content-type": "application/json",
              Authorization: `Bearer ${Apis[2]}`,
            },
            body: JSON.stringify({ inputs: inputText }),
            signal: abortController.signal,
          }
        ),
        fetch(
          "https://api-inference.huggingface.co/models/prompthero/openjourney-v4",
          {
            method: "POST",
            headers: {
              "content-type": "application/json",
              Authorization: `Bearer ${Apis[3]}`,
            },
            body: JSON.stringify({ inputs: inputText }),
            signal: abortController.signal,
          }
        ),
      
      ];

      const responses = await Promise.all(promises);
      const imageBlobs = await Promise.all(
        responses.map((response) => response.blob())
      );

      const newImageUrls = imageBlobs.map((blob) => URL.createObjectURL(blob));

      setImageUrls(newImageUrls);
    } catch (err) {
      if (err.name !== "AbortError") {
        setError("An error occurred while generating the image");
      }
    } finally {
      setIsLoading(false);
      setController(null);
    }
  };

  const handleDownload = (url) => {
    const a = document.createElement("a");
    a.href = url;
    a.download = "generated-image.png";
    a.click();
  };

  const handleImageError = (index) => {
    setImageUrls((prevImageUrls) =>
      prevImageUrls.filter((_, i) => i !== index)
    );
  };

  const cancelGeneration = () => {
    if (controller !== null) {
    controller.abort();
    }
    setInputText("");
    setIsLoading(false);
    setImageUrls([]);
    setError(null);
    };
    
    return (
    <div className="grid place-items-center  text-black">
    <h1 className="text-4xl m-10 font-medium ">Image Generation via Stable-diffusion</h1>
    <form
    onSubmit={(e) => {
    e.preventDefault();
    setImageUrls([]);
    generateImage();
    }}
    >
    <label htmlFor="input-text">Text:</label>
    <input
  type="text"
  id="input-text"
  value={inputText}
  onChange={(e) => setInputText(e.target.value)}
  aria-label="Enter text to generate an image"
  title="Enter text to generate an image"
  className="imagegen-input"
/>
<button type="submit" aria-label="Generate Image" title="Generate Image" disabled={isLoading}>
  {isLoading ? "Generating..." : "Generate"}
</button>
{isLoading && (
  <button type="button" onClick={cancelGeneration} className="cancel-button" aria-label="Cancel Image Generation" title="Cancel Image Generation">
    Cancel
  </button>
)}
</form>
  {isLoading && (
    <div className="loading-spinner" role="status">
      <span className="visually-hidden "><TypingAnimation/></span>
    </div>
  )}
  {error && <div className="error-message">{error}</div>}
  <div className="image-row-container">
    {imageUrls.map((url, index) => (
      <div key={url + index} >
        <Image className="imgContainer p-1.5 "src={url} alt="Generated Image" width="450" height="450" onError={() => handleImageError(index) }/>
        <div class="text-center ">
          <button
            onClick={() => handleDownload(url)}
            aria-label="Download Image"
            title="Download Image"
          >
            Download
          </button>
        </div>
      </div>
    ))}
  </div>
</div>
);
};
export default ImageGenerator;
