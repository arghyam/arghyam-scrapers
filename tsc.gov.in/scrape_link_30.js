var x                 = require('casper').selectXPath,
    casper            = require('casper').create({clientScripts: "jquery.min.js"}),
    write             = require('./csv').write;

var dropdownList,
    dropdownSel       = '#ctl00_ContentPlaceHolder1_ddl_state option:gt(1)',
    dropdownOption;

var districtTbSel     = '#ctl00_ContentPlaceHolder1_gv_report tr:gt(3)',
    districtData;

var buffer_district   = [];

casper.start('http://tsc.gov.in/tsc/Report/Release/RptCentreReleaseDistrictwise_net.aspx?id=REL',function() {
  dropdownList = this.evaluate(function(dropdownSel) {
    return $(dropdownSel).map(function(){ return [[ $(this).attr('value'),$(this).text().trim() ]] }).get();
  }, {
    dropdownSel : dropdownSel
  });

  this.each(dropdownList, function(casper, dropdownOption, index) {
    this.then(function() {
      this.fill('form#aspnetForm', {
        'ctl00$ContentPlaceHolder1$ddl_state'  :  ''+dropdownOption[0]+''
      }, true);
    });
    this.then(function() {
      districtData = this.evaluate(function(districtTbSel, state) {
        return $(districtTbSel).map(function(i) {
          var row = $(this).children().map(function() {
            if($(this).text() != '') { return $(this).text().trim();
            }
          }).get();
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
    write('districtData_L30.csv', buffer_district);
  });
});

casper.run();