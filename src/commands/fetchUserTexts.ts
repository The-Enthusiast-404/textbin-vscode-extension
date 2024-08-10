import * as vscode from "vscode";
import { fetchUserData } from "../services/api";
import { getToken } from "../utils/authentication";
import { TextItem } from "../types";
import { TextTreeProvider } from "../providers/TextTreeProvider";
import Cookies from "js-cookie";

export async function fetchUserTextsCommand(
  context: vscode.ExtensionContext,
  treeDataProvider: TextTreeProvider
) {
  const token = getToken(context);
  if (!token) {
    vscode.window.showErrorMessage("Please sign in first.");
    return;
  }

  // Try to get email from multiple sources
  let email = context.globalState.get<string>("userEmail");
  if (!email) {
    email = Cookies.get("userEmail");
  }

  console.log("Retrieved email:", email);

  if (!email) {
    email = await vscode.window.showInputBox({
      prompt: "Please enter your email address",
      validateInput: (value) => {
        return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)
          ? null
          : "Please enter a valid email address";
      },
    });

    if (!email) {
      vscode.window.showErrorMessage("Email is required to fetch texts.");
      return;
    }

    context.globalState.update("userEmail", email);
    Cookies.set("userEmail", email, { expires: 7 });
  }

  try {
    const userData = await fetchUserData(token, email);
    const texts = userData.user.texts;

    if (!texts || texts.length === 0) {
      vscode.window.showInformationMessage("You don't have any texts yet.");
      treeDataProvider.updateTexts([]);
      return;
    }

    const textItems: TextItem[] = texts.map(
      (text: any) =>
        new TextItem(
          text.title || "Untitled",
          vscode.TreeItemCollapsibleState.None,
          {
            command: "textbin.decryptText",
            title: "Decrypt Text",
            arguments: [text],
          },
          text.created_at,
          text.expires,
          text.format
        )
    );

    treeDataProvider.updateTexts(textItems);
    vscode.window.showInformationMessage(
      `Fetched ${texts.length} texts successfully!`
    );
  } catch (error) {
    console.error("Error fetching texts:", error);
    vscode.window.showErrorMessage("Failed to fetch texts. Please try again.");
  }
}
