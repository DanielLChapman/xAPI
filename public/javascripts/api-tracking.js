import '../sass/style.scss';

import { $, $$ } from './modules/bling';

var temp = document.getElementsByClassName('grow')[0];

temp.onmouseover = function() {
	console.log('here');
};
