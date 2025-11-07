import PropTypes from 'prop-types'

/**
 * RaceResults
 * Shows redacted race outcomes without revealing computation details.
 */
const RaceResults = ({ race, playerAddress }) => {
  if (!race) return null

  const youWon = race?.winner === playerAddress
  const yourRank = race?.yourRank ?? '?'

  return (
    <div className={`rounded-2xl p-6 border shadow-md ${youWon ? 'bg-green-50 border-green-200' : 'bg-white/70 border-rose-100'}`}>
      <h3 className="text-xl font-bold mb-2">🏆 Race Results</h3>
      <div className="text-sm space-y-1">
        <p><span className="font-semibold">Race ID:</span> {race?.id || '—'}</p>
        <p><span className="font-semibold">Participants:</span> {race?.participants ?? '—'}</p>
        <p><span className="font-semibold">Winner:</span> {race?.winner?.slice(0, 6)}...{race?.winner?.slice(-4)}</p>
        <p><span className="font-semibold">Your Rank:</span> {yourRank}</p>
        {race?.prizeAwarded && (
          <p className="text-emerald-700 font-semibold">Prize: 100 XPF awarded</p>
        )}
      </div>
      <p className="mt-3 text-xs text-gray-500">Speed weights and flags remain secret. Only final standings are shown.</p>
    </div>
  )
}

RaceResults.propTypes = {
  race: PropTypes.shape({
    id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    participants: PropTypes.number,
    winner: PropTypes.string,
    yourRank: PropTypes.number,
    prizeAwarded: PropTypes.bool,
  }),
  playerAddress: PropTypes.string,
}

export default RaceResults
