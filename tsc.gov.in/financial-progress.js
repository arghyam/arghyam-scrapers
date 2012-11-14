var processStates = function () {
    return $('a[id]');
};

var url = 'http://tsc.gov.in/Report/Financial/RptFinancialProgressStatewiseDistrictwise.aspx?id=Home';
var page = require('webpage').create();
page.open(url, function (status) {
    page.injectJs('jquery.min.js');
    var result = page.evaluate(processStates);
    console.log('Number of links with IDs', result.length);
    page.release();
    phantom.exit();
});
