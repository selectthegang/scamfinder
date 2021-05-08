const mongoose = require('mongoose');

const schema = new mongoose.Schema({
	number: String,
	reports: String,
	percentage: String,
	type: String,
	verified: Boolean
});

module.exports = mongoose.model('numberSchema', schema);
