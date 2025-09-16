import React, { useState, useEffect, useCallback } from "react";
import api from "../services/api";
import FundManagement from "../components/FundManagement";
import FundCreationModal from "../components/FundCreationModal";
import DashboardLayout from "../components/layouts/DashboardLayout";
import Card from "../components/common/Card";
import Button from "../components/common/Button";
import { PlusIcon, BuildingOfficeIcon, CurrencyDollarIcon } from "@heroicons/react/24/outline";
import toast from 'react-hot-toast';

interface Fund {
  id: string;
  name: string;
  symbol: string;
  description: string;
  targetAmount: number | null;
  maxSupply: number;
  totalIssued: number;
  price: number;
  status: string;
  createdAt: string;
  updatedAt: string;
  consultorId?: string;
}

const ConsultorDashboard: React.FC = () => {
  const [funds, setFunds] = useState<Fund[]>([]);
  const [loading, setLoading] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedFund, setSelectedFund] = useState<Fund | null>(null);

  const loadFunds = useCallback(async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem("authToken");
      const response = await api.get("/funds", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setFunds(response.data.funds || response.data.data || response.data || []);
    } catch {
      toast.error("Error loading funds");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadFunds();
  }, [loadFunds]);

  const handleFundCreated = async () => {
    // Reload funds after creation
    await loadFunds();
  };

  if (selectedFund) {
    return (
      <FundManagement
        fund={selectedFund}
        onBack={() => setSelectedFund(null)}
      />
    );
  }

  return (
    <DashboardLayout>
      {/* Consultant Summary */}
      <div className="tsf-dashboard-header tsf-mb-xl tsf-p-md">
        <div className="tsf-dashboard-welcome">
          <h2 className="tsf-text-2xl tsf-font-medium tsf-mb-sm">
            Hello, Consultant
          </h2>
          <p className="tsf-text-secondary tsf-text-base">
            Welcome to your consultant dashboard. Here you can create and manage funds, assignors, and debtors.
          </p>
        </div>
      </div>
      
      {/* Stats Cards */}
      <div className="tsf-grid-stats mb-16 tsf-mb-2xl tsf-gap-md">
        <Card className="tsf-stat-card tsf-p-md">
          <div className="tsf-stat-icon tsf-stat-icon--purple">
            <svg width="28" height="28" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
              <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"></path>
            </svg>
          </div>
          <div className="tsf-stat-content tsf-mt-sm">
            <h3 className="tsf-stat-value tsf-text-xl">
              {funds.length}
            </h3>
            <p className="tsf-stat-label">Total Funds</p>
          </div>
        </Card>
        
        <Card className="tsf-stat-card tsf-p-md">
          <div className="tsf-stat-icon tsf-stat-icon--blue">
            <svg width="28" height="28" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
              <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
              <circle cx="12" cy="7" r="4"></circle>
            </svg>
          </div>
          <div className="tsf-stat-content tsf-mt-sm">
            <h3 className="tsf-stat-value tsf-text-xl">
              {funds.filter(f => f.status === "PENDING").length}
            </h3>
            <p className="tsf-stat-label">Pending Approval</p>
          </div>
        </Card>
      </div>

      {/* Action Button */}
      <div className="tsf-dashboard-actions tsf-mb-lg">
        <Button
          variant="primary"
          size="md"
          onClick={() => setIsModalOpen(true)}
          icon={<PlusIcon className="tsf-icon-sm" />}
        >
          Create Fund
        </Button>
      </div>

      {/* Fund Creation Modal */}
      <FundCreationModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onFundCreated={handleFundCreated}
      />

      {/* Funds Content Section */}
      <div className="tsf-content-wrapper tsf-p-md">
        <Card title="My Funds" className="tsf-p-lg">
        <div className="tsf-alert tsf-alert--warning tsf-mb-md">
          ⚠️ Created funds need to be approved by the manager before they become available for investment.
        </div>
        <div className="tsf-text-xs tsf-text-secondary tsf-mb-sm">
          Total funds loaded: {funds.length}
        </div>
        
        {loading ? (
          <div className="tsf-loading-container">
            <div className="tsf-loading-spinner">
              <div className="tsf-spinner"></div>
            </div>
            <p className="tsf-loading-text">Loading funds...</p>
          </div>
        ) : (
          <div className="tsf-funds-grid tsf-space-y-lg">
            {funds.map((fund, index) => (
              <Card key={fund.id} className={`tsf-approval-card tsf-p-md tsf-border-l-primary card-${index}`}>
                <div className="tsf-fund-header tsf-mb-md">
                  <div className="tsf-flex tsf-items-center tsf-justify-between">
                    <h4 className="tsf-font-medium tsf-text-lg">{fund.name}</h4>
                    <span className={`tsf-status-badge ${fund.status === "PENDING" 
                      ? "tsf-status-pending"
                      : fund.status === "APPROVED" 
                      ? "tsf-status-approved"
                      : fund.status === "REJECTED"
                      ? "tsf-status-rejected"
                      : "tsf-status-pending"}`}
                    >
                      {fund.status === "PENDING"
                        ? "Pending Approval"
                        : fund.status === "APPROVED"
                        ? "Approved"
                        : fund.status === "REJECTED"
                        ? "Rejected"
                        : fund.status}
                    </span>
                  </div>
                </div>
                
                <p className="tsf-text-secondary tsf-text-sm tsf-mb-md">{fund.description}</p>
                
                <div className="tsf-fund-details tsf-mb-lg" style={{ 
                  display: 'grid', 
                  gridTemplateColumns: 'repeat(2, 1fr)', 
                  gap: 'var(--spacing-sm)' 
                }}>
                  <div className="tsf-fund-detail">
                    <span className="tsf-detail-label">Symbol:</span>
                    <span className="tsf-detail-value">{fund.symbol}</span>
                  </div>
                  <div className="tsf-fund-detail">
                    <span className="tsf-detail-label">Target:</span>
                    <span className="tsf-detail-value">
                      R$ {fund.targetAmount?.toLocaleString("pt-BR") || "N/A"}
                    </span>
                  </div>
                  <div className="tsf-fund-detail">
                    <span className="tsf-detail-label">Max Supply:</span>
                    <span className="tsf-detail-value">
                      {fund.maxSupply.toLocaleString("pt-BR")} quotas
                    </span>
                  </div>
                  <div className="tsf-fund-detail">
                    <span className="tsf-detail-label">Issued:</span>
                    <span className="tsf-detail-value">
                      {fund.totalIssued.toLocaleString("pt-BR")} quotas
                    </span>
                  </div>
                  <div className="tsf-fund-detail">
                    <span className="tsf-detail-label">Price:</span>
                    <span className="tsf-detail-value tsf-highlight">
                      R$ {fund.price.toLocaleString("pt-BR")}
                    </span>
                  </div>
                  <div className="tsf-fund-detail">
                    <span className="tsf-detail-label">Created:</span>
                    <span className="tsf-detail-value">
                      {new Date(fund.createdAt).toLocaleDateString("en-US")}
                    </span>
                  </div>
                </div>
                
                <div className="tsf-fund-actions">
                  <Button
                    variant="primary"
                    size="sm"
                    onClick={() => setSelectedFund(fund)}
                    icon={<BuildingOfficeIcon className="tsf-icon-sm" />}
                  >
                    Manage Assignors/Debtors
                  </Button>
                </div>
              </Card>
            ))}
            
            {funds.length === 0 && !loading && (
              <Card className="tsf-empty-state-card tsf-p-xl tsf-text-center">
                <div className="tsf-empty-state">
                  <div className="tsf-empty-icon tsf-mb-md">
                    <CurrencyDollarIcon className="tsf-h-12 tsf-w-12 tsf-text-secondary/50" />
                  </div>
                  <h3 className="tsf-empty-title tsf-text-xl tsf-mb-sm">No funds found</h3>
                  <p className="tsf-empty-description tsf-text-secondary tsf-mb-md">
                    Start by creating your first fund!
                  </p>
                  <Button
                    variant="primary"
                    size="md"
                    onClick={() => setIsModalOpen(true)}
                    icon={<PlusIcon className="tsf-icon-sm" />}
                  >
                    Create Fund
                  </Button>
                </div>
              </Card>
            )}
          </div>
        )}
        </Card>
      </div>
    </DashboardLayout>
  );
};

export default ConsultorDashboard;
