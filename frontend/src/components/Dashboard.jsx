import PropTypes from 'prop-types'
import { useState } from 'react'
import WalletCard from './WalletCard'
import TransactionHistory from './TransactionHistory'
import Garage from './Garage'
import CarStatus from './CarStatus'
import RaceControls from './RaceControls'
import RaceResults from './RaceResults'
import TrainingModal from './TrainingModal'
import RaceSimulation3D from './RaceSimulation3D'
import { useRacing } from '../hooks/useRacing'

const Dashboard = ({
  wallet,
  balance,
  loading,
  transactions,
  activeTab,
  connectionType,
  onRefreshBalance,
  onBalanceUpdate,
  signer,
}) => {
  const [selectedCarId, setSelectedCarId] = useState(null)
  const [showTrainingModal, setShowTrainingModal] = useState(false)
  const [showRaceSimulation, setShowRaceSimulation] = useState(false)
  const [selectedCarSpeed, setSelectedCarSpeed] = useState(null)
  const [garageKey, setGarageKey] = useState(0) // Key to force garage reload
  const { trainingCount, lastRace, raceStatus, error, lastSpeedTest, carId, train, testSpeed, enterRace } = useRacing(wallet?.address, wallet?.seed, signer)

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
    // Trigger backend training flow which handles 1 XRP payment via blockchain
    const result = await train(selectedCarId, attributeIndices)
    
    if (result.success) {
      // HACKATHON DEMO: Manually deduct balance for UI feedback
      if (onBalanceUpdate) {
        const newBalance = (parseFloat(balance) - 1).toFixed(2)
        onBalanceUpdate(newBalance)
      }
      
      // Update selected car to the new car created from training
      if (result.newCarId) {
        setSelectedCarId(result.newCarId)
      }
      
      // Force garage to reload to show new car
      setGarageKey(prev => prev + 1)
      
      // Close modal
      setShowTrainingModal(false)
    }
  }

  const handleTestSpeed = async () => {
    if (!selectedCarId) {
      alert('Please select a car from your garage first')
      return
    }
    // Test speed - displays actual speed value
    const result = await testSpeed(selectedCarId)
    
    if (result.success && result.message) {
      // Show speed test result
      alert(`🏁 Speed Test Result\n\n${result.message}`)
    }
  }

  const handleRace = async () => {
    if (!selectedCarId) {
      alert('Please select a car from your garage first')
      return
    }
    
    // Get car speed for simulation (use lastSpeedTest or default)
    const carSpeed = lastSpeedTest?.speed || 3.0
    setSelectedCarSpeed(carSpeed)
    
    // Show 3D simulation
    setShowRaceSimulation(true)
  }
  
  const handleRaceSimulationFinish = async (simulationResults) => {
    // Call the actual backend race endpoint
    const result = await enterRace(selectedCarId)
    
    // Close simulation
    setShowRaceSimulation(false)
    
    // HACKATHON DEMO: Manually update balance for UI feedback
    if (result.success && onBalanceUpdate) {
      let newBalance = parseFloat(balance) - 1 // Deduct 1 XRP entry fee
      
      // If player won, add 100 XRP prize
      if (result.race && result.race.prizeAwarded) {
        newBalance += 100
        alert('🎉 Congratulations! You won 100 XRP!')
      } else {
        alert(`Race finished! You placed #${simulationResults.playerRank}`)
      }
      
      onBalanceUpdate(newBalance.toFixed(2))
    }
  }

  const handleCarCreated = (car) => {
    setSelectedCarId(car.car_id)
    // Force garage reload
    setGarageKey(prev => prev + 1)
  }

  const handleCarSelected = (carId, carData) => {
    setSelectedCarId(carId)
    // Store car speed for simulation
    if (carData?.speed) {
      setSelectedCarSpeed(carData.speed)
    }
  }
  
  return (
    <div className="space-y-8">
      {/* Title Section */}
      <div className="text-center">
        <h1 className="text-4xl font-bold bg-gradient-to-r from-orange-600 via-red-600 to-amber-600 bg-clip-text text-transparent mb-4">
          🏎️ Garage Dashboard
        </h1>
        <p className="text-gray-600">Train your car, test performance, and compete in races</p>
      </div>

      <WalletCard
        wallet={wallet}
        balance={balance}
        onRefresh={onRefreshBalance}
        connectionType={connectionType}
      />

      {/* Garage Section */}
      <Garage 
        key={garageKey}
        walletAddress={wallet?.address}
        balance={balance}
        wallet={wallet}
        onCarCreated={handleCarCreated}
        onBalanceChange={onBalanceUpdate}
        onCarSelected={handleCarSelected}
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
      
      {/* 3D Race Simulation */}
      <RaceSimulation3D
        isOpen={showRaceSimulation}
        onClose={() => setShowRaceSimulation(false)}
        playerCar={{
          id: selectedCarId || carId,
          speed: selectedCarSpeed || lastSpeedTest?.speed || 3.0,
        }}
        onRaceFinish={handleRaceSimulationFinish}
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
  connectionType: PropTypes.string,
  onRefreshBalance: PropTypes.func.isRequired,
  onBalanceUpdate: PropTypes.func,
  signer: PropTypes.func,
}

export default Dashboard