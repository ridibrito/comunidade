export function onlyDigits(value: string): string {
  return value.replace(/\D+/g, "");
}

export function formatPhoneBR(value: string): string {
  const digits = onlyDigits(value).slice(0, 11); // (99) 99999-9999
  if (digits.length <= 2) return digits;
  if (digits.length <= 6) return `(${digits.slice(0,2)}) ${digits.slice(2)}`;
  if (digits.length <= 10) return `(${digits.slice(0,2)}) ${digits.slice(2,6)}-${digits.slice(6)}`;
  return `(${digits.slice(0,2)}) ${digits.slice(2,7)}-${digits.slice(7,11)}`;
}

export function formatCEP(value: string): string {
  const digits = onlyDigits(value).slice(0, 8); // 99999-999
  if (digits.length <= 5) return digits;
  return `${digits.slice(0,5)}-${digits.slice(5)}`;
}

export function formatUF(value: string): string {
  return value.replace(/[^a-zA-Z]/g, "").toUpperCase().slice(0, 2);
}


