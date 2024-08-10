// src/utils/authentication.ts

import * as vscode from "vscode";

const TOKEN_KEY = "textbin.token";

export function storeToken(
  token: string,
  context: vscode.ExtensionContext
): void {
  context.globalState.update(TOKEN_KEY, token);
}

export function getToken(context: vscode.ExtensionContext): string | undefined {
  return context.globalState.get<string>(TOKEN_KEY);
}

export function clearToken(context: vscode.ExtensionContext): void {
  context.globalState.update(TOKEN_KEY, undefined);
}
