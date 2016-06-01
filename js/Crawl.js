var Crawler = require('crawler');


/*
 * Class which crawls the web.
 */
var Crawl = function () {
    var self = this;

    this.explored = [];
    this.crawler = new Crawler({
        maxConnections: 10,
        callback: function (error, result, $) {
            var host = result.request.host;

            self._found(host, $);

            if (error || $ === undefined) {
                return;
            }

            $('a').each(function (index, a) {
                self._forEachLink(index, a, $);
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
        var description = $('[name=description]').attr('content');
        var title = $('title');
        var url;
        var match;

        if (title !== undefined) {
            title = title.html();
        }

        if (toQueueUrl === undefined) {
            return;
        }

        match = toQueueUrl.match(/http(s?):\/\/[^/?:#]*/);

        if (match === null) {
            return;
        }

        url = match[0];

        if (match) {
            if (this.explored.indexOf(url) === -1) {
                this.crawler.queue(url);
            }
        }
    };

    /*
     * Main found method.
     */
    proto_._found = function (url, $) {
        var title = $('title').html();
        var description = $('[name=description]').attr('content');

        this.explored.push(url);

        if (this.found !== undefined) {
            this.found(url, title, description);
        }
    };

}(Crawl, Crawl.prototype));

module.exports = Crawl;
