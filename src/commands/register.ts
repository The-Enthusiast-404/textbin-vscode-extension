// src/commands/register.ts

import * as vscode from "vscode";
import { register } from "../services/api";

export async function registerCommand(context: vscode.ExtensionContext) {
  const name = await vscode.window.showInputBox({
    prompt: "Enter your full name",
  });
  if (!name) return;

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
    await register(name, email, password);
    vscode.window.showInformationMessage(
      "Registered successfully! Please sign in."
    );
  } catch (error) {
    vscode.window.showErrorMessage("Failed to register. Please try again.");
  }
}
