// @flow
/** @jsx h */
import {achievementDescriptions, achievements} from 'mocks/data';
import Achievements from 'components/Achievements';
import {h} from 'preact';
import Preview from 'components/Preview';
import Record from 'components/Record';
import {shallow} from 'enzyme';
import Title from 'components/Title';

describe('Record', () => {
	/**
	 * Проверят, что компонент выводит все свои дочерние компоненты: миниатюру, заголовок и достижения.
	 */
	it('contains preview, title and achievements', () => {
		const props = {
			accountPercentage: 50,
			achievementDescriptions,
			achievements,
			hitsPercentage: '77.46',
			name: 'Т-26',
			preview: 'http://glossary-ru-static.gcdn.co/icons/wotb/current/uploaded/vehicles/hd_thumbnail/T-26.png'
		};

		const wrapper = shallow(<Record {...props} />);

		expect(wrapper.find(Preview)).toHaveLength(1);
		expect(wrapper.find(Title)).toHaveLength(1);
		expect(wrapper.find(Achievements)).toHaveLength(1);
	});
});
