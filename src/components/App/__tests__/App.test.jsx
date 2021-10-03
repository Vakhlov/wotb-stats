// @flow
/** @jsx h */
import {
	accountInfoResponse,
	achievementDescriptionsResponse,
	noAchievementsResponse,
	noVehicleStatsResponse,
	vehicleAchievementsResponse,
	vehicleInfoResponse,
	vehicleStatsResponse
} from 'mocks/data';
import App from 'components/App';
import fetchMock from 'fetch-mock';
import {getUrl, normalizeOptions} from 'helpers/fetch-data';
import {h} from 'preact';
import {LocalStorageMock} from 'mocks/local-storage';
import {mount, shallow} from 'enzyme';
import {paths} from 'constants/app';
import Record from 'components/Record';
import Tab from 'components/Tabs/Tab';
import Tabs from 'components/Tabs';

/**
 * Локальное хранилище.
 *
 * Подменяется для целей тестирования. В хранилище записывается ненастоящий идентификатор учетной записи, который
 * позже используется компонентом `App` как аргумент для функций получения данных. Также в хранилище записывается
 * информация об учетных записях (название и идентификатор), потому что иначе `App` считает настоящие идентификаторы,
 * а работать будет по установленному тут.
 */
global.localStorage = new LocalStorageMock();

/**
 * Поскольку компонент `App` не является "чистым" (делает запросы ко внешнему ресурсу и зависит от полученных
 * данных), необходимо спустя некоторое время обновлять обертку компонента, т.к. его содержимое перерисуется
 * после получения запрошенной информации. Сделать это сразу после подключения компонента в `DOM` не получится,
 * нужна некоторая задержка.
 */
const sleep = (ms) => {
  return new Promise(resolve => setTimeout(resolve, ms));
};

