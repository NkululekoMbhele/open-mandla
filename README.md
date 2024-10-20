# Open Mandla

## SMS-Based Payment System Using Open Payments and Interledger

Open Mandla is an innovative financial platform that enables users to send and receive payments using simple SMS commands. By leveraging the power of Open Payments and the Interledger Protocol, Open Mandla brings accessible, cross-border financial services to anyone with a mobile phone, regardless of their access to smartphones or internet connectivity.

### Key Features

- **SMS-Driven Transactions**: Perform financial operations using simple SMS commands.
- **Interledger Integration**: Utilize the Interledger Protocol for fast, secure, and low-cost cross-border transactions.
- **Open Payments Compatibility**: Seamlessly integrate with the Open Payments ecosystem for standardized payment operations.
- **User-Friendly Interface**: Simple command structure with a main menu for easy navigation.
- **Multi-Currency Support**: Handle transactions in various currencies.
- **Transaction History**: Easily retrieve and review past transactions via SMS.

### Available Commands

1. **BALANCE** - Check your account balance
2. **SEND** - Send money to another account
3. **HISTORY** - View your transaction history
4. **VERIFY** - Verify your account
5. **HELP** - Get help on specific commands
6. **REGISTER** - Register a new account
7. **SETTINGS** - Manage your account settings

Users can reply with a number (1-7) or the command name to proceed.

### How It Works

1. **User Registration**: New users are automatically prompted to register upon their first interaction.
2. **Main Menu**: Users can access the main menu by sending "MENU" or "START".
3. **Balance Inquiry**: Check balance by sending "BALANCE".
4. **Sending Money**: Initiate transfers using the format: `SEND#RECIPIENT#ASSET#AMOUNT`.
5. **Transaction History**: View history with `HISTORY#YEAR#MONTH` or `HISTORY#YEAR#MONTH#PAGE`.
6. **Help System**: Get help on specific commands with `HELP#COMMAND`.

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

### Key Components

- `SMSProvider`: Handles sending SMS messages
- `PaymentService`: Manages interactions with Open Payments API
- `OutgoingPaymentManager`: Handles the outgoing payment flow
- Express routes for handling SMS commands and web redirects

### Future Enhancements

- WhatsApp integration
- Enhanced security features
- AI-driven financial advice
- Multi-language support

### Contributing

We welcome contributions to Open Mandla! Please see our [CONTRIBUTING.md](CONTRIBUTING.md) file for guidelines on how to get involved.

### License

Open Mandla is open-source software licensed under the MIT license.

---

Open Mandla - Empowering Financial Inclusion Through Simple SMS Technology