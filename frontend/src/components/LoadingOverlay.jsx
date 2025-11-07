import PropTypes from 'prop-types'

const LoadingOverlay = ({ message, submessage }) => {
  return (
    <div className="fixed inset-0 bg-gray-900/95 backdrop-blur-sm z-50 flex items-center justify-center">
      <div className="text-center px-8">
        {/* Animated Logo */}
        <div className="mb-8 flex justify-center">
          <div className="relative">
            <div className="w-24 h-24 bg-gradient-to-br from-blue-500 via-purple-500 to-pink-500 rounded-2xl flex items-center justify-center shadow-2xl animate-pulse">
              <span className="text-white text-5xl font-bold">X</span>
            </div>
            {/* Spinning ring */}
            <div className="absolute inset-0 border-4 border-transparent border-t-white rounded-2xl animate-spin"></div>
          </div>
        </div>

        {/* Main message */}
        <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
          {message || 'Setting up your wallet...'}
        </h2>

        {/* Submessage */}
        <p className="text-lg text-gray-300 mb-8 max-w-md mx-auto">
          {submessage || 'This may take a few moments on the testnet'}
        </p>

        {/* Loading dots animation */}
        <div className="flex justify-center items-center space-x-2">
          <div className="w-3 h-3 bg-blue-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
          <div className="w-3 h-3 bg-purple-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
          <div className="w-3 h-3 bg-pink-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
        </div>

        {/* Environment indicator */}
        <div className="mt-12 inline-flex items-center px-4 py-2 bg-yellow-500/20 border border-yellow-500/50 rounded-full text-yellow-300 text-sm font-semibold">
          <span className="mr-2">🧪</span>
          <span>TESTNET ENVIRONMENT</span>
        </div>

        {/* Progress info */}
        <div className="mt-8 space-y-2 text-sm text-gray-400">
          <p>✓ Connecting to XRP Ledger Testnet</p>
          <p className="animate-pulse">⏳ Creating your wallet...</p>
          <p className="text-gray-500">⏳ Funding with test XRP</p>
        </div>
      </div>
    </div>
  )
}

LoadingOverlay.propTypes = {
  message: PropTypes.string,
  submessage: PropTypes.string,
}

export default LoadingOverlay
