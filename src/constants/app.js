// @flow
import type {CommonMap, RequestOptions, RequiredParams} from 'types';

/**
 * Список достижений, которые отображаются в сводной таблице.
 * @type {Array<string>}
 */
const achievementFields = [
	'markOfMastery',
	'markOfMasteryI',
	'markOfMasteryII',
	'markOfMasteryIII',
	'warrior',
	'sniper',
	'titleSniper',
	'mainGun'
];

/**
 * Версия `API`.
 * @types {string}
 */
const api = 'wotb';

/**
 * Идентификатор приложения.
 * @type {string}
 */
const appId: string = 'b9752a33cbf67c03dc224117eec13fc3';

/**
 * `GET`-параметры запроса по умолчанию.
 * @type {RequestOptions}
 */
const defaultRequestOptions: RequestOptions = {
	id: '',
	search: ''
};

/**
 * Пути, по которым делаются запросы.
 * @type {CommonMap}
 */
const paths: CommonMap = {
	'accountInfo': 'account/info',
	'accountList': 'account/list',
	'encyclopediaAchievements': 'encyclopedia/achievements',
	'encyclopediaVehicles': 'encyclopedia/vehicles',
	'tanksAchievements': 'tanks/achievements',
	'tanksStats': 'tanks/stats'
};

/**
 * Удаленная техника.
 * @type {CommonMap}
 */
const removedVehicles: CommonMap = {
	'545': 'T1',
	'577': 'Renault FT',
	'1329': 'NC-31',
	'3329': 'MC-1'
};

/**
 * Обязательные параметры для определенных путей запросов.
 * @type {RequiredParams}
 */
const requiredParams: RequiredParams = {
	[paths.accountList]: ['search'],
	[paths.tanksAchievements]: ['id'],
	[paths.tanksStats]: ['id']
};

/**
 * Ограничение количества результатов поиска.
 */
const searchResultsLimit = 10;

/**
 * Сервер `API`.
 * @type {string}
 */
const server = 'https://api.wotblitz.ru';

/**
 * Шаблонная часть временного идентификатора учетной записи для новых вкладок в пользовательском интерфейсе.
 * @type {string}
 */
const tempIdPattern: string = 'NewAccount';

/**
 * Шаблонная часть временного названия учетной записи для новых вкладок в пользовательском интерфейсе. Выводится
 * в корешке вкладки.
 * @type {string}
 */
const tempNamePattern: string = 'Новая учетная запись';

export {
	achievementFields,
	api,
	appId,
	defaultRequestOptions,
	paths,
	removedVehicles,
	requiredParams,
	searchResultsLimit,
	server,
	tempIdPattern,
	tempNamePattern
};
