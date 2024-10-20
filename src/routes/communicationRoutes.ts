import express from 'express';
import { sendSms } from '../communication/providers/SMSProvider';
import { checkIfUserExists } from '../db';
import { checkPhoneNumberValidity, createUser } from '../utils/phoneNumber';
import dotenv from "dotenv";
import {PaymentService} from "../core/payment/PaymentService";
import {OutgoingPaymentManager} from "../core/payment/OutgoingPaymentManager";
import { handleBalanceCommand, handleSendCommand, sendTransactionHistory } from '../communication/utils';

const router = express.Router();

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
    if (!numberValid){
        res.send("Invalid phone number.");
        return;
    }

    console.log("Checking if user exists:", from);
    //const { exists, userId } = await checkIfUserExists(from);
    // console.log("Does User Exist:", exists);
    // if (!exists || !userId){
    //     res.send("User does not exist.");
    //     const userId = await createUser(from);
    //     console.log("Created User:", userId);
    //     sendSms(from, 'Hello Mandla User. We see your are new to the ecosystem. Welcome. Your Open Mandla User ID is: ' + userId + '. To get started, try command BALANCE to check your balance.');
    //     return;
    // }

    // Split the command into parts using the '#' delimiter
    const commandParts = command.split('#');
  
    // Extract the command type (e.g., 'Balance' or 'Send')
    const cmd = commandParts[0].trim().toLowerCase();  // Case-insensitive

    // Handle the command
    switch (cmd) {
        case 'balance':
        // const message = await handleBalanceCommand(userId);
        sendSms(from, command)
        break;
  
        case 'verify':
            // handleBalanceCommand();
            break;

        case 'send':
            if (commandParts.length < 0) {
                // console.log("commandParts", commandParts)
                // return res.status(400).json({ error: 'Insufficient parameters for Send command.' });
                sendSms(from, 'Insufficient parameters for sending assets, follow the format: send#ACCOUNT#ASSET#AMOUNT.');
            }

            sendOutgoingPaymentManager(command, from )
            break;


        case 'help':
            if (commandParts.length === 1) {
                sendSms(from, 'What specific command would you like help with?\n - Help Balance\n - Help Send');
            }

            // handleSendCommand(destAccount, asset, amount);
            break;

        case 'history':
            if (commandParts.length < 3) {
                sendSms(from, 'Inomplete command for viewing transaction history, follow the format: history#YEAR#MONTH (e.g. history#2024#02) or history#YEAR#MONTH#PAGE (e.g. history#2024#02).');
            }

            if (commandParts.length === 3) {
                const [ year, month ] = commandParts.slice(1);
                const txnHistory = await sendTransactionHistory(userId, year, month);
                sendSms(from, txnHistory);
            }

            if (commandParts.length === 4) {
                const [ year, month, page ] = commandParts.slice(1);
                const txnHistory = await sendTransactionHistory(userId, year, month, parseInt(page));
                sendSms(from, txnHistory);
            }

            // handleSendCommand(destAccount, asset, amount);
            break;
    
        default:
            // return res.status(400).json({ error: 'Unknown command' });
            break
    }

    const responseString = 'SMS - Let us post |' + command + "|" + from + `\n${JSON.stringify(req.body)}`
    res.send(responseString);
});
  
router.get('/whatsapp', (req, res) => {
    res.send('Hello to Open Mandla via Whatsapp');
});



async function sendOutgoingPaymentManager(incomingMessage: any, fromNumber: any) {
    console.log(`Received SMS from ${fromNumber}: ${incomingMessage}`);

    let session = userSessions.get(fromNumber) || { stage: 'Send Payment' };
    let responseMessage = '';

    try {
        switch (session.stage) {
            case 'Send Payment':
                responseMessage = handleStartStage(incomingMessage, session);
                break;
            case 'recipient':
                responseMessage = handleRecipientStage(incomingMessage, session);
                break;
            case 'amount':
                responseMessage = handleAmountStage(incomingMessage, session);
                break;
            case 'confirm':
                responseMessage = await handleConfirmStage(incomingMessage, session);
                break;
            case 'processing':
                responseMessage = await handleProcessingStage(session);
                break;
            default:
                responseMessage = "I'm sorry, I don't understand. Please start over.";
                session = { stage: 'start' };
        }
    } catch (error) {
        console.error('Error processing message:', error);
        responseMessage = "An error occurred. Please try again later.";
        session = { stage: 'start' };
    }

    userSessions.set(fromNumber, session);

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
        console.log(resGrantIncome)
        const resIncome = await paymentService.createIncomingPayment(resGrantIncome.accessToken, income)
        const resGrantQuote = await paymentService.requestQuoteGrant();
        const resQuote = await paymentService.createQuote(resGrantQuote.accessToken, )


        // paymentService.requestOutgoingPaymentGrant()


        console.log(commandParts)
        console.log(cmd)
        session.stage = 'recipient';

        console.log(message);



        return "Sure, I can help you with that. Who would you like to send money to?";
    } else {
        return "To send payment, follow the format: send#ACCOUNT#ASSET#AMOUNT.";
    }
}

function handleRecipientStage(message: any, session: any) {
    session.recipient = message;
    session.stage = 'amount';
    return `Great! You want to send money to ${session.recipient}. How much would you like to send? (e.g., 50 USD)`;
}

function handleAmountStage(message: any, session: any) {
    const match = message.match(/(\d+(\.\d{1,2})?)\s*(\w{3})/);
    if (match) {
        session.amount = parseFloat(match[1]);
        session.currency = match[3].toUpperCase();
        session.stage = 'confirm';
        return `You want to send ${session.amount} ${session.currency} to ${session.recipient}. Is this correct? Reply YES to confirm or NO to cancel.`;
    } else {
        return "I couldn't understand the amount. Please specify an amount and currency, like '50 USD'.";
    }
}

async function handleConfirmStage(message: any, session: any) {
    if (message === 'yes') {
        session.stage = 'processing';
        return await handleProcessingStage(session);
    } else {
        session.stage = 'start';
        return "Payment cancelled. What would you like to do?";
    }
}

async function handleProcessingStage(session: any) {
    try {
        // Initiate the payment process
        const paymentSession = await outgoingPaymentManager.initiateOutgoingPayment(
          { value: session.amount.toString(), assetCode: session.currency, assetScale: 2 },
          { value: session.amount.toString(), assetCode: session.currency, assetScale: 2 },
          Date.now().toString() // Using timestamp as nonce
        );

        // Store the payment session ID in the user's session
        session.paymentSessionId = paymentSession.id;

        // In a real-world scenario, you would need to handle the interactive flow here
        // This might involve sending the user a link or handling additional SMS messages

        return `Payment initiated. Your payment ID is ${paymentSession.id}. Please check your app or email to complete the payment.`;
    } catch (error) {
        console.error('Error initiating payment:', error);
        session.stage = 'start';
        return "There was an error initiating your payment. Please try again.";
    }
}


export default router;
