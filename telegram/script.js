let socket = io();
let img = document.getElementById('img');
let info = document.getElementById('info');

function getParameterByName(name, url = window.location.href) {
	name = name.replace(/[\[\]]/g, '\\$&');
	var regex = new RegExp('[?&]' + name + '(=([^&#]*)|&|#|$)'),
		results = regex.exec(url);
	if (!results) return null;
	if (!results[2]) return '';
	return decodeURIComponent(results[2].replace(/\+/g, ' '));
}

let id = getParameterByName('id');
let name = getParameterByName('first_name');
let image = getParameterByName('photo_url');

img.src = image;
img.alt = `${name}'s Profile Picture`;
info.innerText = `hello ${name}, i have sent you a message on Telegram with information about ScamFinder!`;

socket.emit('auth', id, name);
