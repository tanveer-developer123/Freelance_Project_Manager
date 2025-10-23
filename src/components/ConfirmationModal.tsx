// components/ConfirmationModal.tsx
import { motion } from "framer-motion";
import { AlertTriangle, X } from "lucide-react";

interface ConfirmationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
  type?: 'danger' | 'warning' | 'info';
}

export default function ConfirmationModal({
  isOpen,
  onClose,
  onConfirm,
  title,
  message,
  confirmText = 'Confirm',
  cancelText = 'Cancel',
  type = 'danger'
}: ConfirmationModalProps) {
  if (!isOpen) return null;

  const getTypeStyles = () => {
    switch (type) {
      case 'danger':
        return {
          iconColor: 'text-red-600',
          iconBg: 'bg-red-100 dark:bg-red-900/20',
          buttonColor: 'bg-red-600 hover:bg-red-700',
          borderColor: 'border-red-200 dark:border-red-800'
        };
      case 'warning':
        return {
          iconColor: 'text-orange-600',
          iconBg: 'bg-orange-100 dark:bg-orange-900/20',
          buttonColor: 'bg-orange-600 hover:bg-orange-700',
          borderColor: 'border-orange-200 dark:border-orange-800'
        };
      default:
        return {
          iconColor: 'text-blue-600',
          iconBg: 'bg-blue-100 dark:bg-blue-900/20',
          buttonColor: 'bg-blue-600 hover:bg-blue-700',
          borderColor: 'border-blue-200 dark:border-blue-800'
        };
    }
  };

  const styles = getTypeStyles();

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
      <motion.div
        initial={{ opacity: 0, scale: 0.9, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.9, y: 20 }}
        className="bg-white dark:bg-neutral-900 rounded-2xl w-full max-w-md border border-gray-200 dark:border-neutral-800 shadow-2xl"
      >
        <div className="p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-3">
              <div className={`p-2 rounded-lg ${styles.iconBg}`}>
                <AlertTriangle className={`w-6 h-6 ${styles.iconColor}`} />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                {title}
              </h3>
            </div>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={onClose}
              className="p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors rounded-lg hover:bg-gray-100 dark:hover:bg-neutral-800"
            >
              <X className="w-5 h-5" />
            </motion.button>
          </div>

          <p className="text-gray-600 dark:text-gray-400 mb-6">
            {message}
          </p>

          <div className="flex justify-end space-x-3">
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={onClose}
              className="px-4 py-2 text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-neutral-800 rounded-lg hover:bg-gray-200 dark:hover:bg-neutral-700 transition-colors font-medium"
            >
              {cancelText}
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={onConfirm}
              className={`px-4 py-2 text-white rounded-lg transition-colors font-medium ${styles.buttonColor}`}
            >
              {confirmText}
            </motion.button>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
