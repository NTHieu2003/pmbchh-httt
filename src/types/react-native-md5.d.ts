declare module 'react-native-md5' {
  const md5: {
    hex_md5(value: string): string;
    b64_md5(value: string): string;
    str_md5(value: string): string;
    hex_hmac_md5(key: string, value: string): string;
    b64_hmac_md5(key: string, value: string): string;
    str_hmac_md5(key: string, value: string): string;
  };
  export default md5;
}
