import React, { useEffect } from 'react';
import Button from '../Button';
import './Modal.css';

export interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  variant?: 'default' | 'confirmation' | 'success' | 'error' | 'warning';
  children: React.ReactNode;
  footer?: React.ReactNode;
  className?: string;
  closeOnOverlayClick?: boolean;
  showCloseButton?: boolean;
}

const Modal: React.FC<ModalProps> = ({
  isOpen,
  onClose,
  title,
  size = 'md',
  variant = 'default',
  children,
  footer,
  className = '',
  closeOnOverlayClick = true,
  showCloseButton = true,
}) => {
  // Handle escape key
  useEffect(() => {
    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape' && isOpen) {
        onClose();
      }
    };

    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, [isOpen, onClose]);

  // Prevent body scroll when modal is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }

    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  if (!isOpen) return null;

  const handleOverlayClick = (event: React.MouseEvent<HTMLDivElement>) => {
    if (event.target === event.currentTarget && closeOnOverlayClick) {
      onClose();
    }
  };

  const modalClasses = [
    'tsf-modal',
    `tsf-modal--${size}`,
    `tsf-modal--${variant}`,
    className,
  ].filter(Boolean).join(' ');

  return (
    <div className="tsf-modal-overlay animate-fade-in" onClick={handleOverlayClick}>
      <div className={`${modalClasses} animate-scale-in`}>
        {(title || showCloseButton) && (
          <div className="tsf-modal__header">
            {title && <h2 className="tsf-modal__title">{title}</h2>}
            {showCloseButton && (
              <Button
                variant="ghost"
                size="sm"
                onClick={onClose}
                className="tsf-modal__close"
                aria-label="Close modal"
              >
                <svg
                  width="16"
                  height="16"
                  viewBox="0 0 16 16"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M12 4L4 12M4 4L12 12"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </Button>
            )}
          </div>
        )}

        <div className="tsf-modal__content">
          {children}
        </div>

        {footer && (
          <div className="tsf-modal__footer">
            {footer}
          </div>
        )}
      </div>
    </div>
  );
};

export default Modal;