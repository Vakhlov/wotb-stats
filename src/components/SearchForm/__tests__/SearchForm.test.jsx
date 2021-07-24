// @flow
/** @jsx h */
import {h} from 'preact';
import SearchForm from 'components/SearchForm';
import {shallow} from 'enzyme';

describe('SearchForm', () => {
	/**
	 * Проверяет, что результаты поиска выводятся, если они есть.
	 */
	it('renders provided search results', () => {
		const onChange = jest.fn();
		const onResultItemClick = jest.fn();
		const searchResults = [
			{
				title: 'Result 1',
				value: '1'
			},
			{
				title: 'Result 2',
				value: '2'
			}
		];

		const props = {
			onChange,
			onResultItemClick,
			searchResults
		};

		const wrapper = shallow(<SearchForm {...props} />);

		expect(wrapper.find('.searchResultsItem').length).toBe(2);
	});

	/**
	 * Проверяет, что предоставленная функция обратного вызова выполняется при щелчке по результату поиска.
	 */
	it('runs provided callback when search results item has been clicked', () => {
		const onChange = jest.fn();
		const onResultItemClick = jest.fn();
		const searchResults = [
			{
				title: 'Result 1',
				value: '1'
			},
			{
				title: 'Result 2',
				value: '2'
			}
		];

		const props = {
			onChange,
			onResultItemClick,
			searchResults
		};

		const wrapper = shallow(<SearchForm {...props} />);
		wrapper.find('.searchResultsItem').at(0).simulate('click');

		expect(onResultItemClick.mock.calls.length).toBe(1);
	});
});
