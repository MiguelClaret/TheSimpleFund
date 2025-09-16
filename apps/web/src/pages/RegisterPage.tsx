import React, { useState } from 'react';
import { useAuth } from '../contexts/useAuth';
import { Link, useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import AuthLayout from '../components/layouts/AuthLayout';
import Button from '../components/common/Button';
import { Input } from '../components/common/Form';
import RoleSelectionCard from '../components/RoleSelectionCard';
import StepIndicator from '../components/StepIndicator';
import '../styles/registration-animations.css';
import '../styles/register-page.css';

// Define the steps of the registration process
type RegisterStep = 'role' | 'personal' | 'account' | 'review';

const RegisterPage: React.FC = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    confirmPassword: '',
    name: '',
    userType: 'INVESTIDOR'
  });
  const [loading, setLoading] = useState(false);
  const [step, setStep] = useState<RegisterStep>('role');
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
    setStep('personal');
  };
  
  const getStepIndex = (currentStep: RegisterStep): number => {
    const steps: RegisterStep[] = ['role', 'personal', 'account', 'review'];
    return steps.indexOf(currentStep);
  };
  
  const nextStep = () => {
    if (step === 'role') setStep('personal');
    else if (step === 'personal') setStep('account');
    else if (step === 'account') setStep('review');
  };
  
  const prevStep = () => {
    if (step === 'review') setStep('account');
    else if (step === 'account') setStep('personal');
    else if (step === 'personal') setStep('role');
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

  // Step labels for indicator
  const stepLabels = ['Choose Role', 'Personal Info', 'Account Setup', 'Review'];
  
  // Step titles and subtitles
  const stepContent = {
    role: {
      title: 'Choose Your Role',
      subtitle: 'Select how you want to participate in the TSF ecosystem'
    },
    personal: {
      title: 'Personal Information',
      subtitle: 'Tell us a bit about yourself'
    },
    account: {
      title: 'Account Setup',
      subtitle: 'Create your secure account credentials'
    },
    review: {
      title: 'Review Information',
      subtitle: 'Verify your information before completing registration'
    }
  };
  
  // Format the selected role name for display
  const getFormattedRole = () => {
    const role = formData.userType.toLowerCase();
    switch (role) {
      case 'investor':
        return 'Investor';
      case 'gestorfundo':
        return 'Fund Manager';
      case 'consultor':
        return 'Consultant';
      default:
        return role.charAt(0).toUpperCase() + role.slice(1).toLowerCase();
    }
  };
  
  // Render different form content based on current step
  const renderStepContent = () => {
    switch(step) {
      case 'role':
        return (
          <div className="tsf-form-group register-layout-wide" style={{ marginBottom: 'var(--spacing-md)' }}>
            <div style={{ 
              display: 'flex',
              flexDirection: 'column',
              gap: 'var(--spacing-lg)',
              alignItems: 'center',
              width: '100%'
            }}>
              <p style={{
                textAlign: 'center',
                maxWidth: '480px',
                margin: '0 auto var(--spacing-md)',
                color: 'var(--text-secondary)',
                fontSize: 'var(--font-size-sm)'
              }}>
                Select your role in the platform
              </p>
            
              <div className="register-role-grid">
                {roleOptions.map((option, index) => (
                  <RoleSelectionCard
                    key={option.role}
                    role={option.role}
                    icon={option.icon}
                    title={option.title}
                    description={option.description}
                    features={[]}
                    isSelected={formData.userType === option.role.toUpperCase()}
                    onClick={() => handleRoleSelect(option.role.toUpperCase())}
                    className={`role-card-${index}`}
                    style={{ '--index': index } as React.CSSProperties}
                  />
                ))}
              </div>
            </div>
          </div>
        );
        
      case 'personal':
        return (
          <div className="tsf-form-group">
            <div className="tsf-auth-selected-role" style={{
              display: 'flex',
              alignItems: 'center',
              padding: 'var(--spacing-xs) var(--spacing-sm)',
              background: 'rgba(240, 185, 11, 0.1)',
              borderRadius: 'var(--radius-md)',
              marginBottom: 'var(--spacing-md)'
            }}>
              <div style={{ 
                display: 'flex', 
                alignItems: 'center', 
                justifyContent: 'center',
                width: '24px',
                height: '24px',
                borderRadius: '50%',
                background: 'var(--highlight)',
                marginRight: 'var(--spacing-sm)'
              }}>
                <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                  <path
                    d="M2 6L5 9L10 3"
                    stroke="black"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </div>
              <span style={{ fontSize: 'var(--font-size-sm)' }}>
                Selected role: <strong>{getFormattedRole()}</strong>
              </span>
            </div>
            
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
          </div>
        );
        
      case 'account':
        return (
          <div className="tsf-form-group">
            <div className="tsf-password-row" style={{ 
              display: 'grid', 
              gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', 
              gap: 'var(--spacing-md)', 
              marginBottom: 'var(--spacing-sm)' 
            }}>
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
            
            <div style={{ 
              marginTop: 'var(--spacing-md)',
              padding: 'var(--spacing-sm)',
              background: 'var(--background-secondary)',
              borderRadius: 'var(--radius-md)',
              fontSize: 'var(--font-size-xs)',
              color: 'var(--text-secondary)'
            }}>
              <p style={{ marginBottom: 'var(--spacing-xs)', fontWeight: 'var(--font-weight-medium)' }}>
                Password requirements:
              </p>
              <ul style={{ paddingLeft: 'var(--spacing-md)', margin: 0 }}>
                <li>At least 8 characters</li>
                <li>Include at least one uppercase letter</li>
                <li>Include at least one number</li>
                <li>Include at least one special character</li>
              </ul>
            </div>
          </div>
        );
        
      case 'review':
        return (
          <div className="tsf-form-group">
            <div style={{ 
              padding: 'var(--spacing-md)',
              background: 'var(--background-tertiary)',
              borderRadius: 'var(--radius-md)',
              marginBottom: 'var(--spacing-md)'
            }}>
              <h4 style={{ 
                margin: '0 0 var(--spacing-sm)',
                fontSize: 'var(--font-size-md)',
                fontWeight: 'var(--font-weight-semibold)',
                color: 'var(--text-primary)'
              }}>
                Review Your Information
              </h4>
              
              <div style={{ display: 'grid', gap: 'var(--spacing-xs)' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span style={{ color: 'var(--text-secondary)' }}>Role:</span>
                  <span style={{ fontWeight: 'var(--font-weight-medium)' }}>{getFormattedRole()}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span style={{ color: 'var(--text-secondary)' }}>Name:</span>
                  <span style={{ fontWeight: 'var(--font-weight-medium)' }}>{formData.name || '(Not provided)'}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span style={{ color: 'var(--text-secondary)' }}>Email:</span>
                  <span style={{ fontWeight: 'var(--font-weight-medium)' }}>{formData.email}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span style={{ color: 'var(--text-secondary)' }}>Password:</span>
                  <span style={{ fontWeight: 'var(--font-weight-medium)' }}>••••••••</span>
                </div>
              </div>
            </div>
            
            <div style={{
              padding: 'var(--spacing-sm)',
              background: 'rgba(240, 185, 11, 0.1)',
              borderRadius: 'var(--radius-md)',
              display: 'flex',
              alignItems: 'center',
              gap: 'var(--spacing-sm)',
              marginBottom: 'var(--spacing-md)'
            }}>
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                <path
                  d="M8 14C11.3137 14 14 11.3137 14 8C14 4.68629 11.3137 2 8 2C4.68629 2 2 4.68629 2 8C2 11.3137 4.68629 14 8 14Z"
                  stroke="var(--highlight)"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <path
                  d="M8 5V8"
                  stroke="var(--highlight)"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <circle cx="8" cy="11" r="0.5" fill="var(--highlight)" />
              </svg>
              <span style={{ fontSize: 'var(--font-size-sm)', color: 'var(--text-primary)' }}>
                Please verify your information before completing registration
              </span>
            </div>
          </div>
        );
        
      default:
        return null;
    }
  };
  
  // Render navigation buttons based on current step
  const renderNavButtons = () => {
    const isLastStep = step === 'review';
    const isFirstStep = step === 'role';
    
    return (
      <div style={{ 
        display: 'flex', 
        gap: 'var(--spacing-md)', 
        marginTop: 'var(--spacing-md)'
      }}>
        {!isFirstStep && (
          <Button
            type="button"
            variant="ghost"
            onClick={prevStep}
            className="w-full"
          >
            Back
          </Button>
        )}
        
        <Button
          type={isLastStep ? "submit" : "button"}
          variant="primary"
          size="lg"
          loading={loading && isLastStep}
          onClick={!isLastStep ? nextStep : undefined}
          className="w-full"
        >
          {isLastStep 
            ? (loading ? 'Creating Account...' : 'Complete Registration')
            : 'Continue'
          }
        </Button>
      </div>
    );
  };

  return (
    <AuthLayout
      title={stepContent[step].title}
      subtitle={stepContent[step].subtitle}
      illustration={step !== 'role' ? registerIllustration : null}
    >
      {step !== 'role' && (
        <StepIndicator
          steps={stepLabels}
          currentStep={getStepIndex(step)}
          className="mb-6"
        />
      )}
      
      <form 
        className="tsf-form-group" 
        onSubmit={step === 'review' ? handleSubmit : (e) => e.preventDefault()}
        style={{ marginBottom: 'var(--spacing-md)' }}
      >
        {renderStepContent()}
        {renderNavButtons()}
      </form>

      <div className="tsf-auth-link-container">
        <p className="tsf-auth-text">
          Already have an account?{' '}
          <Link
            to="/login"
            className="tsf-auth-link"
          >
            Sign In
          </Link>
        </p>
      </div>
    </AuthLayout>
  );
};

export default RegisterPage;