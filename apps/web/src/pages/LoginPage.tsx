import React, { useState } from 'react';
import { useAuth } from '../contexts/useAuth';
import { Link, useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import AuthLayout from '../components/layouts/AuthLayout';
import Button from '../components/common/Button';
import { Input } from '../components/common/Form';

const LoginPage: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      await login(email, password);
      toast.success('Login realizado com sucesso!');
      navigate('/dashboard');
    } catch {
      toast.error('Erro ao fazer login. Verifique suas credenciais.');
    } finally {
      setLoading(false);
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
      try {
        await login(cred.email, cred.password);
        toast.success(`Login como ${userType} realizado!`);
        navigate('/dashboard');
      } catch {
        toast.error('Erro ao fazer login automático.');
      }
    }
  };

  const loginIllustration = (
    <div className="tsf-auth-default-illustration">
      <div className="tsf-auth-illustration__content">
        <div className="tsf-auth-illustration__icon">
          <svg
            width="120"
            height="120"
            viewBox="0 0 120 120"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <circle cx="60" cy="60" r="50" fill="url(#login-gradient)" opacity="0.1" />
            <circle cx="60" cy="60" r="30" fill="url(#login-gradient)" opacity="0.2" />
            <path
              d="M45 60H75M60 45V75"
              stroke="url(#login-gradient)"
              strokeWidth="4"
              strokeLinecap="round"
            />
            <circle cx="60" cy="60" r="15" fill="url(#login-gradient)" />
            <defs>
              <linearGradient
                id="login-gradient"
                x1="0"
                y1="0"
                x2="120"
                y2="120"
                gradientUnits="userSpaceOnUse"
              >
                <stop stopColor="#764ba2" />
                <stop offset="1" stopColor="#f0b90b" />
              </linearGradient>
            </defs>
          </svg>
        </div>
        <h2 className="tsf-auth-illustration__title">
          Welcome Back
        </h2>
        <p className="tsf-auth-illustration__description">
          Access your tokenized fund portfolio and explore new investment opportunities in the decentralized finance ecosystem.
        </p>
      </div>
    </div>
  );

  return (
    <AuthLayout
      title="Sign In"
      subtitle="Access your TSF account and manage your tokenized investments"
      illustration={loginIllustration}
    >
      <form className="tsf-form-group" onSubmit={handleSubmit}>
        <Input
          id="email"
          type="email"
          label="Email Address"
          placeholder="Enter your email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          leftIcon={
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
              <path
                d="M2 4L8 8L14 4M2 4V12C2 12.5523 2.44772 13 3 13H13C13.5523 13 14 12.5523 14 12V4M2 4C2 3.44772 2.44772 3 3 3H13C13.5523 3 14 3.44772 14 4"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          }
        />

        <Input
          id="password"
          type="password"
          label="Password"
          placeholder="Enter your password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          leftIcon={
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
              <path
                d="M4 7V5C4 3.89543 4.89543 3 6 3H10C11.1046 3 12 3.89543 12 5V7M3 7H13C13.5523 7 14 7.44772 14 8V12C14 12.5523 13.5523 13 13 13H3C2.44772 13 2 12.5523 2 12V8C2 7.44772 2.44772 7 3 7Z"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          }
        />

        <Button
          type="submit"
          variant="primary"
          size="lg"
          loading={loading}
          className="w-full"
        >
          {loading ? 'Signing In...' : 'Sign In'}
        </Button>
      </form>

      {/* Quick Login Section */}
      <div className="tsf-form-group">
        <div style={{ 
          position: 'relative', 
          textAlign: 'center', 
          marginBottom: 'var(--spacing-lg)',
          padding: 'var(--spacing-md) 0'
        }}>
          <div style={{
            position: 'absolute',
            top: '50%',
            left: 0,
            right: 0,
            height: '1px',
            background: 'var(--border-color)'
          }}></div>
          <span style={{
            background: 'var(--background-card)',
            padding: '0 var(--spacing-md)',
            fontSize: 'var(--font-size-sm)',
            color: 'var(--text-muted)',
            position: 'relative'
          }}>
            Quick Demo Access
          </span>
        </div>

        <div className="tsf-form-row">
          <Button
            variant="outline"
            size="sm"
            onClick={() => quickLogin('consultor')}
            className="w-full"
          >
            Consultant
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => quickLogin('gestor')}
            className="w-full"
          >
            Fund Manager
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => quickLogin('investidor')}
            className="w-full"
          >
            Investor
          </Button>
        </div>
      </div>

      {/* Register Link */}
      <div style={{ textAlign: 'center', marginTop: 'var(--spacing-lg)' }}>
        <p style={{ 
          color: 'var(--text-secondary)', 
          fontSize: 'var(--font-size-sm)',
          margin: 0
        }}>
          Don't have an account?{' '}
          <Link
            to="/register"
            style={{
              color: 'var(--highlight)',
              textDecoration: 'none',
              fontWeight: 'var(--font-weight-medium)'
            }}
          >
            Sign Up
          </Link>
        </p>
      </div>
    </AuthLayout>
  );
};

export default LoginPage;