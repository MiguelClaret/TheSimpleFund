import React, { useState, useEffect } from 'react';
import Modal from './common/Modal/Modal';
import Button from './common/Button';

interface IssueQuotasModalProps {
  fundName: string;
  maxQuotasAvailable: number;
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (amount: number) => void;
}

const IssueQuotasModal: React.FC<IssueQuotasModalProps> = ({
  fundName,
  maxQuotasAvailable,
  isOpen,
  onClose,
  onConfirm
}) => {
  const [amount, setAmount] = useState<number>(0);
  const [error, setError] = useState<string>('');

  // Reset state when modal opens
  useEffect(() => {
    if (isOpen) {
      setAmount(0);
      setError('');
    }
  }, [isOpen]);

  const handleAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseInt(e.target.value);
    setAmount(value);
    
    // Validation
    if (isNaN(value) || value <= 0) {
      setError('Please enter a valid positive number');
    } else if (value > maxQuotasAvailable) {
      setError(`Cannot exceed maximum available quotas: ${maxQuotasAvailable}`);
    } else {
      setError('');
    }
  };

  const handleSubmit = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!amount || amount <= 0 || amount > maxQuotasAvailable) {
      return;
    }
    onConfirm(amount);
    setAmount(0);
    onClose();
  };

  const modalFooter = (
    <div className="tsf-flex tsf-justify-end tsf-gap-md">
      <Button 
        variant="secondary" 
        onClick={onClose}
      >
        Cancel
      </Button>
      <Button
        variant="primary"
        disabled={!!error || !amount || amount <= 0}
        onClick={() => handleSubmit()}
      >
        Issue Quotas
      </Button>
    </div>
  );

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Issue Quotas"
      size="sm"
      footer={modalFooter}
    >
      <div className="tsf-p-lg">
        <p className="tsf-mb-lg">
          Enter the number of quotas to issue for <strong>{fundName}</strong>
        </p>
        
        <form onSubmit={handleSubmit}>
          <div className="tsf-mb-md">
            <label htmlFor="quota-amount" className="tsf-block tsf-mb-xs tsf-font-medium">
              Quota Amount
            </label>
            <input
              id="quota-amount"
              type="number"
              min="1"
              max={maxQuotasAvailable}
              value={amount || ''}
              onChange={handleAmountChange}
              className="tsf-input tsf-w-full"
              autoFocus
            />
            {error && (
              <p className="tsf-text-sm tsf-text-error tsf-mt-xs">{error}</p>
            )}
          </div>
          
          <div className="tsf-text-sm tsf-mb-md">
            <p>Maximum available to issue: <strong>{maxQuotasAvailable}</strong> quotas</p>
          </div>
        </form>
      </div>
    </Modal>
  );
};

export default IssueQuotasModal;