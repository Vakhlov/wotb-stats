// @flow
/** @jsx h */
import {h} from 'preact';
import Preview from 'components/Preview';
import {shallow} from 'enzyme';

describe('Preview', () => {
	/**
	 * Проверяет, что выводится `HTML`-элемент `img`, если адрес изображения есть.
	 */
	it('renders "img" HTML element when "src" property is provided', () => {
		const src = 'http://glossary-ru-static.gcdn.co/icons/wotb/current/uploaded/vehicles/hd_thumbnail/T-26.png';
		const title = 'Т-26';
		const wrapper = shallow(<Preview src={src} title={title} />);

		expect(wrapper.find('img')).toHaveLength(1);
		expect(wrapper.find('span')).toHaveLength(0);
	});

	/**
	 * Проверяет, что выводится `HTML`-элемент `span` с текстом "Изображение недоступно", если адреса изображения нет.
	 */
	it('renders "span" HTML element with text "Изображение недоступно" when "src" property is not provided', () => {
		const src = '';
		const title = 'Т-26';
		const wrapper = shallow(<Preview src={src} title={title} />);

		expect(wrapper.find('img')).toHaveLength(0);
		expect(wrapper.find('span')).toHaveLength(1);
		expect(wrapper.find('span').text()).toBe('Изображение недоступно');
	});
});
