// @flow
/** @jsx h */
import {h} from 'preact';
import {PERCENTAGE_COLOR} from 'components/Title/constants';
import {shallow} from 'enzyme';
import Title from 'components/Title';

describe('Title', () => {
	/**
	 * Проверяет, что компонент отображается правильно: есть название и статистика попаданий.
	 */
	it('renders correctly', () => {
		const wrapper = shallow(<Title hitsPercentage="77.46" name="Т-26" />);

		expect(wrapper.find('.title')).toHaveLength(1);
		expect(wrapper.find('span')).toHaveLength(2);
		expect(wrapper.find('.name')).toHaveLength(1);
		expect(wrapper.find('.hitsPercentage')).toHaveLength(1);
	});

	/**
	 * Проверяет, что проценту попаданий назначается правильный `css`-класс, если было передано
	 * свойство `percentageColor`.
	 */
	it('sets proper css-class to percentage value when color prop is provided', () => {
		const wrapper = shallow(<Title hitsPercentage="77.46" name="Т-26" />);
		const wrapperGreen = shallow(<Title hitsPercentage="77.46" name="Т-26" percentageColor={PERCENTAGE_COLOR.GREEN} />);
		const wrapperRed = shallow(<Title hitsPercentage="77.46" name="Т-26" percentageColor={PERCENTAGE_COLOR.RED} />);

		expect(wrapper.find('.hitsPercentageGreen')).toHaveLength(0);
		expect(wrapper.find('.hitsPercentageRed')).toHaveLength(0);
		expect(wrapperGreen.find('.hitsPercentageGreen')).toHaveLength(1);
		expect(wrapperGreen.find('.hitsPercentageRed')).toHaveLength(0);
		expect(wrapperRed.find('.hitsPercentageGreen')).toHaveLength(0);
		expect(wrapperRed.find('.hitsPercentageRed')).toHaveLength(1);
	});
});
