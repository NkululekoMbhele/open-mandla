import express from 'express';
import homeRoutes from './homeRoutes';
import testRoutes from './testRoutes';
import paymentRoutes from "./paymentRoutes";

const router = express.Router();


const app = express();

router.use('/', homeRoutes);
router.use('/test', testRoutes);
router.use('/api/payment', paymentRoutes);

export default router;