var x       = require('casper').selectXPath,
    casper  = require('casper').create({clientScripts: "jquery.min.js"}),
    write   = require('./csv').write;

var buffer      = [],
    stateTbSel  = '#ctl00_ContentPlaceHolder1_div_Data table:eq(1) tr:gt(3)';

casper.start('http://tsc.gov.in/Report/otherreports/RptStatewsiseBasicInfo.aspx?id=PHY', function()
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
  write('stateData_L16.csv', buffer);
});

casper.run();
