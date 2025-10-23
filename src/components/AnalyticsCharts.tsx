// components/AnalyticsCharts.tsx
import { useProjects } from "../context/ProjectContext";
import { TrendingUp, DollarSign, Clock, CheckCircle } from "lucide-react";
import { motion } from "framer-motion";

export default function AnalyticsCharts() {
  const { projects } = useProjects();

  // Calculate monthly earnings for the last 6 months
  const getMonthlyEarnings = () => {
    const months = [];
    const earnings = [];
    
    for (let i = 5; i >= 0; i--) {
      const date = new Date();
      date.setMonth(date.getMonth() - i);
      const monthName = date.toLocaleDateString('en-US', { month: 'short' });
      months.push(monthName);
      
      // Calculate earnings for this month
      const monthEarnings = projects
        .filter(p => {
          const projectDate = new Date(p.createdAt);
          return projectDate.getMonth() === date.getMonth() && 
                 projectDate.getFullYear() === date.getFullYear() &&
                 p.status === 'completed';
        })
        .reduce((sum, p) => sum + p.payment, 0);
      
      earnings.push(monthEarnings);
    }
    
    return { months, earnings };
  };

  // Calculate payment status distribution
  const getPaymentStatusData = () => {
    const pending = projects.filter(p => p.status === 'ongoing').length;
    const completed = projects.filter(p => p.status === 'completed').length;
    
    return [
      { label: 'Completed', value: completed, color: 'bg-green-500' },
      { label: 'Pending', value: pending, color: 'bg-orange-500' }
    ];
  };

  // Calculate total earnings over time
  const getTotalEarningsData = () => {
    const totalEarnings = projects
      .filter(p => p.status === 'completed')
      .reduce((sum, p) => sum + p.payment, 0);
    
    const pendingEarnings = projects
      .filter(p => p.status === 'ongoing')
      .reduce((sum, p) => sum + p.payment, 0);
    
    return {
      total: totalEarnings,
      pending: pendingEarnings,
      potential: totalEarnings + pendingEarnings
    };
  };

  const monthlyData = getMonthlyEarnings();
  const paymentStatusData = getPaymentStatusData();
  const earningsData = getTotalEarningsData();

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(amount);
  };

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Analytics</h2>
      
      {/* Monthly Earnings Chart */}
      <div className="bg-white dark:bg-neutral-900 rounded-xl border border-gray-200 dark:border-neutral-800 p-6">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Monthly Earnings</h3>
          <TrendingUp className="w-5 h-5 text-blue-600" />
        </div>
        
        <div className="space-y-4">
          {monthlyData.months.map((month, index) => (
            <div key={month} className="flex items-center space-x-4">
              <div className="w-16 text-sm font-medium text-gray-600 dark:text-gray-400">
                {month}
              </div>
              <div className="flex-1 bg-gray-200 dark:bg-neutral-800 rounded-full h-4 relative overflow-hidden">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${(monthlyData.earnings[index] / Math.max(...monthlyData.earnings, 1)) * 100}%` }}
                  transition={{ delay: index * 0.1, duration: 0.5 }}
                  className="h-full bg-gradient-to-r from-blue-500 to-purple-600 rounded-full"
                />
              </div>
              <div className="w-20 text-sm font-semibold text-gray-900 dark:text-white text-right">
                {formatCurrency(monthlyData.earnings[index])}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Payment Status Distribution */}
      <div className="bg-white dark:bg-neutral-900 rounded-xl border border-gray-200 dark:border-neutral-800 p-6">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Project Status</h3>
          <Clock className="w-5 h-5 text-orange-600" />
        </div>
        
        <div className="space-y-4">
          {paymentStatusData.map((item, index) => (
            <motion.div
              key={item.label}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
              className="flex items-center space-x-4"
            >
              <div className="flex items-center space-x-3">
                <div className={`w-4 h-4 rounded-full ${item.color}`} />
                <span className="text-sm font-medium text-gray-900 dark:text-white">
                  {item.label}
                </span>
              </div>
              <div className="flex-1 bg-gray-200 dark:bg-neutral-800 rounded-full h-4 relative overflow-hidden">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${(item.value / (paymentStatusData[0].value + paymentStatusData[1].value)) * 100}%` }}
                  transition={{ delay: index * 0.1 + 0.2, duration: 0.5 }}
                  className={`h-full ${item.color} rounded-full`}
                />
              </div>
              <div className="w-12 text-sm font-semibold text-gray-900 dark:text-white text-right">
                {item.value}
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Total Earnings Summary */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-white dark:bg-neutral-900 rounded-xl border border-gray-200 dark:border-neutral-800 p-6"
        >
          <div className="flex items-center space-x-3 mb-4">
            <div className="p-2 bg-green-100 dark:bg-green-900/20 rounded-lg">
              <CheckCircle className="w-5 h-5 text-green-600" />
            </div>
            <h4 className="font-semibold text-gray-900 dark:text-white">Total Earned</h4>
          </div>
          <p className="text-2xl font-bold text-green-600 dark:text-green-400">
            {formatCurrency(earningsData.total)}
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-white dark:bg-neutral-900 rounded-xl border border-gray-200 dark:border-neutral-800 p-6"
        >
          <div className="flex items-center space-x-3 mb-4">
            <div className="p-2 bg-orange-100 dark:bg-orange-900/20 rounded-lg">
              <Clock className="w-5 h-5 text-orange-600" />
            </div>
            <h4 className="font-semibold text-gray-900 dark:text-white">Pending</h4>
          </div>
          <p className="text-2xl font-bold text-orange-600 dark:text-orange-400">
            {formatCurrency(earningsData.pending)}
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-white dark:bg-neutral-900 rounded-xl border border-gray-200 dark:border-neutral-800 p-6"
        >
          <div className="flex items-center space-x-3 mb-4">
            <div className="p-2 bg-blue-100 dark:bg-blue-900/20 rounded-lg">
              <DollarSign className="w-5 h-5 text-blue-600" />
            </div>
            <h4 className="font-semibold text-gray-900 dark:text-white">Potential</h4>
          </div>
          <p className="text-2xl font-bold text-blue-600 dark:text-blue-400">
            {formatCurrency(earningsData.potential)}
          </p>
        </motion.div>
      </div>
    </div>
  );
}
