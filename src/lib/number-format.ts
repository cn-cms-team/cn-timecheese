export function numberWithCommas(value: number, digits = 0) {
  return value.toLocaleString(undefined, {
    minimumFractionDigits: digits,
    maximumFractionDigits: digits,
  });
}
export function handleInputDecimal(
  e: React.KeyboardEvent<HTMLInputElement>,
  options?: { allowNegative?: boolean }
) {
  if (e.ctrlKey || e.metaKey) {
    return;
  }

  const allowedControlKeys = [
    'Backspace',
    'Tab',
    'ArrowLeft',
    'ArrowRight',
    'Delete',
    'Home',
    'End',
  ];
  const { key } = e;
  const value = e.currentTarget.value;
  const selectionStart = e.currentTarget.selectionStart ?? 0;
  if (allowedControlKeys.includes(key)) return;
  if (/^\d$/.test(key)) return;
  if (key === '.' && !value.includes('.')) {
    return;
  }
  if (options?.allowNegative && key === '-' && selectionStart === 0 && !value.includes('-')) {
    return;
  }
  e.preventDefault();
}
export const handleLatitudeChange = (
  e: React.ChangeEvent<HTMLInputElement>,
  onChange: (value: string) => void
) => {
  const value = e.target.value;

  const regex = /^-?\d*(\.\d{0,15})?$/;
  if (regex.test(value)) {
    onChange(value);
  }
};
