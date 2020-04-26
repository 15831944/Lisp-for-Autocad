import * as vscode from 'vscode'
import { ProjectTreeProvider } from './projectTree';

export async function AddFile2Project() {
    try {
        if (ProjectTreeProvider.hasProjectOpened() == false)
            return Promise.reject("Please open a project first."); //TBD: localize

        let selectedFiles = await SelectLspFiles();
        if (!selectedFiles)
            return; //user has cancelled the open file dialog
        
        let addedFiles = [];
        for (let file of selectedFiles) {
            let fileUpper = file.fsPath.toUpperCase();
            if (fileUpper.endsWith(".LSP") == false)
                return Promise.reject("Only .lsp file is allowed."); //TBD: localize

            if (ProjectTreeProvider.instance().addFileNode(file.fsPath) == false) {
                vscode.window.showInformationMessage("File already in project: " + file.fsPath); //TBD: localize
            } else {
                addedFiles.push(file);
            }
        }
        
        if (!addedFiles.length)
            return;

        return Promise.resolve(addedFiles);
    }
    catch (e) {
        console.log(e);
        return Promise.reject(e);
    }
}

async function SelectLspFiles() {
    const options: vscode.OpenDialogOptions = {
        //TBD: globalize
        canSelectMany: true,
        openLabel: 'Add to Project',
        filters: {
            'Autolisp source files': ['lsp']
        }
    };

    let fileUris = await vscode.window.showOpenDialog(options);
    if (fileUris && fileUris.length > 0)
        return Promise.resolve(fileUris);
}