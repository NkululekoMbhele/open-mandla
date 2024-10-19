import express from 'express';
import { sendSms } from '../communication/providers/SMSProvider';

const router = express.Router();

router.get('/sms', (req, res) => {
  res.send('Hello to Open Mandla via SMS' + `\n${req}`);
});


router.post('/sms', (req, res) => {
    console.log(`Recieved Body: ${JSON.stringify(req.body)}`);
    const from = req.body.From;
    const command = req.body.Body;
    
    // const { from, command } = req.body; // Assuming the command comes in the body as 'command'
  
    // Split the command into parts using the '#' delimiter
    const commandParts = command.split('#');
  
    // Extract the command type (e.g., 'Balance' or 'Send')
    const cmd = commandParts[0].trim().toLowerCase();  // Case-insensitive

    // Handle the command
    switch (cmd) {
      case 'balance':
        // handleBalanceCommand();
        break;
  
      case 'send':
        if (commandParts.length < 4) {
        //   return res.status(400).json({ error: 'Insufficient parameters for Send command.' });
          sendSms(from, 'Insufficient parameters for sending assets, follow the format: send#ACCOUNT#ASSET#AMOUNT.');
        }

        const [destAccount, asset, amount] = commandParts.slice(1);
        // handleSendCommand(destAccount, asset, amount);
        break;
  
      default:
        // return res.status(400).json({ error: 'Unknown command' });
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