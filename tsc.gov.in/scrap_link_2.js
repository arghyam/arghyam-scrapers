var x       = require('casper').selectXPath,
    casper  = require('casper').create({
                clientScripts   :   "jquery.min.js"
                });

casper.start('http://tsc.gov.in/Report/ProjectSanctioned/RptProjectApprovedStatewise_net.aspx?id=Home', function()
{
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
    casper.each(stateTbIDs, function(casper, stateID, index)
    {
        this.then(function()
        {
            this.click(x('//*[@id="'+ stateID +'"]'));
        });
        this.then(function()
        {
            // returns district table data
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
            this.back();
        });
    });
});

casper.run();

