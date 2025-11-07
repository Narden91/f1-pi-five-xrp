import { useState, useEffect, useCallback } from 'react'
import { isInstalled, getAddress, getNetwork } from '@gemwallet/api'

export const useGemWallet = () => {
  const [isGemInstalled, setIsGemInstalled] = useState(false)
  const [isConnected, setIsConnected] = useState(false)
  const [address, setAddress] = useState(null)
  const [balance, setBalance] = useState(null)
  const [network, setNetwork] = useState(null)
  const [publicKey, setPublicKey] = useState(null)
  const [error, setError] = useState(null)
  const [isChecking, setIsChecking] = useState(true)

  useEffect(() => {
    let mounted = true

    const checkInstallation = async () => {
      try {
        console.log(' Checking GemWallet installation...')
        const result = await isInstalled()
        
        if (mounted) {
          setIsGemInstalled(result)
          setIsChecking(false)
          
          if (result) {
            console.log(' GemWallet is installed!')
          } else {
            console.log(' GemWallet is not installed')
          }
        }
      } catch (err) {
        console.error(' Error checking GemWallet installation:', err)
        if (mounted) {
          setIsGemInstalled(false)
          setIsChecking(false)
        }
      }
    }

    checkInstallation()

    const timer1 = setTimeout(checkInstallation, 500)
    const timer2 = setTimeout(checkInstallation, 1000)
    const timer3 = setTimeout(checkInstallation, 2000)

    return () => {
      mounted = false
      clearTimeout(timer1)
      clearTimeout(timer2)
      clearTimeout(timer3)
    }
  }, [])

  const fetchBalance = useCallback(async (walletAddress) => {
    try {
      const response = await fetch('https://s.altnet.rippletest.net:51234/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          method: 'account_info',
          params: [{
            account: walletAddress,
            ledger_index: 'validated'
          }]
        })
      })

      const data = await response.json()
      
      if (data.result && data.result.account_data) {
        const balanceInDrops = data.result.account_data.Balance
        const balanceInXRP = (parseInt(balanceInDrops) / 1000000).toString()
        return balanceInXRP
      }
      
      throw new Error('Failed to fetch balance')
    } catch (err) {
      console.error(' Balance fetch error:', err)
      return null
    }
  }, [])

  const connect = useCallback(async () => {
    setError(null)

    if (!isGemInstalled) {
      const errorMsg = 'GemWallet is not installed. Please install it from gemwallet.app'
      setError(errorMsg)
      return { success: false, error: errorMsg }
    }

    try {
      console.log(' Connecting to GemWallet...')
      
      const addressResponse = await getAddress()
      console.log(' Address response:', addressResponse)
      
      if (!addressResponse || !addressResponse.result || !addressResponse.result.address) {
        throw new Error('User rejected the request or no address returned')
      }

      const walletAddress = addressResponse.result.address
      const walletPublicKey = addressResponse.result.publicKey || null

      console.log(' Got wallet address:', walletAddress)

      let networkInfo = 'testnet'
      try {
        const networkResponse = await getNetwork()
        console.log(' Network response:', networkResponse)
        
        if (networkResponse && networkResponse.result) {
          networkInfo = networkResponse.result.network || networkResponse.result.name || 'testnet'
        }
      } catch (netErr) {
        console.warn(' Could not fetch network, assuming testnet:', netErr)
      }

      const networkLower = networkInfo.toLowerCase()
      if (networkLower !== 'testnet' && !networkLower.includes('test')) {
        throw new Error('Please switch to Testnet in GemWallet settings. Currently on: ' + networkInfo)
      }

      console.log(' Network validated:', networkInfo)

      console.log(' Fetching balance...')
      const walletBalance = await fetchBalance(walletAddress)
      console.log(' Balance:', walletBalance, 'XRP')

      setAddress(walletAddress)
      setPublicKey(walletPublicKey)
      setBalance(walletBalance)
      setNetwork(networkInfo)
      setIsConnected(true)

      console.log(' Successfully connected to GemWallet!')

      return { 
        success: true, 
        address: walletAddress,
        balance: walletBalance,
        network: networkInfo,
        publicKey: walletPublicKey
      }
    } catch (err) {
      const errorMessage = err.message || 'Failed to connect to GemWallet'
      setError(errorMessage)
      console.error(' GemWallet connection error:', err)
      return { success: false, error: errorMessage }
    }
  }, [isGemInstalled, fetchBalance])

  const disconnect = useCallback(() => {
    setAddress(null)
    setBalance(null)
    setNetwork(null)
    setPublicKey(null)
    setIsConnected(false)
    setError(null)
    console.log(' Disconnected from GemWallet')
  }, [])

  const getBalance = useCallback(async () => {
    if (!address) {
      return null
    }
    
    const balance = await fetchBalance(address)
    setBalance(balance)
    return balance
  }, [address, fetchBalance])

  const checkInstallation = useCallback(async () => {
    try {
      console.log(' Manually checking GemWallet installation...')
      const result = await isInstalled()
      setIsGemInstalled(result)
      console.log(result ? ' Installed' : ' Not installed')
      return result
    } catch (err) {
      console.error(' Check failed:', err)
      setIsGemInstalled(false)
      return false
    }
  }, [])

  return {
    isInstalled: isGemInstalled,
    isConnected,
    address,
    balance,
    network,
    publicKey,
    error,
    isChecking,
    connect,
    disconnect,
    getBalance,
    checkInstallation,
  }
}
