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
    getUserNews: function (category, entry, skip, take, type, req) {
        this.get('/user/news',
            {
                userId: ds.userId,
                category: category,
                entry: entry,
                skip: skip,
                take: take,
                type: type,
                requireImage: req
            },
            function (data) {
                log('getUserNews');
                //$('#getUserNews').html('getUserNews success ' + JSON.stringify(data));
                log(data);
            },
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
    var sort = [];
    for (var i = 0, len = userInfo.Feeds.length; i < len; i++) {
        var feed = userInfo.Feeds[i];
        if (category === feed.Category)
            sort.push(feed.Name);
    }
    return sort;
}

/* knockoutjs */
var navVM = {
    categories: ko.observableArray()
}

$(function () {

    // init
    ko.applyBindings(navVM);
    ds.getUserInfo(function (userInfo) {
        log('getUserInfo');
        log('Feed Categories');
        var categories = getFeedCategories(userInfo);
        for (var c = 0, clen = categories.length; c < clen; c++) {
            log(categories[c]);
            var categoryVM = {
                Name: categories[c],
                Feeds: []
            };
            var feeds = getFeeds(userInfo, categories[c]);
            for (var f = 0, flen = feeds.length; f < flen; f++) {
                log('     ' + feeds[f]);
                categoryVM.Feeds.push(feeds[f]);
            }
            navVM.categories.push(categoryVM);
        }
        log(userInfo);
    });


    // tests
    //ds.getUserNews('Gaming', 'Mark', 0, 20, 1, false);
    //ds.getUserNews('Gaming', 'Peek', 20, 20, 1, false);
    //ds.getUserNews('Gaming', 'Peek', 40, 20, 1, false);

});
