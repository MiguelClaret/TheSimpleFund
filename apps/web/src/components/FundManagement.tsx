import React, { useState, useEffect, useCallback } from 'react';
import { cedenteService, sacadoService } from '../services/api';
import toast from 'react-hot-toast';

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
  consultorId?: string;
}

interface Cedente {
  id: string;
  name: string;
  document: string;
  address?: string;
  publicKey?: string;
  status: string;
  createdAt: string;
  consultor?: {
    email: string;
    role: string;
  };
  fund?: {
    name: string;
    id: string;
  };
}

interface Sacado {
  id: string;
  name: string;
  document: string;
  address?: string;
  publicKey?: string;
  status: string;
  createdAt: string;
  consultor?: {
    email: string;
    role: string;
  };
  fund?: {
    name: string;
    id: string;
  };
}

interface FundManagementProps {
  fund: Fund;
  onBack: () => void;
}

const FundManagement: React.FC<FundManagementProps> = ({ fund, onBack }) => {
  const [activeTab, setActiveTab] = useState<'assignors' | 'debtors'>('assignors');
  const [cedentes, setCedentes] = useState<Cedente[]>([]);
  const [sacados, setSacados] = useState<Sacado[]>([]);
  const [loading, setLoading] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    document: '',
    address: '',
    publicKey: ''
  });

  const loadCedentes = useCallback(async () => {
    try {
      setLoading(true);
      const data = await cedenteService.listByFund(fund.id);
      setCedentes(data);
    } catch {
      toast.error('Error loading assignors');
    } finally {
      setLoading(false);
    }
  }, [fund.id]);

  const loadSacados = useCallback(async () => {
    try {
      setLoading(true);
      const data = await sacadoService.listByFund(fund.id);
      setSacados(data);
    } catch {
      toast.error('Error loading debtors');
    } finally {
      setLoading(false);
    }
  }, [fund.id]);

  useEffect(() => {
    if (activeTab === 'assignors') {
      loadCedentes();
    } else {
      loadSacados();
    }
  }, [activeTab, loadCedentes, loadSacados]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const data = {
        ...formData,
        fundId: fund.id
      };

      if (activeTab === 'assignors') {
        await cedenteService.create(data);
        toast.success('Assignor registered successfully!');
        loadCedentes();
      } else {
        await sacadoService.create(data);
        toast.success('Debtor registered successfully!');
        loadSacados();
      }

      setFormData({ name: '', document: '', address: '', publicKey: '' });
      setShowForm(false);
    } catch {
      toast.error('Error registering');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const renderTable = () => {
    const data = activeTab === 'assignors' ? cedentes : sacados;

    return (
      <div style={{ 
        backgroundColor: '#161b22',
        borderRadius: '8px',
        overflow: 'hidden'
      }}>
        <div style={{
          padding: '16px',
          backgroundColor: '#161b22',
          borderTopLeftRadius: '8px',
          borderTopRightRadius: '8px',
          display: 'grid',
          gridTemplateColumns: '1fr 2fr 1fr 1fr',
          borderBottom: '1px solid #2d333b',
          textTransform: 'uppercase',
          fontSize: '12px',
          color: '#a1a1aa',
          fontWeight: 'bold',
        }}>
          <div>NAME</div>
          <div>DOCUMENT</div>
          <div>STATUS</div>
          <div>CREATED AT</div>
        </div>
        
        {data.length > 0 ? (
          data.map((item) => (
            <div key={item.id} style={{ 
              padding: '16px', 
              borderBottom: '1px solid #2d333b',
              display: 'grid',
              gridTemplateColumns: '1fr 2fr 1fr 1fr',
              fontSize: '14px'
            }}>
              <div style={{ fontWeight: 'medium' }}>
                {item.name}
              </div>
              <div style={{ color: '#a1a1aa' }}>
                {item.document}
              </div>
              <div>
                <span style={{
                  padding: '4px 8px',
                  borderRadius: '999px',
                  fontSize: '12px',
                  fontWeight: 'bold',
                  display: 'inline-block',
                  backgroundColor: item.status === 'APPROVED' ? 'rgba(16, 185, 129, 0.2)' : 
                                  item.status === 'REJECTED' ? 'rgba(239, 68, 68, 0.2)' : 
                                  'rgba(245, 158, 11, 0.2)',
                  color: item.status === 'APPROVED' ? 'rgb(16, 185, 129)' : 
                         item.status === 'REJECTED' ? 'rgb(239, 68, 68)' : 
                         'rgb(245, 158, 11)'
                }}>
                  {item.status}
                </span>
              </div>
              <div style={{ color: '#a1a1aa' }}>
                {new Date(item.createdAt).toLocaleDateString("en-US")}
              </div>
            </div>
          ))
        ) : (
          <div style={{ 
            padding: '32px', 
            textAlign: 'center', 
            color: '#a1a1aa',
            borderBottom: '1px solid #2d333b'
          }}>
            No {activeTab === 'assignors' ? 'assignors' : 'debtors'} registered in this fund
          </div>
        )}
      </div>
    );
  };

  const renderForm = () => {
    if (!showForm) return null;

    const title = activeTab === 'assignors' ? 'New Assignor' : 'New Debtor';

    return (
      <div style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: 'rgba(0, 0, 0, 0.75)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '16px',
        zIndex: 50
      }}>
        <div style={{
          backgroundColor: '#21262d',
          borderRadius: '8px',
          maxWidth: '500px',
          width: '100%',
          padding: '24px',
          boxShadow: '0 10px 25px rgba(0, 0, 0, 0.5)',
          border: '1px solid #30363d'
        }}>
          <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: '16px'
          }}>
            <h3 style={{
              fontSize: '20px',
              fontWeight: 'bold',
              color: 'white'
            }}>{title}</h3>
            <button
              onClick={() => setShowForm(false)}
              style={{
                backgroundColor: 'transparent',
                border: 'none',
                color: '#a1a1aa',
                cursor: 'pointer'
              }}
              aria-label="Close"
            >
              <svg width="24" height="24" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <div>
              <label style={{
                display: 'block',
                marginBottom: '4px',
                fontSize: '14px',
                fontWeight: 'medium',
                color: '#a1a1aa'
              }}>Name</label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
                style={{
                  width: '100%',
                  padding: '8px 12px',
                  backgroundColor: '#0d1117',
                  border: '1px solid #30363d',
                  borderRadius: '4px',
                  color: 'white',
                  fontSize: '14px'
                }}
                placeholder="Enter name"
              />
            </div>
            <div>
              <label style={{
                display: 'block',
                marginBottom: '4px',
                fontSize: '14px',
                fontWeight: 'medium',
                color: '#a1a1aa'
              }}>Document (Tax ID)</label>
              <input
                type="text"
                name="document"
                value={formData.document}
                onChange={handleChange}
                required
                style={{
                  width: '100%',
                  padding: '8px 12px',
                  backgroundColor: '#0d1117',
                  border: '1px solid #30363d',
                  borderRadius: '4px',
                  color: 'white',
                  fontSize: '14px'
                }}
                placeholder="Enter document number"
              />
            </div>
            <div>
              <label style={{
                display: 'block',
                marginBottom: '4px',
                fontSize: '14px',
                fontWeight: 'medium',
                color: '#a1a1aa'
              }}>Address</label>
              <input
                type="text"
                name="address"
                value={formData.address}
                onChange={handleChange}
                style={{
                  width: '100%',
                  padding: '8px 12px',
                  backgroundColor: '#0d1117',
                  border: '1px solid #30363d',
                  borderRadius: '4px',
                  color: 'white',
                  fontSize: '14px'
                }}
                placeholder="Enter address (optional)"
              />
            </div>
            <div>
              <label style={{
                display: 'block',
                marginBottom: '4px',
                fontSize: '14px',
                fontWeight: 'medium',
                color: '#a1a1aa'
              }}>Stellar Public Key</label>
              <input
                type="text"
                name="publicKey"
                value={formData.publicKey}
                onChange={handleChange}
                style={{
                  width: '100%',
                  padding: '8px 12px',
                  backgroundColor: '#0d1117',
                  border: '1px solid #30363d',
                  borderRadius: '4px',
                  color: 'white',
                  fontSize: '14px'
                }}
                placeholder="Enter Stellar public key (optional)"
              />
            </div>
            <div style={{
              display: 'flex',
              justifyContent: 'flex-end',
              gap: '8px',
              marginTop: '16px'
            }}>
              <button
                type="button"
                onClick={() => setShowForm(false)}
                style={{
                  padding: '8px 16px',
                  backgroundColor: 'transparent',
                  border: '1px solid #30363d',
                  borderRadius: '4px',
                  color: 'white',
                  fontSize: '14px',
                  cursor: 'pointer'
                }}
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={loading}
                style={{
                  padding: '8px 16px',
                  backgroundColor: '#f0b90b',
                  border: 'none',
                  borderRadius: '4px',
                  color: 'black',
                  fontWeight: 'bold',
                  fontSize: '14px',
                  cursor: loading ? 'not-allowed' : 'pointer',
                  opacity: loading ? 0.7 : 1
                }}
              >
                {loading ? 'Saving...' : 'Save'}
              </button>
            </div>
          </form>
        </div>
      </div>
    );
  };

  return (
    <div style={{ backgroundColor: '#0d1117', color: 'white', minHeight: '100vh', padding: '0' }}>
      {/* Header with fund info and back button */}
      <div style={{ padding: '16px' }}>
        <div>
          <button
            onClick={onBack}
            style={{ 
              background: 'transparent',
              border: 'none',
              cursor: 'pointer',
              marginBottom: '8px'
            }}
          >
            <svg width="24" height="24" fill="none" stroke="white" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>
          <h2 style={{ fontSize: '32px', fontWeight: 'bold', margin: '0' }}>Manage Fund: {fund.name}</h2>
          <p style={{ fontSize: '14px', color: '#a1a1aa', marginTop: '4px' }}>Code: {fund.symbol} | Status: {fund.status}</p>
        </div>
      </div>

      {/* Tabs - Modern Style like GestorDashboard */}
      <div className="tsf-tabs-modern tsf-mb-xl tsf-mt-lg tsf-p-sm" style={{ 
        backgroundColor: '#0d1117',
        position: 'relative',
        display: 'flex',
        justifyContent: 'flex-start',
        borderRadius: '8px',
        overflow: 'hidden',
        margin: '24px 16px'
      }}>
        {(['assignors', 'debtors'] as const).map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            style={{ 
              backgroundColor: 'transparent',
              border: 'none',
              color: activeTab === tab ? '#f0b90b' : '#a1a1aa',
              padding: '12px 16px',
              cursor: 'pointer',
              fontSize: '14px',
              zIndex: 1,
              transition: 'color 0.3s ease',
              display: 'flex',
              alignItems: 'center',
              width: '50%',
              justifyContent: 'center'
            }}
          >
            {tab === 'assignors' ? (
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{ marginRight: '8px' }}>
                <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
                <circle cx="12" cy="7" r="4"></circle>
              </svg>
            ) : (
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{ marginRight: '8px' }}>
                <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
                <circle cx="9" cy="7" r="4"></circle>
                <path d="M23 21v-2a4 4 0 0 0-3-3.87"></path>
                <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
              </svg>
            )}
            <span className="tsf-text-base tsf-mx-sm">{tab.charAt(0).toUpperCase() + tab.slice(1)}</span>
          </button>
        ))}
        
        <div 
          style={{ 
            position: 'absolute',
            bottom: 0,
            left: activeTab === 'assignors' ? '0%' : '50%',
            width: '50%',
            height: '100%',
            backgroundColor: '#21262d',
            borderRadius: '8px',
            transition: 'left 0.6s cubic-bezier(0.34, 1.56, 0.64, 1), transform 0.4s ease-out',
            zIndex: 0
          }} 
        />
      </div>

      <div style={{ padding: '24px 16px' }}>
        <div style={{ 
          display: 'flex', 
          justifyContent: 'space-between', 
          alignItems: 'center', 
          marginBottom: '16px' 
        }}>
          <h3 style={{ 
            fontSize: '24px', 
            fontWeight: 'normal', 
            margin: 0 
          }}>
            {activeTab === 'assignors' ? 'Assignors' : 'Debtors'} in Fund: {fund.name}
          </h3>
          
          <button
            onClick={() => setShowForm(true)}
            style={{
              backgroundColor: '#f0b90b',
              color: 'black',
              border: 'none',
              borderRadius: '4px',
              padding: '8px 16px',
              fontWeight: 'bold',
              cursor: 'pointer'
            }}
          >
            Add {activeTab === 'assignors' ? 'Assignor' : 'Debtor'}
          </button>
        </div>

        {loading && !showForm ? (
          <div style={{ textAlign: 'center', padding: '40px' }}>
            <div style={{ 
              display: 'inline-block',
              width: '40px',
              height: '40px',
              border: '3px solid rgba(255,255,255,0.1)',
              borderTopColor: '#f0b90b',
              borderRadius: '50%',
              animation: 'spin 1s linear infinite'
            }}></div>
            <p style={{ marginTop: '16px', color: '#a1a1aa' }}>Loading...</p>
          </div>
        ) : (
          renderTable()
        )}
      </div>

      {/* Form Modal */}
      {renderForm()}

      <style>{`
        @keyframes spin {
          to { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
};

export default FundManagement;