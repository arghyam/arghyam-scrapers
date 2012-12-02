var x       = require('casper').selectXPath,
    casper  = require('casper').create({
                clientScripts       : "jquery.min.js"
                }),
    fs      = require('fs'),
    handle  ;

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

casper.start('http://tsc.gov.in/Report/Physical/RptPhysicalProgessStateWiseDistrictwise.aspx?id=Home', function()
{
    var stateTbClassname = "Table";
    var stateTbIDstartswith = "ctl00_ContentPlaceHolder1_rptAbstract";
    // return state table IDs
    var stateTbIDs = this.evaluate(function(stateTbIDstartswith){ 
        return $('a[id^='+stateTbIDstartswith+']')
            .map(function(){
                return $(this).attr('id');  
            }).get();   
    }, {stateTbIDstartswith:stateTbIDstartswith});
    var distTableClassname = "Table";
    // return state table data
    var stateArr = [];
    var districtArr = [];
    var stateData = 
    this.evaluate(function(stateTbClassname){
        return $('.'+stateTbClassname+' tbody')
            .children()
            .slice(2)
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
    stateArr.push.apply(stateArr, stateData);
    casper.then(function() {
        handle = fs.open('stateData_L4.csv', 'w');
        handle.write(csv(stateArr));
        handle.close();
    });
    casper.each(stateTbIDs, function(casper, stateID, index)
    {
        this.then(function()
        {
            this.click(x('//*[@id="'+ stateID +'"]'));
        });
        this.then(function()
        {
            // return district table data
            var districtData = 
            this.evaluate(function(distTableClassname){
                return $('.'+ distTableClassname +' tbody tr')
                    .slice(3)
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
            districtArr.push.apply(districtArr, districtData);
            console.log('District:', index, 'out of', stateTbIDs.length, districtArr.length, 'rows');
            this.back();
        });
    });
    casper.then(function() {
        handle = fs.open('districtData_L4.csv', 'w');
        handle.write(csv(districtArr));
        handle.close();
    });
});

casper.run();

