const mongoose = require('mongoose');
const numberSchema = require('./schema/numberSchema');
const feedbackSchema = require('./schema/feedbackSchema');
const searchSchema = require('./schema/searchSchema');

module.exports = {
	numberSchema: require('./schema/numberSchema'),
	feedbackSchema: require('./schema/feedbackSchema'),
	searchSchema: require('./schema/searchSchema'),

	async connect(uri) {
		await mongoose.connect(
			uri, {
				useNewUrlParser: true,
				useUnifiedTopology: true,
				useFindAndModify: false
			}
		);
	},
	search: {
		async add(msg) {
			const res = await searchSchema.findOneAndUpdate({
				msg: msg
			}, {
				msg: msg
			}, {
				upsert: true
			});
			return res;
		},
		async list() {
			const data = await searchSchema.find();
			return data;
		}
	},
	feedback: {
		async add(msg) {
			const res = await feedbackSchema.findOneAndUpdate({
				msg: msg
			}, {
				msg: msg
			}, {
				upsert: true
			});
			return res;
		},
		async list() {
			const data = await feedbackSchema.find();
			return data;
		}
	},
	numbers: {
		async add(number, reports, percentage, type, verified) {
			const res = await numberSchema.findOneAndUpdate({
				number: number,
				reports: reports,
				percentage: percentage,
				type: type,
				verified: verified
			}, {
				number: number,
				reports: reports,
				percentage: percentage,
				type: type,
				verified: verified
			}, {
				upsert: true
			});
			return res;
		},
		async remove(number) {
			const remove = await numberSchema.deleteOne({
				number: number
			});
			return remove;
		},
		async edit(number, reports, percentage, type, verified) {
			const remove = await numberSchema.deleteOne({
				number: number
			});
			const add = await numberSchema.findOneAndUpdate({
				number: number,
				reports: reports,
				percentage: percentage,
				type: type,
				verified: verified
			}, {
				number: number,
				reports: reports,
				percentage: percentage,
				type: type,
				verified: verified
			}, {
				upsert: true
			});
			return add;
			return remove;
		},
		async get(numbers) {
			const res = await numberSchema.findOne({
				number: numbers
			});
			return res;
		},
		async list() {
			const data = await numberSchema.find();
			return data;
		}
	}
};