/**
 * Utility for generating standardized Employee Login IDs
 * Formula: [Company Initials][First 2 letters of First & Last Name][Year of Joining][4-digit Serial]
 * Example: OIJODO20220001
 */

export const generateLoginId = (
  fullName: string,
  yearOfJoining: number | string = new Date().getFullYear(),
  serialNumber: number = 1,
  companyName: string = 'Odoo India'
): string => {
  // 1. Company Initials (e.g. "Odoo India" -> "OI", "DayFlow Technologies" -> "DF")
  let companyPrefix = 'OI';
  const companyWords = companyName.trim().split(/\s+/);
  if (companyWords.length >= 2) {
    companyPrefix = (companyWords[0][0] + companyWords[1][0]).toUpperCase();
  } else if (companyWords[0].length >= 2) {
    companyPrefix = companyWords[0].substring(0, 2).toUpperCase();
  }

  // 2. First 2 letters of First Name + First 2 letters of Last Name
  const nameParts = fullName.trim().split(/\s+/);
  let firstNamePart = 'XX';
  let lastNamePart = 'XX';

  if (nameParts.length >= 2) {
    firstNamePart = nameParts[0].substring(0, 2).toUpperCase().padEnd(2, 'X');
    lastNamePart = nameParts[nameParts.length - 1].substring(0, 2).toUpperCase().padEnd(2, 'X');
  } else if (nameParts.length === 1 && nameParts[0].length >= 4) {
    firstNamePart = nameParts[0].substring(0, 2).toUpperCase();
    lastNamePart = nameParts[0].substring(2, 4).toUpperCase();
  } else if (nameParts.length === 1) {
    firstNamePart = nameParts[0].substring(0, 2).toUpperCase().padEnd(2, 'X');
    lastNamePart = 'EM';
  }

  const nameCode = `${firstNamePart}${lastNamePart}`;

  // 3. Year of Joining (4-digit)
  const yearStr = yearOfJoining.toString().substring(0, 4);

  // 4. Serial Number (4-digit padded, e.g. 0001)
  const serialStr = serialNumber.toString().padStart(4, '0');

  return `${companyPrefix}${nameCode}${yearStr}${serialStr}`;
};

export const generateInitialPassword = (): string => {
  return 'Dayflow@' + Math.floor(1000 + Math.random() * 9000);
};
