import React, { useState, useEffect, useCallback, useRef } from 'react';
import { cedenteService, sacadoService, fundService, userService } from '../services/api';
import DashboardLayout from '../components/layouts/DashboardLayout';
import Card from '../components/common/Card';
import Button from '../components/common/Button';
import toast from 'react-hot-toast';
import { CSSTransition, SwitchTransition } from 'react-transition-group';

interface Cedente {
  id: number;
  name: string;
  document?: string;
  cnpj?: string;
  status: string;
  createdAt: string;
  consultor?: {
    email: string;
  };
}

interface Sacado {
  id: number;
  name: string;
  document?: string;
  cnpj?: string;
  status: string;
  createdAt: string;
  consultor?: {
    email: string;
  };
}

interface Fund {
  id: string;
  name: string;
  description: string | null;
  targetAmount: number | null;
  symbol: string;
  status: string;
  maxSupply: number;
  totalIssued: number;
  price: number;
  createdAt: string;
  updatedAt: string;
  consultor?: {
    email: string;
  };
}

interface User {
  id: string;
  email: string;
  role: string;
  status: string;
  createdAt: string;
}

const GestorDashboard: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'consultores' | 'investidores' | 'fundos' | 'cedentes' | 'sacados'>('consultores');
  const nodeRef = useRef(null);
  const [consultores, setConsultores] = useState<User[]>([]);
  const [investidores, setInvestidores] = useState<User[]>([]);
  const [funds, setFunds] = useState<Fund[]>([]);
  const [cedentes, setCedentes] = useState<Cedente[]>([]);
  const [sacados, setSacados] = useState<Sacado[]>([]);
  const [loading, setLoading] = useState(false);

  const loadConsultores = useCallback(async () => {
    setLoading(true);
    try {
      const data = await userService.getConsultores();
      setConsultores(data);
    } catch {
      toast.error('Erro ao carregar consultores');
    } finally {
      setLoading(false);
    }
  }, []);

  const loadInvestidores = useCallback(async () => {
    setLoading(true);
    try {
      const data = await userService.getInvestidores();
      setInvestidores(data);
    } catch {
      toast.error('Erro ao carregar investidores');
    } finally {
      setLoading(false);
    }
  }, []);

  const loadFunds = useCallback(async () => {
    setLoading(true);
    try {
      const response = await fundService.list();
      setFunds(response);
    } catch {
      toast.error('Erro ao carregar fundos');
    } finally {
      setLoading(false);
    }
  }, []);

  const loadCedentes = useCallback(async () => {
    setLoading(true);
    try {
      const response = await cedenteService.list();
      setCedentes(response);
    } catch {
      toast.error('Erro ao carregar cedentes');
    } finally {
      setLoading(false);
    }
  }, []);

  const loadSacados = useCallback(async () => {
    setLoading(true);
    try {
      const response = await sacadoService.list();
      setSacados(response);
    } catch {
      toast.error('Erro ao carregar sacados');
    } finally {
      setLoading(false);
    }
  }, []);

  const loadData = useCallback(async () => {
    switch (activeTab) {
      case 'consultores':
        await loadConsultores();
        break;
      case 'investidores':
        await loadInvestidores();
        break;
      case 'fundos':
        await loadFunds();
        break;
      case 'cedentes':
        await loadCedentes();
        break;
      case 'sacados':
        await loadSacados();
        break;
    }
  }, [activeTab, loadConsultores, loadInvestidores, loadFunds, loadCedentes, loadSacados]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const handleApproveConsultor = async (id: string, action: 'approve' | 'reject') => {
    try {
      await userService.approveUser(id, action);
      toast.success(`Consultor ${action === 'approve' ? 'aprovado' : 'rejeitado'} com sucesso!`);
      loadConsultores();
    } catch {
      toast.error('Erro ao processar aprovação');
    }
  };

  const handleApproveInvestidor = async (id: string, action: 'approve' | 'reject') => {
    try {
      await userService.approveUser(id, action);
      toast.success(`Investidor ${action === 'approve' ? 'aprovado' : 'rejeitado'} com sucesso!`);
      loadInvestidores();
    } catch {
      toast.error('Erro ao processar aprovação');
    }
  };

  const handleApproveFund = async (id: string, action: 'approve' | 'reject') => {
    try {
      await fundService.approve(id, action === 'approve' ? 'APPROVED' : 'REJECTED');
      toast.success(`Fundo ${action === 'approve' ? 'aprovado' : 'rejeitado'} com sucesso!`);
      loadFunds();
    } catch {
      toast.error('Erro ao processar aprovação');
    }
  };

  const handleDeactivateFund = async (id: string) => {
    if (!confirm('Tem certeza que deseja desativar este fundo?')) return;
    
    try {
      await fundService.deactivate(id);
      toast.success('Fundo desativado com sucesso!');
      loadFunds();
    } catch {
      toast.error('Erro ao desativar fundo');
    }
  };

  const handleApproveCedente = async (id: number, action: 'approve' | 'reject') => {
    try {
      await cedenteService.updateStatus(id.toString(), action === 'approve' ? 'approved' : 'rejected');
      toast.success(`Cedente ${action === 'approve' ? 'aprovado' : 'rejeitado'} com sucesso!`);
      loadCedentes();
    } catch {
      toast.error('Erro ao processar aprovação');
    }
  };

  const handleApproveSacado = async (id: number, action: 'approve' | 'reject') => {
    try {
      await sacadoService.updateStatus(id.toString(), action === 'approve' ? 'approved' : 'rejected');
      toast.success(`Sacado ${action === 'approve' ? 'aprovado' : 'rejeitado'} com sucesso!`);
      loadSacados();
    } catch {
      toast.error('Erro ao processar aprovação');
    }
  };

  const getStatusBadgeClass = (status: string) => {
    switch (status) {
      case 'PENDING':
        return 'tsf-status-pending';
      case 'APPROVED':
        return 'tsf-status-approved';
      case 'REJECTED':
        return 'tsf-status-rejected';
      case 'CLOSED':
        return 'tsf-status-closed';
      default:
        return 'tsf-status-pending';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'PENDING':
        return 'Pendente';
      case 'APPROVED':
        return 'Aprovado';
      case 'REJECTED':
        return 'Rejeitado';
      case 'CLOSED':
        return 'Fechado';
      default:
        return status;
    }
  };

  return (
    <DashboardLayout>
      {/* Manager Summary */}
      <div className="tsf-dashboard-header tsf-mb-xl tsf-p-md">
        <div className="tsf-dashboard-welcome">
          <h2 className="tsf-text-2xl tsf-font-medium tsf-mb-sm">
            Hello, Manager 
          </h2>
          <p className="tsf-text-secondary tsf-text-base">
            Welcome to your management dashboard. Here you can approve users, funds and monitor all platform operations.
          </p>
        </div>
      </div>
      
      {/* Stats Cards */}
      <div className="tsf-grid-stats mb-16 tsf-mb-2xl tsf-gap-md">
        <Card className="tsf-stat-card tsf-p-md">
          <div className="tsf-stat-icon tsf-stat-icon--amber">
            <svg width="28" height="28" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
              <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
              <circle cx="9" cy="7" r="4"></circle>
              <path d="M23 21v-2a4 4 0 0 0-3-3.87"></path>
              <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
            </svg>
          </div>
          <div className="tsf-stat-content tsf-mt-sm">
            <h3 className="tsf-stat-value tsf-text-xl">
              {consultores.filter(c => c.status === 'PENDING').length}
            </h3>
            <p className="tsf-stat-label">Pending Consultants</p>
          </div>
        </Card>
        
        <Card className="tsf-stat-card tsf-p-md">
          <div className="tsf-stat-icon tsf-stat-icon--blue">
            <svg width="28" height="28" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
              <circle cx="12" cy="12" r="10"></circle>
              <line x1="12" y1="8" x2="12" y2="16"></line>
              <line x1="8" y1="12" x2="16" y2="12"></line>
            </svg>
          </div>
          <div className="tsf-stat-content tsf-mt-sm">
            <h3 className="tsf-stat-value tsf-text-xl">
              {investidores.filter(i => i.status === 'PENDING').length}
            </h3>
            <p className="tsf-stat-label">Pending Investors</p>
          </div>
        </Card>
        
        <Card className="tsf-stat-card tsf-p-md">
          <div className="tsf-stat-icon tsf-stat-icon--purple">
            <svg width="28" height="28" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
              <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"></path>
            </svg>
          </div>
          <div className="tsf-stat-content tsf-mt-sm">
            <h3 className="tsf-stat-value tsf-text-xl">
              {funds.filter(f => f.status === 'PENDING').length}
            </h3>
            <p className="tsf-stat-label">Pending Funds</p>
          </div>
        </Card>
        
        <Card className="tsf-stat-card tsf-p-md">
          <div className="tsf-stat-icon tsf-stat-icon--green">
            <svg width="28" height="28" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
              <rect x="2" y="3" width="20" height="14" rx="2" ry="2"></rect>
              <line x1="8" y1="21" x2="16" y2="21"></line>
              <line x1="12" y1="17" x2="12" y2="21"></line>
            </svg>
          </div>
          <div className="tsf-stat-content tsf-mt-sm">
            <h3 className="tsf-stat-value tsf-text-xl">
              {funds.reduce((total, fund) => fund.status === 'APPROVED' ? total + fund.totalIssued : total, 0).toLocaleString('pt-BR')}
            </h3>
            <p className="tsf-stat-label">Total Issued Tokens</p>
          </div>
        </Card>
      </div>

      {/* Tabs */}
      <div className="tsf-tabs-modern tsf-mb-xl tsf-mt-lg tsf-p-sm">
        <button
          onClick={() => setActiveTab('consultores')}
          className={`tsf-tab-modern ${activeTab === 'consultores' ? 'tsf-tab-modern--active' : ''} tsf-p-md`}
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
            <circle cx="9" cy="7" r="4"></circle>
            <path d="M23 21v-2a4 4 0 0 0-3-3.87"></path>
            <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
          </svg>
          <span className="tsf-text-base tsf-mx-sm">Consultants</span>
          {consultores.filter(c => c.status === 'PENDING').length > 0 && 
            <span className="tsf-tab-modern__badge">{consultores.filter(c => c.status === 'PENDING').length}</span>}
        </button>
        
        <button
          onClick={() => setActiveTab('investidores')}
          className={`tsf-tab-modern ${activeTab === 'investidores' ? 'tsf-tab-modern--active' : ''} tsf-p-md`}
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <circle cx="12" cy="12" r="10"></circle>
            <line x1="12" y1="8" x2="12" y2="16"></line>
            <line x1="8" y1="12" x2="16" y2="12"></line>
          </svg>
          <span className="tsf-text-base tsf-mx-sm">Investors</span>
          {investidores.filter(i => i.status === 'PENDING').length > 0 && 
            <span className="tsf-tab-modern__badge">{investidores.filter(i => i.status === 'PENDING').length}</span>}
        </button>
        
        <button
          onClick={() => setActiveTab('fundos')}
          className={`tsf-tab-modern ${activeTab === 'fundos' ? 'tsf-tab-modern--active' : ''} tsf-p-md`}
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"></path>
          </svg>
          <span className="tsf-text-base tsf-mx-sm">Funds</span>
          {funds.filter(f => f.status === 'PENDING').length > 0 && 
            <span className="tsf-tab-modern__badge">{funds.filter(f => f.status === 'PENDING').length}</span>}
        </button>
        
        <button
          onClick={() => setActiveTab('cedentes')}
          className={`tsf-tab-modern ${activeTab === 'cedentes' ? 'tsf-tab-modern--active' : ''} tsf-p-md`}
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <rect x="2" y="7" width="20" height="14" rx="2" ry="2"></rect>
            <path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"></path>
          </svg>
          <span className="tsf-text-base tsf-mx-sm">Assignors</span>
          {cedentes.filter(c => c.status === 'pending').length > 0 && 
            <span className="tsf-tab-modern__badge">{cedentes.filter(c => c.status === 'pending').length}</span>}
        </button>
        
        <button
          onClick={() => setActiveTab('sacados')}
          className={`tsf-tab-modern ${activeTab === 'sacados' ? 'tsf-tab-modern--active' : ''} tsf-p-md`}
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
            <circle cx="12" cy="7" r="4"></circle>
          </svg>
          <span className="tsf-text-base tsf-mx-sm">Debtors</span>
          {sacados.filter(s => s.status === 'pending').length > 0 && 
            <span className="tsf-tab-modern__badge">{sacados.filter(s => s.status === 'pending').length}</span>}
        </button>
        
        <div 
          className="tsf-tab-modern__indicator" 
          style={{ 
            left: activeTab === 'consultores' ? '0%' : 
                 activeTab === 'investidores' ? '20%' : 
                 activeTab === 'fundos' ? '40%' : 
                 activeTab === 'cedentes' ? '60%' : '80%', 
            width: '20%',
            transition: 'left 0.6s cubic-bezier(0.34, 1.56, 0.64, 1), transform 0.4s ease-out'
          }} 
        />
      </div>

      {/* Content */}
      <div className="tsf-content-wrapper tsf-p-md">
        <SwitchTransition mode="out-in">
          <CSSTransition
            key={activeTab}
            nodeRef={nodeRef}
            timeout={300}
            classNames="fade"
          >
            <div ref={nodeRef}>
            {activeTab === 'consultores' ? (
        <Card title="Consultants" className="tsf-p-lg">
          {loading ? (
            <div className="tsf-loading-container">
              <div className="tsf-loading-spinner">
                <div className="tsf-spinner"></div>
              </div>
              <p className="tsf-loading-text">Loading consultants...</p>
            </div>
          ) : (
            <div className="tsf-space-y-lg">
              {consultores.map((consultor, index) => (
                <Card key={consultor.id} className={`tsf-approval-card tsf-p-md tsf-border-l-primary card-${index}`}>
                  <div className="tsf-flex tsf-flex-col tsf-sm:flex-row tsf-justify-between tsf-items-start tsf-sm:items-center tsf-gap-md">
                    <div className="tsf-user-info">
                      <div className="tsf-flex tsf-items-center tsf-gap-sm tsf-mb-sm">
                        <div className="tsf-avatar tsf-bg-primary tsf-text-white">
                          {consultor.email.substring(0, 2).toUpperCase()}
                        </div>
                        <h4 className="tsf-font-medium tsf-text-lg">{consultor.email}</h4>
                      </div>
                      <div className="tsf-user-details tsf-mb-md">
                        <p className="tsf-text-sm tsf-text-secondary tsf-flex tsf-items-center tsf-gap-xs">
                          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
                            <line x1="16" y1="2" x2="16" y2="6"></line>
                            <line x1="8" y1="2" x2="8" y2="6"></line>
                            <line x1="3" y1="10" x2="21" y2="10"></line>
                          </svg>
                          Cadastrado em: {new Date(consultor.createdAt).toLocaleDateString('pt-BR')}
                        </p>
                      </div>
                      <span className={`tsf-status-badge ${getStatusBadgeClass(consultor.status)}`}>
                        {getStatusText(consultor.status)}
                      </span>
                    </div>
                    {consultor.status === 'PENDING' && (
                      <div className="tsf-flex tsf-gap-sm tsf-w-full tsf-sm:w-auto">
                        <Button
                          variant="primary"
                          size="sm"
                          onClick={() => handleApproveConsultor(consultor.id, 'approve')}
                          className="tsf-flex-1 tsf-sm:flex-initial"
                        >
                          Approve
                        </Button>
                        <Button
                          variant="secondary"
                          size="sm"
                          onClick={() => handleApproveConsultor(consultor.id, 'reject')}
                          className="tsf-flex-1 tsf-sm:flex-initial"
                        >
                          Reject
                        </Button>
                      </div>
                    )}
                  </div>
                </Card>
              ))}
              {consultores.length === 0 && (
                <Card className="tsf-empty-state-card tsf-p-xl tsf-text-center">
                  <div className="tsf-empty-state">
                    <div className="tsf-empty-icon tsf-mb-md">
                      <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1">
                        <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
                        <circle cx="9" cy="7" r="4"></circle>
                        <path d="M23 21v-2a4 4 0 0 0-3-3.87"></path>
                        <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
                      </svg>
                    </div>
                    <h3 className="tsf-empty-title tsf-text-xl tsf-mb-sm">No consultants registered</h3>
                    <p className="tsf-empty-description tsf-text-secondary tsf-mb-md">
                      New consultants will appear here when they register on the platform.
                    </p>
                  </div>
                </Card>
              )}
            </div>
          )}
        </Card>
      ) : activeTab === 'investidores' ? (
        <Card title="Investors">
          {loading ? (
            <div className="tsf-loading-spinner">
              <div className="tsf-spinner"></div>
            </div>
          ) : (
            <div className="tsf-space-y-lg">
              {investidores.map((investidor, index) => (
                <Card key={investidor.id} className={`tsf-approval-card tsf-p-md tsf-border-l-info card-${index}`}>
                  <div className="tsf-flex tsf-flex-col tsf-sm:flex-row tsf-justify-between tsf-items-start tsf-sm:items-center tsf-gap-md">
                    <div className="tsf-user-info">
                      <div className="tsf-flex tsf-items-center tsf-gap-sm tsf-mb-sm">
                        <div className="tsf-avatar tsf-bg-info tsf-text-white">
                          {investidor.email.substring(0, 2).toUpperCase()}
                        </div>
                        <h4 className="tsf-font-medium tsf-text-lg">{investidor.email}</h4>
                      </div>
                      <div className="tsf-user-details tsf-mb-md">
                        <p className="tsf-text-sm tsf-text-secondary tsf-flex tsf-items-center tsf-gap-xs">
                          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
                            <line x1="16" y1="2" x2="16" y2="6"></line>
                            <line x1="8" y1="2" x2="8" y2="6"></line>
                            <line x1="3" y1="10" x2="21" y2="10"></line>
                          </svg>
                          Cadastrado em: {new Date(investidor.createdAt).toLocaleDateString('pt-BR')}
                        </p>
                      </div>
                      <span className={`tsf-status-badge ${getStatusBadgeClass(investidor.status)}`}>
                        {getStatusText(investidor.status)}
                      </span>
                    </div>
                    {investidor.status === 'PENDING' && (
                      <div className="tsf-flex tsf-gap-sm tsf-w-full tsf-sm:w-auto">
                        <Button
                          variant="primary"
                          size="sm"
                          onClick={() => handleApproveInvestidor(investidor.id, 'approve')}
                          className="tsf-flex-1 tsf-sm:flex-initial"
                        >
                          Approve
                        </Button>
                        <Button
                          variant="secondary"
                          size="sm"
                          onClick={() => handleApproveInvestidor(investidor.id, 'reject')}
                          className="tsf-flex-1 tsf-sm:flex-initial"
                        >
                          Reject
                        </Button>
                      </div>
                    )}
                  </div>
                </Card>
              ))}
              {investidores.length === 0 && (
                <Card className="tsf-empty-state-card tsf-p-xl tsf-text-center">
                  <div className="tsf-empty-state">
                    <div className="tsf-empty-icon tsf-mb-md">
                      <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1">
                        <circle cx="12" cy="12" r="10"></circle>
                        <line x1="12" y1="8" x2="12" y2="16"></line>
                        <line x1="8" y1="12" x2="16" y2="12"></line>
                      </svg>
                    </div>
                    <h3 className="tsf-empty-title tsf-text-xl tsf-mb-sm">No investors registered</h3>
                    <p className="tsf-empty-description tsf-text-secondary tsf-mb-md">
                      Novos investidores aparecerão aqui quando se registrarem na plataforma.
                    </p>
                  </div>
                </Card>
              )}
            </div>
          )}
        </Card>
      ) : activeTab === 'fundos' ? (
        <Card title="Todos os Fundos">
          {loading ? (
            <div className="tsf-loading-spinner">
              <div className="tsf-spinner"></div>
            </div>
          ) : (
            <div className="tsf-space-y-md">
              {funds.map((fund) => (
                <Card key={fund.id} className="tsf-approval-card">
                  <div className="tsf-flex tsf-justify-between tsf-items-start">
                    <div className="tsf-flex-1">
                      <h4 className="tsf-font-medium">{fund.name}</h4>
                      <p className="tsf-text-sm tsf-text-secondary tsf-mb-sm">{fund.description}</p>
                      
                      <div className="tsf-fund-details tsf-mb-sm" style={{ 
                        display: 'grid', 
                        gridTemplateColumns: 'repeat(2, 1fr)', 
                        gap: 'var(--spacing-sm)' 
                      }}>
                        <div className="tsf-fund-detail">
                          <span className="tsf-detail-label">Símbolo:</span>
                          <span className="tsf-detail-value">{fund.symbol}</span>
                        </div>
                        <div className="tsf-fund-detail">
                          <span className="tsf-detail-label">Preço:</span>
                          <span className="tsf-detail-value">R$ {fund.price.toLocaleString('pt-BR')}</span>
                        </div>
                        <div className="tsf-fund-detail">
                          <span className="tsf-detail-label">Meta:</span>
                          <span className="tsf-detail-value">
                            R$ {fund.targetAmount?.toLocaleString('pt-BR') || 'N/A'}
                          </span>
                        </div>
                        <div className="tsf-fund-detail">
                          <span className="tsf-detail-label">Oferta Máxima:</span>
                          <span className="tsf-detail-value">{fund.maxSupply.toLocaleString('pt-BR')} cotas</span>
                        </div>
                      </div>
                      
                      {fund.consultor && (
                        <p className="tsf-text-xs tsf-text-tertiary tsf-mb-sm">
                          Consultor: {fund.consultor.email}
                        </p>
                      )}
                      
                      <span className={`tsf-status-badge ${getStatusBadgeClass(fund.status)}`}>
                        {getStatusText(fund.status)}
                      </span>
                    </div>
                    
                    <div className="tsf-flex tsf-gap-sm tsf-ml-md">
                      {fund.status === 'PENDING' && (
                        <>
                          <Button
                            variant="primary"
                            size="sm"
                            onClick={() => handleApproveFund(fund.id, 'approve')}
                          >
                            Approve
                          </Button>
                          <Button
                            variant="secondary"
                            size="sm"
                            onClick={() => handleApproveFund(fund.id, 'reject')}
                          >
                            Reject
                          </Button>
                        </>
                      )}
                      {(fund.status === 'APPROVED' || fund.status === 'ACTIVE') && (
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleDeactivateFund(fund.id)}
                        >
                          Desativar
                        </Button>
                      )}
                    </div>
                  </div>
                </Card>
              ))}
              {funds.length === 0 && (
                <div className="tsf-empty-state">
                  <div className="tsf-empty-icon">🏦</div>
                  <p className="tsf-empty-title">No funds registered</p>
                </div>
              )}
            </div>
          )}
        </Card>
      ) : activeTab === 'cedentes' ? (
        <Card title="Cedentes">
          {loading ? (
            <div className="tsf-loading-spinner">
              <div className="tsf-spinner"></div>
            </div>
          ) : (
            <div className="tsf-space-y-md">
              {cedentes.map((cedente) => (
                <Card key={cedente.id} className="tsf-approval-card">
                  <div className="tsf-flex tsf-justify-between tsf-items-center">
                    <div>
                      <h4 className="tsf-font-medium">{cedente.name}</h4>
                      <div className="tsf-text-sm tsf-text-secondary tsf-space-y-xs">
                        {cedente.document && <p>CPF: {cedente.document}</p>}
                        {cedente.cnpj && <p>CNPJ: {cedente.cnpj}</p>}
                        <p>Cadastrado em: {new Date(cedente.createdAt).toLocaleDateString('pt-BR')}</p>
                        {cedente.consultor && (
                          <p>Consultor: {cedente.consultor.email}</p>
                        )}
                      </div>
                      <span className={`tsf-status-badge ${getStatusBadgeClass(cedente.status.toUpperCase())}`}>
                        {getStatusText(cedente.status.toUpperCase())}
                      </span>
                    </div>
                    {cedente.status === 'pending' && (
                      <div className="tsf-flex tsf-gap-sm">
                        <Button
                          variant="primary"
                          size="sm"
                          onClick={() => handleApproveCedente(cedente.id, 'approve')}
                        >
                          Approve
                        </Button>
                        <Button
                          variant="secondary"
                          size="sm"
                          onClick={() => handleApproveCedente(cedente.id, 'reject')}
                        >
                          Reject
                        </Button>
                      </div>
                    )}
                  </div>
                </Card>
              ))}
              {cedentes.length === 0 && (
                <div className="tsf-empty-state">
                  <div className="tsf-empty-icon">🏢</div>
                  <p className="tsf-empty-title">No assignors registered</p>
                </div>
              )}
            </div>
          )}
        </Card>
      ) : (
        <Card title="Sacados">
          {loading ? (
            <div className="tsf-loading-spinner">
              <div className="tsf-spinner"></div>
            </div>
          ) : (
            <div className="tsf-space-y-md">
              {sacados.map((sacado) => (
                <Card key={sacado.id} className="tsf-approval-card">
                  <div className="tsf-flex tsf-justify-between tsf-items-center">
                    <div>
                      <h4 className="tsf-font-medium">{sacado.name}</h4>
                      <div className="tsf-text-sm tsf-text-secondary tsf-space-y-xs">
                        {sacado.document && <p>CPF: {sacado.document}</p>}
                        {sacado.cnpj && <p>CNPJ: {sacado.cnpj}</p>}
                        <p>Cadastrado em: {new Date(sacado.createdAt).toLocaleDateString('pt-BR')}</p>
                        {sacado.consultor && (
                          <p>Consultor: {sacado.consultor.email}</p>
                        )}
                      </div>
                      <span className={`tsf-status-badge ${getStatusBadgeClass(sacado.status.toUpperCase())}`}>
                        {getStatusText(sacado.status.toUpperCase())}
                      </span>
                    </div>
                    {sacado.status === 'pending' && (
                      <div className="tsf-flex tsf-gap-sm">
                        <Button
                          variant="primary"
                          size="sm"
                          onClick={() => handleApproveSacado(sacado.id, 'approve')}
                        >
                          Aprovar
                        </Button>
                        <Button
                          variant="secondary"
                          size="sm"
                          onClick={() => handleApproveSacado(sacado.id, 'reject')}
                        >
                          Rejeitar
                        </Button>
                      </div>
                    )}
                  </div>
                </Card>
              ))}
              {sacados.length === 0 && (
                <div className="tsf-empty-state">
                  <div className="tsf-empty-icon">🏪</div>
                  <p className="tsf-empty-title">No debtors registered</p>
                </div>
              )}
            </div>
          )}
        </Card>
      )}
            </div>
          </CSSTransition>
        </SwitchTransition>
      </div>
    </DashboardLayout>
  );
};

export default GestorDashboard;