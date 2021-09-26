// @flow
/** @jsx h */
import {achievementFields} from 'constants/app';
import cn from 'classnames';
import {Component, h} from 'preact';
import type {Props} from './types';
import styles from './Achievements.less';

/**
 * Выводит список достижений на технике. Неполученные достижения выводятся с некоторой прозрачностью.
 */
export class Achievements extends Component<Props> {
	/**
	 * Выводит изображение отдельного достижения.
	 * @param {string} id - идентификатор достижения, например, `markOfMastery`.
	 * @returns {HTMLImageElement} - возвращает элемент изображения `HTML`.
	 */
	renderItem = (id: string): HTMLImageElement => {
		const {achievements, descriptions} = this.props;
		const achievement = achievements.find(item => item === id);
		const description = descriptions[id];
		const {image, name} = description;
		const props = {
			alt: name,
			className: cn({
				[styles.achievement]: true,
				[styles.achievementAcquired]: !!achievement,
				'l-cell': true
			}),
			src: image,
			title: name
		};

		return <img key={id} {...props} />;
	};

	/**
	 * Вызывает метод вывода отдельного достижения для каждого элемента списка и возвращает результат.
	 */
	renderItems (): Array<HTMLImageElement> {
		return achievementFields.map<HTMLImageElement>(this.renderItem);
	}

	/**
	 * Выводит список достижений.
	 */
	render (): HTMLDivElement {
		return (
			<div className={styles.achievements}>
				{this.renderItems()}
			</div>
		);
	}
}

export default Achievements;
