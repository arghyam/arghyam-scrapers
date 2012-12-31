var x = require('casper').selectXPath,
    casper = require('casper').create({clientScripts: "jquery.min.js"}),
    write = require('./csv').write;

var dropdownList,
    dropdownSel       = '#ctl00_ContentPlaceHolder1_ddlState option:gt(0)',
    dropdownOption;

var stateName,
    buffer_district = [];

var districtTbSel     = '#ctl00_ContentPlaceHolder1_gvshow tr:gt(3)',
    districtData;

casper.start('http://tsc.gov.in/Report/Release/RptReleaseDataBetweenDates.aspx?id=Home', function() {
  dropdownList = this.evaluate(function(dropdownSel) {
    return $(dropdownSel).map(function(){ return [[ $(this).attr('value'),$(this).text().trim() ]] }).get();
  }, {
    dropdownSel : dropdownSel
  });

  this.each(dropdownList, function(casper, dropdownOption, index) {
    this.then(function() {
      this.fill('form#aspnetForm', {
        'ctl00$ContentPlaceHolder1$ddlState'  :  ''+dropdownOption[0]+''
      }, true);
    });
    this.then(function () {
        this.click(x('//*[@id="ctl00_ContentPlaceHolder1_btnSubmit"]'));
    });
    this.then(function() {
      districtData = this.evaluate(function(districtTbSel, state) {
        return $(districtTbSel).not(':last').map(function() {
          var row = $(this).children().map(function() {
            if($(this).text() != '') { return $(this).text().trim();
            }
          }).get();
          row.splice(0, 1);
          row.splice(0, 0, state);
          return [row];
        }).get();
      }, {
        districtTbSel : districtTbSel,
        state         : dropdownOption[1]
      });
      buffer_district.push.apply(buffer_district, districtData);
      console.log('District level : '+ (index+1) +' out of '+dropdownList.length+' completed ( Collected : '+buffer_district.length+' )');
    });
    this.then(function() {
      this.back();
    });
  });
  this.then(function() {
    write('districtData_L5.csv', buffer_district);
  });

});

casper.run();
