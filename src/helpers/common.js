// @flow
import {tempIdPattern} from 'constants/app';

/**
 * Определяет, является ли идентификатор учетной записи постоянным. При добавлении вкладки для учетной записи, она
 * сначала получает временный идентификатор. После выбора учетной записи, временный идентификатор заменяется постоянным.
 * @param {string} accountId - идентификатор учетной записи для проверки.
 * @returns {boolean} - возвращает `true`, если идентификатор учетной записи не содержит шаблона временного
 * идентификатор, и `false` - если содержит.
 */
const accountIdIsPermanent = (accountId: string): boolean => accountId.indexOf(tempIdPattern) === -1;

/**
 * Выводит сообщение об ошибке в консоль браузера. Если сообщение можно преобразовать в `JSON` типа `APIResponse`,
 * выводится сообщение из него.
 * @param {Error} error - объект ошибки.
 */
const logError = (error: Error) => {
	let message = error.message;

	try {
		const response = JSON.parse(error.message);
		message = response.message;
	} catch (e) {
		noop();
	}

	window.top.console.log(message);
};

/**
 * Функция-заглушка. Используется в качестве функции обратного вызова для удовлетворения требований `eslint`.
 */
const noop = () => {};

export {
	accountIdIsPermanent,
	logError,
	noop
};
