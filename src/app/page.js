import Image from "next/image";
import Link from "next/link";

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-indigo-900 overflow-hidden">
      {/* Animated background elements */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-br from-purple-400/20 to-pink-400/20 rounded-full blur-3xl animate-float"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-gradient-to-br from-blue-400/20 to-cyan-400/20 rounded-full blur-3xl animate-float" style={{animationDelay: '1s'}}></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-gradient-to-br from-indigo-400/10 to-purple-400/10 rounded-full blur-3xl animate-pulse-slow"></div>
      </div>

      {/* Navigation */}
      <nav className="relative z-10 px-6 py-6">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <div className="flex items-center space-x-3 animate-fade-in-left">
            <div className="w-10 h-10 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-xl flex items-center justify-center shadow-lg hover-glow">
              <span className="text-white font-bold text-lg">CP</span>
            </div>
            <span className="text-2xl font-bold gradient-text">ChetuPamoja</span>
          </div>
          <Link href="/donate">
            <button className="px-8 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white rounded-full font-semibold transition-all duration-300 hover:scale-105 hover-glow shadow-lg btn-primary">
              Donate Now
            </button>
          </Link>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative py-24 px-6">
        <div className="max-w-7xl mx-auto text-center">
          <div className="animate-fade-in-up">
            <h1 className="text-6xl md:text-8xl font-bold mb-8 gradient-text text-responsive">
              Tech Challenge
              <br />
              <span className="text-gray-800 dark:text-white">Feeding Program</span>
            </h1>
            <p className="text-xl md:text-2xl text-gray-600 dark:text-gray-300 mb-12 max-w-4xl mx-auto leading-relaxed text-shadow">
              Help us fuel young minds with nutritious snacks and smiles during our upcoming tech challenge! 
              Every donation makes a difference in inspiring the next generation of innovators.
            </p>
            <div className="flex flex-col sm:flex-row gap-6 justify-center items-center">
              <Link href="/donate">
                <button className="px-10 py-5 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white font-bold text-xl rounded-full shadow-2xl hover:shadow-indigo-500/25 transition-all duration-300 hover:scale-110 btn-primary">
                  Donate Now
                </button>
              </Link>
              <button className="px-10 py-5 border-3 border-indigo-600 text-indigo-600 hover:bg-indigo-600 hover:text-white font-bold text-xl rounded-full transition-all duration-300 hover:scale-110 hover-glow">
                Learn More
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-20 px-6 relative">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center p-8 rounded-3xl glass hover-lift card-glow animate-fade-in-left" style={{animationDelay: '0.2s'}}>
              <div className="text-5xl font-bold gradient-text mb-3">100+</div>
              <div className="text-gray-600 dark:text-gray-300 text-lg font-semibold">Students Fed</div>
            </div>
            <div className="text-center p-8 rounded-3xl glass hover-lift card-glow animate-fade-in-up" style={{animationDelay: '0.4s'}}>
              <div className="text-5xl font-bold gradient-text mb-3">500+</div>
              <div className="text-gray-600 dark:text-gray-300 text-lg font-semibold">Snacks Provided</div>
            </div>
            <div className="text-center p-8 rounded-3xl glass hover-lift card-glow animate-fade-in-right" style={{animationDelay: '0.6s'}}>
              <div className="text-5xl font-bold gradient-text mb-3">50+</div>
              <div className="text-gray-600 dark:text-gray-300 text-lg font-semibold">Volunteers</div>
            </div>
          </div>
        </div>
      </section>

      {/* Info Card Section */}
      <section className="py-24 px-6 bg-gradient-to-br from-gray-50 to-indigo-50 dark:from-gray-800 dark:to-indigo-900/20">
        <div className="max-w-6xl mx-auto">
          <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-lg rounded-3xl shadow-2xl border border-white/20 dark:border-gray-700/50 p-10 md:p-16 hover-lift card-glow">
            <h2 className="text-4xl md:text-5xl font-bold mb-8 text-center gradient-text">
              Why Your Donation Matters
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-300 mb-12 text-center leading-relaxed max-w-4xl mx-auto">
              Every shilling you give will go directly to providing healthy snacks and refreshments for kids participating in our tech challenge. 
              Your support keeps their energy high, their minds sharp, and their hearts inspired to learn and create!
            </p>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
              <div className="flex items-center space-x-6 p-6 rounded-2xl bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 hover-lift hover-glow">
                <div className="text-4xl animate-pulse-slow">🍎</div>
                <div>
                  <h3 className="font-bold text-blue-800 dark:text-blue-200 text-xl mb-2">Nutritious Snacks</h3>
                  <p className="text-gray-600 dark:text-gray-400">Healthy food for growing minds</p>
                </div>
              </div>
              <div className="flex items-center space-x-6 p-6 rounded-2xl bg-gradient-to-br from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20 hover-lift hover-glow">
                <div className="text-4xl animate-pulse-slow" style={{animationDelay: '0.5s'}}>🤝</div>
                <div>
                  <h3 className="font-bold text-purple-800 dark:text-purple-200 text-xl mb-2">Teamwork & Creativity</h3>
                  <p className="text-gray-600 dark:text-gray-400">Building collaborative skills</p>
                </div>
              </div>
              <div className="flex items-center space-x-6 p-6 rounded-2xl bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 hover-lift hover-glow">
                <div className="text-4xl animate-pulse-slow" style={{animationDelay: '1s'}}>💡</div>
                <div>
                  <h3 className="font-bold text-green-800 dark:text-green-200 text-xl mb-2">Fuels Innovation</h3>
                  <p className="text-gray-600 dark:text-gray-400">Inspiring creative thinking</p>
                </div>
              </div>
              <div className="flex items-center space-x-6 p-6 rounded-2xl bg-gradient-to-br from-amber-50 to-orange-50 dark:from-amber-900/20 dark:to-orange-900/20 hover-lift hover-glow">
                <div className="text-4xl animate-pulse-slow" style={{animationDelay: '1.5s'}}>🌟</div>
                <div>
                  <h3 className="font-bold text-amber-800 dark:text-amber-200 text-xl mb-2">Memorable Experience</h3>
                  <p className="text-gray-600 dark:text-gray-400">Creating lasting memories</p>
                </div>
              </div>
            </div>
            
            <div className="text-center">
              <p className="text-xl text-gray-700 dark:text-gray-200 font-semibold mb-8 max-w-3xl mx-auto">
                Your donation will put a smile on a child's face and help spark the next generation of tech innovators. 
                Thank you for making a difference!
              </p>
              <Link href="/donate">
                <button className="px-12 py-6 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white font-bold text-xl rounded-full shadow-2xl hover:shadow-indigo-500/25 transition-all duration-300 hover:scale-110 btn-primary">
                  Make a Donation
                </button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-24 px-6 bg-white dark:bg-gray-800">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-4xl md:text-5xl font-bold text-center mb-16 gradient-text">
            What People Say
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <div className="bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 p-8 rounded-3xl hover-lift card-glow animate-fade-in-left" style={{animationDelay: '0.2s'}}>
              <div className="flex items-center mb-6">
                <div className="w-14 h-14 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-full flex items-center justify-center text-white font-bold text-xl shadow-lg">S</div>
                <div className="ml-4">
                  <h4 className="font-bold text-lg">Sarah M.</h4>
                  <p className="text-gray-500 font-medium">Parent</p>
                </div>
              </div>
              <p className="text-gray-600 dark:text-gray-300 text-lg leading-relaxed">"The feeding program made such a difference for my daughter. She was energized and focused throughout the entire challenge!"</p>
            </div>
            <div className="bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 p-8 rounded-3xl hover-lift card-glow animate-fade-in-up" style={{animationDelay: '0.4s'}}>
              <div className="flex items-center mb-6">
                <div className="w-14 h-14 bg-gradient-to-r from-green-500 to-emerald-600 rounded-full flex items-center justify-center text-white font-bold text-xl shadow-lg">M</div>
                <div className="ml-4">
                  <h4 className="font-bold text-lg">Michael K.</h4>
                  <p className="text-gray-500 font-medium">Volunteer</p>
                </div>
              </div>
              <p className="text-gray-600 dark:text-gray-300 text-lg leading-relaxed">"Seeing the kids' faces light up when they received their snacks was priceless. This program truly makes a difference."</p>
            </div>
            <div className="bg-gradient-to-br from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20 p-8 rounded-3xl hover-lift card-glow animate-fade-in-right" style={{animationDelay: '0.6s'}}>
              <div className="flex items-center mb-6">
                <div className="w-14 h-14 bg-gradient-to-r from-purple-500 to-pink-600 rounded-full flex items-center justify-center text-white font-bold text-xl shadow-lg">A</div>
                <div className="ml-4">
                  <h4 className="font-bold text-lg">Amina O.</h4>
                  <p className="text-gray-500 font-medium">Student</p>
                </div>
              </div>
              <p className="text-gray-600 dark:text-gray-300 text-lg leading-relaxed">"The snacks kept me going during the long coding sessions. I'm so grateful for everyone who donated!"</p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gradient-to-br from-gray-900 to-indigo-900 text-white py-16 px-6 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-indigo-600/10 to-purple-600/10"></div>
        <div className="relative max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-10 mb-12">
            <div className="animate-fade-in-left">
              <div className="flex items-center space-x-3 mb-6">
                <div className="w-12 h-12 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-xl flex items-center justify-center shadow-lg">
                  <span className="text-white font-bold text-lg">CP</span>
                </div>
                <span className="text-2xl font-bold">ChetuPamoja</span>
              </div>
              <p className="text-gray-300 text-lg leading-relaxed">Empowering the next generation of tech innovators through community support and nourishment.</p>
            </div>
            <div className="animate-fade-in-up">
              <h3 className="font-bold text-xl mb-6">Quick Links</h3>
              <ul className="space-y-3 text-gray-300">
                <li><Link href="/donate" className="hover:text-white transition-colors text-lg">Donate</Link></li>
                <li><a href="#" className="hover:text-white transition-colors text-lg">About Us</a></li>
                <li><a href="#" className="hover:text-white transition-colors text-lg">Contact</a></li>
              </ul>
            </div>
            <div className="animate-fade-in-right">
              <h3 className="font-bold text-xl mb-6">Contact Info</h3>
              <ul className="space-y-3 text-gray-300 text-lg">
                <li className="flex items-center space-x-2">📧 <span>info@chetupamoja.org</span></li>
                <li className="flex items-center space-x-2">📱 <span>+254 700 000 000</span></li>
                <li className="flex items-center space-x-2">📍 <span>Nairobi, Kenya</span></li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-700 pt-8 text-center text-gray-400">
            <p className="text-lg">&copy; {new Date().getFullYear()} Tech Challenge Feeding Program. Powered by ChetuPamoja. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
