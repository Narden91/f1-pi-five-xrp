import { useState, useCallback } from 'react'
import PropTypes from 'prop-types'
import { useGemWallet } from '../hooks'

const LoginPage = ({ onLogin, onBack }) => {
  const [walletAddress, setWalletAddress] = useState('')
  const [error, setError] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  
  const { isInstalled, connect } = useGemWallet()

  const handleGemWalletConnect = useCallback(async () => {
    setError('')
    setIsLoading(true)

    try {
      const result = await connect()
      
      if (result.success) {
        await onLogin({ type: 'gem', address: result.address })
      } else {
        setError(result.error || 'Failed to connect to Gem Wallet')
      }
    } catch (err) {
      setError(err.message || 'Failed to connect to Gem Wallet')
    } finally {
      setIsLoading(false)
    }
  }, [connect, onLogin])

  const handleManualLogin = useCallback(async (e) => {
    e.preventDefault()
    setError('')

    // Quick validation
    if (!walletAddress.trim()) {
      setError('Please enter your wallet address')
      return
    }

    if (!walletAddress.startsWith('r')) {
      setError('Invalid XRP address format')
      return
    }

    setIsLoading(true)
    
    try {
      await onLogin({ type: 'manual', address: walletAddress.trim() })
    } catch (err) {
      setError(err.message || 'Login failed')
    } finally {
      setIsLoading(false)
    }
  }, [walletAddress, onLogin])

  const handleCreateWallet = useCallback(async () => {
    setIsLoading(true)
    try {
      await onLogin({ type: 'create' })
    } catch (err) {
      setError(err.message || 'Failed to create wallet')
    } finally {
      setIsLoading(false)
    }
  }, [onLogin])

  return (
    <div className="min-h-screen bg-white flex items-center justify-center">
      <div className="w-full max-w-md px-8">
        {/* Back button */}
        {onBack && (
          <button
            onClick={onBack}
            className="mb-8 text-gray-600 hover:text-gray-900 transition-colors flex items-center gap-2"
          >
            <span>←</span>
            <span>Back</span>
          </button>
        )}

        {/* Logo/Title */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">
            Welcome back
          </h1>
          <p className="text-gray-600">
            Connect your wallet to continue
          </p>
        </div>

        {/* Gem Wallet Connect Button */}
        <div className="mb-6">
          <button
            onClick={handleGemWalletConnect}
            disabled={isLoading}
            className="w-full px-6 py-4 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-xl font-semibold text-lg hover:from-purple-700 hover:to-blue-700 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg flex items-center justify-center gap-3"
          >
            <span className="text-2xl">💎</span>
            <span>{isInstalled ? 'Connect Gem Wallet' : 'Install Gem Wallet'}</span>
          </button>
          {!isInstalled && (
            <p className="mt-2 text-xs text-center text-gray-500">
              <a 
                href="https://gemwallet.app/" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-blue-600 hover:underline"
              >
                Get Gem Wallet →
              </a>
            </p>
          )}
        </div>

        {/* Divider */}
        <div className="relative my-8">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-gray-200"></div>
          </div>
          <div className="relative flex justify-center text-sm">
            <span className="px-4 bg-white text-gray-500">or enter manually</span>
          </div>
        </div>

        {/* Manual Login Form */}
        <form onSubmit={handleManualLogin} className="space-y-6">
          {/* Wallet Address Input */}
          <div>
            <label htmlFor="walletAddress" className="block text-sm font-semibold text-gray-900 mb-2">
              Wallet Address
            </label>
            <input
              id="walletAddress"
              type="text"
              value={walletAddress}
              onChange={(e) => setWalletAddress(e.target.value)}
              placeholder="rXXXXXXXXXXXXXXXXXXXXXXXXXXXXX"
              className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-gray-900 transition-colors font-mono text-sm"
              disabled={isLoading}
              autoComplete="off"
            />
          </div>

          {/* Error Message */}
          {error && (
            <div className="p-4 bg-red-50 border border-red-200 rounded-xl text-red-700 text-sm">
              {error}
            </div>
          )}

          {/* Submit Button */}
          <button
            type="submit"
            disabled={isLoading}
            className="w-full px-6 py-4 bg-gray-900 text-white rounded-full font-semibold text-lg hover:bg-gray-800 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading ? 'Logging in...' : 'Continue'}
          </button>
        </form>

        {/* Divider */}
        <div className="relative my-8">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-gray-200"></div>
          </div>
          <div className="relative flex justify-center text-sm">
            <span className="px-4 bg-white text-gray-500">or</span>
          </div>
        </div>

        {/* Create New Wallet */}
        <button
          type="button"
          onClick={handleCreateWallet}
          disabled={isLoading}
          className="w-full px-6 py-3 bg-white border-2 border-gray-900 text-gray-900 rounded-full font-semibold hover:bg-gray-900 hover:text-white transition-all duration-300"
        >
          Create New Wallet
        </button>

        {/* Footer Note */}
        <p className="mt-8 text-center text-sm text-gray-500">
          This is a testnet environment. Safe for development and testing.
        </p>
      </div>
    </div>
  )
}

LoginPage.propTypes = {
  onLogin: PropTypes.func.isRequired,
  onBack: PropTypes.func,
}

export default LoginPage
