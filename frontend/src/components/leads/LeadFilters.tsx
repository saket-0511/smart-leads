import { LeadFilters, LeadStatus, LeadSource } from '../../types';

interface LeadFiltersBarProps {
  filters: LeadFilters;
  onChange: (filters: Partial<LeadFilters>) => void;
  searchValue: string;
  onSearchChange: (value: string) => void;
}

const LeadFiltersBar = ({ filters, onChange, searchValue, onSearchChange }: LeadFiltersBarProps) => {
  const inputClass = 'px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg text-sm bg-white dark:bg-gray-700 dark:text-white focus:outline-none focus:ring-2 focus:ring-brand-500 transition';

  return (
    <div className="flex flex-col sm:flex-row gap-3 mb-6">
      {/* Search */}
      <div className="relative flex-1">
        <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
        </svg>
        <input
          type="text"
          placeholder="Search by name or email..."
          value={searchValue}
          onChange={(e) => onSearchChange(e.target.value)}
          className={`${inputClass} pl-9 w-full`}
        />
      </div>

      {/* Status filter */}
      <select
        value={filters.status || ''}
        onChange={(e) => onChange({ status: (e.target.value as LeadStatus) || undefined, page: 1 })}
        className={inputClass}
      >
        <option value="">All Statuses</option>
        {(['New', 'Contacted', 'Qualified', 'Lost'] as LeadStatus[]).map((s) => (
          <option key={s} value={s}>{s}</option>
        ))}
      </select>

      {/* Source filter */}
      <select
        value={filters.source || ''}
        onChange={(e) => onChange({ source: (e.target.value as LeadSource) || undefined, page: 1 })}
        className={inputClass}
      >
        <option value="">All Sources</option>
        {(['Website', 'Instagram', 'Referral'] as LeadSource[]).map((s) => (
          <option key={s} value={s}>{s}</option>
        ))}
      </select>

      {/* Sort */}
      <select
        value={filters.sort || 'latest'}
        onChange={(e) => onChange({ sort: e.target.value as 'latest' | 'oldest', page: 1 })}
        className={inputClass}
      >
        <option value="latest">Latest First</option>
        <option value="oldest">Oldest First</option>
      </select>
    </div>
  );
};

export default LeadFiltersBar;
