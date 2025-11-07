import PropTypes from 'prop-types'
import WalletCard from './WalletCard'
import ActionsPanel from './ActionsPanel'
import TransactionHistory from './TransactionHistory'

const Dashboard = ({
  wallet,
  balance,
  loading,
  txResult,
  transactions,
  activeTab,
  onRefreshBalance,
  onSendPayment,
  onResetWallet
}) => {
  return (
    <div className="space-y-8">
      <WalletCard
        wallet={wallet}
        balance={balance}
        onRefresh={onRefreshBalance}
      />

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
  onResetWallet: PropTypes.func.isRequired
}

export default Dashboard