// src/commands/signIn.ts

import * as vscode from "vscode";
import { signIn } from "../services/api";
import { storeToken } from "../utils/authentication";

export async function signInCommand(context: vscode.ExtensionContext) {
  const email = await vscode.window.showInputBox({
    prompt: "Enter your email",
  });
  if (!email) return;

  const password = await vscode.window.showInputBox({
    prompt: "Enter your password",
    password: true,
  });
  if (!password) return;

  try {
    const token = await signIn(email, password);
    storeToken(token, context);
    console.log("Stored Token: ", token); // Debugging line
    vscode.window.showInformationMessage("Signed in successfully!");
  } catch (error) {
    vscode.window.showErrorMessage(
      "Failed to sign in. Please check your credentials and try again."
    );
  }
}
