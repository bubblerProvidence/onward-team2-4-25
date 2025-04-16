import Image from "next/image";

export default function QuizResults() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-pink-300 via-pink-200 to-pink-50">
      <main className="container mx-auto px-4 py-16">
        <div className="text-center">
          <h1 className="text-5xl font-serif text-white mb-6 font-light tracking-wide">
            Your Beauty Profile
          </h1>
          <p className="text-xl text-pink-600 mb-12 font-light">
            Personalized recommendations just for you
          </p>
          
          <div className="max-w-4xl mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {/* Skincare Recommendations */}
              <div className="bg-white/50 p-8 rounded-xl shadow-sm backdrop-blur-sm">
                <h2 className="text-2xl font-serif text-pink-700 mb-4">Skincare Routine</h2>
                <div className="space-y-4 text-left">
                  <div>
                    <h3 className="text-pink-600 font-medium">Morning Routine</h3>
                    <ul className="list-disc list-inside text-pink-600 space-y-1 ml-4">
                      <li>Gentle cleanser</li>
                      <li>Vitamin C serum</li>
                      <li>Hydrating moisturizer</li>
                      <li>SPF 30+ sunscreen</li>
                    </ul>
                  </div>
                  <div>
                    <h3 className="text-pink-600 font-medium">Evening Routine</h3>
                    <ul className="list-disc list-inside text-pink-600 space-y-1 ml-4">
                      <li>Double cleanse</li>
                      <li>Retinol treatment</li>
                      <li>Night cream</li>
                    </ul>
                  </div>
                </div>
              </div>

              {/* Makeup Recommendations */}
              <div className="bg-white/50 p-8 rounded-xl shadow-sm backdrop-blur-sm">
                <h2 className="text-2xl font-serif text-pink-700 mb-4">Makeup Essentials</h2>
                <div className="space-y-4 text-left">
                  <div>
                    <h3 className="text-pink-600 font-medium">Base Products</h3>
                    <ul className="list-disc list-inside text-pink-600 space-y-1 ml-4">
                      <li>Lightweight foundation</li>
                      <li>Concealer for brightening</li>
                      <li>Setting powder</li>
                    </ul>
                  </div>
                  <div>
                    <h3 className="text-pink-600 font-medium">Color Products</h3>
                    <ul className="list-disc list-inside text-pink-600 space-y-1 ml-4">
                      <li>Natural blush palette</li>
                      <li>Neutral eyeshadow set</li>
                      <li>Mascara</li>
                    </ul>
                  </div>
                </div>
              </div>

              {/* Product Recommendations */}
              <div className="bg-white/50 p-8 rounded-xl shadow-sm backdrop-blur-sm">
                <h2 className="text-2xl font-serif text-pink-700 mb-4">Recommended Products</h2>
                <div className="space-y-4 text-left">
                  <div>
                    <h3 className="text-pink-600 font-medium">Skincare</h3>
                    <ul className="list-disc list-inside text-pink-600 space-y-1 ml-4">
                      <li>Hydrating Cleanser by CeraVe</li>
                      <li>Vitamin C Serum by The Ordinary</li>
                      <li>SPF 50 Sunscreen by La Roche-Posay</li>
                    </ul>
                  </div>
                </div>
              </div>

              {/* Tips & Tricks */}
              <div className="bg-white/50 p-8 rounded-xl shadow-sm backdrop-blur-sm">
                <h2 className="text-2xl font-serif text-pink-700 mb-4">Beauty Tips</h2>
                <div className="space-y-4 text-left">
                  <div>
                    <h3 className="text-pink-600 font-medium">Application Tips</h3>
                    <ul className="list-disc list-inside text-pink-600 space-y-1 ml-4">
                      <li>Apply foundation with a damp beauty sponge</li>
                      <li>Use setting spray to lock in makeup</li>
                      <li>Blend eyeshadow with a clean brush</li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-12 flex justify-center gap-6">
              <a
                href="/try-on"
                className="bg-pink-200 hover:bg-pink-300 text-pink-800 px-8 py-3 rounded-full transition-all duration-300 shadow-sm hover:shadow-md"
              >
                Try On Makeup
              </a>
              <a
                href="/tutorials"
                className="bg-pink-200 hover:bg-pink-300 text-pink-800 px-8 py-3 rounded-full transition-all duration-300 shadow-sm hover:shadow-md"
              >
                View Tutorials
              </a>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
} 