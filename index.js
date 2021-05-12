// Packages/Libraries
const app = require('express')();
const http = require('http').Server(app);
const io = require('socket.io')(http);
const math = require('mathjs');
const discord = require('./discord');
const TelegramBot = require('node-telegram-bot-api');
require('dotenv').config();
let PORT = process.env.PORT;
db = require('./database/mongo');

// Server Stuff
app.get('/', async (req, res) => {
	res.sendFile('/index.html', {
		root: `${__dirname}/Home`
	});
});
app.get('/css', async (req, res) => {
	let folder = req.query.folder;
	let file = req.query.file;
	res.sendFile(`/${file}.css`, {
		root: `${__dirname}/${folder}`
	});
});
app.get('/js', async (req, res) => {
	let folder = req.query.folder;
	let file = req.query.file;

	res.sendFile(`/${file}.js`, {
		root: `${__dirname}/${folder}`
	});
});
app.get('/json', async (req, res) => {
	let folder = req.query.folder;
	let file = req.query.file;

	res.sendFile(`/${file}.json`, {
		root: `${__dirname}/${folder}`
	});
});
app.get('/icon', async (req, res) => {
	res.sendFile(`/icon.png`, {
		root: __dirname
	});
});
app.get('/robots.txt', async (req, res) => {
	res.sendFile('/robots.txt', {
		root: __dirname
	});
});
app.get('/sitemap.rss', async (req, res) => {
	res.sendFile('/sitemap.rss', {
		root: __dirname
	});
	res.status(200);
});
app.get('/docs', async (req, res) => {
	res.sendFile('/index.html', {
		root: `${__dirname}/docs`
	});
});
app.get('/scambaiters', async (req, res) => {
	res.sendFile('/index.html', {
		root: `${__dirname}/scambaiters`
	});
});
app.get('/telegram', async (req, res) => {
	res.sendFile('/index.html', {
		root: `${__dirname}/telegram`
	});
});
app.get('/telegram_callback', async (req, res) => {
	res.sendFile('/auth.html', {
		root: `${__dirname}/telegram`
	});
});
app.get('/feedback', async (req, res) => {
	res.sendFile('/index.html', {
		root: `${__dirname}/Home/Feedback`
	});
});
app.get('/ping', async (req, res) => {
	res.send('sent ping');
	console.log('recieved ping');
});
app.get('/privacy', async (req, res) => {
	res.sendFile('/privacy.html', {
		root: `${__dirname}/Home/Policies`
	});
});
app.get('/terms', async (req, res) => {
	res.sendFile('/terms.html', {
		root: `${__dirname}/Home/Policies`
	});
});
app.get('/alexa', async (req, res) => {
	res.sendFile('/index.html', {
		root: `${__dirname}/Home/Alexa`
	});
});
app.get('/report', async (req, res) => {
	res.sendFile('/index.html', {
		root: `${__dirname}/Report`
	});
});
app.get('/api/get', async (req, res) => {
	let number = req.query.number;
	let results = await db.numbers.get(number);
	db.search.add(number);
	res.json(results);
});
app.get('/api/getrecentsearches', async (req, res) => {
	let results = await db.search.list();
	res.json(results);
});
app.get('*', async (req, res) => {
	res.sendFile('/index.html', {
		root: `${__dirname}/404`
	});
	res.status('404');
});

// Telegram Code
const token = process.env.TELEGRAM;
const bot = new TelegramBot(token, {
	polling: true
});

io.on('connection', async socket => {
	socket.on('auth', async (id, name) => {
		bot.sendMessage(
			id,
			`hi ${name}, ScamFinder is a new and easier way to detect if a scammer is calling you, just enter the phone number and see if there's any reports from anyone of our VERY small community. you can click the "/" for available commands!`
		);
	});
});

bot.onText(/\/start/, async (msg, match) => {
	const chatId = msg.chat.id;

	bot.sendMessage(
		chatId,
		`ScamFinder is a new and easier way to detect if a scammer is calling you, just enter the phone number and see if there's any reports from anyone of our VERY small community`
	);

	bot.sendMessage(chatId, `how may i help you, "/" for available commands!`);
});

bot.onText(/\/check/, async (msg, match) => {
	const chatId = msg.chat.id;
	const number = match.input.split(' ')[1];
	let response;

	if (number === undefined) {
		response = `you didn't specify a valid phone number!`;
	} else {
		if (number.length === 10) {
			let results = await db.numbers.get(number);

			if (results === null) {
				response = `the phone number you have specified has not been reported, there is a 25 percent chance of this being a scam call if this is a scam call please go to https://scamfinder.tk/report`;
			} else {
				if (results.verified === true) {
					response = `the phone number you have specified has ${
						results.reports
					} reports as a ${results.type}, this is definitely a scam caller`;
				} else {
					response = `the phone number you have specified has ${
						results.reports
					} reports as a ${results.type}, there is a ${
						results.percentage
					} percent chance of this being a scam call`;
				}
			}
		} else {
			response = `you didn't specifiy a valid phone number!`;
		}
	}
	bot.sendMessage(chatId, response);
});

// Sockets
io.on('connection', socket => {
	socket.on('error', async error => {
		console.log(error);
	});
});
io.on('connection', socket => {
	socket.on('feedback', async msg => {
		db.feedback.add(msg);
	});
});
io.on('connection', socket => {
	socket.on('report', async (number, category) => {
		let results = await db.numbers.get(number);
		if (results === null) {
			db.numbers.add(number, '1', '10', category, false);
		} else {
			let newReports = math.add(results.reports, 1);
			let newPercentage = math.add(results.percentage, 10);

			if (newPercentage > 100) {
				db.numbers.edit(number, newReports, newPercentage, category, true);
			} else {
				db.numbers.edit(
					number,
					newReports,
					newPercentage,
					category,
					results.verified
				);
			}
		}
	});
});
io.on('connection', socket => {
	socket.on('getAllNumbers', async info => {
		const numbers = await db.numbers.list();
	});
	io.on('connection', socket => {
		socket.on('getNumber', async number => {
			let results = await db.numbers.get(number);

			db.search.add(number);

			if (results === null) {
				socket.emit(
					'results',
					`the phone number you have specified has not been reported, there is a 25 percent chance of this being a scam call if this is a scam call please go to the <a href="/report">Report</a> section of this website!`
				);
			} else {
				if (results.verified === true) {
					socket.emit(
						'results',
						`the phone number you have specified has ${
							results.reports
						} reports as a <span style="color: red;">${
							results.type
						}</span>, this is definitely a scam caller`
					);
				} else {
					socket.emit(
						'results',
						`the phone number you have specified has ${
							results.reports
						} reports as a <span style="color: red;">${
							results.type
						}</span>, there is a ${
							results.percentage
						} percent chance of this being a scam call`
					);
				}
			}
		});
	});
});

// Start Server
http.listen(PORT, () => {
	console.log(`website and api online`);
	db.connect(process.env.MONGO);
});
