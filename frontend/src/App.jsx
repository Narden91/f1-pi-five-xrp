import { useState } from 'react'
import { useWallet } from './hooks'
import { Header, NewLandingPage, LoginPage, Dashboard, Footer, LoadingOverlay } from './components'

function App() {
  const [activeTab, setActiveTab] = useState('dashboard')
  const [currentView, setCurrentView] = useState('landing') // 'landing', 'login', 'dashboard'
  const [isCreatingWallet, setIsCreatingWallet] = useState(false)

  const {
    wallet,
    balance,
    loading,
    txResult,
    transactions,
    createWallet,
    sendPayment,
    refreshBalance,
    resetWallet
  } = useWallet()

  const handleGetStarted = async () => {
    setIsCreatingWallet(true)
    try {
      await createWallet()
      setCurrentView('dashboard')
    } finally {
      setIsCreatingWallet(false)
    }
  }

  const handleLoginClick = () => {
    setCurrentView('login')
  }

  const handleLogin = async (loginData) => {
    setIsCreatingWallet(true)
    try {
      if (loginData.type === 'create') {
        // Create new wallet
        await createWallet()
        setCurrentView('dashboard')
      } else if (loginData.type === 'gem') {
        // Login with Gem Wallet
        // For now, create a wallet for demo purposes
        // In production, you would use the Gem Wallet address to fetch/create wallet data
        await createWallet()
        setCurrentView('dashboard')
      } else if (loginData.type === 'manual') {
        // Manual address login
        // For now, create a wallet for demo purposes
        await createWallet()
        setCurrentView('dashboard')
      }
    } finally {
      setIsCreatingWallet(false)
    }
  }

  const handleBackToLanding = () => {
    setCurrentView('landing')
  }

  const handleResetWallet = () => {
    resetWallet()
    setCurrentView('landing')
  }

  const handleHomeClick = () => {
    setCurrentView('landing')
  }

  return (
    <div className="min-h-screen bg-white">
      {/* Header - only show on dashboard view */}
      {currentView === 'dashboard' && (
        <Header 
          activeTab={activeTab} 
          setActiveTab={setActiveTab} 
          wallet={wallet}
          onLoginClick={handleLoginClick}
          onHomeClick={handleHomeClick}
        />
      )}

      {/* Landing Page with simplified header */}
      {currentView === 'landing' && (
        <>
          <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md shadow-sm border-b border-gray-200">
            <div className="w-full px-8">
              <div className="flex justify-between items-center h-16">
                <button 
                  onClick={handleHomeClick}
                  className="flex items-center space-x-3 cursor-pointer group"
                >
                  <div className="w-10 h-10 bg-gray-900 rounded-xl flex items-center justify-center transform group-hover:scale-105 transition-transform duration-300">
                    <span className="text-white text-2xl font-bold">X</span>
                  </div>
                  <h1 className="text-xl font-bold text-gray-900">XRP Ledger</h1>
                </button>
                <button
                  onClick={handleLoginClick}
                  className="px-6 py-2 bg-gray-900 text-white rounded-full font-semibold text-sm hover:bg-gray-800 transition-all duration-300"
                >
                  Log in
                </button>
              </div>
            </div>
          </header>
          <NewLandingPage onGetStarted={handleGetStarted} />
        </>
      )}

      {/* Login Page */}
      {currentView === 'login' && (
        <LoginPage onLogin={handleLogin} onBack={handleBackToLanding} />
      )}

      {/* Dashboard */}
      {currentView === 'dashboard' && wallet && (
        <main className="w-full px-8 py-8 bg-gradient-to-br from-rose-50 via-pink-50 to-purple-50 min-h-screen">
          <Dashboard
            wallet={wallet}
            balance={balance}
            loading={loading}
            txResult={txResult}
            transactions={transactions}
            activeTab={activeTab}
            onRefreshBalance={refreshBalance}
            onSendPayment={sendPayment}
            onResetWallet={handleResetWallet}
          />
        </main>
      )}

      <Footer />
      
      {/* Loading Overlay */}
      {isCreatingWallet && (
        <LoadingOverlay 
          message="Setting up your wallet..."
          submessage="Connecting to XRP Ledger Testnet and funding your account"
        />
      )}
    </div>
  )
}

export default App