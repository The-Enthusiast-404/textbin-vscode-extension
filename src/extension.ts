import * as vscode from "vscode";
import { signInCommand } from "./commands/signIn";
import { registerCommand } from "./commands/register";
import { createTextCommand } from "./commands/createText";
import { fetchUserTextsCommand } from "./commands/fetchUserTexts";

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
  let fetchUserTextsDisposable = vscode.commands.registerCommand(
    "textbin.fetchUserTexts",
    () => fetchUserTextsCommand(context)
  );

  context.subscriptions.push(
    signInDisposable,
    registerDisposable,
    createTextDisposable,
    fetchUserTextsDisposable
  );
}

export function deactivate() {}
