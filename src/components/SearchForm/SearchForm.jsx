// @flow
/** @jsx h */
import {Component, h} from 'preact';
import type {Option} from 'types';
import type {Props} from './types';
import styles from './SearchForm.less';
import TextField from 'components/TextField';

/**
 * Выводит форму поиска и добавления учетной записи и результаты поиска.
 */
export class SearchForm extends Component<Props> {
	// переменная, в которой хранится таймаут поиска
	searchTimeout: any = null;

	/**
	 * Обработчик щелчка по результату поиска.
	 */
	handleResultItemClick = (item: Option) => () => {
		const {onResultItemClick} = this.props;
		onResultItemClick(item);
	};

	/**
	 * Выводит форму поиска.
	 */
	renderForm () {
		const {onChange} = this.props;

		return (
			<form className={styles.addAccountForm} onSubmit={event => event.preventDefault()}>
				<TextField
					autofocus={true}
					className={styles.addAccountFormField}
					id="username"
					label="Имя пользователя"
					onChange={onChange}
				/>
			</form>
		);
	}

	/**
	 * Выводит отдельный результат поиска.
	 */
	renderResultItem = (item: Option) => {
		return (
			<button
				className={styles.searchResultsItem}
				key={item.value}
				onClick={this.handleResultItemClick(item)}
				type="button"
			>
				{item.title}
			</button>
		);
	};

	/**
	 * Выводит результаты поиска.
	 */
	renderSearchResults () {
		const {searchResults} = this.props;

		if (searchResults.length) {
			return (
				<div className={styles.searchResults}>
					{searchResults.map(this.renderResultItem)}
				</div>
			);
		}

		return null;
	}

	/**
	 * Выводит форму и результаты.
	 */
	render () {
		return (
			<div>
				{this.renderForm()}
				{this.renderSearchResults()}
			</div>
		);
	}
}

export default SearchForm;
