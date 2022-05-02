import Calendar from "components/calendar";
import { App, Modal } from "obsidian";
import * as React from "react";
import { createRoot, Root } from "react-dom/client";

export class DatePickerView extends Modal {
	root: Root;
	onClick: (date: string) => void;
	constructor(app: App, onClick: (date: string) => void) {
		super(app);
		const container = this.containerEl.children[1];
		this.root = createRoot(container!);
		this.onClick = (date: string) => {
			onClick(date);
			this.close();
		};
	}

	async onOpen() {
		this.root.render(<Calendar onClick={this.onClick} />);
	}

	async onClose() {
		this.root.unmount();
	}
}
