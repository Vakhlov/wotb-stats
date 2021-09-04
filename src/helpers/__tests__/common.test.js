// @flow
import {accountIdIsPermanent, countPermanentAccounts} from 'helpers/common';
import {tempIdPattern} from 'constants/app';

describe('Common helpers', () => {
	describe('accountIdIsPermanent', () => {
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

	describe('countPermanentAccounts', () => {
		/**
		 * Проверяет, что функция `countPermanentAccounts` возвращает правильное количество постоянных учетных записей.
		 */
		it('return amount of permanent tabs', () => {
			const accounts = [
				{id: '1', name: 'nameOne'},
				{id: 'NewAccount1', name: 'Новая учетная запись 1'},
				{id: 'NewAccount2', name: 'Новая учетная запись 2'},
				{id: '2', name: 'nameTwo'},
				{id: '3', name: 'nameThree'}
			];

			expect(countPermanentAccounts(accounts)).toBe(3);
		});
	});
});
