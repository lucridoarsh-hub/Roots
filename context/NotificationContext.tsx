'use client'
import React, { createContext, useContext, useState, ReactNode } from 'react';
import { Mail, CheckCircle, XCircle, X } from 'lucide-react';

type NotificationType = 'SUCCESS' | 'ERROR' | 'INFO' | 'EMAIL';

interface Toast {
  id: string;
  message: string;
  type: NotificationType;
}

interface NotificationContextType {
  showToast: (message: string, type?: NotificationType) => void;
}

const NotificationContext = createContext<NotificationContextType | undefined>(undefined);

export const NotificationProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const showToast = (message: string, type: NotificationType = 'SUCCESS') => {
    const id = Math.random().toString(36).substring(2, 9);
    setToasts(prev => [...prev, { id, message, type }]);
    
    // Auto-remove after 6 seconds
    setTimeout(() => {
      setToasts(prev => prev.filter(t => t.id !== id));
    }, 6000);
  };

  const removeToast = (id: string) => {
    setToasts(prev => prev.filter(t => t.id !== id));
  };

  return (
    <NotificationContext.Provider value={{ showToast }}>
      {children}
      <div className="fixed bottom-6 right-6 z-[9999] flex flex-col gap-3 pointer-events-none">
        {toasts.map((toast) => (
          <div 
            key={toast.id} 
            className={`pointer-events-auto flex items-center gap-3 px-5 py-4 rounded-2xl shadow-2xl border animate-fade-in-up min-w-[300px] max-w-md ${
              toast.type === 'SUCCESS' ? 'bg-emerald-50 border-emerald-100 text-emerald-900' :
              toast.type === 'ERROR' ? 'bg-rose-50 border-rose-100 text-rose-900' :
              toast.type === 'EMAIL' ? 'bg-brand-50 border-brand-100 text-brand-900' :
              'bg-blue-50 border-blue-100 text-blue-900'
            }`}
          >
            <div className="shrink-0">
              {toast.type === 'SUCCESS' && <CheckCircle className="text-emerald-500" size={24} />}
              {toast.type === 'ERROR' && <XCircle className="text-rose-500" size={24} />}
              {toast.type === 'EMAIL' && <Mail className="text-brand-600" size={24} />}
              {toast.type === 'INFO' && <Mail className="text-blue-500" size={24} />}
            </div>
            <div className="flex-1">
              <p className="text-sm font-bold">{toast.type === 'EMAIL' ? 'Email Sent' : 'Success'}</p>
              <p className="text-xs opacity-80">{toast.message}</p>
            </div>
            <button onClick={() => removeToast(toast.id)} className="p-1 hover:bg-black/5 rounded-full transition-colors">
              <X size={16} />
            </button>
          </div>
        ))}
      </div>
    </NotificationContext.Provider>
  );
};

export const useNotification = () => {
  const context = useContext(NotificationContext);
  if (!context) throw new Error('useNotification must be used within a NotificationProvider');
  return context;
};
