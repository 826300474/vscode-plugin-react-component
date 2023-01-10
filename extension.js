const vscode = require('vscode');
const fs = require('fs');


const getFileContext = (params) => {

	const [name, ...restParams] = params;

	const hasTs = restParams.includes('ts');
	const hasLess = restParams.includes('less');
	const hasMemo = restParams.includes('memo');

	const template = [
		`import React from '@alipay/bigfish/react';`,
		`${hasTs ? `\nimport type { FC } from '@alipay/bigfish/react';` : ``}`,
		`${hasLess ? `\nimport styles from './index.less';` : ``}`,
		`${hasTs ? `\n
interface Props {

};` : ``}`,
		`\n
const ${name}${hasTs ? `: FC<Props>` : ``} = () => {
	return <></>
};`,
		`\n
export default ${hasMemo ? `React.memo(${name})` : name};`
	]

	return `${template.filter(d => d).join('')}`;
}

function activate(context) {

	let disposable = vscode.commands.registerCommand('react-component.creat', function (url) {

		let uri = url.fsPath;

		vscode.window.showInputBox({ placeHolder: '请输入组件名称' }).then((inputValue) => {
			if (inputValue) {
				const params = inputValue.split(',');
				const [componentName, ...restParams] = params;
				const hasLess = restParams.includes('less');
				const hasSimple = restParams.includes('simple');

				if (hasSimple) {
					const indexUrl = `${uri}/${componentName}.tsx`;
					fs.writeFile(indexUrl, getFileContext(params), function (err) {
						if (err) {
							vscode.window.showErrorMessage(err.message);
						} else {
							vscode.commands.executeCommand('vscode.openFolder', vscode.Uri.file(indexUrl))
						}
					});
					return;
				}
				fs.mkdir(`${uri}/${componentName}`, function (err) {
					if (!err) {
						const indexUrl = `${uri}/${componentName}/index.tsx`;
						// console.log('indexUrl',indexUrl);
						fs.writeFile(indexUrl, getFileContext(params), function (err) {
							if (err) {
								vscode.window.showErrorMessage(err.message);
							} else {
								vscode.commands.executeCommand('vscode.openFolder', vscode.Uri.file(indexUrl))
							}
						});

						if (hasLess) {
							const lessUrl = `${uri}/${componentName}/index.less`;
							fs.writeFile(lessUrl, ``, function (err) {
								if (err) {
									vscode.window.showErrorMessage(err.message);
								}
							});
						}

					} else {
						vscode.window.showErrorMessage(err.message);
					}
				});


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
