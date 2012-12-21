var x       = require('casper').selectXPath,
    casper  = require('casper').create(
              {
                clientScripts   : "jquery.min.js"
              }),
    write   = require('./csv').write;

var stateTbIds,
    stateTbId       = 'ctl00_ContentPlaceHolder1_div_Data',
    stateTbSel    = '#ctl00_ContentPlaceHolder1_div_Data table:eq(1) tr:gt(3):lt(31)',
    stateData,
    stateName;

var districtTbSel = '#ctl00_ContentPlaceHolder1_div_Data table:eq(2) tr:gt(4)',
    districtData,
    buffer = [];

casper.start('http://tsc.gov.in/Report/Physical/RptCategoriesIHHLStatewiseDistrictwise_net.aspx?id=PHY', function()
{

  // returns [[ 'ctl00_ContentPlaceHolder1_gvshow_ctl03_lnkStnm', 'ANDHRA PRADESH' ],..]
  stateTbIds    = this.evaluate(function(stateTbId)
  {
    return $('#'+ stateTbId +'').find('a').map(function()
    { 
      return [[ $(this).attr('id'), $(this).text() ]] 
    }).get();
  }, 
  {
    stateTbId:stateTbId
  });

  // returns [[30, WEST BENGAL, 174147.94, 111799.51, 43820.36, 18528.07, 65937.91, 19561.67, 32452.01, 117951.59, 53544.69, 18085.02, 32131.10, 103760.81],..]
  stateData = casper.evaluate(function(stateTbSel)
  {
    return $(stateTbSel).map(function()
    {
      var rows = $(this).children().map(function(){ if($(this).text() != '') { return $(this).text().trim(); } }).get();
      return [rows];
    }).get();
  },{stateTbSel: stateTbSel});

  console.log('State : Completed', stateTbIds.length, 'out of', stateTbIds.length);

  this.then(function()
  {
    write('stateData_L18.csv', stateData);
  });

  this.each(stateTbIds, function(casper, stateID, index)
  {
    this.then(function()
    {
      this.click(x('//*[@id="' + stateID[0] + '"]'));
    });
    this.then(function()
    {
      // returns [[ANDHRA PRADESH, 7, KARIMNAGAR, 13-02-2003, 11/2012, 10849.48, 7165.48, 2612.85, 1071.15, 5602.87, 1943.23, 176.13, 7722.23, 4840.01, 1939.23, 176.13, 6955.37],..]
      districtData = this.evaluate(function(districtTbSel, stateName)
      {
        var rows = $(districtTbSel).not(':last');
        return rows.map(function(i)
        {
          var row = $(this).children().map(function()
          {
            if($(this).text() != '') { return $(this).text().trim(); }
          }).get();
          row.splice(0, 0, stateName);
          return [row];
        }).get();
      },
      {
        districtTbSel  :  districtTbSel,
        stateName      :  stateID[1]
      });
      buffer.push.apply(buffer, districtData);
      console.log('District : Completed ', index + 1, 'out of', stateTbIds.length, buffer.length, 'rows');
    });
    this.then(function()
    {
      this.back();
    });
  });

  this.then(function()
  {
    write('districtData_L18.csv', buffer);
  });

});
casper.run();