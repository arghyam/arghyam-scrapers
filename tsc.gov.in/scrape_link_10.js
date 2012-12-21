var x = require('casper').selectXPath,
    casper = require('casper').create({clientScripts: "jquery.min.js"}),
    write = require('./csv').write;

var stateTbId           = "ctl00_ContentPlaceHolder1_div_Data",
    stateTbSel          = '#'+ stateTbId +' tbody tbody tr:gt(2)',
    stateTbIds;

var districtTbId  = 'ctl00_ContentPlaceHolder1_div_Data',
    districtTbSel = '#'+ districtTbId +' tbody tbody tr:gt(3)';

var buffer  = [];

casper.start('http://tsc.gov.in/Report/Physical/RptStateWiseSelective_net.aspx?id=PHY', function()
{
  this.fill('form#aspnetForm', 
  {
    'ctl00$ContentPlaceHolder1$listBoxState':    '%'
  }, true);
  this.then(function()
  {
    this.click(x('//*[@id="ctl00_ContentPlaceHolder1_btnSubmit"]'));
  });
    this.then(function()
    {
// -------------------->
      stateTbIds    = this.evaluate(function(stateTbId)
      {
        return $('#'+ stateTbId +'').find('a').map(function()
        {
          if (!$(this).attr('disabled')) { return [[ $(this).attr('id'), $(this).text() ]]  }
        }).get();
      }, 
      {
        stateTbId:stateTbId
      });

      stateData = casper.evaluate(function(stateTbSel)
      {
        var rows = $(stateTbSel).map(function(i)
        {
          return [ $(this).children().map(function(){ if($(this).text() != '') { return $(this).text().trim(); } }).get() ]
        }).get();
        // <-- specific to this link
        rows[ rows.length -1 ].splice(0,0,'')
        // -->
        return rows
      },{stateTbSel: stateTbSel});

      this.then(function()
      {
        write('stateData_L10.csv', stateData);
      });

      this.each(stateTbIds, function(casper, stateID, index)
      {
        this.then(function()
        {
          this.click(x('//*[@id="' + stateID[0] + '"]'));
        });
        this.then(function()
        {
          // returns [[ANDHRA PRADESH, 7, KARIMNAGAR, 13-02-2003, 11/2012, 10849.48, 7165.48, 2612.85, 1071.15, 5602.87, 1943.23, 176.13, 7722.23, 4840.01, 1939.23, 176.13, 6955.37],..]
          districtData = this.evaluate(function(districtTbSel, stateName)
          {
            var rows = $(districtTbSel)
            rows = rows.map(function(i)
            {
              var row = $(this).children().map(function()
              {
                if($(this).text() != '') { return $(this).text().trim(); }
              }).get();
              // --->
              if ((rows.length - 1) == i) { row.splice(0, 0, '','',''); }
              // <---
              row.splice(0, 0, stateName);
              return [row];
            }).get();
            return rows
          },
          {
            districtTbSel  :  districtTbSel,
            stateName      :  stateID[1]
          });
          buffer.push.apply(buffer, districtData);
          console.log('District : Completed ', index + 1, 'out of', stateTbIds.length, buffer.length, 'rows');
        });
        this.then(function()
        {
          this.back();
        });
      });
    
      this.then(function()
      {
        write('districtData_L10.csv', buffer);
        buffer = [];
      });
// <--------------------
      this.back();
    });
});
casper.run();