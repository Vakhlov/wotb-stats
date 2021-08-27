// @flow
import type {Option} from 'types';

export type Props = {
	onChange: (value: string) => void,
	onResultItemClick: (item: Option) => void,
	searchResults: Array<Option>
};
