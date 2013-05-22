var x       = require('casper').selectXPath,
    casper  = require('casper').create(
              {
                clientScripts   : "jquery.min.js"
              }),
    write   = require('./csv').write;

var stateTbId     = 'ctl00_ContentPlaceHolder1_gvShow',
    stateTbIds,
    stateTbSel    = '#'+ stateTbId +' tr:gt(1)',
    stateData,
    stateName;

var districtTbId  = 'ctl00_ContentPlaceHolder1_gvDistrict',
    districtTbSel = '#'+ districtTbId +' tr:gt(1)',
    districtData,
    buffer = [];

casper.start('http://tsc.gov.in/tsc/Report/Physical/RptPerwiseAchCensus_net.aspx?id=PHY', function() {
  stateTbIds    = this.evaluate(function(stateTbId) {
    return $('#'+ stateTbId +'').find('a').map(function() {
      return [[ $(this).text() ]]
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
    write('stateData_L19.csv', stateData);
  });

  this.each(stateTbIds, function(casper, stateID, index) {
    this.then(function() {
      this.clickLabel(stateID[0], 'a');
    });
    this.then(function() {
      districtData = this.evaluate(function(districtTbSel, stateName) {
        var rows = $(districtTbSel);
        return rows.map(function(i) {
          var row = $(this).children().map(function() {
            if($(this).text() != '') { return $(this).text().trim(); }
          }).get();
          row.splice(0, 0, stateName);
          return [row];
        }).get();
      }, {
        districtTbSel  :  districtTbSel,
        stateName      :  stateID[0]
      });

      buffer.push.apply(buffer, districtData);
      console.log('District : Completed ', index + 1, 'out of', stateTbIds.length, buffer.length, 'rows');
    });
    this.then(function() {
      this.back();
    });
  });

  this.then(function() {
    write('districtData_L19.csv', buffer);
  });

});
casper.run();