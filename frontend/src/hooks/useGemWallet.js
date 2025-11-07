/**
 * Gem Wallet Integration Hook
 * For XRP Ledger wallet connection
 */
import { useState, useEffect, useCallback } from 'react'

export const useGemWallet = () => {
  const [isInstalled, setIsInstalled] = useState(false)
  const [isConnected, setIsConnected] = useState(false)
  const [address, setAddress] = useState(null)
  const [error, setError] = useState(null)

  // Check if Gem Wallet is installed
  useEffect(() => {
    const checkGemWallet = () => {
      if (typeof window !== 'undefined') {
        const installed = window.gemWallet !== undefined
        setIsInstalled(installed)
        
        if (!installed) {
          console.log('Gem Wallet not detected')
        }
      }
    }

    checkGemWallet()
    
    // Check again after a delay (Gem Wallet might load asynchronously)
    const timer = setTimeout(checkGemWallet, 1000)
    return () => clearTimeout(timer)
  }, [])

  // Connect to Gem Wallet
  const connect = useCallback(async () => {
    setError(null)

    if (!isInstalled) {
      setError('Gem Wallet is not installed. Please install it first.')
      return { success: false, error: 'Gem Wallet not installed' }
    }

    try {
      // Request connection to Gem Wallet
      const response = await window.gemWallet.getAddress()
      
      if (response.result && response.result.address) {
        setAddress(response.result.address)
        setIsConnected(true)
        return { success: true, address: response.result.address }
      } else {
        throw new Error('Failed to get address from Gem Wallet')
      }
    } catch (err) {
      const errorMessage = err.message || 'Failed to connect to Gem Wallet'
      setError(errorMessage)
      console.error('Gem Wallet connection error:', err)
      return { success: false, error: errorMessage }
    }
  }, [isInstalled])

  // Disconnect from Gem Wallet
  const disconnect = useCallback(() => {
    setAddress(null)
    setIsConnected(false)
    setError(null)
  }, [])

  // Sign transaction with Gem Wallet
  const signTransaction = useCallback(async (transaction) => {
    if (!isConnected) {
      return { success: false, error: 'Not connected to Gem Wallet' }
    }

    try {
      const response = await window.gemWallet.signTransaction({ transaction })
      
      if (response.result) {
        return { success: true, result: response.result }
      } else {
        throw new Error('Transaction signing failed')
      }
    } catch (err) {
      const errorMessage = err.message || 'Failed to sign transaction'
      console.error('Gem Wallet signing error:', err)
      return { success: false, error: errorMessage }
    }
  }, [isConnected])

  return {
    isInstalled,
    isConnected,
    address,
    error,
    connect,
    disconnect,
    signTransaction,
  }
}
