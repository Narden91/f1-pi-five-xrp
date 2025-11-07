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
  const { trainingCount, lastRace, raceStatus, error, train, enterRace } = useRacing(wallet?.address, signer)

  const handleTrain = async () => {
    // Trigger backend training flow which should handle 1 XPF validation
    await train()
  }

  const handleRace = async () => {
    await enterRace()
  }
  return (
    <div className="space-y-8">
      <WalletCard
        wallet={wallet}
        balance={balance}
        onRefresh={onRefreshBalance}
      />

      {/* Racing Game Panel */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-1">
          <CarStatus trainingCount={trainingCount} raceStatus={raceStatus} />
        </div>
        <div className="lg:col-span-1">
          <RaceControls onTrain={handleTrain} onRace={handleRace} disabled={!wallet} loading={loading || raceStatus === 'training' || raceStatus === 'racing'} />
        </div>
        <div className="lg:col-span-1">
          <RaceResults race={lastRace} playerAddress={wallet?.address} />
        </div>
      </div>

      {error && (
        <div className="p-4 rounded-xl border bg-rose-50 border-rose-200 text-rose-800">
          {error}
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