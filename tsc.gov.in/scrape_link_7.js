var x = require('casper').selectXPath,
    casper = require('casper').create({clientScripts: "jquery.min.js"}),
    write = require('./csv').write;

casper.start('http://tsc.gov.in/Report/Special%20Report/RptCoverageCensusPer.aspx?id=Home', function() {
    var distTableClassname = "Table";
    // get all the elements from the 1st drop down box
    var dropdownList1 = this.evaluate(function () {
        return $('#ctl00_ContentPlaceHolder1_listBoxState')
            .children()
            .eq(0)
            .map(function(){
                return $(this).attr('value');
            }).get();
    });

    // get all the elements from the 2nd drop down box
    var dropdownList2 = this.evaluate(function () {
        return $('#ctl00_ContentPlaceHolder1_listBoxDistrict')
            .children()
            .map(function(){
                return $(this).attr('value');
            }).get();
    });
    // iterate through 'dropdownList1's and 'dropdownList2's in a nested fashion
    casper.each(dropdownList2, function(casper, dropdownList2option, index) {
        var sanitationArr = [];
        casper.each(dropdownList1, function(casper, dropdownList1option, index) {
            this.then(function () {
                // fill form but don't submit
                this.fill('form#aspnetForm', {
                    'ctl00$ContentPlaceHolder1$listBoxState'   :    ''+dropdownList1option+'',
                    'ctl00$ContentPlaceHolder1$listBoxDistrict'  :    ''+dropdownList2option+''
                }, false);
                // submit
                this.click(x('//*[@id="ctl00_ContentPlaceHolder1_btnSubmit"]'));
            });
            this.then(function () {
                // returns district table data
                var sanitationData =
                this.evaluate(function(distTableClassname){
                    return $('.'+ distTableClassname +' tbody tr')
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
                }, {distTableClassname: distTableClassname});
                sanitationArr.push.apply(sanitationArr, sanitationData);
                console.log(dropdownList2option,'-->', dropdownList1option, 'collected :', sanitationArr.length);
                this.back();
            });
        });
        casper.then(function() {
            write(''+dropdownList2option+'_L7.csv', sanitationArr);
        });
    });

});

casper.run();
