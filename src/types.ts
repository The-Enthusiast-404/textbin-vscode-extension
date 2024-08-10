import * as vscode from "vscode";

export class TextItem extends vscode.TreeItem {
  constructor(
    public readonly title: string,
    public readonly collapsibleState: vscode.TreeItemCollapsibleState,
    public readonly command?: vscode.Command,
    public readonly createdAt?: string,
    public readonly expires?: string,
    public readonly format?: string
  ) {
    super(title, collapsibleState);
    this.tooltip = `${this.title}\nCreated: ${new Date(
      this.createdAt || ""
    ).toLocaleString()}\nExpires: ${
      this.expires ? new Date(this.expires).toLocaleString() : "Never"
    }\nFormat: ${this.format || "Unknown"}`;
    this.description = this.createdAt
      ? new Date(this.createdAt).toLocaleDateString()
      : "Unknown date";
  }
}
