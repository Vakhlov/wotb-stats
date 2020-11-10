// @flow
import {achievementFields} from 'constants/app';

/**
 * Отсеивает описания достижений в соответствии с набором нужных достижений.
 * @param {Object} data - данные с сервера. Формат:
 * {
 *   "achievement_id": {
 *     "name": string,
 *     "image_big": ?string,
 *     "section": string,
 *     "options": ?[
 *       {
 *         "image_big": string,
 *         "image": string,
 *         "name": string,
 *         "description": string
 *       }
 *     ],
 *     "achievement_id": string,
 *     "order": number,
 *     "image": ?string,
 *     "condition": string,
 *     "description": string
 *   }
 * }
 * @returns {Object} - возвращает нобый объект, в котором есть только нужные достижения.
 */
const filterAchievementDescriptionsData = (data: Object): Object => {
	const result = {};

	Object.keys(data).forEach(key => {
		if (achievementFields.includes(key)) {
			result[key] = data[key];
		}
	});

	return result;
};

/**
 * Отсеивает достижения в соответствии с набором нужных достижений.
 * @param {Array<Object>} data - данные с сервера. Формат:
 * [
 *   {
 *     "achievements": {"name": number, ...},
 *     "tank_id": number
 *   }
 * ]
 * @returns {Array<Object>} - возвращает новый массив объектов, в поле `achievements` которых оставлены только нужные
 * достижения.
 */
const filterVehicleAchievements = (data: Array<Object>): Array<Object> => {
	const result = [];

	data.forEach(item => {
		const achievements = {};

		Object.keys(item.achievements).forEach(key => {
			if (achievementFields.includes(key)) {
				achievements[key] = item.achievements[key];
			}
		});

		result.push({
			...item,
			achievements
		});
	});

	return result;
};

export {
	filterAchievementDescriptionsData,
	filterVehicleAchievements
};
