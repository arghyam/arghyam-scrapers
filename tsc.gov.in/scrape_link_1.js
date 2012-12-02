var x           = require('casper').selectXPath,
    casper      = require('casper').create({
                        clientScripts       : "jquery.min.js"
                  }),
    fs = require('fs'),
    handle,
    districtData;

var i =10;

// csv(array_of_arrays) --> csv string
var csv = (function(delimiter) {
    reFormat = new RegExp("[\"" + delimiter + "\n]");

    function formatRow(row) {
        return row.map(formatValue).join(delimiter);
    }

    function formatValue(text) {
        return reFormat.test(text) ? "\"" + text.replace(/\"/g, "\"\"") + "\"" : text;
    }

    return function (rows) {
        return rows.map(formatRow).join("\n");
    };
})(',');

casper.start('http://tsc.gov.in/Report/Financial/RptFinancialProgressStatewiseDistrictwise.aspx?id=Home', function()
{
    handle = fs.open('stateData_L1.csv', 'w');
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
    handle.write(csv(stateData));
    handle.close();
    var results = [];
    casper.each(stateTbIds, function(casper, stateID, index)
    {
        this.then(function()
        {
            this.click(x('//*[@id="'+ stateID +'"]'));
        });

        this.then(function()
        {
            districtData = this.evaluate(function(districtTbId) {
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
        handle = fs.open('districtData_L1.csv', 'w');
        handle.write(csv(results));
        handle.close();
    });
});

casper.run();

