import express from 'express';
import homeRoutes from './homeRoutes';
import testRoutes from './testRoutes';
import paymentRoutes from "./paymentRoutes";

const router = express.Router();

router.use('/', homeRoutes);
router.use('/test', testRoutes);
router.use('/open', paymentRoutes);

export default router;