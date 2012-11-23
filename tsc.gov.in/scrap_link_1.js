var x           = require('casper').selectXPath,
    casper      = require('casper').create({
                        clientScripts       : "jquery.min.js"
                    });

casper.start('http://tsc.gov.in/Report/Financial/RptFinancialProgressStatewiseDistrictwise.aspx?id=Home', function()
{
    var stateTbId = "ctl00_ContentPlaceHolder1_gvshow";
    var districtTbId  = "ctl00_ContentPlaceHolder1_gvDistrict";
    var stateTbIds = this.evaluate(function(stateTbId){ 
                                return $('a[id^='+stateTbId+']')
                                                                .map(function(){  
                                                                    return $(this)
                                                                                    .attr('id');  
                                                                }).get();   
                            }, {stateTbId:stateTbId});
    // returns data from the state table
    this.evaluate(function(stateTbId){
        return $('#'+stateTbId+' tbody tr')
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
    },{stateTbId: stateTbId});
    casper.each(stateTbIds, function(casper, stateID, index)
    {
        this.then(function()
        {
            this.click(x('//*[@id="'+ stateID +'"]'));
        });
        this.then(function()
        {
            // returns data from the district table
            this.evaluate(function(districtTbId){   
                return $('#'+ districtTbId +' tbody tr')
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
            }, {districtTbId: districtTbId});
            this.back();
        });
    });

});

casper.run();

