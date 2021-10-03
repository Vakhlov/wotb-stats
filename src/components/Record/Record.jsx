// @flow
/** @jsx h */
import Achievements from 'components/Achievements';
import {h} from 'preact';
import {PERCENTAGE_COLOR} from 'components/Title/constants';
import Preview from 'components/Preview';
import type {Props} from './types';
import styles from './Record.less';
import Title from 'components/Title';

/**
 * Выводит отдельную запись о техние: миниаютру, название, процент попадания и достижения.
 */
export const Record = (props: Props) => {
	const {
		accountPercentage,
		achievementDescriptions,
		achievements,
		hitsPercentage,
		hitsPercentageString,
		name,
		preview
	} = props;

	const percentageColor = accountPercentage <= hitsPercentage ? PERCENTAGE_COLOR.GREEN : PERCENTAGE_COLOR.RED;

	return (
		<div className={styles.record}>
			<Preview src={preview} title={name} />
			<Title name={name} hitsPercentage={hitsPercentageString} percentageColor={percentageColor} />
			<Achievements achievements={achievements} descriptions={achievementDescriptions} />
		</div>
	);
};

export default Record;
