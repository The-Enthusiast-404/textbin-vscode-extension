import * as vscode from "vscode";
import { signIn } from "../services/api";
import { storeToken } from "../utils/authentication";
import Cookies from "js-cookie";

export async function signInCommand(context: vscode.ExtensionContext) {
  const email = await vscode.window.showInputBox({
    prompt: "Enter your email",
  });
  if (!email) return;

  const password = await vscode.window.showInputBox({
    prompt: "Enter your password",
    password: true,
  });
  if (!password) return;

  try {
    const token = await signIn(email, password);
    storeToken(token, context);
    console.log("Stored Token: ", token); // Debugging line

    // Store email in multiple places
    context.globalState.update("userEmail", email);
    Cookies.set("userEmail", email, { expires: 7 });

    console.log("Stored email:", email); // Debugging line

    vscode.window.showInformationMessage("Signed in successfully!");
  } catch (error) {
    console.error("Error signing in:", error);
    vscode.window.showErrorMessage(
      "Failed to sign in. Please check your credentials and try again."
    );
  }
}
