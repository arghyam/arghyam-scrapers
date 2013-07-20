var color = d3.scale.linear()
    .clamp(true)
    .domain([0, 0.5, 1, 2])
    .range(['#D73027', '#FFFFBF', '#1A9850', '#000']);
		
var	colorsSocP = d3.scale.linear()
		.clamp(true)
		.domain([0, 0.6, 0.6, 0.7, 0.7, 2])
		.range(['#D73027', '#D73027', '#90EE90', '#90EE90', '#1A9850', '#000']);		
		
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
    story.cols = story.cols || join(story.area[1], story.num[1], story.den[1]);
    story.size = function(d) { return sum(d, story.area[1]); };
    story.filter = function(d) { return d.District_Name.match(/^[A-Z]/); };
    story.color = story.colors || function(d) { return color((story.factor || 1) * sum(d, story.num[1]) / sum(d, story.den[1])).replace(/NaNNaNNaN/i, 'eee'); };
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
      return story.cells[i] + ': ' + P(d[1]);
    };
    story.legend['%Rows%'] = story.rows.join(', ');
    return story;
}

var lakhs = 'All figures are in <strong>Rs lakhs</strong>.';
var stories = [
    treemap_story({
        'menu'   : 'Money spent',
        'title'  : 'Spending on rural sanitation',
        'url'    : ['http://tsc.gov.in/tsc/Report/Financial/RptFinancialProgressStatewiseDistrictwise.aspx?id=Home'],
        'cols'   : ['Total_Projects_Outlay', 'ExpReported_Total'],
        'group'  : ['State_Name'],
        'area'   : ['Total plan', 'Total_Projects_Outlay'],
        'num'    : ['Total spent', 'ExpReported_Total'],
        'den'    : ['Total plan', 'Total_Projects_Outlay'],
        'story'  : 'Story to be written...',
        'legend' : { '%Size%':'Total plan', '%Colour%':'Total spent / Total plan', '%rs%':'<br>'+lakhs },
				'grad'   : 'gradient_legend',
				'percent': [1, 37, 70, 95],
				'pertext': [0, 50, 100, 200]
    }),
    treemap_story({
        'menu'   : 'Money spent',
        'title'  : 'Money spent on building toilets for the rural poor',
        'url'    : ['http://tsc.gov.in/tsc/Report/Financial/RptPercentageFinComponentStatewiseDistrictwise_net.aspx?id=FIN'],
        'cols'   : ['BPL_Appr.(C+S+B)', 'BPL_Exp.(C+S+B)'],
        'group'  : ['State_Name'],
        'area'   : ['Total plan - Rural poor', 'BPL_Appr.(C+S+B)'],
        'num'    : ['Total spent - Rural poor', 'BPL_Exp.(C+S+B)'],
        'den'    : ['Total plan - Rural poor', 'BPL_Appr.(C+S+B)'],
        'story'  : 'Story to be written...',
        'legend' : { '%Size%':'Total plan - Rural poor', '%Colour%':'Total spent - Rural poor / Total plan - Rural poor', '%rs%':'<br>'+lakhs },
				'grad'   : 'gradient_legend',
				'percent': [1, 37, 70, 95],
				'pertext': [0, 50, 100, 200]
    }),
    treemap_story({
        'menu'   : 'Money spent',
        'title'  : 'Project plan used - Schools',
        'url'    : ['http://tsc.gov.in/tsc/Report/Financial/RptPercentageFinComponentStatewiseDistrictwise_net.aspx?id=FIN'],
        'cols'   : ['School_Appr.(C+S+B)', 'School_Exp.(C+S+B)'],
        'group'  : ['State_Name'],
        'area'   : ['Total plan - School', 'School_Appr.(C+S+B)'],
        'num'    : ['Total spent - School', 'School_Exp.(C+S+B)'],
        'den'    : ['Total plan - School', 'School_Appr.(C+S+B)'],
        'story'  : 'Story to be written...',
        'legend' : { '%Size%':'Total plan - School', '%Colour%':'Total spent - School / Total plan - School', '%rs%':'<br>'+lakhs },
				'grad'   : 'gradient_legend',
				'percent': [1, 37, 70, 95],
				'pertext': [0, 50, 100, 200]
    }),
    treemap_story({
        'menu'   : 'Money spent',
        'title'  : 'Project plan used - Sanitary Complexes',
        'url'    : ['http://tsc.gov.in/tsc/Report/Financial/RptPercentageFinComponentStatewiseDistrictwise_net.aspx?id=FIN'],
        'cols'   : ['Sanitary_Complex_Appr.(C+S+B)', 'Sanitary_Complex_Exp.(C+S+B)'],
        'group'  : ['State_Name'],
        'area'   : ['Total plan - Sanitary Complexes', 'Sanitary_Complex_Appr.(C+S+B)'],
        'num'    : ['Total spent - Sanitary Complexes', 'Sanitary_Complex_Exp.(C+S+B)'],
        'den'    : ['Total plan - Sanitary Complexes', 'Sanitary_Complex_Appr.(C+S+B)'],
        'story'  : 'Story to be written...',
        'legend' : { '%Size%':'Total plan - Sanitary Complexes', '%Colour%':'Total spent - SC / Total plan - SC', '%rs%':'<br>'+lakhs },
				'grad'   : 'gradient_legend',
				'percent': [1, 37, 70, 95],
				'pertext': [0, 50, 100, 200]
    }),
    treemap_story({
        'menu'   : 'Money spent',
        'title'  : 'Project plan used - Anganwadi',
        'url'    : ['http://tsc.gov.in/tsc/Report/Financial/RptPercentageFinComponentStatewiseDistrictwise_net.aspx?id=FIN'],
        'cols'   : ['Anganwadi_Appr.(C+S+B)', 'Anganwadi_Exp.(C+S+B)'],
        'group'  : ['State_Name'],
        'area'   : ['Total plan - Anganwadi', 'Anganwadi_Appr.(C+S+B)'],
        'num'    : ['Total spent - Anganwadi', 'Anganwadi_Exp.(C+S+B)'],
        'den'    : ['Total plan - Anganwadi', 'Anganwadi_Appr.(C+S+B)'],
        'story'  : 'Story to be written...',
        'legend' : { '%Size%':'Total plan - Anganwadi', '%Colour%':'Total spent - Anganwadi / Total plan - Anganwadi', '%rs%':'<br>'+lakhs },
				'grad'   : 'gradient_legend',
				'percent': [1, 37, 70, 95],
				'pertext': [0, 50, 100, 200]
    }),
    treemap_story({
        'menu'   : 'Money spent',
        'title'  : 'Share of centre - Plan',
        'url'    : ['http://tsc.gov.in/tsc/Report/Financial/RptFinancialProgressStatewiseDistrictwise.aspx?id=Home'],
        'cols'   : ['Total_Projects_Outlay', 'ApprShare_Center', 'ApprShare_State', 'ApprShare_Beneficiary'],
        'group'  : ['State_Name'],
        'area'   : ['Total plan', 'Total_Projects_Outlay'],
        'num'    : ['Plan centre share', 'ApprShare_Center'],
        // Total plan <=> ApprShare_Center + ApprShare_State + ApprShare_Beneficiary - According to data
        'den'    : ['Total plan', ['ApprShare_Center', 'ApprShare_State', 'ApprShare_Beneficiary']],
				'colors' : function(d){ return colorsSocP(
											sum(d, ['ApprShare_Center']) / 
											sum(d, ['ApprShare_Center', 'ApprShare_State', 'ApprShare_Beneficiary'])).replace(/NaNNaNNaN/i, 'eee'); 
								   },
        'story'  : 'Story to be written...',
        'legend' : { '%Size%': 'Total plan', '%Colour%': 'Plan centre share / Total plan', '%rs%':'<br>'+lakhs },
				'grad'   : 'gradient_legend_SocP',
				'percent': [1, 30, 57, 95],
				'pertext': [0, 60, 70, 200]
    }),
    treemap_story({
        'menu'   : 'Money spent',
        'title'  : 'Share of centre - Money given',
        'cols'   : ['Total_Projects_Outlay', 'Rof_Center', 'Rof_Total'],
        'url'    : ['http://tsc.gov.in/tsc/Report/Financial/RptFinancialProgressStatewiseDistrictwise.aspx?id=Home'],
        'group'  : ['State_Name'],
        'area'   : ['Total plan', 'Total_Projects_Outlay'],
        'num'    : ['Money given by centre', 'Rof_Center'],
        'den'    : ['Total Money given', 'Rof_Total'],
        'story'  : 'Story to be written...',
        'legend' : { '%Size%': 'Total plan', '%Colour%': 'Money given by centre / Total Money given', '%rs%':'<br>'+lakhs },
				'grad'   : 'gradient_legend',
				'percent': [1, 37, 70, 95],
				'pertext': [0, 50, 100, 200]	
    }),
    treemap_story({
        'menu'   : 'Money spent',
        'title'  : 'Share of centre - Spending',
        'url'    : ['http://tsc.gov.in/tsc/Report/Financial/RptFinancialProgressStatewiseDistrictwise.aspx?id=Home'],
        'cols'   : ['Total_Projects_Outlay', 'ExpReported_Center', 'ExpReported_Total'],
        'group'  : ['State_Name'],
        'area'   : ['Total plan', 'Total_Projects_Outlay'],
        'num'    : ['Centre spent', 'ExpReported_Center'],
        'den'    : ['Total spent', 'ExpReported_Total'],
        'story'  : 'Story to be written...',
        'legend' : { '%Size%': 'Total plan', '%Colour%': 'Centre spent / Total spent', '%rs%':'<br>'+lakhs },
				'grad'   : 'gradient_legend',
				'percent': [1, 37, 70, 95],
				'pertext': [0, 50, 100, 200]	
    }),
    stack_story({
        'menu'   : 'Money spent',
        'title'  : 'Money given vs. Money spent',
				'subtitle' : 'Share of centre, State and People (Beneficiaries)',
        'url'    : ['http://tsc.gov.in/tsc/Report/Financial/RptFinancialProgressStatewiseDistrictwise.aspx?id=Home'],
        'cols'   : ['ApprShare_Center', 'ApprShare_State', 'ApprShare_Beneficiary', 'Rof_Center', 'Rof_State', 'Rof_Beneficiary', 'Rof_Total', 'ExpReported_Center', 'ExpReported_State', 'ExpReported_Beneficiary'],
        'group'  : ['State_Name', 'District_Name'],
        'stack'  : [// Plan
                    function(d) { return cumsum([
                      +d['ApprShare_Center']      / (+d['ApprShare_Center'] + +d['ApprShare_State'] + +d['ApprShare_Beneficiary']),
                      +d['ApprShare_State']       / (+d['ApprShare_Center'] + +d['ApprShare_State'] + +d['ApprShare_Beneficiary']),
                      +d['ApprShare_Beneficiary'] / (+d['ApprShare_Center'] + +d['ApprShare_State'] + +d['ApprShare_Beneficiary'])
                    ]); },
                    // Money given
                    function(d) { return cumsum([
                      +d['Rof_Center']      / +d['Rof_Total'],
                      +d['Rof_State']       / +d['Rof_Total'],
                      +d['Rof_Beneficiary'] / +d['Rof_Total']
                    ]); },
                    // Spending
                    function(d) { return cumsum([
                      +d['ExpReported_Center']      / (+d['ExpReported_Center'] + +d['ExpReported_State'] + +d['ExpReported_Beneficiary']),
                      +d['ExpReported_State']       / (+d['ExpReported_Center'] + +d['ExpReported_State'] + +d['ExpReported_Beneficiary']),
                      +d['ExpReported_Beneficiary'] / (+d['ExpReported_Center'] + +d['ExpReported_State'] + +d['ExpReported_Beneficiary'])
                    ]); }
                   ],
        'rows'   : ['Plan', 'Money given', 'Spending'],
        'cells'  : ['Centre', 'State', 'Beneficiary'],
        'colors' : ['#4f81bd', '#c0504d', '#9bbb59'],
				'height' : '1430',
				'ydom'   : '45',
				'lines'  : 'true', 
        'story'  : 'Story to be written...',
        'legend' : { '%Blue%': 'Centre', '%Red%': 'State', '%Green%': 'Beneficiary' }
    }),
    stack_story({
        'menu'   : 'Money spent',
        'title'  : 'SC + ST of APL & Rural Poor in  Total IHHL',
        'url'    : ['http://tsc.gov.in/tsc/Report/Physical/RptCategoriesIHHLStatewiseDistrictwise_net.aspx?id=PHY'],
        'cols'   : ['IHHL_APL_Ach_SC', 'IHHL_APL_Ach_ST', 'IHHL_BPL_Ach_SC', 'IHHL_BPL_Ach_ST', 'PO_IHHL_TOTAL'],
        'group'  : ['State_Name', 'District_Name'],
        'stack'  : [function(d) { return cumsum([
													(+d['IHHL_APL_Ach_SC'] + +d['IHHL_APL_Ach_ST']) / +d['PO_IHHL_TOTAL'],
													(+d['IHHL_BPL_Ach_SC'] + +d['IHHL_BPL_Ach_ST']) / +d['PO_IHHL_TOTAL'],
											1 - (+d['IHHL_BPL_Ach_SC'] + +d['IHHL_BPL_Ach_ST'] + +d['IHHL_APL_Ach_SC'] + +d['IHHL_APL_Ach_ST']) / +d['PO_IHHL_TOTAL']
										]); }
									 ],
        'rows'   : ['% SC/ST'],
        'cells'  : ['APL', 'Rural poor', 'Others'],
        'colors' : ['#4f81bd', '#c0504d', '#9bbb59'],
				'height' : '530',
				'ydom'   : '15',
				'lines'  : 'false',
        'story'  : 'Story to be written...',
        'legend' : { '%Blue%': 'APL SC + ST', '%Red%': 'Rural poor SC + ST', '%Green%': 'Others' }
    }),
    treemap_story({
        'menu'   : 'Toilets built',
        'title'  : 'Evaluation of toilets built for the rural poor',
        'url'    : ['http://tsc.gov.in/tsc/Report/Physical/RptPhysicalProgessStateWiseDistrictwise.aspx?id=Home'],
        'cols'   : ['PO_IHHL_BPL', 'PP_IHHL_BPL'],
        'group'  : ['State_Name'],
        'area'   : ['Toilets planned for rural poor', 'PO_IHHL_BPL'],
        'num'    : ['Toilets built for rural poor', 'PP_IHHL_BPL'],
        'den'    : ['Toilets planned for rural poor', 'PO_IHHL_BPL'],
        'story'  : 'Story to be written...',
        'legend' : { '%Size%': 'Toilets planned for rural poor', '%Colour%': 'Toilets built for rural poor / Toilets planned for rural poor', '%rs%':' ' },
				'grad'   : 'gradient_legend',
				'percent': [1, 37, 70, 95],
				'pertext': [0, 50, 100, 200]
    }),
    treemap_story({
        'menu'   : 'Toilets built',
        'title'  : '% toilets built above poverty household',
        'url'    : ['http://tsc.gov.in/tsc/Report/Physical/RptPhysicalProgessStateWiseDistrictwise.aspx?id=Home'],
        'cols'   : ['PO_IHHL_APL', 'PP_IHHL_APL'],
        'group'  : ['State_Name'],
        'area'   : ['Planned APL toilets', 'PO_IHHL_APL'],
        'num'    : ['Built APL toilets', 'PP_IHHL_APL'],
        'den'    : ['Planned APL toilets', 'PO_IHHL_APL'],
        'story'  : 'Story to be written...',
        'legend' : { '%Size%': 'Planned APL toilets', '%Colour%': 'Built APL toilets / Planned APL toilets', '%rs%':' ' },
				'grad'   : 'gradient_legend',
				'percent': [1, 37, 70, 95],
				'pertext': [0, 50, 100, 200]
    }),
    treemap_story({
        'menu'   : 'Toilets built',
        'title'  : 'Coverage of Toilets - Rural Households',
        'url'    : ['http://tsc.gov.in/tsc/Report/Physical/RptPhysicalProgessStateWiseDistrictwise.aspx?id=Home',
										'http://www.indiawaterportal.org/data/2011-census-household-tables-0'],
        'cols'   : ['PP_IHHL_TOTAL', 'Rural_Households'],
        'group'  : ['State_Name'],
        'area'   : ['Total Rural Households' , ['Rural_Households']],
        'num'    : ['Rural Households (WT)', ['PP_IHHL_TOTAL']],
        'den'    : ['Total Rural Households', ['Rural_Households']],
        'story'  : 'Story to be written...',
        'legend' : { '%Size%': 'Total Rural Households', '%Colour%': 'Rural Households (WT) / Total Rural Households', '%rs%':' ' },
				'grad'   : 'gradient_legend',
				'percent': [1, 37, 70, 95],
				'pertext': [0, 50, 100, 200]
    }),
    scatter_story({
        'menu'   : 'Performance',
        'title'  : 'Comparing spending to toilet construction',
        'url'    : ['http://tsc.gov.in/tsc/Report/Financial/RptFinancialProgressStatewiseDistrictwise.aspx?id=Home',
                    'http://tsc.gov.in/tsc/Report/Physical/RptPhysicalProgessStateWiseDistrictwise.aspx?id=Home'],
        'cols'   : ['PO_IHHL_BPL', 'PP_IHHL_BPL', 'ExpReported_Total', 'Total_Projects_Outlay'],
        'group'  : ['State_Name'],
        'area'   : ['# Rural poor toilets required', function(d) { return +d['PO_IHHL_BPL']; }],
        'x'      : ['Spent / Plan', function(d) { return d['ExpReported_Total'] / d['Total_Projects_Outlay']; }],
        'y'      : ['% Rural poor toilets constructed', function(d) { return d['PP_IHHL_BPL'] / d['PO_IHHL_BPL']; }],
        'R'      : 40,
        'xdom'   : [0, 1.5],
        'ydom'   : [0, 1.5],
        'story'  : 'Story to be written...',
        'legend' : { '%Circle%'              : 'District'                           ,
                     '%CircleSize%'          : 'Rural poor toilets required'        ,
                     '%AxisX%'               : 'Spent / Plan'                       ,
                     '%AxisY%'               : '% Rural poor toilets constructed'
                   }  
		}),
    scatter_story({
        'menu'   : 'Performance',
        'title'  : 'Effective fund utilisation',
        'url'    : ['TBD'],
        'cols'   : ['BPL_WT', 'BPL_WOT', 'ExpReported_Total', 'Total_Projects_Outlay', 'PP_IHHL_BPL'],
        'group'  : ['State_Name'],
        'area'   : ['# Rural poor toilets required', function(d) { return +d['BPL_WT'] + +d['BPL_WOT']; }],
        'x'      : ['Spent / Plan', function(d) { return d['ExpReported_Total'] / d['Total_Projects_Outlay']; }],
        'y'      : ['% Rural poor Households with toilet', function(d) { return +d['PP_IHHL_BPL'] / (+d['BPL_WT'] + +d['BPL_WOT']); }],
        'R'      : 40,
        'xdom'   : [0, 1.5],
        'ydom'   : [0, 1.5],
				'story'  : 'Story to be written...',
        'legend' : { '%Circle%'             : 'District'                            ,
                    '%CircleSize%'          : 'Rural poor toilets required'         ,
                    '%AxisX%'               : 'Spent / Plan'                        ,
                    '%AxisY%'               : '% Rural poor Households with toilet'
                   }
];

// List of the historical data files, latest on top
var datafiles = [
    'data-2013-06-30.csv',
    'data-2013-06-25.csv',
    'data-2013-06-16.csv',
    'data-2013-06-09.csv',
    'data-2013-06-02.csv',
    'data-2013-05-29.csv',
    'data-2013-05-23.csv'
];