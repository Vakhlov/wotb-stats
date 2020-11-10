// @flow
/** @jsx h */
import {cloneElement, Component, Fragment, h} from 'preact';
import type {Props, State} from './types';
import styles from './Tabs.less';
import Tab from './Tab';

/**
 * Выводит корешки и содержимое вкладок.
 */
export class Tabs extends Component<Props, State> {
	/**
	 * Значения свойств по умолчанию.
	 */
	static defaultProps = {
		editable: false,
		selected: 0
	};

	/**
	 * Конструктор класса. Создает начальное состояние из мереданных свойств.
	 */
	constructor (props: Props) {
		super(props);

		this.state = {
			activeTabIndex: props.selected
		};
	}

	/**
	 * Обработчик создания новой вкладки. Вызывается только если значение свойства `editable` равно `true`.
	 * Делает создаваемую вкладку активной. Вызывает внешний обработчик создания вкладки, если он был передан.
	 */
	handleTabAdd = () => {
		const {children, onAdd} = this.props;

		this.setState(
			{activeTabIndex: children.length},
			() => onAdd && onAdd()
		);
	};

	/**
	 * Обработчик щелчка по корешку. В качестве параметра получает индекс корешка, по которому щелкнули.
	 * Переключает активную вкладку и вызывает внешний обработчик переключения, если он был передан.
	 */
	handleTabClick = (index: number) => () => {
		const {onSwitch} = this.props;

		this.setState(
			{activeTabIndex: index},
			() => onSwitch && onSwitch(index)
		);
	};

	/**
	 * Обработчик закрытия вкладки. Вызывается только если значение свойства `editable` равно `true`.
	 * Вычисляет новый индекс активной вкладки, чтобы отбработать случаи, когда закрываются вклаки до актвиной,
	 * активная или единственна. Вызывает внешний обработчик закрытия вкладки, если он был передан.
	 */
	handleTabClose = (index: number) => () => {
		const {onClose} = this.props;
		const {activeTabIndex} = this.state;

		// вычисление нового индекса активной вкладки
		let newActiveTabIndex = activeTabIndex;

		// при закрытии текущей или предшествующей вкладки необходимо уменьшить индекс выбранной вкладки
		const closingCurrentTab = index === activeTabIndex;
		const closingPreviousTab = index < activeTabIndex;

		if (closingCurrentTab || closingPreviousTab) {
			newActiveTabIndex = activeTabIndex - 1;
		}

		// если закрыли первую вкладку, индекс мог выйти за пределы допустимых значений
		newActiveTabIndex = newActiveTabIndex < 0 ? 0 : newActiveTabIndex;

		// установка вычисленного индекса и вызов внешнего обработчика закрытия вкладки
		this.setState(
			{activeTabIndex: newActiveTabIndex},
			() => onClose && onClose(index, newActiveTabIndex)
		);
	};

	/**
	 * Выводит содержимое выбранной вкладки.
	 */
	renderContent () {
		const {children} = this.props;
		const {activeTabIndex} = this.state;

		if (children.length && children[activeTabIndex]) {
			const content = children[activeTabIndex].props.children;
			return <div className={styles.tabContent}>{content}</div>;
		}

		return null;
	}

	/**
	 * Выводит корешок вкладки. При этом в компонент `Tab` добавляются свойства:
	 * - active - признак выбранности (чтобы выделить корешок выбранной вкладки, назначив `css`-класс),
	 * - closable - признак возможности закрыть вкладку,
	 * - hideSeparator - признак необходимости спрятать разделитель между корешками,
	 * - onClick - обработчик щелчка по корешку,
	 * - onClose - обработчик щелчка по кнопке закрытия вкладки в корешке.
	 */
	renderTab = (closable: boolean) => (tab: typeof Tab, index: number) => {
		const {activeTabIndex} = this.state;

		// Добавляем признак того, что вкладка выбрана, обработчик щелчка по корешку и обработчик закрытия
		// вкладки. Также добавляем признак того, что нужно спрятать разделитель между корешками для корешка,
		// предшествующего корешку выбранной вкладки.
		return cloneElement(tab, {
			active: activeTabIndex === index,
			closable,
			hideSeparator: activeTabIndex - 1 === index,
			onClick: this.handleTabClick(index),
			onClose: this.handleTabClose(index)
		});
	};

	/**
	 * Выводит корешки вкладок с содержимым и служебный корешок, щелчок по которому приводит к созданию новой вкладки.
	 * Такой корешок выводится только если значение свойства `editable` равно `true`.
	 */
	renderTabs () {
		const {children, editable} = this.props;

		// корешки вкладок с содержимым, которое определяет пользователь компонента
		const contentTabs = children.map(this.renderTab(editable));

		// корешок служебной вкладки
		const addTab = editable ? <Tab caption="+" onClick={this.handleTabAdd} /> : null;

		return (
			<div className={styles.tabs}>
				{contentTabs}
				{addTab}
			</div>
		);
	}

	/**
	 * Выводит корешки вкладок и содержимое выбранной вкладки.
	 */
	render () {
		return (
			<Fragment>
				{this.renderTabs()}
				{this.renderContent()}
			</Fragment>
		);
	}
}

export default Tabs;
