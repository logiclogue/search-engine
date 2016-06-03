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
    this.explored = [];
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
        var url;

        if (toQueueUrl === undefined) {
            return;
        }

        match = toQueueUrl.match(/http(s?):\/\/[^/?:#]*/);

        if (match === null) {
            return;
        }

        url = match[0];

        if (match && this.explored.indexOf(url) === -1) {
            this.explored.push(url);
            this.crawler.queue(url);
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
