var x       = require('casper').selectXPath,
    casper  = require('casper').create(
              {
                clientScripts   : "jquery.min.js"
              }),
    write   = require('./csv').write;

var dropdownSel = '#ctl00_ContentPlaceHolder1_ddlState option:gt(1)';
var dropdownList;
var dropdownOption;

var stateTbSel = '#ctl00_ContentPlaceHolder1_div_Data tbody tbody tbody tr:gt(4)';
var stateData;
var stateName;

var buffer = [];

casper.start('http://tsc.gov.in/Report/Financial/RptStateLevelFinyrwise_net.aspx?id=FIN', function()
{
  dropdownList = this.evaluate(function(dropdownSel)
  {
    return $(dropdownSel).map(function(){ return [[ $(this).attr('value'),$(this).text().trim() ]] }).get();
  },
  {
    dropdownSel:dropdownSel
  });
  this.each(dropdownList, function(casper, dropdownOption, index)
  {
    this.then(function()
    {
      this.fill('form#aspnetForm', { 'ctl00$ContentPlaceHolder1$ddlState': ''+dropdownOption[0]+'' }, false);
    });
    this.then(function()
    {
      stateName = dropdownOption[1];
      stateData = this.evaluate(function(stateTbSel, stateName)
      {
        var rows = $(stateTbSel)
        rows = rows.map(function(i)
        {
          var row = $(this).children().map(function()
          {
            if($(this).text() != '') { return $(this).text().trim(); }
          }).get();
          row.splice(0, 0, stateName);
          return [row];
        }).get();
        return rows
      },{stateTbSel: stateTbSel,stateName:stateName});
      buffer.push.apply(buffer, stateData);
      console.log('State : Completed ', index + 1, 'out of', dropdownList.length, buffer.length, 'rows');
      this.back();
    });
  this.then(function()
  {
    write('stateData_L9.csv', buffer);
  });
  });
});

casper.run();