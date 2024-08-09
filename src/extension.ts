// src/extension.ts

import * as vscode from "vscode";
import { signInCommand } from "./commands/signIn";
import { registerCommand } from "./commands/register";

export function activate(context: vscode.ExtensionContext) {
  console.log("TextBin extension is now active!");

  let signInDisposable = vscode.commands.registerCommand(
    "textbin.signIn",
    signInCommand
  );
  let registerDisposable = vscode.commands.registerCommand(
    "textbin.register",
    registerCommand
  );

  context.subscriptions.push(signInDisposable, registerDisposable);
}

export function deactivate() {}
