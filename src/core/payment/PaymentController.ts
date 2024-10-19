// src/core/payment/PaymentController.ts

import { Request, Response } from 'express';
import { PaymentService } from './PaymentService';

export class PaymentController {
  constructor(private paymentService: PaymentService) {}

  async getWallet(req: Request, res: Response): Promise<void> {
    try {
      const walletAddress = await this.paymentService.getWalletAddress();
      res.json(walletAddress);
    } catch (error) {
      console.error("Error fetching wallet address:", error);
      res.status(500).json({ error: "Failed to fetch wallet address" });
    }
  }

  async getWalletKeys(req: Request, res: Response): Promise<void> {
    try {
      const walletKeys = await this.paymentService.getWalletKeys();
      res.json(walletKeys);
    } catch (error) {
      console.error("Error fetching wallet keys:", error);
      res.status(500).json({ error: "Failed to fetch wallet keys" });
    }
  }

  async requestIncomingPaymentGrant(req: Request, res: Response): Promise<void> {
    try {
      const grant = await this.paymentService.requestIncomingPaymentGrant();
      res.json(grant);
    } catch (error) {
      console.error("Error requesting incoming payment grant:", error);
      res.status(500).json({ error: "Failed to request incoming payment grant" });
    }
  }

  async requestQuoteGrant(req: Request, res: Response): Promise<void> {
    try {
      const grant = await this.paymentService.requestQuoteGrant();
      res.json(grant);
    } catch (error) {
      console.error("Error requesting quote grant:", error);
      res.status(500).json({ error: "Failed to request quote grant" });
    }
  }

  async requestOutgoingPaymentGrant(req: Request, res: Response): Promise<void> {
    try {
      const { debitAmount, receiveAmount, nonce } = req.body;
      const grant = await this.paymentService.requestOutgoingPaymentGrant(debitAmount, receiveAmount, nonce);
      res.json(grant);
    } catch (error) {
      console.error("Error requesting outgoing payment grant:", error);
      res.status(500).json({ error: "Failed to request outgoing payment grant" });
    }
  }

  async continueGrant(req: Request, res: Response): Promise<void> {
    try {
      const { continueAccessToken, continueUri, interactRef } = req.body;
      const grant = await this.paymentService.continueGrant(continueAccessToken, continueUri, interactRef);
      res.json(grant);
    } catch (error) {
      console.error("Error continuing grant:", error);
      res.status(500).json({ error: "Failed to continue grant" });
    }
  }


}