// @flow
/** @jsx h */
import {h} from 'preact';
import type {Props} from './types';
import styles from './Preview.less';

/**
 * Выводит миниатюру техники или текст "Изображение недоступно", если миниатюры нет.
 */
export const Preview = (props: Props) => {
	const {src, title} = props;
	const content = src ? <img src={src} alt="" title={title} /> : <span>Изображение недоступно</span>;

	return <div className={styles.preview}>{content}</div>;
};

export default Preview;
