import * as vscode from "vscode";
import { fetchUserData } from "../services/api";
import { getToken } from "../utils/authentication";
import Cookies from "js-cookie";

export async function fetchUserTextsCommand(context: vscode.ExtensionContext) {
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

  // Debug: Log the email retrieval attempt
  console.log("Retrieved email:", email);

  if (!email) {
    // If email is still not found, ask the user to input it
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

    // Save the email for future use
    context.globalState.update("userEmail", email);
    Cookies.set("userEmail", email, { expires: 7 });
  }

  try {
    // Debug: Log the API call attempt
    console.log("Attempting to fetch user data for email:", email);

    const userData = await fetchUserData(token, email);

    // Debug: Log the received user data
    console.log("Received user data:", userData);

    const texts = userData.user.texts;

    if (!texts || texts.length === 0) {
      vscode.window.showInformationMessage("You don't have any texts yet.");
      return;
    }

    // Create a new untitled document with the list of texts
    let content = "Your Texts:\n\n";
    texts.forEach((text: any, index: number) => {
      content += `${index + 1}. Title: ${text.title}\n`;
      content += `   Slug: ${text.slug}\n`;
      content += `   Created: ${new Date(text.created_at).toLocaleString()}\n`;
      content += `   Expires: ${
        text.expires ? new Date(text.expires).toLocaleString() : "Never"
      }\n`;
      content += `   Format: ${text.format}\n\n`;
    });

    const document = await vscode.workspace.openTextDocument({
      content: content,
      language: "plaintext",
    });
    await vscode.window.showTextDocument(document);

    vscode.window.showInformationMessage(
      `Fetched ${texts.length} texts successfully!`
    );
  } catch (error) {
    // Debug: Log the error
    console.error("Error fetching texts:", error);

    vscode.window.showErrorMessage("Failed to fetch texts. Please try again.");
  }
}
