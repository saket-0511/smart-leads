import { useState } from 'react';
import { LeadFormData, LeadStatus, LeadSource, Lead } from '../../types';
import { leadsService } from '../../services/leadsService';
import toast from 'react-hot-toast';
import { Spinner } from '../ui/Loading';

interface LeadFormProps {
  lead?: Lead;
  onSuccess: () => void;
  onCancel: () => void;
}

const STATUSES: LeadStatus[] = ['New', 'Contacted', 'Qualified', 'Lost'];
const SOURCES: LeadSource[] = ['Website', 'Instagram', 'Referral'];

const LeadForm = ({ lead, onSuccess, onCancel }: LeadFormProps) => {
  const [formData, setFormData] = useState<LeadFormData>({
    name: lead?.name || '',
    email: lead?.email || '',
    status: lead?.status || 'New',
    source: lead?.source || 'Website',
    notes: lead?.notes || '',
  });
  const [errors, setErrors] = useState<Partial<Record<keyof LeadFormData, string>>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const validate = (): boolean => {
    const newErrors: Partial<Record<keyof LeadFormData, string>> = {};
    if (!formData.name.trim()) newErrors.name = 'Name is required';
    if (!formData.email.trim()) newErrors.email = 'Email is required';
    else if (!/\S+@\S+\.\S+/.test(formData.email)) newErrors.email = 'Invalid email';
    if (!formData.source) newErrors.source = 'Source is required';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    setIsSubmitting(true);
    try {
      if (lead) {
        await leadsService.updateLead(lead._id, formData);
        toast.success('Lead updated successfully!');
      } else {
        await leadsService.createLead(formData);
        toast.success('Lead created successfully!');
      }
      onSuccess();
    } catch {
      toast.error(lead ? 'Failed to update lead' : 'Failed to create lead');
    } finally {
      setIsSubmitting(false);
    }
  };

  const inputClass = (field: keyof LeadFormData) =>
    `w-full px-3 py-2 border rounded-lg text-sm bg-white dark:bg-gray-700 dark:text-white transition focus:outline-none focus:ring-2 focus:ring-brand-500 ${
      errors[field] ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'
    }`;

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Name *</label>
        <input
          type="text"
          className={inputClass('name')}
          value={formData.name}
          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          placeholder="John Doe"
        />
        {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name}</p>}
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Email *</label>
        <input
          type="email"
          className={inputClass('email')}
          value={formData.email}
          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
          placeholder="john@example.com"
        />
        {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email}</p>}
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Status</label>
          <select
            className={inputClass('status')}
            value={formData.status}
            onChange={(e) => setFormData({ ...formData, status: e.target.value as LeadStatus })}
          >
            {STATUSES.map((s) => <option key={s} value={s}>{s}</option>)}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Source *</label>
          <select
            className={inputClass('source')}
            value={formData.source}
            onChange={(e) => setFormData({ ...formData, source: e.target.value as LeadSource })}
          >
            {SOURCES.map((s) => <option key={s} value={s}>{s}</option>)}
          </select>
          {errors.source && <p className="text-red-500 text-xs mt-1">{errors.source}</p>}
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Notes</label>
        <textarea
          className={`${inputClass('notes')} resize-none`}
          rows={3}
          value={formData.notes}
          onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
          placeholder="Additional notes..."
        />
      </div>

      <div className="flex gap-3 pt-2">
        <button
          type="button"
          onClick={onCancel}
          className="flex-1 px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 transition"
        >
          Cancel
        </button>
        <button
          type="submit"
          disabled={isSubmitting}
          className="flex-1 px-4 py-2 bg-brand-500 text-white rounded-lg text-sm font-medium hover:bg-brand-600 disabled:opacity-50 transition flex items-center justify-center gap-2"
        >
          {isSubmitting && <Spinner size="sm" />}
          {lead ? 'Update Lead' : 'Create Lead'}
        </button>
      </div>
    </form>
  );
};

export default LeadForm;
