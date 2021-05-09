// Packages/Libraries
const {
	Client,
	MessageEmbed,
	Collection
} = require('discord.js');
const client = new Client();
const moment = require('moment-timezone');
const os = require('os');
const math = require('mathjs');
require('dotenv').config();
let log_channel = process.env.logchannel;
db = require('./database/mongo');

// Slash Commands
client.ws.on('INTERACTION_CREATE', async interaction => {
	let response;

	if (interaction.data.name === 'report') {
		let value = Object.values(interaction.data.options)[0];
		let results = await db.numbers.get(value.value);
		if (value.value.length === 10) {
			if (results === null) {
				db.numbers.add(value.value, '1', '10', 'Other', false);
			} else {
				let newReports = math.add(results.reports, 1);
				let newPercentage = math.add(results.percentage, 10);

				if (newPercentage > 100) {
					db.numbers.edit(
						value.value,
						newReports,
						newPercentage,
						'Other',
						true
					);
				} else {
					db.numbers.edit(
						value.value,
						newReports,
						newPercentage,
						'Other',
						results.verified
					);
				}
			}
			response = `thanks for reporting!`;
		} else {
			response = `you didn't specify a valid phone number!`;
		}
	}
	if (interaction.data.name === 'website') {
		response = `https://scamfinder.tk/`;
	}
	if (interaction.data.name === 'check') {
		let value = Object.values(interaction.data.options)[0];
		let results = await db.numbers.get(value.value);
		if (value.value.length === 10) {
			if (results === null) {
				response = `the phone number you have specified has not been reported, there is a 25 percent chance of this being a scam call if this is a scam call please use the Report slash command!`;
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
			response = `you didn't specify a valid phone number!`;
		}
	}
	client.api.interactions(interaction.id, interaction.token).callback.post({
		data: {
			type: 4,
			data: {
				content: response
			}
		}
	});
});

// Regular Commands + Ready Function
client.on('ready', async () => {
	console.log(`discord bot online`);
	/*	let now = moment();
		let correcttime = now.tz('America/Chicago');
		let time = correcttime.format('h:mma');
		let level = `${Math.floor(Math.random() * 100 + 1)}%`;
		let info = new MessageEmbed()
			.setTitle(`BOT STARTED!`)
			.setColor('RANDOM')
			.setThumbnail(client.user.displayAvatarURL())
			.addField('time', time, true)
			.addField('nightmare level', level, true)
			.setFooter(`this message might contain false system information!`);
		client.channels.cache.get(log_channel).send(info);*/
	client.user.setActivity('scamfinder.tk', {
		type: 'LISTENING'
	});
});


client.on('message', async message => {
	let prefix = process.env.PREFIX;
	const args = message.content.slice(prefix.length).split(/ +/g);
	const command = args.shift().toLowerCase();
	if (message.content.startsWith(`${prefix}help`)) {
		message.channel.send(
			new MessageEmbed()
			.setTitle(`HELP:`)
			.setColor(`RANDOM`)
			.addField(
				`${prefix}search {phone number}`,
				`returns how much reports that phone number has recieved`,
				true
			)
			.addField(`EXAMPLE PHONE NUMBER:`, `6035761811`, true)
			.setDescription(`this bot's prefix is ${prefix}`)
		);
	}
	if (message.content.startsWith(`${prefix}search`)) {
		if (!args[0]) {
			message.channel.send(
				new MessageEmbed()
				.setTitle(`ERROR:`)
				.setColor('RANDOM')
				.addField(
					'MISSING ARGUEMENTS',
					'THERE WAS NO PHONE NUMBER SPECIFIED...',
					true
				)
			);
		} else {
			let results = await db.numbers.get(args[0]);
			if (results === null) {
				message.channel.send(
					new MessageEmbed()
					.setTitle('Results:')
					.setDescription(
						`the phone number you have specified has not been reported, there is a 25 percent chance of this being a scam call if this is a scam call please go to https://scamfinder.tk/report`
					)
					.setColor('RANDOM')
				);
			} else {
				if (results.verified === true) {
					message.channel.send(
						new MessageEmbed()
						.setTitle('Results:')
						.setDescription(
							`the phone number you have specified has ${
									results.reports
								} reports as a ${
									results.type
								}, this is definitely a scam caller`
						)
						.setColor('RANDOM')
					);
				} else {
					message.channel.send(
						new MessageEmbed()
						.setTitle('Results:')
						.setDescription(
							`the phone number you have specified has ${
									results.reports
								} reports as a ${results.type}, there is a ${
									results.percentage
								} percent chance of this being a scam call`
						)
						.setColor('RANDOM')
					);
				}
			}
		}
	}
});

// Start Client
client.login(process.env.DISCORD);