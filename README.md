# Open Mandla

## SMS-Based Payment System Using Open Payments and Interledger

Open Mandla is an innovative financial platform that enables users to send and receive payments using simple SMS commands. By leveraging the power of Open Payments and the Interledger Protocol, Open Mandla brings accessible, cross-border financial services to anyone with a mobile phone, regardless of their access to smartphones or internet connectivity.

### Key Features

- **SMS-Driven Transactions**: Send money, check balances, and view transaction history using simple SMS commands.
- **Interledger Integration**: Utilize the Interledger Protocol for fast, secure, and low-cost cross-border transactions.
- **Open Payments Compatibility**: Seamlessly integrate with the Open Payments ecosystem for standardized payment operations.
- **User-Friendly Interface**: Simple command structure makes it easy for users of all technical levels to manage their finances.
- **Multi-Currency Support**: Handle transactions in various currencies, facilitating international remittances.
- **Transaction History**: Easily retrieve and review past transactions via SMS.
- **Secure Authentication**: Implement robust security measures to protect user accounts and transactions.

### How It Works

1. **User Registration**: New users are automatically registered upon their first interaction with the system.
2. **Balance Inquiry**: Users can check their balance with a simple SMS command.
3. **Sending Money**: Initiate transfers using the format: `send#RECIPIENT#ASSET#AMOUNT`.
4. **Transaction Confirmation**: Multi-step confirmation process ensures transaction accuracy and user intent.
5. **History Retrieval**: Users can view their transaction history for specific months.

### Technical Stack

- Node.js and Express for the backend server
- Twilio for SMS communication
- Open Payments API for payment processing
- Interledger Protocol for cross-border transactions
- PostgreSQL database for data storage

### Getting Started

1. Clone the repository
2. Install dependencies: `npm install`
3. Set up environment variables (WALLET_ADDRESS, OPEN_PRIVATE_KEY, KEY_ID, etc.)
4. Run the server: `npm start`

### Future Enhancements

- WhatsApp integration for expanded reach
- AI-driven financial advice and alerts
- Integration with additional payment networks
- Enhanced security features like two-factor authentication

### Contributing

We welcome contributions to Open Mandla! Please see our [CONTRIBUTING.md](CONTRIBUTING.md) file for guidelines on how to get involved.

### License

Open Mandla is open-source software licensed under the MIT license.

---

Open Mandla - Empowering Financial Inclusion Through Simple Technology