export function generateSixDigitCode() {
  return Math.floor(Math.random() * 1000000).toString().padStart(6, '0');
}