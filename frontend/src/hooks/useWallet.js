import { useState, useEffect, useCallback } from 'react'
import * as xrpl from 'xrpl'

export const useWallet = () => {
  const [wallet, setWallet] = useState(null)
  const [balance, setBalance] = useState(null)
  const [loading, setLoading] = useState(false)
  const [txResult, setTxResult] = useState(null)
  const [transactions, setTransactions] = useState([])

  const createWallet = useCallback(async (seed = '') => {
    setLoading(true)
    try {
      const client = new xrpl.Client('wss://s.altnet.rippletest.net:51233')
      await client.connect()

      let newWallet
      if (seed) {
        // Import wallet from seed
        newWallet = xrpl.Wallet.fromSeed(seed)
      } else {
        // Generate new wallet
        newWallet = xrpl.Wallet.generate()
        await client.fundWallet(newWallet)
      }

      setWallet({
        address: newWallet.address,
        seed: newWallet.seed
      })

      const response = await client.request({
        command: 'account_info',
        account: newWallet.address,
        ledger_index: 'validated'
      })

      setBalance(xrpl.dropsToXrp(response.result.account_data.Balance))
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
    resetWallet
  }
}