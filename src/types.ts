export interface EncryptedText {
  id: number;
  title: string;
  content: string;
  format: string;
  created_at: string;
  expires: string | null;
  encryption_salt: string;
  slug: string;
}

export interface TextData {
  title: string;
  content: string;
  format: string;
  expiresUnit: string;
  expiresValue: number;
  is_private: boolean;
  encryptionSalt: string;
}

export interface TextResponse {
  text: EncryptedText;
}
