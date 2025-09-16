import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  UserIcon, 
  BriefcaseIcon, 
  UsersIcon,
  ArrowLeftIcon 
} from '@heroicons/react/24/outline';
import { RoleSelectionCard } from '../components/common/Card';
import { Button } from '../components/common/Button';
import { UserRole, type UserRoleType } from '../types';

const RoleSelectionPage: React.FC = () => {
  const [selectedRole, setSelectedRole] = useState<UserRoleType | null>(null);
  const navigate = useNavigate();

  const roles = [
    {
      role: UserRole.INVESTOR,
      icon: <UserIcon className="w-full h-full" />,
      title: "I am an INVESTOR",
      description: "Looking to invest in tokenized funds and diversify my portfolio with blockchain-based assets."
    },
    {
      role: UserRole.FUND_MANAGER,
      icon: <BriefcaseIcon className="w-full h-full" />,
      title: "I am a FUND MANAGER",
      description: "Managing investment funds and seeking to tokenize assets on the Stellar blockchain."
    },
    {
      role: UserRole.CONSULTANT,
      icon: <UsersIcon className="w-full h-full" />,
      title: "I am a CONSULTANT",
      description: "Helping clients with KYC processes, compliance, and onboarding to the platform."
    }
  ];

  const handleRoleSelect = (role: UserRoleType) => {
    setSelectedRole(role);
  };

  const handleContinue = () => {
    if (selectedRole) {
      // Store selected role in localStorage or context
      localStorage.setItem('selectedRole', selectedRole);
      navigate('/login', { state: { role: selectedRole } });
    }
  };

  const handleBack = () => {
    navigate('/');
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="w-full max-w-4xl">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="inline-flex items-center justify-center w-20 h-20 bg-white/10 rounded-2xl mb-6"
          >
            <div className="text-3xl font-black text-white">TSF</div>
          </motion.div>
          
          <motion.h1
            className="text-4xl md:text-5xl font-black text-white mb-4"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            Choose Your Profile
          </motion.h1>
          
          <motion.p
            className="text-xl text-white/80 max-w-2xl mx-auto"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
          >
            Select your role to get started with The Simple Fund platform
          </motion.p>
        </motion.div>

        {/* Role Cards */}
        <div className="grid md:grid-cols-3 gap-6 mb-12">
          {roles.map((roleData, index) => (
            <motion.div
              key={roleData.role}
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ 
                duration: 0.6, 
                delay: 0.4 + (index * 0.1)
              }}
            >
              <RoleSelectionCard
                role={roleData.role}
                icon={roleData.icon}
                title={roleData.title}
                description={roleData.description}
                isSelected={selectedRole === roleData.role}
                onClick={handleRoleSelect}
                index={index}
              />
            </motion.div>
          ))}
        </div>

        {/* Action Buttons */}
        <motion.div
          className="flex flex-col sm:flex-row justify-between items-center gap-4"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.8 }}
        >
          <Button
            variant="ghost"
            icon={<ArrowLeftIcon className="w-5 h-5" />}
            onClick={handleBack}
            className="order-2 sm:order-1"
          >
            Back
          </Button>

          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ 
              opacity: selectedRole ? 1 : 0.5, 
              scale: selectedRole ? 1 : 0.9 
            }}
            transition={{ duration: 0.3 }}
            className="order-1 sm:order-2"
          >
            <Button
              size="lg"
              disabled={!selectedRole}
              onClick={handleContinue}
              className="min-w-[200px]"
            >
              Continue
            </Button>
          </motion.div>
        </motion.div>

        {/* Helper Text */}
        {selectedRole && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className="text-center mt-8"
          >
            <p className="text-white/60 text-sm">
              You selected: <span className="text-white font-medium">
                {roles.find(r => r.role === selectedRole)?.title}
              </span>
            </p>
          </motion.div>
        )}
      </div>

      {/* Background decoration */}
      <div className="fixed inset-0 -z-10 overflow-hidden pointer-events-none">
        <motion.div
          className="absolute top-1/4 left-1/4 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl"
          animate={{
            scale: [1, 1.2, 1],
            opacity: [0.3, 0.5, 0.3],
          }}
          transition={{
            duration: 8,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />
        <motion.div
          className="absolute top-3/4 right-1/4 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl"
          animate={{
            scale: [1.2, 1, 1.2],
            opacity: [0.5, 0.3, 0.5],
          }}
          transition={{
            duration: 10,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 2
          }}
        />
      </div>
    </div>
  );
};

export default RoleSelectionPage;