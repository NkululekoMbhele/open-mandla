import dotenv from 'dotenv';
dotenv.config();

const { accountSid, authToken, from } = {
    accountSid: String(process.env.TWILIO_ACCOUNT_SID),
    authToken: String(process.env.TWILIO_AUTH_TOKEN),
    from: String(process.env.TWILIO_PHONE_NUMBER),
};

// console.log("authToken", authToken)
// console.log("accountSid", accountSid)

const client = require('twilio')(accountSid, authToken);
const HOST_NUMBER = String(process.env.TWILIO_PHONE_NUMBER);

export const sendSms = (sender: string, message: string) => client.messages
  .create({
    body: message,
    to: sender, // Text your number
    from: from, // From a valid Twilio number
  })
  .then((message: any) => console.log(message.sid));

// export const sendSms = (sender: string, message: string) => "HB"
//   .then((message: any) => console.log(message.sid));