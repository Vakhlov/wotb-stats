// @flow
import {PERCENTAGE_COLOR} from './constants';

export type PercentageColor = $Keys<typeof PERCENTAGE_COLOR>;

export type Props = {
	hitsPercentage: number,
	name: string,
	percentageColor: PercentageColor
};
