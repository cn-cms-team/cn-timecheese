const CONTROL_CHARACTERS_REGEX = /[\u0000-\u0008\u000B\u000C\u000E-\u001F\u007F]/g;

const UNSAFE_CONTENT_PATTERNS = [
  /<\s*script/i,
  /<\/?[a-z][^>]*>/i,
  /javascript\s*:/i,
  /data\s*:\s*text\s*\/\s*html/i,
  /on\w+\s*=/i,
];

export const sanitizePlainTextInput = (value: string): string => {
  return value.replace(/\r\n/g, '\n').replace(CONTROL_CHARACTERS_REGEX, '').trim();
};

export const hasUnsafeRichTextContent = (value: string): boolean => {
  return UNSAFE_CONTENT_PATTERNS.some((pattern) => pattern.test(value));
};
