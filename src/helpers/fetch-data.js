// @flow
import type {
	AchievementDescriptions,
	APIResponse,
	APIResponseSuccess,
	CommonMap,
	Option,
	RequestOptions,
	VehicleAchievements,
	VehicleInfo,
	VehicleStats
} from 'types';
import {api, appId, defaultRequestOptions, paths, requiredParams, searchResultsLimit, server} from 'constants/app';
import {countPermanentAccounts} from 'helpers/common';
import {
	filterAchievementDescriptionsData,
	filterVehicleAchievements,
	filterSearchResults,
	limitSearchResults
} from 'helpers/filters';
import {
	toAchievementDescriptions,
	toArray,
	toSearchOptions,
	toVehicleAchievements,
	toVehicleInfo,
	toVehiclesStats
} from 'helpers/mappers';

/**
 * Проверяет, правильно ли сформирован объект настроек (все ли необходимые ключи в нем есть) перед его использованием
 * в запросе.
 * @param {string} partialUrl - адрес запроса без сервера и версии `API`.
 * @param {CommonMap} options - объект настроек.
 * @returns {boolean} - возвращает `true`, если для указанного запроса есть все необходимые ключи в объекте настроек;
 * `false` - если нет.
 */
const checkOptions = (partialUrl: string, options: CommonMap): boolean => {
	// Список обязательных параметров для указанного пути.
	const params = requiredParams[partialUrl] || [];

	// Список ключей в объекте настроек.
	const optionNames = Object.keys(options);

	// Все обязательные параметры должны присутствовать в списке ключей объекта настроек.
	return params.every(param => optionNames.includes(param));
};

/**
 * Проверяет ответ сервера на наличие ошибки. Все ответы с сервера приходят с кодом `200 OK`, даже, если в процессе
 * получения данных на сервере возникла ошибка. Поэтому необходимо проверять статус ответа.
 * Пример успешного результата:
 * {
 *   "status": "ok",
 *   "meta": {
 *     "count": 127
 *   },
 *   "data": {...}
 * }
 * Пример ошибочного результата:
 * {
 *   "status": "error",
 *   "error": {
 *     "field": "language",
 *     "message": "INVALID_LANGUAGE",
 *     "code": 407,
 *     "value": "any"
 *   }
 * }
 * @param {APIResponse} response - ответ сервера.
 * @returns {APIResponseSuccess} - возвращает ответ сервера или выбрасывает ошибку.
 */
const checkResponseStatus = (response: APIResponse): APIResponseSuccess => {
	if (response.status && response.status === 'ok') {
		return response;
	}

	throw new Error(JSON.stringify(response));
};

/**
 * Получает описания достижений.
 * @returns {Promise<AchievementDescriptions>} - возвращает обещание описаний достижений.
 */
const fetchAchievementDescriptions = (): Promise<AchievementDescriptions> => {
	return fetchData(paths.encyclopediaAchievements)			// выполняем запрос,
		.then(checkResponseStatus)													// проверяем статус ответа,
		.then(response => response.data)										// получаем основные данные,
		.then(filterAchievementDescriptionsData)						// удаляем описания тех достижений, которые
																												// не будут выводиться в сводную таблицу,
		.then(toAchievementDescriptions);										// преобразуем в нужный формат.
};

/**
 * Получает данные о достижениях на технике.
 * @param {string} id - номер учетной записи.
 * @returns {Promise<Array<VehicleAchievements>>} - возвращает обещание данных о достижениях.
 */
const fetchAchievements = (id: string): Promise<Array<VehicleAchievements>> => {
	return fetchData(paths.tanksAchievements, {id})				// выполняем запрос,
		.then(checkResponseStatus)													// проверяем статус ответа,
		.then(response => response.data[id])								// получаем основные данные,
		.then(toArray)																			// преобразуем результат к массиву, если он таковым
																												// не является (например, сервер вернул `null`),
		.then(filterVehicleAchievements)										// удаляем информацию о тех достижениях, которые
																												// не будут выводиться в сводную таблицу,
		.then(toVehicleAchievements);												// преобразуем в нужный формат.
};

/**
 * Делает запрос к `API` и возвращает результат в виде `JSON`.
 * @param {string} partialUrl - адрес запроса без сервера и версии `API`.
 * @param {CommonMap} options - объект, где ключи - названия `GET`-параметров, а значения - значения `GET`-парметров.
 * @returns {Promise<any>} - возвращает обещание результата в виде `JSON` или выбрасывает исключение, если
 * указаны не все обязательные параметры запроса.
 */
const fetchData = (partialUrl: string, options: CommonMap = {}): Promise<any> => {
	if (checkOptions(partialUrl, options)) {
		// делаем запрос только если объект с `GET`-параметрами содержит все необходимые `GET`-параметры.

		const normalizedOptions = normalizeOptions(options);// нормализуем объект настроек

		return fetch(getUrl(partialUrl, normalizedOptions))	// выполняем запрос,
			.then(response => response.json());								// получаем `JSON` из ответа.
	} else {
		// если объект с `GET`-параметрами содержит не все необходимые `GET`-параметры, выбрасываем исключение.

		// список необходимых `GET`-параметров.
		const params = requiredParams[partialUrl] || [];

		// выброс исключения с указанием списка необходимых параметров.
		throw new Error(`В настройках запроса указаны не все обязательные параметры: ${params.join(', ')}`);
	}
};

