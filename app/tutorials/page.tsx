'use client';

import { useState } from "react";
import VideoModal from "../components/VideoModal";

export default function Tutorials() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentVideoId, setCurrentVideoId] = useState("");

  const openVideo = (videoId: string) => {
    setCurrentVideoId(videoId);
    setIsModalOpen(true);
  };

  return (
    <div className="min-h-screen bg-pink-50">
      <main className="container mx-auto px-4 py-16">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-serif text-pink-800 mb-4 font-light tracking-wide">
            Beauty Tutorials
          </h1>
          <p className="text-xl text-pink-600 font-light">
            Learn from expert makeup artists
          </p>
        </div>

        {/* Categories */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-12 max-w-4xl mx-auto">
          <button className="bg-white/50 hover:bg-pink-100 p-4 rounded-xl shadow-sm backdrop-blur-sm transition-all duration-300">
            <span className="text-3xl block mb-2">💄</span>
            <span className="text-pink-800">Everyday</span>
          </button>
          <button className="bg-white/50 hover:bg-pink-100 p-4 rounded-xl shadow-sm backdrop-blur-sm transition-all duration-300">
            <span className="text-3xl block mb-2">✨</span>
            <span className="text-pink-800">Glam</span>
          </button>
          <button className="bg-white/50 hover:bg-pink-100 p-4 rounded-xl shadow-sm backdrop-blur-sm transition-all duration-300">
            <span className="text-3xl block mb-2">🎭</span>
            <span className="text-pink-800">Special</span>
          </button>
          <button className="bg-white/50 hover:bg-pink-100 p-4 rounded-xl shadow-sm backdrop-blur-sm transition-all duration-300">
            <span className="text-3xl block mb-2">🎨</span>
            <span className="text-pink-800">Creative</span>
          </button>
        </div>

        {/* Tutorial Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {/* Tutorial Card 1 - Natural Everyday Look */}
          <div className="bg-white/50 rounded-xl shadow-sm backdrop-blur-sm overflow-hidden">
            <div className="aspect-video bg-pink-100 flex items-center justify-center">
              <span className="text-6xl">🎀</span>
            </div>
            <div className="p-6">
              <div className="flex items-center gap-2 mb-2">
                <span className="text-pink-800 font-medium">17 min</span>
                <span className="text-pink-600">•</span>
                <span className="text-pink-600">Beginner</span>
              </div>
              <h3 className="text-xl text-pink-800 mb-2">Natural Everyday Look</h3>
              <p className="text-pink-600 mb-4">Perfect your daily makeup routine with these simple steps</p>
              <button 
                onClick={() => openVideo("PfUZ92NQK84")}
                className="w-full bg-pink-200 hover:bg-pink-300 text-pink-800 px-4 py-2 rounded-full transition-all duration-300 shadow-sm hover:shadow-md"
              >
                Watch Tutorial
              </button>
            </div>
          </div>

          {/* Tutorial Card 2 - Evening Glam */}
          <div className="bg-white/50 rounded-xl shadow-sm backdrop-blur-sm overflow-hidden">
            <div className="aspect-video bg-pink-100 flex items-center justify-center">
              <span className="text-6xl">🎀</span>
            </div>
            <div className="p-6">
              <div className="flex items-center gap-2 mb-2">
                <span className="text-pink-800 font-medium">15 min</span>
                <span className="text-pink-600">•</span>
                <span className="text-pink-600">Intermediate</span>
              </div>
              <h3 className="text-xl text-pink-800 mb-2">Evening Glam</h3>
              <p className="text-pink-600 mb-4">Create a stunning evening look with these pro tips</p>
              <button 
                onClick={() => openVideo("r1VMQ8KY5Io")}
                className="w-full bg-pink-200 hover:bg-pink-300 text-pink-800 px-4 py-2 rounded-full transition-all duration-300 shadow-sm hover:shadow-md"
              >
                Watch Tutorial
              </button>
            </div>
          </div>

          {/* Tutorial Card 3 - Creative Color Play */}
          <div className="bg-white/50 rounded-xl shadow-sm backdrop-blur-sm overflow-hidden">
            <div className="aspect-video bg-pink-100 flex items-center justify-center">
              <span className="text-6xl">🎀</span>
            </div>
            <div className="p-6">
              <div className="flex items-center gap-2 mb-2">
                <span className="text-pink-800 font-medium">10 min</span>
                <span className="text-pink-600">•</span>
                <span className="text-pink-600">Advanced</span>
              </div>
              <h3 className="text-xl text-pink-800 mb-2">Creative Color Play</h3>
              <p className="text-pink-600 mb-4">Experiment with bold colors and unique techniques</p>
              <button 
                onClick={() => openVideo("YKpL9P5SM0E")}
                className="w-full bg-pink-200 hover:bg-pink-300 text-pink-800 px-4 py-2 rounded-full transition-all duration-300 shadow-sm hover:shadow-md"
              >
                Watch Tutorial
              </button>
            </div>
          </div>
        </div>
      </main>

      <VideoModal 
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        videoId={currentVideoId}
      />
    </div>
  );
} 