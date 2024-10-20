import { createAuthenticatedClient } from "@interledger/open-payments";

export class QuoteService {
  private client: any;

  constructor(
    private walletAddress: string,
    private privateKeyPath: string,
    private keyId: string
  ) {}

  async initialize() {
    this.client = await createAuthenticatedClient({
      walletAddressUrl: this.walletAddress,
      privateKey: this.privateKeyPath,
      keyId: this.keyId,
    });
  }

  async createQuote(accessToken: string, incomingPaymentUrl: string) {
    await this.initialize();
    const quote = await this.client.quote.create(
      {
        url: new URL(this.walletAddress).origin,
        accessToken: accessToken,
      },
      {
        method: "ilp",
        walletAddress: this.walletAddress,
        receiver: incomingPaymentUrl,
      }
    );
    return quote;
  }

  async getQuote(quoteUrl: string, accessToken: string) {
    await this.initialize();
    const quote = await this.client.quote.get({
      url: quoteUrl,
      accessToken: accessToken,
    });
    return quote;
  }
}
