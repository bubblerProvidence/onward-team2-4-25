import Image from "next/image";

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-pink-300 via-pink-200 to-pink-50">
      <main className="container mx-auto px-4 py-16">
        <div className="text-center">
          <h1 className="text-5xl font-serif text-white mb-6 font-light tracking-wide">
            Virtual Vanity
          </h1>
          <p className="text-xl text-pink-600 mb-12 font-light">
            Your digital beauty companion
          </p>
          
          <div className="flex flex-col sm:flex-row gap-6 justify-center items-center">
            <a
              href="/try-on"
              className="bg-pink-200 hover:bg-pink-300 text-pink-800 px-8 py-3 rounded-full transition-all duration-300 shadow-sm hover:shadow-md flex items-center gap-2"
            >
              <span className="text-lg">🎀</span>
              Try On Makeup
            </a>
            <a
              href="/tutorials"
              className="bg-pink-200 hover:bg-pink-300 text-pink-800 px-8 py-3 rounded-full transition-all duration-300 shadow-sm hover:shadow-md flex items-center gap-2"
            >
              <span className="text-lg">🎀</span>
              View Tutorials
            </a>
            <a
              href="/quiz"
              className="bg-pink-200 hover:bg-pink-300 text-pink-800 px-8 py-3 rounded-full transition-all duration-300 shadow-sm hover:shadow-md flex items-center gap-2"
            >
              <span className="text-lg">🎀</span>
              Personalized Quiz
            </a>
          </div>

          <div className="mt-16 grid grid-cols-1 sm:grid-cols-3 gap-8 max-w-4xl mx-auto">
            <div className="bg-white/50 p-6 rounded-xl shadow-sm backdrop-blur-sm">
              <h3 className="text-pink-700 text-lg mb-2">Virtual Try-On</h3>
              <p className="text-pink-600">Experiment with different makeup looks in real-time</p>
            </div>
            <div className="bg-white/50 p-6 rounded-xl shadow-sm backdrop-blur-sm">
              <h3 className="text-pink-700 text-lg mb-2">Beauty Tutorials</h3>
              <p className="text-pink-600">Learn from expert makeup artists</p>
            </div>
            <div className="bg-white/50 p-6 rounded-xl shadow-sm backdrop-blur-sm">
              <h3 className="text-pink-700 text-lg mb-2">Personalized Tips</h3>
              <p className="text-pink-600">Get customized beauty recommendations</p>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
