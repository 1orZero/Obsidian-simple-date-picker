import { DatePickerView } from "./view";
import {
	App,
	Editor,
	MarkdownView,
	Modal,
	Notice,
	Plugin,
	PluginSettingTab,
	Setting,
} from "obsidian";

// Remember to rename these classes and interfaces!

export default class MyPlugin extends Plugin {
	async onload() {
		// This adds an editor command that can perform some operation on the current editor instance
		this.addCommand({
			id: "open-date-picker",
			name: "Open date picker",
			checkCallback: (checking: boolean) => {
				// Conditions to check
				const markdownView =
					this.app.workspace.getActiveViewOfType(MarkdownView);
				if (markdownView) {
					// If checking is true, we're simply "checking" if the command can be run.
					// If checking is false, then we want to actually perform the operation.
					if (!checking) {
						console.log("passed");
					}

					// This command will only show up in Command Palette when the check function returns true
					console.log("failed");
					return true;
				}
			},
			editorCallback: (editor: Editor, view: MarkdownView) => {

				const insertDate = (date:string) => {
					editor.replaceSelection(`[[${date}]]`);
				};

				 new DatePickerView(this.app, insertDate ).open();
			},
		});
	}

	onunload() {}
}


