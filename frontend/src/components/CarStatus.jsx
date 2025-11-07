import PropTypes from 'prop-types'

/**
 * CarStatus
 * Displays abstract car progression info without exposing secret flags or formula.
 */
const CarStatus = ({ trainingCount, raceStatus }) => {
  return (
    <div className="bg-white/70 backdrop-blur rounded-2xl p-6 border border-fuchsia-100 shadow-md">
      <h3 className="text-xl font-bold mb-3">🏎️ Car Status</h3>
      <ul className="space-y-2 text-sm">
        <li><span className="font-semibold">Trainings:</span> {trainingCount}</li>
        <li><span className="font-semibold">Speed Score:</span> <span className="italic text-gray-500">??? (secret)</span></li>
        <li><span className="font-semibold">State:</span> {raceStatus}</li>
      </ul>
      <p className="mt-4 text-xs text-gray-500">Flags and speed formula are secretly maintained server-side for fairness.</p>
    </div>
  )
}

CarStatus.propTypes = {
  trainingCount: PropTypes.number.isRequired,
  raceStatus: PropTypes.string.isRequired,
}

export default CarStatus
