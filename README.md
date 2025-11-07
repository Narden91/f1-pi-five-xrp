# XRP Hackathon Platform

A professional full-stack application platform for XRP Ledger projects, featuring advanced wallet management, real-time balance tracking, and seamless XRP payments on the testnet. Built with modern technologies and optimized for hackathons.

## ✨ Features

### Wallet Management
- **Create New Wallets**: Generate new XRP wallets with automatic testnet funding
- **Import Existing Wallets**: Import wallets using seed phrases
- **Secure Storage**: Cryptographically secure wallet operations
- **Balance Tracking**: Real-time XRP balance monitoring with auto-refresh

### Payment Operations
- **Custom Payments**: Send XRP with custom amounts to any address
- **Quick Payments**: Pre-configured quick payment options
- **Transaction History**: Track all your payments with detailed status
- **Transaction Validation**: Real-time transaction result feedback

### Professional UI/UX
- **Modern Design**: Beautiful gradient-based interface with glass morphism effects
- **Responsive Layout**: Mobile-first design that works on all devices
- **Smooth Animations**: CSS animations and transitions throughout
- **Interactive Components**: Toast notifications, modals, and loading states
- **Copy-to-Clipboard**: Quick copy buttons for addresses and seeds
- **Network Status**: Live network connectivity indicator

### Developer Features
- **Modular Architecture**: Clean separation of concerns (services, routes, models)
- **Type Safety**: PropTypes validation in React components
- **Error Handling**: Comprehensive error handling and logging
- **API Documentation**: Auto-generated Swagger/OpenAPI docs
- **Environment Config**: Easy configuration via .env files
- **Docker Support**: Fully containerized development environment

## 🛠 Tech Stack

### Backend
- **Framework**: Python FastAPI
- **XRP Library**: xrpl-py 2.6.0
- **Validation**: Pydantic models
- **Server**: Uvicorn with hot reload

### Frontend
- **Framework**: React 19 + Vite
- **Styling**: TailwindCSS 4 with custom animations
- **XRP Library**: xrpl.js 4.4.2
- **Build Tool**: Vite 7 for lightning-fast HMR

### Infrastructure
- **Containerization**: Docker + Docker Compose
- **Development**: Hot reload for both frontend and backend

## 📋 Prerequisites

- Docker and Docker Compose
- Node.js 18+ (for manual frontend setup)
- Python 3.8+ (for manual backend setup)

## 🚀 Quick Start

### With Docker (Recommended)

```bash
docker-compose up
```

Access the application:
- **Frontend**: http://localhost:5173
- **Backend API**: http://localhost:8000
- **API Documentation**: http://localhost:8000/docs
- **Alternative API Docs**: http://localhost:8000/redoc

### Manual Setup

#### Backend
```bash
cd backend
pip install -r requirements.txt
uvicorn main:app --reload --host 0.0.0.0 --port 8000
```

#### Frontend
```bash
cd frontend
npm install
npm run dev
```

## 📡 API Endpoints

### Wallet Operations
- `POST /wallet/create` - Create new wallet or import from seed
- `GET /wallet/{address}/balance` - Get wallet XRP balance
- `GET /wallet/{address}/info` - Get detailed account information

### Payment Operations
- `POST /payment` - Send XRP payment
- `GET /payment/{address}/history` - Get transaction history

### System
- `GET /` - API information
- `GET /health` - Health check with testnet connectivity status
- `GET /docs` - Interactive API documentation (Swagger UI)
- `GET /redoc` - Alternative API documentation (ReDoc)

## 🧪 Testing

### Using Postman
Import the collection from `postman/XRP_Hackathon_API.postman_collection.json`

### Using the UI
1. Visit http://localhost:5173
2. Click "Create New Wallet" to generate a funded testnet wallet
3. Use the dashboard to send payments and track transactions
4. Try the "Send Payment" modal for custom amounts

### Using cURL
```bash
# Create wallet
curl -X POST http://localhost:8000/wallet/create \
  -H "Content-Type: application/json" \
  -d '{"seed": ""}'

# Get balance
curl http://localhost:8000/wallet/{address}/balance

# Health check
curl http://localhost:8000/health
```

## 📁 Project Structure

```
├── backend/                 # FastAPI backend
│   ├── main.py             # Application entry point
│   ├── config.py           # Configuration settings
│   ├── models.py           # Pydantic models
│   ├── routes/             # API route modules
│   │   ├── wallet.py       # Wallet endpoints
│   │   ├── payment.py      # Payment endpoints
│   │   └── health.py       # Health check endpoints
│   ├── services/           # Business logic
│   │   ├── wallet_service.py
│   │   └── payment_service.py
│   └── requirements.txt    # Python dependencies
├── frontend/               # React frontend
│   ├── src/
│   │   ├── components/     # React components
│   │   ├── hooks/          # Custom React hooks
│   │   ├── utils/          # Utility functions
│   │   ├── config/         # Configuration & API client
│   │   ├── App.jsx         # Main App component
│   │   └── index.css       # Global styles with animations
│   └── package.json        # Node dependencies
├── postman/                # API test collection
└── docker-compose.yml      # Docker configuration
```

## 🎨 UI Components

- **Header**: Sticky navigation with network status
- **Footer**: Rich footer with links and branding
- **WalletCard**: Display wallet info with copy-to-clipboard
- **ActionsPanel**: Quick actions for payments and wallet management
- **PaymentModal**: Custom payment form with validation
- **WalletImportModal**: Import existing wallets securely
- **TransactionHistory**: Beautiful transaction list
- **Toast**: Notification system for user feedback
- **Modal**: Reusable modal component
- **Spinner**: Loading indicators
- **NetworkStatus**: Live connection status

## 🔒 Security Notes

- This is a **TESTNET** environment - never use real funds
- Seeds are displayed for development purposes only
- In production, never expose wallet seeds in the UI
- Always use environment variables for sensitive configuration

## 🌐 Network Information

- **Network**: XRP Ledger Testnet
- **WSS Endpoint**: wss://s.altnet.rippletest.net:51233
- **RPC Endpoint**: https://s.altnet.rippletest.net:51234/

## 🤝 Contributing

This is a hackathon starter template. Feel free to:
- Add new features
- Improve the UI/UX
- Optimize performance
- Add tests
- Enhance documentation

## 📝 License

Open source - feel free to use for your hackathon projects!

## 🏆 Built For Hackathons

This platform is designed to help you:
- Quickly bootstrap XRP Ledger projects
- Focus on building unique features
- Have a professional-looking demo
- Understand XRP Ledger integration patterns
- Deploy and demo with confidence

## 💡 Tips for Hackathon Success

1. **Customize the UI**: Make it match your project's branding
2. **Extend the API**: Add endpoints for your specific use case
3. **Add Features**: Build on top of this foundation
4. **Document Well**: Update the README with your changes
5. **Test Thoroughly**: Use the testnet extensively before demoing

---

**Good luck with your hackathon! 🚀**
