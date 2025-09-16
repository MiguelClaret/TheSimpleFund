import React, { useState } from 'react';
import { useAuth } from '../contexts/useAuth';
import { Link, useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import AuthLayout from '../components/layouts/AuthLayout';
import Button from '../components/common/Button';
import { Input } from '../components/common/Form';
import RoleSelectionCard from '../components/RoleSelectionCard';

const RegisterPage: React.FC = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    confirmPassword: '',
    name: '',
    userType: 'INVESTIDOR'
  });
  const [loading, setLoading] = useState(false);
  const [step, setStep] = useState<'role' | 'form'>('role');
  const { register } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (formData.password !== formData.confirmPassword) {
      toast.error('Passwords do not match');
      return;
    }

    setLoading(true);

    try {
      await register(formData.email, formData.password, formData.userType);
      toast.success('Registration successful! Please wait for admin approval to access the platform.');
      navigate('/dashboard');
    } catch {
      toast.error('Registration failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleRoleSelect = (role: string) => {
    setFormData({ ...formData, userType: role });
    setStep('form');
  };

  const roleOptions = [
    {
      role: 'investor' as const,
      icon: (
        <svg width="32" height="32" viewBox="0 0 32 32" fill="none">
          <path
            d="M8 24L12 20L16 24L20 16L24 20"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <path
            d="M4 4V28H28"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      ),
      title: 'Investor',
      description: 'Invest in tokenized funds and build your decentralized portfolio',
      features: [
        'Access to exclusive fund opportunities',
        'Real-time portfolio tracking',
        'Transparent blockchain transactions',
        'Automated yield distribution'
      ]
    },
    {
      role: 'gestorFundo' as const,
      icon: (
        <svg width="32" height="32" viewBox="0 0 32 32" fill="none">
          <path
            d="M16 4V28M4 16H28"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
          />
          <circle
            cx="16"
            cy="16"
            r="12"
            stroke="currentColor"
            strokeWidth="2"
          />
        </svg>
      ),
      title: 'Fund Manager',
      description: 'Create and manage tokenized investment funds on the blockchain',
      features: [
        'Launch tokenized funds',
        'Manage investor relations',
        'Track fund performance',
        'Automate distributions'
      ]
    },
    {
      role: 'consultor' as const,
      icon: (
        <svg width="32" height="32" viewBox="0 0 32 32" fill="none">
          <path
            d="M16 28C22.6274 28 28 22.6274 28 16C28 9.37258 22.6274 4 16 4C9.37258 4 4 9.37258 4 16C4 22.6274 9.37258 28 16 28Z"
            stroke="currentColor"
            strokeWidth="2"
          />
          <path
            d="M12 14C12.6667 13 14 12 16 12C18 12 20 13 20 15C20 17 18 17.5 16 18"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
          />
          <circle cx="16" cy="23" r="1" fill="currentColor" />
        </svg>
      ),
      title: 'Consultant',
      description: 'Provide advisory services and connect investors with opportunities',
      features: [
        'Client portfolio management',
        'Investment advisory tools',
        'Commission tracking',
        'Client relationship management'
      ]
    }
  ];

  const registerIllustration = (
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
            <circle cx="60" cy="60" r="50" fill="url(#register-gradient)" opacity="0.1" />
            <circle cx="60" cy="60" r="30" fill="url(#register-gradient)" opacity="0.2" />
            <path
              d="M40 60C40 48.9543 48.9543 40 60 40C71.0457 40 80 48.9543 80 60C80 71.0457 71.0457 80 60 80"
              stroke="url(#register-gradient)"
              strokeWidth="4"
              strokeLinecap="round"
            />
            <path
              d="M60 50V70M50 60H70"
              stroke="url(#register-gradient)"
              strokeWidth="3"
              strokeLinecap="round"
            />
            <defs>
              <linearGradient
                id="register-gradient"
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
          Join the Future
        </h2>
        <p className="tsf-auth-illustration__description">
          Start your journey in decentralized finance. Create your account and become part of the tokenized fund revolution.
        </p>
      </div>
    </div>
  );

  if (step === 'role') {
    return (
      <AuthLayout
        title="Choose Your Role"
        subtitle="Select how you want to participate in the TSF ecosystem"
        illustration={registerIllustration}
      >
        <div className="tsf-form-group">
          <div style={{ 
            display: 'grid', 
            gap: 'var(--spacing-lg)',
            gridTemplateColumns: '1fr'
          }}>
            {roleOptions.map((option) => (
              <RoleSelectionCard
                key={option.role}
                role={option.role}
                icon={option.icon}
                title={option.title}
                description={option.description}
                features={option.features}
                isSelected={formData.userType === option.role.toUpperCase()}
                onClick={() => handleRoleSelect(option.role.toUpperCase())}
              />
            ))}
          </div>
        </div>

        <div style={{ textAlign: 'center', marginTop: 'var(--spacing-lg)' }}>
          <p style={{ 
            color: 'var(--text-secondary)', 
            fontSize: 'var(--font-size-sm)',
            margin: 0
          }}>
            Already have an account?{' '}
            <Link
              to="/login"
              style={{
                color: 'var(--highlight)',
                textDecoration: 'none',
                fontWeight: 'var(--font-weight-medium)'
              }}
            >
              Sign In
            </Link>
          </p>
        </div>
      </AuthLayout>
    );
  }

  return (
    <AuthLayout
      title="Create Account"
      subtitle={`Complete your ${formData.userType.toLowerCase()} registration`}
      illustration={registerIllustration}
    >
      <form className="tsf-form-group" onSubmit={handleSubmit}>
        <Input
          id="name"
          name="name"
          type="text"
          label="Full Name"
          placeholder="Enter your full name"
          value={formData.name}
          onChange={handleChange}
          required
          leftIcon={
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
              <path
                d="M8 8C10.2091 8 12 6.20914 12 4C12 1.79086 10.2091 0 8 0C5.79086 0 4 1.79086 4 4C4 6.20914 5.79086 8 8 8Z"
                stroke="currentColor"
                strokeWidth="1.5"
              />
              <path
                d="M0 16V14C0 11.7909 1.79086 10 4 10H12C14.2091 10 16 11.7909 16 14V16"
                stroke="currentColor"
                strokeWidth="1.5"
              />
            </svg>
          }
        />

        <Input
          id="email"
          name="email"
          type="email"
          label="Email Address"
          placeholder="Enter your email"
          value={formData.email}
          onChange={handleChange}
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

        <div className="tsf-form-row">
          <Input
            id="password"
            name="password"
            type="password"
            label="Password"
            placeholder="Create password"
            value={formData.password}
            onChange={handleChange}
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

          <Input
            id="confirmPassword"
            name="confirmPassword"
            type="password"
            label="Confirm Password"
            placeholder="Confirm password"
            value={formData.confirmPassword}
            onChange={handleChange}
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
        </div>

        <div style={{ display: 'flex', gap: 'var(--spacing-md)' }}>
          <Button
            type="button"
            variant="ghost"
            onClick={() => setStep('role')}
            className="w-full"
          >
            Back
          </Button>
          <Button
            type="submit"
            variant="primary"
            size="lg"
            loading={loading}
            className="w-full"
          >
            {loading ? 'Creating Account...' : 'Create Account'}
          </Button>
        </div>
      </form>

      <div style={{ textAlign: 'center', marginTop: 'var(--spacing-lg)' }}>
        <p style={{ 
          color: 'var(--text-secondary)', 
          fontSize: 'var(--font-size-sm)',
          margin: 0
        }}>
          Already have an account?{' '}
          <Link
            to="/login"
            style={{
              color: 'var(--highlight)',
              textDecoration: 'none',
              fontWeight: 'var(--font-weight-medium)'
            }}
          >
            Sign In
          </Link>
        </p>
      </div>
    </AuthLayout>
  );
};

export default RegisterPage;