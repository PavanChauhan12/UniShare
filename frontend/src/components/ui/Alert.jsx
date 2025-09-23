import React from 'react';
import { CheckCircle, XCircle, Clock, Bell, X } from 'lucide-react';

const Alert = ({ type = "info", message, onClose }) => {
  const types = {
    success: "bg-green-50 text-green-800 border-green-200",
    error: "bg-red-50 text-red-800 border-red-200",
    warning: "bg-yellow-50 text-yellow-800 border-yellow-200",
    info: "bg-blue-50 text-blue-800 border-blue-200",
  };

  const icons = {
    success: <CheckCircle size={20} />,
    error: <XCircle size={20} />,
    warning: <Clock size={20} />,
    info: <Bell size={20} />,
  };

  return (
    <div className={`flex items-center p-4 border rounded-lg ${types[type]} mb-4`}>
      <div className="mr-3">
        {icons[type]}
      </div>
      <div className="flex-1">{message}</div>
      {onClose && (
        <button onClick={onClose} className="ml-3 text-current opacity-70 hover:opacity-100">
          <X size={16} />
        </button>
      )}
    </div>
  );
};

export default Alert;