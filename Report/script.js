let socket = io();
let number = document.getElementById('number');
let category = document.getElementById('type');
let btn = document.getElementById('btn');
let msg = document.getElementById('msg');

btn.addEventListener('click', function () {
	if (category.options[category.selectedIndex].text === 'Scam Category') {
		msg.innerHTML = `<h3>you didn't specify the scam category</h3>`;
	} else {
		if (number.value.length === 10) {
			socket.emit(
				'report',
				number.value,
				category.options[category.selectedIndex].text
			);
			msg.innerHTML = `<h3>thanks for reporting!</h3>`;
		} else {
			msg.innerHTML = `<h3>you didn't specify a vaild phone number</h3>`;
		}
	}
});

function myFunction() {
	var x = document.getElementById('navDemo');
	if (x.className.indexOf('w3-show') == -1) {
		x.className += ' w3-show';
	} else {
		x.className = x.className.replace(' w3-show', '');
	}
}