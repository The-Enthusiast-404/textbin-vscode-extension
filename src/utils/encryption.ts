import * as crypto from "crypto";

const SALT_LENGTH = 16;
const IV_LENGTH = 12;

// TypeScript type for CryptoKey (since it's not available in Node.js types)
type CryptoKey = any;

export async function generateKey(
  password: string,
  salt: Uint8Array
): Promise<CryptoKey> {
  const encoder = new TextEncoder();
  const passwordBuffer = encoder.encode(password);

  const keyMaterial = await crypto.subtle.importKey(
    "raw",
    passwordBuffer,
    { name: "PBKDF2" },
    false,
    ["deriveBits", "deriveKey"]
  );

  return crypto.subtle.deriveKey(
    {
      name: "PBKDF2",
      salt: salt,
      iterations: 100000,
      hash: "SHA-256",
    },
    keyMaterial,
    { name: "AES-GCM", length: 256 },
    false,
    ["encrypt", "decrypt"]
  );
}

export function generateSalt(): Uint8Array {
  return crypto.randomBytes(SALT_LENGTH);
}

export function generateIV(): Uint8Array {
  return crypto.randomBytes(IV_LENGTH);
}

export async function encryptText(
  text: string,
  key: CryptoKey
): Promise<string> {
  const encoder = new TextEncoder();
  const data = encoder.encode(text);
  const iv = generateIV();

  const encryptedData = await crypto.subtle.encrypt(
    { name: "AES-GCM", iv: iv },
    key,
    data
  );

  const encryptedArray = new Uint8Array(encryptedData);
  const resultArray = new Uint8Array(iv.length + encryptedArray.length);
  resultArray.set(iv);
  resultArray.set(encryptedArray, iv.length);

  return Buffer.from(resultArray).toString("base64");
}

export async function decryptText(
  encryptedText: string,
  key: CryptoKey
): Promise<string> {
  const encryptedData = Buffer.from(encryptedText, "base64");
  const iv = encryptedData.slice(0, IV_LENGTH);
  const data = encryptedData.slice(IV_LENGTH);

  const decryptedData = await crypto.subtle.decrypt(
    { name: "AES-GCM", iv: iv },
    key,
    data
  );

  const decoder = new TextDecoder();
  return decoder.decode(decryptedData);
}
