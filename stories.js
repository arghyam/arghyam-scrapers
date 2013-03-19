var color = d3.scale.linear()
    .clamp(true)
    .domain([0, 0.5, 1, 2])
    .range(['#D73027', '#FFFFBF', '#1A9850', '#000']);

// Display formats
var F = d3.format(',.0f'); // Float
var N = d3.format(',.0f'); // Number == int
var P = d3.format('.1%');  // Percent

function sum(d, metric) {
  return d.depth == 2 ? d[metric] || d3.sum(metric, function(s) { return d[s] }) :
         d.depth == 1 ? d3.sum(d.values, function(v) { return v[metric] || d3.sum(metric, function(s) { return v[s] }) })
                      : 0
}

// Colours taken from MS Office themes
var gen_color_vals = [
    '#4f81bd', '#c0504d', '#9bbb59', '#8064a2', '#4bacc6', '#f79646',
    '#A9A57C', '#9CBEBD', '#D2CB6C', '#95A39D', '#C89F5D', '#B1A089',
    '#ceb966', '#9cb084', '#6bb1c9', '#6585cf', '#7e6bc9', '#a379bb',
    '#93A299', '#CF543F', '#B5AE53', '#848058', '#E8B54D', '#786C71',
    '#f07f09', '#9f2936', '#1b587c', '#4e8542', '#604878', '#c19859',
    '#94C600', '#71685A', '#FF6700', '#909465', '#956B43', '#FEA022',
    '#ccc'
];
var gen_color_keys = {};

function gen_color(value) {
    if (!gen_color_keys[value]) {
        gen_color_keys[value] = gen_color_vals[d3.keys(gen_color_keys).length];
    }
    return gen_color_keys[value];
}

