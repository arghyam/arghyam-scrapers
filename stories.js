var color = d3.scale.linear()
    .clamp(true)
    .domain([0, 0.5, 1, 2])
    .range(['#D73027', '#FFFFBF', '#1A9850', '#000']);
		
var	colorsSocP = d3.scale.linear()
		.clamp(true)
		.domain([0, 0.6, 0.6, 0.7, 0.7, 2])
		.range(['#D73027', '#D73027', '#90EE90', '#90EE90', '#1A9850', '#000']);

var colorDorCart = d3.scale.linear()
		.clamp(true)
		.domain([-0.5, 0, 0.5])
    .range(['#D73027', '#FFFFBF', '#1A9850']); 		
		
var colorDor = d3.scale.linear()
		.clamp(true)
		.domain([0, 1, 2])
    .range(['#D73027', '#FFFFBF', '#1A9850']);
		
// Display formats
var F = d3.format(',.0f'); // Float
var N = d3.format(',.0f'); // Number == int
var P = d3.format('.1%');  // Percent
var options = {'Money Spent':
                ['Spending on rural sanitation', 
                 'Money spent on building toilets for the rural poor', 
                 'Plan vs. Actuals for schools - cumulative', 
                 'Plan vs. Actuals for Anganwadis - cumulative'
                ],
              'Toilets Built':
                ['Evaluation of toilets built for the rural poor', 
                 'Plan vs. Actuals for schools', 
                 'Plan vs. Actuals for Anganwadis'
                ]
              }; //under toilets built ---- 'Coverage of Toilets - Rural Households', 

var tmp_story = {'Spending on rural sanitation':
                    {'url':['http://tsc.gov.in/tsc/Report/Financial/RptFinancialProgressStatewiseDistrictwise.aspx?id=Home', 'http://data.gov.in/dataset/nirmal-bharat-abhiyan-district-wise-financial-progress-date'],
                     'cols':['Total_Projects_Outlay', 'ExpReported_Total'],
                     'area':['Total plan', 'Total_Projects_Outlay'],
                     'num':['Total spent', 'ExpReported_Total'],
                     'den':['Total plan', 'Total_Projects_Outlay']
                    },
                'Money spent on building toilets for the rural poor':
                    {'url':['http://tsc.gov.in/tsc/Report/Financial/RptPercentageFinComponentStatewiseDistrictwise_net.aspx?id=FIN'],
                     'cols':['BPL_Appr.(C+S+B)', 'BPL_Exp.(C+S+B)'],
                     'area':['Total plan - Rural poor', 'BPL_Appr.(C+S+B)'],
                     'num':['Total spent - Rural poor', 'BPL_Exp.(C+S+B)'],
                     'den':['Total plan - Rural poor', 'BPL_Appr.(C+S+B)']
                    },
                'Plan vs. Actuals for schools - cumulative':
                    {'url':['http://tsc.gov.in/tsc/Report/Financial/RptPercentageFinComponentStatewiseDistrictwise_net.aspx?id=FIN'],
                     'cols':['School_Appr.(C+S+B)', 'School_Exp.(C+S+B)'],
                     'area':['Total plan - School', 'School_Appr.(C+S+B)'],
                     'num':['Total spent - School', 'School_Exp.(C+S+B)'],
                     'den':['Total plan - School', 'School_Appr.(C+S+B)']
                    },
                'Plan vs. Actuals for Anganwadis - cumulative':
                    {'url':['http://tsc.gov.in/tsc/Report/Financial/RptPercentageFinComponentStatewiseDistrictwise_net.aspx?id=FIN'],
                     'cols':['Anganwadi_Appr.(C+S+B)', 'Anganwadi_Exp.(C+S+B)'],
                     'area':['Total plan - Nursery Schools', 'Anganwadi_Appr.(C+S+B)'],
                     'num':['Total spent - Nursery Schools', 'Anganwadi_Exp.(C+S+B)'],
                     'den':['Total plan - Nursery Schools', 'Anganwadi_Appr.(C+S+B)']
                    },
                'Coverage of Toilets - Rural Households':
                    {'url':['http://tsc.gov.in/tsc/Report/Physical/RptPhysicalProgessStateWiseDistrictwise.aspx?id=Home','http://www.indiawaterportal.org/data/2011-census-household-tables-0'],
                     'cols':['PP_IHHL_TOTAL', 'Rural_Households'],
                     'area':['Total Rural Households Census 2011' , 'Rural_Households'],
                     'num':['TSC total number of toilets built from 2001', 'PP_IHHL_TOTAL'],
                     'den':['Total Rural Households Census 2011', 'Rural_Households'],
                     'cen2001':['Census 2001 Rural Households (WT)', 'Census_2001_IHHL']
                    }, 
                'Evaluation of toilets built for the rural poor':
                    {'url':['http://tsc.gov.in/tsc/Report/Physical/RptPhysicalProgessStateWiseDistrictwise.aspx?id=Home', 'http://data.gov.in/dataset/nirmal-bharat-abhiyan-district-wise-physical-progress-as-on-date'],
                     'cols':['PO_IHHL_BPL', 'PP_IHHL_BPL'],
                     'area':['Toilets planned for rural poor', 'PO_IHHL_BPL'],
                     'num':['Toilets built for rural poor', 'PP_IHHL_BPL'],
                     'den':['Toilets planned for rural poor', 'PO_IHHL_BPL']
                    }, 
                'Plan vs. Actuals for schools':
                    {'url':['http://tsc.gov.in/tsc/Report/Physical/RptPhysicalProgessStateWiseDistrictwise.aspx?id=Home'],
                     'cols':['PO_School_Toilets', 'PP_School_Toilets'],
                     'area':['Number of toilets to be built for Schools', 'PO_School_Toilets'],
                     'num':['Number of toilets built for Schools', 'PP_School_Toilets'],
                     'den':['Number of toilets to be built for Schools', 'PO_School_Toilets']
                    },
                'Plan vs. Actuals for Anganwadis':
                    {'url':['http://tsc.gov.in/tsc/Report/Physical/RptPhysicalProgessStateWiseDistrictwise.aspx?id=Home'],
                     'cols':['PO_Anganwadi_Toilets', 'PP_Anganwadi_Toilets'],
                     'area':['Number of toilets to be built for Nursery Schools', 'PO_Anganwadi_Toilets'],
                     'num':['Number of toilets built for Nursery Schools', 'PP_Anganwadi_Toilets'],
                     'den':['Number of toilets to be built for Nursery Schools', 'PO_Anganwadi_Toilets']
                    },
                'Performance':
                    {'url':['http://tsc.gov.in/tsc/Report/Financial/RptFinancialProgressStatewiseDistrictwise.aspx?id=Home', 'http://tsc.gov.in/tsc/Report/Physical/RptPhysicalProgessStateWiseDistrictwise.aspx?id=Home'],
                     'cols':['PO_IHHL_BPL', 'PP_IHHL_BPL', 'ExpReported_Total', 'Total_Projects_Outlay'],
                     //'area':['# Rural poor toilets required', function(d) { return +d['PO_IHHL_BPL']; }],
                     'x':['Spent / Plan', function(d) { return d['ExpReported_Total'] / d['Total_Projects_Outlay']; }],
                     'y':['% Toilets constructed for rural poor', function(d) { return d['PP_IHHL_BPL'] / d['PO_IHHL_BPL']; }],
                     'R':40,
                     'xdom':[0, 1.5],
                     'ydom':[0, 1.5]
                    },
                'Census':
                    {'url':['http://tsc.gov.in/tsc/Report/Physical/RptYearWiseCountryLevelAch.aspx?id=PHY','https://drive.google.com/folderview?id=0B9MvDRHquaP6SWdxUkpteHFZYWs&usp=sharing'],
                     'group':['State_Name', 'District_Name'],
                     'cols':['TSC_Finance','TSC_IHHL_2011','Census_IHHL_2011'],
                     'area':['#Rural poor toilets required', function(d) { return +d['BPL_WT'] + +d['BPL_WOT']; }],
                     'x':['Cumulative finance (in Rs. Lakhs)', 'TSC_Finance'],
                     'yT':['Toilets Built', 'TSC_IHHL_2011'],
                     'yC':['Toilets Built from Census', 'Census_IHHL_2011'], 
                     'R':40
                    }
                };

var descriptions = {'Money Spent':{'content':'Money Spent content goes here'}, 'Toilets Built' : {'content':'Toilets Built content goes here'}, 'TSC' : {'content':'TSC content goes here'}, 'Census' : {'content':'Census content goes here'}};
  
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
    '#4e8542', '#c0504d', '#9bbb59', '#8064a2', '#4bacc6', '#f79646', 
    '#A9A57C', '#9CBEBD', '#D2CB6C', '#C89F5D', '#B1A089', '#ceb966', 
    '#9cb084', '#7e6bc9', '#a379bb', '#93A299', '#CF543F', '#B5AE53',
    '#848058', '#f07f09', '#9f2936', '#1b587c', '#604878', '#95A39D',
    '#E8B54D', '#94C600', '#71685A', '#FF6700', '#909465', '#956B43',
    '#786C71', '#c19859', '#6bb1c9', '#FEA022', '#ccc'   , '#4f81bd',
    '#6585cf' 
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
		story.size = story.area[1];
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

