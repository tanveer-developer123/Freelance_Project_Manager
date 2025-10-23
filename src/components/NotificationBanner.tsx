// components/NotificationBanner.tsx
import { useProjects } from "../context/ProjectContext";
import { AlertTriangle, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect } from "react";

export default function NotificationBanner() {
  const { projects, payments } = useProjects();
  const [isVisible, setIsVisible] = useState(true);

  const overdueProjects = projects.filter(p => 
    p.status === 'ongoing' && new Date(p.deadline) < new Date()
  );

  const overduePayments = payments.filter(p => 
    p.status === 'pending' && new Date(p.dueDate) < new Date()
  );

  const totalOverdue = overdueProjects.length + overduePayments.length;

  if (totalOverdue === 0 || !isVisible) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, y: -50 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -50 }}
        className="bg-gradient-to-r from-red-500 to-pink-600 text-white p-4 shadow-lg"
      >
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <AlertTriangle className="w-5 h-5" />
            <div>
              <h3 className="font-semibold">Overdue Items Alert</h3>
              <p className="text-sm opacity-90">
                You have {overdueProjects.length} overdue project{overdueProjects.length !== 1 ? 's' : ''} 
                {overduePayments.length > 0 && ` and ${overduePayments.length} overdue payment${overduePayments.length !== 1 ? 's' : ''}`}
              </p>
            </div>
          </div>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setIsVisible(false)}
            className="p-1 hover:bg-white/20 rounded-lg transition-colors"
          >
            <X className="w-4 h-4" />
          </motion.button>
        </div>
      </motion.div>
    </AnimatePresence>
  );
}
