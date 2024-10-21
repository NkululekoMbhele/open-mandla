import express from 'express';
import {sendSms} from '../communication/providers/SMSProvider';
import {checkIfUserExists} from '../db';
import {checkPhoneNumberValidity, createUser} from '../utils/phoneNumber';
import dotenv from "dotenv";
import {PaymentService} from "../core/payment/PaymentService";
import {OutgoingPaymentManager} from "../core/payment/OutgoingPaymentManager";
import {handleBalanceCommand, sendTransactionHistory} from '../communication/utils';

const router = express.Router();

const MAIN_MENU = `
      Welcome to Open Mandla!
      
      Available commands:
      1. BALANCE - Check your balance
      2. SEND - Send money
      3. HISTORY - View transaction history
      4. VERIFY - Verify your account
      5. HELP - Get help on commands
      6. REGISTER - Register a new account
      7. SETTINGS - Manage settings
      
      Reply with a number or command to proceed.
      `;


// Load the environment variables
dotenv.config();


const paymentService = new PaymentService(
  process.env.WALLET_ADDRESS!,
  process.env.OPEN_PRIVATE_KEY!,
  process.env.KEY_ID!
);// Implement this based on your needs
const outgoingPaymentManager = new OutgoingPaymentManager(paymentService);

const userSessions = new Map();

router.get('/sms', (req, res) => {
  res.send('Hello to Open Mandla via SMS' + `\n${req}`);
});


router.post('/sms', async (req, res) => {
  console.log(`Recieved Body: ${JSON.stringify(req.body)}`);
  const from: string = req.body.From;
  const command: string = req.body.Body;


  const numberValid = checkPhoneNumberValidity(from);
  console.log("Is Valid Number:", numberValid);
  if (!numberValid) {
    res.send("Invalid phone number.");
    return;
  }

  console.log("Checking if user exists:", from);
  const exists = true;
  const userId = "0";
  console.log("Does User Exist:", exists);
  if (!exists) {
    res.send("User does not exist.");
    const userId = await createUser(from);
    console.log("Created User:", userId);
    sendSms(from, 'Hello Mandla User. We see your are new to the ecosystem. Welcome. Your Open Mandla User ID is: ' + userId + '. To get started, try command BALANCE to check your balance.');
    return;
  }

  const commandParts = command.trim().split('#');
  let cmd = commandParts[0].toLowerCase();

  // Convert numeric menu selections to commands
  if (/^[1-7]$/.test(cmd)) {
    const menuOptions = ['balance', 'send', 'history', 'verify', 'help', 'register', 'settings'];
    cmd = menuOptions[parseInt(cmd) - 1];
  }

  console.log("TEST")

  try {
    switch (cmd) {
      case 'menu':
      case 'start':
        sendSms(from, MAIN_MENU);
        break;

      case 'balance':
        const balanceMessage = await handleBalanceCommand(userId);
        sendSms(from, balanceMessage);
        break;

      case 'verify':
        // const verifyMessage = await handleVerifyCommand(userId);
        // sendSms(from, verifyMessage);
        break;

      case 'send':
        if (commandParts.length < 2) {
          sendSms(from, 'To send money, use: SEND#RECIPIENT#ASSET#AMOUNT\nExample: SEND#user123#USD#50');
        } else {
          await sendOutgoingPaymentManager(command, from);
        }
        break;

      case 'help':
        const helpMessage = handleHelpCommand(commandParts[1]);
        sendSms(from, helpMessage);
        break;

      case 'history':
        await handleHistoryCommand(from, userId, commandParts);
        break;

      case 'register':
        sendSms(from, 'To register, please provide your full name and country code.\nFormat: REGISTER#FullName#CountryCode\nExample: REGISTER#John Doe#US');
        break;

      case 'settings':
        sendSms(from, 'Settings options:\n1. Change language\n2. Update notification preferences\n3. Security settings\n\nReply with a number to select an option.');
        break;

      default:
        console.log("Hello")
        sendSms(from, `Unknown command: "${cmd}". Reply with MENU to see all options or HELP for assistance.`);
        break;
    }
  } catch (error) {
    console.error(`Error processing command "${cmd}":`, error);
    sendSms(from, 'An error occurred. Please try again or reply with MENU for options.');
  }
});

async function handleHistoryCommand(from: string, userId: string, commandParts: string[]) {
  if (commandParts.length < 2) {
    sendSms(from, 'To view history: HISTORY#YEAR#MONTH or HISTORY#YEAR#MONTH#PAGE\nExample: HISTORY#2024#02 or HISTORY#2024#02#2');
    return;
  }

  const [year, month, page] = commandParts.slice(1);
  try {
    const txnHistory = await sendTransactionHistory(userId, year, month, page ? parseInt(page) : undefined);
    sendSms(from, txnHistory);
  } catch (error) {
    console.error('Error fetching transaction history:', error);
    sendSms(from, 'Unable to fetch history at this time. Please try again later.');
  }
}

function handleHelpCommand(topic?: string) {
  if (!topic) return MAIN_MENU;

  switch (topic.toLowerCase()) {
    case 'balance':
      return 'BALANCE: Check your account balance. Simply send "BALANCE".';
    case 'send':
      return 'SEND: Transfer money. Format: SEND#RECIPIENT#ASSET#AMOUNT\nExample: SEND#user123#USD#50';
    case 'history':
      return 'HISTORY: View transactions. Format: HISTORY#YEAR#MONTH or HISTORY#YEAR#MONTH#PAGE\nExample: HISTORY#2024#02 or HISTORY#2024#02#2';
    case 'verify':
      return 'VERIFY: Confirm your account. Send "VERIFY" and follow the prompts.';
    case 'register':
      return 'REGISTER: Create an account. Format: REGISTER#FullName#CountryCode\nExample: REGISTER#John Doe#US';
    case 'settings':
      return 'SETTINGS: Manage your preferences. Send "SETTINGS" to see options.';
    default:
      return `No help for "${topic}". Send MENU to see all options.`;
  }
}

