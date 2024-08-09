// src/utils/authentication.ts

import * as vscode from "vscode";

export function storeToken(token: string): void {
  vscode.workspace.getConfiguration().update("textbin.token", token, true);
}

export function getToken(): string | undefined {
  return vscode.workspace.getConfiguration().get("textbin.token");
}

export function clearToken(): void {
  vscode.workspace.getConfiguration().update("textbin.token", undefined, true);
}
