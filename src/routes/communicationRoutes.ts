import express from 'express';
import { sendSms } from '../communication/providers/SMSProvider';
import { checkIfUserExists } from '../db';
import { checkPhoneNumberValidity, createUser } from '../utils/phoneNumber';
import { handleBalanceCommand } from '../communication/utils';

const router = express.Router();

router.get('/sms', (req, res) => {
  res.send('Hello to Open Mandla via SMS' + `\n${req}`);
});


router.post('/sms', async (req, res) => {
    console.log(`Recieved Body: ${JSON.stringify(req.body)}`);
    const from = req.body.From;
    const command = req.body.Body;

    const numberValid = checkPhoneNumberValidity(from);
    console.log("Is Valid Number:", numberValid);
    if (!numberValid){
        res.send("Invalid phone number.");
        return;
    }

    const { exists, userId } = await checkIfUserExists(from);
    console.log("Does User Exist:", exists);
    if (!exists || !userId){
        res.send("User does not exist.");
        const userId = createUser(from);
        sendSms(from, 'Hello Mandla User. We see your are new to the ecosystem. Welcome. Your user id is: ' + userId + '. To get started, try command BALANCE to check your balance.');
        return;
    }

    // Split the command into parts using the '#' delimiter
    const commandParts = command.split('#');
  
    // Extract the command type (e.g., 'Balance' or 'Send')
    const cmd = commandParts[0].trim().toLowerCase();  // Case-insensitive

    // Handle the command
    switch (cmd) {
        case 'balance':
        handleBalanceCommand(userId);
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