router.get('/whatsapp', (req, res) => {
  res.send('Hello to Open Mandla via Whatsapp');
});


async function sendOutgoingPaymentManager(incomingMessage: any, fromNumber: any) {
  console.log(`Received SMS from ${fromNumber}: ${incomingMessage}`);

  let session = userSessions.get(fromNumber) || {stage: 'Send Payment'};
  let responseMessage = '';

  try {
    switch (session.stage) {
      case 'Send Payment':
        responseMessage = await handleStartStage(incomingMessage, session);
        break;
      case 'recipient':
        responseMessage = "Recipient";
        break;
      case 'amount':
        responseMessage = "Amount";
        break;
      case 'confirm':
        responseMessage = "Confirm";
        break;
      case 'processing':
        responseMessage = "Processing";
        break;
      default:
        responseMessage = "I'm sorry, I don't understand. Please start over.";
        session = {stage: 'start'};
    }
  } catch (error) {
    console.error('Error processing message:', error);
    responseMessage = "An error occurred. Please try again later.";
    session = {stage: 'start'};
  }

  userSessions.set(fromNumber, session);
  userSessions.set('from', fromNumber);


  sendSms(fromNumber, responseMessage)
}



async function handleStartStage(message: any, session: any) {
  const commandParts = message.split('#');

  // Extract the command type (e.g., 'Balance' or 'Send')
  const cmd = commandParts[0].trim().toLowerCase();
  if (commandParts.length > 2) {
    const walletId = "https://ilp.interledger-test.dev/" + commandParts[1].trim();
    const assetCode = commandParts[2].trim();
    const amount = commandParts[3].trim();

    const paymentService = new PaymentService(
      process.env.WALLET_ADDRESS!,
      process.env.OPEN_PRIVATE_KEY!,
      process.env.KEY_ID!
    );

    // Grant income
    const resGrantIncome = await paymentService.requestIncomingPaymentGrant();

    const resIncome = await paymentService.createIncomingPayment(resGrantIncome.accessToken, {
      value: amount,
      assetCode: assetCode,
      assetScale: 2
    }, 10)
    const resGrantQuote = await paymentService.requestQuoteGrant();
    const resQuote = await paymentService.createQuote(resGrantQuote.accessToken, resIncome.id)

    const resOutGrant = await paymentService.requestOutgoingPaymentGrant({value: `${amount*2}`, assetCode: assetCode, assetScale: 2},{value: amount, assetCode: assetCode, assetScale: 2}, "NONCE");
    console.log(resOutGrant)

    // paymentService.requestOutgoingPaymentGrant()
    userSessions.set("continueUri", resOutGrant.continueUri);
    userSessions.set("continueToken", resOutGrant.continueToken);
    userSessions.set("redirectUrl", resOutGrant.redirectUrl);
    userSessions.set("quiteId", resQuote.id);


    session.stage = 'recipient';

    console.log(message);
    return `Please accept the outgoing payment - ${userSessions.get("redirectUrl")}`;
  } else {
    return "To send payment, follow the format: send#ACCOUNT#ASSET#AMOUNT.";
  }
}


router.get('/redirect', async (req: any, res: any) => {
  const paymentService = new PaymentService(
    process.env.WALLET_ADDRESS!,
    process.env.OPEN_PRIVATE_KEY!,
    process.env.KEY_ID!
  );

  const { interact_ref } = req.query;

  if (!interact_ref) {
    return res.status(400).send('Missing interaction reference');
  }

  try {
    // Continue the grant process
    const outgoingGrantRes = await paymentService.continueGrant(
      userSessions.get("continueToken"),
      userSessions.get("continueUri"),
      interact_ref as string
    );

    const outPayRes = await paymentService.createOutgoingPayment(outgoingGrantRes.accessToken, userSessions.get("quiteId"),)

    sendSms(userSessions.get("from"), `Your payment with id ${outPayRes.id} was successfully sent.`);


    // Send the HTML response
    res.send(`
      <!DOCTYPE html>
      <html lang="en">
      <head>
          <meta charset="UTF-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>Payment Permission Granted - Open Mandla</title>
          <style>
              body {
                  font-family: Arial, sans-serif;
                  display: flex;
                  justify-content: center;
                  align-items: center;
                  height: 100vh;
                  margin: 0;
                  background-color: #f0f0f0;
              }
              .container {
                  text-align: center;
                  background-color: white;
                  padding: 2rem;
                  border-radius: 8px;
                  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
              }
              h1 {
                  color: #4CAF50;
              }
              p {
                  margin-bottom: 1.5rem;
              }
              .icon {
                  font-size: 48px;
                  margin-bottom: 1rem;
              }
          </style>
      </head>
      <body>
          <div class="container">
              <div class="icon">✅</div>
              <h1>Payment Permission Granted</h1>
              <p>Your permission for the outgoing payment has been successfully recorded.</p>
              <p>You may now close this window and return to your SMS conversation to complete the transaction.</p>
          </div>
      </body>
      </html>
    `);

  } catch (error) {
    console.error('Error processing redirect:', error);
    res.status(500).send('An error occurred while processing your request');
  }
});


export default router;
