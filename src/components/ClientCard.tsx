// components/ClientCard.tsx
import type { Client } from "../types";
import { Mail, Phone, Edit, Trash2, User } from "lucide-react";

interface ClientCardProps {
  client: Client;
  onEdit: (client: Client) => void;
  onDelete: (id: string) => void;
}

export default function ClientCard({ client, onEdit, onDelete }: ClientCardProps) {
  return (
    <div className="bg-white dark:bg-neutral-900 rounded-xl border border-gray-200 dark:border-neutral-800 p-6 hover:shadow-lg dark:hover:shadow-2xl transition-all duration-300 hover:scale-[1.02]">
      <div className="flex justify-between items-start mb-4">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
            <User className="w-5 h-5 text-white" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">{client.name}</h3>
          </div>
        </div>
        <div className="flex space-x-2">
          <button
            onClick={() => onEdit(client)}
            className="p-2 text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors rounded-lg hover:bg-blue-50 dark:hover:bg-blue-900/20"
          >
            <Edit className="w-4 h-4" />
          </button>
          <button
            onClick={() => onDelete(client.id)}
            className="p-2 text-gray-400 hover:text-red-600 dark:hover:text-red-400 transition-colors rounded-lg hover:bg-red-50 dark:hover:bg-red-900/20"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      </div>

      <div className="space-y-3">
        <div className="flex items-center text-gray-600 dark:text-gray-400">
          <Mail className="w-4 h-4 mr-3 text-gray-400" />
          <span className="text-sm">{client.email}</span>
        </div>

        <div className="flex items-center text-gray-600 dark:text-gray-400">
          <Phone className="w-4 h-4 mr-3 text-gray-400" />
          <span className="text-sm">{client.phone}</span>
        </div>
      </div>
    </div>
  );
}
