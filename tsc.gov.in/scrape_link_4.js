var x = require('casper').selectXPath,
    casper = require('casper').create({clientScripts: "jquery.min.js"}),
    write = require('./csv').write;

casper.start('http://tsc.gov.in/Report/Physical/RptPhysicalProgessStateWiseDistrictwise.aspx?id=Home', function()
{
    var stateTbClassname = "Table";
    var stateTbIDstartswith = "ctl00_ContentPlaceHolder1_rptAbstract";
    // return state table IDs
    var stateTbIDs = this.evaluate(function(stateTbIDstartswith){
        return $('a[id^='+stateTbIDstartswith+']')
            .map(function(){
                return $(this).attr('id');
            }).get();
    }, {stateTbIDstartswith:stateTbIDstartswith});
    var distTableClassname = "Table";
    // return state table data
    var stateArr = [];
    var districtArr = [];
    var stateData =
    this.evaluate(function(stateTbClassname){
        return $('.'+stateTbClassname+' tbody')
            .children()
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
    },{stateTbClassname: stateTbClassname});
    stateArr.push.apply(stateArr, stateData);
    casper.then(function() {
        write('stateData_L4.csv', stateArr);
    });
    casper.each(stateTbIDs, function(casper, stateID, index)
    {
        this.then(function()
        {
            this.click(x('//*[@id="'+ stateID +'"]'));
        });
        this.then(function()
        {
            // return district table data
            var districtData =
            this.evaluate(function(distTableClassname){
                return $('.'+ distTableClassname +' tbody tr')
                    .slice(3)
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
            }, {distTableClassname: distTableClassname});
            districtArr.push.apply(districtArr, districtData);
            console.log('District:', index, 'out of', stateTbIDs.length, districtArr.length, 'rows');
            this.back();
        });
    });
    casper.then(function() {
        write('districtData_L4.csv', districtArr);
    });
});

casper.run();
