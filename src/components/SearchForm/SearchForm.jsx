// @flow
/** @jsx h */
import {Component, h} from 'preact';
import type {Option} from 'types';
import type {Props} from './types';
import styles from './SearchForm.less';
import TextField from 'components/TextField';

export class SearchForm extends Component<Props> {
	// переменная, в которой хранится таймаут поиска
	searchTimeout: any = null;

	handleResultItemClick = (item: Option) => () => {
		const {onResultItemClick} = this.props;
		onResultItemClick(item);
	};

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
