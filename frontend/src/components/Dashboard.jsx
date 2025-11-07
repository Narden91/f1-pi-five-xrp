import PropTypes from 'prop-types'
import { useState, useCallback } from 'react'
import WalletCard from './WalletCard'
import TransactionHistory from './TransactionHistory'
import Garage from './Garage'
import CarStatus from './CarStatus'
import RaceControls from './RaceControls'
import RaceResults from './RaceResults'
import TrainingModal from './TrainingModal'
import { useRacing } from '../hooks/useRacing'

const Dashboard = ({
  wallet,
  balance,
  loading,
  transactions,
  activeTab,
  onRefreshBalance,
  onBalanceUpdate,
  signer,
}) => {
  const [selectedCarId, setSelectedCarId] = useState(null)
  const [showTrainingModal, setShowTrainingModal] = useState(false)
  const [garageKey, setGarageKey] = useState(0) // Key to force garage reload
  const { trainingCount, lastRace, raceStatus, error, lastSpeedTest, carId, train, testSpeed, enterRace } = useRacing(wallet?.address, signer)

  const handleTrainClick = () => {
    if (!selectedCarId) {
      alert('Please select a car from your garage first')
      return
    }
    setShowTrainingModal(true)
  }

  const handleTrain = async (attributeIndices) => {
    if (!selectedCarId) {
      alert('Please select a car from your garage first')
      return
    }
    // Trigger backend training flow which should handle 1 XRP validation
    const result = await train(selectedCarId, attributeIndices)
    
    if (result.success) {
      // Deduct 1 XRP from balance immediately
      if (onBalanceUpdate) {
        const newBalance = (parseFloat(balance) - 1).toFixed(2)
        onBalanceUpdate(newBalance)
      }
      
      // Force garage to reload to show new car
      setGarageKey(prev => prev + 1)
      
      // Close modal
      setShowTrainingModal(false)
      
      // Refresh balance from server
      setTimeout(() => {
        onRefreshBalance()
      }, 1000)
    }
  }

  const handleTestSpeed = async () => {
    if (!selectedCarId) {
      alert('Please select a car from your garage first')
      return
    }
    // Test speed - no payment, just qualitative feedback
    await testSpeed(selectedCarId)
  }

  const handleRace = async () => {
    if (!selectedCarId) {
      alert('Please select a car from your garage first')
      return
    }
    await enterRace(selectedCarId)
  }

  const handleCarCreated = (car) => {
    setSelectedCarId(car.car_id)
    // Force garage reload
    setGarageKey(prev => prev + 1)
    // Refresh balance from server after a short delay
    setTimeout(() => {
      onRefreshBalance()
    }, 1000)
  }
  
  return (
    <div className="space-y-8">
      {/* Title Section */}
      <div className="text-center">
        <h1 className="text-4xl font-bold bg-gradient-to-r from-orange-600 via-red-600 to-amber-600 bg-clip-text text-transparent mb-2">
          🏎️ Garage Dashboard
        </h1>
        <p className="text-gray-600">Train your car, test performance, and compete in races</p>
      </div>

      <WalletCard
        wallet={wallet}
        balance={balance}
        onRefresh={onRefreshBalance}
      />

      {/* Garage Section */}
      <Garage 
        key={garageKey}
        walletAddress={wallet?.address}
        balance={balance}
        onCarCreated={handleCarCreated}
        onBalanceChange={onBalanceUpdate}
      />

      {/* Racing Game Panel */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-1">
          <CarStatus 
            trainingCount={trainingCount} 
            raceStatus={raceStatus}
            carId={selectedCarId || carId}
            lastSpeedTest={lastSpeedTest}
          />
        </div>
        <div className="lg:col-span-1">
          <RaceControls 
            onTrain={handleTrainClick}
            onTestSpeed={handleTestSpeed}
            onRace={handleRace} 
            disabled={!wallet || !selectedCarId} 
            loading={loading || raceStatus === 'training' || raceStatus === 'racing'} 
          />
        </div>
        <div className="lg:col-span-1">
          <RaceResults 
            race={lastRace} 
            playerAddress={wallet?.address}
            raceStatus={raceStatus}
            waitingPlayers={{ current: 3, max: 8 }}
          />
        </div>
      </div>

      {error && (
        <div className="p-4 rounded-xl border-2 bg-red-50 border-red-300 text-red-800 font-semibold">
          ⚠️ {error}
        </div>
      )}

      {activeTab === 'transactions' && (
        <TransactionHistory transactions={transactions} />
      )}

      {/* Training Modal */}
      <TrainingModal
        isOpen={showTrainingModal}
        onClose={() => setShowTrainingModal(false)}
        onTrain={handleTrain}
        loading={loading || raceStatus === 'training'}
      />
    </div>
  )
}

Dashboard.propTypes = {
  wallet: PropTypes.shape({
    address: PropTypes.string,
    seed: PropTypes.string
  }),
  balance: PropTypes.string,
  loading: PropTypes.bool.isRequired,
  transactions: PropTypes.array.isRequired,
  activeTab: PropTypes.string.isRequired,
  onRefreshBalance: PropTypes.func.isRequired,
  onBalanceUpdate: PropTypes.func,
  signer: PropTypes.func,
}

export default Dashboard