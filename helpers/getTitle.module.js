module.exports = function (str) {
    var re = /(<\s*title[^>]*>(.+?)<\s*\/\s*title)>/gi;
    return re.exec(str);
}