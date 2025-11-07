import PropTypes from 'prop-types'
import ActionButton from './ActionButton'

/**
 * RaceControls
 * Provides Train Car and Enter Race buttons.
 */
const RaceControls = ({ onTrain, onRace, disabled, loading }) => {
  return (
    <div className="bg-white/70 backdrop-blur rounded-2xl p-6 border border-purple-100 shadow-md">
      <h3 className="text-xl font-bold mb-4">🎮 Controls</h3>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <ActionButton onClick={onTrain} disabled={disabled || loading} loading={loading} variant="primary">
          <div className="text-center">
            <div className="text-2xl mb-1">🛠️</div>
            <div className="font-semibold">Train Car</div>
            <div className="text-[10px] mt-1 opacity-70">Costs 1 XPF • Random ±&lt;20 adjustments</div>
          </div>
        </ActionButton>
        <ActionButton onClick={onRace} disabled={disabled || loading} loading={loading} variant="secondary">
          <div className="text-center">
            <div className="text-2xl mb-1">🏁</div>
            <div className="font-semibold">Enter Race</div>
            <div className="text-[10px] mt-1 opacity-70">Costs 1 XPF • Winner gets 100 XPF</div>
          </div>
        </ActionButton>
      </div>
      <p className="mt-4 text-xs text-gray-500">Transactions are signed locally and validated on-chain via backend.</p>
    </div>
  )
}

RaceControls.propTypes = {
  onTrain: PropTypes.func.isRequired,
  onRace: PropTypes.func.isRequired,
  disabled: PropTypes.bool,
  loading: PropTypes.bool,
}

export default RaceControls
