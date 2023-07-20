export function validateSnils(snils: string | number) {
  if (typeof snils === 'number') {
    snils = snils.toString();
  } else if (typeof snils !== 'string') {
    snils = '';
  }

  if (!snils.length) {
    throw new Error('СНИЛС пуст');
  }

  if (/[^0-9]/.test(snils)) {
    throw new Error('СНИЛС может состоять только из цифр');
  }

  if (snils.length !== 11) {
    throw new Error('СНИЛС может состоять только из 11 цифр');
  }

  let sum = 0;
  for (let i = 0; i < 9; i++) {
    sum += parseInt(snils[i]) * (9 - i);
  }

  let checkDigit = 0;
  if (sum < 100) {
    checkDigit = sum;
  } else if (sum > 101) {
    checkDigit = sum % 101;
    if (checkDigit === 100) {
      checkDigit = 0;
    }
  }

  if (checkDigit !== parseInt(snils.slice(-2))) {
    throw new Error('Неправильное контрольное число');
  }

  return true;
}

export function convertToSnilsUid(number: string | number) {
  const len = 11;
  const pattern = ''.padEnd(len, '0');
  const snils = pattern + number.toString();
  const snilsWithSeparators = snils.slice(-len).replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, '$1-$2-$3 $4');
  return snilsWithSeparators;
}

export function convertToNumericUid(number: string | number) {
  const len = 9;
  const pattern = ''.padEnd(len, '0');
  const uid = pattern + number.toString();
  return uid.slice(-len);
}
