// @flow
/** @jsx h */
import 'styles/styles.less';
import App from 'components/App';
import {h, render} from 'preact';

const root = document.getElementById('root');

if (root) {
	render(<App />, root);
}
