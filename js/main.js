function log (obj) {
    if (typeof console !== 'undefined') {
        if (typeof obj === 'string')
            console.log(obj);
        else if(typeof console.dir !== 'undefined')
            console.dir(obj);
    }
}

/* dataservices */
var ds = {
    api: '//weave-user.cloudapp.net/api',
    userId: '0d13bf82-0f14-475f-9725-f97e5a123d5a',
    getUserInfo: function () {
        $('#getUserInfo').html('getUserInfo');
        this.get('/user/info',
            {
                userId: ds.userId,
                refresh: true
            },
            function (data) {
                $('#getUserInfo').html('getUserInfo success ' + JSON.stringify(data));
                log(data);
            },
            function (err) {
                $('#getUserInfo').html('getUserInfo error ' + JSON.stringify(err));
                log(err);
            });
    },
    getUserNews: function (category, entry, skip, take, type, req) {
        $('#getUserNews').html('getUserNews');
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
                $('#getUserNews').html('getUserNews success ' + JSON.stringify(data));
                log(data);
            },
            function (err) {
                $('#getUserNews').html('getUserNews error ' + JSON.stringify(err));
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
                log(jqXHR.responseText);
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

$(function () {
    
    // tests
    ds.getTest();
    ds.getUserInfo();
    ds.getUserNews('Gaming', 'Mark', 0, 20, 1, false);
    //ds.getUserNews('Gaming', 'Peek', 20, 20, 1, false);
    //ds.getUserNews('Gaming', 'Peek', 40, 20, 1, false);

});


/* knockoutjs */
function MainViewModel() {
    
}

$(function () {
    ko.applyBindings(new MainViewModel());
});


