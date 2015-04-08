/**
 * Created by xirri_000 on 4/4/2015.
 */


    // market groups
    // http://public-crest.eveonline.com/market/groups/

    // market types by group
    // http://public-crest.eveonline.com/market/types/?group=http://public-crest.eveonline.com/market/groups/7/

    // regions

    // metropolis
    // http://public-crest.eveonline.com/regions/10000042/

var https = require('https');
var http = require('http');
var url = require('url');

var session = require('express-session');

exports.getRegions = function getRegions(sess, callback){
    console.log("Connecting to CREST...");
    var options = {
        host : 'crest-tq.eveonline.com',
        path : '/regions/',
        headers: {
            'Authorization' : 'Bearer ' + sess.access_token
        }
    };
    if(sess.access_token){
        console.log("authenticated crest");
    }
    https.request(options, function parseItemGroups(crestResponse){
        console.log("Regions CREST response received.");
        // console.log("received: " + crestResponse);
        var crestData = '';
        crestResponse.on('data', function (chunk) {
            crestData += chunk;
        });
        crestResponse.on('end', function () {
            var parsedData = JSON.parse(crestData)
            callback(parsedData);
        });
    }).end();
}

exports.getRegion = function getRegion(sess, name, callback){
    exports.getRegions(sess, function(regions){
        for(var i=0, len=regions['items'].length; i<len; ++i){
            var r = regions['items'][i];
            if(name === r['name']){

                console.log("Connecting to CREST..." + r['href']);
                var parsedUrl = url.parse(r['href']);
                var options = {
                    host : parsedUrl['hostname'],
                    path : parsedUrl['path'],
                    headers: {
                        'Authorization' : 'Bearer ' + sess.access_token
                    }
                };
                if(sess.access_token){
                    console.log("authenticated crest");
                }
                https.request(options, function parseItemGroups(crestResponse){
                    console.log("Regions CREST response received.");
                    // console.log("received: " + crestResponse);
                    var crestData = '';
                    crestResponse.on('data', function (chunk) {
                        crestData += chunk;
                    });
                    crestResponse.on('end', function () {
                        var parsedData = JSON.parse(crestData)
                        callback(parsedData);
                    });
                }).end();
                break;
            }
        }
    });
}


exports.getItemGroups = function getItemGroups(sess, callback){
        console.log("Connecting to CREST...");
        var options = {
            // host : 'public-crest.eveonline.com',
            host : 'crest-tq.eveonline.com',
            path : '/inventory/groups/',
            headers: {
                'Authorization' : 'Bearer ' + sess.access_token
                // 'Content-Type'  : 'application/vnd.ccp.eve.MarketOrderCollection-v1+json'
            }
        };
        if(sess.access_token){
            console.log("authenticated crest");
            options['Authorization'] = 'Bearer ' + sess.access_token;
        }
        https.request(options, function parseItemGroups(crestResponse){
            console.log("Item groups CREST response received.");
            // console.log("received: " + crestResponse);
            var crestData = '';
            crestResponse.on('data', function (chunk) {
                crestData += chunk;
            });
            crestResponse.on('end', function () {
                callback(JSON.parse(crestData));
            });
        }).end();
}

exports.getBuyOrders = function getBuyOrders(sess, region, type, callback){
    console.log("Connecting to CREST buy orders for region " + region['name']);
    console.log('with URL ' + region['marketBuyOrders']['href']);

    var parsedUrl = url.parse(region['marketBuyOrders']['href']);
    var requestPath = parsedUrl['path'] + "?type=" + parsedUrl['protocol'] + "//" + parsedUrl['hostname'] + "/types/34/";
    console.log('request path: ' + requestPath);

    var options = {
        host : parsedUrl['hostname'],
        path : requestPath,
        headers: {
            'Authorization' : 'Bearer ' + sess.access_token
        }
    };
    if(sess.access_token){
        console.log("authenticated crest");
    }
    https.request(options, function parseOrders(crestResponse){
        console.log("Buy orders CREST response received.");
        var crestData = '';
        crestResponse.on('data', function (chunk) {
            crestData += chunk;
        });
        crestResponse.on('end', function () {
            if(crestData != '') {
                var parsedData = JSON.parse(crestData);
                if (!parsedData['exceptionType']) {
                    // console.log(crestData);
                    callback(parsedData);
                }
                else{
                    console.log(crestData);
                }
            }
            else{
                console.log("buy orders: received empty list.")
            }
        });
    }).end();
}

exports.getCharacterFromToken = function getCharacterFromToken(sess, callback){
    console.log("Connecting to CREST token decode");
    var options = {
        host : 'login.eveonline.com',
        path : '/oauth/verify/',
        headers: {
            'Authorization' : 'Bearer ' + sess.access_token
        }
    };
    if(sess.access_token){
        console.log("authenticated crest with " + sess.access_token);
    }
    https.request(options, function parseOrders(crestResponse){
        console.log("Login verification:");
        var crestData = '';
        crestResponse.on('data', function (chunk) {
            crestData += chunk;
        });
        crestResponse.on('end', function () {
            var parsedData = JSON.parse(crestData);
            if(!parsedData['exceptionType']){
                // console.log(crestData);
                callback(parsedData);
            }
        });
    }).end();
}
