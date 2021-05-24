// Packages/Libraries
const { Client, MessageEmbed, Collection } = require('discord.js');
const client = new Client();
const os = require('os');
const math = require('mathjs');
require('dotenv').config();
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
				.addField(
					`${prefix}report {phone number}`,
					`report a phone number`,
					true
				)
				.addField(
					`${prefix}guilds`,
					`returns a number of how much guilds/servers that this bot is in`,
					true
				)
				.addField(`${prefix}ping`, `returns the latency of bot`, true)
				.addField(`EXAMPLE PHONE NUMBER:`, `6035761811`, true)
				.setDescription(`this bot's prefix is ${prefix}`)
		);
	}
	if (message.content.startsWith(`${prefix}guilds`)) {
		let msg = new MessageEmbed()
			.setTitle(`this bot is in ${client.guilds.cache.size} servers/guilds`)
			.setColor('RANDOM');

		message.channel.send(msg);
	}
	if (message.content.startsWith(`${prefix}ping`)) {
		let msg = new MessageEmbed()
			.setTitle('PONG!')
			.setColor('RANDOM')
			.addField(
				`🏓 Latency`,
				`${Date.now() - message.createdTimestamp}ms`,
				true
			)
			.addField(`API Latency`, `${Math.round(client.ws.ping)}ms`);

		message.channel.send(msg);
	}
	if (message.content.startsWith(`${prefix}report`)) {
		let results = await db.numbers.get(args[0]);
		if (args[0].length === 10) {
			if (results === null) {
				db.numbers.add(value.value, '1', '10', 'Other', false);
			} else {
				let newReports = math.add(results.reports, 1);
				let newPercentage = math.add(results.percentage, 10);

				if (newPercentage > 100) {
					db.numbers.edit(args[0], newReports, newPercentage, 'Other', true);
				} else {
					db.numbers.edit(
						args[0],
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
		message.channel.send(response);
	}
	if (message.content.startsWith(`${prefix}search`)) {
		if (args[0].length === 10) {
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
		} else {
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
		}
	}
});

// Start Client
client.login(process.env.DISCORD);
