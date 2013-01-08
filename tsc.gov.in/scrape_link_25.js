var x       = require('casper').selectXPath,
    casper  = require('casper').create(
              {
                clientScripts   : "jquery.min.js"
              }),
    write   = require('./csv').write;

var yearTbSel     = '#ctl00_ContentPlaceHolder1_div_Data .Table tr:gt(1)',
    yearData,
    yearList;

var stateTbSel    = '#ctl00_ContentPlaceHolder1_div_Data .Table tr:gt(1)',
    stateData,
    stateList;

var districtTbSel   = '#ctl00_ContentPlaceHolder1_div_Data .Table tr:gt(1)',
    districtData;

var buffer_year = [],
    buffer_state = [],
    buffer_district = [];

casper.start('http://tsc.gov.in/Report/Financial/RptIndiaLevelFinyrwise.aspx?id=FIN', function() {
  yearList = this.evaluate(function(yearTbSel) {
    return $(yearTbSel).find('a').map(function() {
      return [[ $(this).text() ]]
    }).get();
  },{
    yearTbSel:yearTbSel
  });

  yearData = this.evaluate(function(yearTbSel) {
    return $(yearTbSel).map(function() {
      var rows = $(this).children().map(function(){ if($(this).text() != '') { return $(this).text().trim(); } }).get();
      return [rows];
    }).get();
  }, {
    yearTbSel: yearTbSel
  });
  buffer_year.push.apply(buffer_year, yearData);
  console.log('Year : Completed ', buffer_year.length, 'out of', yearList.length, buffer_year.length, 'rows');

  this.each(yearList, function(casper, year, index) {
    this.then(function() {
      this.clickLabel(year, 'a');
    });
    
    this.then(function() {
      stateData = this.evaluate(function(stateTbSel, year) {
        var rows = $(stateTbSel);
        return rows.map(function(i) {
          var row = $(this).children().map(function() {
            if($(this).text() != '') { return $(this).text().trim(); }
          }).get();
          row.splice(0, 0, year);
          return [row];
        }).get();
      },{
        stateTbSel     :  stateTbSel,
        year           :  year[0]
      });

      stateList = this.evaluate(function(stateTbSel) {
        return $(stateTbSel).find('a').map(function() {
          if ($(this).text().trim() != "") { return [[ $(this).text().trim() ]] }
        }).get();
      }, {
        stateTbSel:stateTbSel
      });
      buffer_state.push.apply(buffer_state, stateData);
      console.log('State : Completed ', index + 1, 'out of', stateList.length, buffer_state.length, 'rows');

      this.each(stateList, function(casper, state, index) {
        this.then(function() {
          this.clickLabel(state, 'a');
        });
        this.then(function() {
          districtData = this.evaluate(function(districtTbSel, state, year) {
            var rows = $(districtTbSel);
            return rows.map(function(i) {
              var row = $(this).children().map(function() {
                if($(this).text() != '') { return $(this).text().trim(); }
              }).get();
              row.splice(0, 0, state);
              row.splice(0, 0, year);
              return [row];
            }).get();
          }, {
            districtTbSel  :  districtTbSel,
            state          :  state[0],
            year           :  year[0]
          });
          buffer_district.push.apply(buffer_district, districtData);
          console.log('District : Completed ', index + 1, 'out of', stateList.length, buffer_district.length, 'rows');
        });
        this.then(function() {
            this.back();
        });
      });
      this.then(function() {
        write(year+'districtData_L25.csv', buffer_district);
        buffer_district = [];
      });
    });

    this.then(function() {
        write(year+'stateData_L25.csv', buffer_state);
        buffer_state = [];
    });
    this.then(function() {
        this.back();
    });
  });
  this.then(function() {
    write('yearData_L25.csv', buffer_year);
    buffer_year = [];
  });
});

casper.run();