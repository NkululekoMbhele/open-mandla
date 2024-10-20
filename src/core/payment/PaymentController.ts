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

  async outgoingPaymentGrantRedirect(req: Request, res: Response): Promise<void> {
    try {
      console.log(req.params.interact_ref)
      console.log(req.params.hash)
      console.log(req.params)
      console.log(req)
      res.json({"message": "Test Redirect"});
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

  async revokeGrant(req: Request, res: Response): Promise<void> {
    try {
      const { accessToken, url } = req.body;
      const result = await this.paymentService.revokeGrant(accessToken, url);
      res.json(result);
    } catch (error) {
      console.error("Error revoking grant:", error);
      res.status(500).json({ error: "Failed to revoke grant" });
    }
  }

  async createIncomingPayment(req: Request, res: Response): Promise<void> {
    try {
      const { accessToken, incomingAmount, expiresIn } = req.body;
      const incomingPayment = await this.paymentService.createIncomingPayment(accessToken, incomingAmount, expiresIn);
      res.json(incomingPayment);
    } catch (error) {
      console.error("Error creating incoming payment:", error);
      res.status(500).json({ error: "Failed to create incoming payment" });
    }
  }

  async listIncomingPayments(req: Request, res: Response): Promise<void> {
    try {
      const { accessToken } = req.body;
      const { first, last, cursor } = req.query;

      const paginationParams = {
        first: first ? parseInt(first as string) : undefined,
        last: last ? parseInt(last as string) : undefined,
        cursor: cursor as string | undefined
      };

      const incomingPayments = await this.paymentService.listIncomingPayments(accessToken, paginationParams);
      res.json(incomingPayments);
    } catch (error) {
      console.error("Error listing incoming payments:", error);
      res.status(500).json({ error: "Failed to list incoming payments" });
    }
  }


  async getIncomingPayment(req: Request, res: Response): Promise<void> {
    try {
      const { incomingPaymentUrl } = req.params;
      const { accessToken } = req.body;

      const incomingPayment = await this.paymentService.getIncomingPayment(incomingPaymentUrl, accessToken);
      res.json(incomingPayment);
    } catch (error) {
      console.error("Error getting incoming payment:", error);
      res.status(500).json({ error: "Failed to get incoming payment" });
    }
  }

  async completeIncomingPayment(req: Request, res: Response): Promise<void> {
    try {
      const { incomingPaymentUrl } = req.params;
      const { accessToken } = req.body;

      const completedIncomingPayment = await this.paymentService.completeIncomingPayment(incomingPaymentUrl, accessToken);
      res.json(completedIncomingPayment);
    } catch (error) {
      console.error("Error completing incoming payment:", error);
      res.status(500).json({ error: "Failed to complete incoming payment" });
    }
  }

  async createOutgoingPayment(req: Request, res: Response): Promise<void> {
    try {
      const { accessToken, quoteId } = req.body;
      const outgoingPayment = await this.paymentService.createOutgoingPayment(accessToken, quoteId);
      res.json({ outgoingPaymentUrl: outgoingPayment.id });
    } catch (error) {
      console.error("Error creating outgoing payment:", error);
      res.status(500).json({ error: "Failed to create outgoing payment" });
    }
  }

  async listOutgoingPayments(req: Request, res: Response): Promise<void> {
    try {
      const { accessToken } = req.body;
      const { first, last, cursor } = req.query;

      const paginationParams = {
        first: first ? parseInt(first as string) : undefined,
        last: last ? parseInt(last as string) : undefined,
        cursor: cursor as string | undefined
      };

      const outgoingPayments = await this.paymentService.listOutgoingPayments(accessToken, paginationParams);
      res.json(outgoingPayments);
    } catch (error) {
      console.error("Error listing outgoing payments:", error);
      res.status(500).json({ error: "Failed to list outgoing payments" });
    }
  }

  async getOutgoingPayment(req: Request, res: Response): Promise<void> {
    try {
      const { outgoingPaymentUrl } = req.params;
      const { accessToken } = req.body;

      const outgoingPayment = await this.paymentService.getOutgoingPayment(outgoingPaymentUrl, accessToken);
      res.json(outgoingPayment);
    } catch (error) {
      console.error("Error getting outgoing payment:", error);
      res.status(500).json({ error: "Failed to get outgoing payment" });
    }
  }


  async createQuote(req: Request, res: Response) {
    console.log("Creating quote:", req.body);
    try {
      const { accessToken, receiver } = req.body;
      console.log("Inside Start Haaa")
      const quote = await this.paymentService.createQuote(accessToken, receiver);
      console.log("Done Haaa")
      res.status(201).json({ quoteUrl: quote.id });
      console.log("Done 2")
    } catch (error) {
      res.status(500).json({ error: 'Failed to create quote' });
    }
  }

  async getQuote(req: Request, res: Response) {
    try {
      const { quoteUrl } = req.params;
      const { accessToken } = req.body;
      const quote = await this.paymentService.getQuote(quoteUrl, accessToken);
      res.status(200).json(quote);
    } catch (error) {
      res.status(500).json({ error: 'Failed to get quote' });
    }
  }
}