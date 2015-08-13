var request = require("request");
var cheerio = require('cheerio'); //*[@id="identify_yourself_flow"]/input

var headers = {
    'pragma': 'no-cache',
    'accept-encoding': 'deflate',
    'accept-language': 'en,en-US;q=0.8',
    'upgrade-insecure-requests': 1,
    'user-agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_10_4) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/44.0.2403.130 Safari/537.36',
    'accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',
    'cache-control': 'no-cache'

};

request.get({
        url: "https://www.facebook.com/login/identify?ctx=recover",
        headers: headers
    },
    function (err, res, body) {
        if (err) {
            return console.error("first request", err);
        }
        //console.log("res1", res);
        $ = cheerio.load(body);

        var lsd;
        $('input').each(function (i, input) {
            //console.log($(this).attr('name') + ': ' + $(this).attr('value'));

            if ($(this).attr('name') === 'lsd') {
                lsd = $(this).attr('value');
            }
        });


        var cookie = res.headers["Set-Cookie"]
        if (cookie) {
            cookie = (cookie + "").split(";").shift()
            set(opts.headers, "Cookie", cookie)
        }
        //console.log(lsd);
        headers.Cookie = cookie;

        request.post({
            url: "https://www.facebook.com/ajax/login/help/identify.php?ctx=recover",
            qs: {
                email: "+4915214046435",
                lsd: lsd,
                did_submit: 'Search',
                __user: 0,
                __a: 1,
                __dyn: '',
                __req: 'a',
                __rev: 1880860
            }
        }, function (err, res, body) {
            if (err) {
                return console.error("second request", err);
            }

            // console.log("Got a response!", res);
            console.log("Response body:", body);
        });
    });