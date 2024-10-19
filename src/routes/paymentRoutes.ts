import express from 'express';
import { createAuthenticatedClient, AuthenticatedClient } from "@interledger/open-payments";

const router = express.Router();
import dotenv from 'dotenv';
import path from 'path';

// Load environment variables from .env file
dotenv.config({ path: path.resolve(__dirname, '../.env') });

let client: AuthenticatedClient | null = null;

async function initializeClient() {
  if (!client) {
    client = await createAuthenticatedClient({
      walletAddressUrl: process.env.WALLET_ADDRESS || '',
      privateKey: process.env.OPEN_PRIVATE_KEY  || '',
      keyId: process.env.KEY_ID  || '',
    });
  }
  return client;
}

router.get('/', async (req, res) => {
  try {
    const authenticatedClient = await initializeClient();

    const walletAddress = await authenticatedClient.walletAddress.get({
      url: process.env.WALLET_ADDRESS as string,
    });

    console.log("WALLET ADDRESS:", walletAddress);
    res.json(walletAddress);
  } catch (error) {
    console.error("Error fetching wallet address:", error);
    res.status(500).json({ error: "Failed to fetch wallet address" });
  }
});

export default router;