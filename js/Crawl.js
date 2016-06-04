var Crawler = require('crawler');
var database = require('./database.js');


/*
 * Class which crawls the web.
 */
var Crawl = function () {
    var self = this;

    this.crawler = new Crawler({
        maxConnections: 10,
        callback: self.init.bind(self)
    });
};

(function (static_, proto_) {

    /*
     * Init method that is called by the crawler when
     * a new site is being crawled. Called for each
     * site.
     */
    proto_.init = function (error, result, $) {
        var host = result.request.host;
        var title;
        var description;

        // Return if blank page.
        if ($ === undefined) {
            return;
        }

        title = $('title').html();
        description = $('[name=description]').attr('content');

        this.insert(host, title, description);

        $('a').each(function (index, a) {
            this.forEachLink(index, a, $);
        }.bind(this));
    };

    /*
     * For every link in the page find valid.
     */
    proto_.forEachLink = function (index, a, $) {
        var toQueueUrl = $(a).attr('href');
        var url;
        var host;

        if (toQueueUrl === undefined) {
            return;
        }

        match = toQueueUrl.match(/http(s?):\/\/[^/?:#]*/);

        if (match === null) {
            return;
        }

        url = match[0];
        host = match[0].split('//')[1];

        this.test(host, function (inserted) {
            if (!inserted) {
                console.log(host);
                this.crawler.queue(url);
            }
        }.bind(this));
    };

    /*
     * Method that is called when a website has been
     * found. Checks to see if it is in the database.
     */
    proto_.test = function (url, callback) {
        database.connection.query('SELECT COUNT(url) as count FROM websites WHERE url = ? LIMIT 1', url, function (err, rows) {
            callback(rows[0].count === 1);

            this.insert(url);
        }.bind(this));
    };

    /*
     * If the website hasn't been found before. Its
     * info is.testd in the database.
     */
    proto_.insert = function (url, title, description) {
        database.connection.query('INSERT INTO websites (url, title, description) VALUES (?, ?, ?)', [url, title, description], function (err) {
            if (err) {
                return;
            }
        });
    };

}(Crawl, Crawl.prototype));

module.exports = Crawl;
