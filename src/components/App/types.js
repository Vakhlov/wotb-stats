// @flow
import type {Account, AchievementDescriptions, Option, VehicleAchievements, VehicleInfo, VehicleStats} from 'types';

export type Props = {};

export type State = {
	accounts: Array<Account>,
	achievements: Array<VehicleAchievements>,
	achievementDescriptions: AchievementDescriptions,
	currentAccount: string | null,
	loading: boolean,
	searchResults: Array<Option>,
	sortField: string,
	vehicleInfo: VehicleInfo,
	vehicleStats: Array<VehicleStats>
};
