let socket = io();
let sendbtn = document.getElementById('sendbtn');
let message = document.getElementById('message');

sendbtn.addEventListener('click', function() {
	if (message.value.length < 5) {
		alert('feedback messages must contain 5 characters or more!');
	} else {
		socket.emit('feedback', message.value);
		alert('submitted feedback...');
	}
});