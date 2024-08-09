// src/services/api.ts

import * as vscode from "vscode";
import axios from "axios";

const API_BASE_URL = "https://textbin.theenthusiast.dev/v1";

export async function signIn(email: string, password: string): Promise<string> {
  try {
    const response = await axios.post(`${API_BASE_URL}/users/authentication`, {
      email,
      password,
    });
    return response.data.authentication_token.token;
  } catch (error) {
    throw new Error("Failed to sign in");
  }
}

export async function register(
  name: string,
  email: string,
  password: string
): Promise<void> {
  try {
    await axios.post(`${API_BASE_URL}/users`, { name, email, password });
  } catch (error) {
    throw new Error("Failed to register");
  }
}