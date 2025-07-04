import Link from "next/link"

export default function Home() {
  return (
    <div className="min-h-screen bg-white text-black font-mono">
      {/* Hero Section */}
      <section className="min-h-screen flex flex-col items-center justify-center px-8">
        <div className="max-w-4xl text-center space-y-12">
          <h1 className="text-6xl md:text-8xl font-bold tracking-tight">ChetuPamoja</h1>

          <p className="text-2xl md:text-3xl font-light tracking-wide">Give Crypto. Change Lives. Together.</p>

          <div className="flex flex-col sm:flex-row gap-6 justify-center pt-8">
            <Link href="/donate">
              <button className="px-12 py-4 bg-black text-white font-medium tracking-wide hover:bg-gray-800 transition-colors">
                DONATE NOW
              </button>
            </Link>

            <Link href="#organizations">
              <button className="px-12 py-4 border-2 border-black text-black font-medium tracking-wide hover:bg-black hover:text-white transition-colors">
                FOR ORGANIZATIONS
              </button>
            </Link>
          </div>
        </div>
      </section>

      {/* Problem Statement */}
      <section className="py-32 px-8 border-t border-gray-200">
        <div className="max-w-3xl mx-auto text-center space-y-16">
          <h2 className="text-4xl md:text-5xl font-bold">The Problem</h2>

          <div className="space-y-8 text-lg md:text-xl leading-relaxed">
            <p>Local organizations turn away millions in donations.</p>
            <p>High transfer fees. Slow processes. No crypto support.</p>
            <p>Donors want impact. Organizations need funds.</p>
          </div>
        </div>
      </section>

      {/* Solution */}
      <section className="py-32 px-8 bg-black text-white">
        <div className="max-w-3xl mx-auto text-center space-y-16">
          <h2 className="text-4xl md:text-5xl font-bold">Our Solution</h2>

          <p className="text-xl md:text-2xl leading-relaxed font-light">
            Instant crypto donations. Zero borders. Maximum impact.
          </p>

          <div className="grid md:grid-cols-3 gap-12 pt-16">
            <div className="space-y-4">
              <div className="text-3xl">⚡</div>
              <h3 className="text-xl font-medium">Instant</h3>
              <p className="text-sm opacity-80">Direct crypto transfers</p>
            </div>

            <div className="space-y-4">
              <div className="text-3xl">🌍</div>
              <h3 className="text-xl font-medium">Global</h3>
              <p className="text-sm opacity-80">No geographical limits</p>
            </div>

            <div className="space-y-4">
              <div className="text-3xl">📊</div>
              <h3 className="text-xl font-medium">Transparent</h3>
              <p className="text-sm opacity-80">Track every donation</p>
            </div>
          </div>
        </div>
      </section>

      {/* For Donors */}
      <section className="py-32 px-8">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-4xl md:text-5xl font-bold text-center mb-20">For Donors</h2>

          <div className="grid md:grid-cols-2 gap-12">
            <div className="text-center space-y-6">
              <h3 className="text-xl font-medium">Give</h3>
              <ul className="space-y-2 text-left">
                <li>• Donate crypto instantly</li>
                <li>• Minimal fees</li>
                <li>• Global reach</li>
              </ul>
            </div>

            <div className="text-center space-y-6">
              <h3 className="text-xl font-medium">Get</h3>
              <ul className="space-y-2 text-left">
                <li>• NFT donation badges</li>
                <li>• Impact metrics</li>
                <li>• Community recognition</li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* For Organizations */}
      <section id="organizations" className="py-32 px-8 bg-gray-50">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-4xl md:text-5xl font-bold text-center mb-20">For Organizations</h2>

          <div className="grid md:grid-cols-3 gap-12">
            <div className="text-center space-y-6">
              <h3 className="text-xl font-medium">Access</h3>
              <p>Global crypto community</p>
            </div>

            <div className="text-center space-y-6">
              <h3 className="text-xl font-medium">Reduce</h3>
              <p>Transfer fees and delays</p>
            </div>

            <div className="text-center space-y-6">
              <h3 className="text-xl font-medium">Integrate</h3>
              <p>Simple API integration</p>
            </div>
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="py-32 px-8">
        <div className="max-w-3xl mx-auto text-center space-y-12">
          <h2 className="text-4xl md:text-5xl font-bold">Join the Movement</h2>

          <p className="text-xl md:text-2xl font-light">ChetuPamoja == Collective Ownership</p>

          <div className="flex flex-col sm:flex-row gap-6 justify-center pt-8">
            <Link href="/donate">
              <button className="px-12 py-4 bg-black text-white font-medium tracking-wide hover:bg-gray-800 transition-colors">
                START GIVING
              </button>
            </Link>

            <Link href="#organizations">
              <button className="px-12 py-4 border-2 border-black text-black font-medium tracking-wide hover:bg-black hover:text-white transition-colors">
                JOIN AS ORG
              </button>
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-16 px-8 border-t border-gray-200 text-center">
        <p className="text-sm opacity-60">
          © 2025 ChetuPamoja. Give Crypto. Change Lives. Together.
        </p>
      </footer>
    </div>
  )
}