import * as vscode from "vscode";
import { TextTreeProvider } from "../providers/TextTreeProvider";
import { generateKey, decryptText } from "../utils/encryption";

export async function decryptAndShowTextCommand(
  textItem: vscode.TreeItem,
  treeDataProvider: TextTreeProvider
) {
  const text = treeDataProvider.getTextById(parseInt(textItem.id!));
  if (!text) {
    vscode.window.showErrorMessage("Text not found.");
    return;
  }

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

    // Create and show a new webview
    const panel = vscode.window.createWebviewPanel(
      "textbinDecrypted",
      decryptedTitle,
      vscode.ViewColumn.One,
      {}
    );

    panel.webview.html = getWebviewContent(
      decryptedTitle,
      decryptedContent,
      text.format
    );
  } catch (error) {
    console.error("Error decrypting text:", error);
    vscode.window.showErrorMessage(
      "Failed to decrypt text. Please check your password and try again."
    );
  }
}

function getWebviewContent(title: string, content: string, format: string) {
  return `
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>${title}</title>
      <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; padding: 20px; }
        h1 { color: #333; }
        pre { background-color: #f4f4f4; padding: 10px; border-radius: 5px; }
      </style>
    </head>
    <body>
      <h1>${title}</h1>
      <p>Format: ${format}</p>
      <pre>${content}</pre>
    </body>
    </html>
  `;
}
