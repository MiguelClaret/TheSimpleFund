import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Link, useNavigate } from 'react-router-dom';
import { 
  UserPlusIcon, 
  ExclamationTriangleIcon,
  InformationCircleIcon,
  CheckIcon
} from '@heroicons/react/24/outline';
import { useAuth } from '../contexts/useAuth';
import { GlassCard } from '../components/common/Card';
import Button from '../components/common/Button/Button';
import Input from '../components/common/Input/Input';
import toast from 'react-hot-toast';

const RegisterPage: React.FC = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    confirmPassword: '',
    name: '',
    userType: 'INVESTIDOR'
  });
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const { register } = useAuth();
  const navigate = useNavigate();

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.name.trim()) {
      newErrors.name = 'Nome é obrigatório';
    }

    if (!formData.email.trim()) {
      newErrors.email = 'Email é obrigatório';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Email inválido';
    }

    if (!formData.password) {
      newErrors.password = 'Senha é obrigatória';
    } else if (formData.password.length < 6) {
      newErrors.password = 'Senha deve ter pelo menos 6 caracteres';
    }

    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Senhas não coincidem';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (field: string) => (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    setFormData(prev => ({
      ...prev,
      [field]: e.target.value
    }));

    // Clear field error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({
        ...prev,
        [field]: ''
      }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;

    setLoading(true);

    try {
      await register(formData.email, formData.password, formData.userType);
      toast.success('Cadastro realizado! Aguarde aprovação do gestor para acessar a plataforma.');
      navigate('/dashboard');
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Erro ao cadastrar. Tente novamente.';
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const userTypeOptions = [
    {
      value: 'INVESTIDOR',
      label: 'Investidor',
      description: 'Invista em fundos de recebíveis'
    },
    {
      value: 'CONSULTOR',
      label: 'Consultor',
      description: 'Crie e gerencie fundos (requer aprovação)'
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      {/* Background Effects */}
      <div className="fixed inset-0 opacity-20">
        <div className="absolute inset-0 bg-gradient-to-r from-blue-500/10 to-purple-500/10" />
      </div>
      
      <div className="relative flex items-center justify-center min-h-screen p-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="w-full max-w-md"
        >
          <GlassCard>
            <div className="space-y-8">
              {/* Header */}
              <div className="text-center space-y-4">
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
                  className="w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center mx-auto"
                >
                  <UserPlusIcon className="w-8 h-8 text-white" />
                </motion.div>
                
                <div>
                  <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-400 via-purple-500 to-pink-500 bg-clip-text text-transparent">
                    Criar Conta
                  </h1>
                  <p className="text-gray-300 mt-2">
                    Cadastre-se na VERO Platform
                  </p>
                </div>
              </div>

              {/* Important Notice */}
              <div className="glass-card p-4 border border-blue-400/30">
                <div className="flex items-start space-x-3">
                  <InformationCircleIcon className="w-5 h-5 text-blue-400 mt-0.5 flex-shrink-0" />
                  <div className="text-sm text-blue-300">
                    <p className="font-medium">Processo de Aprovação</p>
                    <p className="text-blue-200 mt-1">
                      Todos os cadastros passam por análise e aprovação da equipe de gestão antes de liberarem o acesso completo à plataforma.
                    </p>
                  </div>
                </div>
              </div>

              {/* Registration Form */}
              <form onSubmit={handleSubmit} className="space-y-6">
                <Input
                  label="Nome Completo"
                  type="text"
                  value={formData.name}
                  onChange={handleChange('name')}
                  error={errors.name}
                  placeholder="Digite seu nome completo"
                  required
                />

                <Input
                  label="Email"
                  type="email"
                  value={formData.email}
                  onChange={handleChange('email')}
                  error={errors.email}
                  placeholder="Digite seu email"
                  required
                />

                {/* User Type Selection */}
                <div className="space-y-3">
                  <label className="block text-sm font-medium text-gray-300">
                    Tipo de Usuário
                  </label>
                  <div className="space-y-3">
                    {userTypeOptions.map((option) => (
                      <motion.label
                        key={option.value}
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        className={`
                          glass-card p-4 cursor-pointer transition-all duration-200 border
                          ${formData.userType === option.value
                            ? 'border-blue-400/50 bg-blue-500/10'
                            : 'border-white/10 hover:border-white/20'
                          }
                        `}
                      >
                        <div className="flex items-start space-x-3">
                          <input
                            type="radio"
                            name="userType"
                            value={option.value}
                            checked={formData.userType === option.value}
                            onChange={handleChange('userType')}
                            className="mt-1 w-4 h-4 text-blue-500 border-gray-300 focus:ring-blue-500"
                          />
                          <div className="flex-1">
                            <div className="flex items-center space-x-2">
                              <span className="font-medium text-white">{option.label}</span>
                              {formData.userType === option.value && (
                                <CheckIcon className="w-4 h-4 text-blue-400" />
                              )}
                            </div>
                            <p className="text-sm text-gray-400 mt-1">{option.description}</p>
                          </div>
                        </div>
                      </motion.label>
                    ))}
                  </div>

                  {formData.userType === 'CONSULTOR' && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      className="glass-card p-3 border border-yellow-400/30"
                    >
                      <div className="flex items-start space-x-2">
                        <ExclamationTriangleIcon className="w-4 h-4 text-yellow-400 mt-0.5 flex-shrink-0" />
                        <p className="text-xs text-yellow-300">
                          Consultores precisam ser aprovados por um gestor antes de poder operar.
                        </p>
                      </div>
                    </motion.div>
                  )}
                </div>

                <Input
                  label="Senha"
                  type="password"
                  value={formData.password}
                  onChange={handleChange('password')}
                  error={errors.password}
                  placeholder="Digite sua senha"
                  required
                />

                <Input
                  label="Confirmar Senha"
                  type="password"
                  value={formData.confirmPassword}
                  onChange={handleChange('confirmPassword')}
                  error={errors.confirmPassword}
                  placeholder="Confirme sua senha"
                  required
                />

                <Button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loading ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                      Cadastrando...
                    </>
                  ) : (
                    <>
                      <UserPlusIcon className="w-4 h-4 mr-2" />
                      Criar Conta
                    </>
                  )}
                </Button>
              </form>

              {/* Login Link */}
              <div className="text-center pt-6 border-t border-white/10">
                <p className="text-gray-400 text-sm">
                  Já tem uma conta?{' '}
                  <Link
                    to="/login"
                    className="text-blue-400 hover:text-blue-300 font-medium transition-colors"
                  >
                    Faça login
                  </Link>
                </p>
              </div>
            </div>
          </GlassCard>
        </motion.div>
      </div>
    </div>
  );
};

export default RegisterPage;