import { useEffect, useState } from 'react';
import Layout from '../components/layout/Layout';
import { leadsService } from '../services/leadsService';
import { Lead, LeadStatus } from '../types';
import { StatusBadge } from '../components/ui/Badge';
import { PageLoader } from '../components/ui/Loading';
import { useAuthStore } from '../store/authStore';

interface Stats {
  total: number;
  byStatus: Record<LeadStatus, number>;
  recentLeads: Lead[];
}

const statuses: LeadStatus[] = ['New', 'Contacted', 'Qualified', 'Lost'];
const statusColors: Record<LeadStatus, string> = {
  New: 'bg-blue-500',
  Contacted: 'bg-yellow-500',
  Qualified: 'bg-green-500',
  Lost: 'bg-red-500',
};

const Dashboard = () => {
  const { user } = useAuthStore();
  const [stats, setStats] = useState<Stats | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await leadsService.getLeads({ limit: 100 } as never);
        const byStatus = statuses.reduce((acc, s) => {
          acc[s] = res.data.filter((l) => l.status === s).length;
          return acc;
        }, {} as Record<LeadStatus, number>);

        setStats({ total: res.pagination.total, byStatus, recentLeads: res.data.slice(0, 5) });
      } finally {
        setIsLoading(false);
      }
    };
    fetchStats();
  }, []);

  if (isLoading) return <Layout><PageLoader /></Layout>;

  return (
    <Layout>
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
          Welcome back, {user?.name?.split(' ')[0]} 👋
        </h2>
        <p className="text-gray-500 dark:text-gray-400 mt-1">Here's what's happening with your leads today.</p>
      </div>

      {/* Stats cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <div className="bg-white dark:bg-gray-900 rounded-2xl p-5 border border-gray-100 dark:border-gray-800">
          <p className="text-sm text-gray-500 dark:text-gray-400">Total Leads</p>
          <p className="text-3xl font-bold text-gray-900 dark:text-white mt-1">{stats?.total ?? 0}</p>
        </div>
        {statuses.map((status) => (
          <div key={status} className="bg-white dark:bg-gray-900 rounded-2xl p-5 border border-gray-100 dark:border-gray-800">
            <div className="flex items-center justify-between">
              <p className="text-sm text-gray-500 dark:text-gray-400">{status}</p>
              <span className={`w-2 h-2 rounded-full ${statusColors[status]}`} />
            </div>
            <p className="text-3xl font-bold text-gray-900 dark:text-white mt-1">{stats?.byStatus[status] ?? 0}</p>
          </div>
        ))}
      </div>

      {/* Recent leads */}
      <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800 p-6">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Recent Leads</h3>
        {stats?.recentLeads.length === 0 ? (
          <p className="text-gray-400 text-sm text-center py-8">No leads yet. Create your first lead!</p>
        ) : (
          <div className="space-y-3">
            {stats?.recentLeads.map((lead) => (
              <div key={lead._id} className="flex items-center justify-between py-2 border-b border-gray-50 dark:border-gray-800 last:border-0">
                <div>
                  <p className="text-sm font-medium text-gray-900 dark:text-white">{lead.name}</p>
                  <p className="text-xs text-gray-400">{lead.email}</p>
                </div>
                <StatusBadge status={lead.status} />
              </div>
            ))}
          </div>
        )}
      </div>
    </Layout>
  );
};

export default Dashboard;
