var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

// create a schema
var wordSchema = Schema({
	word		: { type: String, required: true, unique: true },
	cant		: Number,
    twits		: [{ type: Number, ref: 'Tweet' }],
	created_at	: Date,
	updated_at	: Date
});

// on every save, add the date
wordSchema.pre('save', function(next) {
	// get the current date
	var currentDate = new Date();
	
	// change the updated_at field to current date
	this.updated_at = currentDate;
	
	// if created_at doesn't exist, add to that field
	if (!this.created_at)
	  this.created_at = currentDate;
	
	next();
});

// the schema is useless so far
// we need to create a model using it
var Word = mongoose.model('Word', wordSchema);

module.exports = {
  Word: Word
}