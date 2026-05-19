import { LeadStatus, LeadSource } from '../../types';

interface StatusBadgeProps {
  status: LeadStatus;
}

interface SourceBadgeProps {
  source: LeadSource;
}

const statusStyles: Record<LeadStatus, string> = {
  New: 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400',
  Contacted: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400',
  Qualified: 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400',
  Lost: 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400',
};

const sourceStyles: Record<LeadSource, string> = {
  Website: 'bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-400',
  Instagram: 'bg-pink-100 text-pink-800 dark:bg-pink-900/30 dark:text-pink-400',
  Referral: 'bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-400',
};

export const StatusBadge = ({ status }: StatusBadgeProps) => (
  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${statusStyles[status]}`}>
    {status}
  </span>
);

export const SourceBadge = ({ source }: SourceBadgeProps) => (
  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${sourceStyles[source]}`}>
    {source}
  </span>
);
