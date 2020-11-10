// @flow
/** @jsx h */
import {
	achievementDescriptionsResponse,
	vehicleAchievementsResponse,
	vehicleInfoResponse,
	vehicleStatsResponse
} from 'mocks/data';
import App from 'components/App';
import fetchMock from 'fetch-mock';
import {getUrl, normalizeOptions} from 'helpers/fetch-data';
import {h} from 'preact';
import {LocalStorageMock} from 'mocks/local-storage';
import {paths} from 'constants/app';
import Record from 'components/Record';
import {shallow} from 'enzyme';
import Tab from 'components/Tabs/Tab';
import Tabs from 'components/Tabs';

/**
 * Подмена локального хранилища для целей тестирования. В хранилище записывается ненастоящий идентификатор учетной
 * записи, который позже используется компонентом `App` как аргумент для функций получения данных. Также в хранилище
 * записывается информация об учетных записях (название и идентификатор), потому что иначе App считает настоящие
 * идентификаторы, а работать будет по установленному тут.
 */
global.localStorage = new LocalStorageMock();
localStorage.setItem('accounts', JSON.stringify([{id: '1', name: 'nameOne'}, {id: '2', name: 'nameTwo'}]));
localStorage.setItem('selectedAccountId', '1');

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
	 * Проверяет, что компонент выводится правильно, а именно, что:
	 * - определенным элементам назначены соответствующие `css`-классы,
	 * - получаемая структура в `DOM` имеет все необходимые элементы,
	 * - элементы вложены друг в друга правильно,
	 * - элементы своим количеством отражают состояние компонента (их столько же, сколько элементов в состоянии).
	 */
	it('renders correctly', async () => {
		// подготовка ответов на запросы, инициируемые компонентом
		fetchMock.get(
			getUrl(paths.encyclopediaAchievements),
			Promise.resolve(achievementDescriptionsResponse)
		);

		fetchMock.get(
			getUrl(paths.tanksAchievements, normalizeOptions({id: '1'})),
			Promise.resolve(vehicleAchievementsResponse)
		);

		fetchMock.get(
			getUrl(paths.encyclopediaVehicles),
			Promise.resolve(vehicleInfoResponse)
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
		expect(wrapper.find(Record)).toHaveLength(wrapper.state().vehicleStats.length);
	});
});
