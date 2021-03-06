var Twitter = require('twitter');
var mongoose = require('mongoose');

var client = new Twitter({
	consumer_key: 'Vit5Ve23pMOUE5i4ffgdqC5Q8',
	consumer_secret: 'gfERQbOueGh1lnUuC9GZpz4mCWCP9pLytTpANt07LgKGY3mW8T',
	access_token_key: '2913998225-4CE9YwVvzLsOvkdriha6Iq3VgOp2Y62yXhPt4A6',
	access_token_secret: '8WojQhvFLOdarVc9a3o0v3SmDxFfz2qKolPrfkkiGWaem'
});

mongoose.connect('mongodb://localhost/twitteranalizer');

var Schema = mongoose.Schema;

// create a schema
var wordSchema = new Schema({
	word: { type: String, required: true, unique: true },
	cant: Number,
    twits: [{ type: Schema.Types.ObjectId, ref: 'Twit' }],
	created_at: Date,
	updated_at: Date
});

var twitSchema = Schema({
	_words: [{ type: Schema.Types.ObjectId, ref: 'Word' }],
	user	: String,
	text	: String
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
var Twit = mongoose.model('Twit', twitSchema);

// Dolores : -36.3156624,-57.7177321
// La Plata : -34.9204529,-57.9881899
//client.get('search/tweets', {q: 'Haedo', count: 155, result_type: 'recent' }, function(error, tweets, response) {
//	console.log('Cantidad de tweets: '+tweets.statuses.length);
//	//console.log(tweets);
//	//for (var ele in tweets.statuses) {
//	//	console.log(tweets.statuses[ele].created_at);
//	//	//console.log('Text: ' + tweets.statuses[ele].user);
//	//	console.log(tweets.statuses[ele].text);
//	//}
//	console.log(tweets.search_metadata);
//});

var colors = require('colors'),
	initDate = new Date(),
	canTweet = 0,
	cantNegative = 0,
	mapCountWords = new Map(),
	maxOcurrenceWord = {'word': '', 'occurrence': 0};
	//negative_words = [
	//		{ text: 'globoludos', val: 70 },
	//		{text: 'panamá', val: 50},
	//		{text: 'evadir', val:30},
	//		{text: 'pobreza', val:20},
	//		{text: 'FRACASO', val:40},
	//		{text: 'ESTAFA', val:40},
	//		{text: 'desocupación', val:40}			
	//];
//var posotive_words = ['fuerza'];

var stdin = process.openStdin();
var _stream ;
stdin.addListener("data", function(d) {
    // note:  d is an object, and when converted to a string it will
    // end with a linefeed.  so we (rather crudely) account for that  
    // with toString() and then trim()
	if (d.toString().trim()=='q') {
        _stream.destroy();
    }
    //console.log("you entered: [" + d.toString().trim() + "]");
  });

client.stream('statuses/filter', {track: 'elecciones', location: 'Argentina', attitude: true},  function(stream) {
	_stream = stream;
	stream.on('data', function(tweet) {
		var createdAt = new Date(tweet.created_at);
		var source = '';
		if (tweet.source) {
            source = tweet.source.split('>');
			source = source[1].split('<');
			//console.log(colors.bold(source[0]));
			source = " - " +colors.cyan.bold(source[0]);
        }
		
		if (tweet.place) {
            console.log(colors.bgMagenta.bold(tweet.user.screen_name + " - " + tweet.place.name) + " - " + colors.green(createdAt.toLocaleString()) + source);
        }else{
			console.log(colors.bgMagenta.bold(tweet.user.screen_name) + " - " + colors.green(createdAt.toLocaleString()) + source);
		}
		
		var textUpper = tweet.text.toUpperCase();
		//var textAux = tweet.text.replace('Macri',colors.bgRed('Macri'))
		var percen = 0;	
		//for (var ele in negative_words) {
		//	if (textUpper.indexOf(negative_words[ele].text.toUpperCase())>0) {
		//		percen += negative_words[ele].val;
		//		var textAux = textAux.replace(new RegExp(negative_words[ele].text, "ig"), colors.yellow(negative_words[ele].text));
		//	}
		//}
		var aux = textUpper.split(" ");
		for (var ele in aux){
			if (aux[ele].length > 4){
				cantWord = mapCountWords.get(aux[ele]);
				Buscar palabra en la BD y de ahi dedusco, ver si manejo sesiones de busquedas.
				if (typeof cantWord === "undefined"){
					cantWord = 0;
				}
				cantWord += 1
				mapCountWords.set(aux[ele], cantWord);
				if (cantWord > maxOcurrenceWord.occurrence && aux[ele] != 'ELECCIONES'){
					maxOcurrenceWord.occurrence = cantWord;
					maxOcurrenceWord.word = aux[ele];
				}
			}
		}
		percen = (percen > 100)?100:percen;
	
		canTweet++;
		cantNegative ++;
		if (percen >= 20 && percen < 60) {
			//console.log(colors.yellow.bold('Negative Attitude : %s \%'),percen);
		}else if (percen >= 60) {
			//console.log(colors.red.bold('Negative Attitude : %s \%'),percen);
		}else{
			cantNegative --;
			//console.log(colors.bold('Negative Attitude : %s \%'),percen);
		}
		console.log(colors.yellow.bold('Palabras analizadas : %s'),mapCountWords.size);
		console.log(colors.red.bold('Mayor ocurrencia : %s con %s repeticiones'),maxOcurrenceWord.word,maxOcurrenceWord.occurrence);
	});

	stream.on('error', function(error) {
		console.log(error);
	});
	stream.on('end', function() {
		console.log(colors.bold("\n\nTotal Tweets : %s"),canTweet);
		//console.log(colors.bold("Negative Tweets: %s"),cantNegative);
		var fs = require('fs');
		var name = './' + new Date().toISOString() + '.txt';
		//Init file
		fs.writeFileSync(name, "/*\n * Registro de actividad \n * " + initDate.toLocaleString() + " y " + new Date().toLocaleString() + "\n *\n*/\n\n", 'utf8');
		for (var [key, value] of mapCountWords) {
			console.log(key + " | " + value);
			//Add line to file
			fs.appendFileSync(name, key + " |x| " + value + "\n", 'utf8');
		}
	})
});

/* 
var params = {screen_name: 'nodejs'};
client.get('statuses/user_timeline', params, function(error, tweets, response) {
  if (!error) {
    console.log(tweets);
  }
});
*/
