import React, { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import api, { authService } from "../services/api";
import FundManagement from "../components/FundManagement";

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
  const navigate = useNavigate();
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
      console.log('Token:', token ? 'Present' : 'Missing'); // Debug log
      const response = await api.get("/funds", {
        headers: { Authorization: `Bearer ${token}` },
      });
      console.log('API Response:', response.data); // Debug log
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
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleLogout = () => {
    authService.logout();
    navigate("/login");
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
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold text-gray-900">
            Dashboard - Consultor
          </h1>
          <button
            onClick={handleLogout}
            className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-md font-medium"
          >
            Sair
          </button>
        </div>

        <div className="px-4 py-6 sm:px-0">
          {/* Action Button */}
          <div className="mb-6">
            <button
              onClick={() => setShowForm(!showForm)}
              className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md font-medium"
            >
              {showForm ? "Cancelar" : "Criar Fundo"}
            </button>
          </div>

          {/* Form Section */}
          {showForm && (
            <div className="bg-white shadow rounded-lg p-6 mb-6">
              <h3 className="text-lg font-medium mb-4">Criar Novo Fundo</h3>
              <form
                onSubmit={handleSubmit}
                className="grid grid-cols-1 gap-6 sm:grid-cols-2"
              >
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Nome do Fundo
                  </label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                    className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Símbolo
                  </label>
                  <input
                    type="text"
                    name="symbol"
                    value={formData.symbol}
                    onChange={handleChange}
                    required
                    className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                  />
                </div>
                <div className="sm:col-span-2">
                  <label className="block text-sm font-medium text-gray-700">
                    Descrição
                  </label>
                  <textarea
                    name="description"
                    value={formData.description}
                    onChange={handleChange}
                    rows={3}
                    className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Valor Alvo (R$)
                  </label>
                  <input
                    type="number"
                    name="targetAmount"
                    value={formData.targetAmount}
                    onChange={handleChange}
                    step="0.01"
                    className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Oferta Máxima (cotas)
                  </label>
                  <input
                    type="number"
                    name="maxSupply"
                    value={formData.maxSupply}
                    onChange={handleChange}
                    required
                    className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Preço por Cota (R$)
                  </label>
                  <input
                    type="number"
                    name="price"
                    value={formData.price}
                    onChange={handleChange}
                    step="0.01"
                    required
                    className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                  />
                </div>
                <div className="sm:col-span-2">
                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
                  >
                    {loading ? "Criando..." : "Criar Fundo"}
                  </button>
                </div>
              </form>
            </div>
          )}

          {/* Funds Content Section */}
          <div className="bg-white shadow rounded-lg">
            <div className="px-4 py-5 sm:p-6">
              <h3 className="text-lg font-medium mb-4">Meus Fundos</h3>
              <p className="text-sm text-amber-600 mb-4">
                ⚠️ Fundos criados precisam ser aprovados pelo gestor antes de
                ficarem disponíveis para investimento.
              </p>
              <div className="text-xs text-gray-500 mb-2">
                Total de fundos carregados: {funds.length}
              </div>
              {loading ? (
                <div className="flex justify-center py-8">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                </div>
              ) : (
                <div className="space-y-4">
                  {funds.map((fund) => (
                    <div key={fund.id} className="border rounded-lg p-4">
                      <div className="flex justify-between items-start">
                        <div className="flex-1">
                          <h4 className="font-medium">{fund.name}</h4>
                          <p className="text-sm text-gray-600">
                            {fund.description}
                          </p>
                          <div className="mt-2 grid grid-cols-2 gap-4 text-sm">
                            <div>
                              <span className="text-gray-500">Símbolo:</span>{" "}
                              {fund.symbol}
                            </div>
                            <div>
                              <span className="text-gray-500">Meta:</span> R${" "}
                              {fund.targetAmount?.toLocaleString("pt-BR") ||
                                "N/A"}
                            </div>
                            <div>
                              <span className="text-gray-500">
                                Oferta Máxima:
                              </span>{" "}
                              {fund.maxSupply.toLocaleString("pt-BR")} cotas
                            </div>
                            <div>
                              <span className="text-gray-500">Emitidas:</span>{" "}
                              {fund.totalIssued.toLocaleString("pt-BR")} cotas
                            </div>
                            <div>
                              <span className="text-gray-500">Preço:</span> R${" "}
                              {fund.price.toLocaleString("pt-BR")}
                            </div>
                            <div>
                              <span className="text-gray-500">Criado em:</span>{" "}
                              {new Date(fund.createdAt).toLocaleDateString("pt-BR")}
                            </div>
                          </div>
                          <div className="mt-3 flex items-center justify-between">
                            <span
                              className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                                fund.status === "PENDING"
                                  ? "bg-yellow-100 text-yellow-800"
                                  : fund.status === "APPROVED"
                                  ? "bg-green-100 text-green-800"
                                  : fund.status === "REJECTED"
                                  ? "bg-red-100 text-red-800"
                                  : "bg-blue-100 text-blue-800"
                              }`}
                            >
                              {fund.status === "PENDING"
                                ? "Aguardando Aprovação"
                                : fund.status === "APPROVED"
                                ? "Aprovado"
                                : fund.status === "REJECTED"
                                ? "Rejeitado"
                                : fund.status}
                            </span>
                            <button
                              onClick={() => setSelectedFund(fund)}
                              className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-1 rounded text-sm font-medium"
                            >
                              Gerenciar Cedentes/Sacados
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                  {funds.length === 0 && !loading && (
                    <div className="text-center py-8 text-gray-500">
                      <p>Nenhum fundo encontrado.</p>
                      <p className="text-sm">Comece criando seu primeiro fundo!</p>
                      <div className="mt-2 text-xs">
                        Debug: API respondeu mas sem fundos para este consultor
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ConsultorDashboard;
