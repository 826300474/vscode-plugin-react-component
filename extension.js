const vscode = require('vscode');
const fs = require('fs');


const fileContext = `import React from '@alipay/bigfish/react';
import type { FC } from '@alipay/bigfish/react';

interface Props {

}

const _name_: FC<Props> = () => {
    return <></>
}

export default _name_;`

function activate(context) {

	let disposable = vscode.commands.registerCommand('react-component.creat', function (url) {

		let uri = url.fsPath;

		vscode.window.showInputBox({ placeHolder: '请输入组件名称' }).then((componentName) => {
			if (componentName) {
				fs.mkdir(`${uri}/${componentName}`, function (err) {
					if (!err) {
						const indexUrl = `${uri}/${componentName}/index.tsx`;
						fs.writeFile(indexUrl, fileContext.replace(/_name_/g, componentName), function (err) {
							if (err) {
								vscode.window.showErrorMessage(err.message);
							} else {
								vscode.commands.executeCommand('vscode.openFolder', vscode.Uri.file(indexUrl))
							}
						})
					} else {
						vscode.window.showErrorMessage(err.message);
					}
				})
			}
		})
	});

	context.subscriptions.push(disposable);
}

function deactivate() { }

module.exports = {
	activate,
	deactivate
}
