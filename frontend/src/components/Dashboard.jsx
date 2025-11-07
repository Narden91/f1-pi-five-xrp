import PropTypes from 'prop-types'
import WalletCard from './WalletCard'
import ActionsPanel from './ActionsPanel'
import TransactionHistory from './TransactionHistory'
import CarStatus from './CarStatus'
import RaceControls from './RaceControls'
import RaceResults from './RaceResults'
import { useRacing } from '../hooks/useRacing'

const Dashboard = ({
  wallet,
  balance,
  loading,
  txResult,
  transactions,
  activeTab,
  onRefreshBalance,
  onSendPayment,
  onResetWallet,
  signer,
}) => {
  const { trainingCount, lastRace, raceStatus, error, lastSpeedTest, carId, train, testSpeed, enterRace } = useRacing(wallet?.address, signer)

  const handleTrain = async () => {
    // Trigger backend training flow which should handle 1 XPF validation
    await train()
  }

  const handleTestSpeed = async () => {
    // Test speed - no payment, just qualitative feedback
    await testSpeed()
  }

  const handleRace = async () => {
    await enterRace()
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

      {/* Racing Game Panel */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-1">
          <CarStatus 
            trainingCount={trainingCount} 
            raceStatus={raceStatus}
            carId={carId}
            lastSpeedTest={lastSpeedTest}
          />
        </div>
        <div className="lg:col-span-1">
          <RaceControls 
            onTrain={handleTrain}
            onTestSpeed={handleTestSpeed}
            onRace={handleRace} 
            disabled={!wallet} 
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

      <ActionsPanel
        onSendPayment={onSendPayment}
        onResetWallet={onResetWallet}
        loading={loading}
        txResult={txResult}
      />

      {activeTab === 'transactions' && (
        <TransactionHistory transactions={transactions} />
      )}
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
  txResult: PropTypes.string,
  transactions: PropTypes.array.isRequired,
  activeTab: PropTypes.string.isRequired,
  onRefreshBalance: PropTypes.func.isRequired,
  onSendPayment: PropTypes.func.isRequired,
  onResetWallet: PropTypes.func.isRequired,
  signer: PropTypes.func,
}

export default Dashboard