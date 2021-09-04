// @flow
import {achievementDescriptionsResponse, vehicleAchievementsResponse} from 'mocks/data';
import {
	filterAchievementDescriptionsData,
	filterSearchResults,
	filterVehicleAchievements,
	limitSearchResults
} from 'helpers/filters';
import {LocalStorageMock} from 'mocks/local-storage';
import {searchResultsLimit} from 'constants/app';

describe('Filter functions', () => {
	describe('filterAchievementDescriptionsData', () => {
		/**
		 * Проверяет, `filterAchievementDescriptionsData` удаляет лишние описания достижений из ответа сервера.
		 */
		it('removes unnecessary properties from achievement descriptions', () => {
			const expectedResult = {
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

			expect(filteredData).toMatchObject(expectedResult);
		});
	});

	describe('filterSearchResults', () => {
		/**
		 * Проверят, что функция `filterSearchResults` удаляет уже используемые в приложении данные из результатов поиска.
		 */
		it('removes data already in usage from search results', () => {
			global.localStorage = new LocalStorageMock();

			const alreadyInUse = {account_id: 1, nickname: 'nickname1'};
			const accounts = [{id: '1', name: 'nickname1'}];

			localStorage.setItem('accounts', JSON.stringify(accounts));

			const arr = [
				alreadyInUse,
				{account_id: 2, nickname: 'nickname2'},
				{account_id: 3, nickname: 'nickname3'}
			];

			const result = filterSearchResults(arr);

			expect(result.findIndex(item => item === alreadyInUse)).toBe(-1);
		});
	});

	describe('filterVehicleAchievements', () => {
		/**
		 * Проверяет, что функция `filterVehicleAchievements` удаляет информацию о лишних достижениях на технике из
		 * ответа сервера.
		 */
		it('removes unnecessary achievements from vehicle info', () => {
			const expectedObject1 = {
				achievements: {
					markOfMastery: 4,
					titleSniper: 1,
					warrior: 2
				},
				tank_id: 1
			};

			const expectedObject2 = {
				achievements: {
					markOfMastery: 2,
					titleSniper: 1
				},
				tank_id: 2561
			};

			const fitleredData = filterVehicleAchievements(vehicleAchievementsResponse.data[1]);

			expect(fitleredData).toMatchObject([expectedObject1, expectedObject2]);
		});
	});

	describe('limitSearchResults', () => {
		/**
		 * Проверяет, что функция `limitSearchResults` правильно ограничивает количество результатов поиска.
		 */
		it('limits search result count correctly', () => {
			const arr1 = [];
			const arr2 = [];

			for (let i = 0; i < searchResultsLimit; i++) {
				if (i < 3) {
					arr1.push({account_id: i, nickname: `nickname${i}`});
				}

				arr2.push({account_id: i, nickname: `nickname${i}`});
			}

			expect(limitSearchResults(arr1).length).toBe(arr1.length);
			expect(limitSearchResults(arr2).length).toBe(searchResultsLimit);
		});
	});

	/**
	 * Очистка.
	 */
	afterEach(() => localStorage.removeItem('accounts'));
});
