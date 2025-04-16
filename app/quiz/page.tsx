'use client'
import Image from "next/image";
import { useRouter } from "next/navigation";

export default function QuizPage() {
  const router = useRouter();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // For now, we'll just navigate to the results page
    // In a real app, we would process the form data here
    router.push('/quiz/results');
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-pink-300 via-pink-200 to-pink-50">
      <main className="container mx-auto px-4 py-16">
        <div className="text-center">
          <h1 className="text-5xl font-serif text-white mb-6 font-light tracking-wide">
            Personalized Quiz
          </h1>
          <p className="text-xl text-pink-600 mb-12 font-light">
            Find your perfect beauty match
          </p>
          
          <form onSubmit={handleSubmit} className="max-w-2xl mx-auto bg-white/50 p-8 rounded-xl shadow-sm backdrop-blur-sm">
            <div className="space-y-6">
              <div className="text-left">
                <h3 className="text-pink-700 text-lg mb-2">What's your skin type?</h3>
                <div className="space-y-2">
                  <label className="flex items-center space-x-2">
                    <input type="radio" name="skin-type" value="dry" className="text-pink-600" required />
                    <span className="text-pink-600">Dry</span>
                  </label>
                  <label className="flex items-center space-x-2">
                    <input type="radio" name="skin-type" value="oily" className="text-pink-600" />
                    <span className="text-pink-600">Oily</span>
                  </label>
                  <label className="flex items-center space-x-2">
                    <input type="radio" name="skin-type" value="combination" className="text-pink-600" />
                    <span className="text-pink-600">Combination</span>
                  </label>
                  <label className="flex items-center space-x-2">
                    <input type="radio" name="skin-type" value="normal" className="text-pink-600" />
                    <span className="text-pink-600">Normal</span>
                  </label>
                </div>
              </div>

              <div className="text-left">
                <h3 className="text-pink-700 text-lg mb-2">What's your preferred makeup style?</h3>
                <div className="space-y-2">
                  <label className="flex items-center space-x-2">
                    <input type="radio" name="style" value="natural" className="text-pink-600" required />
                    <span className="text-pink-600">Natural</span>
                  </label>
                  <label className="flex items-center space-x-2">
                    <input type="radio" name="style" value="glam" className="text-pink-600" />
                    <span className="text-pink-600">Glam</span>
                  </label>
                  <label className="flex items-center space-x-2">
                    <input type="radio" name="style" value="bold" className="text-pink-600" />
                    <span className="text-pink-600">Bold</span>
                  </label>
                  <label className="flex items-center space-x-2">
                    <input type="radio" name="style" value="minimal" className="text-pink-600" />
                    <span className="text-pink-600">Minimal</span>
                  </label>
                </div>
              </div>

              <div className="text-left">
                <h3 className="text-pink-700 text-lg mb-2">What's your skin tone?</h3>
                <div className="space-y-2">
                  <label className="flex items-center space-x-2">
                    <input type="radio" name="tone" value="fair" className="text-pink-600" required />
                    <span className="text-pink-600">Fair</span>
                  </label>
                  <label className="flex items-center space-x-2">
                    <input type="radio" name="tone" value="medium" className="text-pink-600" />
                    <span className="text-pink-600">Medium</span>
                  </label>
                  <label className="flex items-center space-x-2">
                    <input type="radio" name="tone" value="tan" className="text-pink-600" />
                    <span className="text-pink-600">Tan</span>
                  </label>
                  <label className="flex items-center space-x-2">
                    <input type="radio" name="tone" value="deep" className="text-pink-600" />
                    <span className="text-pink-600">Deep</span>
                  </label>
                </div>
              </div>

              <button 
                type="submit"
                className="bg-pink-200 hover:bg-pink-300 text-pink-800 px-8 py-3 rounded-full transition-all duration-300 shadow-sm hover:shadow-md w-full"
              >
                Get Your Results
              </button>
            </div>
          </form>
        </div>
      </main>
    </div>
  );
} 