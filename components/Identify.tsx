import React, { useEffect, useRef, useState } from "react";
import { Camera, Image } from "lucide-react";
import { getAiChatResponse } from "../services/aiService";

const Identify: React.FC = () => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [error, setError] = useState<string | null>(null);
  const [isScanning, setIsScanning] = useState(false);
  const [detectionMessage, setDetectionMessage] = useState<string | null>(null);
  const [useCamera, setUseCamera] = useState(false);
  const [uploadedImage, setUploadedImage] = useState<string | null>(null);
  const [animatedMessage, setAnimatedMessage] = useState<string>("");
  const [fade, setFade] = useState<boolean>(true);

  const scanningTexts = [
    "Analyzing image...",
    "Diagnosing plant condition...",
    "Checking for diseases...",
    "Identifying the spots...",
    "Evaluating the result...",
    "Almost done..."
  ];
  let animationInterval: NodeJS.Timeout;

  // Start camera if useCamera is true
  useEffect(() => {
    const getCamera = async () => {
      if (!useCamera) return;

      try {
        const stream = await navigator.mediaDevices.getUserMedia({
          video: { facingMode: "environment" },
        });
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
          await videoRef.current.play();
        }
      } catch (err: any) {
        console.error("Camera access error:", err);
        setError("Unable to access camera. Please allow permission in your browser settings.");
      }
    };

    getCamera();
  }, [useCamera]);

  // Animated scanning text with fade effect
  const startAnimatedMessage = () => {
    let i = 0;
    setAnimatedMessage(scanningTexts[i]);
    setFade(true);

    animationInterval = setInterval(() => {
      setFade(false); // fade out
      setTimeout(() => {
        i = (i + 1) % scanningTexts.length;
        setAnimatedMessage(scanningTexts[i]);
        setFade(true); // fade in new text
      }, 500); // fade duration
    }, 2000); // total time per message
  };

  const stopAnimatedMessage = () => {
    clearInterval(animationInterval);
    setAnimatedMessage("");
    setFade(true);
  };

  const handleScan = async () => {
    setIsScanning(true);
    setDetectionMessage(null);
    startAnimatedMessage();

    let imageData: string | null = null;

    if (useCamera && videoRef.current) {
      const canvas = document.createElement("canvas");
      canvas.width = videoRef.current.videoWidth;
      canvas.height = videoRef.current.videoHeight;
      const ctx = canvas.getContext("2d");
      if (!ctx) return;
      ctx.drawImage(videoRef.current, 0, 0, canvas.width, canvas.height);
      imageData = canvas.toDataURL("image/jpeg");
    } else if (uploadedImage) {
      imageData = uploadedImage;
    } else {
      setDetectionMessage("No image to scan.");
      setIsScanning(false);
      stopAnimatedMessage();
      return;
    }

    try {
      const result = await getAiChatResponse(imageData);
      setDetectionMessage(result);
    } catch (err) {
      console.error(err);
      setDetectionMessage("Sorry, I could not analyze the plant image right now.");
    }

    setIsScanning(false);
    stopAnimatedMessage();
  };

  const handleUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => setUploadedImage(reader.result as string);
    reader.readAsDataURL(file);
    setUseCamera(false);
  };

  return (
    <div className="pb-28 pt-20 px-4">
      <h1 className="text-3xl font-black mb-6 bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent">
        Identify Disease
      </h1>

      {/* Camera / Uploaded Image Box */}
      <div className="relative bg-gradient-to-br from-green-200 via-emerald-200 to-teal-200 dark:from-green-900/50 dark:via-emerald-900/50 dark:to-teal-900/50 rounded-3xl aspect-square flex items-center justify-center mb-6 shadow-xl border-4 border-white dark:border-gray-800 overflow-hidden">
        {error && <p className="text-red-600 text-center font-semibold px-3">{error}</p>}

        {useCamera && !error && (
          <video
            ref={videoRef}
            autoPlay
            playsInline
            muted
            className="absolute inset-0 w-full h-full object-cover rounded-3xl"
          />
        )}

        {uploadedImage && (
          <img
            src={uploadedImage}
            alt="Uploaded"
            className="absolute inset-0 w-full h-full object-cover rounded-3xl"
          />
        )}

        {!useCamera && !uploadedImage && !error && (
          <div className="text-gray-700 text-center px-6 text-lg font-medium animate-pulse">
            🌿 Your plant preview will appear here once you use the camera or upload an image.
          </div>
        )}

        {(useCamera || uploadedImage) && (
          <div className="absolute bottom-4 left-0 right-0 flex flex-col items-center gap-2">
            <button
              onClick={handleScan}
              disabled={isScanning}
              className="bg-green-600 text-white px-5 py-2 rounded-full font-semibold flex items-center gap-2 hover:bg-green-700 transition"
            >
              <Camera size={20} />
              {isScanning ? "Scanning..." : "Scan Plant"}
            </button>
          </div>
        )}
      </div>

      {/* Options: Use Camera / Upload */}
      <div className="grid grid-cols-2 gap-4 mb-4">
        <button
          onClick={() => {
            setUseCamera(true);
            setUploadedImage(null);
            setDetectionMessage(null);
            setError(null);
          }}
          className="py-5 border-4 border-green-500 text-green-600 rounded-2xl font-bold text-lg flex items-center justify-center gap-3 cursor-pointer hover:shadow-xl transition-all transform hover:scale-105 dark:bg-gray-700 dark:border-green-600 dark:text-green-400"
        >
          <Camera size={24} /> Use Camera
        </button>
        <label className="py-5 border-4 border-green-500 text-green-600 rounded-2xl font-bold text-lg flex items-center justify-center gap-3 cursor-pointer hover:shadow-xl transition-all transform hover:scale-105 dark:bg-gray-700 dark:border-green-600 dark:text-green-400">
          <Image size={24} /> Upload
          <input type="file" accept="image/*" onChange={handleUpload} className="hidden" />
        </label>
      </div>

      {/* AI Detection Result */}
<div className="mt-4 p-4 rounded-2xl bg-white dark:bg-gray-800 shadow-lg text-gray-800 dark:text-white min-h-[120px] flex flex-col">
  {/* AI Diagnosis Title (static, no pulse) */}
  <h2 className="font-bold text-lg text-green-600 dark:text-green-400 mb-2">
    AI Diagnosis:
  </h2>

        {/* Scanning / Result Message */}
        <div
          className={`flex-1 transition-opacity duration-300 ${
            fade ? "opacity-100" : "opacity-0"
          }`}
        >
          {isScanning ? (
            <p className="text-center font-medium text-gray-700 dark:text-gray-200">
              {animatedMessage}
            </p>
          ) : detectionMessage ? (
            <div className="text-left space-y-1">
              {detectionMessage.split("\n").map((line, index) => (
                <p key={index} className="font-medium">
                  <span className="font-bold text-green-600 dark:text-green-400">
                    {line.split(":")[0]}:
                  </span>
                  {line.split(":")[1] ? ` ${line.split(":")[1]}` : ""}
                </p>
              ))}
            </div>
          ) : (
            <p className="text-center text-gray-700 dark:text-gray-200">
              🌿 Please capture or upload a plant image to identify potential diseases.
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default Identify;
