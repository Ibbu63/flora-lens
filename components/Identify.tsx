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
    "Identifying leaf patterns...",
    "Evaluating plant health...",
    "Almost done...",
  ];

  let animationInterval: NodeJS.Timeout;

  // Start camera
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
        setError("Unable to access camera. Please allow permission.");
      }
    };

    getCamera();
  }, [useCamera]);

  // Animated text
  const startAnimatedMessage = () => {
    let i = 0;
    setAnimatedMessage(scanningTexts[i]);
    setFade(true);

    animationInterval = setInterval(() => {
      setFade(false);
      setTimeout(() => {
        i = (i + 1) % scanningTexts.length;
        setAnimatedMessage(scanningTexts[i]);
        setFade(true);
      }, 300);
    }, 1800);
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
      setDetectionMessage("Unable to analyze plant image right now.");
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

      {/* Page Title */}
      <h1 className="text-4xl font-extrabold mb-6 text-green-700 dark:text-green-400 flex items-center gap-3" >
  <span className="px-3 py-1 bg-green-100 dark:bg-green-800 rounded-xl text-2xl shadow-md">🌱</span>
  Identify Disease
</h1>


      {/* PREVIEW CARD */}
      <div className="
  relative rounded-3xl aspect-square p-1
  bg-gradient-to-br from-green-500 via-emerald-400 to-teal-400 
  shadow-xl overflow-hidden mb-8
">
  <div className="rounded-3xl w-full h-full bg-white dark:bg-gray-900 overflow-hidden flex items-center justify-center">

        {error && <p className="text-red-600 text-center font-semibold px-3">{error}</p>}

        {/* Camera feed */}
        {useCamera && !error && (
          <video
            ref={videoRef}
            autoPlay
            playsInline
            muted
            className="absolute inset-0 w-full h-full object-cover rounded-3xl"
          />
        )}

        {/* Uploaded Image */}
        {uploadedImage && (
          <img
            src={uploadedImage}
            alt="Uploaded"
            className="absolute inset-0 w-full h-full object-cover rounded-3xl"
          />
        )}

        {/* Placeholder */}
        {!useCamera && !uploadedImage && !error && (
          <p className="text-gray-700 text-center px-6 text-lg font-medium animate-pulse dark:text-gray-300">
            🌿 Your plant preview will appear here once you use the camera or upload an image.
          </p>
        )}

        {/* Scan Button */}
        {(useCamera || uploadedImage) && (
          <div className="absolute bottom-4 w-full flex justify-center">
            <button
              onClick={handleScan}
              disabled={isScanning}
              className="
                bg-gradient-to-r from-green-600 to-emerald-600 
                text-white px-6 py-2 rounded-full font-semibold 
                flex items-center gap-2 shadow-lg hover:shadow-xl 
                hover:scale-105 transition disabled:opacity-50
              "
            >
              <Camera size={20} />
              {isScanning ? "Scanning..." : "Scan Plant"}
            </button>
          </div>
        )}
      </div>

      {/* Camera / Upload Options */}
      <div className="grid grid-cols-2 gap-4 mb-8">
        <button
          onClick={() => {
            setUseCamera(true);
            setUploadedImage(null);
            setDetectionMessage(null);
            setError(null);
          }}
          className="
            py-5 rounded-2xl font-bold text-lg flex items-center justify-center gap-3
            border-2 border-green-500 text-green-700 bg-white shadow-md
            hover:shadow-xl hover:scale-[1.03] transition
            dark:bg-gray-700 dark:text-green-300 dark:border-green-500
          "
        >
          <Camera size={24} /> Use Camera
        </button>

        <label
          className="
            py-5 rounded-2xl font-bold text-lg flex items-center justify-center gap-3
            border-2 border-green-500 text-green-700 bg-white shadow-md
            hover:shadow-xl hover:scale-[1.03] transition cursor-pointer
            dark:bg-gray-700 dark:text-green-300 dark:border-green-500
          "
        >
          <Image size={24} /> Upload
          <input type="file" accept="image/*" onChange={handleUpload} className="hidden" />
        </label>
      </div>

      {/* AI DIAGNOSIS SECTION */}
      <div className="
        p-5 rounded-3xl shadow-lg bg-white dark:bg-gray-800 
        border border-green-200/40 dark:border-green-700/40
      ">
        <h2 className="font-bold text-xl text-green-700 dark:text-green-400 mb-3">
          AI Diagnosis
        </h2>

        <div className={`transition-opacity duration-300 ${fade ? "opacity-100" : "opacity-0"}`}>
          {isScanning ? (
            <p className="text-center font-medium text-gray-700 dark:text-gray-200">
              {animatedMessage}
            </p>
          ) : detectionMessage ? (
            <div className="space-y-1 text-gray-700 dark:text-gray-200">
              {detectionMessage.split("\n").map((line, index) => (
                <p key={index}>
                  <span className="font-bold text-green-700 dark:text-green-400">
                    {line.split(":")[0]}:
                  </span>
                  {line.split(":")[1] ? ` ${line.split(":")[1]}` : ""}
                </p>
              ))}
            </div>
          ) : (
            <p className="text-center text-gray-600 dark:text-gray-300">
              🌱 Capture or upload a plant image to identify diseases.
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default Identify;
