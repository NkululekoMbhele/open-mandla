import express from 'express';
import homeRoutes from './homeRoutes';
import testRoutes from './testRoutes';

const router = express.Router();

router.use('/', homeRoutes);
router.use('/test', testRoutes);

export default router;