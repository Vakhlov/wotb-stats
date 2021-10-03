// @flow
/** @jsx h */
import cn from 'classnames';
import {h} from 'preact';
import {PERCENTAGE_COLOR} from './constants';
import type {Props} from './types';
import styles from './Title.less';

/**
 * Выводит название техники и процент попадания на ней.
 */
export const Title = ({hitsPercentage, name, percentageColor = PERCENTAGE_COLOR.NONE}: Props) => {
	// const {hitsPercentage, name, percentageColor} = props;
	const percentageCN = cn({
		[styles.hitsPercentage]: true,
		[styles.hitsPercentageGreen]: percentageColor === PERCENTAGE_COLOR.GREEN,
		[styles.hitsPercentageRed]: percentageColor === PERCENTAGE_COLOR.RED,
		't-right': true
	});

	return (
		<div className={styles.title}>
			<span className={styles.name}>{name}</span>
			<span className={percentageCN}>{hitsPercentage}&thinsp;%</span>
		</div>
	);
};

export default Title;
