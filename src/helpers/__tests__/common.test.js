// @flow
import {accountIdIsPermanent} from 'helpers/common';
import {tempIdPattern} from 'constants/app';

describe('Common helpers', () => {
	/**
	 * Проверяет, что функция `accountIdIsPermanent` возвращает `false`, если идентификатор учетной записи временный.
	 */
	it('returns `false` if acount id is temporary', () => {
		const tempId = `${tempIdPattern}1`;
		expect(accountIdIsPermanent(tempId)).toBe(false);
	});

	/**
	 * Проверяет, что функция `accountIdIsPermanent` возвращает `true`, если идентификатор учетной записи постоянный.
	 */
	it('returns `true` if account id is permanent', () => {
		const permanentId = '1';
		expect(accountIdIsPermanent(permanentId)).toBe(true);
	});
});
