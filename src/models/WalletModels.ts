export interface WalletAddress {
  id: string;
  publicName: string;
  assetCode: string;
  assetScale: number;
  authServer: string;
  // Add other properties as needed
}

export interface WalletKeys {
  keys: {
    [key: string]: {
      jwk: object;
      kty: string;
      kid: string;
    };
  };
}

export interface WalletBalance {
  assetCode: string;
  assetScale: number;
  value: string;
}