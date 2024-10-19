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
}