// @flow
/** @jsx h */
import cn from 'classnames';
import {h} from 'preact';
import type {TabProps as Props} from './types';
import styles from './Tabs.less';

/**
 * Выводит отдельный корешок вкладки. Он состоит из кнопки с названием вкладки и кнопки закрытия вкладки.
 */
export const Tab = (props: Props) => {
	const {active, caption, closable, hideSeparator, onClick, onClose} = props;

	// собираем необходимые `css`-классы в зависимости от значений переданных свойств
	const tabCN = cn({
		[styles.tab]: true,
		[styles.tabActive]: active,
		[styles.tabWithoutSeparator]: hideSeparator
	});

	// определяем свойства кнопки с названием в зависимости от значений переданных свойств
	const buttonProps = {
		...(onClick && {onClick})
	};

	// кнопка с названием
	const tabButton = <button {...buttonProps}>{caption}</button>;

	// кнопка закрытия
	const closeButton = closable && onClose ? <button className={styles.close} onClick={onClose} title="Закрыть" /> : null;

	return (
		<div className={tabCN}>
			{tabButton}
			{closeButton}
		</div>
	);
};

Tab.defaultProps = {
	active: false,
	closable: false,
	hideSeparator: false
};

export default Tab;
