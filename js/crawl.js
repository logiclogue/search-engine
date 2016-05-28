var Crawler = require('crawler');

var explored = [];


module.exports = new Crawler({
    maxConnections: 10,
    callback: function (error, result, $) {
        if (error || $ === undefined) {
            return;
        }

        $('a').each(function (index, a) {
            forEachLink(index, a, $);
        });
    }
});

var forEachLink = function (index, a, $) {
    var toQueueUrl = $(a).attr('href');

    if (toQueueUrl === undefined) {
        return;
    }

    var match = toQueueUrl.match(/http(s?):\/\/[^/?:#]*/);

    if (match) {
        if (explored.indexOf(match[0]) === -1) {
            explored.push(match[0]);
            console.log(match[0]);
            crawler.queue(match[0]);
        }
    }
};
