/*
    This does scrapping
*/

var x = require('casper').selectXPath,
    casper = require('casper').create({
    logLevel            : "debug",
    verbose             : true,
    clientScripts       : "jquery.min.js"
});

casper.start('http://tsc.gov.in/Report/otherreports/RptFinancialProgofSchemes.aspx?id=Home', function()
{
    var stateTbClassname = "Table";
    // get me state table data
    this.evaluate(function(stateTbClassname){
        return $('.'+stateTbClassname+' tbody')
                                                .children()
                                                .slice(3)
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
    },{stateTbClassname: stateTbClassname});
});

casper.run();

