var x       = require('casper').selectXPath,
    casper  = require('casper').create({clientScripts: "jquery.min.js"}),
    write   = require('./csv').write;

var dropdownList,
    stateName,
    dropdownSel     = '#ctl00_ContentPlaceHolder1_ddlState option',
    dropdownOption;

var districtTbSel = '#ctl00_ContentPlaceHolder1_tabledistrict table tr:gt(4)',
    districtData,
    stateTbSel    = '#ctl00_ContentPlaceHolder1_div_Data table table tr:gt(3):lt(31)',
    stateData,
    buffer_state    = [],
    buffer_district = [];

casper.start('http://tsc.gov.in/tsc/Report/Physical/RptStateWisePerAch_OnlyTSC_net.aspx?id=PHY',function()
{
  dropdownList = this.evaluate(function(dropdownSel)
  {
    return $(dropdownSel).map(function(){ return [[ $(this).attr('value'),$(this).text().trim() ]] }).get();
  },
  {
    dropdownSel : dropdownSel
  });
  this.each(dropdownList, function(casper, dropdownOption, index)
  {
    this.then(function()
    {
      this.fill('form#aspnetForm',
      {
        'ctl00$ContentPlaceHolder1$ddlState'  :  ''+dropdownOption[0]+''
      }, false);
      this.click(x('//*[@id="ctl00_ContentPlaceHolder1_btnSubmit"]'));
    });
    this.then(function()
    {
      if(index == 0)
      {
        stateData = this.evaluate(function(stateTbSel)
        {
          var rows = $(stateTbSel);
          rows = rows.map(function(i)
          {
            var row = $(this).children().map(function(i)
            {
              if($(this).text() != '') { return $(this).text().trim(); }
            }).get();
            // --->
            if ((rows.length - 1) == i) { row.splice(0, 0, ''); }
            // <---
            return [row];
          }).get();
          return rows;
        },
        {
          stateTbSel : stateTbSel
        });
        buffer_state.push.apply(buffer_state, stateData);
        console.log('State : '+index+' out of '+dropdownList.length+' completed ( Collected : '+buffer_state.length+' )');
      }
      if (index > 0)
      {
        stateName = dropdownOption[1];
        districtData = this.evaluate(function(districtTbSel, stateName)
        {
          var rows = $(districtTbSel).not(':last()');
          rows = rows.map(function(i)
          {
            var row = $(this).children().map(function(i)
            {
              if($(this).text() != '') { return $(this).text().trim(); }
            }).get();
            // --->
            if ((rows.length - 1) == i) { row.splice(0, 0, ''); }
            // <---
            row.splice(0, 0, stateName);
            return [row];
          }).get();
          return rows;
        },
        {
          districtTbSel : districtTbSel,
          stateName     : stateName
        });
        buffer_district.push.apply(buffer_district, districtData);
        console.log('District : '+index+' out of '+dropdownList.length+' completed ( Collected : '+buffer_district.length+' )');
      };
    });
    this.then(function()
    {
      this.back();
    });
  });
  this.then(function()
  {
    write('districtData_L17.csv', buffer_district);
  });
  this.then(function()
  {
    write('stateData_L17.csv', buffer_state);
  });
});

casper.run();