var x       = require('casper').selectXPath,
    casper  = require('casper').create({clientScripts: "jquery.min.js"}),
    write   = require('./csv').write;

var dropdownList,
    stateName,
    dropdownSel     = '#ctl00_ContentPlaceHolder1_ddlState option:gt(0)',
    dropdownOption;

var physicalArr = [],
    financialArr = [];

var financialTbSel,
    physicalTbSel;

casper.start('http://tsc.gov.in/tsc/Report/Status%20Note/RptStateNoteGeneral_net.aspx?id=Home', function() {
  dropdownList = this.evaluate(function (dropdownSel) {
    return $(dropdownSel).map(function(){ return [[ $(this).attr('value'),$(this).text().trim() ]] }).get();
  }, { dropdownSel:dropdownSel });

  this.each(dropdownList, function(casper, dropdownOption, index)
  {
    this.then(function() {
      this.fill('form#aspnetForm', {
        'ctl00$ContentPlaceHolder1$ddlState'   :    ''+dropdownOption[0]+''
      }, false);
    });

    this.then(function()
    {
      if (index == 0) {
        financialTbSel = '.Table tbody:eq(1) tr:gt(1)',
        physicalTbSel  = '.Table tbody:eq(0) tr:gt(2)';
      }
      if (index > 0) {
        financialTbSel = '.Table tbody:eq(1) tr:gt(2)',
        physicalTbSel  = '.Table tbody:eq(0) tr:gt(3)';
      }
      stateName = dropdownOption[1];
      var physicalData =  this.evaluate(function(physicalTbSel, stateName) {
        var rows = $(physicalTbSel)
        rows = rows.map(function(i)
        {
          var row = $(this).children().map(function()
          {
            if($(this).text() != '') { return $(this).text().trim(); }
          }).get();
          // --->
          if ((rows.length - 1) == i) { row.splice(0, 1, '', ''); }
          // <---
          row.splice(0, 0, stateName);
          return [row];
        }).get();
        return rows
      },{physicalTbSel: physicalTbSel, stateName:stateName});

      physicalArr.push.apply(physicalArr, physicalData);
      console.log('Physical District/State:',physicalArr.length,'rows');

      var financialData = this.evaluate(function(financialTbSel, stateName) {
        var rows = $(financialTbSel)
        rows = rows.map(function(i)
        {
          var row = $(this).children().map(function()
          {
            if($(this).text() != '') { return $(this).text().trim(); }
          }).get();
          // --->
          if ((rows.length - 1) == i) { row.splice(0, 1, '', ''); }
          // <---
          row.splice(0, 0, stateName);
          return [row];
        }).get();
        return rows
      },{financialTbSel: financialTbSel, stateName:stateName});

      financialArr.push.apply(financialArr, financialData);
      console.log('Financial District/State:',financialArr.length,'rows');

      if (index == 0) {
        this.then(function() {
          write('statePhysicalData_L3.csv', physicalArr);
        });
        this.then(function() {
          write('stateFinancialData_L3.csv', financialArr);
        });
      }
      if (index > 0) {
        this.then(function() {
          write('districtPhysicalData_L3.csv', physicalArr);
        });
        this.then(function() {
          write('districtFinancialData_L3.csv', financialArr);
        });
      }
    });
    this.then(function()
    {
      physicalArr = [];
      financialArr = [];
      this.back();
    });
  });
  
});

casper.run();