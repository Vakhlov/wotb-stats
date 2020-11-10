// @flow
import {
	achievementDescriptionsResponse,
	vehicleAchievementsResponse,
	vehicleInfoResponse,
	vehicleStatsResponse
} from 'mocks/data';
import {
	toAchievementDescriptions,
	toArray,
	toSearchOptions,
	toVehicleAchievements,
	toVehicleInfo,
	toVehiclesStats
} from 'helpers/mappers';

describe('Mappers', () => {
	/**
	 * Проверяет, что функция `toAchievementDescriptions` преобразует информацию о достижениях, полученную с сервера,
	 * к формату, используемому в приложении.
	 */
	it(
		'maps "achievement_id" to "id" property and removes achievement id from achievement name in achievement description',
		() => {
			const desiredObject = {
				id: 'markOfMastery',
				image: 'http://glossary-ru-static.gcdn.co/icons/wotb/current/achievements/markOfMastery.png',
				name: 'Знак классности \n«Мастер»'
			};

			const mappedData = toAchievementDescriptions(achievementDescriptionsResponse.data);

			// проверяем наличие свойств
			expect(mappedData.markOfMastery).toMatchObject(desiredObject);

			// дополнительно проверяем свойство `name`, т.к. оно изменяется в `mapper`-е
			expect(mappedData.markOfMastery.name).toEqual(desiredObject.name);
		}
	);

	/**
	 * Проверяет, что функция `toArray` возвращает пустой массив, если значения аргумента не является массивом.
	 */
	it('transforms argument value to an array if it is not an array', () => {
		const mappedObject = toArray(null);
		expect(mappedObject).toBeInstanceOf(Array);
	});

	/**
	 * Проверяет, что функция `toArray` возвращает значение аргумента, если оно является массивом.
	 */
	it('returns an argument value if it is already an array', () => {
		const data = ['value'];

		const mappedData = toArray(data);

		expect(mappedData).toBe(data);
	});

	/**
	 * Проверяет, что функция `toSearchOptions` преобразует результаты поиска к формату, используемому в приложении.
	 */
	it(
		'maps "account_id" to "value" and "nickname" to "title" properties in search results and changes value type of "value" property from number to string',
		() => {
			const data = [{
				account_id: 1,
				nickname: 'a'
			}];

			const desiredData = [{
				title: 'a',
				value: '1'
			}];

			const mappedData = toSearchOptions(data);

			expect(mappedData[0]).toMatchObject(desiredData[0]);
		}
	);

	/**
	 * Проверяет, что функция `toVehicleAchievements` преобразует информацию о достижениях на технике, полученную с
	 * сервера, к формату, используемому в приложении.
	 */
	it('maps "tank_id" to "vehicleId" property in vehicle achievements', () => {
		const desiredObject = {
			achievements: {...vehicleAchievementsResponse.data[1][0].achievements},
			vehicleId: vehicleAchievementsResponse.data[1][0].tank_id
		};

		const mappedObject = toVehicleAchievements(vehicleAchievementsResponse.data[1])[0];

		expect(mappedObject).toMatchObject(desiredObject);
	});

	/**
	 * Проверяет, что функция `toVehicleInfo` преобразует информацию о технике, полученную с сервера, к формату,
	 * используемому в приложении.
	 */
	it('maps "tank_id" to "id" and "images.preview" to "preview" properties in vehicle info', () => {
		const desiredObject = {
			// $FlowFixMe
			1: {
				id: 1,
				name: 'Т-34',
				preview: 'http://glossary-ru-static.gcdn.co/icons/wotb/current/uploaded/vehicles/hd_thumbnail/T-34.png'
			}
		};

		const mappedObject = toVehicleInfo(vehicleInfoResponse.data);

		expect(mappedObject).toMatchObject(desiredObject);
	});

	/**
	 * Проверяет, что функция `toVehiclesStats` преобразует информацию о статистике по технике, полученную с сервера,
	 * к формату, используемому в приложении.
	 */
	it('maps "tank_id" to "vehicleId" property and calculates hits percentage in vehicle stats', () => {
		const mappedObject = toVehiclesStats(vehicleStatsResponse.data[1])[0];

		const desiredObject = {
			hitsPercentage: 86.40939597315436,
			hitsPercentageString: '86.41',
			id: 1
		};

		expect(mappedObject).toMatchObject(desiredObject);
	});
});
