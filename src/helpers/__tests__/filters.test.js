// @flow
import {achievementDescriptionsResponse, vehicleAchievementsResponse} from 'mocks/data';
import {filterAchievementDescriptionsData, filterVehicleAchievements} from 'helpers/filters';

describe('Filter functions', () => {
	/**
	 * Проверяет, `filterAchievementDescriptionsData` удаляет лишние описания достижений из ответа сервера.
	 */
	it('removes unnecessary properties from achievement descriptions', () => {
		const desiredObject = {
			mainGun: {},
			markOfMastery: {},
			markOfMasteryI: {},
			markOfMasteryII: {},
			markOfMasteryIII: {},
			sniper: {},
			titleSniper: {},
			warrior: {}
		};

		const filteredData = filterAchievementDescriptionsData(achievementDescriptionsResponse.data);

		expect(filteredData).toMatchObject(desiredObject);
	});

	/**
	 * Проверяет, что функция `filterVehicleAchievements` удаляет информацию о лишних достижениях на технике из
	 * ответа сервера.
	 */
	it('removes unnecessary achievements from vehicle info', () => {
		const desiredObject1 = {
			achievements: {
				markOfMastery: 4,
				titleSniper: 1,
				warrior: 2
			},
			tank_id: 1
		};

		const desiredObject2 = {
			achievements: {
				markOfMastery: 2,
				titleSniper: 1
			},
			tank_id: 2561
		};

		const fitleredData = filterVehicleAchievements(vehicleAchievementsResponse.data[1]);

		expect(fitleredData).toMatchObject([desiredObject1, desiredObject2]);
	});
});
