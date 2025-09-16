import React, { useState } from 'react';
import { useAuth } from '../contexts/useAuth';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  EnvelopeIcon, 
  LockClosedIcon, 
  ArrowLeftIcon
} from '@heroicons/react/24/outline';
import toast from 'react-hot-toast';
import { AuthLayout } from '../components/layouts/AuthLayout';
import { Button, WalletConnectButton } from '../components/common/Button';
import { Input } from '../components/common/Form';
import { GlassCard } from '../components/common/Card';
import { UserRole, type UserRoleType } from '../types';

const LoginPage: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [loginMethod, setLoginMethod] = useState<'email' | 'wallet'>('email');
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  
  // Get role from navigation state or localStorage
  const selectedRole = (location.state as { role?: UserRoleType })?.role || localStorage.getItem('selectedRole') as UserRoleType;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (loginMethod === 'email') {
      setLoading(true);
      try {
        await login(email, password);
        toast.success('Login successful!');
        navigate('/dashboard');
      } catch {
        toast.error('Login failed. Please check your credentials.');
      } finally {
        setLoading(false);
      }
    }
  };

  const handleWalletConnect = async () => {
    try {
      // Implementation for wallet connection
      toast.success('Wallet connected successfully!');
      navigate('/dashboard');
    } catch {
      toast.error('Failed to connect wallet.');
    }
  };

  const quickLogin = async (userType: string) => {
    const credentials = {
      consultor: { email: 'consultor@vero.com', password: '123456' },
      gestor: { email: 'gestor@vero.com', password: '123456' },
      investidor: { email: 'investidor@vero.com', password: '123456' }
    };

    const cred = credentials[userType as keyof typeof credentials];
    if (cred) {
      setEmail(cred.email);
      setPassword(cred.password);
      
      setLoading(true);
      try {
        await login(cred.email, cred.password);
        toast.success(`Quick login as ${userType}!`);
        navigate('/dashboard');
      } catch {
        toast.error('Quick login failed.');
      } finally {
        setLoading(false);
      }
    }
  };

  const getRoleDisplayName = (role: UserRoleType) => {
    switch (role) {
      case UserRole.INVESTOR:
        return 'Investor';
      case UserRole.FUND_MANAGER:
        return 'Fund Manager';
      case UserRole.CONSULTANT:
        return 'Consultant';
      default:
        return '';
    }
  };

  return (
    <AuthLayout
      title="Welcome Back"
      subtitle={selectedRole ? `Continue as ${getRoleDisplayName(selectedRole)}` : 'Sign in to your account'}
    >
      {/* Back to Role Selection */}
      <div className="mb-6">
        <Link
          to="/select-role"
          className="inline-flex items-center text-white/60 hover:text-white transition-colors text-sm"
        >
          <ArrowLeftIcon className="w-4 h-4 mr-2" />
          Change Role
        </Link>
      </div>

      {/* Login Method Toggle */}
      <div className="mb-8">
        <div className="grid grid-cols-2 gap-2 p-1 bg-white/5 rounded-xl">
          <button
            onClick={() => setLoginMethod('email')}
            className={`
              py-3 px-4 rounded-lg font-medium transition-all duration-200
              ${loginMethod === 'email' 
                ? 'bg-white/10 text-white' 
                : 'text-white/60 hover:text-white/80'
              }
            `}
          >
            Email & Password
          </button>
          <button
            onClick={() => setLoginMethod('wallet')}
            className={`
              py-3 px-4 rounded-lg font-medium transition-all duration-200
              ${loginMethod === 'wallet' 
                ? 'bg-white/10 text-white' 
                : 'text-white/60 hover:text-white/80'
              }
            `}
          >
            Stellar Wallet
          </button>
        </div>
      </div>

      {/* Email Login Form */}
      {loginMethod === 'email' && (
        <motion.form
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.3 }}
          onSubmit={handleSubmit}
          className="space-y-6"
        >
          <Input
            type="email"
            label="Email Address"
            placeholder="Enter your email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            icon={<EnvelopeIcon className="w-5 h-5" />}
            required
          />

          <Input
            type={showPassword ? 'text' : 'password'}
            label="Password"
            placeholder="Enter your password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            icon={<LockClosedIcon className="w-5 h-5" />}
            iconPosition="left"
            required
          />

          <div className="flex items-center justify-between">
            <label className="flex items-center">
              <input
                type="checkbox"
                checked={showPassword}
                onChange={(e) => setShowPassword(e.target.checked)}
                className="mr-2 rounded"
              />
              <span className="text-sm text-white/70">Show password</span>
            </label>
            <Link
              to="/forgot-password"
              className="text-sm text-white/70 hover:text-white transition-colors"
            >
              Forgot password?
            </Link>
          </div>

          <Button
            type="submit"
            size="lg"
            loading={loading}
            className="w-full"
          >
            Sign In
          </Button>
        </motion.form>
      )}

      {/* Wallet Login */}
      {loginMethod === 'wallet' && (
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.3 }}
          className="space-y-6"
        >
          <GlassCard className="p-6 text-center">
            <h3 className="text-lg font-semibold text-white mb-4">
              Connect Your Stellar Wallet
            </h3>
            <p className="text-white/70 mb-6">
              Use Freighter or other Stellar-compatible wallets to sign in securely.
            </p>
            
            <WalletConnectButton
              isConnected={false}
              isConnecting={loading}
              network="testnet"
              onConnect={handleWalletConnect}
              onDisconnect={() => {}}
              className="w-full justify-center"
            />
          </GlassCard>

          <div className="text-center">
            <p className="text-white/60 text-sm">
              Don't have a Stellar wallet?{' '}
              <a
                href="https://freighter.app/"
                target="_blank"
                rel="noopener noreferrer"
                className="text-white hover:text-white/80 underline"
              >
                Get Freighter
              </a>
            </p>
          </div>
        </motion.div>
      )}

      {/* Divider */}
      <div className="my-8">
        <div className="relative">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-white/10" />
          </div>
          <div className="relative flex justify-center text-sm">
            <span className="px-2 bg-transparent text-white/60">or</span>
          </div>
        </div>
      </div>

      {/* Quick Login for Development */}
      <div className="space-y-4">
        <h3 className="text-sm font-medium text-white/80 text-center">
          Quick Login (Development)
        </h3>
        <div className="grid grid-cols-3 gap-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => quickLogin('investidor')}
            className="text-xs"
          >
            Investor
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => quickLogin('gestor')}
            className="text-xs"
          >
            Manager
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => quickLogin('consultor')}
            className="text-xs"
          >
            Consultant
          </Button>
        </div>
      </div>

      {/* Sign Up Link */}
      <div className="mt-8 text-center">
        <p className="text-white/60">
          Don't have an account?{' '}
          <Link
            to="/register"
            state={{ role: selectedRole }}
            className="text-white font-medium hover:text-white/80 transition-colors"
          >
            Sign up
          </Link>
        </p>
      </div>
    </AuthLayout>
  );
};

export default LoginPage;