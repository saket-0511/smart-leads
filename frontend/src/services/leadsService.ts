import api from './api';
import { Lead, LeadFormData, LeadFilters, LeadsResponse } from '../types';

export const leadsService = {
  async getLeads(filters: LeadFilters = {}): Promise<LeadsResponse> {
    const params = new URLSearchParams();
    if (filters.status) params.append('status', filters.status);
    if (filters.source) params.append('source', filters.source);
    if (filters.search) params.append('search', filters.search);
    if (filters.sort) params.append('sort', filters.sort);
    if (filters.page) params.append('page', String(filters.page));
    params.append('limit', '10');

    const res = await api.get(`/leads?${params.toString()}`);
    return res.data;
  },

  async getLeadById(id: string): Promise<Lead> {
    const res = await api.get(`/leads/${id}`);
    return res.data.data;
  },

  async createLead(data: LeadFormData): Promise<Lead> {
    const res = await api.post('/leads', data);
    return res.data.data;
  },

  async updateLead(id: string, data: Partial<LeadFormData>): Promise<Lead> {
    const res = await api.put(`/leads/${id}`, data);
    return res.data.data;
  },

  async deleteLead(id: string): Promise<void> {
    await api.delete(`/leads/${id}`);
  },

  async exportCSV(): Promise<void> {
    const res = await api.get('/leads/export/csv', { responseType: 'blob' });
    const url = window.URL.createObjectURL(new Blob([res.data]));
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', 'leads.csv');
    document.body.appendChild(link);
    link.click();
    link.remove();
    window.URL.revokeObjectURL(url);
  },
};
