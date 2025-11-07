import { useState, useEffect, useCallback } from 'react'
import * as xrpl from 'xrpl'

export const useWallet = () => {
  const [wallet, setWallet] = useState(null)
  const [balance, setBalance] = useState(null)
  const [loading, setLoading] = useState(false)
  const [txResult, setTxResult] = useState(null)
  const [transactions, setTransactions] = useState([])
  
  // Generic signer for arbitrary XRPL transactions (tx object). Useful for issued currency (XPF) ops.
  const signAndSubmit = useCallback(async (tx) => {
    if (!wallet) throw new Error('No wallet available')
    const client = new xrpl.Client('wss://s.altnet.rippletest.net:51233')
    await client.connect()
    try {
      const senderWallet = xrpl.Wallet.fromSeed(wallet.seed)
      const prepared = await client.autofill({
        Account: wallet.address,
        ...tx,
      })
      const signed = senderWallet.sign(prepared)
      const result = await client.submitAndWait(signed.tx_blob)
      return result
    } finally {
      await client.disconnect()
    }
  }, [wallet])

  const createWallet = useCallback(async (seed = '') => {
    setLoading(true)
    try {
      const client = new xrpl.Client('wss://s.altnet.rippletest.net:51233')
      await client.connect()

      let newWallet
      if (seed) {
        // Import wallet from seed
        newWallet = xrpl.Wallet.fromSeed(seed)
        
        // Check existing balance
        try {
          const response = await client.request({
            command: 'account_info',
            account: newWallet.address,
            ledger_index: 'validated'
          })
          setBalance(xrpl.dropsToXrp(response.result.account_data.Balance))
        } catch (err) {
          // Account doesn't exist, fund it with 10 XRP
          await client.fundWallet(newWallet, { amount: '10' })
          setBalance('10')
        }
      } else {
        // Generate new wallet and fund with 10 XRP
        newWallet = xrpl.Wallet.generate()
        
        try {
          // Fund wallet with exactly 10 XRP
          const fundResult = await client.fundWallet(newWallet, { amount: '10' })
          console.log('Wallet funded:', fundResult)
          setBalance('10')
        } catch (fundError) {
          console.error('Funding error:', fundError)
          // Fallback: use default faucet funding
          await client.fundWallet(newWallet)
          const response = await client.request({
            command: 'account_info',
            account: newWallet.address,
            ledger_index: 'validated'
          })
          setBalance(xrpl.dropsToXrp(response.result.account_data.Balance))
        }
      }

      setWallet({
        address: newWallet.address,
        seed: newWallet.seed
      })

      await client.disconnect()
    } catch (error) {
      console.error('Error:', error)
      alert('Error: ' + error.message)
    }
    setLoading(false)
  }, [])

  const sendPayment = useCallback(async (destination, amount) => {
    if (!wallet) return

    setLoading(true)
    setTxResult(null)
    try {
      const client = new xrpl.Client('wss://s.altnet.rippletest.net:51233')
      await client.connect()

      const senderWallet = xrpl.Wallet.fromSeed(wallet.seed)

      const payment = {
        TransactionType: 'Payment',
        Account: wallet.address,
        Destination: destination,
        Amount: xrpl.xrpToDrops(amount.toString())
      }

      const prepared = await client.autofill(payment)
      const signed = senderWallet.sign(prepared)
      const result = await client.submitAndWait(signed.tx_blob)

      const txStatus = result.result.meta.TransactionResult
      setTxResult(txStatus)

      const newTx = {
        id: Date.now(),
        type: 'payment',
        amount: amount.toString(),
        destination: destination,
        status: txStatus,
        timestamp: new Date().toLocaleString()
      }
      setTransactions(prev => [newTx, ...prev])

      // Refresh balance
      const response = await client.request({
        command: 'account_info',
        account: wallet.address,
        ledger_index: 'validated'
      })
      setBalance(xrpl.dropsToXrp(response.result.account_data.Balance))

      await client.disconnect()
    } catch (error) {
      console.error('Error:', error)
      setTxResult('FAILED')
      alert('Error: ' + error.message)
    }
    setLoading(false)
  }, [wallet])

  const refreshBalance = useCallback(async () => {
    if (!wallet) return

    try {
      const client = new xrpl.Client('wss://s.altnet.rippletest.net:51233')
      await client.connect()

      const response = await client.request({
        command: 'account_info',
        account: wallet.address,
        ledger_index: 'validated'
      })

      setBalance(xrpl.dropsToXrp(response.result.account_data.Balance))
      await client.disconnect()
    } catch (error) {
      console.error('Error refreshing balance:', error)
    }
  }, [wallet])

  const resetWallet = useCallback(() => {
    setWallet(null)
    setBalance(null)
    setTxResult(null)
    setTransactions([])
  }, [])

  useEffect(() => {
    if (wallet) {
      const interval = setInterval(refreshBalance, 30000)
      return () => clearInterval(interval)
    }
  }, [wallet, refreshBalance])

  return {
    wallet,
    balance,
    loading,
    txResult,
    transactions,
    createWallet,
    sendPayment,
    refreshBalance,
    resetWallet,
    signAndSubmit,
    setBalance,
  }
}