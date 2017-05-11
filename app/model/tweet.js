var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

// create a schema
var tweetSchema = Schema({
	_id			: Number,
	created_at	: Date,
	text		: String,
	source		: String,
	_words		: [{ type: Schema.Types.ObjectId, ref: 'Word' }],
	user		: { type: Number, ref: 'User' },
	geo			: Boolean,
	coordinates	: String,
	place		: {},
	hashtags	: [String],
});

var Tweet = mongoose.model('Tweet', tweetSchema);

module.exports = {
  Tweet: Tweet
}