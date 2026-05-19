import { Router } from 'express';
import {
  getLeads,
  getLeadById,
  createLead,
  updateLead,
  deleteLead,
  exportLeadsCSV,
} from '../controllers/leadsController';
import { authenticate, authorize } from '../middleware/auth';
import { leadValidation, updateLeadValidation } from '../middleware/validation';

const router = Router();

// All routes require authentication
router.use(authenticate);

router.get('/', getLeads);
router.get('/export/csv', exportLeadsCSV);
router.get('/:id', getLeadById);
router.post('/', leadValidation, createLead);
router.put('/:id', updateLeadValidation, updateLead);
router.delete('/:id', authorize('admin'), deleteLead);

export default router;
