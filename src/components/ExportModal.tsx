// components/ExportModal.tsx
import { useState } from "react";
import { Download, FileText, FileSpreadsheet, X } from "lucide-react";
import { motion } from "framer-motion";
import type { Project, Client, Payment } from "../types";

interface ExportModalProps {
  isOpen: boolean;
  onClose: () => void;
  projects: Project[];
  clients: Client[];
  payments: Payment[];
}

export default function ExportModal({ isOpen, onClose, projects, clients, payments }: ExportModalProps) {
  const [selectedFormat, setSelectedFormat] = useState<'csv' | 'pdf'>('csv');
  const [selectedData, setSelectedData] = useState<('projects' | 'clients' | 'payments')[]>(['projects']);

  if (!isOpen) return null;

  const exportToCSV = (data: any[], filename: string) => {
    if (data.length === 0) return;

    const headers = Object.keys(data[0]);
    const csvContent = [
      headers.join(','),
      ...data.map(row => headers.map(header => `"${row[header] || ''}"`).join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${filename}.csv`;
    link.click();
    window.URL.revokeObjectURL(url);
  };

  const exportToPDF = (data: any[], filename: string) => {
    // Simple PDF generation (in a real app, you'd use a library like jsPDF)
    const content = data.map(item => JSON.stringify(item, null, 2)).join('\n\n');
    const blob = new Blob([content], { type: 'text/plain' });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${filename}.txt`; // Fallback to text file
    link.click();
    window.URL.revokeObjectURL(url);
  };

  const handleExport = () => {
    selectedData.forEach(dataType => {
      let data: any[] = [];
      let filename = '';

      switch (dataType) {
        case 'projects':
          data = projects.map(p => ({
            title: p.title,
            client: p.client,
            deadline: p.deadline,
            payment: p.payment,
            status: p.status,
            createdAt: p.createdAt.toISOString()
          }));
          filename = 'projects';
          break;
        case 'clients':
          data = clients.map(c => ({
            name: c.name,
            email: c.email,
            phone: c.phone,
            country: c.country || '',
            createdAt: c.createdAt.toISOString()
          }));
          filename = 'clients';
          break;
        case 'payments':
          data = payments.map(p => ({
            projectId: p.projectId,
            amount: p.amount,
            status: p.status,
            dueDate: p.dueDate,
            description: p.description || '',
            createdAt: p.createdAt.toISOString()
          }));
          filename = 'payments';
          break;
      }

      if (selectedFormat === 'csv') {
        exportToCSV(data, filename);
      } else {
        exportToPDF(data, filename);
      }
    });

    onClose();
  };

  const dataOptions = [
    { id: 'projects', label: 'Projects', count: projects.length },
    { id: 'clients', label: 'Clients', count: clients.length },
    { id: 'payments', label: 'Payments', count: payments.length },
  ];

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
      <motion.div
        initial={{ opacity: 0, scale: 0.9, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.9, y: 20 }}
        className="bg-white dark:bg-neutral-900 rounded-2xl w-full max-w-md border border-gray-200 dark:border-neutral-800 shadow-2xl"
      >
        <div className="p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Export Data</h2>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={onClose}
              className="p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors rounded-lg hover:bg-gray-100 dark:hover:bg-neutral-800"
            >
              <X className="w-5 h-5" />
            </motion.button>
          </div>

          {/* Format Selection */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
              Export Format
            </label>
            <div className="grid grid-cols-2 gap-3">
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => setSelectedFormat('csv')}
                className={`flex items-center space-x-2 p-3 rounded-lg border transition-colors ${
                  selectedFormat === 'csv'
                    ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300'
                    : 'border-gray-300 dark:border-neutral-700 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-neutral-800'
                }`}
              >
                <FileSpreadsheet className="w-5 h-5" />
                <span className="font-medium">CSV</span>
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => setSelectedFormat('pdf')}
                className={`flex items-center space-x-2 p-3 rounded-lg border transition-colors ${
                  selectedFormat === 'pdf'
                    ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300'
                    : 'border-gray-300 dark:border-neutral-700 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-neutral-800'
                }`}
              >
                <FileText className="w-5 h-5" />
                <span className="font-medium">PDF</span>
              </motion.button>
            </div>
          </div>

          {/* Data Selection */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
              Select Data to Export
            </label>
            <div className="space-y-2">
              {dataOptions.map((option) => (
                <label key={option.id} className="flex items-center space-x-3 p-3 rounded-lg hover:bg-gray-50 dark:hover:bg-neutral-800 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={selectedData.includes(option.id as any)}
                    onChange={(e) => {
                      if (e.target.checked) {
                        setSelectedData([...selectedData, option.id as any]);
                      } else {
                        setSelectedData(selectedData.filter(item => item !== option.id));
                      }
                    }}
                    className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                  />
                  <span className="flex-1 text-gray-900 dark:text-white">{option.label}</span>
                  <span className="text-sm text-gray-500 dark:text-gray-400">({option.count} items)</span>
                </label>
              ))}
            </div>
          </div>

          {/* Export Button */}
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={handleExport}
            disabled={selectedData.length === 0}
            className="w-full flex items-center justify-center space-x-2 px-4 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg hover:from-blue-700 hover:to-purple-700 transition-all font-medium disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Download className="w-5 h-5" />
            <span>Export Data</span>
          </motion.button>
        </div>
      </motion.div>
    </div>
  );
}
