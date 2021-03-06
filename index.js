var request = require("request");
var cheerio = require('cheerio');

// this mimics the headers that chrome on OS X sends facebook for the first request
var headers = {
    'pragma': 'no-cache',
    'accept-encoding': 'deflate',
    'accept-language': 'en,en-US;q=0.8',
    'upgrade-insecure-requests': 1,
    'user-agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_10_4) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/44.0.2403.130 Safari/537.36',
    'accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',
    'cache-control': 'no-cache'

};

// this is the first request that loads the initial page with the form on it. We need to take the 'lsd'
// field from this form for use in the response.
request.get({
        url: "https://www.facebook.com/login/identify?ctx=recover",
        headers: headers
    },
    function (err, res, body) {
        if (err) {
            return console.error("first request", err);
        }

        // load the HTML body of the response into cheerio for parsing
        $ = cheerio.load(body);

        var lsd;
        // find the input field named 'lsd' and pull the value.
        $('input').each(function (i, input) {

            if ($(this).attr('name') === 'lsd') {
                lsd = $(this).attr('value');
            }
        });


        // I thought that maybe we had to grab the cookie passed to us from the first page and manually pass it to the second
        // page, but no dice there.
        var cookie = res.headers["Set-Cookie"]
        if (cookie) {
            cookie = (cookie + "").split(";").shift();
            headers.Cookie = cookie;
        }


        // this is the second page request where we POST the form data. Please notice below that in addition to a phone number
        // there are several other fields generated by facebook and sent in tandem with the form fields.
        request.post({
            url: "https://www.facebook.com/ajax/login/help/identify.php?ctx=recover",
            qs: {
                email: "some@email.com",
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