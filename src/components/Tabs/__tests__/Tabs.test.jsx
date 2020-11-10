// @flow
/** @jsx h */
import {h} from 'preact';
import {mount, shallow} from 'enzyme';
import Tab from 'components/Tabs/Tab';
import Tabs from 'components/Tabs';

describe('Tabs', () => {
	/**
	 * Проверяет, что выводится правильное количество вкладок.
	 */
	it('has correct number of tabs', () => {
		const content = (
			<Tabs selected={0}>
				<Tab caption="Tab 1"><div className="tab1-content">Tab 1 content</div></Tab>
				<Tab caption="Tab 2"><div className="tab2-content">Tab 2 content</div></Tab>
			</Tabs>
		);

		const wrapper = mount(content);

		expect(wrapper.find(Tab)).toHaveLength(2);
	});

	/**
	 * Проверяет, что выводится содержимое только одной вкладки.
	 */
	it('has only one content block at a time', () => {
		const content = (
			<Tabs selected={0}>
				<Tab caption="Tab 1"><div className="tab1-content">Tab 1 content</div></Tab>
				<Tab caption="Tab 2"><div className="tab2-content">Tab 2 content</div></Tab>
			</Tabs>
		);

		const wrapper = shallow(content);

		expect(wrapper.find('.tabContent')).toHaveLength(1);
	});

	/**
	 * Проверяет, что выводится содержимое активной вкладки.
	 */
	it('has active tab content in a tab content block', () => {
		const content = (
			<Tabs selected={1}>
				<Tab caption="Tab 1"><div className="tab1-content">Tab 1 content</div></Tab>
				<Tab caption="Tab 2"><div className="tab2-content">Tab 2 content</div></Tab>
			</Tabs>
		);

		const wrapper = shallow(content);

		expect(wrapper.find('.tabContent .tab2-content')).toHaveLength(1);
	});

	/**
	 * Проверяет, что щелчок по корешку вкладки делает этот корешок активным, а остальные - не активными.
	 */
	it('switches tabs when clicked on tab', async () => {
		const onSwitch = jest.fn();
		const content = (
			<Tabs onSwitch={onSwitch}>
				<Tab caption="Tab 1"><div className="tab1-content">Tab 1 content</div></Tab>
				<Tab caption="Tab 2"><div className="tab2-content">Tab 2 content</div></Tab>
			</Tabs>
		);

		const wrapper = mount(content);

		expect(wrapper.find(Tab).at(0).prop('active')).toBe(true);

		wrapper.find(Tab).at(1).find('button').simulate('click');

		expect(wrapper.find(Tab).at(0).prop('active')).toBe(false);
		expect(wrapper.find(Tab).at(1).prop('active')).toBe(true);
	});

	/**
	 * Проверяет, что содержимое вкладки переключается при щелчке по корешку вкладки.
	 */
	it('switches content when clicked on tab', () => {
		const content = (
			<Tabs>
				<Tab caption="Tab 1"><div className="tab1-content">Tab 1 content</div></Tab>
				<Tab caption="Tab 2"><div className="tab2-content">Tab 2 content</div></Tab>
			</Tabs>
		);

		const wrapper = mount(content);

		wrapper.find(Tab).at(1).find('button').simulate('click');

		expect(wrapper.find('.tab2-content')).toHaveLength(1);
	});
});
