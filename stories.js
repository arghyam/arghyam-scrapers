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

function cumsum(series) {
    var result = [], running = 0;
    for (var i=0, l=series.length; i<l; i++) {
        result.push([running, series[i]]);
        running += series[i];
    }
    return result;
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
    story.size = function(d) { return sum(d, story.area[1]); };
    story.filter = function(d) { return !d.District_Name.match(/^Total/); };
    story.color = function(d) { return color((story.factor || 1) * sum(d, story.num[1]) / sum(d, story.den[1])).replace(/NaNNaNNaN/i, 'eee'); };
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
    story.xdom = story.xdom || [0, 1];
    story.ydom = story.ydom || [0, 1];
    story.hover = function(d) {
      var prefix = d['State_Name'] + ' - ' + d['District_Name'] + ': ';
      return (prefix +
        story.area[0] + ' = ' + N(story.area[1](d)) + '. ' +
        story.x[0]    + ' = ' + P(story.x[1](d)) + '. ' +
        story.y[0]    + ' = ' + P(story.y[1](d)) + '.'
      );
    };
    return story;
}

function stack_story(story) {
    story.type = 'stack';
    story.filter = function(d) { return !d.District_Name.match(/^Total/); };
    story.color = function(d) { return gen_color(d[story.group[0]]); };
    story.hover = function(d, i) {
      return story.names[i] + ': ' + P(d[1]);
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
        'story' : 'Story to be written...',
        'legend': { '%Size%':'Total outlay', '%Colour%':'Total expenses / Total outlay'  }
    }),
    treemap_story({
        'menu'  : 'Financial Progress',
        'title' : 'Project outlay used - BPL',
        'file'  : 'data.csv',
        'url'   : 'http://tsc.gov.in/tsc/Report/Financial/RptPercentageFinComponentStatewiseDistrictwise_net.aspx?id=FIN',
        'group' : ['State_Name'],
        'area'  : ['Total outlay', 'Total_Projects_Outlay'],
        'num'   : ['Total expenses - BPL', 'Exp_BPL'],
        'den'   : ['Total approved - BPL', 'Appr_BPL'],
        'story' : 'Story to be written...',
        'legend': { '%Size%':'Total outlay', '%Colour%':'Total expenses - BPL / Total outlay - BPL'  }
    }),
    treemap_story({
        'menu'  : 'Financial Progress',
        'title' : 'Project outlay used - Schools',
        'file'  : 'data.csv',
        'url'   : 'http://tsc.gov.in/tsc/Report/Financial/RptPercentageFinComponentStatewiseDistrictwise_net.aspx?id=FIN',
        'group' : ['State_Name'],
        'area'  : ['Total outlay', 'Total_Projects_Outlay'],
        'num'   : ['Total expenses - School', 'Exp_School'],
        'den'   : ['Total approved - School', 'Appr_School'],
        'story' : 'Story to be written...',
        'legend': { '%Size%':'Total outlay', '%Colour%':'Total expenses - School / Total outlay - School'  }
    }),
    treemap_story({
        'menu'  : 'Financial Progress',
        'title' : 'Project outlay used - Sanitary Complexes',
        'file'  : 'data.csv',
        'url'   : 'http://tsc.gov.in/tsc/Report/Financial/RptPercentageFinComponentStatewiseDistrictwise_net.aspx?id=FIN',
        'group' : ['State_Name'],
        'area'  : ['Total outlay', 'Total_Projects_Outlay'],
        // TODO: ['Exp_San'] - known bug - Pravin will fix this soon.
        'num'   : ['Total expenses - SC', ['Exp_San']],
        'den'   : ['Total approved - SC', 'Appr_San'],
        'story' : 'Story to be written...',
        'legend': { '%Size%':'Total outlay', '%Colour%':'Total expenses - SC / Total approved - SC'  }
    }),
    treemap_story({
        'menu'  : 'Financial Progress',
        'title' : 'Project outlay used - Anganwadi',
        'file'  : 'data.csv',
        'url'   : 'http://tsc.gov.in/tsc/Report/Financial/RptPercentageFinComponentStatewiseDistrictwise_net.aspx?id=FIN',
        'group' : ['State_Name'],
        'area'  : ['Total outlay', 'Total_Projects_Outlay'],
        'num'   : ['Total expenses - Anganwadi', ['Exp_Angan']],
        'den'   : ['Total approved - Anganwadi', 'Appr_Angan'],
        'story' : 'Story to be written...',
        'legend': { '%Size%':'Total outlay', '%Colour%':'Total expenses - Anganwadi / Total approved - Anganwadi'  }
    }),
    treemap_story({
        'menu'  : 'Financial Progress',
        'title' : 'Total share of centre',
        'file'  : 'data.csv',
        'url'   : 'http://tsc.gov.in/tsc/Report/Financial/RptFinancialProgressStatewiseDistrictwise.aspx?id=Home',
        'group' : ['State_Name'],
        'area'  : ['Total outlay', 'Total_Projects_Outlay'],
        'num'   : ['Centre expenses', 'ExpReported_Center'],
        'den'   : ['Total expenses', 'ExpReported_Total'],
        'story' : 'Story to be written...',
        'legend': { '%Size%': 'Total outlay', '%Colour%': 'Centre expenses / Total expenses' }
    }),
    treemap_story({
        'menu'  : 'Financial Progress',
        'title' : 'Approved share of centre',
        'file'  : 'data.csv',
        'url'   : 'http://tsc.gov.in/tsc/Report/Financial/RptFinancialProgressStatewiseDistrictwise.aspx?id=Home',
        'group' : ['State_Name'],
        'area'  : ['Total outlay', 'Total_Projects_Outlay'],
        'num'   : ['Approved centre share', 'ApprShare_Center'],
        // Total outlay <=> ApprShare_Center + ApprShare_State + ApprShare_Beneficiary - According to data
        'den'   : ['Total outlay', ['ApprShare_Center', 'ApprShare_State', 'ApprShare_Beneficiary']],
        'story' : 'Story to be written...',
        'legend': { '%Size%': 'Total outlay', '%Colour%': 'Approved centre share / Total approved' }
    }),
    treemap_story({
        'menu'  : 'Financial Progress',
        'title' : 'Released share of centre',
        'file'  : 'data.csv',
        'url'   : 'http://tsc.gov.in/tsc/Report/Financial/RptFinancialProgressStatewiseDistrictwise.aspx?id=Home',
        'group' : ['State_Name'],
        'area'  : ['Total outlay', 'Total_Projects_Outlay'],
        'num'   : ['Released centre share', 'Rof_Center'],
        'den'   : ['Total released', 'Rof_Total'],
        'story' : 'Story to be written...',
        'legend': { '%Size%': 'Total outlay', '%Colour%': 'Released centre share / Total released' }
    }),
    stack_story({
        'menu'  : 'Financial Progress',
        'title' : 'Source of funding - Approved',
        'file'  : 'data.csv',
        'url'   : 'http://tsc.gov.in/tsc/Report/Financial/RptFinancialProgressStatewiseDistrictwise.aspx?id=Home',
        'group' : ['State_Name', 'District_Name'],
        'stack' : function(d) { return cumsum([
            +d['ApprShare_Center']      / (+d['ApprShare_Center'] + +d['ApprShare_State'] + +d['ApprShare_Beneficiary']),
            +d['ApprShare_State']       / (+d['ApprShare_Center'] + +d['ApprShare_State'] + +d['ApprShare_Beneficiary']),
            +d['ApprShare_Beneficiary'] / (+d['ApprShare_Center'] + +d['ApprShare_State'] + +d['ApprShare_Beneficiary'])
        ]); },
        'names' : ['Centre', 'State', 'Beneficiary'],
        'colors': ['#4f81bd', '#c0504d', '#9bbb59'],
        'story' : 'Story to be written...',
        'legend': { '%Blue%': 'Centre', '%Red%': 'State', '%Green%': 'Beneficiary' }
    }),
    stack_story({
        'menu'  : 'Financial Progress',
        'title' : 'Source of funding - Released',
        'file'  : 'data.csv',
        'url'   : 'http://tsc.gov.in/tsc/Report/Financial/RptFinancialProgressStatewiseDistrictwise.aspx?id=Home',
        'group' : ['State_Name', 'District_Name'],
        'stack' : function(d) { return cumsum([
            +d['Rof_Center']      / +d['Rof_Total'],
            +d['Rof_State']       / +d['Rof_Total'],
            +d['Rof_Beneficiary'] / +d['Rof_Total']
        ]); },
        'names' : ['Centre', 'State', 'Beneficiary'],
        'colors': ['#4f81bd', '#c0504d', '#9bbb59'],
        'story' : 'Story to be written...',
        'legend': { '%Blue%': 'Centre', '%Red%': 'State', '%Green%': 'Beneficiary' }
    }),
    stack_story({
        'menu'  : 'Financial Progress',
        'title' : 'Source of funding - Expenditure',
        'file'  : 'data.csv',
        'url'   : 'http://tsc.gov.in/tsc/Report/Financial/RptFinancialProgressStatewiseDistrictwise.aspx?id=Home',
        'group' : ['State_Name', 'District_Name'],
        'stack' : function(d) { return cumsum([
            +d['ExpReported_Center']      / (+d['ExpReported_Center'] + +d['ExpReported_State'] + +d['ExpReported_Beneficiary']),
            +d['ExpReported_State']       / (+d['ExpReported_Center'] + +d['ExpReported_State'] + +d['ExpReported_Beneficiary']),
            +d['ExpReported_Beneficiary'] / (+d['ExpReported_Center'] + +d['ExpReported_State'] + +d['ExpReported_Beneficiary'])
        ]); },
        'names' : ['Centre', 'State', 'Beneficiary'],
        'colors': ['#4f81bd', '#c0504d', '#9bbb59'],
        'story' : 'Story to be written...',
        'legend': { '%Blue%': 'Centre', '%Red%': 'State', '%Green%': 'Beneficiary' }
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
        'story' : 'Story to be written...',
        'legend': { '%Size%': 'Planned BPL toilets', '%Colour%': 'Built BPL toilets / Planned BPL toilets' }
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
        'story' : 'Story to be written...',
        'legend': { '%Size%': 'Planned APL toilets', '%Colour%': 'Built APL toilets / Planned APL toilets' }
    }),
    stack_story({
        'menu'  : 'Financial Progress',
        'title' : 'SC + ST of APL & BPL in  Total IHHL',
        'file'  : 'data.csv',
        'url'   : 'http://tsc.gov.in/tsc/Report/Physical/RptCategoriesIHHLStatewiseDistrictwise_net.aspx?id=PHY',
        'group' : ['State_Name', 'District_Name'],
        'stack' : function(d) { return cumsum([
            (+d['APL_Ach_SC']      + +d['APL_Ach_ST'])      / +d['IHHL_Total'],
            (+d['BPL_Ach_IHHL_SC'] + +d['BPL_Ach_IHHL_ST']) / +d['IHHL_Total'],
            1 - (+d['BPL_Ach_IHHL_SC'] + +d['BPL_Ach_IHHL_ST'] + +d['APL_Ach_SC'] + +d['APL_Ach_ST']) / +d['IHHL_Total']
        ]); },
        'names' : ['APL', 'BPL', 'Others'],
        'colors': ['#4f81bd', '#c0504d', '#9bbb59'],
        'story' : 'Story to be written...',
        'legend': { '%Blue%': 'APL SC + ST', '%Red%': 'BPL SC + ST', '%Green%': 'Others' }
    }),
    treemap_story({
        'menu'  : 'Physical Progress',
        'title' : 'Coverage of BPL Toilets: households',
        'file'  : 'data.csv',
        'url'   : 'http://tsc.gov.in/tsc/Report/PanchayatReport/RptStateWiseBaseLineServeyData_net.aspx?id=Home',
        'group' : ['State_Name'],
        'area'  : ['BPL Households' , ['BPL_WT', 'BPL_WOT']],
        'num'   : ['BPL Households (WT)', ['BPL_WT']],
        'den'   : ['Total BPL Households', ['BPL_WT', 'BPL_WOT']],
        'story' : 'Story to be written...',
        'legend': { '%Size%': 'BPL Households', '%Colour%': 'BPL Households (WT) / Total BPL Households' }
    }),
    treemap_story({
        'menu'  : 'Physical Progress',
        'title' : 'Coverage of APL Toilets: households',
        'file'  : 'data.csv',
        'url'   : 'http://tsc.gov.in/tsc/Report/PanchayatReport/RptStateWiseBaseLineServeyData_net.aspx?id=Home',
        'group' : ['State_Name'],
        'area'  : ['APL Households' , ['APL_WT', 'APL_WOT']],
        'num'   : ['APL Households (WT)' , ['APL_WT']],
        'den'   : ['Total APL Households', ['APL_WT', 'APL_WOT']],
        'story' : 'Story to be written...',
        'legend': { '%Size%': 'APL Households', '%Colour%': 'APL Households (WT) / Total APL Households' }
    }),
    scatter_story({
        'menu'  : 'Performance',
        'title' : 'Financial vs Physical progress',
        'file'  : 'data.csv',
        'url'   : 'http://tsc.gov.in/tsc/Report/Release/RptReleaseDataBetweenDates.aspx?id=Home',
        'group' : ['State_Name'],
        'area'  : ['# BPL toilets required', function(d) { return +d['PO_IHHL_BPL']; }],
        'x'     : ['Expenses / Outlay', function(d) { return d['ExpReported_Total'] / d['Total_Projects_Outlay']; }],
        'y'     : ['% BPL toilets constructed', function(d) { return d['PP_IHHL_BPL'] / d['PO_IHHL_BPL']; }],
        'R'     : 40,
        'xdom'  : [0, 1.5],
        'ydom'  : [0, 1.5],
        'story' : 'Story to be written...',
        'legend': { '%Circle%'              : 'District'                    ,
                    '%CircleSize%'         : 'BPL toilets required'         ,
                    '%AxisX%'              : 'Expenses / Outlay'            ,
                    '%AxisY%'              : '% BPL toilets constructed'
                  }
    }),
    scatter_story({
        'menu'  : 'Performance',
        'title' : 'Effective fund utilisation',
        'file'  : 'data.csv',
        'url'   : 'TBD',
        'group' : ['State_Name'],
        'area'  : ['# BPL toilets required', function(d) { return +d['BPL_WT'] + +d['BPL_WOT']; }],
        'x'     : ['Expenses / Outlay', function(d) { return d['ExpReported_Total'] / d['Total_Projects_Outlay']; }],
        'y'     : ['% BPL Households with toilet', function(d) { return +d['BPL_WT'] / (+d['BPL_WT'] + +d['BPL_WOT']); }],
        'R'     : 40,
        'xdom'  : [0, 1.5],
        'story' : 'Story to be written...',
        'legend': { '%Circle%'              : 'District'                    ,
                    '%CircleSize%'         : 'BPL toilets required'         ,
                    '%AxisX%'              : 'Expenses / Outlay'            ,
                    '%AxisY%'              : '% BPL Households with toilet'
                  }
    })
];
