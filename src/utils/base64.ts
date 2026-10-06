// React Native (Hermes) has no global `btoa` — pmbc_web's logOut() does
// `btoa(token)` to build the `req` field for POST /gateway/auth/logout.
// Minimal RFC 4648 base64 encoder so mobile can send the exact same body.
const CHARS =
  'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/';

export const base64Encode = (input: string): string => {
  let output = '';
  let i = 0;

  while (i < input.length) {
    const byte1 = input.charCodeAt(i++) & 0xff;
    const haveByte2 = i < input.length;
    const byte2 = haveByte2 ? input.charCodeAt(i++) & 0xff : 0;
    const haveByte3 = i < input.length;
    const byte3 = haveByte3 ? input.charCodeAt(i++) & 0xff : 0;

    const triplet = (byte1 << 16) | (byte2 << 8) | byte3;

    output += CHARS[(triplet >> 18) & 0x3f];
    output += CHARS[(triplet >> 12) & 0x3f];
    output += haveByte2 ? CHARS[(triplet >> 6) & 0x3f] : '=';
    output += haveByte3 ? CHARS[triplet & 0x3f] : '=';
  }

  return output;
};
