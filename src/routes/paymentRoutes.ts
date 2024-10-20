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

// Wallet Routes
router.get('/wallet', (req, res) => paymentController.getWallet(req, res));
router.get('/wallet/keys', (req, res) => paymentController.getWalletKeys(req, res));

// Grant Routes
router.post('/grants/incoming-payment', (req, res) => paymentController.requestIncomingPaymentGrant(req, res));
router.post('/grants/quote', (req, res) => paymentController.requestQuoteGrant(req, res));
router.post('/grants/outgoing-payment', (req, res) => paymentController.requestOutgoingPaymentGrant(req, res));
router.post('/grants/continue', (req, res) => paymentController.continueGrant(req, res));
router.post('/grants/revoke', (req, res) => paymentController.revokeGrant(req, res));

// Incoming payment routes
router.post('/incoming-payments', (req, res) => paymentController.createIncomingPayment(req, res));
router.get('/incoming-payments', (req, res) => paymentController.listIncomingPayments(req, res));
router.get('/incoming-payments/:incomingPaymentUrl', (req, res) => paymentController.getIncomingPayment(req, res));
router.post('/incoming-payments/:incomingPaymentUrl/complete', (req, res) => paymentController.completeIncomingPayment(req, res));

// Outgoing payment routes
router.post('/outgoing-payments', (req, res) => paymentController.createOutgoingPayment(req, res));
router.get('/outgoing-payments', (req, res) => paymentController.listOutgoingPayments(req, res));
router.get('/outgoing-payments/:outgoingPaymentUrl', (req, res) => paymentController.getOutgoingPayment(req, res));


export default router;