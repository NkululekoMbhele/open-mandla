import { getUserBalances } from "../db";
import { sendSms } from "./providers/SMSProvider";

function rtrim(x: string, characters: string) {
    var start = 0;
    var end = x.length - 1;
    while (characters.indexOf(x[end]) >= 0) {
      end -= 1;
    }
    return x.substr(0, end + 1);
  }

// Function to format user balances for SMS/text
export function formatBalancesForSMS(balances: {user_id: string; datetime: Date | null; asset: string; amount: string;}[], userId: string) {
    if (balances.length === 0) {
      return `User ${userId} has no balances.`;
    }

    let balanceText = `Balance Summary for User ${userId}:\n`;

    balances.forEach((balance) => {
        balanceText += `\t - Asset: ${balance.asset}, Amount: ${rtrim(rtrim(`${balance.amount}`, '0'), '.')}\n`;
    });

    return balanceText.trim(); // Remove any trailing whitespace
  }
  
// Example usage:
async function sendUserBalanceSummary(userId: string) {
    const balances = await getUserBalances(userId);
  
    const balanceSummary = formatBalancesForSMS(balances, userId);
  
    console.log(balanceSummary);  // Replace this with actual SMS sending logic

    return balanceSummary
}
  
//   // Example invocation
//   sendUserBalanceSummary('12345').catch(console.error);

export const handleBalanceCommand = async (userId: string) => {
    const balances = await getUserBalances(userId);
    const balanceSummary = formatBalancesForSMS(balances, userId);
    console.log(balanceSummary);
    return balanceSummary
}