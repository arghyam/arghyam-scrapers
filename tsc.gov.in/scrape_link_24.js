var x       = require('casper').selectXPath,
    casper  = require('casper').create(
              {
                clientScripts   : "jquery.min.js"
              }),
    write   = require('./csv').write;

var stateTbId     = 'ctl00_ContentPlaceHolder1_div_Data',
    stateTbIds,
    stateTbSel    = '#'+ stateTbId +' tbody tr:gt(1)',
    stateData,
    stateName;

var districtTbId  = 'ctl00_ContentPlaceHolder1_div_Data',
    districtTbSel = '#'+ districtTbId +' tbody tr:gt(2)',
    districtData,
    buffer = [];

casper.start('http://tsc.gov.in/Report/Physical/RptOtherThanTSCProgramsStatewiseDistrictwise_net.aspx?id=PHY', function() {
  stateTbIds    = this.evaluate(function(stateTbId) {
    return $('#'+ stateTbId +'').find('a').map(function() {
      return [[ $(this).attr('id'), $(this).text() ]] 
    }).get();
  }, {
    stateTbId:stateTbId
  });

  stateData = casper.evaluate(function(stateTbSel) {
    return $(stateTbSel).map(function() {
      var rows = $(this).children().map(function(){ if($(this).text() != '') { return $(this).text().trim(); } }).get();
      return [rows];
    }).get();
  },{stateTbSel: stateTbSel});

  console.log('State : Completed', stateTbIds.length, 'out of', stateTbIds.length);

  this.then(function() {
    write('stateData_L24.csv', stateData);
  });

  this.each(stateTbIds, function(casper, stateID, index) {
    this.then(function() {
      this.click(x('//*[@id="' + stateID[0] + '"]'));
    });
    this.then(function() {
      districtData = this.evaluate(function(districtTbSel, stateName) {
        var rows = $(districtTbSel);
        return rows.map(function(i) {
          var row = $(this).children().map(function() {
            if($(this).text() != '') { 
              return $(this).text().trim(); 
            }
          }).get();
          row.splice(0, 0, stateName);
          return [row];
        }).get();
      }, {
        districtTbSel  :  districtTbSel,
        stateName      :  stateID[1]
      });
      buffer.push.apply(buffer, districtData);
      console.log('District : Completed ', index + 1, 'out of', stateTbIds.length, buffer.length, 'rows');
    });
    this.then(function() {
      this.back();
    });
  });

  this.then(function() {
    write('districtData_L24.csv', buffer);
  });

});
casper.run();