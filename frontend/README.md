# XRP Ledger Platform - Frontend

A modern, modular React application for XRP Ledger wallet management and transactions.

## Features

- **Modular Architecture**: Component-based structure with custom hooks
- **XRP Ledger Integration**: Full wallet creation, balance checking, and payment functionality
- **Responsive Design**: Mobile-first design with TailwindCSS
- **Real-time Updates**: Auto-refreshing balance and transaction status
- **Type Safety**: PropTypes validation for component props

## Project Structure

```
src/
├── components/          # Reusable UI components
│   ├── Header.jsx      # Navigation header
│   ├── LandingPage.jsx # Welcome page
│   ├── Dashboard.jsx   # Main dashboard layout
│   ├── WalletCard.jsx  # Wallet information display
│   ├── ActionButton.jsx# Reusable button component
│   ├── ActionsPanel.jsx# Action buttons panel
│   ├── TransactionHistory.jsx # Transaction list
│   ├── Footer.jsx      # Footer component
│   └── index.js        # Component exports
├── hooks/              # Custom React hooks
│   ├── useWallet.js   # Wallet management logic
│   └── index.js       # Hook exports
├── utils/              # Utility functions
│   ├── xrpUtils.js    # XRP-related utilities
│   └── index.js       # Utility exports
├── App.jsx            # Main application component
└── main.jsx           # Application entry point
```

## Key Components

### Custom Hook: `useWallet`
Manages all wallet-related state and operations:
- Wallet creation and funding
- Balance checking and auto-refresh
- Payment processing
- Transaction history tracking

### Utility Functions
- `formatAddress()`: Format XRP addresses for display
- `formatBalance()`: Format XRP balances
- `createXRPClient()`: Create XRP Ledger client
- `isValidAddress()`: Validate XRP addresses

### Component Architecture
- **Separation of Concerns**: Each component has a single responsibility
- **Prop Validation**: All components use PropTypes for type checking
- **Reusability**: Components are designed to be reusable across the application
- **Composition**: Complex components are built from simpler ones

## Development

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build

# Run linting
npm run lint
```

## Technologies Used

- **React 19**: Latest React with hooks and concurrent features
- **Vite**: Fast build tool and development server
- **TailwindCSS**: Utility-first CSS framework
- **xrpl.js**: XRP Ledger JavaScript library
- **PropTypes**: Runtime type checking for React props

## Architecture Benefits

1. **Maintainability**: Modular structure makes code easier to maintain and extend
2. **Reusability**: Components and hooks can be reused across different parts of the app
3. **Testability**: Isolated components and hooks are easier to unit test
4. **Performance**: Custom hooks optimize re-renders and state management
5. **Scalability**: Structure supports easy addition of new features and components
