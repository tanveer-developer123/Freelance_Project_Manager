// context/ProjectContext.tsx
import { createContext, useContext, useEffect, useState } from "react";
import type { ReactNode } from "react";
import { 
  collection, 
  addDoc, 
  updateDoc, 
  deleteDoc, 
  doc, 
  onSnapshot, 
  query, 
  where, 
  Timestamp 
} from "firebase/firestore";
import { db } from "../firebase";
import { useAuth } from "./AuthContext";
import type { Project, Client, Payment, DashboardStats } from "../types";

interface ProjectContextType {
  projects: Project[];
  clients: Client[];
  payments: Payment[];
  dashboardStats: DashboardStats;
  loading: boolean;
  addProject: (project: Omit<Project, 'id' | 'createdAt' | 'updatedAt' | 'userId'>) => Promise<void>;
  updateProject: (id: string, project: Partial<Project>) => Promise<void>;
  deleteProject: (id: string) => Promise<void>;
  addClient: (client: Omit<Client, 'id' | 'createdAt' | 'updatedAt' | 'userId'>) => Promise<void>;
  updateClient: (id: string, client: Partial<Client>) => Promise<void>;
  deleteClient: (id: string) => Promise<void>;
  addPayment: (payment: Omit<Payment, 'id' | 'createdAt' | 'updatedAt' | 'userId'>) => Promise<void>;
  updatePayment: (id: string, payment: Partial<Payment>) => Promise<void>;
  deletePayment: (id: string) => Promise<void>;
}

const ProjectContext = createContext<ProjectContextType>({
  projects: [],
  clients: [],
  payments: [],
  dashboardStats: {
    totalProjects: 0,
    ongoingProjects: 0,
    completedProjects: 0,
    totalEarnings: 0,
    pendingPayments: 0,
    totalClients: 0,
    overdueProjects: 0,
    overduePayments: 0,
  },
  loading: true,
  addProject: async () => {},
  updateProject: async () => {},
  deleteProject: async () => {},
  addClient: async () => {},
  updateClient: async () => {},
  deleteClient: async () => {},
  addPayment: async () => {},
  updatePayment: async () => {},
  deletePayment: async () => {},
});

export function ProjectProvider({ children }: { children: ReactNode }) {
  const { user } = useAuth();
  const [projects, setProjects] = useState<Project[]>([]);
  const [clients, setClients] = useState<Client[]>([]);
  const [payments, setPayments] = useState<Payment[]>([]);
  const [loading, setLoading] = useState(true);

  // Calculate dashboard stats
  const dashboardStats: DashboardStats = {
    totalProjects: projects.length,
    ongoingProjects: projects.filter(p => p.status === 'ongoing').length,
    completedProjects: projects.filter(p => p.status === 'completed').length,
    totalEarnings: projects.filter(p => p.status === 'completed').reduce((sum, p) => sum + p.payment, 0),
    pendingPayments: projects.filter(p => p.status === 'ongoing').reduce((sum, p) => sum + p.payment, 0),
    totalClients: clients.length,
    overdueProjects: projects.filter(p => p.status === 'ongoing' && new Date(p.deadline) < new Date()).length,
    overduePayments: payments.filter(p => p.status === 'pending' && new Date(p.dueDate) < new Date()).length,
  };

  // Real-time listeners for projects
  useEffect(() => {
    if (!user) {
      setProjects([]);
      setClients([]);
      setPayments([]);
      setLoading(false);
      return;
    }

    const projectsQuery = query(
      collection(db, 'projects'),
      where('userId', '==', user.uid)
    );

    const clientsQuery = query(
      collection(db, 'clients'),
      where('userId', '==', user.uid)
    );

    const paymentsQuery = query(
      collection(db, 'payments'),
      where('userId', '==', user.uid)
    );

    const unsubscribeProjects = onSnapshot(projectsQuery, (snapshot) => {
      const projectsData = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
        createdAt: doc.data().createdAt?.toDate() || new Date(),
        updatedAt: doc.data().updatedAt?.toDate() || new Date(),
      })) as Project[];
      // Sort by createdAt descending (newest first)
      projectsData.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
      setProjects(projectsData);
    });

    const unsubscribeClients = onSnapshot(clientsQuery, (snapshot) => {
      const clientsData = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
        createdAt: doc.data().createdAt?.toDate() || new Date(),
        updatedAt: doc.data().updatedAt?.toDate() || new Date(),
      })) as Client[];
      // Sort by createdAt descending (newest first)
      clientsData.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
      setClients(clientsData);
    });

    const unsubscribePayments = onSnapshot(paymentsQuery, (snapshot) => {
      const paymentsData = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
        createdAt: doc.data().createdAt?.toDate() || new Date(),
        updatedAt: doc.data().updatedAt?.toDate() || new Date(),
      })) as Payment[];
      // Sort by createdAt descending (newest first)
      paymentsData.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
      setPayments(paymentsData);
    });

    setLoading(false);

    return () => {
      unsubscribeProjects();
      unsubscribeClients();
      unsubscribePayments();
    };
  }, [user]);

  // Project CRUD operations
  const addProject = async (projectData: Omit<Project, 'id' | 'createdAt' | 'updatedAt' | 'userId'>) => {
    if (!user) throw new Error('User not authenticated');
    
    const now = Timestamp.now();
    await addDoc(collection(db, 'projects'), {
      ...projectData,
      userId: user.uid,
      createdAt: now,
      updatedAt: now,
    });
  };

  const updateProject = async (id: string, projectData: Partial<Project>) => {
    await updateDoc(doc(db, 'projects', id), {
      ...projectData,
      updatedAt: Timestamp.now(),
    });
  };

  const deleteProject = async (id: string) => {
    await deleteDoc(doc(db, 'projects', id));
  };

  // Client CRUD operations
  const addClient = async (clientData: Omit<Client, 'id' | 'createdAt' | 'updatedAt' | 'userId'>) => {
    if (!user) throw new Error('User not authenticated');
    
    const now = Timestamp.now();
    await addDoc(collection(db, 'clients'), {
      ...clientData,
      userId: user.uid,
      createdAt: now,
      updatedAt: now,
    });
  };

  const updateClient = async (id: string, clientData: Partial<Client>) => {
    await updateDoc(doc(db, 'clients', id), {
      ...clientData,
      updatedAt: Timestamp.now(),
    });
  };

  const deleteClient = async (id: string) => {
    await deleteDoc(doc(db, 'clients', id));
  };

  // Payment CRUD operations
  const addPayment = async (paymentData: Omit<Payment, 'id' | 'createdAt' | 'updatedAt' | 'userId'>) => {
    if (!user) throw new Error('User not authenticated');
    
    const now = Timestamp.now();
    await addDoc(collection(db, 'payments'), {
      ...paymentData,
      userId: user.uid,
      createdAt: now,
      updatedAt: now,
    });
  };

  const updatePayment = async (id: string, paymentData: Partial<Payment>) => {
    await updateDoc(doc(db, 'payments', id), {
      ...paymentData,
      updatedAt: Timestamp.now(),
    });
  };

  const deletePayment = async (id: string) => {
    await deleteDoc(doc(db, 'payments', id));
  };

  return (
    <ProjectContext.Provider value={{
      projects,
      clients,
      payments,
      dashboardStats,
      loading,
      addProject,
      updateProject,
      deleteProject,
      addClient,
      updateClient,
      deleteClient,
      addPayment,
      updatePayment,
      deletePayment,
    }}>
      {children}
    </ProjectContext.Provider>
  );
}

export const useProjects = () => useContext(ProjectContext);
