var color = d3.scale.linear()
    .clamp(true)
    .domain([0, 0.5, 1, 2])
    .range(['#D73027', '#FFFFBF', '#1A9850', '#000']);

var F = d3.format(',.0f'); // Float
var N = d3.format(',.0f'); // Number == int
var P = d3.format('.1%');  // Percent

var stories = [
    {
        'menu'  : 'Financial Progress',
        'title' : 'Project outlay used',
        'file'  : 'data/tsc.gov.in/districtData_L1.csv',
        'url'   : 'http://tsc.gov.in/tsc/Report/Financial/RptFinancialProgressStatewiseDistrictwise.aspx?id=Home',
        'filter': function(d) { return (d.Date == '10-12-2012') && (!d.District_Name.match(/^Total/)); },
        'group' : ['State_Name', 'District_Name'],
        'size'  : function(d) { return d['Total_Projects_Outlay']; },
        'color' : function(d) { return d.depth == 3 ? color(d['ExpReported_Total'] / d['Total_Projects_Outlay']) : ''; },
        'hover' : function(d) { return d['State_Name'] + ' - ' + d['District_Name'] + ': Total outlay: Rs ' + F(d['Total_Projects_Outlay']) + ' lakhs, Expenditure: ' + P(d['ExpReported_Total'] / d['Total_Projects_Outlay']); },
        'story' : 'Story to be written...'
    },
    {
        'menu'  : 'Financial Progress',
        'title' : 'Share of centre',
        'file'  : 'data/tsc.gov.in/districtData_L1.csv',
        'url'   : 'http://tsc.gov.in/tsc/Report/Financial/RptFinancialProgressStatewiseDistrictwise.aspx?id=Home',
        'filter': function(d) { return (d.Date == '10-12-2012') && (!d.District_Name.match(/^Total/)); },
        'group' : ['State_Name', 'District_Name'],
        'size'  : function(d) { return d['Total_Projects_Outlay']; },
        'color' : function(d) { return d.depth == 3 ? color(d['ExpReported_Center'] / d['ExpReported_Total']) : ''; },
        'hover' : function(d) { return d['State_Name'] + ' - ' + d['District_Name'] + ': Total outlay: Rs ' + F(d['Total_Projects_Outlay']) + ' lakhs, Center: ' + P(d['ExpReported_Center'] / d['ExpReported_Total']); },
        'story' : 'Story to be written...'
    },
    {
        'menu'  : 'Physical Progress',
        'title' : '% toilets built below poverty household',
        'file'  : 'data/tsc.gov.in/districtData_L4.csv',
        'url'   : 'http://tsc.gov.in/tsc/Report/Physical/RptPhysicalProgessStateWiseDistrictwise.aspx?id=Home',
        'filter': function(d) { return (d.Date == '10-12-2012') && (!d.District_Name.match(/^Total/)); },
        'group' : ['State_Name', 'District_Name'],
        'size'  : function(d) { return d['PO_IHHL_BPL']; },
        'color' : function(d) { return d.depth == 3 ? color(d['PP_IHHL_BPL'] / d['PO_IHHL_BPL']) : ''; },
        'hover' : function(d) { return d['State_Name'] + ' - ' + d['District_Name'] + ': Planned BPL toilets: ' + N(d['PO_IHHL_BPL']) + ', Built: ' + P(d['PP_IHHL_BPL'] / d['PO_IHHL_BPL']); },
        'story' : 'Story to be written...'
    },
    {
        'menu'  : 'Physical Progress',
        'title' : '% toilets built above poverty household',
        'file'  : 'data/tsc.gov.in/districtData_L4.csv',
        'url'   : 'http://tsc.gov.in/tsc/Report/Physical/RptPhysicalProgessStateWiseDistrictwise.aspx?id=Home',
        'filter': function(d) { return (d.Date == '10-12-2012') && (!d.District_Name.match(/^Total/)); },
        'group' : ['State_Name', 'District_Name'],
        'size'  : function(d) { return d['PO_IHHL_APL']; },
        'color' : function(d) { return d.depth == 3 ? color(d['PP_IHHL_APL'] / d['PO_IHHL_APL']) : ''; },
        'hover' : function(d) { return d['State_Name'] + ' - ' + d['District_Name'] + ': Planned APL toilets: ' + N(d['PO_IHHL_APL']) + ', Built: ' + P(d['PP_IHHL_APL'] / d['PO_IHHL_APL']); },
        'story' : 'Story to be written...'
    }
];
