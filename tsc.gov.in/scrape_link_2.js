var x       = require('casper').selectXPath,
    casper  = require('casper').create({
                clientScripts   :   "jquery.min.js"
                }),
    fs      = require('fs'),
    handle;

// csv(array_of_arrays) --> csv string
var csv = (function(delimiter) {
    reFormat = new RegExp("[\"" + delimiter + "\n]");

    function formatRow(row) {
        return row.map(formatValue).join(delimiter);
    }

    function formatValue(text) {
        return reFormat.test(text) ? "\"" + text.replace(/\"/g, "\"\"") + "\"" : text;
    }

    return function (rows) {
        return rows.map(formatRow).join("\n");
    };
})(',');
var results = [];
casper.start('http://tsc.gov.in/Report/ProjectSanctioned/RptProjectApprovedStatewise_net.aspx?id=Home', function()
{
    handle = fs.open('stateData_L2.csv', 'w');
    var stateTbClassname = "Table";
    var stateTbIDstartswith = "ctl00_ContentPlaceHolder1_rpt_Report_StateWise";
    // return state table IDs
    var stateTbIDs = this.evaluate(function(stateTbIDstartswith){ 
        return $('a[id^='+stateTbIDstartswith+']')
            .map(function(){  
                return $(this)
                    .attr('id');  
            }).get();   
    }, {stateTbIDstartswith:stateTbIDstartswith});
    var distTableClassname = "Table";
    // returns state table data
    var stateData =
    this.evaluate(function(stateTbClassname){
        return $('.'+stateTbClassname+' tbody')
            .children()
            .slice(3)
            .not(':last')
            .map(function(){  
                return [
                    $(this)
                        .children()
                        .map(function(){ 
                            return $(this)
                                .text()
                                .trim(); 
                        }).get()
                        ];  
            }).get();  
    },{stateTbClassname: stateTbClassname});
    handle.write(csv(stateData));
    handle.close();
    handle = fs.open('districtData_L2.csv','w');
    var districtData;
    casper.each(stateTbIDs, function(casper, stateID, index)
    {
        this.then(function()
        {
            this.click(x('//*[@id="'+ stateID +'"]'));
        });
        this.then(function()
        {
            // returns district table data
            districtData = 
            this.evaluate(function(distTableClassname){   
                return $('.'+ distTableClassname +' tbody tr')
                    .slice(4)
                    .not(':last')
                    .map(function(){  
                        return [
                            $(this)
                                .children()
                                .map(function(){ 
                                    return $(this)
                                        .text()
                                        .trim(); 
                                }).get()
                                ];  
                    }).get();    
            }, {distTableClassname: distTableClassname});
            results.push.apply(results, districtData);
            console.log('District:', index, 'out of', stateTbIDs.length, results.length, 'rows');
            this.back();
        });
    });
    casper.then(function() {
        handle = fs.open('districtData_L2.csv', 'w');
        handle.write(csv(results));
        handle.close();
    });
});



casper.run();

