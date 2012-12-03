var x = require('casper').selectXPath,
    casper = require('casper').create({clientScripts: "jquery.min.js"}),
    write = require('./csv').write;

var physicalArr = [];
var financialArr = [];
casper.start('http://tsc.gov.in/Report/Status%20Note/RptStateNoteGeneral_net.aspx?id=Home', function() {
    var financialTbClassname = 'Table';
    var physicalTbId  = 'ctl00_ContentPlaceHolder1_Table1';
    // returns values in drop-down input
    var dropdownList = this.evaluate(function () {
        return $('#ctl00_ContentPlaceHolder1_ddlState')
                .children()
                .map(function(){
                    return $(this).attr('value');
                }).get();
    });
    casper.then(function () {
        this.fill('form#aspnetForm', {
                'ctl00$ContentPlaceHolder1$ddlState'   :    ''+dropdownList[1]+''
        }, false);
        this.then(function () {
            // returns data from the physical progress table
            var physicalData =  this.evaluate(function(physicalTbId){
                                    return $('.Table tbody').eq(0)
                                        .children()
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
                                },{physicalTbId: physicalTbId});
            physicalArr.push.apply(physicalArr, physicalData);
            console.log('Physical State:',physicalArr.length,'rows');
            // returns data from the financial progress table
            var financialData = this.evaluate(function(financialTbClassname){
                                    return $('.Table tbody').eq(1)
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
                                },{financialTbClassname: financialTbClassname});
            financialArr.push.apply(financialArr, financialData);
            console.log('Financial State:',financialArr.length,'rows');
        });
    });
    casper.then(function() {
        write('statePhysicalData_L3.csv', physicalArr);
        physicalArr = [];
    });
    casper.then(function() {
        write('stateFinancialData_L3.csv', financialArr);
        financialArr = [];
    });
    casper.each(dropdownList.slice(2), function(casper, dropdownListoption, index) {
        this.then(function () {
            this.fill('form#aspnetForm', {
                'ctl00$ContentPlaceHolder1$ddlState'   :    ''+dropdownListoption+''
            }, false);
        });
        this.then(function () {
            // returns data from the physical progress table
            var physicalData =  this.evaluate(function(physicalTbId){
                                    return $('.Table tbody').eq(0)
                                        .children()
                                        .slice(4)
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
                                },{physicalTbId: physicalTbId});
            physicalArr.push.apply(physicalArr, physicalData);
            console.log('Physical - State:', index, 'out of', dropdownList.length, physicalArr.length, 'rows');
            // returns data from the financial progress table
            var financialData = this.evaluate(function(financialTbClassname){
                                    return $('.Table tbody').eq(1)
                                        .children()
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
                                },{financialTbClassname: financialTbClassname});
            financialArr.push.apply(financialArr, financialData);
            console.log('Financial - State:', index, 'out of', dropdownList.length, financialArr.length, 'rows');
        });
    });
    casper.then(function() {
        write('districtPhysicalData_L3.csv', physicalArr);
    });
    casper.then(function() {
        write('districtFinancialData_L3.csv', financialArr);
    });
});

casper.run();