function treemap_story(story) {
    story.type = 'treemap';
    story.size = function(d) { return d[story.area[1]]; };
    story.filter = function(d) { return !d.District_Name.match(/^Total/); };
    story.color = function(d) { return color(sum(d, story.num[1]) / sum(d, story.den[1])); };
    story.hover = function(d) {
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
    return story;
}

function scatter_story(story) {
    story.type = 'scatter';
    story.filter = function(d) { return !d.District_Name.match(/^Total/); };
    story.color = function(d) { return gen_color(d[story.group[0]]); };
    story.cx = story.x[1];
    story.cy = story.y[1];
    story.hover = function(d) {
      var prefix = d['State_Name'] + ' - ' + d['District_Name'];
      return prefix;
    };
    return story;
}

var stories = [
    treemap_story({
        'menu'  : 'Financial Progress',
        'title' : 'Project outlay used',
        'file'  : 'data.csv',
        'url'   : 'http://tsc.gov.in/tsc/Report/Financial/RptFinancialProgressStatewiseDistrictwise.aspx?id=Home',
        'group' : ['State_Name'],
        'area'  : ['Total outlay', 'Total_Projects_Outlay'],
        'num'   : ['Total expenses', 'ExpReported_Total'],
        'den'   : ['Total outlay', 'Total_Projects_Outlay'],
        'story' : 'Story to be written...'
    }),
    treemap_story({
        'menu'  : 'Financial Progress',
        'title' : 'Share of centre',
        'file'  : 'data.csv',
        'url'   : 'http://tsc.gov.in/tsc/Report/Financial/RptFinancialProgressStatewiseDistrictwise.aspx?id=Home',
        'group' : ['State_Name'],
        'area'  : ['Total outlay', 'Total_Projects_Outlay'],
        'num'   : ['Centre expenses', 'ExpReported_Center'],
        'den'   : ['Total expenses', 'ExpReported_Total'],
        'story' : 'Story to be written...'
    }),
    treemap_story({
        'menu'  : 'Physical Progress',
        'title' : '% toilets built below poverty household',
        'file'  : 'data.csv',
        'url'   : 'http://tsc.gov.in/tsc/Report/Physical/RptPhysicalProgessStateWiseDistrictwise.aspx?id=Home',
        'group' : ['State_Name'],
        'area'  : ['Planned BPL toilets', 'PO_IHHL_BPL'],
        'num'   : ['Built BPL toilets', 'PP_IHHL_BPL'],
        'den'   : ['Planned BPL toilets', 'PO_IHHL_BPL'],
        'story' : 'Story to be written...'
    }),
    treemap_story({
        'menu'  : 'Physical Progress',
        'title' : '% toilets built above poverty household',
        'file'  : 'data.csv',
        'url'   : 'http://tsc.gov.in/tsc/Report/Physical/RptPhysicalProgessStateWiseDistrictwise.aspx?id=Home',
        'group' : ['State_Name'],
        'area'  : ['Planned APL toilets', 'PO_IHHL_APL'],
        'num'   : ['Built APL toilets', 'PP_IHHL_APL'],
        'den'   : ['Planned APL toilets', 'PO_IHHL_APL'],
        'story' : 'Story to be written...'
    }),
    treemap_story({
        'menu'  : 'Financial Progress',
        'title' : '% SC in Total Release',
        'file'  : 'data.csv',
        'url'   : 'http://tsc.gov.in/tsc/Report/Release/RptReleaseDataBetweenDates.aspx?id=Home',
        'group' : ['State_Name'],
        'area'  : ['Total Release', 'ReleaseAmt_Total'],
        'den'   : ['Total Release', 'ReleaseAmt_Total'],
        'num'   : ['SC Release', 'ReleaseAmt_ST'],
        'story' : 'Story to be written...'
    }),
    treemap_story({
        'menu'  : 'Financial Progress',
        'title' : '% ST in Total Release',
        'file'  : 'data.csv',
        'url'   : 'http://tsc.gov.in/tsc/Report/Release/RptReleaseDataBetweenDates.aspx?id=Home',
        'group' : ['State_Name'],
        'area'  : ['Total Release', 'ReleaseAmt_Total'],
        'den'   : ['Total Release', 'ReleaseAmt_Total'],
        'num'   : ['ST Release', 'ReleaseAmt_SC'],
        'story' : 'Story to be written...'
    }),
    treemap_story({
        'menu'  : 'Financial Progress',
        'title' : '% General in Total Release',
        'file'  : 'data.csv',
        'url'   : 'http://tsc.gov.in/tsc/Report/Release/RptReleaseDataBetweenDates.aspx?id=Home',
        'group' : ['State_Name'],
        'area'  : ['Total Release', 'ReleaseAmt_Total'],
        'den'   : ['Total Release', 'ReleaseAmt_Total'],
        'num'   : ['General Release', 'ReleaseAmt_General'],
        'story' : 'Story to be written...'
    }),
    treemap_story({
        'menu'  : 'Financial Progress',
        'title' : '% (SC + ST) in Total Release',
        'file'  : 'data.csv',
        'url'   : 'http://tsc.gov.in/tsc/Report/Release/RptReleaseDataBetweenDates.aspx?id=Home',
        'group' : ['State_Name'],
        'area'  : ['Total Release', 'ReleaseAmt_Total'],
        'den'   : ['Total Release', 'ReleaseAmt_Total'],
        'num'   : ['SC + ST', ['ReleaseAmt_SC', 'ReleaseAmt_ST']],
        'story' : 'Story to be written...'
    }),
    treemap_story({
        'menu'  : 'Physical Progress',
        'title' : '75% coverage of BPL Toilets',
        'file'  : './data/tsc.gov.in/districtData_L32.csv',
        'url'   : 'http://tsc.gov.in/tsc/Report/PanchayatReport/RptStateWiseBaseLineServeyData_net.aspx?id=Home',
        'group' : ['State_Name'],
        'area'  : ['BPL Family' , ['BPL_WT', 'BPL_WOT'] ],
        'den'   : ['BPL Family' , ['BPL_WT', 'BPL_WOT'] ],
        'num'   : ['BPL Toilets', ['SAN_WT', 'SAN_WOT'] ],
        'story' : 'Story to be written...'
    }),
    scatter_story({
        'menu'  : 'Performance',
        'title' : 'Financial vs Physical progress',
        'file'  : 'data.csv',
        'url'   : 'http://tsc.gov.in/tsc/Report/Release/RptReleaseDataBetweenDates.aspx?id=Home',
        'group' : ['State_Name'],
        'area'  : ['# BPL toilets required', 'PO_IHHL_BPL'],
        'x'     : ['Expenses / Outlay', function(d) { return d['ExpReported_Total'] / d['Total_Projects_Outlay']; }],
        'y'     : ['% BPL toilets constructed', function(d) { return d['PP_IHHL_BPL'] / d['PO_IHHL_BPL']; }],
        'R'     : 40,
        'story' : 'Story to be written...'
    })
];
