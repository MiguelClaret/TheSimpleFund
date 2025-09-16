# TSF (The Simple Fund) - Frontend

## Overview

TSF is a modern web application for tokenizing funds on the Stellar blockchain. The frontend is built with React, TypeScript, and follows a comprehensive design system with glassmorphism effects and smooth animations.

## 🎨 Design System

### Visual Identity
- **Primary Gradient**: `linear-gradient(135deg, #667eea 0%, #764ba2 50%, #1e3c72 100%)`
- **Glass Effects**: Backdrop blur with transparency layers
- **Typography**: Inter font family with bold, clean styling
- **Animation**: Framer Motion with smooth transitions

### Color Palette
```css
--primary-gradient: linear-gradient(135deg, #667eea 0%, #764ba2 50%, #1e3c72 100%);
--card-bg: rgba(255, 255, 255, 0.05);
--card-border: rgba(255, 255, 255, 0.1);
--text-primary: #FFFFFF;
--text-secondary: rgba(255, 255, 255, 0.8);
--button-primary: rgba(255, 255, 255, 0.95);
```

## 🏗️ Architecture

### Folder Structure
```
src/
├── components/
│   ├── common/
│   │   ├── Button/
│   │   ├── Card/
│   │   ├── Form/
│   │   └── Navigation/
│   ├── layouts/
│   │   ├── AuthLayout/
│   │   └── DashboardLayout/
│   └── features/
│       ├── auth/
│       ├── investor/
│       ├── fundManager/
│       └── consultant/
├── pages/
├── hooks/
├── services/
├── utils/
├── types/
└── styles/
```

## 🚀 Features

### User Flows

#### 1. Landing Page (`/`)
- Hero section with TSF branding
- Benefits showcase with glassmorphism cards
- Strategy section with video preview
- Feature highlights
- Call-to-action sections

#### 2. Role Selection (`/select-role`)
- Three role options: Investor, Fund Manager, Consultant
- Animated card selection with hover effects
- Role-specific descriptions
- Smooth navigation flow

#### 3. Authentication (`/login`, `/register`)
- Dual authentication: Email/Password + Stellar Wallet
- Modern glassmorphism design
- Freighter wallet integration
- Role-specific registration flows
- Quick login for development

#### 4. Dashboard (Role-based)
- Investor Dashboard: Portfolio overview, fund discovery
- Fund Manager Dashboard: Fund management, token issuance
- Consultant Dashboard: KYC approvals, client management

### Components

#### Core Components
- **GlassCard**: Reusable card with glassmorphism effect
- **RoleSelectionCard**: Specialized role selection with animations
- **NavigationHeader**: Responsive navigation with mobile menu
- **Button**: Multiple variants (primary, secondary, ghost)
- **WalletConnectButton**: Stellar wallet integration
- **Input**: Styled form inputs with icons and validation

#### Layout Components
- **AuthLayout**: Authentication pages layout
- **DashboardLayout**: Role-based dashboard layout
- **MainLayout**: General application layout

## 🔧 Technologies

- **React 19**: Latest React with modern features
- **TypeScript**: Type-safe development
- **Vite**: Fast build tool and dev server
- **Tailwind CSS**: Utility-first CSS framework
- **Framer Motion**: Smooth animations and transitions
- **React Router**: Client-side routing
- **React Hot Toast**: Modern notifications
- **Heroicons**: Beautiful SVG icons

## 🌟 Stellar Integration

### Wallet Connection
- Freighter wallet support
- Network switching (Testnet/Mainnet)
- Balance checking
- Transaction signing

### Services
- `stellarService`: Core Stellar blockchain interactions
- Account management
- Asset handling
- Transaction processing

## 🎯 User Roles

### Investor
- Discover and invest in tokenized funds
- Portfolio management
- Transaction history
- Distribution tracking

### Fund Manager
- Create and manage funds
- Token issuance
- Distribution execution
- Investor management

### Consultant
- KYC approval workflows
- Client onboarding
- Document management
- Compliance oversight

## 🚀 Getting Started

### Prerequisites
- Node.js 18+
- npm or yarn
- Freighter wallet (for Stellar integration)

### Installation
```bash
cd apps/web
npm install
npm run dev
```

### Build
```bash
npm run build
```

## 🔐 Environment Variables

```env
VITE_STELLAR_NETWORK=testnet
VITE_API_BASE_URL=http://localhost:3000
```

## 📱 Responsive Design

- **Mobile**: 320px - 768px (bottom navigation)
- **Tablet**: 768px - 1024px (collapsed sidebar)
- **Desktop**: 1024px+ (full sidebar)

## 🎨 Animation Guidelines

- **Duration**: 0.3s for interactions, 0.6s for page transitions
- **Easing**: `cubic-bezier(0.4, 0, 0.2, 1)` for smooth motion
- **Hover Effects**: Scale 1.02 for buttons, translateY(-2px) for cards
- **Loading States**: Smooth spinners with backdrop blur

## 🧪 Development Notes

### Quick Login Credentials
- **Investor**: `investidor@vero.com` / `123456`
- **Fund Manager**: `gestor@vero.com` / `123456`
- **Consultant**: `consultor@vero.com` / `123456`

### Testing
- Use Testnet for development
- Freighter wallet required for full functionality
- API integration with backend services

## 📦 Build Output

The application builds to a production-ready bundle:
- **CSS**: ~40KB (gzipped ~8KB)
- **JS**: ~467KB (gzipped ~142KB)
- **Assets**: Optimized images and fonts

## 🎯 Future Enhancements

- [ ] PWA capabilities
- [ ] Offline caching
- [ ] Push notifications
- [ ] Multi-language support
- [ ] Advanced trading features
- [ ] Real-time updates via WebSocket