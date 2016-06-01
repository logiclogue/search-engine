var Crawler = require('crawler');


/*
 * Class which crawls the web.
 */
var Crawl = function () {
    var self = this;

    this.crawler = new Crawler({
        maxConnections: 10,
        callback: function (error, result, $) {
            var host = result.request.host;

            if ($ === undefined) {
                return;
            }

            self._found(host, $, function (explored) {
                console.log(explored);
                if (error || explored) {
                    return;
                }

                $('a').each(function (index, a) {
                    self._forEachLink(index, a, $);
                });
            });

        }
    });
};

(function (static_, proto_) {

    /*
     * User defined function that is called when a
     * website is found.
     */
    proto_.found = function () {

    };


    /*
     * For every link in the page find valid.
     */
    proto_._forEachLink = function (index, a, $) {
        var toQueueUrl = $(a).attr('href');
        var match;

        if (toQueueUrl === undefined) {
            return;
        }

        match = toQueueUrl.match(/http(s?):\/\/[^/?:#]*/);

        if (match === null) {
            return;
        }

        if (match) {
            this.crawler.queue(match[0]);
        }
    };

    /*
     * Main found method.
     */
    proto_._found = function (url, $, callback) {
        var title = $('title').html();
        var description = $('[name=description]').attr('content');

        if (this.found !== undefined) {
            this.found(url, title, description, callback);
        }
        else {
            callback(false);
        }
    };

}(Crawl, Crawl.prototype));

module.exports = Crawl;
