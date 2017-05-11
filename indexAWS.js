var http = require('http');
var server = http.createServer();
var Twitter = require('twitter');
 
var client = new Twitter({
	consumer_key: 'Vit5Ve23pMOUE5i4ffgdqC5Q8',
	consumer_secret: 'gfERQbOueGh1lnUuC9GZpz4mCWCP9pLytTpANt07LgKGY3mW8T',
	access_token_key: '2913998225-4CE9YwVvzLsOvkdriha6Iq3VgOp2Y62yXhPt4A6',
	access_token_secret: '8WojQhvFLOdarVc9a3o0v3SmDxFfz2qKolPrfkkiGWaem'
});
var express = require('express');
var app = express();
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
	maxOcurrenceWord = {'word': '', 'occurrence': 0},
	negative_words = [
			{ text: 'globoludos', val: 70 },
			{text: 'panamá', val: 50},
			{text: 'evadir', val:30},
			{text: 'pobreza', val:20},
			{text: 'FRACASO', val:40},
			{text: 'ESTAFA', val:40},
			{text: 'desocupación', val:40}			
	];
var posotive_words = ['fuerza'];

//var stdin = process.openStdin();
//var _stream ;
//stdin.addListener("data", function(d) {
//    // note:  d is an object, and when converted to a string it will
//    // end with a linefeed.  so we (rather crudely) account for that  
//    // with toString() and then trim()
//	if (d.toString().trim()=='q') {
//        _stream.destroy();
//    }
//    //console.log("you entered: [" + d.toString().trim() + "]");
//  });

//client.stream('statuses/filter', {track: 'elecciones', location: 'Argentina', attitude: true},  function(stream) {
//	_stream = stream;
//	stream.on('data', function(tweet) {
//		var createdAt = new Date(tweet.created_at);
//		var source = '';
//		if (tweet.source) {
//            source = tweet.source.split('>');
//			source = source[1].split('<');
//			//console.log(colors.bold(source[0]));
//			source = " - " +colors.cyan.bold(source[0]);
//        }
//		
//		if (tweet.place) {
//            console.log(colors.bgMagenta.bold(tweet.user.screen_name + " - " + tweet.place.name) + " - " + colors.green(createdAt.toLocaleString()) + source);
//        }else{
//			console.log(colors.bgMagenta.bold(tweet.user.screen_name) + " - " + colors.green(createdAt.toLocaleString()) + source);
//		}
//		
//		var textUpper = tweet.text.toUpperCase();
//		var textAux = tweet.text.replace('Macri',colors.bgRed('Macri'))
//		var percen = 0;	
//		//for (var ele in negative_words) {
//		//	if (textUpper.indexOf(negative_words[ele].text.toUpperCase())>0) {
//		//		percen += negative_words[ele].val;
//		//		var textAux = textAux.replace(new RegExp(negative_words[ele].text, "ig"), colors.yellow(negative_words[ele].text));
//		//	}
//		//}
//		var aux = textUpper.split(" ");
//		for (ele in aux){
//			if (aux[ele].length > 4){
//				cantWord = mapCountWords.get(aux[ele]);
//				if (typeof cantWord === "undefined"){
//					cantWord = 0;
//				}
//				cantWord += 1
//				mapCountWords.set(aux[ele], cantWord);
//				if (cantWord > maxOcurrenceWord.occurrence && aux[ele] != 'ELECCIONES'){
//					maxOcurrenceWord.occurrence = cantWord;
//					maxOcurrenceWord.word = aux[ele];
//				}
//			}
//		}
//		percen = (percen > 100)?100:percen;
//	
//		canTweet++;
//		cantNegative ++;
//		if (percen >= 20 && percen < 60) {
//			//console.log(colors.yellow.bold('Negative Attitude : %s \%'),percen);
//		}else if (percen >= 60) {
//			//console.log(colors.red.bold('Negative Attitude : %s \%'),percen);
//		}else{
//			cantNegative --;
//			//console.log(colors.bold('Negative Attitude : %s \%'),percen);
//		}
//		console.log(colors.yellow.bold('Palabras analizadas : %s'),mapCountWords.size);
//		console.log(colors.red.bold('Mayor ocurrencia : %s con %s repeticiones'),maxOcurrenceWord.word,maxOcurrenceWord.occurrence);
//	});
//
//	stream.on('error', function(error) {
//		console.log(error);
//	});
//	stream.on('end', function() {
//		console.log("");
//		console.log("");
//		console.log(colors.bold("Total Tweets : %s"),canTweet);
//		console.log(colors.bold("Negative Tweets: %s"),cantNegative);
//		var fs = require('fs');
//		var name = './' + new Date().toISOString() + '.txt';
//		fs.writeFileSync(name, "/*\n * Registro de actividad \n * " + initDate.toLocaleString() + " y " + new Date().toLocaleString() + "\n *\n*/\n\n", 'utf8');
//		for (var [key, value] of mapCountWords) {
//			console.log(key + " | " + value);
//			fs.appendFileSync(name, key + " |x| " + value + "\n", 'utf8');
//			//fs.writeFileSync(name, key + " | " + value, 'utf8');
//		}
//		//fs.writeFileSync(name, key + " | " + value, 'utf8');
//		
//		//fs.writeFile('./file2.txt', 'Hola Mundo', function(err) {
//		//	if( err ){
//		//		console.log( err );
//		//	}
//		//	else{
//		//		console.log('Se ha escrito correctamente');
//		//	}
//		//});		
//	})
//});

/* 
var params = {screen_name: 'nodejs'};
client.get('statuses/user_timeline', params, function(error, tweets, response) {
  if (!error) {
    console.log(tweets);
  }
});
*/

// respond with "hello world" when a GET request is made to the homepage
app.get('/', function(req, res) {
  res.send('hello world');
});
let port = 65080;
app.listen(port);
console.log("REST API listening on port: " + port);
////server.listen(8080, null, null, function() {
////    console.log('User ID:',process.getuid()+', Group ID:',process.getgid());
////    //drop_root();
////    console.log('User ID:',process.getuid()+', Group ID:',process.getgid());
////});
