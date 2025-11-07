import PropTypes from 'prop-types'
import { useState, useEffect } from 'react'
import NetworkStatus from './NetworkStatus'
import { APP_CONFIG } from '../config'

const Header = ({ activeTab, setActiveTab, wallet, onLoginClick, onHomeClick }) => {
  const [scrolled, setScrolled] = useState(false)
  const isConnected = true

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 10)
    }
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  return (
    <header
      className={`sticky top-0 z-40 transition-all duration-300 ${
        scrolled
          ? 'bg-white/95 backdrop-blur-md shadow-xl'
          : 'bg-white/80 backdrop-blur-sm shadow-lg'
      } border-b border-gray-200`}
    >
      <div className="w-full">
        <div className="flex justify-between items-center h-16 px-8">
          {/* Logo */}
          <div className="flex items-center space-x-4">
            <button 
              onClick={onHomeClick}
              className="flex-shrink-0 group cursor-pointer"
            >
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-gray-900 rounded-xl flex items-center justify-center shadow-lg transform group-hover:scale-105 transition-transform duration-300">
                  <span className="text-white text-2xl font-bold">X</span>
                </div>
                <div>
                  <h1 className="text-xl font-bold text-gray-900">
                    {APP_CONFIG.name}
                  </h1>
                </div>
              </div>
            </button>
          </div>

          {/* Navigation & Actions */}
          <div className="flex items-center space-x-4">
            {/* Navigation - only show when wallet exists */}
            {wallet && (
              <nav className="hidden md:flex items-center space-x-2 mr-4">
                <button
                  onClick={() => setActiveTab('dashboard')}
                  className={`px-6 py-2 rounded-full text-sm font-semibold transition-all duration-300 ${
                    activeTab === 'dashboard'
                      ? 'text-white bg-gray-900'
                      : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
                  }`}
                >
                  Dashboard
                </button>
                <button
                  onClick={() => setActiveTab('transactions')}
                  className={`px-6 py-2 rounded-full text-sm font-semibold transition-all duration-300 ${
                    activeTab === 'transactions'
                      ? 'text-white bg-gray-900'
                      : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
                  }`}
                >
                  Transactions
                </button>
              </nav>
            )}

            {/* Network Status */}
            <NetworkStatus isConnected={isConnected} />

            {/* Wallet Info or Login Button */}
            {wallet ? (
              <div className="hidden lg:block px-3 py-1 bg-gray-100 rounded-full border border-gray-200">
                <span className="text-xs font-mono text-gray-700">
                  {wallet.address.slice(0, 8)}...{wallet.address.slice(-6)}
                </span>
              </div>
            ) : (
              <button
                onClick={onLoginClick}
                className="px-6 py-2 bg-gray-900 text-white rounded-full font-semibold text-sm hover:bg-gray-800 transition-all duration-300 shadow-sm"
              >
                Log in
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Mobile Navigation - only show when wallet exists */}
      {wallet && (
        <div className="md:hidden border-t border-gray-200 bg-white/80 backdrop-blur-sm">
          <div className="flex justify-around py-2">
            <button
              onClick={() => setActiveTab('dashboard')}
              className={`flex-1 py-2 text-center text-sm font-medium transition-colors ${
                activeTab === 'dashboard'
                  ? 'text-gray-900 border-b-2 border-gray-900'
                  : 'text-gray-600'
              }`}
            >
              Dashboard
            </button>
            <button
              onClick={() => setActiveTab('transactions')}
              className={`flex-1 py-2 text-center text-sm font-medium transition-colors ${
                activeTab === 'transactions'
                  ? 'text-gray-900 border-b-2 border-gray-900'
                  : 'text-gray-600'
              }`}
            >
              Transactions
            </button>
          </div>
        </div>
      )}
    </header>
  )
}

Header.propTypes = {
  activeTab: PropTypes.string.isRequired,
  setActiveTab: PropTypes.func.isRequired,
  wallet: PropTypes.shape({
    address: PropTypes.string,
  }),
  onLoginClick: PropTypes.func,
  onHomeClick: PropTypes.func,
}

export default Header