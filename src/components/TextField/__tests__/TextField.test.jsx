// @flow
/** @jsx h */
import {h} from 'preact';
import {shallow} from 'enzyme';
import TextField from 'components/TextField';

describe('TextField', () => {
	/**
	 * Проверяет, что переданное название `css`-класса используется.
	 */
	it('sets provided css class name', () => {
		const className = 'field';
		const onChange = jest.fn();

		const props = {
			autofocus: true,
			id: 'test',
			label: 'Label',
			onChange
		};

		const wrapper = shallow(<TextField {...props} />);
		const wrapperWithClassName = shallow(<TextField {...props} className={className} />);

		expect(wrapper.find(`.${className}`).length).toBe(0);
		expect(wrapperWithClassName.find(`.${className}`).length).toBe(1);
	});

	/**
	 * Проверяет, что предоставленная функция обратного вызова выполняется при изменении значения поля ввода.
	 */
	it('calls provided callback when input value changes', () => {
		const onChange = jest.fn();

		const props = {
			autofocus: true,
			id: 'test',
			label: 'Label',
			onChange
		};

		const wrapper = shallow(<TextField {...props} />);
		const input = wrapper.find('input');

		input.simulate('keyup');

		expect(onChange).toHaveBeenCalled();
	});
});
