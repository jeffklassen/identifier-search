const Browser = require('zombie');

// We're going to make requests to http://example.com/signup
// Which will be routed to our test server localhost:3000
//Browser.localhost('www.facebook.com:443', 3000);

describe('User visits forgot password page', function() {
var user_agent = 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_7_3) AppleWebKit/535.20 (KHTML, like Gecko) Chrome/19.0.1036.7 Safari/535.20';

  const browser = new Browser({userAgent: user_agent, debug: false, waitFor: 10000});

  before(function(done) {
    browser.visit('https://www.facebook.com/login/identify?ctx=recover', done);
  });

  describe('submits form', function() {

    before(function(done) {
      browser
        .fill('input[id="identify_email"]',    '+4915214046435')
        .pressButton('input[id="u_0_3"]', done);
        
    });

    it('should be successful', function() {
      browser.assert.success();
    });

    it('should be contain a user\'s name', function() {
        console.log(browser.html("body"));
      browser.assert.text('#initiate_interstitial > div.phl.ptm.uiInterstitialContent > table > tbody > tr > td._k2 > div > div > div:nth-child(2) > div', 'Welcome To Brains Depot');
    });
  });
});