// @flow
import {accountIdIsPermanent, countPermanentAccounts} from 'helpers/common';
import {LocalStorageMock} from 'mocks/local-storage';
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
	 * Проверяет, что функция `countPermanentAccounts` возвращает правильное количество постоянных учетных записей.
	 */
	it('return amount of permanent tabs', () => {
		global.localStorage = new LocalStorageMock();
		const accounts = [
			{id: '1', name: 'nameOne'},
			{id: 'NewAccount1', name: 'Новая учетная запись 1'},
			{id: 'NewAccount2', name: 'Новая учетная запись 2'},
			{id: '2', name: 'nameTwo'},
			{id: '3', name: 'nameThree'}
		];

		localStorage.setItem('accounts', JSON.stringify(accounts));

		expect(countPermanentAccounts()).toBe(3);
	});

	/**
	 * Проверяет, что функция `accountIdIsPermanent` возвращает `true`, если идентификатор учетной записи постоянный.
	 */
	it('returns `true` if account id is permanent', () => {
		const permanentId = '1';
		expect(accountIdIsPermanent(permanentId)).toBe(true);
	});

	/**
	 * Очистка.
	 */
	afterEach(() => localStorage.removeItem('accounts'));
});
