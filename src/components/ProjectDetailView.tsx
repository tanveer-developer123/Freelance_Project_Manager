// components/ProjectDetailView.tsx
import { useState } from "react";
import type { Project, Task, ProjectFile } from "../types";
import {
  Calendar,
  DollarSign,
  User,
  Edit,
  Trash2,
  Plus,
  CheckCircle,
  FileText,
  Upload,
  X
} from "lucide-react";
import { motion } from "framer-motion";

interface ProjectDetailViewProps {
  project: Project;
  onEdit: (project: Project) => void;
  onDelete: (id: string) => void;
  onClose: () => void;
}

export default function ProjectDetailView({ project, onEdit, onDelete, onClose }: ProjectDetailViewProps) {
  const [activeTab, setActiveTab] = useState('overview');
  const [newTask, setNewTask] = useState('');
  const [tasks, setTasks] = useState<Task[]>(project.tasks || []);
  const [files] = useState<ProjectFile[]>(project.files || []);

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

  const addTask = () => {
    if (newTask.trim()) {
      const task: Task = {
        id: Date.now().toString(),
        title: newTask,
        completed: false,
        createdAt: new Date(),
        updatedAt: new Date()
      };
      setTasks([...tasks, task]);
      setNewTask('');
    }
  };

  const toggleTask = (taskId: string) => {
    setTasks(tasks.map(task =>
      task.id === taskId ? { ...task, completed: !task.completed } : task
    ));
  };

  const deleteTask = (taskId: string) => {
    setTasks(tasks.filter(task => task.id !== taskId));
  };

  const tabs = [
    { id: 'overview', label: 'Overview', icon: FileText },
    { id: 'tasks', label: 'Tasks', icon: CheckCircle },
    { id: 'files', label: 'Files', icon: Upload },
  ];

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
      <motion.div
        initial={{ opacity: 0, scale: 0.9, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.9, y: 20 }}
        className="bg-white dark:bg-neutral-900 rounded-2xl w-full max-w-4xl max-h-[90vh] overflow-hidden border border-gray-200 dark:border-neutral-800 shadow-2xl"
      >
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-neutral-800">
          <div className="flex items-center space-x-4">
            <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center shadow-lg">
              <FileText className="w-6 h-6 text-white" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white">{project.title}</h2>
              <p className="text-gray-600 dark:text-gray-400">Project Details</p>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => onEdit(project)}
              className="p-2 text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors rounded-lg hover:bg-blue-50 dark:hover:bg-blue-900/20"
            >
              <Edit className="w-5 h-5" />
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => onDelete(project.id)}
              className="p-2 text-gray-400 hover:text-red-600 dark:hover:text-red-400 transition-colors rounded-lg hover:bg-red-50 dark:hover:bg-red-900/20"
            >
              <Trash2 className="w-5 h-5" />
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={onClose}
              className="p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors rounded-lg hover:bg-gray-100 dark:hover:bg-neutral-800"
            >
              <X className="w-5 h-5" />
            </motion.button>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex border-b border-gray-200 dark:border-neutral-800">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center space-x-2 px-6 py-4 font-medium transition-colors ${activeTab === tab.id
                  ? 'text-blue-600 dark:text-blue-400 border-b-2 border-blue-600 dark:border-blue-400'
                  : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
                }`}
            >
              <tab.icon className="w-5 h-5" />
              <span>{tab.label}</span>
            </button>
          ))}
        </div>

        {/* Content */}
        <div className="p-6 max-h-96 overflow-y-auto">
          {activeTab === 'overview' && (
            <div className="space-y-6">
              {/* Project Info */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div className="flex items-center space-x-3">
                    <User className="w-5 h-5 text-gray-400" />
                    <div>
                      <p className="text-sm text-gray-600 dark:text-gray-400">Client</p>
                      <p className="font-medium text-gray-900 dark:text-white">{project.client}</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-3">
                    <Calendar className="w-5 h-5 text-gray-400" />
                    <div>
                      <p className="text-sm text-gray-600 dark:text-gray-400">Deadline</p>
                      <p className={`font-medium ${isOverdue ? 'text-red-600 dark:text-red-400' : 'text-gray-900 dark:text-white'}`}>
                        {formatDate(project.deadline)}
                        {isOverdue && ' (Overdue)'}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-3">
                    <DollarSign className="w-5 h-5 text-gray-400" />
                    <div>
                      <p className="text-sm text-gray-600 dark:text-gray-400">Payment</p>
                      <p className="font-medium text-green-600 dark:text-green-400">{formatCurrency(project.payment)}</p>
                    </div>
                  </div>
                </div>
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">Description</p>
                  <p className="text-gray-900 dark:text-white">
                    {project.description || 'No description provided'}
                  </p>
                </div>
              </div>

              {/* Status */}
              <div className="flex items-center space-x-3">
                <span className={`px-3 py-1 rounded-full text-sm font-medium ${project.status === 'completed'
                    ? 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-300'
                    : 'bg-orange-100 text-orange-800 dark:bg-orange-900/20 dark:text-orange-300'
                  }`}>
                  {project.status.charAt(0).toUpperCase() + project.status.slice(1)}
                </span>
                {isOverdue && (
                  <span className="px-3 py-1 rounded-full text-sm font-medium bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-300">
                    Overdue
                  </span>
                )}
              </div>
            </div>
          )}

          {activeTab === 'tasks' && (
            <div className="space-y-4">
              <div className="flex items-center space-x-3 mb-4">
                <input
                  type="text"
                  placeholder="Add a new task..."
                  value={newTask}
                  onChange={(e) => setNewTask(e.target.value)}
                  className="flex-1 px-3 py-2 border border-gray-300 dark:border-neutral-700 dark:bg-neutral-800 dark:text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={addTask}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  <Plus className="w-4 h-4" />
                </motion.button>
              </div>

              <div className="space-y-2">
                {tasks.map((task) => (
                  <motion.div
                    key={task.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="flex items-center space-x-3 p-3 bg-gray-50 dark:bg-neutral-800 rounded-lg"
                  >
                    <button
                      onClick={() => toggleTask(task.id)}
                      className={`w-5 h-5 rounded border-2 flex items-center justify-center transition-colors ${task.completed
                          ? 'bg-green-500 border-green-500 text-white'
                          : 'border-gray-300 dark:border-gray-600'
                        }`}
                    >
                      {task.completed && <CheckCircle className="w-3 h-3" />}
                    </button>
                    <span className={`flex-1 ${task.completed ? 'line-through text-gray-500' : 'text-gray-900 dark:text-white'}`}>
                      {task.title}
                    </span>
                    <button
                      onClick={() => deleteTask(task.id)}
                      className="p-1 text-gray-400 hover:text-red-600 transition-colors"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </motion.div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'files' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Project Files</h3>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  <Upload className="w-4 h-4" />
                  <span>Upload File</span>
                </motion.button>
              </div>

              <div className="space-y-2">
                {files.length === 0 ? (
                  <p className="text-gray-500 dark:text-gray-400 text-center py-8">No files uploaded yet</p>
                ) : (
                  files.map((file) => (
                    <div key={file.id} className="flex items-center space-x-3 p-3 bg-gray-50 dark:bg-neutral-800 rounded-lg">
                      <FileText className="w-5 h-5 text-gray-400" />
                      <div className="flex-1">
                        <p className="font-medium text-gray-900 dark:text-white">{file.name}</p>
                        <p className="text-sm text-gray-500 dark:text-gray-400">
                          {(file.size / 1024).toFixed(1)} KB • {file.type}
                        </p>
                      </div>
                      <button className="p-1 text-gray-400 hover:text-red-600 transition-colors">
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  ))
                )}
              </div>
            </div>
          )}
        </div>
      </motion.div>
    </div>
  );
}
