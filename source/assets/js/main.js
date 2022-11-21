import Boilerplate from './components/Boilerplate.js';

const TYPES = {
	boilerplate: Boilerplate,
};

Array.prototype.forEach.call(document.querySelectorAll('[data-js]'), el => {
	const type = el.getAttribute('data-js');
	const Component = TYPES[type];
	const component = new Component();
	component.init(el);
});
