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

// Concatenates strings / arrays
function join() {
    var result = []
    for (var i=0, l=arguments.length; i<l; i++) {
        if (Array.isArray(arguments[i])) {
            result.push.apply(result, arguments[i]);
        } else {
            result.push(arguments[i]);
        }
    }
    return result;
}

function treemap_story(story) {
    story.type = 'treemap';
    story.cols = join(story.area[1], story.num[1], story.den[1]);
    story.size = function(d) { return sum(d, story.area[1]); };
    story.filter = function(d) { return d.District_Name.match(/^[A-Z]/); };
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
    story.cols = story.cols || [];
    story.filter = function(d) { return d.District_Name.match(/^[A-Z]/); };
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
    // Needs to be specified explicitly.
    story.cols = story.cols || [];
    story.filter = function(d) { return d.District_Name.match(/^[A-Z]/); };
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
        'url'   : ['http://tsc.gov.in/tsc/Report/Financial/RptFinancialProgressStatewiseDistrictwise.aspx?id=Home'],
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
        'url'   : ['http://tsc.gov.in/tsc/Report/Financial/RptPercentageFinComponentStatewiseDistrictwise_net.aspx?id=FIN'],
        'group' : ['State_Name'],
        'area'  : ['Total approved - BPL', 'BPL_Appr.(C+S+B)'],
        'num'   : ['Total expenses - BPL', 'BPL_Exp.(C+S+B)'],
        'den'   : ['Total approved - BPL', 'BPL_Appr.(C+S+B)'],
        'story' : 'Story to be written...',
        'legend': { '%Size%':'Total approved - BPL', '%Colour%':'Total expenses - BPL / Total outlay - BPL'  }
    }),
    treemap_story({
        'menu'  : 'Financial Progress',
        'title' : 'Project outlay used - Schools',
        'url'   : ['http://tsc.gov.in/tsc/Report/Financial/RptPercentageFinComponentStatewiseDistrictwise_net.aspx?id=FIN'],
        'group' : ['State_Name'],
        'area'  : ['Total approved - School', 'School_Appr.(C+S+B)'],
        'num'   : ['Total expenses - School', 'School_Exp.(C+S+B)'],
        'den'   : ['Total approved - School', 'School_Appr.(C+S+B)'],
        'story' : 'Story to be written...',
        'legend': { '%Size%':'Total approved - School', '%Colour%':'Total expenses - School / Total outlay - School'  }
    }),
    treemap_story({
        'menu'  : 'Financial Progress',
        'title' : 'Project outlay used - Sanitary Complexes',
        'url'   : ['http://tsc.gov.in/tsc/Report/Financial/RptPercentageFinComponentStatewiseDistrictwise_net.aspx?id=FIN'],
        'group' : ['State_Name'],
        'area'  : ['Total approved - Sanitary Complexes', 'Sanitary_Complex_Appr.(C+S+B)'],
        'num'   : ['Total expenses - Sanitary Complexes', 'Sanitary_Complex_Exp.(C+S+B)'],
        'den'   : ['Total approved - Sanitary Complexes', 'Sanitary_Complex_Appr.(C+S+B)'],
        'story' : 'Story to be written...',
        'legend': { '%Size%':'Total approved - Sanitary Complexes', '%Colour%':'Total expenses - SC / Total approved - SC'  }
    }),
    treemap_story({
        'menu'  : 'Financial Progress',
        'title' : 'Project outlay used - Anganwadi',
        'url'   : ['http://tsc.gov.in/tsc/Report/Financial/RptPercentageFinComponentStatewiseDistrictwise_net.aspx?id=FIN'],
        'group' : ['State_Name'],
        'area'  : ['Total approved - Anganwadi', 'Anganwadi_Appr.(C+S+B)'],
        'num'   : ['Total expenses - Anganwadi', 'Anganwadi_Exp.(C+S+B)'],
        'den'   : ['Total approved - Anganwadi', 'Anganwadi_Appr.(C+S+B)'],
        'story' : 'Story to be written...',
        'legend': { '%Size%':'Total approved - Anganwadi', '%Colour%':'Total expenses - Anganwadi / Total approved - Anganwadi'  }
    }),
    treemap_story({
        'menu'  : 'Financial Progress',
        'title' : 'Share of centre - Approved',
        'url'   : ['http://tsc.gov.in/tsc/Report/Financial/RptFinancialProgressStatewiseDistrictwise.aspx?id=Home'],
        'group' : ['State_Name'],
        'area'  : ['Total outlay', 'Total_Projects_Outlay'],
        'num'   : ['Approved centre share', 'ApprShare_Center'],
        // Total approved <=> ApprShare_Center + ApprShare_State + ApprShare_Beneficiary - According to data
        'den'   : ['Total approved', ['ApprShare_Center', 'ApprShare_State', 'ApprShare_Beneficiary']],
        'story' : 'Story to be written...',
        'legend': { '%Size%': 'Total outlay', '%Colour%': 'Approved centre share / Total approved' }
    }),
    treemap_story({
        'menu'  : 'Financial Progress',
        'title' : 'Share of centre - Released',
        'url'   : ['http://tsc.gov.in/tsc/Report/Financial/RptFinancialProgressStatewiseDistrictwise.aspx?id=Home'],
        'group' : ['State_Name'],
        'area'  : ['Total outlay', 'Total_Projects_Outlay'],
        'num'   : ['Released centre share', 'Rof_Center'],
        'den'   : ['Total released', 'Rof_Total'],
        'story' : 'Story to be written...',
        'legend': { '%Size%': 'Total outlay', '%Colour%': 'Released centre share / Total released' }
    }),
    treemap_story({
        'menu'  : 'Financial Progress',
        'title' : 'Share of centre - Expenditure',
        'url'   : ['http://tsc.gov.in/tsc/Report/Financial/RptFinancialProgressStatewiseDistrictwise.aspx?id=Home'],
        'group' : ['State_Name'],
        'area'  : ['Total outlay', 'Total_Projects_Outlay'],
        'num'   : ['Centre expenses', 'ExpReported_Center'],
        'den'   : ['Total expenses', 'ExpReported_Total'],
        'story' : 'Story to be written...',
        'legend': { '%Size%': 'Total outlay', '%Colour%': 'Centre expenses / Total expenses' }
    }),
    stack_story({
        'menu'  : 'Financial Progress',
        'title' : 'Source of funding - Approved',
        'url'   : ['http://tsc.gov.in/tsc/Report/Financial/RptFinancialProgressStatewiseDistrictwise.aspx?id=Home'],
        'cols'  : ['ApprShare_Center', 'ApprShare_State', 'ApprShare_Beneficiary'],
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
        'url'   : ['http://tsc.gov.in/tsc/Report/Financial/RptFinancialProgressStatewiseDistrictwise.aspx?id=Home'],
        'cols'  : ['Rof_Center', 'Rof_State', 'Rof_Beneficiary'],
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
        'url'   : ['http://tsc.gov.in/tsc/Report/Financial/RptFinancialProgressStatewiseDistrictwise.aspx?id=Home'],
        'cols'  : ['ExpReported_Center', 'ExpReported_State', 'ExpReported_Beneficiary'],
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
    stack_story({
        'menu'  : 'Financial Progress',
        'title' : 'SC + ST of APL & BPL in  Total IHHL',
        'url'   : ['http://tsc.gov.in/tsc/Report/Physical/RptCategoriesIHHLStatewiseDistrictwise_net.aspx?id=PHY'],
        'cols'  : ['IHHL_APL_Ach_SC', 'IHHL_APL_Ach_ST', 'IHHL_BPL_Ach_SC', 'IHHL_BPL_Ach_ST', 'IHHL_Objective_Total'],
        'group' : ['State_Name', 'District_Name'],
        'stack' : function(d) { return cumsum([
            (+d['IHHL_APL_Ach_SC'] + +d['IHHL_APL_Ach_ST']) / +d['IHHL_Objective_Total'],
            (+d['IHHL_BPL_Ach_SC'] + +d['IHHL_BPL_Ach_ST']) / +d['IHHL_Objective_Total'],
            1 - (+d['IHHL_BPL_Ach_SC'] + +d['IHHL_BPL_Ach_ST'] + +d['IHHL_APL_Ach_SC'] + +d['IHHL_APL_Ach_ST']) / +d['IHHL_Objective_Total']
        ]); },
        'names' : ['APL', 'BPL', 'Others'],
        'colors': ['#4f81bd', '#c0504d', '#9bbb59'],
        'story' : 'Story to be written...',
        'legend': { '%Blue%': 'APL SC + ST', '%Red%': 'BPL SC + ST', '%Green%': 'Others' }
    }),

    treemap_story({
        'menu'  : 'Physical Progress',
        'title' : '% toilets built below poverty household',
        'url'   : ['http://tsc.gov.in/tsc/Report/Physical/RptPhysicalProgessStateWiseDistrictwise.aspx?id=Home'],
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
        'url'   : ['http://tsc.gov.in/tsc/Report/Physical/RptPhysicalProgessStateWiseDistrictwise.aspx?id=Home'],
        'group' : ['State_Name'],
        'area'  : ['Planned APL toilets', 'PO_IHHL_APL'],
        'num'   : ['Built APL toilets', 'PP_IHHL_APL'],
        'den'   : ['Planned APL toilets', 'PO_IHHL_APL'],
        'story' : 'Story to be written...',
        'legend': { '%Size%': 'Planned APL toilets', '%Colour%': 'Built APL toilets / Planned APL toilets' }
    }),
    treemap_story({
        'menu'  : 'Physical Progress',
        'title' : 'Coverage of BPL Toilets: households',
        'url'   : ['http://tsc.gov.in/tsc/Report/PanchayatReport/RptStateWiseBaseLineServeyData_net.aspx?id=Home'],
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
        'url'   : ['http://tsc.gov.in/tsc/Report/PanchayatReport/RptStateWiseBaseLineServeyData_net.aspx?id=Home'],
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
        'url'   : ['http://tsc.gov.in/tsc/Report/Financial/RptFinancialProgressStatewiseDistrictwise.aspx?id=Home', 
                   'http://tsc.gov.in/tsc/Report/Physical/RptPhysicalProgessStateWiseDistrictwise.aspx?id=Home'], 
        'cols'  : ['ExpReported_Total', 'Total_Projects_Outlay', 'PP_IHHL_BPL', 'PO_IHHL_BPL'],
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
        'url'   : ['TBD'],
        'cols'  : ['BPL_WT', 'BPL_WOT', 'ExpReported_Total', 'Total_Projects_Outlay', 'PP_IHHL_BPL', 'BPL_WT', 'BPL_WOT'],
        'group' : ['State_Name'],
        'area'  : ['# BPL toilets required', function(d) { return +d['BPL_WT'] + +d['BPL_WOT']; }],
        'x'     : ['Expenses / Outlay', function(d) { return d['ExpReported_Total'] / d['Total_Projects_Outlay']; }],
        'y'     : ['% BPL Households with toilet', function(d) { return +d['PP_IHHL_BPL'] / (+d['BPL_WT'] + +d['BPL_WOT']); }],
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

// List of the historical data files, latest on top
var datafiles = [
    'data-2013-05-29.csv',
    'data-2013-05-23.csv',
    'data-2013-04-30.csv',
    'data-2013-03-15.csv',
    'data-2013-02-18.csv'
];
