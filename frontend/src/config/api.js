/**
 * API service for XRP backend communication
 */
import { API_CONFIG } from './constants'

class ApiService {
  constructor() {
    this.baseUrl = API_CONFIG.baseUrl
    this.timeout = API_CONFIG.timeout
  }

  async request(endpoint, options = {}) {
    const url = `${this.baseUrl}${endpoint}`
    const config = {
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
      ...options,
    }

    try {
      const controller = new AbortController()
      const timeoutId = setTimeout(() => controller.abort(), this.timeout)

      const response = await fetch(url, {
        ...config,
        signal: controller.signal,
      })

      clearTimeout(timeoutId)

      if (!response.ok) {
        const error = await response.json().catch(() => ({}))
        throw new Error(error.detail || `HTTP ${response.status}: ${response.statusText}`)
      }

      return await response.json()
    } catch (error) {
      if (error.name === 'AbortError') {
        throw new Error('Request timeout')
      }
      throw error
    }
  }

  async get(endpoint) {
    return this.request(endpoint, { method: 'GET' })
  }

  async post(endpoint, data) {
    return this.request(endpoint, {
      method: 'POST',
      body: JSON.stringify(data),
    })
  }

  // Wallet endpoints
  async createWallet(seed = '') {
    return this.post('/wallet/create', { seed })
  }

  async getBalance(address) {
    return this.get(`/wallet/${address}/balance`)
  }

  async getAccountInfo(address) {
    return this.get(`/wallet/${address}/info`)
  }

  // Payment endpoints
  async sendPayment(senderSeed, destination, amount) {
    return this.post('/payment', {
      sender_seed: senderSeed,
      destination,
      amount,
    })
  }

  async getTransactionHistory(address, limit = 10) {
    return this.get(`/payment/${address}/history?limit=${limit}`)
  }

  // Health check
  async healthCheck() {
    return this.get('/health')
  }
}

export const apiService = new ApiService()
export default apiService
