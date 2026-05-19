import { Response } from 'express';
import Lead from '../models/Lead';
import { AuthRequest, LeadFilterQuery } from '../types';
import { FilterQuery } from 'mongoose';
import { ILeadDocument } from '../models/Lead';

export const getLeads = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { status, source, search, sort = 'latest', page = '1', limit = '10' } = req.query as LeadFilterQuery;

    const filter: FilterQuery<ILeadDocument> = {};

    // Role-based: sales users only see their own leads
    if (req.user!.role === 'sales') {
      filter.createdBy = req.user!.id;
    }

    if (status) filter.status = status;
    if (source) filter.source = source;

    if (search) {
      filter.$or = [
        { name: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } },
      ];
    }

    const pageNum = Math.max(1, parseInt(page, 10));
    const limitNum = Math.min(50, Math.max(1, parseInt(limit, 10)));
    const skip = (pageNum - 1) * limitNum;
    const sortOrder = sort === 'oldest' ? 1 : -1;

    const [leads, total] = await Promise.all([
      Lead.find(filter)
        .populate('createdBy', 'name email')
        .populate('assignedTo', 'name email')
        .sort({ createdAt: sortOrder })
        .skip(skip)
        .limit(limitNum),
      Lead.countDocuments(filter),
    ]);

    const totalPages = Math.ceil(total / limitNum);

    res.status(200).json({
      success: true,
      data: leads,
      pagination: {
        total,
        page: pageNum,
        limit: limitNum,
        totalPages,
        hasNextPage: pageNum < totalPages,
        hasPrevPage: pageNum > 1,
      },
    });
  } catch (error) {
    res.status(500).json({ success: false, error: 'Failed to fetch leads' });
  }
};

export const getLeadById = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const lead = await Lead.findById(req.params.id)
      .populate('createdBy', 'name email')
      .populate('assignedTo', 'name email');

    if (!lead) {
      res.status(404).json({ success: false, error: 'Lead not found' });
      return;
    }

    // Sales users can only view their own leads
    if (req.user!.role === 'sales' && lead.createdBy.toString() !== req.user!.id) {
      res.status(403).json({ success: false, error: 'Access denied' });
      return;
    }

    res.status(200).json({ success: true, data: lead });
  } catch (error) {
    res.status(500).json({ success: false, error: 'Failed to fetch lead' });
  }
};

export const createLead = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const lead = await Lead.create({ ...req.body, createdBy: req.user!.id });
    res.status(201).json({ success: true, message: 'Lead created successfully', data: lead });
  } catch (error) {
    res.status(500).json({ success: false, error: 'Failed to create lead' });
  }
};

export const updateLead = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const lead = await Lead.findById(req.params.id);

    if (!lead) {
      res.status(404).json({ success: false, error: 'Lead not found' });
      return;
    }

    // Sales users can only update their own leads
    if (req.user!.role === 'sales' && lead.createdBy.toString() !== req.user!.id) {
      res.status(403).json({ success: false, error: 'Access denied' });
      return;
    }

    const updated = await Lead.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

    res.status(200).json({ success: true, message: 'Lead updated successfully', data: updated });
  } catch (error) {
    res.status(500).json({ success: false, error: 'Failed to update lead' });
  }
};

export const deleteLead = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const lead = await Lead.findById(req.params.id);

    if (!lead) {
      res.status(404).json({ success: false, error: 'Lead not found' });
      return;
    }

    // Only admin can delete leads
    if (req.user!.role !== 'admin') {
      res.status(403).json({ success: false, error: 'Only admins can delete leads' });
      return;
    }

    await Lead.findByIdAndDelete(req.params.id);
    res.status(200).json({ success: true, message: 'Lead deleted successfully' });
  } catch (error) {
    res.status(500).json({ success: false, error: 'Failed to delete lead' });
  }
};

export const exportLeadsCSV = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const filter: FilterQuery<ILeadDocument> = {};
    if (req.user!.role === 'sales') filter.createdBy = req.user!.id;

    const leads = await Lead.find(filter)
      .populate('createdBy', 'name email')
      .sort({ createdAt: -1 });

    const headers = ['Name', 'Email', 'Status', 'Source', 'Notes', 'Created At'];
    const rows = leads.map((lead) => [
      `"${lead.name}"`,
      `"${lead.email}"`,
      `"${lead.status}"`,
      `"${lead.source}"`,
      `"${lead.notes || ''}"`,
      `"${new Date(lead.createdAt).toLocaleDateString()}"`,
    ]);

    const csv = [headers.join(','), ...rows.map((r) => r.join(','))].join('\n');

    res.setHeader('Content-Type', 'text/csv');
    res.setHeader('Content-Disposition', 'attachment; filename=leads.csv');
    res.status(200).send(csv);
  } catch (error) {
    res.status(500).json({ success: false, error: 'Failed to export leads' });
  }
};
