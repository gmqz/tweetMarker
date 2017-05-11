var mongoose = require('mongoose'),
    Schema = mongoose.Schema;
// create a schema
var userSchema = Schema({
	_id			: Number,
	name		: String,
	screen_name	: String,
	location	: String,
	_tweets		: [{ type: Schema.Types.ObjectId, ref: 'Tweet' }],
	json		: {}
});
var User = mongoose.model('User', userSchema);

module.exports = {
  User: User
}