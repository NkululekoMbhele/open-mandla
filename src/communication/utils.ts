import { getTransactionHistory, getUserBalances } from "../db";
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

// Function to format transaction history for SMS
function formatTransactionHistoryForSMS(txnHistory: { user_id: string; datetime: Date; asset: string; amount: string; id: number; source_account: string; dest_account: string; txn_type: string; txn_id: string; }[], userId: string, year: string, month: string) {
    if (txnHistory.length === 0) {
      return `No transaction history available for User ${userId}.`;
    }
  
    let historyText = `Transaction History for User ${userId} for ${year}-${month}:\n`;
  
    txnHistory.forEach((txn, i) => {
      historyText += `${i+1}. Txn ID: ${txn.txn_id}, Type: ${txn.txn_type}, Asset: ${txn.asset}, Amount: ${txn.amount}, Date: ${txn.datetime.toISOString().split('T')[0]}\n`;
    });
  
    return historyText.trim();  // Remove any trailing whitespace
}

  // Example usage:
export async function sendTransactionHistory(userId: string, year: string, month: string, page: number = 0) {
    const txnHistory = await getTransactionHistory(userId, parseInt(year), parseInt(month), page);
  
    const txnHistoryText = formatTransactionHistoryForSMS(txnHistory, userId, year, month);
  
    console.log(txnHistoryText);  // Replace this with actual SMS sending logic
    return txnHistoryText
}
  