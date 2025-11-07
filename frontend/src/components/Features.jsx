const Features = () => {
  const features = [
    {
      icon: '⚡',
      title: 'Lightning Fast',
      description: 'Transactions settle in 3-5 seconds. No more waiting hours or days for confirmations.',
      color: 'from-blue-500 to-cyan-500',
    },
    {
      icon: '🔒',
      title: 'Bank-Level Security',
      description: 'Enterprise-grade cryptographic security protecting every transaction on the ledger.',
      color: 'from-purple-500 to-pink-500',
    },
    {
      icon: '💰',
      title: 'Minimal Fees',
      description: 'Transaction costs average just $0.00012. Send any amount without breaking the bank.',
      color: 'from-green-500 to-emerald-500',
    },
    {
      icon: '🌍',
      title: 'Global Network',
      description: 'Access a worldwide network of validators ensuring decentralization and reliability.',
      color: 'from-orange-500 to-red-500',
    },
  ]

  return (
    <section className="py-24 bg-white">
      <div className="w-full px-8">
        <div className="text-center mb-16">
          <h2 className="text-5xl md:text-6xl font-bold text-gray-900 mb-6">
            Built for the future
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Everything you need to manage digital payments with confidence
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8">
          {features.map((feature, index) => (
            <div
              key={index}
              className="group relative p-8 bg-white border border-gray-200 rounded-3xl hover:shadow-2xl transition-all duration-300 hover:-translate-y-2"
            >
              <div className={`inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br ${feature.color} text-white text-3xl mb-6 group-hover:scale-110 transition-transform duration-300`}>
                {feature.icon}
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4">
                {feature.title}
              </h3>
              <p className="text-gray-600 leading-relaxed">
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

export default Features
