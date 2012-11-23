var x = require('casper').selectXPath,
    casper = require('casper').create({
                clientScripts       : "jquery.min.js"
            });

casper.start('http://tsc.gov.in/Report/Status%20Note/RptStateNoteGeneral_net.aspx?id=Home', function() {
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
        this.then(function () {
            this.fill('form#aspnetForm', {
                'ctl00$ContentPlaceHolder1$ddlState'   :    ''+dropdownListoption+''
            }, false);
        });
        this.then(function () {
            this.capture(''+dropdownListoption+'.png');
        });
    })
});

casper.run();