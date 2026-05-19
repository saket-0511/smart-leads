import { useState } from 'react';
import Layout from '../components/layout/Layout';
import LeadTable from '../components/leads/LeadTable';
import LeadFiltersBar from '../components/leads/LeadFilters';
import Pagination from '../components/ui/Pagination';
import Modal from '../components/ui/Modal';
import LeadForm from '../components/leads/LeadForm';
import { PageLoader, EmptyState, ErrorState } from '../components/ui/Loading';
import { useLeads } from '../hooks/useLeads';
import { useDebounce } from '../hooks/useDebounce';
import { LeadFilters } from '../types';
import { leadsService } from '../services/leadsService';
import toast from 'react-hot-toast';

const Leads = () => {
  const [filters, setFilters] = useState<LeadFilters>({ sort: 'latest', page: 1 });
  const [searchInput, setSearchInput] = useState('');
  const [isCreateOpen, setIsCreateOpen] = useState(false);

  const debouncedSearch = useDebounce(searchInput, 400);
  const activeFilters = { ...filters, search: debouncedSearch || undefined };

  const { leads, pagination, isLoading, error, refetch, deleteLead } = useLeads(activeFilters);

  const updateFilters = (newFilters: Partial<LeadFilters>) => {
    setFilters((prev) => ({ ...prev, ...newFilters }));
  };

  const handleExport = async () => {
    try {
      await leadsService.exportCSV();
      toast.success('CSV exported!');
    } catch {
      toast.error('Export failed');
    }
  };

  return (
    <Layout>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Leads</h2>
          <p className="text-gray-500 dark:text-gray-400 text-sm mt-0.5">Manage and track your leads</p>
        </div>
        <div className="flex gap-3">
          <button
            onClick={handleExport}
            className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-xl text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 transition flex items-center gap-2"
          >
            📥 Export CSV
          </button>
          <button
            onClick={() => setIsCreateOpen(true)}
            className="px-4 py-2 bg-brand-500 hover:bg-brand-600 text-white rounded-xl text-sm font-medium transition flex items-center gap-2"
          >
            + New Lead
          </button>
        </div>
      </div>

      <LeadFiltersBar
        filters={filters}
        onChange={updateFilters}
        searchValue={searchInput}
        onSearchChange={(v) => { setSearchInput(v); updateFilters({ page: 1 }); }}
      />

      {isLoading ? (
        <PageLoader />
      ) : error ? (
        <ErrorState message={error} onRetry={refetch} />
      ) : leads.length === 0 ? (
        <EmptyState />
      ) : (
        <>
          <LeadTable leads={leads} onDelete={deleteLead} onRefresh={refetch} />
          {pagination && (
            <Pagination pagination={pagination} onPageChange={(p) => updateFilters({ page: p })} />
          )}
        </>
      )}

      <Modal isOpen={isCreateOpen} onClose={() => setIsCreateOpen(false)} title="Create New Lead">
        <LeadForm
          onSuccess={() => { setIsCreateOpen(false); refetch(); }}
          onCancel={() => setIsCreateOpen(false)}
        />
      </Modal>
    </Layout>
  );
};

export default Leads;
