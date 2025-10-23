// components/TabbedDashboard.tsx
import { useState } from "react";
import { useProjects } from "../context/ProjectContext";
import type { Project, Client, FilterOptions } from "../types";
import ProjectCard from "./ProjectCard";
import ProjectForm from "./ProjectForm";
import ProjectDetailView from "./ProjectDetailView";
import ClientCard from "./ClientCard";
import ClientForm from "./ClientForm";
import PaymentTracker from "./PaymentTracker";
import SearchFilter from "./SearchFilter";
import AnalyticsCharts from "./AnalyticsCharts";
import ExportModal from "./ExportModal";
import ConfirmationModal from "./ConfirmationModal";
import NotificationBanner from "./NotificationBanner";
import ThemeTest from "./ThemeTest";
import { 
  Plus, 
  TrendingUp, 
  Users, 
  DollarSign, 
  Clock, 
  CheckCircle,
  Briefcase,
  UserPlus,
  BarChart3,
  Download,
  Eye
} from "lucide-react";
import { motion } from "framer-motion";

export default function TabbedDashboard() {
  const { 
    projects, 
    clients, 
    dashboardStats, 
    addProject, 
    updateProject, 
    deleteProject,
    addClient,
    updateClient,
    deleteClient
  } = useProjects();
  
  const [activeTab, setActiveTab] = useState('overview');
  const [isProjectFormOpen, setIsProjectFormOpen] = useState(false);
  const [isClientFormOpen, setIsClientFormOpen] = useState(false);
  const [isExportModalOpen, setIsExportModalOpen] = useState(false);
  const [isConfirmationOpen, setIsConfirmationOpen] = useState(false);
  const [editingProject, setEditingProject] = useState<Project | null>(null);
  const [editingClient, setEditingClient] = useState<Client | null>(null);
  const [viewingProject, setViewingProject] = useState<Project | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<{ type: 'project' | 'client', id: string } | null>(null);
  const [projectFilters, setProjectFilters] = useState<FilterOptions>({
    search: '',
    status: '',
    dateRange: { start: '', end: '' },
    amountRange: { min: 0, max: 100000 }
  });
  const [clientFilters, setClientFilters] = useState<FilterOptions>({
    search: '',
    status: '',
    dateRange: { start: '', end: '' },
    amountRange: { min: 0, max: 100000 }
  });

  const handleAddProject = () => {
    setEditingProject(null);
    setIsProjectFormOpen(true);
  };

  const handleEditProject = (project: Project) => {
    setEditingProject(project);
    setIsProjectFormOpen(true);
  };

  const handleSaveProject = async (projectData: Omit<Project, 'id' | 'createdAt' | 'updatedAt' | 'userId'>) => {
    if (editingProject) {
      await updateProject(editingProject.id, projectData);
    } else {
      await addProject(projectData);
    }
    setIsProjectFormOpen(false);
    setEditingProject(null);
  };


  const handleAddClient = () => {
    setEditingClient(null);
    setIsClientFormOpen(true);
  };

  const handleEditClient = (client: Client) => {
    setEditingClient(client);
    setIsClientFormOpen(true);
  };

  const handleSaveClient = async (clientData: Omit<Client, 'id' | 'createdAt' | 'updatedAt' | 'userId'>) => {
    if (editingClient) {
      await updateClient(editingClient.id, clientData);
    } else {
      await addClient(clientData);
    }
    setIsClientFormOpen(false);
    setEditingClient(null);
  };

  const handleDeleteClient = async (id: string) => {
    setDeleteTarget({ type: 'client', id });
    setIsConfirmationOpen(true);
  };

  const handleDeleteProject = async (id: string) => {
    setDeleteTarget({ type: 'project', id });
    setIsConfirmationOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (deleteTarget) {
      if (deleteTarget.type === 'project') {
        await deleteProject(deleteTarget.id);
      } else {
        await deleteClient(deleteTarget.id);
      }
    }
    setIsConfirmationOpen(false);
    setDeleteTarget(null);
  };

  const handleViewProject = (project: Project) => {
    setViewingProject(project);
  };

  const filterProjects = (projects: Project[], filters: FilterOptions) => {
    return projects.filter(project => {
      if (filters.search && !project.title.toLowerCase().includes(filters.search.toLowerCase()) && 
          !project.client.toLowerCase().includes(filters.search.toLowerCase())) {
        return false;
      }
      if (filters.status && project.status !== filters.status) {
        return false;
      }
      if (filters.dateRange.start && new Date(project.deadline) < new Date(filters.dateRange.start)) {
        return false;
      }
      if (filters.dateRange.end && new Date(project.deadline) > new Date(filters.dateRange.end)) {
        return false;
      }
      if (project.payment < filters.amountRange.min || project.payment > filters.amountRange.max) {
        return false;
      }
      return true;
    });
  };

  const filterClients = (clients: Client[], filters: FilterOptions) => {
    return clients.filter(client => {
      if (filters.search && !client.name.toLowerCase().includes(filters.search.toLowerCase()) && 
          !client.email.toLowerCase().includes(filters.search.toLowerCase())) {
        return false;
      }
      return true;
    });
  };

  const filteredProjects = filterProjects(projects, projectFilters);
  const filteredClients = filterClients(clients, clientFilters);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(amount);
  };

  const tabs = [
    { id: 'overview', label: 'Overview', icon: BarChart3 },
    { id: 'projects', label: 'Projects', icon: Briefcase },
    { id: 'clients', label: 'Clients', icon: Users },
    { id: 'payments', label: 'Payments', icon: DollarSign },
    { id: 'analytics', label: 'Analytics', icon: TrendingUp },
  ];

  const stats = [
    {
      title: 'Total Projects',
      value: dashboardStats.totalProjects,
      icon: TrendingUp,
      color: 'text-blue-600',
      bgColor: 'bg-blue-100 dark:bg-blue-900/20',
    },
    {
      title: 'Ongoing',
      value: dashboardStats.ongoingProjects,
      icon: Clock,
      color: 'text-orange-600',
      bgColor: 'bg-orange-100 dark:bg-orange-900/20',
    },
    {
      title: 'Completed',
      value: dashboardStats.completedProjects,
      icon: CheckCircle,
      color: 'text-green-600',
      bgColor: 'bg-green-100 dark:bg-green-900/20',
    },
    {
      title: 'Total Earnings',
      value: formatCurrency(dashboardStats.totalEarnings),
      icon: DollarSign,
      color: 'text-green-600',
      bgColor: 'bg-green-100 dark:bg-green-900/20',
    },
    {
      title: 'Pending Payments',
      value: formatCurrency(dashboardStats.pendingPayments),
      icon: DollarSign,
      color: 'text-red-600',
      bgColor: 'bg-red-100 dark:bg-red-900/20',
    },
    {
      title: 'Total Clients',
      value: dashboardStats.totalClients,
      icon: Users,
      color: 'text-purple-600',
      bgColor: 'bg-purple-100 dark:bg-purple-900/20',
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-100 dark:from-neutral-900 dark:via-neutral-900 dark:to-black">
      <NotificationBanner />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <div className="flex justify-between items-start">
            <div>
              <h1 className="text-4xl font-bold bg-gradient-to-r from-gray-900 to-gray-600 dark:from-white dark:to-gray-300 bg-clip-text text-transparent">
                Freelance Dashboard
              </h1>
              <p className="text-gray-600 dark:text-gray-400 mt-2 text-lg">
                Manage your projects, clients, and payments in one place
              </p>
            </div>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setIsExportModalOpen(true)}
              className="flex items-center space-x-2 px-4 py-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg hover:from-blue-700 hover:to-purple-700 transition-all shadow-lg"
            >
              <Download className="w-4 h-4" />
              <span>Export Data</span>
            </motion.button>
          </div>
        </motion.div>

        {/* Tabs */}
        <div className="mb-8">
          <div className="flex space-x-1 bg-white dark:bg-neutral-900 rounded-xl p-1 border border-gray-200 dark:border-neutral-800 shadow-sm">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center space-x-2 px-4 py-3 rounded-lg font-medium transition-all duration-200 ${
                  activeTab === tab.id
                    ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg'
                    : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white hover:bg-gray-50 dark:hover:bg-neutral-800'
                }`}
              >
                <tab.icon className="w-5 h-5" />
                <span>{tab.label}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Tab Content */}
        <motion.div
          key={activeTab}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          {activeTab === 'overview' && (
            <div className="space-y-8">
              {/* Stats Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {stats.map((stat, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="bg-white dark:bg-neutral-900 rounded-xl border border-gray-200 dark:border-neutral-800 p-6 hover:shadow-lg transition-all duration-300"
                  >
                    <div className="flex items-center">
                      <div className={`p-3 rounded-lg ${stat.bgColor}`}>
                        <stat.icon className={`w-6 h-6 ${stat.color}`} />
                      </div>
                      <div className="ml-4">
                        <p className="text-sm font-medium text-gray-600 dark:text-gray-400">{stat.title}</p>
                        <p className="text-2xl font-bold text-gray-900 dark:text-white">{stat.value}</p>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>

              {/* Recent Projects */}
              <div className="bg-white dark:bg-neutral-900 rounded-xl border border-gray-200 dark:border-neutral-800 p-6">
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Recent Projects</h2>
                  <button
                    onClick={() => setActiveTab('projects')}
                    className="text-blue-600 hover:text-blue-700 font-medium"
                  >
                    View All
                  </button>
                </div>
                {projects.length === 0 ? (
                  <div className="text-center py-8">
                    <Briefcase className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                    <p className="text-gray-500 dark:text-gray-400">No projects yet</p>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {projects.slice(0, 3).map((project) => (
                      <ProjectCard
                        key={project.id}
                        project={project}
                        onEdit={handleEditProject}
                        onDelete={handleDeleteProject}
                      />
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}

          {activeTab === 'projects' && (
            <div className="space-y-6">
              <div className="flex justify-between items-center">
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Projects</h2>
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={handleAddProject}
                  className="flex items-center px-4 py-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg hover:from-blue-700 hover:to-purple-700 transition-all shadow-lg"
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Add Project
                </motion.button>
              </div>

              <SearchFilter
                onFilterChange={setProjectFilters}
                type="projects"
              />

              {filteredProjects.length === 0 ? (
                <div className="text-center py-12 bg-white dark:bg-neutral-900 rounded-xl border border-gray-200 dark:border-neutral-800">
                  <Briefcase className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                    {projects.length === 0 ? 'No projects yet' : 'No projects match your filters'}
                  </h3>
                  <p className="text-gray-600 dark:text-gray-400 mb-6">
                    {projects.length === 0 ? 'Get started by creating your first project' : 'Try adjusting your search or filter criteria'}
                  </p>
                  {projects.length === 0 && (
                    <button
                      onClick={handleAddProject}
                      className="flex items-center px-4 py-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg hover:from-blue-700 hover:to-purple-700 transition-all mx-auto shadow-lg"
                    >
                      <Plus className="w-4 h-4 mr-2" />
                      Add Your First Project
                    </button>
                  )}
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {filteredProjects.map((project) => (
                    <div key={project.id} className="relative group">
                      <ProjectCard
                        project={project}
                        onEdit={handleEditProject}
                        onDelete={handleDeleteProject}
                      />
                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => handleViewProject(project)}
                        className="absolute top-4 right-4 p-2 bg-white dark:bg-neutral-800 rounded-lg shadow-lg opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        <Eye className="w-4 h-4 text-gray-600 dark:text-gray-400" />
                      </motion.button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {activeTab === 'clients' && (
            <div className="space-y-6">
              <div className="flex justify-between items-center">
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Clients</h2>
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={handleAddClient}
                  className="flex items-center px-4 py-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg hover:from-blue-700 hover:to-purple-700 transition-all shadow-lg"
                >
                  <UserPlus className="w-4 h-4 mr-2" />
                  Add Client
                </motion.button>
              </div>

              <SearchFilter
                onFilterChange={setClientFilters}
                type="clients"
              />

              {filteredClients.length === 0 ? (
                <div className="text-center py-12 bg-white dark:bg-neutral-900 rounded-xl border border-gray-200 dark:border-neutral-800">
                  <Users className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                    {clients.length === 0 ? 'No clients yet' : 'No clients match your filters'}
                  </h3>
                  <p className="text-gray-600 dark:text-gray-400 mb-6">
                    {clients.length === 0 ? 'Add your first client to get started' : 'Try adjusting your search criteria'}
                  </p>
                  {clients.length === 0 && (
                    <button
                      onClick={handleAddClient}
                      className="flex items-center px-4 py-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg hover:from-blue-700 hover:to-purple-700 transition-all mx-auto shadow-lg"
                    >
                      <UserPlus className="w-4 h-4 mr-2" />
                      Add Your First Client
                    </button>
                  )}
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {filteredClients.map((client) => (
                    <ClientCard
                      key={client.id}
                      client={client}
                      onEdit={handleEditClient}
                      onDelete={handleDeleteClient}
                    />
                  ))}
                </div>
              )}
            </div>
          )}

          {activeTab === 'analytics' && (
            <AnalyticsCharts />
          )}

          {activeTab === 'payments' && (
            <PaymentTracker />
          )}
        </motion.div>

        {/* Modals */}
        <ProjectForm
          project={editingProject}
          onSave={handleSaveProject}
          onCancel={() => {
            setIsProjectFormOpen(false);
            setEditingProject(null);
          }}
          isOpen={isProjectFormOpen}
        />

        <ClientForm
          client={editingClient}
          onSave={handleSaveClient}
          onCancel={() => {
            setIsClientFormOpen(false);
            setEditingClient(null);
          }}
          isOpen={isClientFormOpen}
        />

        {viewingProject && (
          <ProjectDetailView
            project={viewingProject}
            onEdit={handleEditProject}
            onDelete={handleDeleteProject}
            onClose={() => setViewingProject(null)}
          />
        )}

        <ExportModal
          isOpen={isExportModalOpen}
          onClose={() => setIsExportModalOpen(false)}
          projects={projects}
          clients={clients}
          payments={[]} // Add payments when implemented
        />

        <ConfirmationModal
          isOpen={isConfirmationOpen}
          onClose={() => setIsConfirmationOpen(false)}
          onConfirm={handleConfirmDelete}
          title="Confirm Delete"
          message={`Are you sure you want to delete this ${deleteTarget?.type}? This action cannot be undone.`}
          confirmText="Delete"
          cancelText="Cancel"
          type="danger"
        />
        
        <ThemeTest />
      </div>
    </div>
  );
}