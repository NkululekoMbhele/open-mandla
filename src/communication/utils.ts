import { getUserBalances } from "../db";
import { sendSms } from "./providers/SMSProvider";

// Function to format user balances for SMS/text
export function formatBalancesForSMS(balances: {user_id: string; datetime: Date | null; asset: string; amount: string;}[], userId: string) {
    if (balances.length === 0) {
      return `User ${userId} has no balances.`;
    }
  
    let balanceText = `Balance Summary for User ${userId}:\n`;
  
    balances.forEach((balance) => {
      balanceText += `Asset: ${balance.asset}, Amount: ${balance.amount}\n`;
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

    sendSms(userId, balanceSummary)
}