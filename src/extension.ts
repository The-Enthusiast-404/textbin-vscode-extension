import * as vscode from "vscode";
import { signInCommand } from "./commands/signIn";
import { registerCommand } from "./commands/register";
import { createTextCommand } from "./commands/createText";
import { fetchUserTextsCommand } from "./commands/fetchUserTexts";
import { decryptAndShowTextCommand } from "./commands/decryptFileAndShow";
import { TextTreeProvider } from "./providers/TextTreeProvider";

export function activate(context: vscode.ExtensionContext) {
  console.log("TextBin extension is now active!");

  const treeDataProvider = new TextTreeProvider(context);
  const treeView = vscode.window.createTreeView("textbinTexts", {
    treeDataProvider,
  });

  context.subscriptions.push(treeView);

  context.subscriptions.push(
    vscode.commands.registerCommand("textbin.signIn", () =>
      signInCommand(context)
    ),
    vscode.commands.registerCommand("textbin.register", () =>
      registerCommand(context)
    ),
    vscode.commands.registerCommand("textbin.createText", () =>
      createTextCommand(context)
    ),
    vscode.commands.registerCommand("textbin.fetchUserTexts", () =>
      fetchUserTextsCommand(context, treeDataProvider)
    ),
    vscode.commands.registerCommand("textbin.decryptAndShowText", (item) =>
      decryptAndShowTextCommand(item, treeDataProvider)
    ),
    vscode.commands.registerCommand("textbin.openInWebApp", (url: string) => {
      vscode.env.openExternal(vscode.Uri.parse(url));
    })
  );
}

export function deactivate() {}
