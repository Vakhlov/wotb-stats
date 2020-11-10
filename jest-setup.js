import 'regenerator-runtime/runtime';
import Adapter from 'enzyme-adapter-preact-pure';
import {configure} from 'enzyme';

configure({adapter: new Adapter()});

const noop = () => {};
Object.defineProperty(window, 'scrollTo', {value: noop, writeable: true});
