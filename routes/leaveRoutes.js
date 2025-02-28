import express from 'express';
import { getLeaves, createLeave, updateLeaveStatus, getLeaveCountByDate } from '../controllers/leaveController.js';

const router = express.Router();

router.get('/', getLeaves);
router.get('/count', getLeaveCountByDate);
router.post('/', createLeave);
router.put('/:id/status', updateLeaveStatus);

export default router;
