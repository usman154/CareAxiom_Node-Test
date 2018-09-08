var request = require('request'),
    http = require('http'),
    port = 8080 || process.env.PORT,
    url = require('url'),
    fs  = require('fs'),
    path = require('path'),
    getTitle = require('./helpers/getTitle.module'),
    prepareResponse = require('./helpers/prepareResponse.module'),
    __request = function (urls, callback) {

        'use strict';

        var results = {}, t = urls.length, c = 0,
            handler = function (error, response, body) {
                var url = urls[c];
                
                var match = getTitle(body);
                var title = "NO RESPONSE";
                if (match && match[2]) {
                    title = match[2];
                }
                results[url] = { error: error, title: title };

                if (++c === urls.length) { callback(results); }

            };


        while (t--) { request(urls[t], handler); }
    };

http.createServer(function (req, res) {
    var url_parts = url.parse(req.url, true),
        pathname = url_parts.pathname,
        addressArray = url_parts.query.address;
    if (pathname == '/I/want/title/') {

        addressArray instanceof Array ? null : addressArray ? addressArray = [addressArray]: addressArray = [];
         
        if(addressArray.length == 0){
             
            res.writeHead(200, { 'Content-type': 'text/html' });
            res.end("No URL Provided");
        }
        addressArray.forEach((part, index, link) => {

            link[index] = (link[index].indexOf('://') === -1) ? 'http://' + link[index] : link[index];
        })
        __request(addressArray, function (responses) {
            res.writeHead(200, { 'Content-type': 'text/html' });
            console.log(responses)
             var html = prepareResponse(responses);
            res.end(html);
        });

    } else {
        res.writeHead(200, {'Content-type' : 'text/html'});
        fs.createReadStream(path.join(path.join(__dirname,'helpers'),'404.html'), 'utf8' ).pipe(res)
    }

}).listen(port, () => {
    console.log(`Server listening on ${port}`)
});  
