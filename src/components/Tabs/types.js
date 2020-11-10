// @flow
export type TabProps = {
	active: boolean,
	caption: string,
	closable: boolean,
	hideSeparator: boolean,
	onClick?: () => void,
	onClose?: () => void
};

export type Props = {
	editable: boolean,
	onAdd?: () => void,
	onClose?: (index: number) => void,
	onSwitch?: (index: number) => void,
	selected: number
};

export type State = {
	activeTabIndex: number
};
