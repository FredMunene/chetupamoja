import Image from "next/image";
import Link from "next/link";

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-amber-50 dark:from-gray-900 dark:via-gray-800 dark:to-blue-900">
      {/* Navigation */}
      <nav className="relative z-10 px-6 py-4">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-sm">CP</span>
            </div>
            <span className="text-xl font-bold text-gray-800 dark:text-white">ChetuPamoja</span>
          </div>
          <Link href="/donate">
            <button className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-full font-medium transition-all duration-200 hover:shadow-lg hover:scale-105">
              Donate
            </button>
          </Link>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative overflow-hidden py-20 px-6">
        <div className="absolute inset-0 gradient-hero opacity-10"></div>
        <div className="relative max-w-7xl mx-auto text-center animate-fade-in-up">
          <h1 className="text-5xl md:text-7xl font-bold mb-6 bg-gradient-to-r from-blue-600 to-cyan-600 bg-clip-text text-transparent">
            Tech Challenge
            <br />
            <span className="text-gray-800 dark:text-white">Feeding Program</span>
          </h1>
          <p className="text-xl md:text-2xl text-gray-600 dark:text-gray-300 mb-8 max-w-3xl mx-auto leading-relaxed">
            Help us fuel young minds with nutritious snacks and smiles during our upcoming tech challenge! 
            Every donation makes a difference in inspiring the next generation of innovators.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Link href="/donate">
              <button className="px-8 py-4 bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 text-white font-semibold text-lg rounded-full shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 hover-lift">
                Donate Now
              </button>
            </Link>
            <button className="px-8 py-4 border-2 border-blue-600 text-blue-600 hover:bg-blue-600 hover:text-white font-semibold text-lg rounded-full transition-all duration-300 hover:scale-105 hover-lift">
              Learn More
            </button>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 px-6 bg-white dark:bg-gray-800">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center p-6 rounded-2xl bg-gradient-to-br from-blue-50 to-cyan-50 dark:from-blue-900/20 dark:to-cyan-900/20 hover-lift">
              <div className="text-4xl font-bold text-blue-600 mb-2">100+</div>
              <div className="text-gray-600 dark:text-gray-300">Students Fed</div>
            </div>
            <div className="text-center p-6 rounded-2xl bg-gradient-to-br from-amber-50 to-orange-50 dark:from-amber-900/20 dark:to-orange-900/20 hover-lift">
              <div className="text-4xl font-bold text-amber-600 mb-2">500+</div>
              <div className="text-gray-600 dark:text-gray-300">Snacks Provided</div>
            </div>
            <div className="text-center p-6 rounded-2xl bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 hover-lift">
              <div className="text-4xl font-bold text-green-600 mb-2">50+</div>
              <div className="text-gray-600 dark:text-gray-300">Volunteers</div>
            </div>
          </div>
        </div>
      </section>

      {/* Info Card Section */}
      <section className="py-20 px-6 bg-gray-50 dark:bg-gray-900">
        <div className="max-w-4xl mx-auto">
          <div className="bg-white dark:bg-gray-800 rounded-3xl shadow-2xl border border-gray-100 dark:border-gray-700 p-8 md:p-12 hover-lift">
            <h2 className="text-3xl md:text-4xl font-bold mb-6 text-center bg-gradient-to-r from-blue-600 to-cyan-600 bg-clip-text text-transparent">
              Why Your Donation Matters
            </h2>
            <p className="text-lg text-gray-600 dark:text-gray-300 mb-8 text-center leading-relaxed">
              Every shilling you give will go directly to providing healthy snacks and refreshments for kids participating in our tech challenge. 
              Your support keeps their energy high, their minds sharp, and their hearts inspired to learn and create!
            </p>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
              <div className="flex items-center space-x-4 p-4 rounded-xl bg-blue-50 dark:bg-blue-900/20 hover-lift">
                <div className="text-3xl">🍎</div>
                <div>
                  <h3 className="font-semibold text-blue-800 dark:text-blue-200">Nutritious Snacks</h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Healthy food for growing minds</p>
                </div>
              </div>
              <div className="flex items-center space-x-4 p-4 rounded-xl bg-amber-50 dark:bg-amber-900/20 hover-lift">
                <div className="text-3xl">🤝</div>
                <div>
                  <h3 className="font-semibold text-amber-800 dark:text-amber-200">Teamwork & Creativity</h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Building collaborative skills</p>
                </div>
              </div>
              <div className="flex items-center space-x-4 p-4 rounded-xl bg-green-50 dark:bg-green-900/20 hover-lift">
                <div className="text-3xl">💡</div>
                <div>
                  <h3 className="font-semibold text-green-800 dark:text-green-200">Fuels Innovation</h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Inspiring creative thinking</p>
                </div>
              </div>
              <div className="flex items-center space-x-4 p-4 rounded-xl bg-purple-50 dark:bg-purple-900/20 hover-lift">
                <div className="text-3xl">🌟</div>
                <div>
                  <h3 className="font-semibold text-purple-800 dark:text-purple-200">Memorable Experience</h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Creating lasting memories</p>
                </div>
              </div>
            </div>
            
            <div className="text-center">
              <p className="text-lg text-gray-700 dark:text-gray-200 font-semibold mb-6">
                Your donation will put a smile on a child's face and help spark the next generation of tech innovators. 
                Thank you for making a difference!
              </p>
              <Link href="/donate">
                <button className="px-8 py-4 bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 text-white font-semibold text-lg rounded-full shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105">
                  Make a Donation
                </button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-20 px-6 bg-white dark:bg-gray-800">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-12 bg-gradient-to-r from-blue-600 to-cyan-600 bg-clip-text text-transparent">
            What People Say
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <div className="bg-gray-50 dark:bg-gray-700 p-6 rounded-2xl hover-lift">
              <div className="flex items-center mb-4">
                <div className="w-12 h-12 bg-blue-500 rounded-full flex items-center justify-center text-white font-bold">S</div>
                <div className="ml-4">
                  <h4 className="font-semibold">Sarah M.</h4>
                  <p className="text-sm text-gray-500">Parent</p>
                </div>
              </div>
              <p className="text-gray-600 dark:text-gray-300">"The feeding program made such a difference for my daughter. She was energized and focused throughout the entire challenge!"</p>
            </div>
            <div className="bg-gray-50 dark:bg-gray-700 p-6 rounded-2xl hover-lift">
              <div className="flex items-center mb-4">
                <div className="w-12 h-12 bg-green-500 rounded-full flex items-center justify-center text-white font-bold">M</div>
                <div className="ml-4">
                  <h4 className="font-semibold">Michael K.</h4>
                  <p className="text-sm text-gray-500">Volunteer</p>
                </div>
              </div>
              <p className="text-gray-600 dark:text-gray-300">"Seeing the kids' faces light up when they received their snacks was priceless. This program truly makes a difference."</p>
            </div>
            <div className="bg-gray-50 dark:bg-gray-700 p-6 rounded-2xl hover-lift">
              <div className="flex items-center mb-4">
                <div className="w-12 h-12 bg-purple-500 rounded-full flex items-center justify-center text-white font-bold">A</div>
                <div className="ml-4">
                  <h4 className="font-semibold">Amina O.</h4>
                  <p className="text-sm text-gray-500">Student</p>
                </div>
              </div>
              <p className="text-gray-600 dark:text-gray-300">"The snacks kept me going during the long coding sessions. I'm so grateful for everyone who donated!"</p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
            <div>
              <div className="flex items-center space-x-2 mb-4">
                <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-lg flex items-center justify-center">
                  <span className="text-white font-bold text-sm">CP</span>
                </div>
                <span className="text-xl font-bold">ChetuPamoja</span>
              </div>
              <p className="text-gray-400">Empowering the next generation of tech innovators through community support and nourishment.</p>
            </div>
            <div>
              <h3 className="font-semibold mb-4">Quick Links</h3>
              <ul className="space-y-2 text-gray-400">
                <li><Link href="/donate" className="hover:text-white transition-colors">Donate</Link></li>
                <li><a href="#" className="hover:text-white transition-colors">About Us</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Contact</a></li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold mb-4">Contact Info</h3>
              <ul className="space-y-2 text-gray-400">
                <li>📧 info@chetupamoja.org</li>
                <li>📱 +254 700 000 000</li>
                <li>📍 Nairobi, Kenya</li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-800 pt-8 text-center text-gray-400">
            <p>&copy; {new Date().getFullYear()} Tech Challenge Feeding Program. Powered by ChetuPamoja. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
