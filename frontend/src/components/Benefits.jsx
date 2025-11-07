import PropTypes from 'prop-types'

const Benefits = ({ onGetStarted }) => {
  const benefits = [
    {
      title: 'Start in minutes',
      description: 'Create your wallet and start sending XRP in less time than it takes to make coffee.',
      image: '🚀',
    },
    {
      title: 'No hidden fees',
      description: 'What you see is what you pay. Transparent pricing with no surprises.',
      image: '💎',
    },
    {
      title: 'Developer friendly',
      description: 'Built with modern tools and comprehensive APIs for seamless integration.',
      image: '💻',
    },
  ]

  return (
    <section className="py-24 bg-gradient-to-br from-gray-50 to-slate-100">
      <div className="w-full px-8">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          {/* Left side - Benefits list */}
          <div>
            <h2 className="text-5xl md:text-6xl font-bold text-gray-900 mb-8 leading-tight">
              Everything you need,
              <br />
              nothing you don't
            </h2>
            
            <div className="space-y-8">
              {benefits.map((benefit, index) => (
                <div key={index} className="flex gap-6 items-start">
                  <div className="text-5xl flex-shrink-0">{benefit.image}</div>
                  <div>
                    <h3 className="text-2xl font-bold text-gray-900 mb-2">
                      {benefit.title}
                    </h3>
                    <p className="text-gray-600 text-lg leading-relaxed">
                      {benefit.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>

            <button
              onClick={onGetStarted}
              className="mt-12 px-8 py-4 bg-gray-900 text-white rounded-full font-semibold text-lg hover:bg-gray-800 transition-all duration-300 hover:scale-105 hover:shadow-xl"
            >
              Get Started Now
            </button>
          </div>

          {/* Right side - Visual element */}
          <div className="relative">
            <div className="relative bg-white rounded-3xl shadow-2xl p-8 border border-gray-200">
              <div className="space-y-4">
                {/* Mock wallet interface */}
                <div className="bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl p-6 text-white">
                  <div className="text-sm opacity-80 mb-2">Total Balance</div>
                  <div className="text-4xl font-bold mb-4">1,234.56 XRP</div>
                  <div className="text-sm opacity-80">≈ $2,469.12 USD</div>
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-gray-50 rounded-xl p-4 border border-gray-200">
                    <div className="text-2xl mb-2">⚡</div>
                    <div className="text-sm text-gray-600 mb-1">Send</div>
                    <div className="text-lg font-bold text-gray-900">Instant</div>
                  </div>
                  <div className="bg-gray-50 rounded-xl p-4 border border-gray-200">
                    <div className="text-2xl mb-2">🔒</div>
                    <div className="text-sm text-gray-600 mb-1">Security</div>
                    <div className="text-lg font-bold text-gray-900">Max</div>
                  </div>
                </div>

                <div className="space-y-3">
                  <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl border border-gray-200">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center text-green-600">✓</div>
                      <div>
                        <div className="font-semibold text-gray-900">Payment Sent</div>
                        <div className="text-sm text-gray-600">2 minutes ago</div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="font-bold text-gray-900">-50 XRP</div>
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl border border-gray-200">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center text-blue-600">↓</div>
                      <div>
                        <div className="font-semibold text-gray-900">Received</div>
                        <div className="text-sm text-gray-600">1 hour ago</div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="font-bold text-green-600">+100 XRP</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

Benefits.propTypes = {
  onGetStarted: PropTypes.func.isRequired,
}

export default Benefits
