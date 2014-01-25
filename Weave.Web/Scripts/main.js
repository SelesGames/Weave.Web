/* dataservices */
var ds = {
    api: '//weave-user.cloudapp.net/api',
    userId: '0d13bf82-0f14-475f-9725-f97e5a123d5a',
    getUserInfo: function (success) {
        this.get('/user/info',
            {
                userId: ds.userId,
                refresh: true
            },
            success,
            function (err) {
                log('getUserInfo error' + err.statusText);
                log(err);
            });
    },
    lastNewsArg: null,
    getUserNews: function (categoryId, entry, skip, take, type, req, success) {

        this.lastNewsArg = {
            userId: ds.userId,
            category: categoryId,
            entry: entry,
            skip: skip,
            take: take,
            type: type,
            requireImage: req
        };

        this.get('/user/news',
            this.lastNewsArg,
            success,
            function (err) {
                log('getUserNews error' + err.statusText);
                log(err);
            });
    },
    getUserNewsByFeedId: function (feedId, entry, skip, take, type, req, success) {

        this.lastNewsArg = {
            userId: ds.userId,
            FeedId: feedId,
            entry: entry,
            skip: skip,
            take: take,
            type: type,
            requireImage: req
        };

        this.get('/user/news',
            this.lastNewsArg,
            success,
            function (err) {
                log('getUserNews error' + err.statusText);
                log(err);
            });
    },
    get: function (func, arg, success, error) {
        $.ajax({
            dataType: 'json',
            url: ds.api + func,
            data: arg,
            success: success,
            error: error,
            cache: false,
            beforeSend: function (jqXHR) {
                jqXHR.setRequestHeader('Accept', 'application/json');
                //jqXHR.setRequestHeader('Accept-Encoding', 'gzip,deflate,sdch');
            },
            complete: function (jqXHR, textStatus) {
                log(textStatus);
                log(jqXHR.status);
                //log(jqXHR.responseText);
            }
        });
        
    },
    getTest: function () {
        $('#getTest').html('get XMLHttpRequest Test');
        // debug IE or not
        var http = window.XDomainRequest ? new window.XDomainRequest() :  new XMLHttpRequest();
        http.open("GET", "http://weave-user.cloudapp.net/api/user/info?userId=0d13bf82-0f14-475f-9725-f97e5a123d5a&refresh=True&callback=call", true);
        http.setRequestHeader("Accept", "application/json");
        //http.setRequestHeader("Accept-Encoding", "gzip,deflate,sdch");
        http.onreadystatechange = function (xmlhttp) {
            if (xmlhttp.readyState == 4 && xmlhttp.status == 200)
                $('#getTest').html('get XMLHttpRequest Test success ' + JSON.stringify(xmlhttp));
            else
                $('#getTest').html('get XMLHttpRequest Test error ' + JSON.stringify(xmlhttp));
        };
        http.send();
    },
    post: function (func, arg, success, error) {

    }
};

function log(obj) {
    if (typeof console !== 'undefined') {
        if (typeof obj === 'string')
            console.log(obj);
        else if (typeof console.dir !== 'undefined')
            console.dir(obj);
    }
}

function getFeedCategories(userInfo) {
    var feedCategories = [];
    for (var i = 0, len = userInfo.Feeds.length; i < len; i++) {
        var feed = userInfo.Feeds[i];
        if (typeof feed.Category != 'undefined' && - 1 == feedCategories.indexOf(feed.Category))
            feedCategories.push(feed.Category);
    }
    return feedCategories;
}

function getFeeds(userInfo, category) {
    var feedVMs = [];
    for (var i = 0, len = userInfo.Feeds.length; i < len; i++) {
        var feed = userInfo.Feeds[i];
        if (category === feed.Category)
            feedVMs.push({Name: feed.Name, Id : feed.Id });
    }
    return feedVMs;
}

var modes = { all: 'all', category: 'category', feed: 'feed' };

