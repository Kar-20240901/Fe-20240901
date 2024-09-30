import { SHA256, SHA512 } from "crypto-js";
import JsEncrypt from "jsencrypt";

const RSA_PUBLIC_KEY =
  "MIGfMA0GCSqGSIb3DQEBAQUAA4GNADCBiQKBgQDORMEBWP8fsR+WGmZc9Zl/n9AcBw559LIx+wK9QcGwq7UxkVQPCxGkjqeKm5OpNTSPvsATo/YIcgbZ0Hm/rJMgg1dYgwDYqi1eoYaCgOlre1nAogbzQwOXGVWhI5mPahcTSey9whJiaITWn9TZL7iXoelJX54FDiJp/4Rqhnm7TQIDAQAB";

// 统一的 password加密
export function PasswordRSAEncrypt(
  password: string,
  rsaPublicKey: string = RSA_PUBLIC_KEY
) {
  // 备注：SHA512方法，入参太长了会报错，所以就先 512，然后再 256
  return RSAEncrypt(
    SHA256(SHA512(password).toString()).toString(),
    rsaPublicKey
  );
}

// 非对称加密
export function RSAEncrypt(
  word: string,
  rsaPublicKey: string = RSA_PUBLIC_KEY
) {
  const jse = new JsEncrypt();

  jse.setPublicKey(rsaPublicKey); // 设置公钥

  const rsaEncrypt = jse.encrypt(word); // 进行非对称加密

  return rsaEncrypt || "";
}
