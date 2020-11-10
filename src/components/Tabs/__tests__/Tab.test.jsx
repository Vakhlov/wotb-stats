// @flow
/** @jsx h */
import {h} from 'preact';
import {mount, shallow} from 'enzyme';
import Tab from 'components/Tabs/Tab';

describe('Tab', () => {
	/**
	 * Проверяет, что корешок вкладки выводится правильно.
	 */
	it('renders correctly', () => {
		const caption = 'Tab 1';
		const wrapper = shallow(<Tab caption={caption} />);

		expect(wrapper.find('button')).toHaveLength(1);
		expect(wrapper.find('button').text()).toEqual(caption);
	});

	/**
	 * Проверяет назначение `css`-класса "tabActive" при передаче компоненту флага выбранности вкладки.
	 */
	it('adds "tabActive" css class when "active" property with value of `true` is passed to component', () => {
		const wrapper = shallow(<Tab caption="Tab 1" active={true} />);

		expect(wrapper.find('.tabActive')).toHaveLength(1);
	});

	/**
	 * Проверяет, что свойсвто `active` имеет значение `false` по умолчанию.
	 */
	it('has "active" property set to `false` by default', () => {
		const wrapper = mount(<Tab caption="Tab 1" />);

		expect(wrapper.find(Tab).prop('active')).toBe(false);
	});

	/**
	 * Проверяет назначение `css`-класса "tabWithoutSeparator" при передаче компоненту флага
	 * сокрытия разделителя корешков.
	 */
	it('adds "tabWithoutSeparator" css class when "hideSeparator" property with value of `true` is passed to component', () => {
		const wrapper = shallow(<Tab caption="Tab 1" hideSeparator={true} />);

		expect(wrapper.find('.tabWithoutSeparator')).toHaveLength(1);
	});

	/**
	 * Проверяет, что свойство `hideSeparator` имеет значение `false` по умолчанию.
	 */
	it('has "hideSeparator" property set to `false` by default', () => {
		const wrapper = mount(<Tab caption="Tab 1" />);

		expect(wrapper.find(Tab).prop('hideSeparator')).toBe(false);
	});

	/**
	 * Проверяет вызов обработчика щелчка, если этот обработчик предоставлен.
	 */
	it('calls a callback when clicked on a caption if a callback was provided', () => {
		const onClick = jest.fn();
		const wrapper = shallow(<Tab caption="Tab 1" onClick={onClick} />);

		wrapper.find('button').simulate('click');

		expect(onClick.mock.calls.length).toBe(1);
	});

	/**
	 * Проверяет вызова обработчика закрытия вкладки.
	 */
	it(
		'calls a callback when clicked on close button if a callback was provided and `closable` property was set to `true`',
		() => {
			const onClose = jest.fn();
			const wrapper = shallow(<Tab caption="Tab 1" closable={true} onClose={onClose} />);

			wrapper.find('.close').simulate('click');

			expect(onClose.mock.calls.length).toBe(1);
		}
	);

	/**
	 * Проверяет, что кнопка закрытия вкладки не выводится, если значение свойства `closable` равно `false`.
	 */
	it('does not render close button when `closable` property was set to `false`', () => {
		const onClose = jest.fn();
		const wrapper = shallow(<Tab caption="Tab 1" closable={false} onClose={onClose} />);

		expect(wrapper.find('.close')).toHaveLength(0);
	});

	/**
	 * Проверяет, что кнопка закрытия вкладки не выводится, если не был предоставлен обработчик закрытия вкладки.
	 */
	it('does not render close button when no callback was provided', () => {
		const wrapper = shallow(<Tab caption="Tab 1" closable={true} />);

		expect(wrapper.find('.close')).toHaveLength(0);
	});

	/**
	 * Проверяет, что свойство `closable` имеет значение `false` по умолчанию.
	 */
	it('has "closable" property set to `false` by default', () => {
		const wrapper = mount(<Tab caption="Tab 1" />);

		expect(wrapper.find(Tab).prop('closable')).toBe(false);
	});
});
