// src/routes/paymentRoutes.ts

import express from 'express';
import { PaymentController } from '../core/payment/PaymentController';
import { PaymentService } from '../core/payment/PaymentService';
import dotenv from 'dotenv';

// Load the environment variables
dotenv.config();

const router = express.Router();

// Initialize PaymentService and PaymentController
const paymentService = new PaymentService(
  process.env.WALLET_ADDRESS!,
  process.env.OPEN_PRIVATE_KEY!,
  process.env.KEY_ID!
);
const paymentController = new PaymentController(paymentService);

console.log(paymentService)

router.get('/wallet', (req, res) => paymentController.getWallet(req, res));
router.get('/wallet/keys', (req, res) => paymentController.getWalletKeys(req, res));

export default router;