// @flow
import type {AchievementDescriptions} from 'types';

export type Props = {
	accountPercentage: number,
	achievementDescriptions: AchievementDescriptions,
	achievements: Array<string>,
	hitsPercentage: number,
	hitsPercentageString: string,
	name: string,
	preview: string
};
