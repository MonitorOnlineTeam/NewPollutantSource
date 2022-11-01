export function checkIsNumber(value) {
  let RegExpNumber = /^[0-9]*$/;
  let isNumber = RegExpNumber.test(value)
  if (isNumber) {
    return true;
  }
  return false;
}