/* knockoutjs */
var vm = {
    categories: ko.observableArray(),
    // latest, cat, or feed specific
    news: ko.observableArray(),
    mode: modes.category,
    getNewsForCategory: function (categoryVM) {
        this.mode = modes.category;
        //24 12 on screen 12 off
        ds.getUserNews(categoryVM.Name, 'Mark', 0, 24, 1, false,
        function (data) {
            log('getUserNews for category ' + categoryVM.Name);
            log(data);
            vm.news.removeAll();
            for (var n = 0, nlen = data.News.length; n < nlen; n++) {
                var news = data.News[n];
                var newsVM = {
                    Id: news.Id,
                    Title: news.Title,
                    ImageUrl: news.ImageUrl,
                    HasImage: typeof news.ImageUrl != 'undefined'
                };
                vm.news.push(newsVM);
            }
        });
    },
    getUserNewsByFeedId: function (feed) {
        this.mode = modes.feed;
        ds.getUserNewsByFeedId(feed.Id, 'Mark', 0, 24, 1, false,
        function (data) {
            log('getNewsByFeed Id success' + feed.Id);
            log(data);
            vm.news.removeAll();
            for (var n = 0, nlen = data.News.length; n < nlen; n++) {
                var news = data.News[n];
                var newsVM = {
                    Id: news.Id,
                    Title: news.Title,
                    ImageUrl: news.ImageUrl,
                    HasImage: typeof news.ImageUrl != 'undefined'
                };
                vm.news.push(newsVM);
            }
        });
    },
    displayNewsInfo: function(news){
        alert('displayNewsInfo in pop window  doc ' + news.Title);

    },
    scrollRemoveNews: function (news) {
        this.news.remove(news);
    },
    scrollAppendNews: function () {
        // load 12 more
        if(vm.mode == modes.category){
            ds.getUserNews(ds.lastNewsArg.category, ds.lastNewsArg.entry, ds.lastNewsArg.skip + ds.lastNewsArg.take, ds.lastNewsArg.take, ds.lastNewsArg.type,
            function (data) {
                log('scrollAppendNews');
                log(data);
                //for (var n = 0, nlen = data.News.length; n < nlen; n++) {
                //    var news = data.News[n];
                //    var newsVM = {
                //        Id: news.Id,
                //        Title: news.Title,
                //        ImageUrl: news.ImageUrl,
                //        HasImage: typeof news.ImageUrl != 'undefined'
                //    };
                //    this.news.push(newsVM);
                //}
            });
        }
        else if (this.mode == modes.feed) {

        }
        else if (this.mode == modes.all) {

        }
    }
}

$(function () {

    // init
    ko.applyBindings(vm);
    ds.getUserInfo(function (userInfo) {

        var s = new Date().getTime();
        //log('getUserInfo ' + s);
        //log('Feed Categories' + new Date());
        var categories = getFeedCategories(userInfo);
        for (var c = 0, clen = categories.length; c < clen; c++) {
            //log(categories[c]);
            var categoryVM = {
                Name: categories[c],
                Feeds: []
            };
            var feeds = getFeeds(userInfo, categories[c]);
            for (var f = 0, flen = feeds.length; f < flen; f++) {
                //log('     ' + feeds[f]);
                log(feeds[f]);
                categoryVM.Feeds.push(feeds[f]);
            }
            vm.categories.push(categoryVM);
        }

        //log('Latest News');
        for (var n = 0, nlen = userInfo.LatestNews.length; n < nlen; n++) {
            var news = userInfo.LatestNews[n];
            //log(news.Id);
            //log(news.Title);
            //log('     ImageUrl ' + news.ImageUrl);
            //log(news);
            var newsVM = {
                Id: news.Id,
                Title: news.Title,
                ImageUrl: news.ImageUrl
            };
            vm.news.push(newsVM);
        }

        //log('userInfo ' + (new Date().getTime() - s));
        log(userInfo);
    });

    
    var lastY = 0;
    var lastLoadPositiveY = 0;
    var skip = 0;
    var take = 12;
    var total = 0;
    $('#content').scroll(function(evt) {

        var height = window.innerHeight;
        var curY = $(this).scrollTop();
        var DOWN = 'down', UP = 'up';
        var direction = curY > lastY ? DOWN : UP;
        lastY = curY;
        
        var contentDelta = curY - window.innerHeight;
        var loadPosDelta = height / 4;
        var bLoadPositive = contentDelta > loadPosDelta;

        log('vm.mode ' + vm.mode + ' content scrolled total height ' + height + ' scrollTop() ' + curY + ' direction ' + direction
            + ' contentDelta ' + contentDelta + ' bLoadPositive ' + bLoadPositive + ' loadPosDelta ' + loadPosDelta);

        if (bLoadPositive) {
            if (lastLoadPositiveY >= 3 * loadPosDelta) {
                lastLoadPositiveY = 0;
                log('load positive');

                // remove the first 12
                vm.news.splice(0, 11);
                // append new 12
                vm.scrollAppendNews();

                skip += total;
            }
            else {
                log('load positive skipped');
                lastLoadPositiveY += loadPosDelta;
            }
        }
        else {
            // TODO delta logic
            // if direction
            // fetch previous 12
            // remove/splice last 12
        }
      
    
    });


    // tests
    //ds.getUserNews('Gaming', 'Mark', 0, 20, 1, false,
    //    function (data) {
    //        log('getUserNews');
    //        //$('#getUserNews').html('getUserNews success ' + JSON.stringify(data));
    //        log(data);
    //    });
    //ds.getUserNews('Gaming', 'Peek', 20, 20, 1, false);
    //ds.getUserNews('Gaming', 'Peek', 40, 20, 1, false);

});
