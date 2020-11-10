// @flow
/** @jsx h */
import {achievementDescriptions, achievements} from 'mocks/data';
import Achievements from 'components/Achievements';
import {h} from 'preact';
import {shallow} from 'enzyme';

describe('Achievements', () => {
	/**
	 * Проверяет, что выводятся все изображения достижений вне зависимости, получены эти достижения или нет.
	 */
	it('outputs all achievements (acquired and not acquired)', () => {
		const wrapper = shallow(<Achievements achievements={achievements} descriptions={achievementDescriptions} />);
		expect(wrapper.find('.achievement')).toHaveLength(Object.keys(achievementDescriptions).length);
	});

	/**
	 * Проверяет, что полученные достижения имеют дополнительный `css`-класс.
	 */
	it('sets "achievementAcquired" css-class to acquired achievements', () => {
		const wrapper = shallow(<Achievements achievements={achievements} descriptions={achievementDescriptions} />);
		expect(wrapper.find('.achievementAcquired')).toHaveLength(achievements.length);
	});
});
