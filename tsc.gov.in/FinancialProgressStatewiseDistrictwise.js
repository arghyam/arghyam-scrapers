var x       = require('casper').selectXPath,
    casper  = require('casper').create(
              {
                clientScripts   : "jquery.min.js"
              }),
    write   = require('./csv').write;

var stateTbId     = 'ctl00_ContentPlaceHolder1_gvshow',
    stateTbIds,
    stateTbSel    = '#'+ stateTbId +' tr:gt(1):lt(31)',
    stateData,
    stateName;

var districtTbId  = 'ctl00_ContentPlaceHolder1_gvDistrict',
    districtTbSel = '#'+ districtTbId +' tbody tr:gt(1)',
    districtData,
    buffer = [];

casper.start('http://tsc.gov.in/tsc/Report/Financial/RptFinancialProgressStatewiseDistrictwise.aspx?id=Home', function() {

  // returns [[ 'ctl00_ContentPlaceHolder1_gvshow_ctl03_lnkStnm', 'ANDHRA PRADESH' ],..]
  stateTbIds    = this.evaluate(function(stateTbId) {
    return $('#'+ stateTbId +'').find('a').map(function() {
      return [[ $(this).attr('id'), $(this).text() ]];
    }).get();
  }, {
    stateTbId:stateTbId
  });

  // returns [[30, WEST BENGAL, 174147.94, 111799.51, 43820.36, 18528.07, 65937.91, 19561.67, 32452.01, 117951.59, 53544.69, 18085.02, 32131.10, 103760.81],..]
  stateData = casper.evaluate(function(stateTbSel) {
    return $(stateTbSel).map(function() {
      var rows = $(this).children().map(function(){ if($(this).text() !== '') { return $(this).text().trim(); } }).get();
      return [rows];
    }).get();
  },{stateTbSel: stateTbSel});

  console.log('State', stateTbIds.length, '/', stateTbIds.length);

  this.then(function() {
    write('FinancialProgressStatewiseDistrictwise.state.csv', stateData);
  });

  this.each(stateTbIds, function(casper, stateID, index) {
    this.then(function() {
      this.click(x('//*[@id="' + stateID[0] + '"]'));
    });
    this.then(function() {
      // returns [[ANDHRA PRADESH, 7, KARIMNAGAR, 13-02-2003, 11/2012, 10849.48, 7165.48, 2612.85, 1071.15, 5602.87, 1943.23, 176.13, 7722.23, 4840.01, 1939.23, 176.13, 6955.37],..]
      districtData = this.evaluate(function(districtTbSel, stateName) {
        var rows = $(districtTbSel);
        return rows.map(function(i) {
          var row = $(this).children().map(function() {
            if($(this).text() !== '') { return $(this).text().trim(); }
          }).get();
          row.splice(0, 0, stateName);
          return [row];
        }).get();
      }, {
        districtTbSel  :  districtTbSel,
        stateName      :  stateID[1]
      });
      buffer.push.apply(buffer, districtData);
      console.log('District', index + 1, '/', stateTbIds.length, buffer.length, 'rows');
    });

    this.then(function() {
      this.back();
    });
  });

  this.then(function() {
    write('FinancialProgressStatewiseDistrictwise.district.csv', buffer);
  });

});
casper.run();