/**
 * Получает общую информацию о технике.
 * @returns {Promise<VehicleInfo>} - возвращает обещание объекта с общей информацией о технике.
 */
const fetchVehicleInfo = (): Promise<VehicleInfo> => {
	return fetchData(paths.encyclopediaVehicles)					// выполняем запрос,
		.then(checkResponseStatus)													// проверяем статус ответа,
		.then(response => response.data)										// получаем основные данные,
		.then(toVehicleInfo);																// преобразуем в нужный формат.
};

/**
 * Получает статистику по всей технике в учетной записи, включая элитную технику и технику, которой нет в ангаре.
 * @param {string} id - идентификатор учетной записи.
 * @returns {Promise<Array<VehicleStats>>} - возвращает обещание массива объектов с информацией о каждой единице
 * техники.
 */
const fetchVehicleStatsByAccountId = (id: string): Promise<Array<VehicleStats>> => {
	return fetchData(paths.tanksStats, {id})							// выполняем запрос,
		.then(checkResponseStatus)													// проверяем статус ответа,
		.then(response => response.data[id])								// получаем основные данные,
		.then(toArray)																			// преобразуем результат к массиву, если он таковым
																												// не является (например, сервер вернул `null`),
		.then(toVehiclesStats);															// преобразуем в нужный формат.
};

/**
 * Формирует адрес запроса к `API`.
 * @param {string} partialUrl - адрес запроса без сервера и версии `API`.
 * @param {RequestOptions} options - `GET`-параметры запроса.
 * @returns {string} - возвращает адрес запроса к `API`.
 */
const getUrl = (partialUrl: string, options: RequestOptions = defaultRequestOptions): string => {
	// Настройки запроса.
	const {id, search} = options;

	// Список полей ответа
	const fields = [];

	// `GET`-параметры: идентификаторы приложения, учетной записи и список полей ответа
	const params = [`application_id=${appId}`];

	// По блоку методов и методу определяем список полей ответа и `GET`-параметры запроса
	switch (partialUrl) {
		case paths.accountList:
			params.push(`limit=${searchResultsLimit + countPermanentAccounts()}`);
			params.push(`search=${search}`);
			break;
		case paths.encyclopediaAchievements:
			fields.push('achievement_id', 'image', 'name');
			break;
		case paths.encyclopediaVehicles:
			fields.push('images.preview', 'name', 'tank_id');
			break;
		case paths.tanksAchievements:
			fields.push('achievements', 'tank_id');
			params.push(`account_id=${id}`);
			break;
		case paths.tanksStats:
			fields.push('all.hits', 'all.shots', 'tank_id');
			params.push(`account_id=${id}`);
			break;
	}

	if (fields.length) {
		params.push(`fields=${fields.join(',')}`);
	}

	// Итоговый адрес запроса
	return `${server}/${api}/${partialUrl}/?${params.join('&')}`;
};

/**
 * Приводит объект настроек к виду, в котором его можно использовать в `getUrl` добавляя в него все возможные свойства.
 * Частично это нужно для более простого прохождения проверки `flow`.
 * @param {CommonMap} options - неполный объект настроек.
 * @returns {RequestOptions} - возвращает полный объект настроек для использования в `getUrl`.
 *
 * `FlowFixMe` использован, т.к., похоже, в используемой версии `Flow` есть ошибка
 * (https://github.com/facebook/flow/issues/8236). Обновить версию `Flow` пока не представляется возможным, т.к.
 * не ясно, как типизировать `preact`-приложение с включенной настройкой `types_first` `Flow`.
 */
// $FlowFixMe
const normalizeOptions = (options: CommonMap): RequestOptions => ({
	...defaultRequestOptions,
	...options
});

/**
 * Ищет учетные записи по названию.
 * @param {string} search - поисковая фраза.
 * @returns {Promise<Array<Option>>} - возвращает обещание результатов поиска.
 */
const search = (search: string): Promise<Array<Option>> => {
	return fetchData(paths.accountList, {search})					// выполняем запрос,
		.then(checkResponseStatus)													// проверяем статус ответа,
		.then(response => response.data)										// получаем основные данные,
		.then(filterSearchResults)													// исключаем уже существующие учетные записи,
		.then(limitSearchResults)														// ограничиваем количество результатов,
		.then(toSearchOptions);															// преобразуем в нужный формат.
};

export {
	checkOptions,
	checkResponseStatus,
	fetchAchievementDescriptions,
	fetchAchievements,
	fetchData,
	fetchVehicleInfo,
	fetchVehicleStatsByAccountId,
	getUrl,
	normalizeOptions,
	search
};
