// @flow
/** @jsx h */
import Achievements from 'components/Achievements';
import {h} from 'preact';
import Preview from 'components/Preview';
import type {Props} from './types';
import styles from './Record.less';
import Title from 'components/Title';

/**
 * Выводит отдельную запись о техние: миниаютру, название, процент попадания и достижения.
 */
export const Record = (props: Props) => {
	const {achievementDescriptions, achievements, hitsPercentage, name, preview} = props;

	return (
		<div className={styles.record}>
			<Preview src={preview} title={name} />
			<Title name={name} hitsPercentage={hitsPercentage} />
			<Achievements achievements={achievements} descriptions={achievementDescriptions} />
		</div>
	);
};

export default Record;
