var Twitter = require('twitter'),
	colors = require('colors'),
	client = new Twitter({
		consumer_key: 'Vit5Ve23pMOUE5i4ffgdqC5Q8',
		consumer_secret: 'gfERQbOueGh1lnUuC9GZpz4mCWCP9pLytTpANt07LgKGY3mW8T',
		access_token_key: '2913998225-4CE9YwVvzLsOvkdriha6Iq3VgOp2Y62yXhPt4A6',
		access_token_secret: '8WojQhvFLOdarVc9a3o0v3SmDxFfz2qKolPrfkkiGWaem'
	}),
	canTweet = 0,
	_io;
var User = require('../model/user.js').User,
	Tweet = require('../model/tweet.js').Tweet,
	Word = require('../model/word.js').Word;

client.stream('statuses/filter', {track: 'macri', location: 'Argentina', 
attitude: true}, function(stream) {
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
		Tweet.create({
				_id			: tweet.id,
				created_at	: tweet.created_at,
				text		: tweet.text,
				source		: source,
				//_words		: [{ type: Schema.Types.ObjectId, ref: 'Word' }],
				geo			: tweet.geo,
				coordinates	: tweet.coordinates,
				place		: tweet.place,
				hashtags	: tweet.hashtags
			}, function (err, _tweet) {
				if (err) {console.log(err);return;}
				User.findOne({ _id: tweet.user.id }, (err,us)=>{
					if (!us){
						User.create({
								_id			: tweet.user.id,
								name		: tweet.user.name,
								screen_name	: tweet.user.screen_name,
								location	: tweet.user.location,
								json		: tweet.user
							}, function (err, _user) {
								if (err) {
									console.log(err);
									return;
								}
								// saved!
								console.log("New user : " + _user._id);
								_tweet.user = _user;
								_tweet.save();
						});				
					}else{
						console.log("Exists user : " + us._id);
						_tweet.user = us;
						_tweet.save();
					}
					
				});
			}
		);
		if (tweet.place) {
			console.log(colors.bgMagenta.bold(tweet.user.screen_name + " - " + tweet.place.name) + " - " + colors.green(createdAt.toLocaleString()) + source);
		}else{
			console.log(colors.bgMagenta.bold(tweet.user.screen_name) + " - " + colors.green(createdAt.toLocaleString()) + source);
		}
		_io.emit('broadcasting', tweet);		
	});

	stream.on('error', function(error) {
		console.log(error);
	});
	stream.on('end', function() {
		console.log(colors.bold("\n\nFinish stream with %s tweets"),canTweet);
	});
});
module.exports = function(io,app) {
	_io = io;
    /* 
     * @Method: GET
     * @Description: Lista las personas.
    */
    app.get('/api/info', function(req, res) {
        console.log("GET List Personas");
        //Person.find(function(err, persons) {
        //    if(err) {
        //        console.log("List Personas ERROR");
        //        res.send(err);
        //    }
        //    console.log("List Personas"+persons);
        //    res.json(persons);
        //});
    });
}
