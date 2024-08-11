import * as vscode from "vscode";
import { createText } from "../services/api";
import { getToken } from "../utils/authentication";
import { generateSalt, generateKey, encryptText } from "../utils/encryption";

export async function createTextCommand(context: vscode.ExtensionContext) {
  const token = getToken(context);
  if (!token) {
    vscode.window.showErrorMessage("Please sign in first.");
    return;
  }

  const editor = vscode.window.activeTextEditor;
  let selectedText = "";

  if (editor) {
    const selection = editor.selection;
    selectedText = editor.document.getText(selection);
  }

  const title = await vscode.window.showInputBox({
    prompt: "Enter the title of your text",
  });
  if (!title) return;

  let content: string | undefined;
  if (selectedText) {
    const useSelection = await vscode.window.showQuickPick(["Yes", "No"], {
      placeHolder: "Use selected code as content?",
    });
    if (useSelection === "Yes") {
      content = selectedText;
    }
  }

  if (!content) {
    content = await vscode.window.showInputBox({
      prompt: "Enter the content of your text",
    });
    if (!content) return;
  }

  const format = await vscode.window.showQuickPick(["plaintext", "markdown"], {
    placeHolder: "Select the format",
  });
  if (!format) return;

  const expiryValue = await vscode.window.showInputBox({
    prompt: "Enter expiry value (e.g., 7)",
    validateInput: (value) => {
      if (!/^\d+$/.test(value)) {
        return "Please enter a valid number";
      }
      return null;
    },
  });
  if (!expiryValue) return;

  const expiryUnit = await vscode.window.showQuickPick(
    ["seconds", "minutes", "hours", "days", "weeks", "months", "years"],
    { placeHolder: "Select expiry unit" }
  );
  if (!expiryUnit) return;

  const password = await vscode.window.showInputBox({
    prompt: "Enter encryption password",
    password: true,
  });
  if (!password) return;

  try {
    const salt = generateSalt();
    const key = await generateKey(password, salt);
    const encryptedTitle = await encryptText(title, key);
    const encryptedContent = await encryptText(content, key);
    const encryptionSalt = Buffer.from(salt).toString("base64");

    const result = await createText(token, {
      title: encryptedTitle,
      content: encryptedContent,
      format,
      expiresValue: parseInt(expiryValue),
      expiresUnit: expiryUnit,
      encryptionSalt,
    });

    vscode.window.showInformationMessage(
      `Text created successfully! Slug: ${result.text.slug}`
    );
  } catch (error) {
    console.error("Error creating text:", error);
    vscode.window.showErrorMessage("Failed to create text. Please try again.");
  }
}
