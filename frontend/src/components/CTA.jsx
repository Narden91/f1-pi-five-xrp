import PropTypes from 'prop-types'

const CTA = ({ onGetStarted }) => {
  return (
    <section className="py-24 bg-gray-900">
      <div className="w-full px-8 text-center">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-5xl md:text-6xl font-bold text-white mb-6 leading-tight">
            Ready to get started?
          </h2>
          <p className="text-xl text-gray-300 mb-12">
            Join thousands of users already using XRP Ledger for fast, secure digital payments.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <button
              onClick={onGetStarted}
              className="group relative px-8 py-4 bg-white text-gray-900 rounded-full font-semibold text-lg overflow-hidden transition-all duration-300 hover:scale-105 hover:shadow-2xl min-w-[200px]"
            >
              <span className="relative z-10 flex items-center justify-center gap-2">
                Create Wallet
                <span className="transform group-hover:translate-x-1 transition-transform">→</span>
              </span>
            </button>
            
            <button className="px-8 py-4 bg-transparent border-2 border-white text-white rounded-full font-semibold text-lg hover:bg-white hover:text-gray-900 transition-all duration-300 min-w-[200px]">
              View Documentation
            </button>
          </div>

          {/* Trust indicators */}
          <div className="mt-16 pt-16 border-t border-gray-800">
            <div className="grid grid-cols-3 gap-8 text-center">
              <div>
                <div className="text-3xl font-bold text-white mb-2">99.99%</div>
                <div className="text-sm text-gray-400">Uptime</div>
              </div>
              <div className="border-x border-gray-800">
                <div className="text-3xl font-bold text-white mb-2">10M+</div>
                <div className="text-sm text-gray-400">Transactions</div>
              </div>
              <div>
                <div className="text-3xl font-bold text-white mb-2">150+</div>
                <div className="text-sm text-gray-400">Countries</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

CTA.propTypes = {
  onGetStarted: PropTypes.func.isRequired,
}

export default CTA
