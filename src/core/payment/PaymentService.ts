// src/core/payment/PaymentService.ts
import { createAuthenticatedClient, AuthenticatedClient } from "@interledger/open-payments";
import NodeCache from 'node-cache';

console.log("Hello")

export class PaymentService {
  private client: AuthenticatedClient | null = null;
  private cache: NodeCache;

  constructor(
    private walletAddressUrl: string,
    private privateKey: string,
    private keyId: string
  ) {
    this.cache = new NodeCache({ stdTTL: 600 }); // Cache for 10 minutes
  }

  private async initializeClient(): Promise<AuthenticatedClient> {
    if (!this.client) {
      this.client = await createAuthenticatedClient({
        walletAddressUrl: this.walletAddressUrl,
        privateKey: this.privateKey,
        keyId: this.keyId,
      });
    }
    console.log("Hello")
    return this.client;
  }

  async getWalletAddress() {
    const cachedWallet = this.cache.get('walletAddress');
    if (cachedWallet) return cachedWallet;

    const client = await this.initializeClient();
    console.log(client)
    const walletAddress = await client.walletAddress.get({
      url: this.walletAddressUrl,
    });
    this.cache.set('walletAddress', walletAddress);
    return walletAddress;
  }

  async getWalletKeys() {
    const client = await this.initializeClient();
    return client.walletAddress.getKeys({
      url: this.walletAddressUrl,
    });
  }
}