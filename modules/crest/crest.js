/**
 * Created by xirri_000 on 4/4/2015.
 */

var http = require('http');

exports.getItemGroups = function getItemGroups(callback){
        console.log("Connecting to CREST...");
        var options = {
            host : 'public-crest.eveonline.com',
            path : '/inventory/groups/'
        };
        http.request(options, function parseItemGroups(crestResponse){
            console.log("CREST response received.");
            console.log("received: " + crestResponse);
            var crestData = '';
            crestResponse.on('data', function (chunk) {
                crestData += chunk;
            });
            crestResponse.on('end', function () {
                callback(JSON.parse(crestData));
            });
        }).end();
}
