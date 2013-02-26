var color = d3.scale.linear()
    .clamp(true)
    .domain([0, 0.5, 1, 2])
    .range(['#D73027', '#FFFFBF', '#1A9850', '#000']);

// Display formats
var F = d3.format(',.0f'); // Float
var N = d3.format(',.0f'); // Number == int
var P = d3.format('.1%');  // Percent

function sum(d, metric) {
    return d.depth == 2 ? d[metric] :
           d.depth == 1 ? d3.sum(d.values, function(v) { return v[metric]; })
                        : 0;
}

function hover_text(story) {
  return function(d) {
    var prefix = d.depth == 2 ? d['State_Name'] + ' - ' + d['District_Name'] + ': ' :
                 d.depth == 1 ? d['key'] + ': '
                              : '';
    var num = sum(d, story.num[1]);
    var den = sum(d, story.den[1]);
    var size = sum(d, story.area[1]);
    return (prefix +
        story.area[0] + ' = ' + N(size) + '. ' +
        story.num[0] + ' / ' + story.den[0] + ' = ' +
        N(num) + ' / ' + N(den) + ' = ' + P(num / den)
    );
  };
}

function storify(story) {
    story.size = function(d) { return d[story.area[1]]; };
    story.filter = function(d) { return (d.Date == '10-12-2012') && (!d.District_Name.match(/^Total/)); };
    story.color = function(d) { return color(sum(d, story.num[1]) / sum(d, story.den[1])); };
    story.hover = hover_text(story);
    return story;
}

var stories = [
    storify({
        'menu'  : 'Financial Progress',
        'title' : 'Project outlay used',
        'file'  : 'data/tsc.gov.in/districtData_L1.csv',
        'url'   : 'http://tsc.gov.in/tsc/Report/Financial/RptFinancialProgressStatewiseDistrictwise.aspx?id=Home',
        'group' : ['State_Name'],
        'area'  : ['Total outlay', 'Total_Projects_Outlay'],
        'num'   : ['Total expenses', 'ExpReported_Total'],
        'den'   : ['Total outlay', 'Total_Projects_Outlay'],
        'story' : 'Story to be written...'
    }),
    storify({
        'menu'  : 'Financial Progress',
        'title' : 'Share of centre',
        'file'  : 'data/tsc.gov.in/districtData_L1.csv',
        'url'   : 'http://tsc.gov.in/tsc/Report/Financial/RptFinancialProgressStatewiseDistrictwise.aspx?id=Home',
        'group' : ['State_Name'],
        'area'  : ['Total outlay', 'Total_Projects_Outlay'],
        'num'   : ['Centre expenses', 'ExpReported_Center'],
        'den'   : ['Total expenses', 'ExpReported_Total'],
        'story' : 'Story to be written...'
    }),
    storify({
        'menu'  : 'Physical Progress',
        'title' : '% toilets built below poverty household',
        'file'  : 'data/tsc.gov.in/districtData_L4.csv',
        'url'   : 'http://tsc.gov.in/tsc/Report/Physical/RptPhysicalProgessStateWiseDistrictwise.aspx?id=Home',
        'group' : ['State_Name'],
        'area'  : ['Planned BPL toilets', 'PO_IHHL_BPL'],
        'num'   : ['Built BPL toilets', 'PP_IHHL_BPL'],
        'den'   : ['Planned BPL toilets', 'PO_IHHL_BPL'],
        'story' : 'Story to be written...'
    }),
    storify({
        'menu'  : 'Physical Progress',
        'title' : '% toilets built above poverty household',
        'file'  : 'data/tsc.gov.in/districtData_L4.csv',
        'url'   : 'http://tsc.gov.in/tsc/Report/Physical/RptPhysicalProgessStateWiseDistrictwise.aspx?id=Home',
        'group' : ['State_Name'],
        'area'  : ['Planned APL toilets', 'PO_IHHL_APL'],
        'num'   : ['Built APL toilets', 'PP_IHHL_APL'],
        'den'   : ['Planned APL toilets', 'PO_IHHL_APL'],
        'story' : 'Story to be written...'
    }),
    storify({
        'menu'  : 'Financial Progress',
        'title' : '% SC in Total Release',
        'file'  : 'data/tsc.gov.in/districtData_L6.csv',
        'url'   : 'http://tsc.gov.in/tsc/Report/Release/RptReleaseDataBetweenDates.aspx?id=Home',
        'group' : ['State_Name'],
        'area'  : ['Total Release', 'ReleaseAmt_Total'],
        'den'   : ['Total Release', 'ReleaseAmt_Total'],
        'num'   : ['SC Release', 'ReleaseAmt_ST'],
        'story' : 'Story to be written...'
    }),
    storify({
        'menu'  : 'Financial Progress',
        'title' : '% ST in Total Release',
        'file'  : 'data/tsc.gov.in/districtData_L6.csv',
        'url'   : 'http://tsc.gov.in/tsc/Report/Release/RptReleaseDataBetweenDates.aspx?id=Home',
        'group' : ['State_Name'],
        'area'  : ['Total Release', 'ReleaseAmt_Total'],
        'den'   : ['Total Release', 'ReleaseAmt_Total'],
        'num'   : ['ST Release', 'ReleaseAmt_SC'],
        'story' : 'Story to be written...'
    }),
    storify({
        'menu'  : 'Financial Progress',
        'title' : '% General in Total Release',
        'file'  : 'data/tsc.gov.in/districtData_L6.csv',
        'url'   : 'http://tsc.gov.in/tsc/Report/Release/RptReleaseDataBetweenDates.aspx?id=Home',
        'group' : ['State_Name'],
        'area'  : ['Total Release', 'ReleaseAmt_Total'],
        'den'   : ['Total Release', 'ReleaseAmt_Total'],
        'num'   : ['General Release', 'ReleaseAmt_General'],
        'story' : 'Story to be written...'
    })
];