describe('App', () => {
	/**
	 * Действия, выполняемые в начале каждого теста.
	 */
	beforeEach(() => {
		// подготовка ответов на запросы, инициируемые компонентом
		fetchMock.get(
			getUrl(paths.encyclopediaAchievements),
			Promise.resolve(achievementDescriptionsResponse)
		);

		fetchMock.get(
			getUrl(paths.encyclopediaVehicles),
			Promise.resolve(vehicleInfoResponse)
		);
	});

	/**
	 * Проверяет, что при наличии в локальном хранилище информации об учетных записях, выводится данные, связанные с
	 * выбранной учетной записью и пользовательский интерфейс отображается правильно, а именно, что:
	 * - определенным элементам назначены соответствующие `css`-классы,
	 * - получаемая структура в `DOM` имеет все необходимые элементы,
	 * - элементы вложены друг в друга правильно,
	 * - элементы своим количеством отражают состояние компонента (их столько же, сколько элементов в состоянии).
	 */
	it('shows account data and renders correctly when there is information about accounts in local storage', async () => {
		// подготовка локального хранилища
		localStorage.setItem('accounts', JSON.stringify([{id: '1', name: 'nameOne'}, {id: '2', name: 'nameTwo'}]));
		localStorage.setItem('selectedAccountId', '1');

		// подготовка ответов на запросы, инициируемые компонентом
		fetchMock.get(
			getUrl(paths.accountInfo, normalizeOptions({id: '1'})),
			Promise.resolve(accountInfoResponse)
		);

		fetchMock.get(
			getUrl(paths.tanksAchievements, normalizeOptions({id: '1'})),
			Promise.resolve(vehicleAchievementsResponse)
		);

		fetchMock.get(
			getUrl(paths.tanksStats, normalizeOptions({id: '1'})),
			Promise.resolve(vehicleStatsResponse)
		);

		// монтирование компонента
		const wrapper = shallow(<App />);

		// ожидание "выполения" запросов и "перерисовки" компонента
		await sleep(3000);

		// обновление обертки
		wrapper.update();

		// проверки
		expect(wrapper.find('.root')).toHaveLength(1);
		expect(wrapper.find('.control button')).toHaveLength(1);
		expect(wrapper.find(Tabs)).toHaveLength(1);
		expect(wrapper.find(Tab)).toHaveLength(2);
		expect(wrapper.find('.sheet')).toHaveLength(1);
		expect(wrapper.find('.head')).toHaveLength(1);
		expect(wrapper.find('.head .titleAndPercentage')).toHaveLength(1);
		expect(wrapper.find('.head .title')).toHaveLength(1);
		expect(wrapper.find('.head .percentage.t-right')).toHaveLength(1);
		expect(wrapper.find('.head .achievements')).toHaveLength(1);
		expect(wrapper.find('.head .achievements .l-cell')).toHaveLength(Object.keys(wrapper.state().achievementDescriptions).length);
		expect(wrapper.find('.noDataMessage')).toHaveLength(0);
		expect(wrapper.find(Record)).toHaveLength(wrapper.state().vehicleStats.length);
	});

	/**
	 * Проверяет, что при пустом локальном хранилище выводится форма поиска учетных записей.
	 */
	it('shows search account form when local storage is empty', async () => {
		// монтирование компонента
		const wrapper = mount(<App />);

		// ожидание "выполения" запросов и "перерисовки" компонента
		await sleep(3000);

		// обновление обертки
		wrapper.update();

		// проверки
		expect(wrapper.find('.root')).toHaveLength(1);
		expect(wrapper.find('.control button')).toHaveLength(1);
		expect(wrapper.find(Tabs)).toHaveLength(0);
		expect(wrapper.find('.sheet')).toHaveLength(0);
		expect(wrapper.find('.addAccountForm')).toHaveLength(1);
	});

	/**
	 * Проверяет, что щелчок по результату поиска добавляет учетную запись в локальное хранилище.
	 */
	it('adds account to local storage when search result was clicked', async () => {
		// подготовка ответов на запросы, инициируемые компонентом
		fetchMock.get(
			getUrl(paths.accountInfo, normalizeOptions({id: '1'})),
			Promise.resolve(accountInfoResponse)
		);

		fetchMock.get(
			getUrl(paths.tanksAchievements, normalizeOptions({id: '1'})),
			Promise.resolve(vehicleAchievementsResponse)
		);

		fetchMock.get(
			getUrl(paths.tanksStats, normalizeOptions({id: '1'})),
			Promise.resolve(vehicleStatsResponse)
		);

		// монтирование компонента и установка результатов поиска в состояние приложения
		const wrapper = mount(<App />);
		wrapper.setState({searchResults: [{title: 'nameOne', value: '1'}]});

		// ожидание "перерисовки" компонента и вывода результатов поиска
		await sleep(3000);

		// обновление обертки
		wrapper.update();

		// щелчок по результату поиска
		wrapper.find('.searchResultsItem').at(0).simulate('click');

		// значения, установленные компонентом в локальное хранилище
		const accounts = JSON.parse(localStorage.getItem('accounts') || '[]');
		const selectedAccountId = localStorage.getItem('selectedAccountId');

		// ожидаемые значения в локальном хранилище
		const expectedAccounts = [{id: '1', name: 'nameOne'}];
		const expectedSelectedAccountId = '1';

		// проверки
		expect(accounts).toEqual(expectedAccounts);
		expect(selectedAccountId).toEqual(expectedSelectedAccountId);
	});

	/**
	 * Проверяет, что в случае отсутствия данных для указанной учетной записи выводится сообщение об этом.
	 */
	it('show special message when no data found for specified account', async () => {
		// подготовка локального хранилища
		localStorage.setItem('accounts', JSON.stringify([{id: '1', name: 'nameOne'}]));
		localStorage.setItem('selectedAccountId', '1');

		// подготовка ответов на запросы, инициируемые компонентом
		fetchMock.get(
			getUrl(paths.accountInfo, normalizeOptions({id: '1'})),
			Promise.resolve(accountInfoResponse)
		);

		fetchMock.get(
			getUrl(paths.tanksAchievements, normalizeOptions({id: '1'})),
			Promise.resolve(noAchievementsResponse)
		);

		fetchMock.get(
			getUrl(paths.tanksStats, normalizeOptions({id: '1'})),
			Promise.resolve(noVehicleStatsResponse)
		);

		// монтирование компонента
		const wrapper = shallow(<App />);

		// ожидание "выполения" запросов и "перерисовки" компонента
		await sleep(3000);

		// обновление обертки
		wrapper.update();

		// проверки
		expect(wrapper.find('.noDataMessage')).toHaveLength(1);
	});

	/**
	 * Действия, выполняемые в конце каждого теста.
	 */
	afterEach(() => {
		// восстановление `fetchMock`
		fetchMock.restore();

		// очистка локального хранилища
		localStorage.removeItem('accounts');
		localStorage.removeItem('selectedAccountId');
	});
});
