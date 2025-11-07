import PropTypes from 'prop-types'

const Hero = ({ onGetStarted }) => {
  return (
    <section className="relative min-h-screen flex flex-col overflow-hidden bg-gradient-to-br from-slate-50 via-white to-slate-50">
      {/* Background decorative elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-96 h-96 bg-blue-100 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob"></div>
        <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-purple-100 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob animation-delay-2000"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-pink-100 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob animation-delay-4000"></div>
      </div>

      <div className="relative flex-1 flex flex-col justify-between w-full py-20 text-center">
        {/* Main heading */}
        <div className="animate-fadeIn pt-32">
          <h1 className="text-6xl md:text-7xl lg:text-8xl font-bold text-gray-900 mb-6 leading-tight">
            Digital payments
            <br />
            <span className="bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
              made simple
            </span>
          </h1>
          
          <p className="text-xl md:text-2xl text-gray-600 mb-12 max-w-3xl mx-auto leading-relaxed">
            Experience the future of XRP Ledger with lightning-fast transactions,
            enterprise-grade security, and zero complexity.
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <button
              onClick={onGetStarted}
              className="group relative px-8 py-4 bg-gray-900 text-white rounded-full font-semibold text-lg overflow-hidden transition-all duration-300 hover:scale-105 hover:shadow-2xl min-w-[200px]"
            >
              <span className="relative z-10 flex items-center justify-center gap-2">
                Get Started
                <span className="transform group-hover:translate-x-1 transition-transform">→</span>
              </span>
              <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-purple-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            </button>
            
            <button className="px-8 py-4 bg-transparent border-2 border-gray-900 text-gray-900 rounded-full font-semibold text-lg hover:bg-gray-900 hover:text-white transition-all duration-300 min-w-[200px]">
              Learn More
            </button>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-8 sm:gap-4 w-full pb-16 animate-slideUp">
          <div className="text-center">
            <div className="text-4xl md:text-5xl font-bold text-gray-900 mb-2">3-5s</div>
            <div className="text-sm text-gray-600 uppercase tracking-wide">Settlement Time</div>
          </div>
          <div className="text-center sm:border-x border-gray-200">
            <div className="text-4xl md:text-5xl font-bold text-gray-900 mb-2">$0.00012</div>
            <div className="text-sm text-gray-600 uppercase tracking-wide">Avg Transaction Cost</div>
          </div>
          <div className="text-center">
            <div className="text-4xl md:text-5xl font-bold text-gray-900 mb-2">1500+</div>
            <div className="text-sm text-gray-600 uppercase tracking-wide">Transactions/Second</div>
          </div>
        </div>
      </div>
    </section>
  )
}

Hero.propTypes = {
  onGetStarted: PropTypes.func.isRequired,
}

export default Hero
