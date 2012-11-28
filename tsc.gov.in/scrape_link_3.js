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

casper.start('http://tsc.gov.in/Report/Status%20Note/RptStateNoteGeneral_net.aspx?id=Home', function() {
    var financialTbClassname = 'Table';
    var physicalTbId  = 'ctl00_ContentPlaceHolder1_Table1';
    // returns values in drop-down input
    var dropdownList = this.evaluate(function () {
        return $('#ctl00_ContentPlaceHolder1_ddlState')
                                                        .children()
                                                        .slice(1)
                                                        .map(function(){ 
                                                            return $(this)
                                                                            .attr('value') 
                                                        }).get();
    });
    casper.each(dropdownList, function(casper, dropdownListoption, index) {
        handle = fs.open(''+dropdownListoption+'.csv', 'w');
        this.then(function () {
            this.fill('form#aspnetForm', {
                'ctl00$ContentPlaceHolder1$ddlState'   :    ''+dropdownListoption+''
            }, false);
        });
        this.then(function () {
            // returns data from the physical progress table
            var physicalData =  this.evaluate(function(physicalTbId){
                                    return $('#'+physicalTbId+' tbody tr')
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
            handle.write(csv(physicalData));
            // returns data from the financial progress table
            var financialData = this.evaluate(function(financialTbClassname){
                                    return $('.'+financialTbClassname+' tbody')
                                        .children()
                                        .slice(2)
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
                                },{financialTbClassname: financialTbClassname});
            handle.write(csv(financialData));
        });
    })
    handle.close();
});

casper.run();