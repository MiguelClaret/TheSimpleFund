import React, { useState, useEffect, useCallback } from "react";
import api from "../services/api";
import FundManagement from "../components/FundManagement";
import DashboardLayout from "../components/layouts/DashboardLayout";
import Card from "../components/common/Card";
import Button from "../components/common/Button";
import Input from "../components/common/Input/Input";
import { PlusIcon, BuildingOfficeIcon, CurrencyDollarIcon } from "@heroicons/react/24/outline";

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
  const [showForm, setShowForm] = useState(false);
  const [selectedFund, setSelectedFund] = useState<Fund | null>(null);
  const [formData, setFormData] = useState({
    name: "",
    symbol: "",
    description: "",
    targetAmount: "",
    maxSupply: "",
    price: "",
  });

  const loadFunds = useCallback(async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem("authToken");
      console.log('Token:', token ? 'Present' : 'Missing');
      const response = await api.get("/funds", {
        headers: { Authorization: `Bearer ${token}` },
      });
      console.log('API Response:', response.data);
      setFunds(response.data.funds || response.data.data || response.data || []);
    } catch (error) {
      console.error("Erro ao carregar fundos:", error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadFunds();
  }, [loadFunds]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setLoading(true);
      const token = localStorage.getItem("authToken");

      const fundPayload = {
        name: formData.name,
        symbol: formData.symbol,
        description: formData.description,
        targetAmount: formData.targetAmount
          ? parseFloat(formData.targetAmount)
          : null,
        maxSupply: parseInt(formData.maxSupply),
        price: parseFloat(formData.price),
      };

      await api.post("/funds", fundPayload, {
        headers: { Authorization: `Bearer ${token}` },
      });

      // Reset form
      setFormData({
        name: "",
        symbol: "",
        description: "",
        targetAmount: "",
        maxSupply: "",
        price: "",
      });
      setShowForm(false);

      // Reload data
      await loadFunds();
    } catch (error: unknown) {
      console.error("Erro ao salvar:", error);
      const errorMessage = error instanceof Error ? error.message : "Erro ao salvar";
      alert(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
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
    <DashboardLayout title="Dashboard - Consultor">
      {/* Action Button */}
      <div className="tsf-dashboard-actions">
        <Button
          variant={showForm ? "secondary" : "primary"}
          size="md"
          onClick={() => setShowForm(!showForm)}
          icon={<PlusIcon className="tsf-icon-sm" />}
        >
          {showForm ? "Cancelar" : "Criar Fundo"}
        </Button>
      </div>

      {/* Form Section */}
      {showForm && (
        <Card title="Criar Novo Fundo" className="tsf-mb-lg">
          <form onSubmit={handleSubmit} className="tsf-form-grid">
            <Input
              label="Nome do Fundo"
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
              placeholder="Ex: Fundo Imobiliário ABC"
            />
            
            <Input
              label="Símbolo"
              type="text"
              name="symbol"
              value={formData.symbol}
              onChange={handleChange}
              required
              placeholder="Ex: FABC11"
            />
            
            <div className="tsf-form-full-width">
              <Input
                label="Descrição"
                name="description"
                value={formData.description}
                onChange={handleChange}
                multiline
                rows={3}
                placeholder="Descreva o fundo e seus objetivos..."
              />
            </div>
            
            <Input
              label="Valor Alvo (R$)"
              type="number"
              name="targetAmount"
              value={formData.targetAmount}
              onChange={handleChange}
              step="0.01"
              placeholder="1000000.00"
            />
            
            <Input
              label="Oferta Máxima (cotas)"
              type="number"
              name="maxSupply"
              value={formData.maxSupply}
              onChange={handleChange}
              required
              placeholder="10000"
            />
            
            <Input
              label="Preço por Cota (R$)"
              type="number"
              name="price"
              value={formData.price}
              onChange={handleChange}
              step="0.01"
              required
              placeholder="100.00"
            />
            
            <div className="tsf-form-full-width">
              <Button
                type="submit"
                variant="primary"
                size="lg"
                loading={loading}
                fullWidth
              >
                {loading ? "Criando..." : "Criar Fundo"}
              </Button>
            </div>
          </form>
        </Card>
      )}

      {/* Funds Content Section */}
      <Card title="Meus Fundos">
        <div className="tsf-alert tsf-alert--warning tsf-mb-md">
          ⚠️ Fundos criados precisam ser aprovados pelo gestor antes de ficarem disponíveis para investimento.
        </div>
        <div className="tsf-text-xs tsf-text-secondary tsf-mb-sm">
          Total de fundos carregados: {funds.length}
        </div>
        
        {loading ? (
          <div className="tsf-loading-spinner">
            <div className="tsf-spinner"></div>
          </div>
        ) : (
          <div className="tsf-funds-grid">
            {funds.map((fund) => (
              <Card key={fund.id} className="tsf-fund-card">
                <div className="tsf-fund-header">
                  <h4 className="tsf-fund-title">{fund.name}</h4>
                  <span className={`tsf-status-badge tsf-status-${fund.status.toLowerCase()}`}>
                    {fund.status === "PENDING"
                      ? "Aguardando Aprovação"
                      : fund.status === "APPROVED"
                      ? "Aprovado"
                      : fund.status === "REJECTED"
                      ? "Rejeitado"
                      : fund.status}
                  </span>
                </div>
                
                <p className="tsf-fund-description">{fund.description}</p>
                
                <div className="tsf-fund-details">
                  <div className="tsf-fund-detail">
                    <span className="tsf-detail-label">Símbolo:</span>
                    <span className="tsf-detail-value">{fund.symbol}</span>
                  </div>
                  <div className="tsf-fund-detail">
                    <span className="tsf-detail-label">Meta:</span>
                    <span className="tsf-detail-value">
                      R$ {fund.targetAmount?.toLocaleString("pt-BR") || "N/A"}
                    </span>
                  </div>
                  <div className="tsf-fund-detail">
                    <span className="tsf-detail-label">Oferta Máxima:</span>
                    <span className="tsf-detail-value">
                      {fund.maxSupply.toLocaleString("pt-BR")} cotas
                    </span>
                  </div>
                  <div className="tsf-fund-detail">
                    <span className="tsf-detail-label">Emitidas:</span>
                    <span className="tsf-detail-value">
                      {fund.totalIssued.toLocaleString("pt-BR")} cotas
                    </span>
                  </div>
                  <div className="tsf-fund-detail">
                    <span className="tsf-detail-label">Preço:</span>
                    <span className="tsf-detail-value tsf-highlight">
                      R$ {fund.price.toLocaleString("pt-BR")}
                    </span>
                  </div>
                  <div className="tsf-fund-detail">
                    <span className="tsf-detail-label">Criado em:</span>
                    <span className="tsf-detail-value">
                      {new Date(fund.createdAt).toLocaleDateString("pt-BR")}
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
                    Gerenciar Cedentes/Sacados
                  </Button>
                </div>
              </Card>
            ))}
            
            {funds.length === 0 && !loading && (
              <div className="tsf-empty-state">
                <CurrencyDollarIcon className="tsf-empty-icon" />
                <p className="tsf-empty-title">Nenhum fundo encontrado</p>
                <p className="tsf-empty-description">
                  Comece criando seu primeiro fundo!
                </p>
                <div className="tsf-text-xs tsf-text-tertiary tsf-mt-sm">
                  Debug: API respondeu mas sem fundos para este consultor
                </div>
              </div>
            )}
          </div>
        )}
      </Card>
    </DashboardLayout>
  );
};

export default ConsultorDashboard;
