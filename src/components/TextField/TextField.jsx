// @flow
/** @jsx h */
import {Component, createRef, h} from 'preact';
import type {Props} from './types';

export class TextField extends Component<Props> {
	static defaultProps = {
		className: ''
	};

	input = createRef();

	handleKeyUp = () => {
		const {onChange} = this.props;
		const value = this.input.current.value;

		onChange(value);
	}

	/**
	 * Устанавливает фокус в поле поиска спустя треть секунды после его вывода.
	 * Использование атрибута `autoFocus` у поля ввода не всегда возможно (в консоль браузера выводится
	 * сообщение `Autofocus processing was blocked because a document already has a focused element`).
	 */
	setFocusToInput () {
		setTimeout(() => {
			this.input.current && this.input.current.focus();
		}, 300);
	}

	renderInput () {
		const {autofocus, id} = this.props;

		autofocus && this.setFocusToInput();

		return (
			<input
				autoComplete="off"
				id={id}
				name={id}
				onKeyUp={this.handleKeyUp}
				ref={this.input}
				type="text"
			/>
		);
	}

	renderLabel () {
		const {id, label} = this.props;
		return <label htmlFor={id}>{label}</label>;
	}

	render () {
		const {className} = this.props;
		const props = {
			...(className && {className})
		};

		return (
			<div {...props}>
				{this.renderLabel()}
				{this.renderInput()}
			</div>
		);
	}
}

export default TextField;