function boxscatter_story(story) {
    story.type = 'boxscatter';
    story.cols = story.cols || [];
    story.filter = function(d) { return d.District_Name.match(/^[A-Z]/); };
    story.color = function(d) { return gen_color(d[story.group[0]]); };
    story.X = story.x[1];
    story.YT = story.yT[1];
    story.YC = story.yC[1];
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

function dorling_story(story) {
    story.type = 'dorling';
    story.cols = story.cols || [];
    story.filter = function(d) { return d.District_Name.match(/^[A-Z]/); };
	story.X = story.x2[1];
    story.YT = story.yT2[1];
    story.YC = story.yC2[1];
	story.size = story.area[1];
	story.cx = story.x[1];
    story.cy = story.y[1];
	story.color1 = function(d) { return gen_color(d[story.group[0]]); };
    story.xdom = story.xdom || [0, 1];
    story.ydom = story.ydom || [0, 1];
    story.color = story.colors || function(d) { return color((story.factor || 1) * d[story.num[1]] / d[story.den[1]]).replace(/NaNNaNNaN/i, 'eee'); };
    story.hover = function(d) {
      var prefix = d['State_Name'] +' - '+ d['District_Name'] + ' : ';
      var num = story.num[1];
      var den = story.den[1];
      var size = story.area[1];
      return (prefix +
          story.area[0] + ' = ' + N(d[size]) + '. ' +
          story.num[0] + ' / ' + story.den[0] + ' = ' +
          N(d[num]) + ' / ' + N(d[den]) + ' = ' + P(d[num] / d[den])
      );
    };
		story.hover1 = function(d) {
      var prefix = d['State_Name'] + ' - ' + d['District_Name'] + ': ';
      return (prefix +
        story.area1[0] + ' = ' + N(story.area1[1](d)) + '. ' +
        story.x[0]    + ' = ' + P(story.x[1](d)) + '. ' +
        story.y[0]    + ' = ' + P(story.y[1](d)) + '.'
      );
    };
    return story;
}

function dorlingCart_story(story){
		story.type = 'dorlingCart';
		story.cols = story.cols || [];
    story.filter = function(d) { return d.District_Name.match(/^[A-Z]/); };
		story.size = story.area[1];
		story.diff = story.cen2011_2001[1];
		story.cen2011 = story.num[1];
		story.trh2011 = story.den[1];
    story.cen2001 = story.num1[1];
    story.trh2001 = story.den1[1];
		return story;
}

function dataChange_story(story){
  story.type = 'dataChange';
  story.filter = function(d){ return d.District_Name.match(/^[A-Z]/); };
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
  	'viz'    : 'Each large box represents one State. Click on it to reveal smaller boxes that represent a District. All amounts are in Rs. Lakhs.',
  	'viz_p'  : '$1) Size of the box: Money planned to be set aside for rural sanitation @' + 
  			       '$2) Colour of the box: How much has the state / union territory spent on rural sanitation when compared to what was planned @'+
  			       '$3) The larger the size of the box, the greater the expenditure planned. Green and shades of green indicate spending according to plan while red and shades of red indicate failure to spend according to plan.@',
  	'url'    : ['http://tsc.gov.in/tsc/Report/Financial/RptFinancialProgressStatewiseDistrictwise.aspx?id=Home',
  	'http://data.gov.in/dataset/nirmal-bharat-abhiyan-district-wise-financial-progress-date'],
    'cols'   : ['Total_Projects_Outlay', 'ExpReported_Total'],
    'group'  : ['State_Name'],
    'area'   : ['Total plan', 'Total_Projects_Outlay'],
    'num'    : ['Total spent', 'ExpReported_Total'],
    'den'    : ['Total plan', 'Total_Projects_Outlay'],
	  'grad'   : 'gradient_legend',
    'percent': [1, 37, 70, 95],
	  'pertext': [0, 50, 100, 200],
	  'slideshare': 'https://skydrive.live.com/embed?cid=44822B77589D1B71&resid=44822B77589D1B71%21120&authkey=ADJSIvNj-QPmj3Y&em=2',
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
		'url'    : ['http://tsc.gov.in/tsc/Report/Financial/RptPercentageFinComponentStatewiseDistrictwise_net.aspx?id=FIN'],
    'cols'   : ['BPL_Appr.(C+S+B)', 'BPL_Exp.(C+S+B)'],
    'group'  : ['State_Name'],
    'area'   : ['Total plan - Rural poor', 'BPL_Appr.(C+S+B)'],
    'num'    : ['Total spent - Rural poor', 'BPL_Exp.(C+S+B)'],
    'den'    : ['Total plan - Rural poor', 'BPL_Appr.(C+S+B)'],
    'grad'   : 'gradient_legend',
		'percent': [1, 37, 70, 95],
		'pertext': [0, 50, 100, 200],
		'slideshare': 'https://skydrive.live.com/embed?cid=44822B77589D1B71&resid=44822B77589D1B71%21122&authkey=ALfMHYjHSM_LaIA&em=2', 
		'IWP'    : 'true'
  }),
  treemap_story({
    'menu'   : 'Money spent',
    'title'  : 'Money spent on sanitation coverage of rural schools',
		'context': "School sanitation is highlighted as one of the important components under the Nirmal Bharat Abhiyan. The amount allotted for building school toilets is Rs.35,000 per school (Rs. 38,500 in hilly and difficult areas). This amount has not changed when from the current scheme's precursor, the total sanitation campaign guidelines of 2010." + 
               'This visualisation looks at the money planned to be spent to ensure that all rural, government schools have toilets.It assesses the performance of the scheme through the lens of amount spent vis a vis amount planned to be spent on money given to toilets for rural, government schools.',
		'cont_p' : '',
		'viz'    : 'Each large box represents one State. Click on it to reveal smaller boxes that represent a District. All amounts are in Rs. Lakhs.',
		'viz_p'  : '$1) Size of the box: Money planned to be set aside for coverage of schools @'+
							 '$2) Colour of the box: How much has the state / union territory spent on school sanitation when compared to what was planned @'+	
							 '$3) The larger the size of the box, the greater the expenditure. Green and shades of green indicate spending according to plan while red and shades of red indicate failure to spend according to plan. @',
    'url'    : ['http://tsc.gov.in/tsc/Report/Financial/RptPercentageFinComponentStatewiseDistrictwise_net.aspx?id=FIN'],
    'cols'   : ['School_Appr.(C+S+B)', 'School_Exp.(C+S+B)'],
    'group'  : ['State_Name'],
    'area'   : ['Total plan - School', 'School_Appr.(C+S+B)'],
    'num'    : ['Total spent - School', 'School_Exp.(C+S+B)'],
    'den'    : ['Total plan - School', 'School_Appr.(C+S+B)'],
    'grad'   : 'gradient_legend',
		'percent': [1, 37, 70, 95],
		'pertext': [0, 50, 100, 200],
		'slideshare': 'https://skydrive.live.com/embed?cid=44822B77589D1B71&resid=44822B77589D1B71%21109&authkey=AJPTL0crW7cA5a8&em=2',
		'IWP'    : 'true'
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
    'grad'   : 'gradient_legend',
		'percent': [1, 37, 70, 95],
		'pertext': [0, 50, 100, 200],
		'IWP'    : 'false'
  }),
  treemap_story({
    'menu'   : 'Money spent',
    'title'  : 'Money spent on sanitation coverage of rural nursery schools',
		'context': "Nursery schools or anganwadis were set up by Government of India to address child hunger and malnutrition. It is meant for children between the ages of 0 - 6 years. Providing safe sanitation in these become important to ensure good health. The idea is also to get children to learn to use a toilet from a very young age. The amount allotted for building baby-friendly nursery school toilets is Rs.8,000 per school (Rs. 10,000 in hilly and difficult areas). This amount has not changed when from the current scheme's precursor, the total sanitation campaign guidelines of 2010.",
    'cont_p' : '',
    'viz'    : 'Each large box represents one State. Click on it to reveal smaller boxes that represent a District. All amounts are in Rs. Lakhs.',
    'viz_p'	 : '$1) Size of the box: Money planned to be set aside for coverage of nursery schools @' +
							 '$2) Colour of the box: How much has the state / union territory spent on nursery school sanitation when compared to what was planned @' +	
							 '$3) The larger the size of the box, the greater the expenditure. Green and shades of green indicate spending according to plan while red and shades of red indicate failure to spend according to plan. @',			
    'url'    : ['http://tsc.gov.in/tsc/Report/Financial/RptPercentageFinComponentStatewiseDistrictwise_net.aspx?id=FIN'],
    'cols'   : ['Anganwadi_Appr.(C+S+B)', 'Anganwadi_Exp.(C+S+B)'],
    'group'  : ['State_Name'],
    'area'   : ['Total plan - Nursery Schools', 'Anganwadi_Appr.(C+S+B)'],
    'num'    : ['Total spent - Nursery Schools', 'Anganwadi_Exp.(C+S+B)'],
    'den'    : ['Total plan - Nursery Schools', 'Anganwadi_Appr.(C+S+B)'],
    'grad'   : 'gradient_legend',
		'percent': [1, 37, 70, 95],
		'pertext': [0, 50, 100, 200],
		'slideshare': 'https://skydrive.live.com/embed?cid=44822B77589D1B71&resid=44822B77589D1B71%21110&authkey=AEik8JpuxrdZHxY&em=2',
		'IWP'    : 'true'
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
		'barHeight' : '49',
		'lines'  : 'true', 
    'legend' : { '%Blue%': 'Centre', '%Red%': 'State', '%Green%': 'Beneficiary' },
		'slideshare': 'https://skydrive.live.com/embed?cid=44822B77589D1B71&resid=44822B77589D1B71%21119&authkey=AOc6r1bY3i073_I&em=2',
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
		'barHeight' : '20',
		'lines'  : 'false',
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
    'url'    : ['http://tsc.gov.in/tsc/Report/Physical/RptPhysicalProgessStateWiseDistrictwise.aspx?id=Home',
							 'http://data.gov.in/dataset/nirmal-bharat-abhiyan-district-wise-physical-progress-as-on-date'],
    'cols'   : ['PO_IHHL_BPL', 'PP_IHHL_BPL'],
    'group'  : ['State_Name'],
    'area'   : ['Toilets planned for rural poor', 'PO_IHHL_BPL'],
    'num'    : ['Toilets built for rural poor', 'PP_IHHL_BPL'],
    'den'    : ['Toilets planned for rural poor', 'PO_IHHL_BPL'],
    'grad'   : 'gradient_legend',
		'percent': [1, 37, 70, 95],
		'pertext': [0, 50, 100, 200],
		'slideshare': 'https://skydrive.live.com/embed?cid=44822B77589D1B71&resid=44822B77589D1B71%21118&authkey=AAX0ZIwWrOpxzHo&em=2', 
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
		'url'    : ['http://tsc.gov.in/tsc/Report/Physical/RptPhysicalProgessStateWiseDistrictwise.aspx?id=Home',
								'http://www.indiawaterportal.org/data/2011-census-household-tables-0'],
    'cols'   : ['PP_IHHL_TOTAL', 'Rural_Households'],
    'group'  : ['State_Name'],
    'area'   : ['Total Rural Households Census 2011' , 'Rural_Households'],
		'num'    : ['TSC total number of toilets built from 2001', 'PP_IHHL_TOTAL'],
    'den'    : ['Total Rural Households Census 2011', 'Rural_Households'],
    'cen2001': ['Census 2001 Rural Households (WT)', 'Census_2001_IHHL'],
		'grad'   : 'gradient_legend',
		'percent': [1, 37, 70, 95],
		'pertext': [0, 50, 100, 200],
		'slideshare': 'https://skydrive.live.com/embed?cid=44822B77589D1B71&resid=44822B77589D1B71%21121&authkey=ALqTaNinQiR3Fn4&em=2',
		'IWP'    : 'true'
  }),		
  treemap_story({
    'menu'   : 'Toilets built',
    'title'  : 'Toilets built for Schools',
		'context': 'School sanitation is highlighted as one of the important components under the Nirmal Bharat Abhiyan. The scheme focuses on toilet construction combined with hygiene education to promote early adoption of toilet usage in rural, government schools. Specific guidelines for implementation have been provided in the scheme document. For example, each toilet block must consist of a toilet and at least 2 urinals and co-educational schools are mandated to provide separate toilets for boys and girls. ',
    'cont_p' : ' @'+
							 'While the earlier scheme, the Total Sanitaiton Campaign set 2012 as the target year for universalising access to sanitation in rural scheme, the new scheme sets a broad guideline for achieving Nirmal Gram status by 2022.',	
    'viz'    : 'Each large box represents one State. Click on it to reveal smaller boxes that represent a District.',
    'viz_p'  : '$1) Size of the box: Target of toilets planned to be built for rural, government schools @' +
							 '$2) Colour of the box: Toilets built for rural government schools when compared to the target @' +
							 '$3) The larger the size of the box, the greater the target. Green and shades of green indicate building of toilets according to target while red and shades of red indicate failure to meet targets @', 				
		'url'    : ['http://tsc.gov.in/tsc/Report/Physical/RptPhysicalProgessStateWiseDistrictwise.aspx?id=Home'],
    'cols'   : ['PO_School_Toilets', 'PP_School_Toilets'],
    'group'  : ['State_Name'],
    'area'   : ['Number of toilets to be built for Schools', 'PO_School_Toilets'],
    'num'    : ['Number of toilets built for Schools', 'PP_School_Toilets'],
    'den'    : ['Number of toilets to be built for Schools', 'PO_School_Toilets'],
    'grad'   : 'gradient_legend',
		'percent': [1, 37, 70, 95],
		'pertext': [0, 50, 100, 200],
		'slideshare': 'https://skydrive.live.com/embed?cid=44822B77589D1B71&resid=44822B77589D1B71%21108&authkey=AIwj62fwxNULyHM&em=2',
		'IWP'    : 'true'
  }),		
  treemap_story({
    'menu'   : 'Toilets built',
    'title'  : 'Toilets built for Nursery Schools',
		'context': 'Nursery schools or anganwadis were set up by Government of India to address child hunger and malnutrition. It is meant for children between the ages of 0 - 6 years. The idea is also to get children to learn to use a toilet from a very young age; to prevent diseases related to poor hygiene; and to prevent malnutrition. The guidelines require that baby friendly toilets must be constructed but do not specify the design for such toilets.',
		'cont_p' : ' @' +
		           'While the earlier scheme, the Total Sanitaiton Campaign set 2012 as the target year for universalising access to sanitation in rural scheme, the new scheme sets a broad guideline for achieving Nirmal Gram status by 2022.',
		'viz'    : 'Each large box represents one State. Click on it to reveal smaller boxes that represent a District.',
		'viz_p'  : '$1) Size of the box: Target of toilets planned to be built for rural nursey schools @' +
		           '$2) Colour of the box: Toilets built for rural nursery schools when compared to the target @' +
							 '$3) The larger the size of the box, the greater the target. Green and shades of green indicate building of toilets according to target while red and shades of red indicate failure to meet targets. @', 
		'url'    : ['http://tsc.gov.in/tsc/Report/Physical/RptPhysicalProgessStateWiseDistrictwise.aspx?id=Home'],										 
    'cols'   : ['PO_Anganwadi_Toilets', 'PP_Anganwadi_Toilets'],
    'group'  : ['State_Name'],
    'area'   : ['Number of toilets to be built for Nursery Schools', 'PO_Anganwadi_Toilets'],
    'num'    : ['Number of toilets built for Nursery Schools', 'PP_Anganwadi_Toilets'],
    'den'    : ['Number of toilets to be built for Nursery Schools', 'PO_Anganwadi_Toilets'],
    'grad'   : 'gradient_legend',
		'percent': [1, 37, 70, 95],
		'pertext': [0, 50, 100, 200],
		'slideshare': 'https://skydrive.live.com/embed?cid=44822B77589D1B71&resid=44822B77589D1B71%21107&authkey=AJ3NfRms6zlBD_g&em=2',
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
    'grad'   : 'gradient_legend',
		'percent': [1, 37, 70, 95],
		'pertext': [0, 50, 100, 200],
		'IWP'    : 'false'
  }),
  scatter_story({
    'menu'   : 'Performance',
    'title'  : 'Comparing spending to toilet construction - TSC',
		'context': 'This visualisation compares spending on the rural sanitation scheme with construction of toilets for rural poor houses. Ideally, every district must fall on the linear trendline meaning that it spent proportionate to construction. Being off that line means that the state has either under-spent or overspent to build the same number of toilets. ',
		'cont_p' : ' ',					 
		'viz'    : 'Each circle represents one State / Union Territory. Click on a State or select from the drop down for the State and District that you want to see. The size of the circle represents rural poor toilets required. The x-axis is based on overall spending on rural sanitation (since toilet construction for the rural poor and allied activities is the biggest spend in the whole allotted sum). The y-axis is based on % toilets constructed for rural poor households. ' +
							 'If the circle lies in the green part of the graph - that means that the respective state or district is doing well, if it lies in the red part then it is not. ',
		'viz_p'  : ' ',					 
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
    'slideshare': 'https://skydrive.live.com/embed?cid=44822B77589D1B71&resid=44822B77589D1B71%21128&authkey=ANXXSi5VLhu352w&em=2', 
    'IWP'    : 'true'						
  }),
  boxscatter_story({
    'menu'   : 'Performance',
    'title'  : 'Comparing spending to toilet construction - Census',
		'option' : '',
		'suboption' : '',
		'data'   : 'comparing_spending_toilets_2011.csv',
    'url'    : ['http://tsc.gov.in/tsc/Report/Physical/RptYearWiseCountryLevelAch.aspx?id=PHY','https://drive.google.com/folderview?id=0B9MvDRHquaP6SWdxUkpteHFZYWs&usp=sharing'],
		'group'  : ['State_Name', 'District_Name'],
    'cols'   : ['TSC_Finance','TSC_IHHL_2011','Census_IHHL_2011'],
    'area'   : ['#Rural poor toilets required', function(d) { return +d['BPL_WT'] + +d['BPL_WOT']; }],
    'x'      : ['Cumulative finance (in Rs. Lakhs)', 'TSC_Finance'],
    'yT'     : ['Toilets Built', 'TSC_IHHL_2011'],
		'yC'     : ['Toilets Built from Census', 'Census_IHHL_2011'], 
    'R'      : 40,
    'IWP'    : 'false'					
  }),
  dorlingCart_story({
		'menu'   : 'Performance',
    'title'  : 'Census 2001 vs. 2011',
		'data'   : 'aggregated_census_data.csv',
		'url'    : ['TBD'],
		'group'  : ['State_Name'],
		'cols'   : ['Census_2001_Total_Rural_Households','Census_2011_Total_Rural_Households','Census_2001_IHHL','Census_2011_IHHL'],
    'area'   : ['Census 2011 Total Rural Households', 'Census_2011_Total_Rural_Households'],
		'cen2011_2001' : ['Difference between Census 2011 with toilets and Census 2001 with toilets', 'C2011/TRH2011-C2001/TRH2001'],
		'num'    : ['Census 2011 Households with toilets', 'Census_2011_IHHL'],
		'den'    : ['Census 2011 Total Rural Households', 'Census_2011_Total_Rural_Households'],
		'num1'   : ['Census 2001 Households with toilets', 'Census_2001_IHHL'],
    'den1'   : ['Census 2001 Total Rural Households', 'Census_2001_Total_Rural_Households'],
    'R'      : 40,
		'grad'   : 'gradient_legend_dorCart',
		'percent': [1, 50, 96],
		'pertext': ['-50%', '0', '50%'],
		'IWP'    : 'false'
  }),
  dorling_story({
    'menu'   : 'State',
    'title'  : 'Andhra Pradesh',
		'param1' : 'Money Spent',
		'param2' : 'Spending on rural sanitation',
		'url'    : ['TBD'],
    'cols'   : ['Total_Projects_Outlay', 'ExpReported_Total'],
    'area'   : ['Total plan', 'Total_Projects_Outlay'],
    'num'    : ['Total spent', 'ExpReported_Total'],
    'den'    : ['Total plan', 'Total_Projects_Outlay'],
		'area1'  : ['# Rural poor toilets required', function(d) { return +d['PO_IHHL_BPL']; }],
    'x'      : ['Spent / Plan', function(d) { return d['ExpReported_Total'] / d['Total_Projects_Outlay']; }],
    'y'      : ['% Toilets constructed for rural poor', function(d) { return d['PP_IHHL_BPL'] / d['PO_IHHL_BPL']; }],
		'data2'  : 'comparing_spending_toilets_2011.csv',
		'area2'  : ['#Rural poor toilets required', function(d) { return +d['BPL_WT'] + +d['BPL_WOT']; }],
		'x2'     : ['Cumulative finance (in Rs. Lakhs)', 'TSC_Finance'],
		'yT2'    : ['Toilets Built', 'TSC_IHHL_2011'],
		'yC2'    : ['Toilets Built from Census', 'Census_IHHL_2011'], 
    'group'  : ['State_Name'],
		'R'      : 40,
    'xdom'   : [0, 1.5],
    'ydom'   : [0, 1.5],
		'grad'   : 'gradient_legend',
		'K'      : 4.3,
		'A'      : 2.2,
		'range'	 : [1, 5],
		'percent': [1, 37, 70, 95],
    'pertext': [0, 50, 100, 200],
    'cen_t'  : "In 2001, the difference in the number of households without toilets between Census and rural sanitation scheme (TSC) was 0.06 lakhs. In 2011, the difference had grown to 66.08 lakhs.",
		'cen_b'  : ["According to census data, only 32.2 percent of rural households had access to toilets in 2011. According to TSC the number is considerably larger: 75.9 percent."," The 2011 census indicates an increase of 12 percent in rural households from 126.76 lakhs in 2001 to 142.46 lakhs in 2011.","However, TSC has kept this figure constant at 2001 numbers. Thus, when census rural population numbers for 2011 are used to calculate achievement (TSC Actual), TSC's total achievement falls to 67.6 percent."],
		'cen_c'  : ["How much more money needs to be spent to achieve total sanitation for 2011 household numbers?","According to the Census, the required expenditure is 18.3 times the amount spent from 1999 till 2011 (Rs 526.5 crores). According to TSC Actual data, it is 8.8 times.","Assuming the same rate of population growth, by 2022 there will be 161.99 lakh rural households. The scheme needs to acknowledge population trends and revise project objectives to receive the right amount of incentives."],
    'slideshare':'https://onedrive.live.com/embed?cid=44822B77589D1B71&resid=44822B77589D1B71%21130&authkey=ANcrWIQwOv0tQWU&em=2',
    'IWP'    : 'true'					
  }),
  dorling_story({
    'menu'   : 'State',
    'title'  : 'Arunachal Pradesh',
		'param1' : 'Money Spent',
		'param2' : 'Spending on rural sanitation',
		'url'    : ['TBD'],
    'cols'   : ['Total_Projects_Outlay', 'ExpReported_Total'],
    'area'   : ['Total plan', 'Total_Projects_Outlay'],
    'num'    : ['Total spent', 'ExpReported_Total'],
    'den'    : ['Total plan', 'Total_Projects_Outlay'],
		'area1'  : ['# Rural poor toilets required', function(d) { return +d['PO_IHHL_BPL']; }],
    'x'      : ['Spent / Plan', function(d) { return d['ExpReported_Total'] / d['Total_Projects_Outlay']; }],
    'y'      : ['% Toilets constructed for rural poor', function(d) { return d['PP_IHHL_BPL'] / d['PO_IHHL_BPL']; }],
    'data2'  : 'comparing_spending_toilets_2011.csv',
		'area2'  : ['#Rural poor toilets required', function(d) { return +d['BPL_WT'] + +d['BPL_WOT']; }],
		'x2'     : ['Cumulative finance (in Rs. Lakhs)', 'TSC_Finance'],
		'yT2'    : ['Toilets Built', 'TSC_IHHL_2011'],
		'yC2'    : ['Toilets Built from Census', 'Census_IHHL_2011'], 
		'group'  : ['State_Name'],
		'R'      : 40,
    'xdom'   : [0, 1.5],
    'ydom'   : [0, 1.5],
		'grad'   : 'gradient_legend',
		'K'      : 7.5,
		'A'      : 2,
		'range'	 : [1, 3],
		'percent': [1, 37, 70, 95],
    'pertext': [0, 50, 100, 200],
    'cen_t'  : "In 2001, the difference in the number of households without toilets between Census and rural sanitation scheme (TSC) was 0.0006 lakhs. In 2011, the difference had grown to 0.64 lakhs.",
		'cen_b'  : ["According to census data, only 52.7 percent of rural households had access to toilets in 2011. According to TSC the number is considerably larger: 82.3 percent.","The 2011 census indicates an increase of 19 percent in rural households from 1.65 lakhs in 2001 to 1.96 lakhs in 2011. However, TSC has kept this figure constant at 2001 numbers. Thus, when census rural population numbers for 2011 are used to calculate achievement (TSC Actual), TSC's total achievement falls to 69.2 percent."],
		'cen_c'  : ["How much more money needs to be spent to achieve total sanitation for 2011 household numbers?","According to the Census, the required expenditure is 8.7 times the amount spent from 1999 till 2011 (Rs 10.7 crores). According to TSC Actual data, it is 5.6 times.","Assuming the same rate of population growth, by 2022 there will be 2.37 lakh rural households. The scheme needs to acknowledge population trends and revise project objectives to receive the right"],
		'slideshare':'https://onedrive.live.com/embed?cid=44822B77589D1B71&resid=44822B77589D1B71%21130&authkey=ANcrWIQwOv0tQWU&em=2',
    'IWP'    : 'true'					
  }),
  dorling_story({
    'menu'   : 'State',
    'title'  : 'Assam',
		'param1' : 'Money Spent',
		'param2' : 'Spending on rural sanitation',
		'url'    : ['TBD'],
    'cols'   : ['Total_Projects_Outlay', 'ExpReported_Total'],
    'area'   : ['Total plan', 'Total_Projects_Outlay'],
    'num'    : ['Total spent', 'ExpReported_Total'],
    'den'    : ['Total plan', 'Total_Projects_Outlay'],
		'area1'  : ['# Rural poor toilets required', function(d) { return +d['PO_IHHL_BPL']; }],
    'x'      : ['Spent / Plan', function(d) { return d['ExpReported_Total'] / d['Total_Projects_Outlay']; }],
    'y'      : ['% Toilets constructed for rural poor', function(d) { return d['PP_IHHL_BPL'] / d['PO_IHHL_BPL']; }],
    'data2'  : 'comparing_spending_toilets_2011.csv',
		'area2'  : ['#Rural poor toilets required', function(d) { return +d['BPL_WT'] + +d['BPL_WOT']; }],
		'x2'     : ['Cumulative finance (in Rs. Lakhs)', 'TSC_Finance'],
		'yT2'    : ['Toilets Built', 'TSC_IHHL_2011'],
		'yC2'    : ['Toilets Built from Census', 'Census_IHHL_2011'], 
		'group'  : ['State_Name'],
		'R'      : 40,
    'xdom'   : [0, 1.5],
    'ydom'   : [0, 1.5],
		'grad'   : 'gradient_legend',
		'K'      : 6.5,
		'A'      : 2.3,
		'range'	 : [1, 4],
		'percent': [1, 37, 70, 95],
    'pertext': [0, 50, 100, 200],
    'cen_t'  : "In 2001, the difference in the number of households without toilets between Census and rural sanitation scheme (TSC) was (0.014) lakhs with Census reporting less households without toilets than TSC. In 2011, the difference had grown to 18.74 lakhs.",
		'cen_b'  : ["According to census data, only 59.6 percent of rural households had access to toilets in 2011. According to TSC the number is considerably larger: 92.9 percent.","The 2011 census indicates an increase by 27 percent in rural households from 42.2 lakhs in 2001 to 53.75 lakhs in 2011. However, TSC has kept this figure constant at 2001 numbers. Thus, when census rural population numbers for 2011 are used to calculate achievement (TSC Actual), TSC's total achievement falls to 73 percent."],
		'cen_c'  : ["How much more money needs to be spent to achieve total sanitation for 2011 household numbers?","According to the Census, the required expenditure is 9.8 times the amount spent from 1999 till 2011 (Rs 220.9 crores). According to TSC Actual data, it is 6.6 times.","Assuming the same rate of population growth, by 2022 there will be 70.12 lakh rural households. The scheme needs to acknowledge population trends and revise project objectives to receive the right amount of incentives."],
		'slideshare':'https://onedrive.live.com/embed?cid=44822B77589D1B71&resid=44822B77589D1B71%21130&authkey=ANcrWIQwOv0tQWU&em=2',
    'IWP'    : 'true'					
  }),
  dorling_story({
    'menu'   : 'State',
    'title'  : 'Bihar',
		'param1' : 'Money Spent',
		'param2' : 'Spending on rural sanitation',
		'url'    : ['TBD'],
    'cols'   : ['Total_Projects_Outlay', 'ExpReported_Total'],
    'area'   : ['Total plan', 'Total_Projects_Outlay'],
    'num'    : ['Total spent', 'ExpReported_Total'],
    'den'    : ['Total plan', 'Total_Projects_Outlay'],
		'area1'  : ['# Rural poor toilets required', function(d) { return +d['PO_IHHL_BPL']; }],
    'x'      : ['Spent / Plan', function(d) { return d['ExpReported_Total'] / d['Total_Projects_Outlay']; }],
    'y'      : ['% Toilets constructed for rural poor', function(d) { return d['PP_IHHL_BPL'] / d['PO_IHHL_BPL']; }],
		'data2'  : 'comparing_spending_toilets_2011.csv',
		'area2'  : ['#Rural poor toilets required', function(d) { return +d['BPL_WT'] + +d['BPL_WOT']; }],
		'x2'     : ['Cumulative finance (in Rs. Lakhs)', 'TSC_Finance'],
		'yT2'    : ['Toilets Built', 'TSC_IHHL_2011'],
		'yC2'    : ['Toilets Built from Census', 'Census_IHHL_2011'], 
    'group'  : ['State_Name'],
		'R'      : 40,
    'xdom'   : [0, 1.5],
    'ydom'   : [0, 1.5],
		'grad'   : 'gradient_legend',
		'K'      : 7.5,
		'A'      : 1.8,
		'range'	 : [1, 3],
		'percent': [1, 37, 70, 95],
    'pertext': [0, 50, 100, 200],
    'cen_t'  : "In 2001, the difference in the number of households without toilets between Census and rural sanitation scheme (TSC) was 0.018 lakhs. In 2011, the difference had grown to 61.82 lakhs.",
    'cen_b'  : ["According to census data, only 17.6 percent of rural households had access to toilets in 2011. According to TSC the number is 38.7 percent.","The 2011 census indicates an increase by 34 percent in rural households from 126.60 lakhs in 2001 to 169.27 lakhs in 2011. However, TSC has kept this figure constant at 2001 numbers. Thus, when census rural population numbers for 2011 are used to calculate achievement (TSC Actual), TSC's total achievement falls to 28.9 percent."],
    'cen_c'  : ["How much more money needs to be spent to achieve total sanitation for 2011 household numbers?","According to the Census, the required expenditure is 32.5 times the amount spent from 1999 till 2011 (Rs 429.7 crores). According to TSC Actual data, it is 28 times.","Assuming the same rate of population growth, by 2022 there will be 232.99 lakh rural households. The scheme needs to acknowledge population trends and revise project objectives to receive the right amount of incentives."],
		'slideshare':'https://onedrive.live.com/embed?cid=44822B77589D1B71&resid=44822B77589D1B71%21130&authkey=ANcrWIQwOv0tQWU&em=2',
    'IWP'    : 'true'					
  }),
  dorling_story({
    'menu'   : 'State',
    'title'  : 'Chhattisgarh',
		'param1' : 'Money Spent',
		'param2' : 'Spending on rural sanitation',
		'url'    : ['TBD'],
    'cols'   : ['Total_Projects_Outlay', 'ExpReported_Total'],
    'area'   : ['Total plan', 'Total_Projects_Outlay'],
    'num'    : ['Total spent', 'ExpReported_Total'],
    'den'    : ['Total plan', 'Total_Projects_Outlay'],
		'area1'  : ['# Rural poor toilets required', function(d) { return +d['PO_IHHL_BPL']; }],
    'x'      : ['Spent / Plan', function(d) { return d['ExpReported_Total'] / d['Total_Projects_Outlay']; }],
    'y'      : ['% Toilets constructed for rural poor', function(d) { return d['PP_IHHL_BPL'] / d['PO_IHHL_BPL']; }],
		'data2'  : 'comparing_spending_toilets_2011.csv',
		'area2'  : ['#Rural poor toilets required', function(d) { return +d['BPL_WT'] + +d['BPL_WOT']; }],
		'x2'     : ['Cumulative finance (in Rs. Lakhs)', 'TSC_Finance'],
		'yT2'    : ['Toilets Built', 'TSC_IHHL_2011'],
		'yC2'    : ['Toilets Built from Census', 'Census_IHHL_2011'], 
    'group'  : ['State_Name'],
		'R'      : 40,
    'xdom'   : [0, 1.5],
    'ydom'   : [0, 1.5],
		'grad'   : 'gradient_legend',
		'K'      : 4.5,
		'A'      : 2.2,
		'range'	 : [1, 5],
		'percent': [1, 37, 70, 95],
    'pertext': [0, 50, 100, 200],
    'cen_t'  : "In 2001, the difference in the number of households without toilets between Census and rural sanitation scheme (TSC) was (0.006) lakhs with Census reporting less households without toilets than TSC. In 2011, the difference had grown to 24.10 lakhs.",
    'cen_b'  : ["According to census data, only 14.5 percent of rural households had access to toilets in 2011. According to TSC the number is considerably larger: 60.1 percent.","The 2011 census indicates an increase of 31 percent in rural households from 33.59 lakhs in 2001 to 43.84 lakhs in 2011. However, TSC has kept this figure constant at 2001 numbers. Thus, when census rural population numbers for 2011 are used to calculate achievement (TSC Actual), TSC's total achievement falls to 46.1 percent."],
    'cen_c'  : ["How much more money needs to be spent to achieve total sanitation for 2011 household numbers?", "According to the Census, the required expenditure is 20.7 times the amount spent from 1999 till 2011 (Rs 180.7 crores). According to TSC Actual data, it is 13.1 times.", "Assuming the same rate of population growth, by 2022 there will be 58.76 lakh rural households. The scheme needs to acknowledge population trends and revise project objectives to receive the right amount"],
		'slideshare':'https://onedrive.live.com/embed?cid=44822B77589D1B71&resid=44822B77589D1B71%21130&authkey=ANcrWIQwOv0tQWU&em=2',
    'IWP'    : 'true'					
  }),
  dorling_story({
    'menu'   : 'State',
    'title'  : 'D & N Haveli',
		'param1' : 'Money Spent',
		'param2' : 'Spending on rural sanitation',
		'url'    : ['TBD'],
    'cols'   : ['Total_Projects_Outlay', 'ExpReported_Total'],
    'area'   : ['Total plan', 'Total_Projects_Outlay'],
    'num'    : ['Total spent', 'ExpReported_Total'],
    'den'    : ['Total plan', 'Total_Projects_Outlay'],
		'area1'  : ['# Rural poor toilets required', function(d) { return +d['PO_IHHL_BPL']; }],
    'x'      : ['Spent / Plan', function(d) { return d['ExpReported_Total'] / d['Total_Projects_Outlay']; }],
    'y'      : ['% Toilets constructed for rural poor', function(d) { return d['PP_IHHL_BPL'] / d['PO_IHHL_BPL']; }],
		'data2'  : 'comparing_spending_toilets_2011.csv',
		'area2'  : ['#Rural poor toilets required', function(d) { return +d['BPL_WT'] + +d['BPL_WOT']; }],
		'x2'     : ['Cumulative finance (in Rs. Lakhs)', 'TSC_Finance'],
		'yT2'    : ['Toilets Built', 'TSC_IHHL_2011'],
		'yC2'    : ['Toilets Built from Census', 'Census_IHHL_2011'], 
    'group'  : ['State_Name'],
		'R'      : 40,
    'xdom'   : [0, 1.5],
    'ydom'   : [0, 1.5],
		'grad'   : 'gradient_legend',
		'K'      : 50.5,
		'A'      : 2,
		'range'	 : [0.6, 1],
		'percent': [1, 37, 70, 95],
    'pertext': [0, 50, 100, 200],
    'slideshare':'https://onedrive.live.com/embed?cid=44822B77589D1B71&resid=44822B77589D1B71%21130&authkey=ANcrWIQwOv0tQWU&em=2',
		'IWP'    : 'true'					
  }),
  dorling_story({
    'menu'   : 'State',
    'title'  : 'Goa',
		'param1' : 'Money Spent',
		'param2' : 'Spending on rural sanitation',
		'url'    : ['TBD'],
    'cols'   : ['Total_Projects_Outlay', 'ExpReported_Total'],
    'area'   : ['Total plan', 'Total_Projects_Outlay'],
    'num'    : ['Total spent', 'ExpReported_Total'],
    'den'    : ['Total plan', 'Total_Projects_Outlay'],
		'area1'  : ['# Rural poor toilets required', function(d) { return +d['PO_IHHL_BPL']; }],
    'x'      : ['Spent / Plan', function(d) { return d['ExpReported_Total'] / d['Total_Projects_Outlay']; }],
    'y'      : ['% Toilets constructed for rural poor', function(d) { return d['PP_IHHL_BPL'] / d['PO_IHHL_BPL']; }],
		'data2'  : 'comparing_spending_toilets_2011.csv',
		'area2'  : ['#Rural poor toilets required', function(d) { return +d['BPL_WT'] + +d['BPL_WOT']; }],
		'x2'     : ['Cumulative finance (in Rs. Lakhs)', 'TSC_Finance'],
		'yT2'    : ['Toilets Built', 'TSC_IHHL_2011'],
		'yC2'    : ['Toilets Built from Census', 'Census_IHHL_2011'], 
    'group'  : ['State_Name'],
		'R'      : 40,
    'xdom'   : [0, 1.5],
    'ydom'   : [0, 1.5],
		'grad'   : 'gradient_legend',
		'K'      : 30.5,
		'A'      : 2,
		'range'	 : [0.6, 1],
		'percent': [1, 37, 70, 95],
    'pertext': [0, 50, 100, 200],
    'cen_t'  : "In 2001, the difference in the number of households without toilets between Census and rural sanitation scheme (TSC) was 0.0002 lakhs. In 2011, TSC reported greater number of households without toilets than Census. The total difference was 0.021 lakhs.",
    'cen_b'  : ["According to census data, only 70.9 percent of rural households had access to toilets in 2011. According to TSC the number is 72.8 percent.", "The 2011 census indicates a decrease of 11 percent in rural households from 1.41 lakhs in 2001 to 1.25 lakhs in 2011.","However, TSC has kept this figure constant at 2001 numbers. Thus, when census rural population numbers for 2011 are used to calculate achievement (TSC Actual) TSC's total achievement increases to 82.1 percent."],
    'cen_c'  : ["How much more money needs to be spent to achieve total sanitation for 2011 household numbers?", "According to the Census, the required expenditure is 17.1 times the amount spent from 1999 till 2011 (Rs 2.1 crores). According to TSC Actual data, it is 10.5 times.", "Assuming the same rate of population growth, by 2022 there will be 1.09 lakh rural households. The scheme needs to acknowledge population trends and revise project objectives to receive the right amount of incentives."],
		'slideshare':'https://onedrive.live.com/embed?cid=44822B77589D1B71&resid=44822B77589D1B71%21130&authkey=ANcrWIQwOv0tQWU&em=2',
    'IWP'    : 'true'					
  }),
  dorling_story({
    'menu'   : 'State',
    'title'  : 'Gujarat',
		'param1' : 'Money Spent',
		'param2' : 'Spending on rural sanitation',
		'url'    : ['TBD'],
    'cols'   : ['Total_Projects_Outlay', 'ExpReported_Total'],
    'area'   : ['Total plan', 'Total_Projects_Outlay'],
    'num'    : ['Total spent', 'ExpReported_Total'],
    'den'    : ['Total plan', 'Total_Projects_Outlay'],
		'area1'  : ['# Rural poor toilets required', function(d) { return +d['PO_IHHL_BPL']; }],
    'x'      : ['Spent / Plan', function(d) { return d['ExpReported_Total'] / d['Total_Projects_Outlay']; }],
    'y'      : ['% Toilets constructed for rural poor', function(d) { return d['PP_IHHL_BPL'] / d['PO_IHHL_BPL']; }],
		'data2'  : 'comparing_spending_toilets_2011.csv',
		'area2'  : ['#Rural poor toilets required', function(d) { return +d['BPL_WT'] + +d['BPL_WOT']; }],
		'x2'     : ['Cumulative finance (in Rs. Lakhs)', 'TSC_Finance'],
		'yT2'    : ['Toilets Built', 'TSC_IHHL_2011'],
		'yC2'    : ['Toilets Built from Census', 'Census_IHHL_2011'], 
    'group'  : ['State_Name'],
		'R'      : 40,
    'xdom'   : [0, 1.5],
    'ydom'   : [0, 1.5],
		'grad'   : 'gradient_legend',
		'K'      : 6,
		'A'      : 2.2,
		'range'	 : [1, 4],
		'percent': [1, 37, 70, 95],
    'pertext': [0, 50, 100, 200],
    'cen_t'  : "In 2001, the difference in the number of households without toilets between Census and rural sanitation scheme (TSC) was (0.027) lakhs, with Census reporting less households without toilets than TSC. In 2011, the Census number had grown significantly and it reported 42.61 lakhs more households without toilets than TSC.",
    'cen_b'  : ["According to census data, only 33 percent of rural households had access to toilets in 2011. According to TSC the number is considerably larger: 95.4 percent.", "The 2011 census indicates an increase in rural households by 15 percent from 58.86 lakhs in 2001 to 67.65 lakhs in 2011. However, TSC has kept this figure constant at 2001 numbers. Thus, when census rural population numbers are used to calculate achievement (TSC Actual), TSC’s total achievement falls to 83 percent. 4.6 times 18.1 times"],
    'cen_c'  : ["How much more money needs to be spent to achieve total sanitation for 2011 household numbers?", "According to the Census, the required expenditure is 18.1 times the amount spent from 1999 till 2011 (Rs 250.2 crores). According to TSC Actual data, it is 4.6 times.", "Assuming the same rate of population growth, by 2022 there will be 78.85 lakh rural households. The scheme needs to acknowledge population trends and revise project objectives to receive the right amount of incentives."],
		'slideshare':'https://onedrive.live.com/embed?cid=44822B77589D1B71&resid=44822B77589D1B71%21130&authkey=ANcrWIQwOv0tQWU&em=2',
    'IWP'    : 'true'					
  }),
  dorling_story({
    'menu'   : 'State',
    'title'  : 'Haryana',
		'param1' : 'Money Spent',
		'param2' : 'Spending on rural sanitation',
		'url'    : ['TBD'],
    'cols'   : ['Total_Projects_Outlay', 'ExpReported_Total'],
    'area'   : ['Total plan', 'Total_Projects_Outlay'],
    'num'    : ['Total spent', 'ExpReported_Total'],
    'den'    : ['Total plan', 'Total_Projects_Outlay'],
		'area1'  : ['# Rural poor toilets required', function(d) { return +d['PO_IHHL_BPL']; }],
    'x'      : ['Spent / Plan', function(d) { return d['ExpReported_Total'] / d['Total_Projects_Outlay']; }],
    'y'      : ['% Toilets constructed for rural poor', function(d) { return d['PP_IHHL_BPL'] / d['PO_IHHL_BPL']; }],
		'data2'  : 'comparing_spending_toilets_2011.csv',
		'area2'  : ['#Rural poor toilets required', function(d) { return +d['BPL_WT'] + +d['BPL_WOT']; }],
		'x2'     : ['Cumulative finance (in Rs. Lakhs)', 'TSC_Finance'],
		'yT2'    : ['Toilets Built', 'TSC_IHHL_2011'],
		'yC2'    : ['Toilets Built from Census', 'Census_IHHL_2011'], 
    'group'  : ['State_Name'],
		'R'      : 40,
    'xdom'   : [0, 1.5],
    'ydom'   : [0, 1.5],
		'grad'   : 'gradient_legend',
		'K'      : 8,
		'A'      : 1.9,
		'range'	 : [0.6, 3],
		'percent': [1, 37, 70, 95],
    'pertext': [0, 50, 100, 200],
    'cen_t'  : "In 2001, the difference in the number of households without toilets between Census and rural sanitation scheme (TSC) was (0.009) lakhs, with Census reported marginally less households without toilets in 2001. In 2011, the Census numbers have grown significantly and it reported 13.02 lakhs more households without toilets than TSC.",
    'cen_b'  : ["According to census data, 56.1 percent of rural households had access to toilets in 2011. According to TSC achievement is a 100 percent.", "The 2011 census indicates an increase in rural households by 21 percent, from 24.54 lakhs in 2001 to 29.66 lakhs in 2011. However, TSC has kept this figure constant at 2001 numbers. Thus, when census rural population numbers for 2011 are used to calculate achievement (TSC Actual), TSC's total achievement falls to 82.8 percent."],
    'cen_c'  : ["How much more money needs to be spent to achieve total sanitation for 2011 household numbers?", "According to the Census, the required expenditure is 18.8 times the amount spent from 1999 till 2011 (Rs 69.3 crores). According to TSC Actual data, it is 7.4 times.", "Assuming the same rate of population growth, by 2022 there will be 36.53 lakh rural households. The scheme needs to acknowledge population trends and revise project objectives to receive the right amount of incentives."],
		'slideshare':'https://onedrive.live.com/embed?cid=44822B77589D1B71&resid=44822B77589D1B71%21130&authkey=ANcrWIQwOv0tQWU&em=2',
    'IWP'    : 'true'					
  }),
  dorling_story({
    'menu'   : 'State',
    'title'  : 'Himachal Pradesh',
		'param1' : 'Money Spent',
		'param2' : 'Spending on rural sanitation',
		'url'    : ['TBD'],
    'cols'   : ['Total_Projects_Outlay', 'ExpReported_Total'],
    'area'   : ['Total plan', 'Total_Projects_Outlay'],
    'num'    : ['Total spent', 'ExpReported_Total'],
    'den'    : ['Total plan', 'Total_Projects_Outlay'],
		'area1'  : ['# Rural poor toilets required', function(d) { return +d['PO_IHHL_BPL']; }],
    'x'      : ['Spent / Plan', function(d) { return d['ExpReported_Total'] / d['Total_Projects_Outlay']; }],
    'y'      : ['% Toilets constructed for rural poor', function(d) { return d['PP_IHHL_BPL'] / d['PO_IHHL_BPL']; }],
		'data2'  : 'comparing_spending_toilets_2011.csv',
		'area2'  : ['#Rural poor toilets required', function(d) { return +d['BPL_WT'] + +d['BPL_WOT']; }],
		'x2'     : ['Cumulative finance (in Rs. Lakhs)', 'TSC_Finance'],
		'yT2'    : ['Toilets Built', 'TSC_IHHL_2011'],
		'yC2'    : ['Toilets Built from Census', 'Census_IHHL_2011'], 
    'group'  : ['State_Name'],
		'R'      : 40,
    'xdom'   : [0, 1.5],
    'ydom'   : [0, 1.5],
		'grad'   : 'gradient_legend',
		'K'      : 8.5,
		'A'      : 2.1,
		'range'	 : [0.6, 3],
		'percent': [1, 37, 70, 95],
    'pertext': [0, 50, 100, 200],
    'cen_t'  : "In 2001, the difference in the number of households toilets between Census and rural sanitation scheme (TSC) was 0.0019 lakhs. In 2011, the difference had grown to 4.38 lakhs.",
    'cen_b'  : ["According to census data, 66.6 percent of rural households had access to toilets in 2011. According to TSC achievement is a 100 percent.", "The 2011 census indicates an increase in rural households by 19 percent, from 10.98 lakhs in 2001 to 13.11 lakhs in 2011.", "However, TSC has kept this figure constant at 2001 numbers. Thus, when census rural population numbers for 2011 are used to calculate achievement (TSC Actual), TSC’s total achievement falls to 83.7 percent."],
    'cen_c'  : ["How much more money needs to be spent to achieve total sanitation for 2011 household numbers?", "According to the Census, the required expenditure is 30.7 times the amount spent from 1999 till 2011 (Rs 14.3 crores). According to TSC Actual data, it is 14.9 times.", "Assuming the same rate of population growth, by 2022 there will be 15.93 lakh rural households. The scheme needs to acknowledge population trends and revise project objectives to receive the right amount of incentives."],
		'slideshare':'https://onedrive.live.com/embed?cid=44822B77589D1B71&resid=44822B77589D1B71%21130&authkey=ANcrWIQwOv0tQWU&em=2',
    'IWP'    : 'true'					
  }),
  dorling_story({
    'menu'   : 'State',
    'title'  : 'Jammu & Kashmir',
		'param1' : 'Money Spent',
		'param2' : 'Spending on rural sanitation',
		'url'    : ['TBD'],
    'cols'   : ['Total_Projects_Outlay', 'ExpReported_Total'],
    'area'   : ['Total plan', 'Total_Projects_Outlay'],
    'num'    : ['Total spent', 'ExpReported_Total'],
    'den'    : ['Total plan', 'Total_Projects_Outlay'],
		'area1'  : ['# Rural poor toilets required', function(d) { return +d['PO_IHHL_BPL']; }],
    'x'      : ['Spent / Plan', function(d) { return d['ExpReported_Total'] / d['Total_Projects_Outlay']; }],
    'y'      : ['% Toilets constructed for rural poor', function(d) { return d['PP_IHHL_BPL'] / d['PO_IHHL_BPL']; }],
		'data2'  : 'comparing_spending_toilets_2011.csv',
		'area2'  : ['#Rural poor toilets required', function(d) { return +d['BPL_WT'] + +d['BPL_WOT']; }],
		'x2'     : ['Cumulative finance (in Rs. Lakhs)', 'TSC_Finance'],
		'yT2'    : ['Toilets Built', 'TSC_IHHL_2011'],
		'yC2'    : ['Toilets Built from Census', 'Census_IHHL_2011'], 
    'group'  : ['State_Name'],
		'R'      : 40,
    'xdom'   : [0, 1.5],
    'ydom'   : [0, 1.5],
		'grad'   : 'gradient_legend',
		'K'      : 5.3,
		'A'      : 1.9,
		'range'	 : [1, 4],
		'percent': [1, 37, 70, 95],
    'pertext': [0, 50, 100, 200],
    'cen_t'  : "In 2001, the difference in the number of households without toilets between Census and rural sanitation scheme (TSC) was (0.0001) lakhs, with Census reporting marginally less households without toilets. In 2011, Census numbers had increased significantly and it reported 5.98 lakhs more households without toilets than TSC.",
    'cen_b'  : ["According to census data, only 38.6 percent of rural households had access to toilets in 2011. According to TSC the number is considerably larger: 72.3 percent.", "The 2011 census indicates an increase in rural households by 29 percent, from 11.61 lakhs in 2001 to 14.98 lakhs in 2011.. However, TSC has kept this figure constant at 2001 numbers. Thus, when census rural population numbers for 2011 are used to calculate achievement (TSC Actual), TSC's total achievement falls to 56.1 percent. 20.5 times 28.7 times"],
    'cen_c'  : ["How much more money needs to be spent to achieve total sanitation for 2011 household numbers?", "According to the Census, the required expenditure is 28.7 times the amount spent from 1999 till 2011 (Rs 32 crores). According to TSC Actual data, it is 20.5 times.", "Assuming the same rate of population growth, by 2022 there will be 19.82 lakh rural households. The scheme needs to acknowledge population trends and revise project objectives to receive the right amount of incentives."],
		'slideshare':'https://onedrive.live.com/embed?cid=44822B77589D1B71&resid=44822B77589D1B71%21130&authkey=ANcrWIQwOv0tQWU&em=2',
    'IWP'    : 'true'					
  }),
  dorling_story({
    'menu'   : 'State',
    'title'  : 'Jharkhand',
		'param1' : 'Money Spent',
		'param2' : 'Spending on rural sanitation',
		'url'    : ['TBD'],
    'cols'   : ['Total_Projects_Outlay', 'ExpReported_Total'],
    'area'   : ['Total plan', 'Total_Projects_Outlay'],
    'num'    : ['Total spent', 'ExpReported_Total'],
    'den'    : ['Total plan', 'Total_Projects_Outlay'],
		'area1'  : ['# Rural poor toilets required', function(d) { return +d['PO_IHHL_BPL']; }],
    'x'      : ['Spent / Plan', function(d) { return d['ExpReported_Total'] / d['Total_Projects_Outlay']; }],
    'y'      : ['% Toilets constructed for rural poor', function(d) { return d['PP_IHHL_BPL'] / d['PO_IHHL_BPL']; }],
		'data2'  : 'comparing_spending_toilets_2011.csv',
		'area2'  : ['#Rural poor toilets required', function(d) { return +d['BPL_WT'] + +d['BPL_WOT']; }],
		'x2'     : ['Cumulative finance (in Rs. Lakhs)', 'TSC_Finance'],
		'yT2'    : ['Toilets Built', 'TSC_IHHL_2011'],
		'yC2'    : ['Toilets Built from Census', 'Census_IHHL_2011'], 
    'group'  : ['State_Name'],
		'R'      : 40,
    'xdom'   : [0, 1.5],
    'ydom'   : [0, 1.5],
		'grad'   : 'gradient_legend',
		'K'      : 7.5,
		'A'      : 2,
		'range'	 : [0.6, 3],
		'percent': [1, 37, 70, 95],
    'pertext': [0, 50, 100, 200],
    'cen_t'  : "In 2001, the difference in the number of households without toilets between Census and rural sanitation scheme (TSC) was (0.011) lakhs, with Census reporting marginally less households without toilets. In 2011, Census numbers increased significantly and it reported 23.3 lakhs more households without toilets than TSC.",
    'cen_b'  : ["According to census data, only 7.6 percent of rural households had access to toilets in 2011. According to TSC achievement is 47.4 percent.", "The 2011 census indicates an increase in rural households by 23 percent, from 38.02 lakhs in 2001 to 46.86 lakhs in 2011. However, TSC has kept this figure constant at 2001 numbers. Thus, when census rural population numbers for 2011 are used to calculate achievement (TSC Actual), TSC's total achievement falls to 38.5 percent."],
    'cen_c'  : ["How much more money needs to be spent to achieve total sanitation by 2011 households numbers?", "According to the Census, the required expenditure is 23.7 times the amount spent from 1999 till 2011 (Rs 183 crores). According to TSC Actual data, it is 15.8 times.", "Assuming the same rate of population growth, by 2022 there will be 58.97 lakh rural households. The scheme needs to acknowledge population trends and revise project objectives to receive the right amount"],
		'slideshare':'https://onedrive.live.com/embed?cid=44822B77589D1B71&resid=44822B77589D1B71%21130&authkey=ANcrWIQwOv0tQWU&em=2',
    'IWP'    : 'true'					
  }),
  dorling_story({
    'menu'   : 'State',
    'title'  : 'Karnataka',
		'param1' : 'Money Spent',
		'param2' : 'Spending on rural sanitation',
		'url'    : ['TBD'],
    'cols'   : ['Total_Projects_Outlay', 'ExpReported_Total'],
    'area'   : ['Total plan', 'Total_Projects_Outlay'],
    'num'    : ['Total spent', 'ExpReported_Total'],
    'den'    : ['Total plan', 'Total_Projects_Outlay'],
		'area1'  : ['# Rural poor toilets required', function(d) { return +d['PO_IHHL_BPL']; }],
    'x'      : ['Spent / Plan', function(d) { return d['ExpReported_Total'] / d['Total_Projects_Outlay']; }],
    'y'      : ['% Toilets constructed for rural poor', function(d) { return d['PP_IHHL_BPL'] / d['PO_IHHL_BPL']; }],
		'data2'  : 'comparing_spending_toilets_2011.csv',
		'area2'  : ['#Rural poor toilets required', function(d) { return +d['BPL_WT'] + +d['BPL_WOT']; }],
		'x2'     : ['Cumulative finance (in Rs. Lakhs)', 'TSC_Finance'],
		'yT2'    : ['Toilets Built', 'TSC_IHHL_2011'],
		'yC2'    : ['Toilets Built from Census', 'Census_IHHL_2011'], 
    'group'  : ['State_Name'],
		'R'      : 40,
    'xdom'   : [0, 1.5],
    'ydom'   : [0, 1.5],
		'grad'   : 'gradient_legend',
		'K'      : 4.5,
		'A'      : 1.9,
		'range'	 : [1, 5],
		'percent': [1, 37, 70, 95],
    'pertext': [0, 50, 100, 200],
    'cen_t'  : "In 2001, the difference in the number of households without toilets between Census and rural sanitation scheme (TSC) was (0.002) lakhs, with Census having marginally less households without toilets. In 2011, Census numbers increased significantly and it reported 38.88 lakhs more households without toilets than TSC.",
    'cen_b'  : ["According to census data, only 28.4 percent of rural households had access to IHHLs in 2011. According to TSC the number is considerably larger: 73.9 percent.", "The 2011 census indicates an increase in rural households by 18 percent from 66.75 lakhs in 2001 to 78.64 lakhs in 2011. However, TSC has kept this figure constant at 2001 numbers. Thus, when census rural population numbers for 2011 are used to calculate achievement (TSC Actual), TSC's total achievement falls to 62.7 percent."],
    'cen_c'  : ["How much more money needs to be spent to achieve total sanitation by 2011 household numbers?", "According to the Census, the required expenditure is 24.5 times the amount spent from 1999 till 2011 (Rs 230.1 crores). According to TSC Actual data, it is 12.7 times.", "Assuming the same rate of population growth, by 2022 there will be 94.18 lakh rural households. The scheme needs to acknowledge population trends and revise project objectives to receive the right amount of incentives."],
		'slideshare':'https://onedrive.live.com/embed?cid=44822B77589D1B71&resid=44822B77589D1B71%21130&authkey=ANcrWIQwOv0tQWU&em=2',
    'IWP'    : 'true'					
  }),
  dorling_story({
    'menu'   : 'State',
    'title'  : 'Kerala',
		'param1' : 'Money Spent',
		'param2' : 'Spending on rural sanitation',
		'url'    : ['TBD'],
    'cols'   : ['Total_Projects_Outlay', 'ExpReported_Total'],
    'area'   : ['Total plan', 'Total_Projects_Outlay'],
    'num'    : ['Total spent', 'ExpReported_Total'],
    'den'    : ['Total plan', 'Total_Projects_Outlay'],
		'area1'  : ['# Rural poor toilets required', function(d) { return +d['PO_IHHL_BPL']; }],
    'x'      : ['Spent / Plan', function(d) { return d['ExpReported_Total'] / d['Total_Projects_Outlay']; }],
    'y'      : ['% Toilets constructed for rural poor', function(d) { return d['PP_IHHL_BPL'] / d['PO_IHHL_BPL']; }],
		'data2'  : 'comparing_spending_toilets_2011.csv',
		'area2'  : ['#Rural poor toilets required', function(d) { return +d['BPL_WT'] + +d['BPL_WOT']; }],
		'x2'     : ['Cumulative finance (in Rs. Lakhs)', 'TSC_Finance'],
		'yT2'    : ['Toilets Built', 'TSC_IHHL_2011'],
		'yC2'    : ['Toilets Built from Census', 'Census_IHHL_2011'], 
    'group'  : ['State_Name'],
		'R'      : 40,
    'xdom'   : [0, 1.5],
    'ydom'   : [0, 1.5],
		'grad'   : 'gradient_legend',
		'K'      : 7,
		'A'      : 1.9,
		'range'	 : [1, 3],
		'percent': [1, 37, 70, 95],
    'pertext': [0, 50, 100, 200],
    'cen_t'  : "In 2001, the difference in the number of households without toilets between Census and rural sanitation scheme (TSC) was 0.017 lakhs. In 2011, the difference had grown to 2.79 lakhs.",
    'cen_b'  : ["According to census data, 93.2 percent of rural households had access to toilets in 2011. According to TSC achievement is a 100 percent.", "The number of rural households in Kerala fell by 17 percent, from 49.43 lakhs in 2001 to 40.96 lakhs in 2011. This is one reason why TSC's physical achievement exceeds the total number of households."],
    'cen_c'  : ["How much more money needs to be spent to achieve total sanitation by 2011 households numbers?", "According to the Census, the required expenditure is 2.2 times the amount spent from 1999 till 2011 (Rs 124.2 crores). According to TSC data the target has been met.", "It is important to note that Kerala’s IHHL coverage in 2001 was already up to 81.3 percent. Assuming the same rate of population growth, by 2022 there will be 33.31 lakh rural households. The scheme will need to acknowledge population trends and revise project objectives accordingly."],
		'slideshare':'https://onedrive.live.com/embed?cid=44822B77589D1B71&resid=44822B77589D1B71%21130&authkey=ANcrWIQwOv0tQWU&em=2',
    'IWP'    : 'true'					
  }),
  dorling_story({
    'menu'   : 'State',
    'title'  : 'Madhya Pradesh',
		'param1' : 'Money Spent',
		'param2' : 'Spending on rural sanitation',
		'url'    : ['TBD'],
    'cols'   : ['Total_Projects_Outlay', 'ExpReported_Total'],
    'area'   : ['Total plan', 'Total_Projects_Outlay'],
    'num'    : ['Total spent', 'ExpReported_Total'],
    'den'    : ['Total plan', 'Total_Projects_Outlay'],
		'area1'  : ['# Rural poor toilets required', function(d) { return +d['PO_IHHL_BPL']; }],
    'x'      : ['Spent / Plan', function(d) { return d['ExpReported_Total'] / d['Total_Projects_Outlay']; }],
    'y'      : ['% Toilets constructed for rural poor', function(d) { return d['PP_IHHL_BPL'] / d['PO_IHHL_BPL']; }],
		'data2'  : 'comparing_spending_toilets_2011.csv',
		'area2'  : ['#Rural poor toilets required', function(d) { return +d['BPL_WT'] + +d['BPL_WOT']; }],
		'x2'     : ['Cumulative finance (in Rs. Lakhs)', 'TSC_Finance'],
		'yT2'    : ['Toilets Built', 'TSC_IHHL_2011'],
		'yC2'    : ['Toilets Built from Census', 'Census_IHHL_2011'], 
    'group'  : ['State_Name'],
		'R'      : 40,
    'xdom'   : [0, 1.5],
    'ydom'   : [0, 1.5],
		'grad'   : 'gradient_legend',
		'K'      : 5,
		'A'      : 1.8,
		'range'	 : [1, 5],
		'percent': [1, 37, 70, 95],
    'pertext': [0, 50, 100, 200],
    'cen_t'  : "In 2001, the difference in the number of households without toilets between Census and rural sanitation scheme (TSC) was 0.031 lakhs. In 2011, the difference had grown to 84.52 lakhs.",
    'cen_b'  : ["According to census data, only 13.1 percent of rural households had access to toilets in 2011. According to TSC the number is considerably larger: 85.1 percent.", "The 2011 census indicates an increase in rural households by 37 percent, from 81.25 lakhs in 2001 to 111.22 lakhs in 2011.. However, TSC has kept this figure constant at 2001 numbers. Thus, when census rural population numbers for 2011 are used to calculate achievement (TSC Actual), TSC's total achievement falls to 62.1 percent."],
    'cen_c'  : ["How much more money needs to be spent to achieve total sanitation for 2011 household numbers?", "According to the Census, the required expenditure is 21.7 times the amount spent from 1999 till 2011 (Rs 445.7 crores). According to TSC Actual data, it is 9.4 times.", "Assuming the same rate of population growth, by 2022 there will be 157.12 lakh rural households. The scheme needs to acknowledge population trends and revise project objectives to receive the right amount of incentives."],
		'slideshare':'https://onedrive.live.com/embed?cid=44822B77589D1B71&resid=44822B77589D1B71%21130&authkey=ANcrWIQwOv0tQWU&em=2',
    'IWP'    : 'true'					
  }),
  dorling_story({
    'menu'   : 'State',
    'title'  : 'Maharashtra',
		'param1' : 'Money Spent',
		'param2' : 'Spending on rural sanitation',
		'url'    : ['TBD'],
    'cols'   : ['Total_Projects_Outlay', 'ExpReported_Total'],
    'area'   : ['Total plan', 'Total_Projects_Outlay'],
    'num'    : ['Total spent', 'ExpReported_Total'],
    'den'    : ['Total plan', 'Total_Projects_Outlay'],
		'area1'  : ['# Rural poor toilets required', function(d) { return +d['PO_IHHL_BPL']; }],
    'x'      : ['Spent / Plan', function(d) { return d['ExpReported_Total'] / d['Total_Projects_Outlay']; }],
    'y'      : ['% Toilets constructed for rural poor', function(d) { return d['PP_IHHL_BPL'] / d['PO_IHHL_BPL']; }],
		'data2'  : 'comparing_spending_toilets_2011.csv',
		'area2'  : ['#Rural poor toilets required', function(d) { return +d['BPL_WT'] + +d['BPL_WOT']; }],
		'x2'     : ['Cumulative finance (in Rs. Lakhs)', 'TSC_Finance'],
		'yT2'    : ['Toilets Built', 'TSC_IHHL_2011'],
		'yC2'    : ['Toilets Built from Census', 'Census_IHHL_2011'], 
    'group'  : ['State_Name'],
		'R'      : 40,
    'xdom'   : [0, 1.5],
    'ydom'   : [0, 1.5],
		'grad'   : 'gradient_legend',
		'K'      : 4.5,
		'A'      : 2.5,
		'range'	 : [1, 5],
		'percent': [1, 37, 70, 95],
		'pertext': [0, 50, 100, 200],
		'cen_t'  : "In 2001, the difference in the number of households without toilets between Census and rural sanitation scheme (TSC) was 0.011 lakhs. In 2011, the difference had grown to 56.51 lakhs.",
		'cen_b'  : ["According to census data, only 38 percent of rural households had access to toilets in 2011. According to TSC the number is considerably larger: 78 percent.", "The 2011 census indicates an increase in rural households by 18 percent, from 109.94 lakhs in 2001 to 130.17 lakhs in 2011. However, TSC has kept this figure constant at 2001 numbers. Thus, when census rural population numbers for 2011 are used to calculate achievement (TSC Actual), TSC's total achievement falls to 65.9 percent."],
		'cen_c'  : ["How much more money needs to be spent to achieve total sanitation by 2011 household numbers?", "According to the Census, the required expenditure is 26.5 times the amount spent from 1999 till 2011 (Rs 305.1 crores). According to TSC Actual data, it is 14.6 times.", "Assuming the same rate of population growth, by 2022 there will be 156.74 lakh rural households. The scheme needs to acknowledge population trends and revise project objectives to receive the right amount"],
		'slideshare':'https://onedrive.live.com/embed?cid=44822B77589D1B71&resid=44822B77589D1B71%21130&authkey=ANcrWIQwOv0tQWU&em=2',
    'IWP'    : 'true'					
  }),
  dorling_story({
    'menu'   : 'State',
    'title'  : 'Manipur',
		'param1' : 'Money Spent',
		'param2' : 'Spending on rural sanitation',
		'url'    : ['TBD'],
    'cols'   : ['Total_Projects_Outlay', 'ExpReported_Total'],
    'area'   : ['Total plan', 'Total_Projects_Outlay'],
    'num'    : ['Total spent', 'ExpReported_Total'],
    'den'    : ['Total plan', 'Total_Projects_Outlay'],
		'area1'  : ['# Rural poor toilets required', function(d) { return +d['PO_IHHL_BPL']; }],
    'x'      : ['Spent / Plan', function(d) { return d['ExpReported_Total'] / d['Total_Projects_Outlay']; }],
    'y'      : ['% Toilets constructed for rural poor', function(d) { return d['PP_IHHL_BPL'] / d['PO_IHHL_BPL']; }],
		'data2'  : 'comparing_spending_toilets_2011.csv',
		'area2'  : ['#Rural poor toilets required', function(d) { return +d['BPL_WT'] + +d['BPL_WOT']; }],
		'x2'     : ['Cumulative finance (in Rs. Lakhs)', 'TSC_Finance'],
		'yT2'    : ['Toilets Built', 'TSC_IHHL_2011'],
		'yC2'    : ['Toilets Built from Census', 'Census_IHHL_2011'], 
    'group'  : ['State_Name'],
		'R'      : 40,
    'xdom'   : [0, 1.5],
    'ydom'   : [0, 1.5],
		'grad'   : 'gradient_legend',
		'K'      : 12.5,
		'A'      : 2,
		'range'	 : [0.6, 2],
		'percent': [1, 37, 70, 95],
    'pertext': [0, 50, 100, 200],
    'cen_t'  : "In 2001, the difference in the number of households without toilets between Census and rural sanitation scheme (TSC) was (0.0001) lakhs, with Census reporting marginally less number of households without toilets. In 2011, the difference between Census and TSC had grown significantly with Census reporting 0.470 lakhs more households without toilets than TSC.",
    'cen_b'  : ["According to census data, only 86 percent of rural households had access to toilets in 2011. According to TSC achievement is a 100 percent.", "The 2011 census indicates an increase of 13 percent in rural households from 2.96 lakhs in 2001 to 3.36 lakhs in 2011. However, TSC has kept this figure constant at 2001 numbers. Thus, when census rural population numbers for 2011 are used to calculate achievement (TSC Actual), TSC's total achievement falls to 88.3 percent."],
    'cen_c'  : ["How much more money needs to be spent to achieve total sanitation for 2011 household numbers?", "According to the Census, the required expenditure is 5 times the amount spent from 1999 till 2011 (Rs 9.3 crores). According to TSC Actual data, it is 4.2 times.", "Assuming the same rate of population growth, by 2022 there will be 3.85 lakh households. The scheme needs to acknowledge population trends and revise project objectives to receive the right amount of incentives."],
		'slideshare':'https://onedrive.live.com/embed?cid=44822B77589D1B71&resid=44822B77589D1B71%21130&authkey=ANcrWIQwOv0tQWU&em=2',
    'IWP'    : 'true'					
  }),
  dorling_story({
    'menu'   : 'State',
    'title'  : 'Meghalaya',
		'param1' : 'Money Spent',
		'param2' : 'Spending on rural sanitation',
		'url'    : ['TBD'],
    'cols'   : ['Total_Projects_Outlay', 'ExpReported_Total'],
    'area'   : ['Total plan', 'Total_Projects_Outlay'],
    'num'    : ['Total spent', 'ExpReported_Total'],
    'den'    : ['Total plan', 'Total_Projects_Outlay'],
		'area1'  : ['# Rural poor toilets required', function(d) { return +d['PO_IHHL_BPL']; }],
    'x'      : ['Spent / Plan', function(d) { return d['ExpReported_Total'] / d['Total_Projects_Outlay']; }],
    'y'      : ['% Toilets constructed for rural poor', function(d) { return d['PP_IHHL_BPL'] / d['PO_IHHL_BPL']; }],
		'data2'  : 'comparing_spending_toilets_2011.csv',
		'area2'  : ['#Rural poor toilets required', function(d) { return +d['BPL_WT'] + +d['BPL_WOT']; }],
		'x2'     : ['Cumulative finance (in Rs. Lakhs)', 'TSC_Finance'],
		'yT2'    : ['Toilets Built', 'TSC_IHHL_2011'],
		'yC2'    : ['Toilets Built from Census', 'Census_IHHL_2011'], 
    'group'  : ['State_Name'],
		'R'      : 40,
    'xdom'   : [0, 1.5],
    'ydom'   : [0, 1.5],
		'grad'   : 'gradient_legend',
		'K'      : 12.5,
		'A'      : 2,
		'range'	 : [0.6, 2],
		'percent': [1, 37, 70, 95],
    'pertext': [0, 50, 100, 200],
    'cen_t'  : "In 2001, the difference in the number of households without toilets between Census and rural sanitation scheme (TSC) was (0.00002) lakhs, with Census reporting marginally less households without toilets. In 2011, Census reported 1.638 lakhs more households without toilets than TSC.",
    'cen_b'  : ["According to census data, only 53.9 percent of rural households had access to toilets in 2011. According to TSC achievement is 90.7 percent.", "The 2011 census indicates an increase of 28 percent in rural households from 3.30 lakhs in 2001 to 4.22 lakhs in 2011. However, TSC has kept this figure constant at 2001 numbers. Thus, when census rural population numbers for 2011 are used to calculate achievement (TSC Actual), TSC's total achievement falls to 70.8 percent."],
    'cen_c'  : ["How much more money needs to be spent to achieve total sanitation for 2011 household numbers?", "According to the Census, the required expenditure is 7.7 times the amount spent from 1999 till 2011 (Rs 25.2 crores). According to TSC Actual data, it is 4.9 times.", "Assuming the same rate of population growth, by 2022 there will be 5.54 lakh households. The scheme needs to acknowledge population trends and revise project objectives to receive the right amount of incentives."],
		'slideshare':'https://onedrive.live.com/embed?cid=44822B77589D1B71&resid=44822B77589D1B71%21130&authkey=ANcrWIQwOv0tQWU&em=2',
    'IWP'    : 'true'					
  }),
  dorling_story({
    'menu'   : 'State',
    'title'  : 'Mizoram',
		'param1' : 'Money Spent',
		'param2' : 'Spending on rural sanitation',
		'url'    : ['TBD'],
    'cols'   : ['Total_Projects_Outlay', 'ExpReported_Total'],
    'area'   : ['Total plan', 'Total_Projects_Outlay'],
    'num'    : ['Total spent', 'ExpReported_Total'],
    'den'    : ['Total plan', 'Total_Projects_Outlay'],
		'area1'  : ['# Rural poor toilets required', function(d) { return +d['PO_IHHL_BPL']; }],
    'x'      : ['Spent / Plan', function(d) { return d['ExpReported_Total'] / d['Total_Projects_Outlay']; }],
    'y'      : ['% Toilets constructed for rural poor', function(d) { return d['PP_IHHL_BPL'] / d['PO_IHHL_BPL']; }],
		'data2'  : 'comparing_spending_toilets_2011.csv',
		'area2'  : ['#Rural poor toilets required', function(d) { return +d['BPL_WT'] + +d['BPL_WOT']; }],
		'x2'     : ['Cumulative finance (in Rs. Lakhs)', 'TSC_Finance'],
		'yT2'    : ['Toilets Built', 'TSC_IHHL_2011'],
		'yC2'    : ['Toilets Built from Census', 'Census_IHHL_2011'], 
    'group'  : ['State_Name'],
		'R'      : 40,
    'xdom'   : [0, 1.5],
    'ydom'   : [0, 1.5],
		'grad'   : 'gradient_legend',
		'K'      : 11,
		'A'      : 2.1,
		'range'	 : [0.6, 2],
		'percent': [1, 37, 70, 95],
    'pertext': [0, 50, 100, 200],
    'cen_t'  : "In 2001, the difference in the number of households without toilets between Census and rural sanitation scheme (TSC) was 0.0003 lakhs. In 2011, the difference had grown to 0.16 lakhs.",
    'cen_b'  : ["According to census data, only 84.6 percent of rural households had access to toilets in 2011. According to TSC achievement is a 100 percent.", "The 2011 census indicates an increase of 32 percent in rural households from 0.79 lakhs in 2001 to 1.05 lakhs in 2011. However, TSC has kept this figure constant at 2001 numbers. Thus, when census rural population numbers for 2011 are used to calculate achievement (TSC Actual), TSC's total achievement falls to 75.7 percent."],
    'cen_c'  : ["How much more money needs to be spent to achieve total sanitation for 2011 household numbers?", "According to the Census, the required expenditure is 1.8 times the amount spent from 1999 till 2011 (Rs 8.8 crores). According to TSC Actual data, it is 2.9 times.", "Assuming the same rate of population growth, by 2022 there will be 1.43 lakh households. The scheme needs to acknowledge population trends and revise project objectives to receive the right amount of incentives."],
		'slideshare':'https://onedrive.live.com/embed?cid=44822B77589D1B71&resid=44822B77589D1B71%21130&authkey=ANcrWIQwOv0tQWU&em=2',
    'IWP'    : 'true'					
  }),
  dorling_story({
    'menu'   : 'State',
    'title'  : 'Nagaland',
		'param1' : 'Money Spent',
		'param2' : 'Spending on rural sanitation',
		'url'    : ['TBD'],
    'cols'   : ['Total_Projects_Outlay', 'ExpReported_Total'],
    'area'   : ['Total plan', 'Total_Projects_Outlay'],
    'num'    : ['Total spent', 'ExpReported_Total'],
    'den'    : ['Total plan', 'Total_Projects_Outlay'],
		'area1'  : ['# Rural poor toilets required', function(d) { return +d['PO_IHHL_BPL']; }],
    'x'      : ['Spent / Plan', function(d) { return d['ExpReported_Total'] / d['Total_Projects_Outlay']; }],
    'y'      : ['% Toilets constructed for rural poor', function(d) { return d['PP_IHHL_BPL'] / d['PO_IHHL_BPL']; }],
		'data2'  : 'comparing_spending_toilets_2011.csv',
		'area2'  : ['#Rural poor toilets required', function(d) { return +d['BPL_WT'] + +d['BPL_WOT']; }],
		'x2'     : ['Cumulative finance (in Rs. Lakhs)', 'TSC_Finance'],
		'yT2'    : ['Toilets Built', 'TSC_IHHL_2011'],
		'yC2'    : ['Toilets Built from Census', 'Census_IHHL_2011'], 
    'group'  : ['State_Name'],
		'R'      : 40,
    'xdom'   : [0, 1.5],
    'ydom'   : [0, 1.5],
		'grad'   : 'gradient_legend',
		'K'      : 15,
		'A'      : 1.9,
		'range'	 : [0.6, 1],
		'percent': [1, 37, 70, 95],
    'pertext': [0, 50, 100, 200],
    'cen_t'  : "In 2001, the difference in the number of households without toilets between Census and rural sanitation scheme (TSC) was 0.001 lakhs. In 2011, the difference had grown to 0.76 lakhs.",
    'cen_b'  : ["According to census data, only 69.2 percent of rural households had access to toilets in 2011. According to TSC achievement is considerably larger: 95.4 percent.", "The 2011 census indicates an increase of 7 percent in rural households from 2.65 lakhs in 2001 to 2.85 lakhs in 2011. However, TSC has kept this figure constant at 2001 numbers. Thus, when census rural population numbers for 2011 are used to calculate achievement (TSC Actual), TSC's total achievement falls to 88.9 percent."],
    'cen_c'  : ["How much more money needs to be spent to achieve total sanitation for 2011 household numbers?", "According to the Census, the required expenditure is 5.7 times the amount spent from 1999 till 2011 (Rs 15.4 crores). According to TSC Actual data, it is 2.1 times.", "Assuming the same rate of population growth, by 2022 there will be 3.08 lakh households. The scheme needs to acknowledge population trends and revise project objectives to receive the right amount of incentives."],
		'slideshare':'https://onedrive.live.com/embed?cid=44822B77589D1B71&resid=44822B77589D1B71%21130&authkey=ANcrWIQwOv0tQWU&em=2',
    'IWP'    : 'true'					
  }),
  dorling_story({
    'menu'   : 'State',
    'title'  : 'Orissa',
		'param1' : 'Money Spent',
		'param2' : 'Spending on rural sanitation',
		'url'    : ['TBD'],
    'cols'   : ['Total_Projects_Outlay', 'ExpReported_Total'],
    'area'   : ['Total plan', 'Total_Projects_Outlay'],
    'num'    : ['Total spent', 'ExpReported_Total'],
    'den'    : ['Total plan', 'Total_Projects_Outlay'],
		'area1'  : ['# Rural poor toilets required', function(d) { return +d['PO_IHHL_BPL']; }],
    'x'      : ['Spent / Plan', function(d) { return d['ExpReported_Total'] / d['Total_Projects_Outlay']; }],
    'y'      : ['% Toilets constructed for rural poor', function(d) { return d['PP_IHHL_BPL'] / d['PO_IHHL_BPL']; }],
		'data2'  : 'comparing_spending_toilets_2011.csv',
		'area2'  : ['#Rural poor toilets required', function(d) { return +d['BPL_WT'] + +d['BPL_WOT']; }],
		'x2'     : ['Cumulative finance (in Rs. Lakhs)', 'TSC_Finance'],
		'yT2'    : ['Toilets Built', 'TSC_IHHL_2011'],
		'yC2'    : ['Toilets Built from Census', 'Census_IHHL_2011'], 
    'group'  : ['State_Name'],
		'R'      : 40,
    'xdom'   : [0, 1.5],
    'ydom'   : [0, 1.5],
		'grad'   : 'gradient_legend',
		'K'      : 6,
		'A'      : 2.3,
		'range'	 : [1, 4],
		'percent': [1, 37, 70, 95],
    'pertext': [0, 50, 100, 200],
    'cen_t'  : "In 2001, the difference in the number of households without toilets between Census and rural sanitation scheme (TSC) was 0.009 lakhs. In 2011, the difference had grown to 42.09 lakhs.",
    'cen_b'  : ["According to census data, only 14.1 percent of rural households had access to toilets in 2011. According to TSC achievement is considerably larger: 58.9 percent.", "The 2011 census indicates an increase of 20 percent in rural households from 67.83 lakhs in 2001 to 81.44 lakhs in 2011. However, TSC has kept this figure constant at 2001 numbers. Thus, when census rural population numbers for 2011 are used to calculate achievement (TSC Actual), TSC's total achievement falls to 49.1 percent."],
    'cen_c'  : ["How much more money needs to be spent to achieve total sanitation for 2011 household numbers?", "According to the Census, the required expenditure is 26.1 times the amount spent from 1999 till 2011 (Rs 268.5 crores). According to TSC Actual data, it is 15.4 times.", "Assuming the same rate of population growth, by 2022 there will be 99.59 lakh households. The scheme needs to acknowledge population trends and revise project objectives to receive the right amount of incentives."],
		'slideshare':'https://onedrive.live.com/embed?cid=44822B77589D1B71&resid=44822B77589D1B71%21130&authkey=ANcrWIQwOv0tQWU&em=2',
    'IWP'    : 'true'					
  }),
  dorling_story({
    'menu'   : 'State',
    'title'  : 'Puducherry',
		'param1' : 'Money Spent',
		'param2' : 'Spending on rural sanitation',
		'url'    : ['TBD'],
    'cols'   : ['Total_Projects_Outlay', 'ExpReported_Total'],
    'area'   : ['Total plan', 'Total_Projects_Outlay'],
    'num'    : ['Total spent', 'ExpReported_Total'],
    'den'    : ['Total plan', 'Total_Projects_Outlay'],
		'area1'  : ['# Rural poor toilets required', function(d) { return +d['PO_IHHL_BPL']; }],
    'x'      : ['Spent / Plan', function(d) { return d['ExpReported_Total'] / d['Total_Projects_Outlay']; }],
    'y'      : ['% Toilets constructed for rural poor', function(d) { return d['PP_IHHL_BPL'] / d['PO_IHHL_BPL']; }],
		'data2'  : 'comparing_spending_toilets_2011.csv',
		'area2'  : ['#Rural poor toilets required', function(d) { return +d['BPL_WT'] + +d['BPL_WOT']; }],
		'x2'     : ['Cumulative finance (in Rs. Lakhs)', 'TSC_Finance'],
		'yT2'    : ['Toilets Built', 'TSC_IHHL_2011'],
		'yC2'    : ['Toilets Built from Census', 'Census_IHHL_2011'], 
    'group'  : ['State_Name'],
		'R'      : 40,
    'xdom'   : [0, 1.5],
    'ydom'   : [0, 1.5],
		'grad'   : 'gradient_legend',
		'K'      : 50.5,
		'A'      : 2.2,
		'range'	 : [0.6, 1],
		'percent': [1, 37, 70, 95],
    'pertext': [0, 50, 100, 200],
		'slideshare':'https://onedrive.live.com/embed?cid=44822B77589D1B71&resid=44822B77589D1B71%21130&authkey=ANcrWIQwOv0tQWU&em=2',
    'IWP'    : 'true'					
  }),
  dorling_story({
    'menu'   : 'State',
    'title'  : 'Punjab',
		'param1' : 'Money Spent',
		'param2' : 'Spending on rural sanitation',
		'url'    : ['TBD'],
    'cols'   : ['Total_Projects_Outlay', 'ExpReported_Total'],
    'area'   : ['Total plan', 'Total_Projects_Outlay'],
    'num'    : ['Total spent', 'ExpReported_Total'],
    'den'    : ['Total plan', 'Total_Projects_Outlay'],
		'area1'  : ['# Rural poor toilets required', function(d) { return +d['PO_IHHL_BPL']; }],
    'x'      : ['Spent / Plan', function(d) { return d['ExpReported_Total'] / d['Total_Projects_Outlay']; }],
    'y'      : ['% Toilets constructed for rural poor', function(d) { return d['PP_IHHL_BPL'] / d['PO_IHHL_BPL']; }],
		'data2'  : 'comparing_spending_toilets_2011.csv',
		'area2'  : ['#Rural poor toilets required', function(d) { return +d['BPL_WT'] + +d['BPL_WOT']; }],
		'x2'     : ['Cumulative finance (in Rs. Lakhs)', 'TSC_Finance'],
		'yT2'    : ['Toilets Built', 'TSC_IHHL_2011'],
		'yC2'    : ['Toilets Built from Census', 'Census_IHHL_2011'], 
    'group'  : ['State_Name'],
		'R'      : 40,
    'xdom'   : [0, 1.5],
    'ydom'   : [0, 1.5],
		'grad'   : 'gradient_legend',
		'K'      : 9,
		'A'      : 1.8,
		'range'	 : [0.6, 2],
		'percent': [1, 37, 70, 95],
    'pertext': [0, 50, 100, 200],
    'cen_t'  : "In 2001, the difference in the number of households without toilets between Census and rural sanitation scheme (TSC) was 0.0036 lakhs. In 2011, the difference had grown to 3.57 lakhs.",
    'cen_b'  : ["According to census data, only 70.4 percent of rural households had access to toilets in 2011. According to TSC achievement is 77.5 percent.", "The 2011 census indicates an increase of 19 percent in rural households from 27.75 lakhs in 2001 to 33.16 lakhs in 2011. However, TSC has kept this figure constant at 2001 numbers. Thus, when census rural population numbers for 2011 are used to calculate achievement (TSC Actual), TSC's total achievement falls to 64.9 percent."],
    'cen_c'  : ["How much more money needs to be spent to achieve total sanitation for 2011 household numbers?", "According to the Census, the required expenditure is 298.3 times the amount spent from 1999 till 2011 (Rs 3.3 crores). According to TSC Actual data, it is 353.8 times.", "Assuming the same rate of population growth, by 2022 there will be 40.32 lakh households. The scheme needs to acknowledge population trends and revise project objectives to receive the right amount of incentives."],
		'slideshare':'https://onedrive.live.com/embed?cid=44822B77589D1B71&resid=44822B77589D1B71%21130&authkey=ANcrWIQwOv0tQWU&em=2',
    'IWP'    : 'true'					
  }),
  dorling_story({
    'menu'   : 'State',
    'title'  : 'Rajasthan',
		'param1' : 'Money Spent',
		'param2' : 'Spending on rural sanitation',
		'url'    : ['TBD'],
    'cols'   : ['Total_Projects_Outlay', 'ExpReported_Total'],
    'area'   : ['Total plan', 'Total_Projects_Outlay'],
    'num'    : ['Total spent', 'ExpReported_Total'],
    'den'    : ['Total plan', 'Total_Projects_Outlay'],
		'area1'  : ['# Rural poor toilets required', function(d) { return +d['PO_IHHL_BPL']; }],
    'x'      : ['Spent / Plan', function(d) { return d['ExpReported_Total'] / d['Total_Projects_Outlay']; }],
    'y'      : ['% Toilets constructed for rural poor', function(d) { return d['PP_IHHL_BPL'] / d['PO_IHHL_BPL']; }],
		'data2'  : 'comparing_spending_toilets_2011.csv',
		'area2'  : ['#Rural poor toilets required', function(d) { return +d['BPL_WT'] + +d['BPL_WOT']; }],
		'x2'     : ['Cumulative finance (in Rs. Lakhs)', 'TSC_Finance'],
		'yT2'    : ['Toilets Built', 'TSC_IHHL_2011'],
		'yC2'    : ['Toilets Built from Census', 'Census_IHHL_2011'], 
    'group'  : ['State_Name'],
		'R'      : 40,
    'xdom'   : [0, 1.5],
    'ydom'   : [0, 1.5],
		'grad'   : 'gradient_legend',
		'K'      : 4,
		'A'      : 2,
		'range'	 : [2, 5],
		'percent': [1, 37, 70, 95],
    'pertext': [0, 50, 100, 200],
    'cen_t'  : "In 2001, the difference in the number of households without toilets between Census and rural sanitation scheme (TSC) was 0.005 lakhs. In 2011, the difference had grown to 50.27 lakhs.",
    'cen_b'  : ["According to census data, only 19.6 percent of rural households had access to toilets in 2011. According to TSC achievement is considerably larger: 63.6 percent.", "The 2011 census indicates an increase of 33 percent in rural households from 71.57 lakhs in 2001 to 94.90 lakhs in 2011. However, TSC has kept this figure constant at 2001 numbers. Thus, when census rural population numbers for 2011 are used to calculate achievement (TSC Actual), TSC's total achievement falls to 48 percent."],
    'cen_c'  : ["How much more money needs to be spent to achieve total sanitation for 2011 household numbers?", "According to the Census, the required expenditure is 85 times the amount spent from 1999 till 2011 (Rs 89.7 crores). According to TSC Actual data, it is 55 times.", "Assuming the same rate of population growth, by 2022 there will be 129.45 lakh households. The scheme needs to acknowledge population trends and revise project objectives to receive the right amount of incentives."],
		'slideshare':'https://onedrive.live.com/embed?cid=44822B77589D1B71&resid=44822B77589D1B71%21130&authkey=ANcrWIQwOv0tQWU&em=2',
    'IWP'    : 'true'					
  }),
  dorling_story({
    'menu'   : 'State',
    'title'  : 'Sikkim',
		'param1' : 'Money Spent',
		'param2' : 'Spending on rural sanitation',
		'url'    : ['TBD'],
    'cols'   : ['Total_Projects_Outlay', 'ExpReported_Total'],
    'area'   : ['Total plan', 'Total_Projects_Outlay'],
    'num'    : ['Total spent', 'ExpReported_Total'],
    'den'    : ['Total plan', 'Total_Projects_Outlay'],
		'area1'  : ['# Rural poor toilets required', function(d) { return +d['PO_IHHL_BPL']; }],
    'x'      : ['Spent / Plan', function(d) { return d['ExpReported_Total'] / d['Total_Projects_Outlay']; }],
    'y'      : ['% Toilets constructed for rural poor', function(d) { return d['PP_IHHL_BPL'] / d['PO_IHHL_BPL']; }],
		'data2'  : 'comparing_spending_toilets_2011.csv',
		'area2'  : ['#Rural poor toilets required', function(d) { return +d['BPL_WT'] + +d['BPL_WOT']; }],
		'x2'     : ['Cumulative finance (in Rs. Lakhs)', 'TSC_Finance'],
		'yT2'    : ['Toilets Built', 'TSC_IHHL_2011'],
		'yC2'    : ['Toilets Built from Census', 'Census_IHHL_2011'], 
    'group'  : ['State_Name'],
		'R'      : 40,
    'xdom'   : [0, 1.5],
    'ydom'   : [0, 1.5],
		'grad'   : 'gradient_legend',
		'K'      : 25.5,
		'A'      : 1.9,
		'range'	 : [0.6, 1],
		'percent': [1, 37, 70, 95],
    'pertext': [0, 50, 100, 200],
    'cen_t'  : "In 2001, the difference in the number of households without toilets between Census and rural sanitation scheme (TSC) was (0.0005) lakhs, with Census reporting marginally less household without toilets. In 2011, Census reported 0.15 lakhs more households without toilets than TSC.",
    'cen_b'  : ["According to census data, only 84.1 percent of rural households had access to toilets in 2011. According to TSC achievement is a 100 percent.", "The 2011 census indicates an increase of 1 percent in rural households from 0.917 lakhs in 2001 to 0.924 lakhs in 2011. However, TSC has kept this figure constant at 2001 numbers. Thus, when census rural population numbers for 2011 are used to calculate achievement (TSC Actual), TSC's total achievement falls to 99.3 percent."],
    'cen_c'  : ["How much more money needs to be spent to achieve total sanitation for 2011 household numbers?", "According to the Census, the required expenditure is 0.8 times the amount spent from 1999 till 2011 (Rs 19.4 crores). According to TSC Actual data, it is 0.03 times.", "Assuming the same rate of population growth, by 2022 there will be 0.93 lakh households. The scheme needs to acknowledge population trends and revise project objectives to receive the right amount of incentives."],
		'slideshare':'https://onedrive.live.com/embed?cid=44822B77589D1B71&resid=44822B77589D1B71%21130&authkey=ANcrWIQwOv0tQWU&em=2',
    'IWP'    : 'true'					
  }),
  dorling_story({
    'menu'   : 'State',
    'title'  : 'Tamil Nadu',
		'param1' : 'Money Spent',
		'param2' : 'Spending on rural sanitation',
		'url'    : ['TBD'],
    'cols'   : ['Total_Projects_Outlay', 'ExpReported_Total'],
    'area'   : ['Total plan', 'Total_Projects_Outlay'],
    'num'    : ['Total spent', 'ExpReported_Total'],
    'den'    : ['Total plan', 'Total_Projects_Outlay'],
		'area1'  : ['# Rural poor toilets required', function(d) { return +d['PO_IHHL_BPL']; }],
    'x'      : ['Spent / Plan', function(d) { return d['ExpReported_Total'] / d['Total_Projects_Outlay']; }],
    'y'      : ['% Toilets constructed for rural poor', function(d) { return d['PP_IHHL_BPL'] / d['PO_IHHL_BPL']; }],
		'data2'  : 'comparing_spending_toilets_2011.csv',
		'area2'  : ['#Rural poor toilets required', function(d) { return +d['BPL_WT'] + +d['BPL_WOT']; }],
		'x2'     : ['Cumulative finance (in Rs. Lakhs)', 'TSC_Finance'],
		'yT2'    : ['Toilets Built', 'TSC_IHHL_2011'],
		'yC2'    : ['Toilets Built from Census', 'Census_IHHL_2011'], 
    'group'  : ['State_Name'],
		'R'      : 40,
    'xdom'   : [0, 1.5],
    'ydom'   : [0, 1.5],
		'grad'   : 'gradient_legend',
		'K'      : 5.5,
		'A'      : 2.2,
		'range'	 : [1, 4],
		'percent': [1, 37, 70, 95],
    'pertext': [0, 50, 100, 200],
    'cen_t'  : "In 2001, the difference in the number of households without toilets between Census and rural sanitation scheme (TSC) was (0.03) lakhs, with Census reporting marginally less households without toilets. In 2011, Census reported 70.69 lakhs more households without toilets than TSC.",
    'cen_b'  : ["According to census data, only 23.2 percent of rural households had access to toilets in 2011. According to TSC the number is considerably larger: 96.7 percent.", "The 2011 census indicates an increase of 16 percent in rural households from 82.75 lakhs in 2001 to 95.64 lakhs in 2011. However, TSC has kept this figure constant at 2001 numbers. Thus, when census rural population numbers for 2011 are used to calculate achievement (TSC Actual), TSC's total achievement falls to 83.6 percent."],
    'cen_c'  : ["How much more money needs to be spent to achieve total sanitation for 2011 households?", "According to the Census, the required expenditure is 16.6 times the amount spent from 1999 till 2011 (Rs 441.5 crores). According to TSC Actual data, it is 3.5 times.", "Assuming the same rate of population growth, by 2022 there will be 112.15 lakh households. The scheme needs to acknowledge population trends and revise project objectives to receive the right amount of incentives."],
		'slideshare':'https://onedrive.live.com/embed?cid=44822B77589D1B71&resid=44822B77589D1B71%21130&authkey=ANcrWIQwOv0tQWU&em=2',
    'IWP'    : 'true'					
  }),
  dorling_story({
    'menu'   : 'State',
    'title'  : 'Tripura',
		'param1' : 'Money Spent',
		'param2' : 'Spending on rural sanitation',
		'url'    : ['TBD'],
    'cols'   : ['Total_Projects_Outlay', 'ExpReported_Total'],
    'area'   : ['Total plan', 'Total_Projects_Outlay'],
    'num'    : ['Total spent', 'ExpReported_Total'],
    'den'    : ['Total plan', 'Total_Projects_Outlay'],
		'area1'  : ['# Rural poor toilets required', function(d) { return +d['PO_IHHL_BPL']; }],
    'x'      : ['Spent / Plan', function(d) { return d['ExpReported_Total'] / d['Total_Projects_Outlay']; }],
    'y'      : ['% Toilets constructed for rural poor', function(d) { return d['PP_IHHL_BPL'] / d['PO_IHHL_BPL']; }],
		'data2'  : 'comparing_spending_toilets_2011.csv',
		'area2'  : ['#Rural poor toilets required', function(d) { return +d['BPL_WT'] + +d['BPL_WOT']; }],
		'x2'     : ['Cumulative finance (in Rs. Lakhs)', 'TSC_Finance'],
		'yT2'    : ['Toilets Built', 'TSC_IHHL_2011'],
		'yC2'    : ['Toilets Built from Census', 'Census_IHHL_2011'], 
    'group'  : ['State_Name'],
		'R'      : 40,
    'xdom'   : [0, 1.5],
    'ydom'   : [0, 1.5],
		'grad'   : 'gradient_legend',
		'K'      : 18,
		'A'      : 2,
		'range'	 : [0.6, 1],
		'percent': [1, 37, 70, 95],
    'pertext': [0, 50, 100, 200],  
    'cen_t'  : "In 2001, the difference in the number of households without toilets between Census and rural sanitation scheme (TSC) was 0.001 lakhs. In 2011, the difference had grown to 1.12 lakhs.",
    'cen_b'  : ["According to census data, only 81.5 percent of rural households had access to toilets in 2011. According to TSC achievement is a 100 percent.", "The 2011 census indicates an increase of 13 percent in rural households from 5.40 lakhs in 2001 to 6.08 lakhs in 2011. However, TSC has kept this figure constant at 2001 numbers. Thus, when census rural population numbers for 2011 are used to calculate achievement (TSC Actual), TSC's total achievement falls to 88.8 percent."],
    'cen_c'  : ["How much more money needs to be spent to achieve total sanitation for 2011 household numbers?", "According to the Census, the required expenditure is 2.6 times the amount spent from 1999 till 2011 (Rs 43.5 crores). According to TSC Actual data, it is 1.6 times.", "Assuming the same rate of population growth, by 2022 there will be 6.93 lakh households. The scheme needs to acknowledge population trends and revise project objectives to receive the right amount of incentives."],  
		'slideshare':'https://onedrive.live.com/embed?cid=44822B77589D1B71&resid=44822B77589D1B71%21130&authkey=ANcrWIQwOv0tQWU&em=2',
    'IWP'    : 'true'					
  }),
  dorling_story({
    'menu'   : 'State',
    'title'  : 'Uttar Pradesh',
		'param1' : 'Money Spent',
		'param2' : 'Spending on rural sanitation',
		'url'    : ['TBD'],
    'cols'   : ['Total_Projects_Outlay', 'ExpReported_Total'],
    'area'   : ['Total plan', 'Total_Projects_Outlay'],
    'num'    : ['Total spent', 'ExpReported_Total'],
    'den'    : ['Total plan', 'Total_Projects_Outlay'],
		'area1'  : ['# Rural poor toilets required', function(d) { return +d['PO_IHHL_BPL']; }],
    'x'      : ['Spent / Plan', function(d) { return d['ExpReported_Total'] / d['Total_Projects_Outlay']; }],
    'y'      : ['% Toilets constructed for rural poor', function(d) { return d['PP_IHHL_BPL'] / d['PO_IHHL_BPL']; }],
		'data2'  : 'comparing_spending_toilets_2011.csv',
		'area2'  : ['#Rural poor toilets required', function(d) { return +d['BPL_WT'] + +d['BPL_WOT']; }],
		'x2'     : ['Cumulative finance (in Rs. Lakhs)', 'TSC_Finance'],
		'yT2'    : ['Toilets Built', 'TSC_IHHL_2011'],
		'yC2'    : ['Toilets Built from Census', 'Census_IHHL_2011'], 
    'group'  : ['State_Name'],
		'R'      : 40,
    'xdom'   : [0, 1.5],
    'ydom'   : [0, 1.5],
		'grad'   : 'gradient_legend',
		'K'      : 4.3,
		'A'      : 1.9,
		'range'	 : [1, 5],
		'percent': [1, 37, 70, 95],
    'pertext': [0, 50, 100, 200],
    'cen_t'  : ["In 2001, the difference in the number of households without toilets between Census and rural sanitation scheme (TSC) was 0.05 lakhs. In 2011, the difference had grown to 192.4 lakhs. "], 
		'cen_b'  : ["According to census data, only 21.8 percent of rural households had access to toilets in 2011. According to TSC achievement is considerably larger: 96.7 percent.", "The 2011 census indicates an increase of 24 percent in rural households from 205.90 lakhs in 2001 to 254.75 lakhs in 2011. However, TSC has kept this figure constant at 2001 numbers. Thus, when census rural population numbers for 2011 are used to calculate achievement (TSC Actual), TSC's total achievement falls to 78.1 percent. "],
		'cen_c'  : ["How much more money needs to be spent to achieve total sanitation for 2011 household numbers?", "According to the Census, the required expenditure is 11.3 times the amount spent from 1999 till 2011 (Rs 1759.9 crores). According to TSC Actual data, it is 3.2 times. "],
		'slideshare':'https://onedrive.live.com/embed?cid=44822B77589D1B71&resid=44822B77589D1B71%21130&authkey=ANcrWIQwOv0tQWU&em=2',
    'IWP'    : 'true'					
  }),
  dorling_story({
    'menu'   : 'State',
    'title'  : 'Uttarakhand',
		'param1' : 'Money Spent',
		'param2' : 'Spending on rural sanitation',
		'url'    : ['TBD'],
    'cols'   : ['Total_Projects_Outlay', 'ExpReported_Total'],
    'area'   : ['Total plan', 'Total_Projects_Outlay'],
    'num'    : ['Total spent', 'ExpReported_Total'],
    'den'    : ['Total plan', 'Total_Projects_Outlay'],
		'area1'  : ['# Rural poor toilets required', function(d) { return +d['PO_IHHL_BPL']; }],
    'x'      : ['Spent / Plan', function(d) { return d['ExpReported_Total'] / d['Total_Projects_Outlay']; }],
    'y'      : ['% Toilets constructed for rural poor', function(d) { return d['PP_IHHL_BPL'] / d['PO_IHHL_BPL']; }],
		'data2'  : 'comparing_spending_toilets_2011.csv',
		'area2'  : ['#Rural poor toilets required', function(d) { return +d['BPL_WT'] + +d['BPL_WOT']; }],
		'x2'     : ['Cumulative finance (in Rs. Lakhs)', 'TSC_Finance'],
		'yT2'    : ['Toilets Built', 'TSC_IHHL_2011'],
		'yC2'    : ['Toilets Built from Census', 'Census_IHHL_2011'], 
    'group'  : ['State_Name'],
		'R'      : 40,
    'xdom'   : [0, 1.5],
    'ydom'   : [0, 1.5],
		'grad'   : 'gradient_legend',
		'K'      : 9.5,
		'A'      : 2.1,
		'range'	 : [0.6, 2],
		'percent': [1, 37, 70, 95],
    'pertext': [0, 50, 100, 200],   
    'cen_t'  : "In 2001, the difference in the number of households without toilets between Census and rural sanitation scheme (TSC) was 0.0001 lakhs. In 2011, the difference had grown to 4.22 lakhs.", 
    'cen_b'  : ["According to census data, only 54.1 percent of rural households had access to toilets in 2011. According to TSC achievement is 81.4 percent.", "The 2011 census indicates an increase of 17 percent in rural households from 11.96 lakhs in 2001 to 14.05 lakhs in 2011. However, TSC has kept this figure constant at 2001 numbers. Thus, when census rural population numbers are used to calculate achievement (TSC Actual), TSC's total achievement falls to 69.3 percent."],
    'cen_c'  : ["How much more money needs to be spent to achieve total sanitation for 2011 household numbers?", "According to the Census, the required expenditure is 14.8 times the amount spent from 1999 till 2011 (Rs 43.6 crores). According to TSC Actual data, it is 9.9 times.", "Assuming the same rate of population growth, by 2022 there will be 16.77 lakh households. The scheme needs to acknowledge population trends and revise project objectives to receive the right amount of incentives."], 
		'slideshare':'https://onedrive.live.com/embed?cid=44822B77589D1B71&resid=44822B77589D1B71%21130&authkey=ANcrWIQwOv0tQWU&em=2',
    'IWP'    : 'true'					
  }),
  dorling_story({
    'menu'   : 'State',
    'title'  : 'West Bengal',
		'param1' : 'Money Spent',
		'param2' : 'Spending on rural sanitation',
		'url'    : ['TBD'],
    'cols'   : ['Total_Projects_Outlay', 'ExpReported_Total'],
    'area'   : ['Total plan', 'Total_Projects_Outlay'],
    'num'    : ['Total spent', 'ExpReported_Total'],
    'den'    : ['Total plan', 'Total_Projects_Outlay'],
		'area1'  : ['# Rural poor toilets required', function(d) { return +d['PO_IHHL_BPL']; }],
    'x'      : ['Spent / Plan', function(d) { return d['ExpReported_Total'] / d['Total_Projects_Outlay']; }],
    'y'      : ['% Toilets constructed for rural poor', function(d) { return d['PP_IHHL_BPL'] / d['PO_IHHL_BPL']; }],
		'data2'  : 'comparing_spending_toilets_2011.csv',
		'area2'  : ['#Rural poor toilets required', function(d) { return +d['BPL_WT'] + +d['BPL_WOT']; }],
		'x2'     : ['Cumulative finance (in Rs. Lakhs)', 'TSC_Finance'],
		'yT2'    : ['Toilets Built', 'TSC_IHHL_2011'],
		'yC2'    : ['Toilets Built from Census', 'Census_IHHL_2011'], 
    'group'  : ['State_Name'],
		'R'      : 40,
    'xdom'   : [0, 1.5],
    'ydom'   : [0, 1.5],
		'grad'   : 'gradient_legend',
		'K'      : 5,
		'A'      : 1.7,
		'range'	 : [1, 5],
		'percent': [1, 37, 70, 95],
    'pertext': [0, 50, 100, 200],
    'cen_t'  : "In 2001, the difference in the number of households without toilets between Census and rural sanitation scheme (TSC) was 0.03 lakhs. In 2011, the difference had grown to 73.11 lakhs.",
	  'cen_b'  : ["According to census data, only 46.7 percent of rural households had access to toilets in 2011. According to TSC achievement is a 100 percent.", "The 2011 census indicates an increase of 23 percent in rural households from 111.62 lakhs in 2001 to 137.17 lakhs in 2011. However, TSC has kept this figure constant at 2001 numbers. Thus, when census rural population numbers for 2011 are used to calculate achievement (TSC Actual), TSC’s total achievement falls to 81.4 percent."],
		'cen_c'  : ["How much more money needs to be spent to achieve total sanitation for 2011 household numbers?", "According to the Census, the required expenditure is 18.9 times the amount spent from 1999 till 2011 (Rs 387.2 crores). According to TSC Actual data, it is 6.6 times.", "Assuming the same rate of population growth, by 2022 there will be 172.09 lakh households. The scheme needs to acknowledge population trends and revise project objectives to receive the right amount of incentives."],
		'slideshare':'https://onedrive.live.com/embed?cid=44822B77589D1B71&resid=44822B77589D1B71%21130&authkey=ANcrWIQwOv0tQWU&em=2',
    'IWP'    : 'true'					
  })
];
// List of the historical data files, latest on top
var datafiles = [
  'data-23-Feb-2014.csv',
  'data-16-Feb-2014.csv',
  'data-09-Feb-2014.csv',
  'data-02-Feb-2014.csv',
  'data-26-Jan-2014.csv',
  'data-19-Jan-2014.csv',
	'data-12-Jan-2014.csv',
  'data-05-Jan-2014.csv',
  'data-29-Dec-2013.csv',
	'data-22-Dec-2013.csv',
	'data-15-Dec-2013.csv',
	'data-08-Dec-2013.csv',
	'data-01-Dec-2013.csv',
	'data-24-Nov-2013.csv',
	'data-17-Nov-2013.csv',
	'data-10-Nov-2013.csv',
	'data-03-Nov-2013.csv',
	'data-27-Oct-2013.csv',
	'data-20-Oct-2013.csv',
	'data-13-Oct-2013.csv',
	'data-06-Oct-2013.csv',
	'data-29-Sep-2013.csv',
	'data-22-Sep-2013.csv',
	'data-15-Sep-2013.csv',
	'data-08-Sep-2013.csv',
	'data-01-Sep-2013.csv',
	'data-25-Aug-2013.csv',
	'data-18-Aug-2013.csv',
	'data-11-Aug-2013.csv',
	'data-04-Aug-2013.csv',
	'data-28-Jul-2013.csv',
	'data-21-Jul-2013.csv',
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