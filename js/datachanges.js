var datafiles = [		
		'../data-23-May-2013.csv',
		'../data-29-May-2013.csv',
		'../data-02-Jun-2013.csv',
		'../data-30-Jun-2013.csv',
		'../data-07-Jul-2013.csv',
		'../data-28-Jul-2013.csv',
		'../data-04-Aug-2013.csv',
		'../data-25-Aug-2013.csv',
		'../data-01-Sep-2013.csv',
		'../data-29-Sep-2013.csv',
		'../data-06-Oct-2013.csv',
		'../data-27-Oct-2013.csv',
		'../data-03-Nov-2013.csv',
		'../data-24-Nov-2013.csv',
		'../data-01-Dec-2013.csv',
		'../data-29-Dec-2013.csv',
		'../data-05-Jan-2014.csv',
		'../data-26-Jan-2014.csv',
		'../data-02-Feb-2014.csv',
		'../data-23-Feb-2014.csv',
		'../data-02-Mar-2014.csv',
		'../data-30-Mar-2014.csv',
		'../data-06-Apr-2014.csv',		
		'../data-27-Apr-2014.csv'
];

var months = [], unique_months;
for(var m = 0; m < datafiles.length, month=datafiles[m]; m++){
	months.push(month.substring(11, 19));
}
unique_months = months.filter(function(m,i,a){
    return i==a.indexOf(m);
});

var fs = require('fs'), filedata1 = [], filedata2 = [], 
		arrdata1 = [], arrdata2 = [], 
		lines1 = [], lines2 = [], result = [], values = [];		

var filedata0 = fs.read(datafiles[0]);
var arrdata0 = filedata0.split(/\r/)[0];
var headers = ['Date,' + arrdata0];

result.push(headers);

 for(var u = 0; u < unique_months.length, um = unique_months[u]; u++){
 	f1 = u * 2, f2 = u * 2 + 1;
 	datafiles[f2] ? date = datafiles[f2].slice(8, 19) : date = datafiles[f1].slice(8, 19);
 	filedata1[f1] =  fs.read(datafiles[f1]);
 	datafiles[f2] ? filedata2[f2] =  fs.read(datafiles[f2]) : filedata2[f2] = filedata1[f1];
 	arrdata1[f1] = filedata1[f1].split(/\r\n|\n/);		
	arrdata2[f2] = filedata2[f2].split(/\r\n|\n/);		
	for(var n = 1; n < 608; n++){
		lines1 = arrdata1[f1][n].toString().split(',');
		lines2 = arrdata2[f2][n].toString().split(',');
		for(var s = 3; s < lines1.length; s++ ){
		 	//diff in the values
		 	lines1[s] = lines2[s] - lines1[s];
		}	
		result.push('\n' + date +','+ lines1);				
 	}
 }	

try {
		fs.write('../datachanges-raw.csv', result, 'w');
} catch(e) {
		console.log(e);
}	
	
phantom.exit();	