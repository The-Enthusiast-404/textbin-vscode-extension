import * as vscode from "vscode";
import { generateKey, decryptText } from "../utils/encryption";

export async function decryptTextCommand(text: any) {
  const password = await vscode.window.showInputBox({
    prompt: "Enter the decryption password",
    password: true,
  });

  if (!password) {
    return;
  }

  try {
    const salt = Buffer.from(text.encryption_salt, "base64");
    const key = await generateKey(password, salt);
    const decryptedTitle = await decryptText(text.title, key);
    const decryptedContent = await decryptText(text.content, key);

    const document = await vscode.workspace.openTextDocument({
      content: decryptedContent,
      language: text.format,
    });

    await vscode.window.showTextDocument(document, { preview: false });
    vscode.window.showInformationMessage(`Decrypted text: ${decryptedTitle}`);
  } catch (error) {
    console.error("Error decrypting text:", error);
    vscode.window.showErrorMessage(
      "Failed to decrypt text. Please check your password and try again."
    );
  }
}
