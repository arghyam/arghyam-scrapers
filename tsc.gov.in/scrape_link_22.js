var x                 = require('casper').selectXPath,
    casper            = require('casper').create({clientScripts: "jquery.min.js"}),
    write             = require('./csv').write;

var stateData,
    stateTbSel = '#ctl00_ContentPlaceHolder1_gvState tr:gt(1)',
    buffer_State = [];

casper.start('http://tsc.gov.in/Report/Physical/RptYearWiseStateLevelAch_net.aspx?id=PHY', function() {
  this.click(x('//*[@id="ctl00_ContentPlaceHolder1_btnView"]'));
  this.then(function() {
    stateData = this.evaluate(function(stateTbSel) {
      return $(stateTbSel).map(function() {
        var row = $(this).children().map(function() {
          return $(this).text().trim();
        }).get();
        if (row[1] != "") { temp   = row[1] }
        if (row[1] == "") { row[1] = temp   }
        return [row];
      }).get();
    },{stateTbSel:stateTbSel});
    buffer_State.push.apply(buffer_State, stateData);
  });
  this.then(function() {
    write('stateData_L22.csv', buffer_State);
  });
});

casper.run()