import React, { useEffect } from 'react';

interface ToastProps {
  message: string;
  type: 'success' | 'error' | 'info';
  onClose: () => void;
}

const Toast: React.FC<ToastProps> = ({ message, type, onClose }) => {
  useEffect(() => {
    const timer = setTimeout(onClose, 4000);
    return () => clearTimeout(timer);
  }, [onClose]);

  const bgColors = {
    success: 'bg-emerald-600',
    error: 'bg-red-500',
    info: 'bg-blue-600'
  };

  const icons = {
    success: 'fa-check-circle',
    error: 'fa-exclamation-circle',
    info: 'fa-info-circle'
  };

  return (
    <div className={`fixed bottom-6 right-6 z-50 flex items-center gap-3 px-6 py-4 rounded-xl shadow-2xl text-white transform transition-all animate-slide-up ${bgColors[type]}`}>
      <i className={`fas ${icons[type]} text-lg`}></i>
      <span className="font-medium">{message}</span>
      <button onClick={onClose} className="ml-4 opacity-70 hover:opacity-100">
        <i className="fas fa-times"></i>
      </button>
    </div>
  );
};

export default Toast;