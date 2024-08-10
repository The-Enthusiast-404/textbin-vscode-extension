import * as crypto from "crypto";

const SALT_LENGTH = 16;
const IV_LENGTH = 12;

export async function generateKey(
  password: string,
  salt: Buffer
): Promise<Buffer> {
  return new Promise((resolve, reject) => {
    crypto.pbkdf2(password, salt, 100000, 32, "sha256", (err, derivedKey) => {
      if (err) reject(err);
      else resolve(derivedKey);
    });
  });
}

export function generateSalt(): Buffer {
  return crypto.randomBytes(SALT_LENGTH);
}

export function generateIV(): Buffer {
  return crypto.randomBytes(IV_LENGTH);
}

export async function encryptText(text: string, key: Buffer): Promise<string> {
  const iv = generateIV();
  const cipher = crypto.createCipheriv("aes-256-gcm", key, iv);

  let encrypted = cipher.update(text, "utf8");
  encrypted = Buffer.concat([encrypted, cipher.final()]);

  const authTag = cipher.getAuthTag();

  const resultBuffer = Buffer.concat([iv, encrypted, authTag]);
  return resultBuffer.toString("base64");
}

export async function decryptText(
  encryptedText: string,
  key: Buffer
): Promise<string> {
  const encryptedBuffer = Buffer.from(encryptedText, "base64");

  const iv = encryptedBuffer.slice(0, IV_LENGTH);
  const encryptedContent = encryptedBuffer.slice(IV_LENGTH, -16);
  const authTag = encryptedBuffer.slice(-16);

  const decipher = crypto.createDecipheriv("aes-256-gcm", key, iv);
  decipher.setAuthTag(authTag);

  let decrypted = decipher.update(encryptedContent);
  decrypted = Buffer.concat([decrypted, decipher.final()]);

  return decrypted.toString("utf8");
}
