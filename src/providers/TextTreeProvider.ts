import * as vscode from "vscode";
import { TextItem } from "../types";

export class TextTreeProvider implements vscode.TreeDataProvider<TextItem> {
  private _onDidChangeTreeData: vscode.EventEmitter<
    TextItem | undefined | null | void
  > = new vscode.EventEmitter<TextItem | undefined | null | void>();
  readonly onDidChangeTreeData: vscode.Event<
    TextItem | undefined | null | void
  > = this._onDidChangeTreeData.event;

  private texts: TextItem[] = [];

  getTreeItem(element: TextItem): vscode.TreeItem {
    return element;
  }

  getChildren(element?: TextItem): Thenable<TextItem[]> {
    if (element) {
      return Promise.resolve([]);
    } else {
      return Promise.resolve(this.texts);
    }
  }

  refresh(): void {
    this._onDidChangeTreeData.fire();
  }

  updateTexts(newTexts: TextItem[]): void {
    this.texts = newTexts;
    this.refresh();
  }
}
