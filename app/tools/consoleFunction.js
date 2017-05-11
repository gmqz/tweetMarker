var stdin = process.openStdin();
var _stream ;
var colors = require('colors')
stdin.addListener("data", function(d) {
    // note:  d is an object, and when converted to a string it will
    // end with a linefeed.  so we (rather crudely) account for that  
    // with toString() and then trim()
    if (d.toString().trim() == 'q') {
        _stream.destroy();
    }
    if (d.toString().trim() == 'c'){
        Tweet.count({}, function(err, c) {
            console.log('Tweet count : ' + c);
        });
        User.count({}, function(err, c) {
            console.log('User count : ' + c);
       });		
    }
    if (d.toString().trim() == 'tt'){
        Tweet.remove({}, function(err, res) {
            if (err) {
                console.log(err);
            } else {
                console.log('Delete tweets success');
            }
        });
    }
    if (d.toString().trim() == 'tu'){
        User.remove({}, function(err, res) {
            if (err) {
                console.log(err);
            } else {
                console.log('Delete users success');
            }
        });	
    }
    if (d.toString().trim() == 'vlu'){
        User.findOne({}).populate('_tweets').exec(function(err, user) {
            if (err) {
                console.log(err);
            } else {
                console.log(colors.red.bold('User : %s'),user.id);
                Tweet.find({'user':user.id},function(err,tweet){
                    if (err){console.log(err);return;}
                    console.log( tweet );
                });
            }			
        });			
    }
    if (d.toString().trim() == 'vlt'){
        Tweet.findOne({}).populate('user').exec(function(err, tweet) {
            if (err) {
                console.log(err);
            } else {
                console.log(colors.red.bold('Tweet : %s'),tweet.id);
                console.log( tweet );
                console.log( tweet.user.name );
            }			
        });			
    }
    //console.log("you entered: [" + d.toString().trim() + "]");
});