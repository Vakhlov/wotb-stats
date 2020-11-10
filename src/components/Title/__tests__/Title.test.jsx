// @flow
/** @jsx h */
import {h} from 'preact';
import {shallow} from 'enzyme';
import Title from 'components/Title';

describe('Title', () => {
	/**
	 * Проверяет, что компонент отображается правильно: есть название и статистика попаданий.
	 */
	it('renders correctly', () => {
		const wrapper = shallow(<Title hitsPercentage="Т-26" name="77.46" />);

		expect(wrapper.find('.title')).toHaveLength(1);
		expect(wrapper.find('span')).toHaveLength(2);
		expect(wrapper.find('.name')).toHaveLength(1);
		expect(wrapper.find('.hitsPercentage')).toHaveLength(1);
	});
});
