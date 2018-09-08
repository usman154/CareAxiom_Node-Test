var request = require('request'),
    http = require('http'),
    port = 8080 || process.env.PORT,
    url = require('url'),
    fs  = require('fs'),
    path = require('path'),
    getTitle = require('./helpers/getTitle.module'),
    prepareResponse = require('./helpers/prepareResponse.module'),
    results = {},
    handler = function (error, body, url) {
        var match = getTitle(body);
        var title = "NO RESPONSE";
        if (match && match[2]) {
            title = match[2];
        }

        return { url: url, title: title }

    };

function makeResponse(resp) {
    return resp.reduce(function (map, obj) {
        map[obj.url] = { error: null, title: obj.title };

        return map;
    }, {});
}


function allPromises(urls) {
   return urls.map(url => {
        return new Promise((resolve, reject) => {
            request(url, (error, res, body) => {
               
                if (error)
                    reject(error)
                else
                    resolve(handler(error, body, url))
            })
        })
    })
}

http.createServer(function (req, res) {
    var url_parts = url.parse(req.url, true),
        pathname = url_parts.pathname,
        addressArray = url_parts.query.address;
    if (pathname == '/I/want/title/') {

        addressArray instanceof Array ? null : addressArray ? addressArray = [addressArray] : addressArray = [];

        if (addressArray.length == 0) {

            res.writeHead(200, { 'Content-type': 'text/html' });
            res.end("No URL Provided");
        }
        addressArray.forEach((part, index, link) => {

            link[index] = (link[index].indexOf('://') === -1) ? 'http://' + link[index] : link[index];
        });
        
        Promise.all(allPromises(addressArray)).then(results => {
            res.writeHead(200, { 'Content-type': 'text/html' });
            var html = prepareResponse(makeResponse(results));
            res.end(html);
        }).catch(error => {
            if (err) {
                res.writeHead(500, { 'Content-type': 'text/text' });
                res.end("Error occurred");
            }
        })

    } else {
        res.writeHead(200, {'Content-type' : 'text/html'});
        fs.createReadStream(path.join(path.join(__dirname,'helpers'),'404.html'), 'utf8' ).pipe(res)
    }

}).listen(port, () => {
    console.log(`Server listening on ${port}`)
});  
