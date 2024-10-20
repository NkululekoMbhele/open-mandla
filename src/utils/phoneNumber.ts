import parsePhoneNumberFromString, { isValidNumber } from 'libphonenumber-js';
import { postgresDB } from '../db';
import { userDataTable } from '../db/schema/users';

// Example function to check if a phone number is valid
export function checkPhoneNumberValidity(phoneNumber: string) {
  const isValid = isValidNumber(phoneNumber);
  return isValid;
}

export function generate8DigitKey() {
    // Generate a random number between 10000000 and 99999999 (inclusive)
    return Math.floor(10000000 + Math.random() * 90000000);
}
  

export async function createUser(phoneNumber: string) {
    // Parse the phone number to extract the country ISO code
    const phoneNumberParsed = parsePhoneNumberFromString(phoneNumber);
  
    if (!phoneNumberParsed) {
      throw new Error('Invalid phone number');
    }

    // Get the 3-letter country ISO code (e.g., 'ZA' for South Africa)
    const countryISO = phoneNumberParsed.country;

    const userId = generate8DigitKey();

    if (!countryISO) return;

    // Insert the user into the database using Drizzle ORM
    await postgresDB.insert(userDataTable).values({
      user_id: `${userId}`,
      phone_number: phoneNumber,
    //   user_name: "",
      country: countryISO,  // Extracted from phone number
    });

    insertAssetsForUser(userId);
  
    console.log('User created successfully');
    return userId
}


function insertAssetsForUser(userId: number) {
    throw new Error('Function not implemented.');
}
// export handleBalanceCommand = async (phoneNumber: string) => {
//     const user = await postgresDB
//     .select()
//     .from(userDataTable)
//     .where(eq(userDataTable.phone_number, phoneNumber))
//     .limit(1);
// }