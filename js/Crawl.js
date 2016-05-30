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

        if (title !== undefined) {
            title = title.html();
        }

        if (toQueueUrl === undefined) {
            return;
        }

        var match = toQueueUrl.match(/http(s?):\/\/[^/?:#]*/);

        if (match) {
            if (this.explored.indexOf(match[0]) === -1) {
                this._found(match[0], title, description);
            }
        }
    };

    /*
     * Main found method.
     */
    proto_._found = function (url, title, description) {
        this.explored.push(url);
        this.crawler.queue(url);

        if (this.found !== undefined) {
            this.found(url, title, description);
        }
    };

}(Crawl, Crawl.prototype));

module.exports = Crawl;
