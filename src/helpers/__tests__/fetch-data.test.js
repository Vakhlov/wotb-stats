// @flow
import {
	accountInfoResponse,
	achievementDescriptionsResponse,
	searchResponse,
	vehicleAchievementsResponse,
	vehicleInfoResponse,
	vehicleStatsResponse
} from 'mocks/data';
import {appId, paths} from 'constants/app';
import {
	checkOptions,
	checkResponseStatus,
	fetchAccountInfo,
	fetchAchievementDescriptions,
	fetchAchievements,
	fetchData,
	fetchVehicleInfo,
	fetchVehicleStatsByAccountId,
	getUrl,
	normalizeOptions,
	search
} from 'helpers/fetch-data';
import fetchMock from 'fetch-mock';

describe('Fetch data helpers', () => {
	describe('checkOptions', () => {
		/**
		 * Проверяет, что функция `checkOptions` возвращает `true`, если для заданного адреса
		 * сформирован правильный объект параметров.
		 */
		it('checks options object and return `true` if options object is correct (according to request address)', () => {
			// эти настройки правильны для запросов, которые используют номер учетной записи
			const correctOptions1 = {id: '1'};

			// эти настройки правильны для запросов, которые не используют номер учетной записи
			const correctOptions2 = {};

			const expectedResult1 = checkOptions(paths.tanksStats, correctOptions1);
			const expectedResult2 = checkOptions(paths.vehicleInfo, correctOptions2);

			expect(expectedResult1).toBe(true);
			expect(expectedResult2).toBe(true);
		});
	});

	describe('checkResponseStatus', () => {
		/**
		 * Проверяет, что функция `checkResponseStatus` возвращает переданный в нее результат запроса,
		 * если статус запроса равен "ok".
		 */
		it('checks response status and returns response if status is equal to "ok"', () => {
			const response = {
				data: {},
				meta: {
					count: 0
				},
				status: 'ok'
			};

			expect(checkResponseStatus(response)).toEqual(response);
		});

		/**
		 * Проверяет, что функиця `checkResponseStatus` выбрасывает исключение, если переданный в нее
		 * результат запроса, имеет статус, отличный от "ok".
		 */
		it('checks response status and throws an exception if status is not equal to "ok"', () => {
			const response = {
				error: {
					code: 407,
					field: 'fields',
					message: 'INVALID_FIELDS',
					value: 'any'
				},
				status: 'error'
			};

			expect(() => checkResponseStatus(response)).toThrow();
		});
	});

	describe('fetchAccountInfo', () => {
		/**
		 * Проверяет, что функция `fetchAccountInfo` получает общую статистику учетной записи
		 * и преобразует ее к формату, используемому в приложении.
		 */
		it('fetches and shapes account info', () => {
			const id = '1';

			fetchMock.get(
				getUrl(paths.accountInfo, normalizeOptions({id})),
				Promise.resolve(accountInfoResponse)
			);

			const expectedResult = {
				battles: 1,
				damageDealt: 1,
				hits: 1,
				wins: 1,
				shots: 1
			};

			expect(fetchAccountInfo(id)).resolves.toEqual(expectedResult);
		});
	});

	describe('fetchAchievementDescriptions', () => {
		/**
		 * Проверяет, что функция `fetchAchievementDescriptions` получает описания достижений,
		 * отбрасывает ненужные данные и преобразует их к формату, используемому в приложении.
		 */
		it('fetches, filters and shapes achievement descriptions', () => {
			fetchMock.get(
				getUrl(paths.encyclopediaAchievements),
				Promise.resolve(achievementDescriptionsResponse)
			);

			const expectedResult = {
				sniper: {
						id: 'sniper',
						image: 'http://glossary-ru-static.gcdn.co/icons/wotb/current/achievements/sniper.png',
						name: '«Снайпер»'
				},
				titleSniper: {
						id: 'titleSniper',
						image: 'http://glossary-ru-static.gcdn.co/icons/wotb/current/achievements/titleSniper.png',
						name: '«Стрелок»'
				},
				markOfMastery: {
						id: 'markOfMastery',
						image: 'http://glossary-ru-static.gcdn.co/icons/wotb/current/achievements/markOfMastery.png',
						name: 'Знак классности \n«Мастер»'
				},
				markOfMasteryII: {
						id: 'markOfMasteryII',
						image: 'http://glossary-ru-static.gcdn.co/icons/wotb/current/achievements/markOfMasteryII.png',
						name: 'Знак классности \n«2 степень»'
				},
				mainGun: {
						id: 'mainGun',
						image: 'http://glossary-ru-static.gcdn.co/icons/wotb/current/achievements/mainGun.png',
						name: '«Основной калибр»'
				},
				warrior: {
						id: 'warrior',
						image: 'http://glossary-ru-static.gcdn.co/icons/wotb/current/achievements/warrior.png',
						name: '«Воин»'
				},
				markOfMasteryI: {
						id: 'markOfMasteryI',
						image: 'http://glossary-ru-static.gcdn.co/icons/wotb/current/achievements/markOfMasteryI.png',
						name: 'Знак классности \n«1 степень»'
				},
				markOfMasteryIII: {
						id: 'markOfMasteryIII',
						image: 'http://glossary-ru-static.gcdn.co/icons/wotb/current/achievements/markOfMasteryIII.png',
						name: 'Знак классности \n«3 степень»'
				}
			};

			expect(fetchAchievementDescriptions()).resolves.toEqual(expectedResult);
		});
	});

	describe('fetchAchievements', () => {
		/**
		 * Проверяет, что функция `fetchAchievements` получает информацию о достижениях на технике,
		 * отбрасывает ненужное и преобразует остальное к формату, используемому в приложении.
		 */
		it('fetches, filters and shapes achievements on vehicles', () => {
			const id = '1';

			fetchMock.get(
				getUrl(paths.tanksAchievements, normalizeOptions({id})),
				Promise.resolve(vehicleAchievementsResponse)
			);

			const expectedResult = [
				{
					achievements: {
						markOfMastery: 4,
						titleSniper: 1,
						warrior: 2
					},
					vehicleId: 1
				},
				{
					achievements: {
						markOfMastery: 2,
						titleSniper: 1
					},
					vehicleId: 2561
				}
			];

			expect(fetchAchievements(id)).resolves.toEqual(expectedResult);
		});
	});

	describe('fetchData', () => {
		/**
		 * Проверяет, что функция `fetchData` получает данные и возвращает их в формате `JSON`.
		 */
		it('fetches data', () => {
			const id = '1';

			fetchMock.get(
				getUrl(paths.tanksStats, normalizeOptions({id})),
				Promise.resolve(vehicleStatsResponse)
			);

			expect(fetchData(paths.tanksStats, {id})).resolves.toEqual(vehicleStatsResponse);
		});

		/**
		 * Проверяет, что функция `fetchData` выбрасывает исключение, если параметры запроса неправильные.
		 */
		it('throws an exception when request options object is incorrect', () => {
			// эти настройки неправильны для запросов, которые используют номер учетной записи
			const incorrectOptions = {};
			expect(() => fetchData(paths.tanksStats, incorrectOptions)).toThrow();
		});
	});

	describe('fetchVehicleInfo', () => {
		/**
		 * Проверяет, что функция `fetchVehicleInfo` получает описания техники, отбрасывает ненужные данные
		 * и преобразует их к формату, используемому в приложении.
		 */
		it('fetches, filters and shapes vehicles info', () => {
			fetchMock.get(
				getUrl(paths.encyclopediaVehicles),
				Promise.resolve(vehicleInfoResponse)
			);

			const expectedResult = {
				// $FlowFixMe
				1: {
					id: 1,
					name: 'Т-34',
					preview: 'http://glossary-ru-static.gcdn.co/icons/wotb/current/uploaded/vehicles/hd_thumbnail/T-34.png'
				}
			};

			expect(fetchVehicleInfo()).resolves.toEqual(expectedResult);
		});
	});

	describe('fetchVehicleStatsByAccountId', () => {
		/**
		 * Проверяет, что функция `fetchVehicleStatsByAccountId` получает статистику по технике в учетной записи,
		 * отбрасывает ненужные данные и преобразует нужные к формату, используемому в приложении.
		 */
		it('fetches, filters and shapes vehicles stats', () => {
			const id = '1';

			fetchMock.get(
				getUrl(paths.tanksStats, normalizeOptions({id})),
				Promise.resolve(vehicleStatsResponse)
			);

			const expectedResult = [
				{
					hitsPercentage: 86.40939597315436,
					hitsPercentageString: '86.41',
					id: 1
				}
			];

			expect(fetchVehicleStatsByAccountId(id)).resolves.toEqual(expectedResult);
		});
	});

	describe('getUrl', () => {
		/**
		 * Проверяет, что функция `getUrl` правильно составляет адрес запроса. Тажке проверяется правильность
		 * подстановки идентификатора учетной записи в адрес.
		 */
		it('forms actual request url', () => {
			const urlWithoutAccountId = `https://api.wotblitz.ru/wotb/${paths.encyclopediaVehicles}/?application_id=${appId}&fields=images.preview,name,tank_id`;
			expect(getUrl(paths.encyclopediaVehicles)).toEqual(urlWithoutAccountId);

			const urlWithAccountId = `https://api.wotblitz.ru/wotb/${paths.tanksStats}/?application_id=${appId}&account_id=1&fields=all.hits,all.shots,tank_id`;
			expect(getUrl(paths.tanksStats, normalizeOptions({id: '1'}))).toEqual(urlWithAccountId);
		});
	});

	describe('normalizeOptions', () => {
		/**
		 * Проверяет, что функция `normalizeOptions` добавляет все возможные параметры в объект параметров запроса.
		 */
		it('normalizes options object by adding all available parameter names as object keys', () => {
			const options = {};

			const expectedResult = {
				id: '',
				search: ''
			};

			expect(normalizeOptions(options)).toEqual(expectedResult);
		});

		/**
		 * Проверяет, что функция `normalizeOptions` перекрывает значения по умолчанию
		 * параметров зачениями из переданного объекта.
		 */
		it('overrides default values of parameters with values form passed object', () => {
			const options = {
				search: 'search string'
			};

			const expectedResult = {
				id: '',
				search: 'search string'
			};

			expect(normalizeOptions(options)).toEqual(expectedResult);
		});
	});

	describe('search', () => {
		/**
		 * Проверяет, что функция `search` ищет учетные записи по названию и
		 * преобразует результат к формату, используемому в приложении.
		 */
		it('searches account by nickname', () => {
			fetchMock.get(
				getUrl(paths.accountList, normalizeOptions({search: 'meaning'})),
				Promise.resolve(searchResponse)
			);

			const expectedResult = [
				{
					title: 'meaning',
					value: '42'
				}
			];

			expect(search('meaning')).resolves.toEqual(expectedResult);
		});
	});

	/**
	 * Очистка. Если этого не сделать, маршрут 'tanks/stats' продублируется и будет выведено предупреждение.
	 */
	afterEach(() => fetchMock.restore());
});
