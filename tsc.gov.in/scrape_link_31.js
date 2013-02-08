var x       = require('casper').selectXPath,
    casper  = require('casper').create(
              {
                clientScripts   : "jquery.min.js"
              }),
    write   = require('./csv').write;

var stateTbSel = '#ctl00_ContentPlaceHolder1_div_Data tr:gt(2):lt(31)',
    stateData,
    gpTbSel = '#ctl00_ContentPlaceHolder1_div1 table:eq(0) tr:gt(1), #ctl00_ContentPlaceHolder1_div1 table:eq(1) tr:gt(1)',
    gpData,
    stateTbIds,
    blockTbIds,
    districtTbIds;

var districtTbSel = '#ctl00_ContentPlaceHolder1_div_Data tr:gt(3)',
    districtTbId  = 'ctl00_ContentPlaceHolder1_div_Data',
    blockTbId = 'ctl00_ContentPlaceHolder1_div_Data',
    gpTbId = 'ctl00_ContentPlaceHolder1_div_Data',
    stateTbId     = 'ctl00_ContentPlaceHolder1_div_Data';

var districtBuffer = [],
    blockBuffer = [];

var gpBuffer = [];

casper.start('http://tsc.gov.in/tsc/Report/PanchayatReport/RptMarkingProjectedGps_net.aspx?id=Home', function()
{
  stateTbIds    = this.evaluate(function(stateTbId)
  {
    return $('#'+ stateTbId +'').find('a').map(function()
    { 
      return [[ $(this).attr('id'), $(this).text() ]]
    }).get();
  },
  {stateTbId:stateTbId});
  stateData = casper.evaluate(function(stateTbSel)
  {
    return $(stateTbSel).map(function()
    {
      var rows = $(this).children().map(function(){ if($(this).text() != '') { return $(this).text().trim(); } }).get();
      return [rows];
    }).get();
  },{stateTbSel: stateTbSel});
  this.then(function()
  {
    write('stateData_L31.csv', stateData);
  });


  this.each(stateTbIds, function(casper, stateID, index) {
    this.then(function() {
      this.click(x('//*[@id="' + stateID[0] + '"]'));
    });
    this.then(function() {
      districtTbIds = this.evaluate(function(districtTbId)
      {
        return $('#'+ districtTbId +' .TdItems_Left a[href]').map(function()
        {
          return [[ $(this).attr('id'), $(this).text().trim() ]];
        }).get();
      },
      {districtTbId:districtTbId});
      console.log('State: ' +stateID[1]+ ' ' +(index+1)+ '/' +stateTbIds.length);

      this.then(function() {
        this.each(districtTbIds, function(casper, districtID, index) {
          this.then(function() {
            this.click(x('//*[@id="' + districtID[0] + '"]'));
          });
          this.then(function() {
            blockTbIds = this.evaluate(function(blockTbId)
            {
              return $('#'+ blockTbId +' .TdItems_Left a[href]').map(function()
              {
                return [[ $(this).attr('id'), $(this).text().trim() ]];
              }).get();
            },
            {blockTbId:blockTbId});
            console.log('-> District: ' +districtID[1]+ ' ' +(index+1)+ '/' +districtTbIds.length);

            this.then(function() {
              this.each(blockTbIds, function(casper, blockID, index) {
                this.then(function() {
                  this.click(x('//*[@id="' + blockID[0] + '"]'));
                });
                this.then(function() {
                  gpTbIds = this.evaluate(function(gpTbId)
                  {
                    return $('#'+ gpTbId +' .TdItems_Left a[href]').map(function()
                    {
                      return [[ $(this).attr('id'), $(this).text().trim() ]];
                    }).get();
                  },
                  {gpTbId:gpTbId});
                  console.log('--> Block: ' +blockID[1]+ ' ' +(index+1)+ '/' +blockTbIds.length);

                  this.then(function() {
                    this.each(gpTbIds, function(casper, gpID, index) {
                      this.then(function() {
                        this.click(x('//*[@id="' + gpID[0] + '"]'));
                      });
                      this.then(function() {
                        gpData = this.evaluate(function(gpTbSel, stateName, districtName, gpName)
                        {
                          var rows = $(gpTbSel).not(':last').not(':last');
                          return rows.map(function(i)
                          {
                            var row = $(this).children().map(function()
                            {
                              if($(this).text() != '') { return $(this).text().trim(); }
                            }).get();
                            row.splice(1, 1, stateName, districtName, gpName);
                            return [row];
                          }).get();
                        },
                        {
                          gpTbSel        :  gpTbSel,
                          stateName      :  stateID[1],
                          districtName   :  districtID[1],
                          gpName         :  gpID[1]
                        });
                        gpBuffer.push.apply(gpBuffer, gpData);
                        console.log('--> Gram Panchayath: ' +gpID[1]+ ' ' +(index+1)+ '/' +gpTbIds.length);
                      });
                      this.then(function()
                      {
                        write('gpData_L31.csv', gpBuffer);
                        gpBuffer = [];
                      });
                      this.then(function() {
                        this.back();
                      });
                    });
                  });

                });
                this.then(function() {
                  this.back();
                });
              });
            });

          });
          this.then(function() {
            this.back();
          });
        });
      });



    });
    this.then(function() {
      this.back();
    });
  });
});

casper.run();