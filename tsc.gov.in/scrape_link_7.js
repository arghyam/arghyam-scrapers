var x           = require('casper').selectXPath,
    casper      = require('casper').create({
                    clientScripts       : "jquery.min.js"
                    }),
    fs          = require('fs'),
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

casper.start('http://tsc.gov.in/Report/Special%20Report/RptCoverageCensusPer.aspx?id=Home', function() {
    var distTableClassname = "Table";
    // get all the elements from the 1st drop down box
    var dropdownList1 = this.evaluate(function () {
        return $('#ctl00_ContentPlaceHolder1_listBoxState')
            .children()
            .map(function(){ 
                return $(this)
                    .attr('value') 
            }).get();
    });

    // get all the elements from the 2nd drop down box
    var dropdownList2 = this.evaluate(function () {
        return $('#ctl00_ContentPlaceHolder1_listBoxDistrict')
            .children()
            .map(function(){ 
                return $(this)
                    .attr('value') 
            }).get();
    });
    var districtData;
    // iterate through 'dropdownList1's and 'dropdownList2's in a nested fashion
    casper.each(dropdownList1, function(casper, dropdownList1option, index) {
        casper.each(dropdownList2, function(casper, dropdownList2option, index) {
            handle = fs.open(''+dropdownList1option+'_'+dropdownList2option+'_L7.csv','w');
            this.then(function () {
                // fill form but don't submit
                this.fill('form#aspnetForm', {
                    'ctl00$ContentPlaceHolder1$listBoxState'   :    ''+dropdownList1option+'',
                    'ctl00$ContentPlaceHolder1$listBoxDistrict'  :    ''+dropdownList2option+''
                }, false);
                // submit
                this.click(x('//*[@id="ctl00_ContentPlaceHolder1_btnSubmit"]'));
            })
            this.then(function () {
                // returns state/district table data
                districtData = 
                this.evaluate(function(distTableClassname){   
                    return $('.'+ distTableClassname +' tbody tr')
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
                }, {distTableClassname: distTableClassname});
                handle.write(csv(districtData));
                handle.close();
                this.back();
            })
        });
    });
});

casper.run();