import express from 'express';
import { sendSms } from '../communication/providers/SMSProvider';
import { checkIfUserExists } from '../db';
import { checkPhoneNumberValidity, createUser } from '../utils/phoneNumber';
import { handleBalanceCommand, handleSendCommand, sendTransactionHistory } from '../communication/utils';

const router = express.Router();

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
    const { exists, userId } = await checkIfUserExists(from);
    console.log("Does User Exist:", exists);
    if (!exists || !userId){
        res.send("User does not exist.");
        const userId = await createUser(from);
        console.log("Created User:", userId);
        sendSms(from, 'Hello Mandla User. We see your are new to the ecosystem. Welcome. Your Open Mandla User ID is: ' + userId + '. To get started, try command BALANCE to check your balance.');
        return;
    }

    // Split the command into parts using the '#' delimiter
    const commandParts = command.split('#');
  
    // Extract the command type (e.g., 'Balance' or 'Send')
    const cmd = commandParts[0].trim().toLowerCase();  // Case-insensitive

    // Handle the command
    switch (cmd) {
        case 'balance':
        const message = await handleBalanceCommand(userId);
        sendSms(from, message)
        break;
  
        case 'verify':
            // handleBalanceCommand();
            break;

        case 'send':
            if (commandParts.length < 4) {
                // console.log("commandParts", commandParts)
                // return res.status(400).json({ error: 'Insufficient par ameters for Send command.' });
                sendSms(from, 'Insufficient parameters for sending assets, follow the format: send#ACCOUNT#ASSET#AMOUNT.');
            }

            const [destAccount, asset, amount] = commandParts.slice(1);
            // const message = await handleSendCommand(userId, destAccount, asset, parseInt(amount));
            // sendSms(from, message)

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


export default router;
