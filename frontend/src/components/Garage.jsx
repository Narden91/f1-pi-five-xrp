import PropTypes from 'prop-types'
import { useState, useEffect } from 'react'
import api from '../config/api'

const Garage = ({ walletAddress, balance, onCarCreated }) => {
  const [cars, setCars] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [selectedCar, setSelectedCar] = useState(null)

  useEffect(() => {
    const loadGarage = async () => {
      if (!walletAddress) return
      
      try {
        const data = await api.getGarage(walletAddress)
        setCars(data.cars || [])
        
        // Auto-select first car if none selected
        if (data.cars?.length > 0 && !selectedCar) {
          setSelectedCar(data.cars[0].car_id)
        }
      } catch (err) {
        console.error('Error loading garage:', err)
        setError('Failed to load garage')
      }
    }

    loadGarage()
  }, [walletAddress, selectedCar])

  const loadGarage = async () => {
    if (!walletAddress) return
    
    try {
      const data = await api.getGarage(walletAddress)
      setCars(data.cars || [])
    } catch (err) {
      console.error('Error loading garage:', err)
      setError('Failed to load garage')
    }
  }

  const handleCreateCar = async () => {
    if (!walletAddress) {
      setError('No wallet connected')
      return
    }

    // Check balance
    const balanceNum = parseFloat(balance || '0')
    if (balanceNum < 10) {
      setError('Insufficient balance. You need at least 10 XRP to create a car.')
      return
    }

    setLoading(true)
    setError(null)

    try {
      // Call backend to create car (backend will expect payment validation)
      const result = await api.createCar(walletAddress)
      
      if (result.car_id) {
        await loadGarage()
        setSelectedCar(result.car_id)
        
        if (onCarCreated) {
          onCarCreated(result)
        }
      }
    } catch (err) {
      console.error('Error creating car:', err)
      setError(err.message || 'Failed to create car')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="bg-gradient-to-br from-orange-50 to-amber-50 backdrop-blur rounded-3xl p-8 border-2 border-orange-200 shadow-xl">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-3xl font-bold bg-gradient-to-r from-orange-600 to-red-600 bg-clip-text text-transparent flex items-center gap-3">
          🏎️ My Garage
        </h2>
        <button
          onClick={handleCreateCar}
          disabled={loading || parseFloat(balance || '0') < 10}
          className="bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white px-6 py-3 rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
        >
          {loading ? (
            <div className="flex items-center gap-2">
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
              Creating...
            </div>
          ) : (
            <>➕ Create New Car (10 XRP)</>
          )}
        </button>
      </div>

      {error && (
        <div className="mb-4 p-4 bg-red-100 border-2 border-red-300 rounded-xl text-red-800">
          ⚠️ {error}
        </div>
      )}

      {cars.length === 0 ? (
        <div className="text-center py-16">
          <div className="text-6xl mb-4">🏎️</div>
          <p className="text-xl text-gray-600 mb-2">Your garage is empty</p>
          <p className="text-sm text-gray-500 mb-6">
            Create your first car to start racing! Each car has 10 hidden performance flags.
          </p>
          <p className="text-xs text-orange-600 italic">
            Cost: 10 XRP per car
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {cars.map((car) => (
            <div
              key={car.car_id}
              onClick={() => setSelectedCar(car.car_id)}
              className={`cursor-pointer transition-all duration-300 rounded-xl p-6 border-2 ${
                selectedCar === car.car_id
                  ? 'bg-gradient-to-br from-orange-100 to-red-100 border-orange-500 shadow-lg scale-105'
                  : 'bg-white/60 border-orange-200 hover:border-orange-400 hover:shadow-md'
              }`}
            >
              <div className="text-center">
                <div className="text-4xl mb-3">🏎️</div>
                <h3 className="font-bold text-lg text-gray-800 mb-2 font-mono">
                  {car.car_id}
                </h3>
                <div className="space-y-1 text-sm">
                  <p className="text-gray-600">
                    <span className="font-semibold">Training:</span> {car.training_count}x
                  </p>
                  <p className="text-gray-600">
                    <span className="font-semibold">Created:</span>{' '}
                    {new Date(car.created_at).toLocaleDateString()}
                  </p>
                  {car.last_trained && (
                    <p className="text-gray-600">
                      <span className="font-semibold">Last trained:</span>{' '}
                      {new Date(car.last_trained).toLocaleDateString()}
                    </p>
                  )}
                </div>
                {selectedCar === car.car_id && (
                  <div className="mt-3 px-3 py-1 bg-orange-500 text-white rounded-full text-xs font-semibold">
                    Selected
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {cars.length > 0 && (
        <div className="mt-6 p-4 bg-yellow-50 border-2 border-yellow-300 rounded-xl">
          <p className="text-sm text-yellow-800 italic">
            💡 Each car has 10 hidden performance flags that affect its speed. Train your car to improve these flags randomly (±20 points each training session).
          </p>
        </div>
      )}
    </div>
  )
}

Garage.propTypes = {
  walletAddress: PropTypes.string,
  balance: PropTypes.string,
  onCarCreated: PropTypes.func,
}

export default Garage
