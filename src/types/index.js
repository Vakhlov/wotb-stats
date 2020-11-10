// @flow
export type Account = {
	id: string,
	name: string
};

export type AchievementDescription = {
	id: number,
	image: string,
	name: string
};

export type AchievementDescriptions = {
	[key: string]: AchievementDescription
};

export type AchievementsObject = {
	[key: string]: number
};

export type APIResponseMeta = {
	count: number;
};

export type APIResponseErrorError = {
	code: number,
	field: string,
	message: string,
	value: string
};

export type APIResponseError = {
	error: APIResponseErrorError,
	status: 'error'
};

export type APIResponseSuccess = {
	data: Object,
	meta: APIResponseMeta,
	status: 'ok'
};

export type APIResponse = APIResponseError | APIResponseSuccess;

export type CommonMap = {
	[key: string]: string
};

export type Option = {
	title: string,
	value: string
};

export type RequestOptions = {
	id: string,
	search: string,
};

export type RequiredParams = {
	[key: string]: Array<string>
};

export type VehicleAchievements = {
	achievements: AchievementsObject,
	vehicleId: number
};

export type VehicleInfo = {
	[key: string]: {
		id: number,
		name: string,
		preview: string
	}
};

export type VehicleStats = {
	hitsPercentage: number,
	hitsPercentageString: string,
	id: number
};
