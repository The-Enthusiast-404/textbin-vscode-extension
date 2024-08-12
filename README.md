# TextBin VSCode Extension

TextBin VSCode Extension integrates TextBin functionality directly into your Visual Studio Code environment, allowing you to create, manage, and share encrypted text snippets without leaving your IDE.

## Features

- Create and manage encrypted texts directly within VSCode
- Support for multiple programming languages and formats
- Syntax highlighting preview
- Custom expiration settings
- TextBin explorer for easy text management
- Secure decryption and viewing of texts

## Installation

1. Open VS Code
2. Go to the Extensions view (Ctrl+Shift+X)
3. Search for "TextBin"
4. Click Install

## Getting Started

### 1. Sign In or Register

Before you can start using TextBin, you need to sign in to your account or register if you don't have one.

1. Open the Command Palette (Ctrl+Shift+P)
2. Type "TextBin: Sign In" and select it
3. Enter your email and password
4. If you don't have an account, it will prompt you to register

Commands:

- `TextBin: Sign In`
- `TextBin: Register`

### 2. Create Your First Text

Now that you're signed in, you can create your first TextBin text:

1. Select some code in your editor (optional)
2. Right-click and select "TextBin: Create Text from Selection" or use the Command Palette
3. If you didn't select code, you'll be prompted to enter text content
4. Enter a title for your text
5. Choose the language/format
6. Set an expiration time
7. Enter an encryption password

Commands:

- `TextBin: Create Text`
- `TextBin: Create Text from Selection`

### 3. View Your Texts

After creating texts, you can view them in the TextBin explorer:

1. Click on the TextBin icon in the Activity Bar (usually on the left side)
2. You'll see a list of your texts in the Side Bar
3. Click on a text to view its details

Command:

- `TextBin: Open TextBin Explorer`

### 4. Decrypt and View a Text

To view the content of an encrypted text:

1. In the TextBin explorer, left-click on a text
2. It'll redirect you to the web app for decryption
3. Enter the decryption password
4. The decrypted text will open in the web app

### 5. Refresh Your Texts

To fetch the latest texts from the server:

1. In the TextBin explorer, click the refresh icon at the top of the view
2. Or use the Command Palette to run "TextBin: Fetch User Texts"

Command:

- `TextBin: Fetch User Texts`

## Complete List of Commands

- `TextBin: Sign In`: Sign in to your TextBin account
- `TextBin: Register`: Create a new TextBin account
- `TextBin: Create Text`: Create a new TextBin text
- `TextBin: Create Text from Selection`: Create a new TextBin text from selected code
- `TextBin: Open TextBin Explorer`: Open the TextBin explorer view
- `TextBin: Decrypt and Show Text`: Decrypt and display a selected text
- `TextBin: Fetch User Texts`: Manually refresh your texts from the server

## Extension Settings

This extension contributes the following settings:

- `textbin.autoFetch`: Enable/disable automatic fetching of texts when the TextBin explorer is opened
- `textbin.defaultExpiryUnit`: Set the default expiry unit for new texts
- `textbin.defaultExpiryValue`: Set the default expiry value for new texts

You can modify these settings in your VS Code settings (File > Preferences > Settings).

## Troubleshooting

If you encounter any issues:

1. Ensure you're signed in (use the "TextBin: Sign In" command)
2. Check your internet connection
3. Try refreshing your texts (use the "TextBin: Fetch User Texts" command)
4. If problems persist, check the Output panel (View > Output) and select "TextBin" from the dropdown for error messages

If you're still having trouble, please report the issue on our GitHub repository.

## Feedback and Contributions

We welcome your feedback and contributions! Please report any issues or suggest features on our [GitHub repository](https://github.com/yourusername/textbin-vscode-extension).

## Privacy and Security

TextBin takes your privacy and security seriously. All texts are encrypted client-side before being sent to our servers. Your encryption passwords are never stored or transmitted.

For more information about our security practices, please visit [TextBin Security](https://app.textbin.theenthusiast.dev/privacy-policy).

---

**Enjoy using TextBin in VSCode!**
