var x       = require('casper').selectXPath,
    casper  = require('casper').create({clientScripts: "jquery.min.js"}),
    write   = require('./csv').write;

var stateSel   = '#ctl00_ContentPlaceHolder1_Div1 ul:gt(0) li a';
var stateTbSel = '#ctl00_ContentPlaceHolder2_divData table tbody:eq(1) tr:gt(0)';
var stateList;
var buffer     = [];

casper.start('http://tsc.gov.in/NBA/NBAHome.aspx', function()
{
  
  stateList = this.evaluate(function(stateSel)
  {
    return $(stateSel).map(function(){ return [[ $(this).attr('id'),$(this).text().trim() ]] }).get();
  },
  {
    stateSel : stateSel
  });

  this.each(stateList, function(casper, state, index)
  {
    this.then(function()
    {
      this.click(x('//*[@id="'+ state[0] +'"]'));
    });
    this.then(function()
    {
      stateData = this.evaluate(function(stateTbSel, state)
      {
        var rows = $(stateTbSel);
        rows = rows.map(function(){ return $(this).children().map(function(){ return $(this).text().trim() }).get().slice(1); }).get();
        rows.splice(0,0, state[1])
        return [rows];
      },
      {
        stateTbSel : stateTbSel,
        state      : state
      });
      buffer.push.apply(buffer, stateData);
      console.log('State '+ (index + 1) +' out of '+stateList.length+' completed');
    });
    
    this.then(function()
    {
      this.back();
    });
  });

  this.then(function()
  {
    write('stateData_L14.csv', buffer);
  });
});

casper.run();