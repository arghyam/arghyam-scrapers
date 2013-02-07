var x = require('casper').selectXPath,
    casper = require('casper').create({clientScripts: "jquery.min.js"}),
    write = require('./csv').write;

var dropdownListSel = "#ctl00_ContentPlaceHolder1_ddlstate option";

var districtTbSel = ".Table tr:gt(1)",
    dropdownList;

var stateTbSel = "#ctl00_ContentPlaceHolder1_gvState tr:gt(1)",
    stateData,
    buffer_state = [];

var districtTbSel = "#ctl00_ContentPlaceHolder1_gvState tr:gt(2)",
    districtData,
    buffer_district = [];

casper.start('http://tsc.gov.in/tsc/Report/Physical/RptPhyAchinTimePeriod_net.aspx?id=PHY',function() {
  dropdownList = this.evaluate(function (dropdownListSel) {
    return $(dropdownListSel).map(function(){ return [[ $(this).attr('value'),$(this).text().trim() ]] }).get();
  }, { dropdownListSel:dropdownListSel });
  this.each(dropdownList, function(casper, dropdownOption,index) {
    this.then(function () {
      this.fill('form#aspnetForm', {
        'ctl00$ContentPlaceHolder1$ddlstate'   :    ''+dropdownOption[0]+''
      }, false);
      this.click(x('//*[@id="ctl00_ContentPlaceHolder1_btnSubmit"]'));
    });
    this.then(function() {
      if (index == 0) {
        stateData = this.evaluate(function(stateTbSel) {
          var rows = $(stateTbSel)
          rows = rows.map(function() {
            var row = $(this).children().map(function() {
              if($(this).text() != '') { return $(this).text().trim(); }
            }).get();
            return [row];
          }).get();
          return rows
        }, { stateTbSel:stateTbSel });
        buffer_state.push.apply(buffer_state, stateData);
        console.log('State: '+index+' out of '+dropdownList.length+' Collected: '+buffer_state.length+'');
      };
      if (index > 0) {
        stateName = dropdownOption[1];
        districtData = this.evaluate(function(districtTbSel, stateName) {
          var rows = $(districtTbSel)
          rows = rows.map(function() {
            var row = $(this).children().map(function() {
              if($(this).text() != '') { return $(this).text().trim(); }
            }).get();
            row.splice(0, 0, stateName);
            return [row];
          }).get();
          return rows
        }, { districtTbSel:districtTbSel, stateName:stateName });
        buffer_district.push.apply(buffer_district, districtData);
        console.log('District: '+index+' out of '+dropdownList.length+' Collected: '+buffer_district.length+'');
      };
    });
    this.then(function() {
      this.back();
    });
  });
  this.then(function() {
    write('stateData_L21.csv', buffer_state);
  });
  this.then(function() {
    write('districtData_L21.csv', buffer_district);
  });
});

casper.run();