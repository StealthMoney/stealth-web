export const SATS_PER_BTC = 100_000_000
// Regex to validate a password. Checks for at least one uppercase letter, one lowercase letter, one number and one special character, and makes sure the minimum length is 8 characters.
export const PASSWORD_REGEX =
	/^(?=.*[a-zA-Z0-9])(?=.*[A-Z])(?=.*[!@#$&*])(?=.*[a-z])(?=.*[0-9]).{8,20}$/
// Regex to validate an integer
export const INT_REGEX = /^\d*\.?\d*$/
export const TXN_CHARGE = 230 // in naira
export const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
