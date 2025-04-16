"use client";
import Image from "next/image";
import { useState, useRef, useEffect } from "react";

export default function TryOn() {
  const [isCameraActive, setIsCameraActive] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isClient, setIsClient] = useState(false);
  const [availableCameras, setAvailableCameras] = useState<MediaDeviceInfo[]>([]);
  const [permissionStatus, setPermissionStatus] = useState<'prompt' | 'granted' | 'denied'>('prompt');
  const videoRef = useRef<HTMLVideoElement>(null);
  const previewRef = useRef<HTMLVideoElement>(null);
  const streamRef = useRef<MediaStream | null>(null);

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

  useEffect(() => {
    return () => {
      stopCamera();
    };
  }, []);

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
              {!isCameraActive ? (
                <div className="w-full h-full flex items-center justify-center">
                  <span className="text-6xl">📸</span>
                </div>
              ) : (
                <video
                  ref={videoRef}
                  autoPlay
                  playsInline
                  className="w-full h-full object-cover"
                  style={{ transform: 'scaleX(-1)' }} // Mirror the video
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
              <button className="bg-white hover:bg-pink-100 text-pink-800 px-6 py-2 rounded-full transition-all duration-300 shadow-sm hover:shadow-md border border-pink-200">
                Upload Photo
              </button>
            </div>
          </div>

          {/* Makeup Options Section */}
          <div className="bg-white/50 p-6 rounded-xl shadow-sm backdrop-blur-sm">
            <h2 className="text-2xl text-pink-700 mb-6 font-light">Makeup Options</h2>
            
            <div className="space-y-4">
              <div className="flex items-center gap-4 p-3 hover:bg-pink-100 rounded-lg transition-colors">
                <span className="text-2xl">💋</span>
                <div>
                  <h3 className="text-pink-800">Lipstick</h3>
                  <p className="text-sm text-pink-600">Try different shades and finishes</p>
                </div>
              </div>
              
              <div className="flex items-center gap-4 p-3 hover:bg-pink-100 rounded-lg transition-colors">
                <span className="text-2xl">👁️</span>
                <div>
                  <h3 className="text-pink-800">Eyeshadow</h3>
                  <p className="text-sm text-pink-600">Experiment with various colors and styles</p>
                </div>
              </div>
              
              <div className="flex items-center gap-4 p-3 hover:bg-pink-100 rounded-lg transition-colors">
                <span className="text-2xl">✨</span>
                <div>
                  <h3 className="text-pink-800">Highlighter</h3>
                  <p className="text-sm text-pink-600">Add a beautiful glow to your features</p>
                </div>
              </div>
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