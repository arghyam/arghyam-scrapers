var x       = require('casper').selectXPath,
    casper  = require('casper').create({clientScripts: "jquery.min.js"}),
    write   = require('./csv').write;

var stateTbId           = "ctl00_ContentPlaceHolder1_div_Data",
    stateTbSel          = '#'+ stateTbId +' tr:gt(1):lt(30)',
    stateTbIds;

var districtTbId  = 'ctl00_ContentPlaceHolder1_div_Data',
    districtTbSel = '#'+ districtTbId +' tbody tr:gt(2)';

var buffer  =  [];

casper.start('http://tsc.gov.in/TSC/Report/Physical/RptPhysicalProgessStateWiseDistrictwise.aspx?id=PHY', function()
{
  stateTbIds    = this.evaluate(function(stateTbId)
  {
    return $('#'+ stateTbId +'').find('a').map(function()
    {
      return [[ $(this).attr('id'), $(this).text() ]] 
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
    write('school_physical_progress.csv', stateData);
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
        // --->
        var rows = $(districtTbSel).not(':last')
        // <---
        rows = rows.map(function(i)
        {
          var row = $(this).children().map(function()
          {
            if($(this).text() != '') { return $(this).text().trim(); }
          }).get();
          // --->
          //if ((rows.length - 1) == i) { row.splice(0, 0, ''); }
					// <---
          row.splice(0, -1, stateName);
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
    write('school_phsical_progress_statewise.csv', buffer);
  });

});
//State_Name, S_No,	District_Name, Sanc_Date,	Repo_Date,	PO_IHHL_BPL,	PO_IHHL_APL,	PO_IHHL_TOTAL,	PO_SCW,	PO_School_Toilets,	PO_Anganwadi_Toilets,	PO_RSM,	PO_PC,	PP_IHHL_BPL,	PP_IHHL_APL,	PP_IHHL_TOTAL,	PP_SCW,	PP_School_Toilets,	PP_Anganwadi_Toilets,	PP_RSM,	PP_PC

casper.run();