// components/ProjectCard.tsx
import type { Project } from "../types";
import { Calendar, DollarSign, User, Edit, Trash2, Briefcase } from "lucide-react";
import { motion } from "framer-motion";

interface ProjectCardProps {
  project: Project;
  onEdit: (project: Project) => void;
  onDelete: (id: string) => void;
}

export default function ProjectCard({ project, onEdit, onDelete }: ProjectCardProps) {
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString();
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(amount);
  };

  const isOverdue = new Date(project.deadline) < new Date() && project.status === 'ongoing';

  const getStatusColor = (status: string) => {
    if (isOverdue) {
      return 'bg-gradient-to-r from-red-100 to-pink-100 dark:from-red-900/20 dark:to-pink-900/20 text-red-800 dark:text-red-300 border border-red-200 dark:border-red-800';
    }
    if (status === 'ongoing') {
      return 'bg-gradient-to-r from-orange-100 to-yellow-100 dark:from-orange-900/20 dark:to-yellow-900/20 text-orange-800 dark:text-orange-300 border border-orange-200 dark:border-orange-800';
    }
    return 'bg-gradient-to-r from-green-100 to-emerald-100 dark:from-green-900/20 dark:to-emerald-900/20 text-green-800 dark:text-green-300 border border-green-200 dark:border-green-800';
  };

  return (
    <motion.div
      whileHover={{ scale: 1.02, y: -2 }}
      className="bg-white dark:bg-neutral-900 rounded-xl border border-gray-200 dark:border-neutral-800 p-6 hover:shadow-xl dark:hover:shadow-2xl transition-all duration-300 group"
    >
      <div className="flex justify-between items-start mb-4">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center shadow-sm">
            <Briefcase className="w-5 h-5 text-white" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
              {project.title}
            </h3>
          </div>
        </div>
        <div className="flex space-x-1">
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={() => onEdit(project)}
            className="p-2 text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors rounded-lg hover:bg-blue-50 dark:hover:bg-blue-900/20"
          >
            <Edit className="w-4 h-4" />
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={() => onDelete(project.id)}
            className="p-2 text-gray-400 hover:text-red-600 dark:hover:text-red-400 transition-colors rounded-lg hover:bg-red-50 dark:hover:bg-red-900/20"
          >
            <Trash2 className="w-4 h-4" />
          </motion.button>
        </div>
      </div>

      <div className="space-y-3">
        <div className="flex items-center text-gray-600 dark:text-gray-400">
          <User className="w-4 h-4 mr-3 text-gray-400" />
          <span className="text-sm font-medium">{project.client}</span>
        </div>

        <div className="flex items-center text-gray-600 dark:text-gray-400">
          <Calendar className="w-4 h-4 mr-3 text-gray-400" />
          <span className="text-sm">Due: {formatDate(project.deadline)}</span>
        </div>

        <div className="flex items-center text-gray-600 dark:text-gray-400">
          <DollarSign className="w-4 h-4 mr-3 text-gray-400" />
          <span className="text-sm font-semibold text-green-600 dark:text-green-400">
            {formatCurrency(project.payment)}
          </span>
        </div>

        <div className="flex justify-between items-center pt-2">
          <div className="flex space-x-2">
            <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(project.status)}`}>
              {project.status.charAt(0).toUpperCase() + project.status.slice(1)}
            </span>
            {isOverdue && (
              <span className="px-3 py-1 rounded-full text-xs font-medium bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-300 border border-red-200 dark:border-red-800">
                Overdue
              </span>
            )}
          </div>
        </div>
      </div>
    </motion.div>
  );
}
