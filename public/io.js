(function() {
    console.log('socket.io starting...');
    var _socket = io(),
        total = 0, geo = 0;
    console.log('socket.io connecting...');
    _socket.on('connect', function () {
        console.log('socket.io connect success...');
        _socket.emit('getDataBroadcasting', '', function (data) {
            console.log(data); 
        });
        _socket.on('broadcasting', function (data) {
            console.log(data);
            $('#tweetsContent').prepend('<div class="tweet">'+data.text+'</div>');
            total++;
            let location = false;
            if (data.geo){
                console.log(data.geo);
                location = true;
            }
            if (data.place){
                console.log(data.place);
                location = true;
            }
            if (!location){
                geo++;
                $('#totalTweet').html(geo+"/"+total);
                //console.log()
                $.get("http://nominatim.openstreetmap.org/search/"+data.user.location+"?format=json&addressdetails=1&limit=1&polygon_svg=1", function(data){
                    if (data.length){
                        $.Map.addFeature(data[0].lon,data[0].lat);
                    }
                    //console.log(data);
                });
            }
        });
    });
})();