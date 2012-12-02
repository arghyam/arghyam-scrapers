var x       = require('casper').selectXPath,
    casper  = require('casper').create({
                    clientScripts       : "jquery.min.js"
                }),
    fs      = require('fs'),
    handle;

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

casper.start('http://tsc.gov.in/Report/Release/RptReleaseDataBetweenDates.aspx?id=Home', function() {

    var districtTbId = 'ctl00_ContentPlaceHolder1_gvshow';
    // returns the values in the drop-down box
    var dropdownList = this.evaluate(function () {
        return $('#ctl00_ContentPlaceHolder1_ddlState')
            .children()
            .slice(1)
            .map(function(){ 
                return $(this)
                    .attr('value') 
            }).get();
    });
    var districtArr = [];
    casper.each(dropdownList, function(casper, dropdownListoption, index) {
        this.then(function () {
            this.fill('form#aspnetForm', {
                'ctl00$ContentPlaceHolder1$ddlState'   :    ''+dropdownListoption+''
            }, false);
        });
        this.then(function () {
            this.click(x('//*[@id="ctl00_ContentPlaceHolder1_btnSubmit"]'));
        });
        this.then(function () {
            var districtData =
            this.evaluate(function(districtTbId){
                return $('#'+ districtTbId +' tbody tr')
                    .slice(4)
                    .not(':last')
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
            districtArr.push.apply(districtArr, districtData);
            console.log('District:', index, 'out of', dropdownList.length, districtArr.length, 'rows');
            this.back();
        });
    });
    casper.then(function() {
        handle = fs.open('districtData_L6.csv', 'w');
        handle.write(csv(districtArr));
        handle.close();
    });

});

casper.run();