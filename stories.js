var stories = [
    {
        'menu'  : 'Financial Progress',
        'title' : 'Total Project outlay used',
        'file'  : 'data/tsc.gov.in/districtData_L1.csv',
        'url'   : 'http://tsc.gov.in/tsc/Report/Financial/RptFinancialProgressStatewiseDistrictwise.aspx?id=Home',
        'filter': function(d) { return (d.Date == '10-12-2012') && (!d.District_Name.match(/^Total/)); },
        'group' : ['State_Name', 'District_Name'],
        'size'  : function(d) { return d['Total_Projects_Outlay']; },
        'color' : function(d) { return d.depth == 3 ? RYG(d['ExpReported_Total'] / d['Total_Projects_Outlay']) : ''; },
        'hover' : function(d) { return d['State_Name'] + ' - ' + d['District_Name']; },
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
        'color' : function(d) { return d.depth == 3 ? RYG(d['ExpReported_Center'] / d['ExpReported_Total']) : ''; },
        'hover' : function(d) { return d['State_Name'] + ' - ' + d['District_Name']; },
        'story' : 'Story to be written...'
    },
    {
        'menu'  : 'Physical Progress',
        'title' : 'IIHL BPL toilets',
        'file'  : 'data/tsc.gov.in/districtData_L4.csv',
        'url'   : 'http://tsc.gov.in/tsc/Report/Physical/RptPhysicalProgessStateWiseDistrictwise.aspx?id=Home',
        'filter': function(d) { return (d.Date == '10-12-2012') && (!d.District_Name.match(/^Total/)); },
        'group' : ['State_Name', 'District_Name'],
        'size'  : function(d) { return d['PO_IHHL_BPL']; },
        'color' : function(d) { return d.depth == 3 ? RYG(d['PP_IHHL_BPL'] / d['PO_IHHL_BPL']) : ''; },
        'hover' : function(d) { return d['State_Name'] + ' - ' + d['District_Name']; },
        'story' : 'Story to be written...'
    },
    {
        'menu'  : 'Physical Progress',
        'title' : 'IIHL APL toilets',
        'file'  : 'data/tsc.gov.in/districtData_L4.csv',
        'url'   : 'http://tsc.gov.in/tsc/Report/Physical/RptPhysicalProgessStateWiseDistrictwise.aspx?id=Home',
        'filter': function(d) { return (d.Date == '10-12-2012') && (!d.District_Name.match(/^Total/)); },
        'group' : ['State_Name', 'District_Name'],
        'size'  : function(d) { return d['PO_IHHL_APL']; },
        'color' : function(d) { return d.depth == 3 ? RYG(d['PP_IHHL_APL'] / d['PO_IHHL_APL']) : ''; },
        'hover' : function(d) { return d['State_Name'] + ' - ' + d['District_Name']; },
        'story' : 'Story to be written...'
    }
];
