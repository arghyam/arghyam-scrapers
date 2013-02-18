var x       = require('casper').selectXPath,
    casper  = require('casper').create(
              {
                clientScripts   : "jquery.min.js"
              }),
    write   = require('./csv').write;

var stateTbId     = 'ctl00_ContentPlaceHolder1_div_Data',
    stateTbSel = '#ctl00_ContentPlaceHolder1_div_Data tr:gt(2):lt(32)',
    stateData;

var gpinfoTbSel = '#ctl00_ContentPlaceHolder1_div1 table:eq(0) tr:gt(1), #ctl00_ContentPlaceHolder1_div1 table:eq(1) tr:gt(1)',
    gpTbSel = '#ctl00_ContentPlaceHolder1_div_Data tr:gt(3)',
    gpData,
    gpInfoData,
    stateLinks,
    districtLinks,
    blockTbIds,
    blockTbSel = '#ctl00_ContentPlaceHolder1_div_Data tr:gt(3)',
    districtTbIds;

var districtTbSel = '#ctl00_ContentPlaceHolder1_div_Data tr:gt(3)',
    districtTbId  = 'ctl00_ContentPlaceHolder1_div_Data',
    blockTbId = 'ctl00_ContentPlaceHolder1_div_Data',
    gpTbId = 'ctl00_ContentPlaceHolder1_div_Data';

var gpInfoBuffer = [];

var districtBuffer = [],
    blockBuffer = [];

var gpBuffer = [];

var districtBuffer = [];

casper.start('http://tsc.gov.in/tsc/Report/PanchayatReport/RptStateWiseBaseLineServeyData_net.aspx?id=Home', function()
{
  this.then(function() {
    this.click(x('//*[@id="ctl00_ContentPlaceHolder1_btnSubmit"]'));
  });
  this.then(function() {
  stateLinks    = this.evaluate(function(stateTbId)
  {
    return $('#'+ stateTbId +' .TdItems_Left a[href]').map(function()
    {
      return [[ $(this).attr('id'), $(this).text() ]];
    }).get();
  },
  {stateTbId:stateTbId});

      stateData = this.evaluate(function(stateTbSel)
      {
        var rows = $(stateTbSel).not(':last');
        return rows.map(function(i)
        {
          var row = $(this).children().map(function()
          {
            if($(this).text() != '') { return $(this).text().trim(); }
          }).get();
          if ((rows.length - 1) == i) { row.splice(0, 0, ''); }
          return [row];
        }).get();
      },
      {
        stateTbSel  :  stateTbSel
      });
  this.then(function()
  {
    write('stateData_L32.csv', stateData);
  });


  this.each(stateLinks, function(casper, state, index)
  {
    this.then(function()
    {
      this.waitFor(function check() {
        return this.exists(x('//*[@id="' + state[0] + '"]'));
      }, function then() {
        this.click(x('//*[@id="' + state[0] + '"]'));
      }, function notThen() {
        this.reload();
      }, 10000000);
    });

    this.then(function()
    {
      districtLinks    = this.evaluate(function(districtTbId)
      {
        return $('#'+ districtTbId +' .TdItems_Left a[href]').map(function()
        {
          return [[ $(this).attr('id'), $(this).text() ]];
        }).get();
      },
      {districtTbId:districtTbId});
      districtData = this.evaluate(function(districtTbSel, stateName)
      {
        var rows = $(districtTbSel).not(':last');
        return rows.map(function(i)
        {
          var row = $(this).children().map(function()
          {
            if($(this).text() != '') { return $(this).text().trim(); }
          }).get();
          if ((rows.length - 1) == i) { row.splice(0, 0, ''); }
          row.splice(0, 0, stateName);
          return [row];
        }).get();
      },
      {
        districtTbSel  :  districtTbSel,
        stateName      :  state[1]
      });
      districtBuffer.push.apply(districtBuffer, districtData);
    });
    this.then(function()
    {
      console.log('State: '+ state[1] +' '+ (index+1) +'/'+ stateLinks.length +' Buffer: '+ districtBuffer.length);
      write('districtData_L32.csv', districtBuffer);
      districtBuffer = [];
    });

this.then(function() {
  this.each(districtLinks, function(casper, district, index)
  {
    this.then(function()
    {
      this.waitFor(function check() {
        return this.exists(x('//*[@id="' + district[0] + '"]'));
      }, function then() {
        this.click(x('//*[@id="' + district[0] + '"]'));
      }, function notThen() {
        this.reload();
      }, 10000000);
      
    });

    this.then(function()
    {
      blockLinks    = this.evaluate(function(blockTbId)
      {
        return $('#'+ blockTbId +' .TdItems_Left a[href]').map(function()
        {
          return [[ $(this).attr('id'), $(this).text().trim() ]];
        }).get();
      },
      {blockTbId:blockTbId});

      blockData = this.evaluate(function(blockTbSel, stateName, districtName)
      {
        var rows = $(blockTbSel).not(':last');
        return rows.map(function(i)
        {
          var row = $(this).children().map(function()
          {
            if($(this).text() != '') { return $(this).text().trim(); }
          }).get();
          if ((rows.length - 1) == i) { row.splice(0, 0, ''); }
          row.splice(0, 0, stateName, districtName);
          return [row];
        }).get();
      },
      {
        blockTbSel        :  blockTbSel,
        stateName         :  state[1],
        districtName      :  district[1]
      });
      blockBuffer.push.apply(blockBuffer, blockData);
    });
    this.then(function()
    {
      console.log('District: '+ district[1] +' '+ (index+1) +'/'+ districtLinks.length +' Buffer: '+ blockBuffer.length);
      write('blockData_L32.csv', blockBuffer);
      blockBuffer = [];
    });

this.then(function() {
  this.each(blockLinks, function(casper, block, index)
  {
    this.then(function()
    {
      this.waitFor(function check() {
        return this.exists(x('//*[@id="' + block[0] + '"]'));
      }, function then() {
        this.click(x('//*[@id="' + block[0] + '"]'));
      }, function notThen() {
        this.reload();
      }, 10000000);
    });

    this.then(function()
    {
      gpData = this.evaluate(function(gpTbSel, stateName, districtName, blockName)
      {
        var rows = $(gpTbSel).not(':last');
        return rows.map(function(i)
        {
          var row = $(this).children().map(function()
          {
            if($(this).text() != '') { return $(this).text().trim(); }
          }).get();
          if ((rows.length - 1) == i) { row.splice(0, 0, ''); }
          row.splice(0, 0, stateName, districtName, blockName);
          return [row];
        }).get();
      },
      {
        gpTbSel           :  gpTbSel,
        stateName         :  state[1],
        districtName      :  district[1],
        blockName         :  block[1]
      });
      gpBuffer.push.apply(gpBuffer, gpData);
    });
    this.then(function()
    {
      console.log('Block: '+ block[1] +' '+ (index+1) +'/'+ blockLinks.length +' Buffer: '+ gpBuffer.length);
      write('gpData_L32.csv', gpBuffer);
      gpBuffer = [];
    });

    this.then(function()
    {
      this.back();
    });
  });
});

    this.then(function()
    {
      this.back();
    });
  });
});

    this.then(function()
    {
      this.back();
    });
  });

});
});

casper.run();