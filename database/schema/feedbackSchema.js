const mongoose = require('mongoose');

const schema = new mongoose.Schema({
	msg: String
});

module.exports = mongoose.model('feedbackSchema', schema);