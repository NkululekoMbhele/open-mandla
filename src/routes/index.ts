import express from 'express';
import homeRoutes from './homeRoutes';
import testRoutes from './testRoutes';
import communicationRoutes from './communicationRoutes';
import paymentRoutes from "./paymentRoutes";
import quoteRoutes from './quoteRoutes';

const router = express.Router();


const app = express();

router.use('/', homeRoutes);
router.use('/test', testRoutes);
router.use('/chatbot', communicationRoutes);
router.use('/api/payment', paymentRoutes);
router.use('/api/quote', quoteRoutes);

export default router;