var x       = require('casper').selectXPath,
    casper  = require('casper').create({clientScripts: "jquery.min.js"}),
    write   = require('./csv').write;

var buffer      = [],
    stateTbSel  = '#ctl00_ContentPlaceHolder1_div_Data table tr:gt(4)';

casper.start('http://tsc.gov.in/Report/Release/RptCentreReleaseStatewise_net.aspx?id=REL', function()
{
  buffer = this.evaluate(function(stateTbSel)
  {
    var rows = $(stateTbSel);
    rows = rows.map(function(i)
    {
      var row = $(this).children().map(function(){ if($(this).text() != '') { return $(this).text().trim(); } }).get();
      // --->
          if ((rows.length - 1) == i) { row.splice(0, 0, ''); }
      // <---
      return [row];
    }).get();
    return rows;
  },{stateTbSel: stateTbSel});
  write('stateData_L29.csv', buffer);
});

casper.run();
