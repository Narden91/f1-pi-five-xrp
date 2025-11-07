import { useCallback, useMemo, useState } from 'react'
import api from '../config/api'

/**
 * useRacing
 * Frontend state manager for the F1-AI racing game.
 * - Never stores or exposes secret flags.
 * - Talks to backend for training and racing.
 */
export const useRacing = (walletAddress, signAndSubmit) => {
  const [trainingCount, setTrainingCount] = useState(0)
  const [lastRace, setLastRace] = useState(null)
  const [raceStatus, setRaceStatus] = useState('idle') // idle | training | queued | racing | complete | error
  const [error, setError] = useState(null)

  const canRace = useMemo(() => raceStatus === 'idle' || raceStatus === 'complete', [raceStatus])

  const refreshLatestRace = useCallback(async () => {
    if (!walletAddress) return
    try {
      const data = await api.getLatestRace(walletAddress)
      if (data && data.race) {
        setLastRace(data.race)
        setRaceStatus('complete')
      }
    } catch (e) {
      // Silent fail; latest race may not exist yet
      console.debug('No latest race yet or backend not ready:', e?.message)
    }
  }, [walletAddress])

  const train = useCallback(async () => {
    if (!walletAddress) {
      setError('Connect a wallet first')
      return { success: false, error: 'No wallet' }
    }
    setError(null)
    setRaceStatus('training')
    try {
      const res = await api.trainCar(walletAddress)
      // If backend requires client-side signing of XPF payment, handle it
      if (res?.payment && signAndSubmit) {
        const tx = res.payment.txJSON || {
          TransactionType: 'Payment',
          Destination: res.payment.destination,
          Amount: res.payment.amount, // Could be drops or issued currency object
        }
        await signAndSubmit(tx)
      }
      // Server validates 1 XPF and applies hidden deltas
      if (res?.success) {
        setTrainingCount((c) => c + 1)
        setRaceStatus('idle')
        return { success: true }
      }
      throw new Error(res?.message || 'Training failed')
    } catch (e) {
      setRaceStatus('error')
      setError(e.message || 'Training failed')
      return { success: false, error: e.message }
    }
  }, [walletAddress, signAndSubmit])

  const enterRace = useCallback(async () => {
    if (!walletAddress) {
      setError('Connect a wallet first')
      return { success: false, error: 'No wallet' }
    }
    setError(null)
    setRaceStatus('racing')
    try {
      const res = await api.enterRace(walletAddress)
      if (res?.payment && signAndSubmit) {
        const tx = res.payment.txJSON || {
          TransactionType: 'Payment',
          Destination: res.payment.destination,
          Amount: res.payment.amount,
        }
        await signAndSubmit(tx)
      }
      if (res?.success && res?.race) {
        // race: { id, time, participants, winner, yourRank, prizeAwarded }
        setLastRace(res.race)
        setRaceStatus('complete')
        return { success: true, race: res.race }
      }
      throw new Error(res?.message || 'Race failed')
    } catch (e) {
      setRaceStatus('error')
      setError(e.message || 'Race failed')
      return { success: false, error: e.message }
    }
  }, [walletAddress, signAndSubmit])

  return {
    trainingCount,
    lastRace,
    raceStatus,
    error,
    canRace,
    train,
    enterRace,
    refreshLatestRace,
  }
}
