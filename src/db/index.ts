import { DATABASE_URL } from '../config/database';
import { drizzle } from 'drizzle-orm/node-postgres';

import { eq, exists } from 'drizzle-orm';
import { userDataTable } from './schema/users';
import { userBalancesTable } from './schema/balances';


export const postgresDB = drizzle(DATABASE_URL);


export async function checkIfUserExists(number: string) {
    const user = await postgresDB.select().from(userDataTable).where(eq(userDataTable.phone_number, number)).limit(1);
    console.log("Monate", user)
    return { exists: user.length > 0, userId: user.length > 0 ? user[0].user_id : null};  // Returns true if the user exists, false otherwise
}


async function insertAsset(userId: string, assetType: string, amount: number) {
    // Insert data into the assets table using Drizzle ORM
    await postgresDB.insert(userBalancesTable).values({
        user_id: userId,
        asset: assetType,
        // amount: amount,
        amount: String(amount*1.0),
    });
  
    console.log(`Asset ${assetType} inserted for user ${userId}`);
}

// Example usage
export async function insertAssetsForUser(userId: string) {
    const assetsData = [
      { assetType: 'XRP', amount: 0 },
      { assetType: 'ZAR', amount: 0 },
      { assetType: 'USD', amount: 0 },
      { assetType: 'EUR', amount: 0 },
    ];
  
    for (const asset of assetsData) {
      await insertAsset(userId, asset.assetType, asset.amount);
    }
}

// Function to get user balances
export async function getUserBalances(userId: string) {
  const balances = await postgresDB
    .select()
    .from(userBalancesTable)
    .where(eq(userBalancesTable.user_id, userId));

  return balances;
}
