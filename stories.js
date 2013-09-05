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

function cartogram_story(story) {
    story.type = 'cartogram';
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

var stories = [
    treemap_story({
        'menu'   : 'Money spent',
        'title'  : 'Spending on rural sanitation',
				'context': 'The rural sanitation scheme allocates funds different sanitation activities in villages. The main activities supported include ', 
				'cont_p' : '$1) Construction of toilets - for people in their houses and public toilets and institutions such as schools and creches @' + 
									 '$2) money for improving awareness on need for toilets  @' + 
									 '$3) creating a supply chain for manufacturing toilet-ware and @' + 
									 '$4) waste management efforts @',
				'viz'		 : 'Each large box represents one State. Click on it to reveal smaller boxes that represent a District. All amounts are in Rs. Lakhs.',
				'viz_p'  : '$1) Size of the box: Money planned to be set aside for rural sanitation @' + 
									 '$2) Colour of the box: How much has the state / union territory spent on rural sanitation when compared to what was planned @'+
									 '$3) The larger the size of the box, the greater the expenditure planned. Green and shades of green indicate spending according to plan while red and shades of red indicate failure to spend according to plan.@',
				'ppt'		 : 'Click on the ppt for more help with using the visualisation.',
        'url'    : ['http://tsc.gov.in/tsc/Report/Financial/RptFinancialProgressStatewiseDistrictwise.aspx?id=Home',
										'http://data.gov.in/dataset/nirmal-bharat-abhiyan-district-wise-financial-progress-date'],
        'cols'   : ['Total_Projects_Outlay', 'ExpReported_Total'],
        'group'  : ['State_Name'],
        'area'   : ['Total plan', 'Total_Projects_Outlay'],
        'num'    : ['Total spent', 'ExpReported_Total'],
        'den'    : ['Total plan', 'Total_Projects_Outlay'],
        'story'  : 'Story to be written...',
        'grad'   : 'gradient_legend',
				'percent': [1, 37, 70, 95],
				'pertext': [0, 50, 100, 200],
				'slideshare': 'https://skydrive.live.com/embed?cid=5F394E534EE15E07&resid=5F394E534EE15E07%21114&authkey=AAvTbPR9SP_xg5Y&em=2&wdAr=1.3333333333333333',
				'IWP'    : 'true'
    }),
    treemap_story({
        'menu'   : 'Money spent',
        'title'  : 'Money spent on building toilets for the rural poor',
				'context': 'This visualisation looks at the incentive given to rural poor households to build toilets - these incentives also called subsidies have varied over time from Rs. 3200 in 2011 to Rs. 9100 in 2012. ' +
				           'It assesses the performance of the scheme through the lens of amount spent vis a vis amount planned to be spent on incentives to rural poor households. ',
				'cont_p' : ' ',
				'viz'    : 'Each large box represents one State. Click on it to reveal smaller boxes that represent a District. All amounts are in Rs. Lakhs. ',
				'viz_p'  : '$1) Size of the box: Money planned to be spent on incentives for rural poor household toilets @' +
									 '$2) Colour of the box: How much has the state/ union territory spent on incentives to the rural poor for building toilets rural sanitation when compared to what was planned @' +
									 '$3) The larger the size of the box, the greater the amount planned to be spent. Green and shades of green indicate spending according to plan while red and shades of red indicate failure to spend according to plan. @',
				'ppt'    : 'Click on the ppt for more help with using the visualisation.',
        'url'    : ['http://tsc.gov.in/tsc/Report/Financial/RptPercentageFinComponentStatewiseDistrictwise_net.aspx?id=FIN'],
        'cols'   : ['BPL_Appr.(C+S+B)', 'BPL_Exp.(C+S+B)'],
        'group'  : ['State_Name'],
        'area'   : ['Total plan - Rural poor', 'BPL_Appr.(C+S+B)'],
        'num'    : ['Total spent - Rural poor', 'BPL_Exp.(C+S+B)'],
        'den'    : ['Total plan - Rural poor', 'BPL_Appr.(C+S+B)'],
        'story'  : 'Story to be written...',
        'grad'   : 'gradient_legend',
				'percent': [1, 37, 70, 95],
				'pertext': [0, 50, 100, 200],
				'slideshare': 'https://skydrive.live.com/embed?cid=5F394E534EE15E07&resid=5F394E534EE15E07%21112&authkey=AE51yDpVVlHU55k&em=2&wdAr=1.3333333333333333', 
				'IWP'    : 'true'
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
        'grad'   : 'gradient_legend',
				'percent': [1, 37, 70, 95],
				'pertext': [0, 50, 100, 200],
				'IWP'    : 'false'
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
        'grad'   : 'gradient_legend',
				'percent': [1, 37, 70, 95],
				'pertext': [0, 50, 100, 200],
				'IWP'    : 'false'
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
        'grad'   : 'gradient_legend',
				'percent': [1, 37, 70, 95],
				'pertext': [0, 50, 100, 200],
				'IWP'    : 'false'
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
        'grad'   : 'gradient_legend_SocP',
				'percent': [1, 30, 57, 95],
				'pertext': [0, 60, 70, 200],
				'IWP'    : 'false'
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
        'grad'   : 'gradient_legend',
				'percent': [1, 37, 70, 95],
				'pertext': [0, 50, 100, 200],
				'IWP'    : 'false'
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
        'grad'   : 'gradient_legend',
				'percent': [1, 37, 70, 95],
				'pertext': [0, 50, 100, 200],
				'IWP'    : 'false'
    }),
    stack_story({
        'menu'   : 'Money spent',
        'title'  : 'Money given vs. Money spent',
				'context': 'The Government of India, the State Government and the rural poor households all contribute towards the various components of the sanitation scheme. While an initial share is planned, the money given depends on how much is actually spent. The general break up for the share of Government of India (blue colour): State Government (red colour): Beneficiary (green colour) has been 65:23:14. ' +
									 'Major deviations from these numbers indicate contributions in excess of the actual amounts required. ', 
        'cont_p' : ' ',          
				'viz'    : 'Each row represents one State, showing the break-up of Plan, Money given, Spending.Click on it to reveal more boxes on the right representing each District. ',
				'viz_p'  : ' ',					 
				'ppt'		 : 'Click on the ppt for more help with using the visualisation.',  
				'subtitle': 'Share of centre, State and People (Beneficiaries)',
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
        'legend' : { '%Blue%': 'Centre', '%Red%': 'State', '%Green%': 'Beneficiary' },
				'slideshare': 'https://skydrive.live.com/embed?cid=5F394E534EE15E07&resid=5F394E534EE15E07%21110&authkey=AKRfPtIJhjye7-4&em=2&wdAr=1.3333333333333333&wdEaa=1',
				'IWP'    : 'true'
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
        'legend' : { '%Blue%': 'APL SC + ST', '%Red%': 'Rural poor SC + ST', '%Green%': 'Others' },
				'IWP'    : 'false'
    }),		
		treemap_story({
        'menu'   : 'Money spent',
        'title'  : 'XML - 2',
				'data'   : 'FinancialProgress.csv',
        'url'    : ['http://tsc.gov.in/tsc/NDSAP/StatewiseDistrictwiseFinancialProgress.xml'],
        'cols'   : ['Total_Release_of_funds','Total_Expenditure_Reported'],
        'group'  : ['State_Name'],
        'area'   : ['Funds given', 'Total_Release_of_funds'],
        'num'    : ['Funds spent', 'Total_Expenditure_Reported'],
        'den'    : ['Funds given', 'Total_Release_of_funds'],
        'story'  : 'Story to be written...',
        'grad'   : 'gradient_legend',
				'percent': [1, 37, 70, 95],
				'pertext': [0, 50, 100, 200],
				'IWP'    : 'false'
    }),
    treemap_story({
        'menu'   : 'Toilets built',
        'title'  : 'Evaluation of toilets built for the rural poor',
				'context': 'The states set targets for construction of toilets, especially for rural poor toilets where they also have to provide an incentive. Meeting these targets are what determine performance as per the rural sanitation scheme. This visualisation measures the performance as per targets. ',
        'cont_p' : ' ',
				'viz'    : 'Each large box represents one State. Click on it to reveal smaller boxes that represent a District. ',
        'viz_p'  : '$1) Size of the box: Target of toilets planned to be built for rural poor households @' +
                   '$2) Colour of the box: Toilets built for rural poor households when compared to the target @' + 
                   '$3) The larger the size of the box, the greater the target. Green and shades of green indicate building of toilets according to target while red and shades of red indicate failure to meet targets. @',
        'ppt'    : 'Click on the ppt for more help with using the visualisation. ',
        'url'    : ['http://tsc.gov.in/tsc/Report/Physical/RptPhysicalProgessStateWiseDistrictwise.aspx?id=Home',
									 'http://data.gov.in/dataset/nirmal-bharat-abhiyan-district-wise-physical-progress-as-on-date'],
        'cols'   : ['PO_IHHL_BPL', 'PP_IHHL_BPL'],
        'group'  : ['State_Name'],
        'area'   : ['Toilets planned for rural poor', 'PO_IHHL_BPL'],
        'num'    : ['Toilets built for rural poor', 'PP_IHHL_BPL'],
        'den'    : ['Toilets planned for rural poor', 'PO_IHHL_BPL'],
        'story'  : 'Story to be written...',
        'grad'   : 'gradient_legend',
				'percent': [1, 37, 70, 95],
				'pertext': [0, 50, 100, 200],
				'slideshare': 'https://skydrive.live.com/embed?cid=5F394E534EE15E07&resid=5F394E534EE15E07%21105&authkey=AN2MtcfwpdjuGHg&em=2&wdAr=1.3333333333333333', 
				'IWP'    : 'true'
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
        'grad'   : 'gradient_legend',
				'percent': [1, 37, 70, 95],
				'pertext': [0, 50, 100, 200],
				'IWP'    : 'false'
    }),
    cartogram_story({
        'menu'   : 'Toilets built',
        'title'  : 'Coverage of Toilets - Rural Households',
				'context': 'The states set targets for construction of toilets, especially for rural poor toilets where they also have to provide an incentive. The targets seem to have been set based on 2001 population figures and there is a huge discrepancy between these numbers and the rural household numbers in 2011.', 
				'cont_p' : '@'+
									 'This visualization presents what the TSC achievement looks like when analysed based on current household numbers.',
				'calc'   : '(2001 Rural Households with Toilets + TSC cumulative achievement numbers (2001-current))/Total Rural Households (Census 2011).'+
									 ' However, there are a couple of caveats to using this visual:',
				'calc_p' : "$a) It uses TSC cumulative numbers from the Ministry's website. However, the census 2011 presented data that was starkly different from this data. A current exercise is being undertaken by the Ministry to re-do baseline numbers. These numbers therefore are up for revision @" +						
				           '$b) The achievements presented in this visual may therefore be more exaggerated than the actual achievements on the ground', 
				'viz'		 : 'Each circle represents one State. Click on the state to zoom in, hover over the circle to see the data.',
				'viz_p'  : '$1) Size of the circle: Total number of rural households as per 2011 census @' + 
									 '$2) Colour of the circle: Number of rural households that have toilets. This number is the 2001 Census toilet count plus the current TSC achievement numbers. @',
				'ppt'		 : 'Click on the ppt for more help with using the visualisation.',

				'url'    : ['http://tsc.gov.in/tsc/Report/Physical/RptPhysicalProgessStateWiseDistrictwise.aspx?id=Home',
										'http://www.indiawaterportal.org/data/2011-census-household-tables-0'],
        'cols'   : ['PP_IHHL_TOTAL', 'Rural_Households'],
        'group'  : ['State_Name'],
        'area'   : ['Total Rural Households Census 2011' , 'Rural_Households'],
				'num'    : ['TSC total number of toilets built from 2001', 'PP_IHHL_TOTAL'],
        'den'    : ['Total Rural Households Census 2011', 'Rural_Households'],
        'cen2001': ['Census 2001 Rural Households (WT)', 'Census_2001_IHHL'],
				'story'  : 'Story to be written...',
        'grad'   : 'gradient_legend',
				'percent': [1, 37, 70, 95],
				'pertext': [0, 50, 100, 200],
				'slideshare': 'https://skydrive.live.com/embed?cid=5F394E534EE15E07&resid=5F394E534EE15E07%21118&authkey=ACidFJozKYbUARQ&em=2',
				'IWP'    : 'true'
    }),
		treemap_story({
        'menu'   : 'Toilets built',
        'title'  : 'XML - 1 - first',
				'data'   : 'PhysicalProgress.csv',
        'url'    : ['http://tsc.gov.in/tsc/NDSAP/StatewiseDistrictwisePhysicalProgress.xml'],
        'cols'   : ['Project_objectives_IHHL_BPL', 'Project_performance_IHHL_BPL'],
        'group'  : ['State_Name'],
        'area'   : ['Number of toilets to be built for the Rural poor', 'Project_Objectives_IHHL_BPL'],
        'num'    : ['Number of toilets built for the Rural poor', 'Project_Performance-IHHL_BPL'],
        'den'    : ['Number of toilets to be built for the Rural poor', 'Project_Objectives_IHHL_BPL'],
        'story'  : 'Story to be written...',
        'grad'   : 'gradient_legend',
				'percent': [1, 37, 70, 95],
				'pertext': [0, 50, 100, 200],
				'IWP'    : 'false'
    }),
		treemap_story({
        'menu'   : 'Toilets built',
        'title'  : 'XML - 1 - second',
				'data'   : 'PhysicalProgress.csv',
        'url'    : ['http://tsc.gov.in/tsc/NDSAP/StatewiseDistrictwisePhysicalProgress.xml'],
        'cols'   : ['Project_Objectives_IHHL_TOTAL', 'Project_Performance-IHHL_TOTAL'],
        'group'  : ['State_Name'],
        'area'   : ['Total number of toilets to be built', 'Project_Objectives_IHHL_TOTAL'],
        'num'    : ['Total number of toilets built', 'Project_Performance-IHHL_TOTAL'],
        'den'    : ['Total number of toilets to be built', 'Project_Objectives_IHHL_TOTAL'],
        'story'  : 'Story to be written...',
        'grad'   : 'gradient_legend',
				'percent': [1, 37, 70, 95],
				'pertext': [0, 50, 100, 200],
				'IWP'    : 'false'
    }),
    scatter_story({
        'menu'   : 'Performance',
        'title'  : 'Comparing spending to toilet construction',
				'context': 'This visualisation compares spending on the rural sanitation scheme with spending on incentives given for toilet construction for the rural poor houses. Ideally, every state must fall on the linear trendline meaning that it spent proportionate to construction. Being off that line means that the state has either under-spent or overspent to build the same number of toilets. ',
				'cont_p' : ' ',					 
				'viz'    : 'Each circle represents one State / Union Territory. Click on a State or select from the drop down for the State and District that you want to see. The size of the circle represents rural poor toilets required. The x-axis is based on overall spending on rural sanitation (since toilet construction for the rural poor and allied activities is the biggest spend in the whole allotted sum). The y-axis is based on % toilets constructed for rural poor households. ' +
									 'If the circle lies in the green part of the graph - that means that the respective state or district is doing well, if it lies in the red part then it is not. ',
				'viz_p'  : ' ',					 
				'ppt'    : 'Click on the ppt for more help with using the visualisation.', 
        'url'    : ['http://tsc.gov.in/tsc/Report/Financial/RptFinancialProgressStatewiseDistrictwise.aspx?id=Home', 
                    'http://tsc.gov.in/tsc/Report/Physical/RptPhysicalProgessStateWiseDistrictwise.aspx?id=Home'],
        'cols'   : ['PO_IHHL_BPL', 'PP_IHHL_BPL', 'ExpReported_Total', 'Total_Projects_Outlay'],
        'group'  : ['State_Name', 'District_Name'],
        'area'   : ['# Rural poor toilets required', function(d) { return +d['PO_IHHL_BPL']; }],
        'x'      : ['Spent / Plan', function(d) { return d['ExpReported_Total'] / d['Total_Projects_Outlay']; }],
        'y'      : ['% Toilets constructed for rural poor', function(d) { return d['PP_IHHL_BPL'] / d['PO_IHHL_BPL']; }],
        'R'      : 40,
        'xdom'   : [0, 1.5],
        'ydom'   : [0, 1.5],
        'story'  : 'Story to be written...',
				'slideshare': 'https://skydrive.live.com/embed?cid=5F394E534EE15E07&resid=5F394E534EE15E07%21116&authkey=ALNXoAqMwro4HP4&em=2&wdAr=1.3333333333333333', 
        'IWP'    : 'true'						
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
        'IWP'    : 'false'					
   })	
];

// List of the historical data files, latest on top
var datafiles = [
		'data-14-Jul-2013.csv',
    'data-07-Jul-2013.csv',
    'data-30-Jun-2013.csv',
    'data-25-Jun-2013.csv',
    'data-16-Jun-2013.csv',
    'data-09-Jun-2013.csv',
    'data-02-Jun-2013.csv',
    'data-29-May-2013.csv',
    'data-23-May-2013.csv'
];