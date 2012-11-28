var fs = require('fs');

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


function write(filename, data) {
    var handle = fs.open(filename, 'w');
    handle.write(csv(data));
    handle.close();
}

var x = require('casper').selectXPath,
    casper = require('casper').create({
    logLevel            : "debug",
    verbose             : true,
    clientScripts       : "jquery.min.js"
});

casper.start('http://tsc.gov.in/Report/otherreports/RptFinancialProgofSchemes.aspx?id=Home', function()
{
    var stateTbClassname = "Table";
    // get me state table data
    var arr = this.evaluate(function(stateTbClassname){
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
    // write csv file
    write('stateData-L8.csv', arr);
});

casper.run();

