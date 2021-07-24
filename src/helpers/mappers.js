// @flow
import type {AchievementDescriptions, Option, VehicleAchievements, VehicleInfo, VehicleStats} from 'types';

/**
 * Преобразует описания достижений, полученные с сервера, к типу `AchievementDescriptions`, который используется
 * в приложении. При преобразовании вырезает идентификатор достижения из его названия.
 * @param {Object} data - описания достижений, полученные с сервера.
 * @returns {AchievementDescriptions} - возвращает данные типа `AchievementDescriptions`.
 */
const toAchievementDescriptions = (data: Object): AchievementDescriptions => {
	const result = {};

	Object.keys(data).forEach(key => {
		result[key] = {
			id: data[key].achievement_id,
			image: data[key].image,
			name: data[key].name.replace(` (${data[key].achievement_id})`, '')
		};
	});

	return result;
};

/**
 * Возвращает пустой массив, если значение аргумента не является массивом. Нужна для обработки ситуации, когда
 * в ответе сервера вместо ожидаемого массива был получен `null`.
 * @param {?Array<Object>} data - данные, полученные с сервера.
 * @returns {Array<Object>} - возвращает пустой массив, если значение аргумента не является массивом или
 * исходное значение аргумента.
 */
const toArray = (data: ?Array<Object>): Array<Object> => Array.isArray(data) ? data : [];

/**
 * Преобразует результаты поиска, полученные с сервера, к объектам типа `Option`, который используется в приложении.
 * @param {string} titleProp - название свойства, значение которого используется как видимый текст в `Option`.
 * @param {string} valueProp - название свойства, значение которого используется как значение в `Option`.
 * @returns {Function} - возвращает функцию преобразования к массиву объектов типа `Option`.
 */
const toOptions = (
	titleProp: string,
	valueProp: string
) => (data: Array<Object>): Array<Option> => data.map(item => ({
	title: item[titleProp].toString(),
	value: item[valueProp].toString()
}));

/**
 * Преобразует данные о достижениях на технике, полученные с сервера, к типу `VehicleAchievements`, который используется
 * в приложении.
 * @param {Array<Object>} data - данные о достижениях, полученные с сервера.
 * @returns {Array<VehicleAchievements>} - возвращает данные типа `VehicleAchievements`.
 */
const toVehicleAchievements = (data: Array<Object>): Array<VehicleAchievements> => data.map(item => ({
	achievements: item.achievements,
	vehicleId: item.tank_id
}));

/**
 * Преобразует объект с информацией о технике, полученный с сервера, к типу `VehicleInfo`, который используется
 * в приложении.
 * @param {Object} data - объект с информацией о технике, полученный с сервера.
 * @returns {VehicleInfo} - возвращает объект типа `VehicleInfo`.
 */
const toVehicleInfo = (data: Object): VehicleInfo => {
	const result = {};

	Object.keys(data).forEach(key => {
		result[key] = {
			id: data[key].tank_id,
			name: data[key].name,
			preview: data[key].images.preview
		};
	});

	return result;
};

/**
 * Преобразует массив объектов со статистикой по технике, полученных с сервера, к массиву объектов типа `VehicleStats`,
 * который используется в приложении. Расчитывает процент попадания.
 * @param {Array<Object>} data - массив объектов со статистикой по технике, полученный с сервера.
 * @returns {Array<VehicleStats>} - возвращает массив объектов типа `VehicleStats`.
 */
const toVehiclesStats = (data: Array<Object>): Array<VehicleStats> => data.map((item: Object) => {
	const hitsPercentage = 100 * (item.all.hits / item.all.shots);
	return {
		hitsPercentage,
		hitsPercentageString: hitsPercentage.toFixed(2),
		id: item.tank_id
	};
});

export {
	toAchievementDescriptions,
	toArray,
	toOptions,
	toVehicleAchievements,
	toVehicleInfo,
	toVehiclesStats
};
