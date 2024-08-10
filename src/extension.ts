import * as vscode from "vscode";
import { signInCommand } from "./commands/signIn";
import { registerCommand } from "./commands/register";
import { createTextCommand } from "./commands/createText";
import { fetchUserTextsCommand } from "./commands/fetchUserTexts";
import { decryptTextCommand } from "./commands/decryptText";
import { TextTreeProvider } from "./providers/TextTreeProvider";

export function activate(context: vscode.ExtensionContext) {
  console.log("TextBin extension is now active!");

  const treeDataProvider = new TextTreeProvider();
  const treeView = vscode.window.createTreeView("textbinTexts", {
    treeDataProvider,
  });

  context.subscriptions.push(treeView);

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
    () => fetchUserTextsCommand(context, treeDataProvider)
  );
  let decryptTextDisposable = vscode.commands.registerCommand(
    "textbin.decryptText",
    (text: any) => decryptTextCommand(text)
  );

  context.subscriptions.push(
    signInDisposable,
    registerDisposable,
    createTextDisposable,
    fetchUserTextsDisposable,
    decryptTextDisposable
  );
}

export function deactivate() {}
