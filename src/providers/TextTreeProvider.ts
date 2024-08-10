import * as vscode from "vscode";
import * as path from "path";
import { EncryptedText } from "../types";

export class TextItem extends vscode.TreeItem {
  constructor(
    public readonly title: string,
    public readonly slug: string,
    public readonly collapsibleState: vscode.TreeItemCollapsibleState,
    public readonly textId: number,
    public readonly createdAt: string,
    public readonly expires: string | null,
    public readonly format: string
  ) {
    super(title, collapsibleState);

    this.id = String(textId);

    const now = new Date();
    const creationDate = new Date(createdAt);
    const expiryDate = expires ? new Date(expires) : null;
    const isExpired = expiryDate
      ? expiryDate.getTime() <= now.getTime()
      : false;

    // Truncate the slug if it's too long
    const truncatedSlug =
      slug.length > 20 ? slug.substring(0, 17) + "..." : slug;

    this.description = `${truncatedSlug} | ${format} | ${this.formatDate(
      creationDate
    )} | ${this.getExpiryStatus(expiryDate, isExpired)}`;

    this.tooltip = `ID: ${textId}\nSlug: ${slug}\nTitle: ${title}\nCreated: ${creationDate.toLocaleString()}\nExpires: ${
      expires ? expiryDate!.toLocaleString() : "Never"
    }\nFormat: ${format}\nClick to open in web app`;

    this.iconPath = this.getIconPath(format, isExpired);

    this.contextValue = isExpired ? "expiredText" : "activeText";

    this.command = {
      command: "textbin.openInWebApp",
      title: "Open in Web App",
      arguments: [`https://app.textbin.theenthusiast.dev/${slug}`],
    };
  }

  private formatDate(date: Date): string {
    const now = new Date();
    const diffTime = Math.abs(now.getTime() - date.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays === 0) return "Today";
    if (diffDays === 1) return "Yesterday";
    if (diffDays < 7) return `${diffDays}d ago`;
    if (diffDays < 30) return `${Math.floor(diffDays / 7)}w ago`;
    if (diffDays < 365) return `${Math.floor(diffDays / 30)}m ago`;
    return `${Math.floor(diffDays / 365)}y ago`;
  }

  private getExpiryStatus(expiryDate: Date | null, isExpired: boolean): string {
    if (!expiryDate) return "Never expires";
    if (isExpired) return "Expired";

    const now = new Date();
    const diffTime = expiryDate.getTime() - now.getTime();
    const diffHours = Math.ceil(diffTime / (1000 * 60 * 60));

    if (diffHours < 24) return `Expires in ${diffHours}h`;
    if (diffHours < 168) return `Expires in ${Math.ceil(diffHours / 24)}d`;
    return `Expires in ${Math.ceil(diffHours / 168)}w`;
  }

  private getIconPath(
    format: string,
    isExpired: boolean
  ): { light: string; dark: string } {
    const iconName = isExpired ? "expired" : this.getFormatIconName(format);
    return {
      light: path.join(
        __filename,
        "..",
        "..",
        "resources",
        "light",
        `${iconName}.svg`
      ),
      dark: path.join(
        __filename,
        "..",
        "..",
        "resources",
        "dark",
        `${iconName}.svg`
      ),
    };
  }

  private getFormatIconName(format: string): string {
    switch (format.toLowerCase()) {
      case "markdown":
        return "markdown";
      case "javascript":
      case "typescript":
        return "js";
      case "python":
        return "python";
      case "html":
        return "html";
      case "css":
        return "css";
      default:
        return "text";
    }
  }
}

export class TextTreeProvider implements vscode.TreeDataProvider<TextItem> {
  private _onDidChangeTreeData: vscode.EventEmitter<
    TextItem | undefined | null | void
  > = new vscode.EventEmitter<TextItem | undefined | null | void>();
  readonly onDidChangeTreeData: vscode.Event<
    TextItem | undefined | null | void
  > = this._onDidChangeTreeData.event;

  private texts: EncryptedText[] = [];

  constructor(private context: vscode.ExtensionContext) {}

  getTreeItem(element: TextItem): vscode.TreeItem {
    return element;
  }

  getChildren(element?: TextItem): Thenable<TextItem[]> {
    if (element) {
      return Promise.resolve([]);
    } else {
      return Promise.resolve(
        this.texts.map(
          (text) =>
            new TextItem(
              text.title,
              text.slug,
              vscode.TreeItemCollapsibleState.None,
              text.id,
              text.created_at,
              text.expires,
              text.format
            )
        )
      );
    }
  }

  refresh(): void {
    this._onDidChangeTreeData.fire();
  }

  updateTexts(newTexts: EncryptedText[]): void {
    this.texts = newTexts;
    this.refresh();
  }

  getTextById(id: number): EncryptedText | undefined {
    return this.texts.find((text) => text.id === id);
  }
}
