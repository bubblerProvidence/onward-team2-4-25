"use client";
import Image from "next/image";
import { useState, useRef, useEffect } from "react";

export default function TryOn() {
  const [isCameraActive, setIsCameraActive] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isClient, setIsClient] = useState(false);
  const [availableCameras, setAvailableCameras] = useState<MediaDeviceInfo[]>([]);
  const [permissionStatus, setPermissionStatus] = useState<'prompt' | 'granted' | 'denied'>('prompt');
  const [showLipstickOptions, setShowLipstickOptions] = useState(false);
  const [showEyeshadowOptions, setShowEyeshadowOptions] = useState(false);
  const [showHighlighterOptions, setShowHighlighterOptions] = useState(false);
  const [selectedLipstickColor, setSelectedLipstickColor] = useState<string | null>(null);
  const [selectedEyeshadowColor, setSelectedEyeshadowColor] = useState<string | null>(null);
  const [selectedHighlighterColor, setSelectedHighlighterColor] = useState<string | null>(null);
  const [imageTransform, setImageTransform] = useState({
    scale: 1,
    rotate: 0,
    translateX: 0,
    translateY: 0
  });
  const videoRef = useRef<HTMLVideoElement>(null);
  const previewRef = useRef<HTMLVideoElement>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const [uploadedImage, setUploadedImage] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    setIsClient(true);
    checkPermissions();
  }, []);

  const checkPermissions = async () => {
    try {
      // Check if we're on localhost or HTTPS
      const isLocalhost = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1';
      const isHttps = window.location.protocol === 'https:';
      
      if (!isLocalhost && !isHttps) {
        setError('Camera access requires HTTPS or localhost. Please use HTTPS or run on localhost.');
        return;
      }

      // Check camera permissions
      const permissionStatus = await navigator.permissions.query({ name: 'camera' as PermissionName });
      setPermissionStatus(permissionStatus.state);
      
      if (permissionStatus.state === 'denied') {
        setError('Camera access has been denied. Please enable camera permissions in your browser settings.');
        return;
      }

      // If permissions are granted, enumerate cameras
      if (permissionStatus.state === 'granted') {
        await enumerateCameras();
      }
    } catch (err) {
      console.error('Error checking permissions:', err);
      setError('Error checking camera permissions');
    }
  };

  const enumerateCameras = async () => {
    try {
      const devices = await navigator.mediaDevices.enumerateDevices();
      const videoDevices = devices.filter(device => device.kind === 'videoinput');
      setAvailableCameras(videoDevices);
      console.log('Available cameras:', videoDevices.map(device => ({
        id: device.deviceId,
        label: device.label,
        groupId: device.groupId
      })));
    } catch (err) {
      console.error('Error enumerating cameras:', err);
      setError('Error accessing camera devices');
    }
  };

  const startCamera = async () => {
    try {
      setError(null);
      console.log("Starting camera...");
      
      if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
        throw new Error("Camera API not available");
      }

      // First try to get any camera without specifying deviceId
      let stream;
      try {
        stream = await navigator.mediaDevices.getUserMedia({ 
          video: { 
            width: { ideal: 1280 },
            height: { ideal: 720 }
          } 
        });
      } catch (err: unknown) {
        if (err instanceof Error) {
          if (err.name === 'NotAllowedError') {
            throw new Error('Camera access was denied. Please allow camera access in your browser settings.');
          } else if (err.name === 'NotFoundError') {
            throw new Error('No camera found. Please connect a camera and try again.');
          } else {
            throw new Error(`Could not access camera: ${err.message}`);
          }
        } else {
          throw new Error('An unknown error occurred while accessing the camera');
        }
      }

      // If we got a stream, enumerate devices again to get labels
      if (stream) {
        await enumerateCameras();
        
        if (videoRef.current) {
          console.log("Setting up main video element");
          videoRef.current.srcObject = stream;
          videoRef.current.onloadedmetadata = () => {
            console.log("Main video metadata loaded");
            videoRef.current?.play()
              .then(() => console.log("Main video started playing"))
              .catch(err => {
                console.error("Error playing main video:", err);
                setError("Error playing video feed");
              });
          };
        }
        
        if (previewRef.current) {
          console.log("Setting up preview video element");
          previewRef.current.srcObject = stream;
          previewRef.current.onloadedmetadata = () => {
            console.log("Preview video metadata loaded");
            previewRef.current?.play()
              .then(() => console.log("Preview video started playing"))
              .catch(err => {
                console.error("Error playing preview video:", err);
              });
          };
        }
        
        streamRef.current = stream;
        setIsCameraActive(true);
      }
    } catch (err) {
      console.error("Error accessing camera:", err);
      setError(`Could not access camera: ${err instanceof Error ? err.message : 'Unknown error'}`);
    }
  };

  const stopCamera = () => {
    if (streamRef.current) {
      console.log("Stopping camera...");
      streamRef.current.getTracks().forEach(track => {
        track.stop();
        console.log("Stopped track:", track.kind);
      });
      if (videoRef.current) {
        videoRef.current.srcObject = null;
      }
      if (previewRef.current) {
        previewRef.current.srcObject = null;
      }
      setIsCameraActive(false);
    }
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      // Stop camera if it's active
      if (isCameraActive) {
        stopCamera();
      }
      
      // Create URL for the uploaded image
      const imageUrl = URL.createObjectURL(file);
      setUploadedImage(imageUrl);
      // Reset transform when new image is uploaded
      setImageTransform({
        scale: 1,
        rotate: 0,
        translateX: 0,
        translateY: 0
      });
    }
  };

  const handleUploadClick = () => {
    fileInputRef.current?.click();
  };

  // Clean up uploaded image URL when component unmounts
  useEffect(() => {
    return () => {
      if (uploadedImage) {
        URL.revokeObjectURL(uploadedImage);
      }
    };
  }, [uploadedImage]);

  useEffect(() => {
    return () => {
      stopCamera();
    };
  }, []);

  const lipstickColors = [
    { name: 'Classic Red', hex: '#C41E3A' },
    { name: 'Nude Pink', hex: '#E6B8B7' },
    { name: 'Berry', hex: '#9B1B30' },
    { name: 'Coral', hex: '#FF7F50' },
    { name: 'Mauve', hex: '#915F6D' },
    { name: 'Plum', hex: '#8E4585' },
  ];

  const eyeshadowColors = [
    { name: 'Neutral Brown', hex: '#8B4513' },
    { name: 'Smoky Gray', hex: '#808080' },
    { name: 'Gold', hex: '#FFD700' },
    { name: 'Purple', hex: '#800080' },
    { name: 'Emerald', hex: '#50C878' },
    { name: 'Navy', hex: '#000080' },
  ];

  const highlighterColors = [
    { name: 'Pearl', hex: '#F0F0F0' },
    { name: 'Rose Gold', hex: '#B76E79' },
    { name: 'Champagne', hex: '#F7E7CE' },
    { name: 'Iridescent', hex: '#E6E6FA' },
    { name: 'Bronze', hex: '#CD7F32' },
    { name: 'Silver', hex: '#C0C0C0' },
  ];

  if (!isClient) {
    return null;
  }

  return (
    <div className="min-h-screen bg-pink-50">
      {error && (
        <div className="fixed top-4 left-1/2 transform -translate-x-1/2 bg-red-100 text-red-800 px-4 py-2 rounded-lg shadow-lg z-50">
          {error}
        </div>
      )}
      {isCameraActive && (
        <div className="fixed top-4 right-4 z-50 w-32 h-32 rounded-full overflow-hidden shadow-lg border-4 border-pink-200">
          <video
            ref={previewRef}
            autoPlay
            playsInline
            muted
            className="w-full h-full object-cover"
          />
        </div>
      )}
      <main className="container mx-auto px-4 py-16">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-serif text-pink-800 mb-4 font-light tracking-wide">
            Virtual Makeup Try-On
          </h1>
          <p className="text-xl text-pink-600 font-light">
            Try different looks and find your perfect style
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 max-w-6xl mx-auto">
          {/* Camera View Section */}
          <div className="bg-white/50 p-6 rounded-xl shadow-sm backdrop-blur-sm">
            <div className="aspect-video bg-pink-100 rounded-lg mb-4 overflow-hidden relative">
              {!isCameraActive && !uploadedImage ? (
                <div className="w-full h-full flex items-center justify-center">
                  <span className="text-6xl">📸</span>
                </div>
              ) : uploadedImage ? (
                <div className="w-full h-full relative overflow-hidden">
                  <img
                    src={uploadedImage}
                    alt="Uploaded photo"
                    className="w-full h-full object-cover"
                    style={{
                      transform: `scale(${imageTransform.scale}) rotate(${imageTransform.rotate}deg) translate(${imageTransform.translateX}px, ${imageTransform.translateY}px)`,
                      transformOrigin: 'center'
                    }}
                  />
                </div>
              ) : (
                <video
                  ref={videoRef}
                  autoPlay
                  playsInline
                  className="w-full h-full object-cover"
                  style={{ transform: 'scaleX(-1)' }}
                />
              )}
            </div>
            <div className="flex gap-4 justify-center">
              {!isCameraActive ? (
                <button
                  onClick={startCamera}
                  className="bg-pink-200 hover:bg-pink-300 text-pink-800 px-6 py-2 rounded-full transition-all duration-300 shadow-sm hover:shadow-md"
                >
                  Start Camera
                </button>
              ) : (
                <button
                  onClick={stopCamera}
                  className="bg-pink-200 hover:bg-pink-300 text-pink-800 px-6 py-2 rounded-full transition-all duration-300 shadow-sm hover:shadow-md"
                >
                  Stop Camera
                </button>
              )}
              <input
                type="file"
                ref={fileInputRef}
                onChange={handleFileUpload}
                accept="image/*"
                className="hidden"
              />
              <button 
                onClick={handleUploadClick}
                className="bg-white hover:bg-pink-100 text-pink-800 px-6 py-2 rounded-full transition-all duration-300 shadow-sm hover:shadow-md border border-pink-200"
              >
                Upload Photo
              </button>
            </div>

            {uploadedImage && (
              <div className="mt-6 space-y-4">
                <h3 className="text-lg text-pink-700 font-light">Adjust Image</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-sm text-pink-600">Scale</label>
                    <input
                      type="range"
                      min="0.5"
                      max="2"
                      step="0.1"
                      value={imageTransform.scale}
                      onChange={(e) => setImageTransform(prev => ({
                        ...prev,
                        scale: parseFloat(e.target.value)
                      }))}
                      className="w-full accent-pink-500"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm text-pink-600">Rotation</label>
                    <input
                      type="range"
                      min="-180"
                      max="180"
                      step="1"
                      value={imageTransform.rotate}
                      onChange={(e) => setImageTransform(prev => ({
                        ...prev,
                        rotate: parseInt(e.target.value)
                      }))}
                      className="w-full accent-pink-500"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm text-pink-600">Move Left/Right</label>
                    <input
                      type="range"
                      min="-100"
                      max="100"
                      step="1"
                      value={imageTransform.translateX}
                      onChange={(e) => setImageTransform(prev => ({
                        ...prev,
                        translateX: parseInt(e.target.value)
                      }))}
                      className="w-full accent-pink-500"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm text-pink-600">Move Up/Down</label>
                    <input
                      type="range"
                      min="-100"
                      max="100"
                      step="1"
                      value={imageTransform.translateY}
                      onChange={(e) => setImageTransform(prev => ({
                        ...prev,
                        translateY: parseInt(e.target.value)
                      }))}
                      className="w-full accent-pink-500"
                    />
                  </div>
                </div>
                <div className="flex justify-end">
                  <button
                    onClick={() => setImageTransform({
                      scale: 1,
                      rotate: 0,
                      translateX: 0,
                      translateY: 0
                    })}
                    className="text-sm text-pink-600 hover:text-pink-800"
                  >
                    Reset Adjustments
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Makeup Options Section */}
          <div className="bg-white/50 p-6 rounded-xl shadow-sm backdrop-blur-sm">
            <h2 className="text-2xl text-pink-700 mb-6 font-light">Makeup Options</h2>
            
            <div className="space-y-4">
              <div 
                className="flex items-center gap-4 p-3 hover:bg-pink-100 rounded-lg transition-colors cursor-pointer"
                onClick={() => setShowLipstickOptions(!showLipstickOptions)}
              >
                <span className="text-2xl">💋</span>
                <div>
                  <h3 className="text-pink-800">Lipstick</h3>
                  <p className="text-sm text-pink-600">Try different shades and finishes</p>
                </div>
              </div>
              
              {showLipstickOptions && (
                <div className="pl-12 space-y-3">
                  <div className="grid grid-cols-3 gap-3">
                    {lipstickColors.map((color) => (
                      <button
                        key={color.hex}
                        className={`p-2 rounded-lg border-2 transition-all ${
                          selectedLipstickColor === color.hex
                            ? 'border-pink-500 scale-105'
                            : 'border-gray-200 hover:border-pink-300'
                        }`}
                        onClick={() => setSelectedLipstickColor(color.hex)}
                      >
                        <div
                          className="w-full h-8 rounded-md"
                          style={{ backgroundColor: color.hex }}
                        />
                        <p className="text-xs text-center mt-1 text-gray-600">{color.name}</p>
                      </button>
                    ))}
                  </div>
                  {selectedLipstickColor && (
                    <button
                      onClick={() => setSelectedLipstickColor(null)}
                      className="text-sm text-pink-600 hover:text-pink-800"
                    >
                      Remove lipstick
                    </button>
                  )}
                </div>
              )}
              
              <div 
                className="flex items-center gap-4 p-3 hover:bg-pink-100 rounded-lg transition-colors cursor-pointer"
                onClick={() => setShowEyeshadowOptions(!showEyeshadowOptions)}
              >
                <span className="text-2xl">👁️</span>
                <div>
                  <h3 className="text-pink-800">Eyeshadow</h3>
                  <p className="text-sm text-pink-600">Experiment with various colors and styles</p>
                </div>
              </div>

              {showEyeshadowOptions && (
                <div className="pl-12 space-y-3">
                  <div className="grid grid-cols-3 gap-3">
                    {eyeshadowColors.map((color) => (
                      <button
                        key={color.hex}
                        className={`p-2 rounded-lg border-2 transition-all ${
                          selectedEyeshadowColor === color.hex
                            ? 'border-pink-500 scale-105'
                            : 'border-gray-200 hover:border-pink-300'
                        }`}
                        onClick={() => setSelectedEyeshadowColor(color.hex)}
                      >
                        <div
                          className="w-full h-8 rounded-md"
                          style={{ backgroundColor: color.hex }}
                        />
                        <p className="text-xs text-center mt-1 text-gray-600">{color.name}</p>
                      </button>
                    ))}
                  </div>
                  {selectedEyeshadowColor && (
                    <button
                      onClick={() => setSelectedEyeshadowColor(null)}
                      className="text-sm text-pink-600 hover:text-pink-800"
                    >
                      Remove eyeshadow
                    </button>
                  )}
                </div>
              )}
              
              <div 
                className="flex items-center gap-4 p-3 hover:bg-pink-100 rounded-lg transition-colors cursor-pointer"
                onClick={() => setShowHighlighterOptions(!showHighlighterOptions)}
              >
                <span className="text-2xl">✨</span>
                <div>
                  <h3 className="text-pink-800">Highlighter</h3>
                  <p className="text-sm text-pink-600">Add a beautiful glow to your features</p>
                </div>
              </div>

              {showHighlighterOptions && (
                <div className="pl-12 space-y-3">
                  <div className="grid grid-cols-3 gap-3">
                    {highlighterColors.map((color) => (
                      <button
                        key={color.hex}
                        className={`p-2 rounded-lg border-2 transition-all ${
                          selectedHighlighterColor === color.hex
                            ? 'border-pink-500 scale-105'
                            : 'border-gray-200 hover:border-pink-300'
                        }`}
                        onClick={() => setSelectedHighlighterColor(color.hex)}
                      >
                        <div
                          className="w-full h-8 rounded-md"
                          style={{ backgroundColor: color.hex }}
                        />
                        <p className="text-xs text-center mt-1 text-gray-600">{color.name}</p>
                      </button>
                    ))}
                  </div>
                  {selectedHighlighterColor && (
                    <button
                      onClick={() => setSelectedHighlighterColor(null)}
                      className="text-sm text-pink-600 hover:text-pink-800"
                    >
                      Remove highlighter
                    </button>
                  )}
                </div>
              )}
            </div>

            <div className="mt-6 flex gap-4">
              <button className="bg-pink-200 hover:bg-pink-300 text-pink-800 px-6 py-2 rounded-full transition-all duration-300 shadow-sm hover:shadow-md flex-1">
                Save Look
              </button>
              <button className="bg-white hover:bg-pink-100 text-pink-800 px-6 py-2 rounded-full transition-all duration-300 shadow-sm hover:shadow-md border border-pink-200 flex-1">
                Share
              </button>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
} 