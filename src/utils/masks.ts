/**
 * Mask utilities for formatting and unformatting common Brazilian document types
 */

/**
 * Formats a phone number with mask (xx) xxxxx-xxxx
 * @param value - Raw phone number string
 * @returns Formatted phone number
 */
export const formatPhoneNumber = (value: string): string => {
  if (!value) return '';
  
  // Remove all non-digits
  const digits = value.replace(/\D/g, '');
  
  // Apply mask based on length
  if (digits.length <= 2) {
    return `(${digits}`;
  } else if (digits.length <= 7) {
    return `(${digits.slice(0, 2)}) ${digits.slice(2)}`;
  } else if (digits.length <= 11) {
    return `(${digits.slice(0, 2)}) ${digits.slice(2, 7)}-${digits.slice(7)}`;
  } else {
    // Limit to 11 digits
    return `(${digits.slice(0, 2)}) ${digits.slice(2, 7)}-${digits.slice(7, 11)}`;
  }
};

/**
 * Removes phone number mask and returns only digits
 * @param value - Formatted phone number
 * @returns Raw phone number (digits only)
 */
export const unformatPhoneNumber = (value: string): string => {
  if (!value) return '';
  return value.replace(/\D/g, '');
};

/**
 * Formats a CPF with mask xxx.xxx.xxx-xx
 * @param value - Raw CPF string
 * @returns Formatted CPF
 */
export const formatCPF = (value: string): string => {
  if (!value) return '';
  
  // Remove all non-digits
  const digits = value.replace(/\D/g, '');
  
  // Apply mask based on length
  if (digits.length <= 3) {
    return digits;
  } else if (digits.length <= 6) {
    return `${digits.slice(0, 3)}.${digits.slice(3)}`;
  } else if (digits.length <= 9) {
    return `${digits.slice(0, 3)}.${digits.slice(3, 6)}.${digits.slice(6)}`;
  } else if (digits.length <= 11) {
    return `${digits.slice(0, 3)}.${digits.slice(3, 6)}.${digits.slice(6, 9)}-${digits.slice(9)}`;
  } else {
    // Limit to 11 digits
    return `${digits.slice(0, 3)}.${digits.slice(3, 6)}.${digits.slice(6, 9)}-${digits.slice(9, 11)}`;
  }
};

/**
 * Removes CPF mask and returns only digits
 * @param value - Formatted CPF
 * @returns Raw CPF (digits only)
 */
export const unformatCPF = (value: string): string => {
  if (!value) return '';
  return value.replace(/\D/g, '');
};

/**
 * Validates if a phone number has the correct length (10 or 11 digits)
 * @param value - Raw phone number (digits only)
 * @returns True if valid length
 */
export const isValidPhoneLength = (value: string): boolean => {
  const digits = value.replace(/\D/g, '');
  return digits.length >= 10 && digits.length <= 11;
};

/**
 * Validates if a CPF has the correct length (11 digits)
 * @param value - Raw CPF (digits only)
 * @returns True if valid length
 */
export const isValidCPFLength = (value: string): boolean => {
  const digits = value.replace(/\D/g, '');
  return digits.length === 11;
};

/**
 * Basic CPF validation algorithm
 * @param cpf - Raw CPF (digits only)
 * @returns True if CPF is valid
 */
export const isValidCPF = (cpf: string): boolean => {
  const digits = cpf.replace(/\D/g, '');
  
  if (digits.length !== 11) return false;
  
  // Check for known invalid CPFs (all same digits)
  if (/^(\d)\1{10}$/.test(digits)) return false;
  
  // Validate first check digit
  let sum = 0;
  for (let i = 0; i < 9; i++) {
    sum += parseInt(digits[i]) * (10 - i);
  }
  let remainder = sum % 11;
  const checkDigit1 = remainder < 2 ? 0 : 11 - remainder;
  
  if (parseInt(digits[9]) !== checkDigit1) return false;
  
  // Validate second check digit
  sum = 0;
  for (let i = 0; i < 10; i++) {
    sum += parseInt(digits[i]) * (11 - i);
  }
  remainder = sum % 11;
  const checkDigit2 = remainder < 2 ? 0 : 11 - remainder;
  
  return parseInt(digits[10]) === checkDigit2;
}; 