// types/index.ts
export interface Project {
  id: string;
  title: string;
  client: string;
  clientId?: string;
  deadline: string;
  payment: number;
  status: 'ongoing' | 'completed';
  description?: string;
  tasks?: Task[];
  files?: ProjectFile[];
  createdAt: Date;
  updatedAt: Date;
  userId: string;
}

export interface Client {
  id: string;
  name: string;
  email: string;
  phone: string;
  countryCode?: string;
  country?: string;
  description?: string;
  createdAt: Date;
  updatedAt: Date;
  userId: string;
}

export interface Payment {
  id: string;
  projectId: string;
  amount: number;
  status: 'pending' | 'paid' | 'partial' | 'refunded';
  dueDate: string;
  paidDate?: string;
  description?: string;
  createdAt: Date;
  updatedAt: Date;
  userId: string;
}

export interface Task {
  id: string;
  title: string;
  description?: string;
  completed: boolean;
  dueDate?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface ProjectFile {
  id: string;
  name: string;
  url: string;
  size: number;
  type: string;
  uploadedAt: Date;
}

export interface DashboardStats {
  totalProjects: number;
  ongoingProjects: number;
  completedProjects: number;
  totalEarnings: number;
  pendingPayments: number;
  totalClients: number;
  overdueProjects: number;
  overduePayments: number;
}

export interface FilterOptions {
  search: string;
  status: string;
  dateRange: {
    start: string;
    end: string;
  };
  amountRange: {
    min: number;
    max: number;
  };
}

export interface ChartData {
  labels: string[];
  datasets: {
    label: string;
    data: number[];
    backgroundColor?: string;
    borderColor?: string;
  }[];
}
