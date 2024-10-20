import express from 'express';
import { QuoteController } from '../core/quote/quoteController';
import dotenv from "dotenv";
import {QuoteService} from "../core/quote/quoteService";

// Load the environment variables
dotenv.config();

const router = express.Router();

const quoteService = new QuoteService(
  process.env.WALLET_ADDRESS!,
  process.env.OPEN_PRIVATE_KEY!,
  process.env.KEY_ID!
);

const quoteController = new QuoteController(quoteService);

console.log(quoteService)

router.post('/create', (req, res) => quoteController.createQuote(req, res));
router.get('/:quoteUrl', (req, res) => quoteController.getQuote(req, res));

export default router;