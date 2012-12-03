var x = require('casper').selectXPath,
    casper = require('casper').create({clientScripts: "jquery.min.js"}),
    write = require('./csv').write;

casper.start('http://tsc.gov.in/Report/otherreports/RptFinancialProgofSchemes.aspx?id=Home', function()
{
    var stateTbClassname = "Table";
    // get me state table data
    var arr = this.evaluate(function(stateTbClassname){
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
    // write csv file
    write('stateData_L8.csv', arr);
});

casper.run();
