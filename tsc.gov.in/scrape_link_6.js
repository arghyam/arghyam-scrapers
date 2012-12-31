var x = require('casper').selectXPath,
    casper = require('casper').create({clientScripts: "jquery.min.js"}),
    write = require('./csv').write;

var dropdownList1Sel = "#ctl00_ContentPlaceHolder1_listBoxState option",
    dropdownList2Sel = "#ctl00_ContentPlaceHolder1_listBoxDistrict option";

var districtTbSel = ".Table tr:gt(1)";

casper.start('http://tsc.gov.in/Report/Special%20Report/RptCoverageCensusPer.aspx?id=Home', function() {
    dropdownList1 = this.evaluate(function (dropdownList1Sel) {
      return $(dropdownList1Sel).map(function(){ return [[ $(this).attr('value'),$(this).text().trim() ]] }).get();
    }, { dropdownList1Sel:dropdownList1Sel });

    dropdownList2 = this.evaluate(function (dropdownList2Sel) {
      return $(dropdownList2Sel).map(function(){ return [[ $(this).attr('value'),$(this).text().trim() ]] }).get();
    }, { dropdownList2Sel:dropdownList2Sel });

    this.each(dropdownList2, function(casper, dropdownList2option, index) {
      var bufferArr = [];
      this.each(dropdownList1, function(casper, dropdownList1option, index) {
        this.then(function () {
          this.fill('form#aspnetForm', {
            'ctl00$ContentPlaceHolder1$listBoxState'   :    ''+dropdownList1option[0]+'',
            'ctl00$ContentPlaceHolder1$listBoxDistrict'  :    ''+dropdownList2option[0]+''
          }, false);
          this.click(x('//*[@id="ctl00_ContentPlaceHolder1_btnSubmit"]'));
        });
        this.then(function () {
          districtData = this.evaluate(function(districtTbSel, state) {
            return $(districtTbSel).map(function() {
              var row = $(this).children().map(function() {
                if($(this).text() != '') { return $(this).text().trim(); }
              }).get();
              return [row];
            }).get();
          }, { districtTbSel: districtTbSel });
          bufferArr.push.apply(bufferArr, districtData);
          console.log(dropdownList2option+'-->'+dropdownList1option+'(Collected: '+bufferArr.length+')');
          this.back();
        });
      });
      this.then(function() {
        write(''+dropdownList2option[0]+'_L6.csv', bufferArr);
      });
    });

});

casper.run();
