// @flow
/** @jsx h */
import cn from 'classnames';
import {h} from 'preact';
import type {Props} from './types';
import styles from './Title.less';

/**
 * Выводит название техники и процент попадания на ней.
 */
export const Title = (props: Props) => {
	const {hitsPercentage, name} = props;
	const percentageCN = cn([styles.hitsPercentage, 't-right']);

	return (
		<div className={styles.title}>
			<span className={styles.name}>{name}</span>
			<span className={percentageCN}>{hitsPercentage}&thinsp;%</span>
		</div>
	);
};

export default Title;
