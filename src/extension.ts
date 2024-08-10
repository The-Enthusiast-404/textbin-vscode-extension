// src/extension.ts

import * as vscode from "vscode";
import { signInCommand } from "./commands/signIn";
import { registerCommand } from "./commands/register";
import { createTextCommand } from "./commands/createText";

export function activate(context: vscode.ExtensionContext) {
  console.log("TextBin extension is now active!");

  let signInDisposable = vscode.commands.registerCommand("textbin.signIn", () =>
    signInCommand(context)
  );
  let registerDisposable = vscode.commands.registerCommand(
    "textbin.register",
    () => registerCommand(context)
  );
  let createTextDisposable = vscode.commands.registerCommand(
    "textbin.createText",
    () => createTextCommand(context)
  );

  context.subscriptions.push(
    signInDisposable,
    registerDisposable,
    createTextDisposable
  );
}

export function deactivate() {}
