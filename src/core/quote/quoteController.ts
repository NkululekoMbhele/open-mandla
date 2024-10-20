import { Request, Response } from 'express';
import { QuoteService } from './quoteService';

export class QuoteController {
  private quoteService: QuoteService;

  constructor(quoteService: QuoteService) {
    this.quoteService = quoteService;
  }

  async createQuote(req: Request, res: Response) {
    console.log("Creating quote:", req.body);
    try {
      const { accessToken, incomingPaymentUrl } = req.body;
      const quote = await this.quoteService.createQuote(accessToken, incomingPaymentUrl);
      res.status(201).json({ quoteUrl: quote.id });
    } catch (error) {
      res.status(500).json({ error: 'Failed to create quote' });
    }
  }

  async getQuote(req: Request, res: Response) {
    try {
      const { quoteUrl } = req.params;
      const { accessToken } = req.body;
      const quote = await this.quoteService.getQuote(quoteUrl, accessToken);
      res.status(200).json(quote);
    } catch (error) {
      res.status(500).json({ error: 'Failed to get quote' });
    }
  }
}