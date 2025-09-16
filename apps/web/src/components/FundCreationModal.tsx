import React, { useState } from 'react';
import Modal from './common/Modal';
import Button from './common/Button';
import Input from './common/Input';
import { fundService } from '../services/api';
import toast from 'react-hot-toast';

interface FundFormData {
  name: string;
  symbol: string;
  description: string;
  targetAmount: string;
  maxSupply: string;
  price: string;
}

interface FormError {
  name?: string;
  symbol?: string;
  description?: string;
  targetAmount?: string;
  maxSupply?: string;
  price?: string;
}

interface FundCreationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onFundCreated: () => void;
}

const FundCreationModal: React.FC<FundCreationModalProps> = ({
  isOpen,
  onClose,
  onFundCreated,
}) => {
  const [formData, setFormData] = useState<FundFormData>({
    name: '',
    symbol: '',
    description: '',
    targetAmount: '',
    maxSupply: '',
    price: '',
  });
  const [errors, setErrors] = useState<FormError>({});
  const [loading, setLoading] = useState(false);

  const validateForm = (): boolean => {
    const newErrors: FormError = {};
    
    if (!formData.name.trim()) {
      newErrors.name = "Fund name is required";
    }
    
    if (!formData.symbol.trim()) {
      newErrors.symbol = "Symbol is required";
    } else if (formData.symbol.length > 8) {
      newErrors.symbol = "Symbol must be 8 characters or less";
    }
    
    if (formData.targetAmount && isNaN(parseFloat(formData.targetAmount))) {
      newErrors.targetAmount = "Target amount must be a valid number";
    }
    
    if (!formData.maxSupply) {
      newErrors.maxSupply = "Maximum supply is required";
    } else if (isNaN(parseInt(formData.maxSupply)) || parseInt(formData.maxSupply) <= 0) {
      newErrors.maxSupply = "Maximum supply must be a positive number";
    }
    
    if (!formData.price) {
      newErrors.price = "Price is required";
    } else if (isNaN(parseFloat(formData.price)) || parseFloat(formData.price) <= 0) {
      newErrors.price = "Price must be a positive number";
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }
    
    setLoading(true);

    try {
      const fundData = {
        name: formData.name,
        symbol: formData.symbol.toUpperCase(),
        description: formData.description,
        targetAmount: formData.targetAmount ? parseFloat(formData.targetAmount) : null,
        maxSupply: parseInt(formData.maxSupply),
        price: parseFloat(formData.price),
      };

      await fundService.create(fundData);
      
      toast.success("Fund created successfully!");
      
      // Reset form
      setFormData({
        name: '',
        symbol: '',
        description: '',
        targetAmount: '',
        maxSupply: '',
        price: '',
      });
      
      onFundCreated();
      onClose();
    } catch (error) {
      toast.error("Error creating fund. Please try again.");
      console.error('Error creating fund:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    
    // Clear error when user types in a field
    if (errors[name as keyof FormError]) {
      setErrors(prev => ({ ...prev, [name]: undefined }));
    }
  };

  const handleCancel = () => {
    // Reset form when canceling
    setFormData({
      name: '',
      symbol: '',
      description: '',
      targetAmount: '',
      maxSupply: '',
      price: '',
    });
    setErrors({});
    onClose();
  };

  const footer = (
    <div className="tsf-modal-actions">
      <Button
        variant="secondary"
        size="md"
        onClick={handleCancel}
        disabled={loading}
      >
        Cancel
      </Button>
      <Button
        type="submit"
        variant="primary"
        size="md"
        loading={loading}
        form="fund-creation-form"
      >
        {loading ? "Creating..." : "Create Fund"}
      </Button>
    </div>
  );

  return (
    <Modal
      isOpen={isOpen}
      onClose={handleCancel}
      title="Create New Fund"
      size="lg"
      footer={footer}
      closeOnOverlayClick={!loading}
    >
      <div className="tsf-modal-description tsf-mb-md">
        <p className="tsf-text-secondary">
          Create a new fund that will be subject to approval by the manager before becoming available for investment.
        </p>
      </div>
      
      <form id="fund-creation-form" onSubmit={handleSubmit} className="tsf-form-grid">
        <Input
          label="Fund Name"
          type="text"
          name="name"
          value={formData.name}
          onChange={handleChange}
          required
          placeholder="Example: Real Estate Fund ABC"
          disabled={loading}
          error={errors.name}
        />
        
        <Input
          label="Symbol"
          type="text"
          name="symbol"
          value={formData.symbol}
          onChange={handleChange}
          required
          placeholder="Example: FABC11"
          disabled={loading}
          error={errors.symbol}
          helperText="The symbol is displayed on the platform and should be short (max 8 characters)"
        />
        
        <div className="tsf-form-full-width">
          <Input
            label="Description"
            name="description"
            value={formData.description}
            onChange={handleChange}
            multiline
            rows={3}
            placeholder="Describe the fund and its objectives..."
            disabled={loading}
            error={errors.description}
          />
        </div>
        
        <Input
          label="Target Amount (R$)"
          type="number"
          name="targetAmount"
          value={formData.targetAmount}
          onChange={handleChange}
          step="0.01"
          placeholder="1000000.00"
          disabled={loading}
          error={errors.targetAmount}
          helperText="Optional. The target amount you wish to raise for this fund."
        />
        
        <Input
          label="Maximum Supply (quotas)"
          type="number"
          name="maxSupply"
          value={formData.maxSupply}
          onChange={handleChange}
          required
          placeholder="10000"
          disabled={loading}
          error={errors.maxSupply}
          helperText="The total number of quotas available in this fund"
        />
        
        <Input
          label="Price per Quota (R$)"
          type="number"
          name="price"
          value={formData.price}
          onChange={handleChange}
          step="0.01"
          required
          placeholder="100.00"
          disabled={loading}
          error={errors.price}
        />
      </form>
    </Modal>
  );
};

export default FundCreationModal;