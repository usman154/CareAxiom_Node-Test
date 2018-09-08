module.exports = function(responses){
    var titles = "";
            for (var url in responses) {
                titles += `<li>${url} - ${responses[url].title}</li>`
            }
            var html = `<html>
            <head></head>
            <body style="display: inline-block; margin-left:30%">
            
                <h1 style="font-family:monospace"> Following are the titles of given websites: </h1>
            
                <ul style="font-family:monospace">
                    ${titles}
                </ul>
            </body>
            </html>`

            return html;
}