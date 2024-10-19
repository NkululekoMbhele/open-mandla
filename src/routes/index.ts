import express from 'express';
import homeRoutes from './homeRoutes';
import testRoutes from './testRoutes';
import communicationRoutes from './communicationRoutes';

const router = express.Router();

router.use('/', homeRoutes);
router.use('/test', testRoutes);
router.use('/chatbot', communicationRoutes);

export default router;