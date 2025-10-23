// components/PaymentTracker.tsx
// import { useState } from "react";
import { useProjects } from "../context/ProjectContext";
// import type { Payment } from "../types";
import { DollarSign, Clock, CheckCircle, AlertCircle, TrendingUp } from "lucide-react";
import { motion } from "framer-motion";

export default function PaymentTracker() {
  const { projects, payments } = useProjects();
  // const [isFormOpen, setIsFormOpen] = useState(false);
  // const [editingPayment, setEditingPayment] = useState<Payment | null>(null);

  // Calculate payment statistics
  const totalEarnings = projects
    .filter(p => p.status === 'completed')
    .reduce((sum, p) => sum + p.payment, 0);

  const pendingPayments = projects
    .filter(p => p.status === 'ongoing')
    .reduce((sum, p) => sum + p.payment, 0);

  const paidPayments = payments
    .filter(p => p.status === 'paid')
    .reduce((sum, p) => sum + p.amount, 0);

  const overduePayments = payments
    .filter(p => p.status === 'pending' && new Date(p.dueDate) < new Date())
    .reduce((sum, p) => sum + p.amount, 0);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(amount);
  };

  const stats = [
    {
      title: 'Total Earnings',
      value: formatCurrency(totalEarnings),
      icon: TrendingUp,
      color: 'text-green-600',
      bgColor: 'bg-green-100 dark:bg-green-900/20',
      borderColor: 'border-green-200 dark:border-green-800',
    },
    {
      title: 'Pending Payments',
      value: formatCurrency(pendingPayments),
      icon: Clock,
      color: 'text-orange-600',
      bgColor: 'bg-orange-100 dark:bg-orange-900/20',
      borderColor: 'border-orange-200 dark:border-orange-800',
    },
    {
      title: 'Paid Payments',
      value: formatCurrency(paidPayments),
      icon: CheckCircle,
      color: 'text-blue-600',
      bgColor: 'bg-blue-100 dark:bg-blue-900/20',
      borderColor: 'border-blue-200 dark:border-blue-800',
    },
    {
      title: 'Overdue Payments',
      value: formatCurrency(overduePayments),
      icon: AlertCircle,
      color: 'text-red-600',
      bgColor: 'bg-red-100 dark:bg-red-900/20',
      borderColor: 'border-red-200 dark:border-red-800',
    },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Payment Tracker</h2>
          <p className="text-gray-600 dark:text-gray-400 mt-1">Monitor your earnings and payment status</p>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className={`bg-white dark:bg-neutral-900 rounded-xl border ${stat.borderColor} p-6 hover:shadow-lg transition-all duration-300`}
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-1">
                  {stat.title}
                </p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">
                  {stat.value}
                </p>
              </div>
              <div className={`p-3 rounded-lg ${stat.bgColor}`}>
                <stat.icon className={`w-6 h-6 ${stat.color}`} />
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Payment Breakdown */}
      <div className="bg-white dark:bg-neutral-900 rounded-xl border border-gray-200 dark:border-neutral-800 p-6">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Payment Breakdown</h3>
        
        <div className="space-y-4">
          {/* Completed Projects */}
          <div className="flex items-center justify-between p-4 bg-green-50 dark:bg-green-900/10 rounded-lg border border-green-200 dark:border-green-800">
            <div className="flex items-center space-x-3">
              <CheckCircle className="w-5 h-5 text-green-600" />
              <span className="font-medium text-gray-900 dark:text-white">Completed Projects</span>
            </div>
            <span className="text-lg font-semibold text-green-600">
              {formatCurrency(totalEarnings)}
            </span>
          </div>

          {/* Ongoing Projects */}
          <div className="flex items-center justify-between p-4 bg-orange-50 dark:bg-orange-900/10 rounded-lg border border-orange-200 dark:border-orange-800">
            <div className="flex items-center space-x-3">
              <Clock className="w-5 h-5 text-orange-600" />
              <span className="font-medium text-gray-900 dark:text-white">Ongoing Projects</span>
            </div>
            <span className="text-lg font-semibold text-orange-600">
              {formatCurrency(pendingPayments)}
            </span>
          </div>

          {/* Total Potential */}
          <div className="flex items-center justify-between p-4 bg-blue-50 dark:bg-blue-900/10 rounded-lg border border-blue-200 dark:border-blue-800">
            <div className="flex items-center space-x-3">
              <DollarSign className="w-5 h-5 text-blue-600" />
              <span className="font-medium text-gray-900 dark:text-white">Total Project Value</span>
            </div>
            <span className="text-lg font-semibold text-blue-600">
              {formatCurrency(totalEarnings + pendingPayments)}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
