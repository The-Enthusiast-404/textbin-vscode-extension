import * as vscode from "vscode";
import { fetchUserData } from "../services/api";
import { getToken } from "../utils/authentication";
import { EncryptedText } from "../types";
import { TextTreeProvider } from "../providers/TextTreeProvider";

export async function fetchUserTextsCommand(
  context: vscode.ExtensionContext,
  treeDataProvider: TextTreeProvider
) {
  const token = getToken(context);
  if (!token) {
    vscode.window.showErrorMessage("Please sign in first.");
    return;
  }

  const email = context.globalState.get<string>("userEmail");
  if (!email) {
    vscode.window.showErrorMessage(
      "User email not found. Please sign in again."
    );
    return;
  }

  try {
    const userData = await fetchUserData(token, email);
    const texts: EncryptedText[] = userData.user.texts;

    if (!texts || texts.length === 0) {
      vscode.window.showInformationMessage("You don't have any texts yet.");
      treeDataProvider.updateTexts([]);
      return;
    }

    treeDataProvider.updateTexts(texts);
    vscode.window.showInformationMessage(
      `Fetched ${texts.length} texts successfully!`
    );
  } catch (error) {
    console.error("Error fetching texts:", error);
    vscode.window.showErrorMessage("Failed to fetch texts. Please try again.");
  }
}
