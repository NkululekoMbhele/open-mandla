// src/core/payment/PaymentService.ts
import {
  createAuthenticatedClient,
  AuthenticatedClient,
  isPendingGrant,
  Grant,
  GrantContinuation, PendingGrant
} from "@interledger/open-payments";
import NodeCache from 'node-cache';
import {WalletAddress} from "../../models/WalletModels";

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

  async getWalletAddress(): Promise<{   id: string;   publicName?: string | undefined;   assetCode: string;   assetScale: number;   authServer: string;   resourceServer: string; } & {   [key: string]: unknown; }> {

    const client = await this.initializeClient();
    console.log(client)
    const walletAddress: {   id: string;   publicName?: string | undefined;   assetCode: string;   assetScale: number;   authServer: string;   resourceServer: string; } & {   [key: string]: unknown; } = await client.walletAddress.get({
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
  async requestIncomingPaymentGrant() {
    const client = await this.initializeClient();
    const walletAddress = await this.getWalletAddress();

    const grant = await client.grant.request(
      { url: walletAddress.authServer },
      {
        access_token: {
          access: [
            {
              type: "incoming-payment",
              actions: ["list", "read", "read-all", "complete", "create"],
            },
          ],
        },
      }
    );

    if (isPendingGrant(grant)) {
      throw new Error("Expected non-interactive grant");
    }

    return {
      accessToken: grant.access_token.value,
      manageUrl: grant.access_token.manage,
    };
  }

  async requestQuoteGrant() {
    const client = await this.initializeClient();
    const walletAddress = await this.getWalletAddress();

    const grant = await client.grant.request(
      { url: walletAddress.authServer },
      {
        access_token: {
          access: [
            {
              type: "quote",
              actions: ["create", "read", "read-all"],
            },
          ],
        },
      }
    );

    if (isPendingGrant(grant)) {
      throw new Error("Expected non-interactive grant");
    }

    return {
      accessToken: grant.access_token.value,
      manageUrl: grant.access_token.manage,
    };
  }

  async requestOutgoingPaymentGrant(debitAmount: string, receiveAmount: string, nonce: string) {
    const client = await this.initializeClient();
    const walletAddress: {   id: string;   publicName?: string | undefined;   assetCode: string;   assetScale: number;   authServer: string;   resourceServer: string; } & {   [key: string]: unknown; } = await this.getWalletAddress();

    const grant = await client.grant.request(
      { url: walletAddress.authServer },
      {
        access_token: {
          access: [
            {
              identifier: walletAddress.id,
              type: "outgoing-payment",
              actions: ["list", "list-all", "read", "read-all", "create"],
              limits: {
                "debitAmount": {
                  "value": "500",
                  "assetCode": "USD",
                  "assetScale": 2
                }
              },
            },
          ],
        },
        interact: {
          start: ["redirect"],
          finish: {
            method: "redirect",
            uri: "http://localhost:3344",
            nonce,
          },
        },
      }
    );

    if (!isPendingGrant(grant)) {
      throw new Error("Expected interactive grant");
    }

    return {
      redirectUrl: grant.interact.redirect,
      continueToken: grant.continue.access_token.value,
      continueUri: grant.continue.uri,
    };
  }

  async continueGrant(continueAccessToken: string, continueUri: string, interactRef: string) {
    const client = await this.initializeClient();

    const grant: Grant | GrantContinuation = await client.grant.continue(
      {
        accessToken: continueAccessToken,
        url: continueUri,
      },
      {
        interact_ref: interactRef,
      }
    );

    if (isPendingGrant(grant as PendingGrant)) {
      throw new Error("Unexpected pending grant after continuation");
    }

    return {
      accessToken: (grant as Grant).access_token.value,
      manageUrl: (grant as Grant).access_token.manage,
    };
  }

}