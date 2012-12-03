var x = require('casper').selectXPath,
    casper = require('casper').create({clientScripts: "jquery.min.js"}),
    write = require('./csv').write;

casper.start('http://tsc.gov.in/Report/Financial/RptFinancialProgressStatewiseDistrictwise.aspx?id=Home', function()
{
    var stateTbId = "ctl00_ContentPlaceHolder1_gvshow";
    var districtTbId  = "ctl00_ContentPlaceHolder1_gvDistrict";
    var stateTbIds = this.evaluate(function(stateTbId){
        return $('a[id^='+stateTbId+']')
            .map(function(){
                return $(this)
                    .attr('id');
        }).get();
    }, {stateTbId:stateTbId});
    // returns data from the state table
    var stateData =
    this.evaluate(function(stateTbId){
        return $('#'+stateTbId+' tbody tr')
            .slice(2)
            .map(function(){
                return [
                    $(this)
                        .children()
                        .map(function(){
                            return $(this)
                                .text()
                                .trim();
                        }).get()
                        ];
        }).get();
    },{stateTbId: stateTbId});
    write('stateData_L1.csv', stateData);
    var results = [];
    casper.each(stateTbIds, function(casper, stateID, index)
    {
        this.then(function()
        {
            this.click(x('//*[@id="'+ stateID +'"]'));
        });

        this.then(function()
        {
            var districtData = this.evaluate(function(districtTbId) {
                return $('#'+ districtTbId +' tbody tr')
                    .slice(2)
                    .map(function(){
                        return [
                            $(this)
                                .children()
                                .map(function(){
                                    return $(this)
                                        .text()
                                        .trim();
                                }).get()
                                ];
                    }).get();
            }, {districtTbId: districtTbId});
            results.push.apply(results, districtData);
            console.log('State:', index, 'out of', stateTbIds.length, results.length, 'rows');
            this.back();
        });
    });
    casper.then(function() {
        write('districtData_L1.csv', results);
    });
});

casper.run();
