# open-mandla


# Wallet Retrieval Endpoint

## Overview

This document describes the `/api/payment/wallet` endpoint, which is part of our payment system API. This endpoint retrieves the wallet information associated with the configured Interledger account.

## Endpoint Details

- **URL**: `http://localhost:3000/api/payment/wallet`
- **Method**: GET
- **Authentication**: None (Note: Consider adding authentication for production use)

## Response

The endpoint returns a JSON object containing the wallet information. Here's an example of the expected response:

```json
{
  "id": "https://ilp.interledger-test.dev/7aee0ae4",
  "publicName": "f6e39d59",
  "assetCode": "EUR",
  "assetScale": 2,
  "authServer": "https://auth.interledger-test.dev",
  "resourceServer": "https://ilp.interledger-test.dev"
}
```

### Response Fields

- `id`: The unique identifier for the wallet address.
- `publicName`: A public name or identifier for the wallet.
- `assetCode`: The currency code of the asset associated with this wallet (e.g., "EUR" for Euro).
- `assetScale`: The scale of the asset (e.g., 2 for cents in Euro).
- `authServer`: The URL of the authentication server.
- `resourceServer`: The URL of the resource server.

## Usage

To retrieve the wallet information, send a GET request to the endpoint:

```bash
curl http://localhost:3000/api/payment/wallet
```

## Error Handling

If there's an error retrieving the wallet information, the API will return a 500 status code with an error message in the response body.
