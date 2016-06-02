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
        var title = $('title').html();
        var description = $('[name=description]').attr('content');

        // Return if blank page.
        if ($ === undefined) {
            return;
        }

        this.test(host, title, description);

        $('a').each(function (index, a) {
            this.forEachLink(index, a, $);
        }.bind(this));
    };

    /*
     * For every link in the page find valid.
     */
    proto_.forEachLink = function (index, a, $) {
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
     * Method that is called when a website has been
     * found. Checks to see if it is in the database.
     */
    proto_.test = function (url, title, description) {
        database.connection.query('SELECT url FROM websites WHERE url = ? LIMIT 1', url, function (err, rows) {
            var inserted = rows.length === 1;

            if (!inserted) {
                this.insert(url, title, description);
            }
        }.bind(this));
        
        console.log(url, title, description);
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
