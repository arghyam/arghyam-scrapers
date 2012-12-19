var x               = require('casper').selectXPath,
    casper          = require('casper').create({clientScripts: "jquery.min.js"}),
    write           = require('./csv').write;

var stateSel        = '#ctl00_ContentPlaceHolder1_Div1 ul:gt(0) li a',
    stateTbSel      = '#ctl00_ContentPlaceHolder2_divData table tbody:eq(1) tr:gt(0),#ctl00_ContentPlaceHolder2_divData table tbody:eq(2) tr:gt(0)',
    stateData,
    stateList;

var districtSel     = '#ctl00_ContentPlaceHolder1_Div1 ul:gt(0) li a',
    districtTbSel   = '#ctl00_ContentPlaceHolder2_div_Data table:eq(0) tr:gt(4) td:nth-child(2), #ctl00_ContentPlaceHolder2_div_Data table:eq(3) tr:gt(1):lt(9) td:nth-child(3),#ctl00_ContentPlaceHolder2_div_Data table:eq(3) tr:gt(1):lt(9) td:nth-child(4),#ctl00_ContentPlaceHolder2_div_Data table:eq(3) tr:gt(1):lt(9) td:nth-child(5)',
    districtData,
    districtList;

var gpSel           = '#ctl00_ContentPlaceHolder1_Div1 ul:gt(0) li a',
    gpTbSel         = '#ctl00_ContentPlaceHolder1_div_Data table:eq(1) tr:gt(1) td:nth-child(3),#ctl00_ContentPlaceHolder1_div_Data table:eq(1) tr:gt(1) td:nth-child(4),#ctl00_ContentPlaceHolder1_div_Data table:eq(1) tr:gt(1) td:nth-child(5),#ctl00_ContentPlaceHolder1_div_Data table:eq(2) tr:gt(1):lt(7) td:gt(1),#ctl00_ContentPlaceHolder1_gvSch tr:gt(0) td:gt(0)',
    gpData,
    gpList;

var buffer_state    = [],
    buffer_gp       = [],
    buffer_district = [];

casper.start('http://tsc.gov.in/NBA/NBAHome.aspx', function()
{
  
  stateList = this.evaluate(function(stateSel)
  {
    return $(stateSel).map(function(){ return [[ $(this).attr('id'),$(this).text().trim() ]] }).get();
  },
  {
    stateSel : stateSel
  });

  this.each(stateList, function(casper, state, index)
  {
    this.then(function()
    {
      this.click(x('//*[@id="'+ state[0] +'"]'));
    });
    this.then(function()
    {
      stateData = this.evaluate(function(stateTbSel, state)
      {
        var rows = $(stateTbSel);
        rows = rows.map(function(){ return $(this).children().map(function(){ return $(this).text().trim() }).get().slice(1); }).get();
        rows.splice(0,0, state[1])
        return [rows];
      },
      {
        stateTbSel : stateTbSel,
        state      : state
      });
      buffer_state.push.apply(buffer_state, stateData);
      console.log('State '+ (index + 1) +' out of '+stateList.length+' completed '+buffer_state.length+'Collected');
    });
    
    // district level ---->
    this.then(function()
    {
      districtList = this.evaluate(function(districtSel)
      {
        return $(districtSel).map(function(){ return [[ $(this).attr('id'),$(this).text().trim() ]] }).get();
      },
      {
        districtSel : districtSel
      });
      this.each(districtList, function(casper, district, index)
      {
        this.then(function()
        {
          this.click(x('//*[@id="'+ district[0] +'"]'));
        });
        this.then(function()
        {
          districtData = this.evaluate(function(districtTbSel, district)
          {
            var rows = $(districtTbSel);
            rows = rows.map(function(){ return $(this).children().map(function(){ return $(this).text().trim() }).get().slice(1); }).get();
            rows.splice(0,0, district[1])
            return [rows];
          },
          {
            districtTbSel : districtTbSel,
            district      : district
          });
          
          buffer_district.push.apply(buffer_district, districtData);
          console.log('District '+ (index + 1) +' out of '+districtList.length+' completed '+buffer_district.length+'Collected');
        });

        //-----------> GP Level

        this.then(function()
        {
          gpList = this.evaluate(function(gpSel)
          {
            return $(gpSel).map(function(){ return [[ $(this).attr('id'),$(this).text().trim() ]] }).get();
          },
          {
            gpSel : gpSel
          });
          
          this.each(gpList, function(casper, gp, index)
          {
            this.then(function()
            {
              this.click(x('//*[@id="'+ gp[0] +'"]'));
            });
            this.then(function()
            {
              gpData = this.evaluate(function(gpTbSel, gp)
              {
                var rows = $(gpTbSel);
                rows = rows.map(function(){ return $(this).children().map(function(){ return $(this).text().trim() }).get().slice(1); }).get();
                rows.splice(0,0, gp[1])
                return [rows];
              },
              {
                gpTbSel       : gpTbSel,
                gp            : gp
              });
              buffer_gp.push.apply(buffer_gp, gpData);
              console.log('GP '+ (index + 1) +' out of '+gpList.length+' completed '+buffer_gp.length+'Collected');
            });
            this.then(function()
            {
              this.back();
            });
          });
        });

        // <---------- GP Level

        this.then(function()
        {
          this.back();
        });
      });
    });
    // <----

    this.then(function()
    {
      this.back();
    });
  });

  this.then(function()
  {
    write('stateData_L14.csv', buffer_state);
  });
  this.then(function()
  {
    write('districtData_L14.csv', buffer_district);
  });
  this.then(function()
  {
    write('GP_L14.csv', buffer_gp);
  });
});

casper.run();