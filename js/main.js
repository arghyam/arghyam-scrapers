//var host = window.location.host;
//var iwp = 'www.indiawaterportal.org';
var host = window.location.href;
var iwp = 'http://arghyam.github.io/arghyam-scrapers/?#';
console.log(host);
d3.selectAll('.tooltip').remove();
if(host == iwp){
	var iwpStories = _.filter(stories, function(d){ return d.IWP == 'true'; });
	var menu = d3.nest().key(function(d) { return d.menu; }).entries(iwpStories);
}else{
	var menu = d3.nest().key(function(d) { return d.menu; }).entries(stories);
}
// Display the menus
var parentmenu = d3.select('ul.nav')
  .selectAll('li.dropdown')
    .data(menu)
  .enter()
    .append('li')
    .classed('dropdown', true);
parentmenu
  .append('a')
  .attr('href', '#')
  .classed('dropdown-toggle', true)
  .attr('data-toggle', 'dropdown')
  .text(function(d) { return d.key + ' '; })
      .append('b')
      .classed('caret', true);
var submenu = parentmenu
  .append('ul')
  .classed('dropdown-menu', true);
var search = submenu.append('div').classed('dropdown-toggle', true);

	search.append('input')
		.attr('type', 'text')
		.attr('id','search')
		.attr('placeholder', 'search...')
		.style('margin', '0 20px -20px 20px');
		
	search.append('i')
		.classed('icon-search', true)
		.style('margin-top', '-8px')
		.style('margin-left', '220px')
		.style('opacity', '0.4');		
  submenu.selectAll('li')
      .data(function(d) { return d.values; })
    .enter()
      .append('li')
        .append('a')
        .attr('href', '#')
        .text(function(d) { return d.title;	}) 
        .on('click', draw);
$('input#search').click(function(){return false;}); //prevent menu hide					
$('.dropdown-toggle').click(function(){ 
	$allListElements = $('.nav ul > li');
	$allListElements.show(); 
});				
$('input#search').keyup(function(){
	searchText = new RegExp($(this).val(), 'i');
	$allListElements = $('.nav ul > li');
	$matchingListElements = $allListElements.filter(function(i, el){ return $(el).text().match(searchText) });
	$allListElements.hide();
	$matchingListElements.show();			
});
// Create the menu on #about as well
d3.select('#about-entry').append('ul')
  .selectAll('li')
    .data(menu)
  .enter()
    .append('li')
    .text(function(d) { return d.key; })
    .append('ul')
    .selectAll('li')
        .data(function(d) { return d.values; })
      .enter()
        .append('li')
        .append('a')
        .attr('href', '#')
        .text(function(d) { return d.title; })
        .on('click', draw);
// Create the dates menu
d3.select('#datafiles')
  .on('change', function() {
    hashchange();		
  })
  .selectAll('option')
    .data(datafiles)
  .enter()
    .append('option')
    .attr('value', String)
    .text(function(d) { return d.replace(/^data\-/, '').replace(/\.csv/, ''); });		
var svg = d3.select('#chart')
    .on('click', function() {
      var drilldown = d3.select('#visual').classed('drilldown');
      d3.select('#visual').classed('drilldown', !drilldown);			
    });
if(host == iwp){
		d3.selectAll('#demo').style('display', 'block');
		d3.selectAll('#about').style('display', 'none');			
}else{
		d3.select('#demo').style('display', 'none');	
		d3.select('#about').style('display', 'block');		
}
d3.select('#home').on('click', function() {
	d3.selectAll('.tooltip').remove();
	d3.select('.container').style('margin-left', '90px');	
  d3.selectAll('#visual, #method').style('display', 'none');
	if(host == iwp){
		d3.select('#demo').style('display', 'block');
		d3.select('#about').style('display', 'none');
	}else{
		d3.select('#about').style('display', 'block');
		d3.select('#demo').style('display', 'none');
	}		
});
d3.select('#methodology').on('click', function () {
		d3.event.preventDefault();
		window.location.replace('#methodology');
		d3.selectAll('.tooltip').remove();	
		d3.select('.container').style('margin-left', '90px');	
		d3.select('#method').style('display', 'block');		
		d3.selectAll('#about, #demo, #visual').style('display', 'none');				
});
// Returns the name of the data file for the currently selected date.
function datafile() { 
  var file = d3.select('#datafiles').property('value');
  d3.select('#data').attr('href', file);
  return file;
}
// When the URL hash changes, draw the appropriate story.
function hashchange(e) {
  var hash = decodeURIComponent(window.location.hash.replace(/^#/, '')).split('|');
  if(hash == ''){
		if(host == iwp){
			d3.select('#demo').style('display', 'block');
			d3.selectAll('#about, #visual, #method').style('display', 'none');
		}else{
			d3.select('#about').style('display', 'block');
			d3.selectAll('#demo, #visual, #method').style('display', 'none');
		}
	}else if (hash == 'methodology'){		
		d3.select('#method').style('display', 'block');
		d3.selectAll('#about, #demo, #visual').style('display', 'none');		
	}else{
		for (var i=0, l=stories.length; i<l; i++) {
			var story = stories[i];
			if((story.menu == hash[0]) && (story.title == hash[1])) {						
					if(story.menu == 'State'){
						story.param1 = hash[2];
						story.param2 = hash[3];
						story.url = tmp_story[hash[3]].url;
						story.cols = tmp_story[hash[3]].cols;
						story.area = tmp_story[hash[3]].area;
						story.size = tmp_story[hash[3]].area[1];
						story.num = tmp_story[hash[3]].num;
						story.den = tmp_story[hash[3]].den;								
					}
				return draw(story);	
			}
		}
	} 	
}
window.addEventListener('hashchange', hashchange);
hashchange();
// When any menu option is clicked, draw it.
function draw(story) {
	if (d3.event) {
    d3.event.preventDefault();		
  }
	$('#emb_text').val('');
	$('#status').val('');
  d3.select('#exp_text').text(' ');	
	d3.selectAll('#about, #method, #demo, #brought').style('display', 'none');
	d3.select('#data_cont div').style('padding-left','90px').style('margin-left','0');
	d3.select('#data_cont div strong').text('From: 2001, Till (Change Date):');	
	d3.select('#visual').style('display', 'block');
  d3.selectAll('.treemap text').remove();
  d3.select('#chart').style('border', 'none');
	d3.selectAll('.legend').style('display', 'none');
  d3.select('#legend_cont').style('padding-left', '1px');		
	// Remove treemap gradient container 
  d3.select('#gradient_cont').style('display', 'none');
  // Remove scatterplot info container
  d3.select('#right_container').style('display','none');
	d3.select('#hide_text').style('display', 'none');
  // Set the title and story
  d3.select('#menu').text(story.menu);	
  d3.select('#title').text(story.title);
  d3.select('#subtitle').text(story.subtitle);
  d3.select('#story').text(story.story);
  d3.selectAll('#columns text').remove();
  d3.select('#columns').text(story.cols.join(", "));
  d3.selectAll('#source a').remove();
	d3.select('#chart').attr('height', 500);
	d3.selectAll('.horiz0, .horiz1').remove();
	d3.selectAll('.tooltip').remove();
  d3.select('#source').selectAll('a')
      .data(story.url)
    .enter()
      .append('a')
      .attr('target', '_blank')
      .attr('href', String)
      .text(String);
  if(story.menu == 'State'){		
	  window.location.hash = encodeURIComponent(story.menu + '|' + story.title + '|' + story.param1 + '|' + story.param2);
	}else{
		window.location.hash = encodeURIComponent(story.menu + '|' + story.title);
	}
  window['draw_' + story.type](story);
	d3.select('#exp_text').text(' ');	
	d3.select('#bottom').remove();
	if(story.context){
		var cont = d3.select('#exp_text').append('p').html('<strong>Context:</strong> ');
		cont.append('span').html(story.context);
		var expl = story.cont_p.split('@');
		cont.selectAll('.expl')
			  	.data(expl)
			  .enter().append('p')
		      .html(function(d){ return d.split('$').join('&nbsp &nbsp'); }); 	
		if(story.calc){
			var calc = cont.append('p').html('<strong>Calculation:</strong> ');
			calc.append('span').html(story.calc);
			var expl = story.calc_p.split('@');
			cont.selectAll('.expl')
				.data(expl)
			 .enter().append('p')
				.html(function(d){ return d.split('$').join('&nbsp &nbsp')});				
		}				
		var viz = cont.append('p').html('<strong>Using the visualization:</strong> ');
		viz.append('span').html(story.viz);
		var expl = story.viz_p.split('@');	
		cont.selectAll('.expl')
			  	.data(expl)
			  .enter().append('p')
		      .html(function(d){ return d.split('$').join('&nbsp &nbsp'); });
		cont.append('p').append('a').text('Click on the ppt for more help with using the visualisation.')
					.style('cursor', 'pointer')
			    .on('click', function(){ window.scrollTo(0, document.body.scrollHeight) ;});		
	}
	d3.select('#slideshare').style('display', 'none');
	if(window.location.search != '?embed=1'){
		if(story.slideshare){
			d3.select('#slideshare').style('display', 'block');
			d3.select('#pptFrame').attr('src', story.slideshare);		
		}
	}		
}
function draw_date(daterow, story) {
    var dates = _.uniq(_.map(story.cols, function(col) { return daterow[col]; }));
    d3.select('#date').text(dates.join(', '));
}
function draw_treemap(story) { 
	d3.selectAll('.tooltip').remove();
  // Add gradient legend for treemap
  d3.select('#gradient_cont').style('display', 'block');
	d3.selectAll('#gradient text').remove();
	d3.select('.legend.treemap').style('display', 'block');	
	// Creates gradient legend for treemap
	var gradient = d3.select('#gradient');
  gradient.append('rect').attr('x', 0).attr('y', 0)
    .attr('width', 958).attr('height', 30)
    .attr('fill', 'url(#'+ story.grad +')');
  gradient.selectAll('text')
    .data(story.percent) // gradient percentage from svg defs
   .enter().append('text')
    .attr('x', function(d){ return d + '%';})
    .attr('y', 20)
    .data(story.pertext) // color domain
    .text(function(d){ return d + '%'; })
    .style('fill', function(d, i){ return i == 3 ? 'white' : 'black';});
	d3.select('#brought').style('display', function(){ return window.location.search == '?embed=1' ? 'block' : 'none';});	
  // Filter the data
  d3.csv(story.data || datafile(), function(data) {
		if(story.data){ $('#data_cont').hide(); d3.select('#data').attr('href', story.data); } else { $('#data_cont').show();}
		var subset = initchart(story, data);
    draw_date(data[data.length-1], story);
		var treemap = d3.layout.treemap()
      .size([parseInt(svg.style('width'), 10), svg.attr('height')])
      .sticky(true)
			.children(function(d) { return d.values; })
      .padding(1.5)
      .value(story.size);			
    var nodes = d3.nest();
    story.group.forEach(function(group) {
      nodes = nodes.key(function(d) { return d[group]; });
    });
    treemap.nodes({
      'key': 'India',
      'values': nodes.entries(subset)
    });
    var node = svg.selectAll('rect')
      .data(treemap.nodes)
      .call(position)
			.attr('fill', story.color);
		node.select('title')
      .text(story.hover);
    node.enter().append('rect')
      .call(position)
      .attr('fill', story.color)
			.attr('stroke', '#fff')
      .append('title')
        .text(story.hover);
		node.on('mouseover', function(d){ 
			var details = d3.select(this).text(); 
			$('#copy_title').val(details).select();							
		});			
    node.exit().remove();
		svg.selectAll('text')
			.data(treemap.nodes)
			.enter().append('text')
      .call(positionText)
			.attr('dx', function(d){ return d.dx / 2; })
      .attr('dy', function(d){ return d.dy / 2; })
			.text(function(d){ return d.dx > 80 && d.key != 'India' ? d.key : '' ; })
			.style('font-size', function(d){ return d.dx / 11 + 'px'; });
		// Set up the legend
    var legend = d3.select('.legend.treemap');
    legend.selectAll('*').remove();
    var select = legend.append('select').attr('class', 'states');
    var subselect = legend.append('select').attr('class', 'districts');
    var groups = _.uniq(_.pluck(subset, story.group[0]));
		groups.unshift('select State');
		select.selectAll('option')
        .data(groups)
      .enter()
        .append('option')
        .text(String);
    select.on('change', function() {
			d3.select('#visual').classed('drilldown', false);
      var group = d3.select(this).property('value');
			var details = svg.select('rect[data-q="' + group + '"]').text();
			$('#copy_title').val(details);
			$('#copy_title').on('mouseover', function(){ $(this).select(); });	
			svg.selectAll('rect').classed('mark', false);
      svg.selectAll('rect[data-q="' + group + '"]').classed('mark', true);
      var result = _.filter(subset, function(d){ return d.State_Name == group && !d.District_Name.match(/^Total/); });
      result.unshift({"District_Name":"select District"});
      subselect.selectAll('option').remove();
      subselect.selectAll('option')
          .data(result)
        .enter()
          .append('option')
          .text(function(d){ return d.District_Name; });
    });
    subselect.on('change', function() {
			d3.select('#visual').classed('drilldown', true);
			var group = d3.select('.states').property('value');
			var subgroup = d3.select(this).property('value');
			var details = svg.select('rect[data-r="' + group + '"][data-q="' + subgroup + '"]').text();
			$('#copy_title').val(details);
			$('#copy_title').on('mouseover', function(){ $(this).select(); });	
      svg.selectAll('rect').classed('mark', false);
			svg.selectAll('rect[data-r="' + group + '"][data-q="' + subgroup + '"]').classed('mark', true);				
    });
  });	
}
function draw_cartogram(story) {
	d3.selectAll('.tooltip').remove();
	// Add gradient legend for cartogram
  d3.select('#gradient_cont').style('display', 'block');
	d3.select('#exp_text').text(' ');
	d3.selectAll('#gradient text').remove();
	d3.selectAll('.legend').style('display', 'none');	
	d3.selectAll('.feature').remove();
	d3.selectAll('.state_bubbles').remove();
  d3.select('#legend_cont').style('padding-left', '470px');		
	// Creates gradient legend for cartogram
	var gradient = d3.select('#gradient');
  gradient.append('rect').attr('x', 0).attr('y', 0)
    .attr('width', 958).attr('height', 30)
    .attr('fill', 'url(#'+ story.grad +')');
  gradient.selectAll('text')
    .data(story.percent) 
   .enter().append('text')
    .attr('x', function(d){ return d + '%';})
    .attr('y', 20)
    .data(story.pertext) 
    .text(function(d){ return d + '%'; })
    .style('fill', function(d, i){ return i == 3 ? 'white' : 'black';});	
	var svg = d3.select('#chart');
			svg.selectAll('*').remove();
			svg.style('border', function(){ return window.location.search == '?embed=1' ?  '1px solid #fff' : '1px solid #ddd';});
	var width = parseInt(svg.style('width'));
  var height = parseInt(svg.style('height'));
	var centered;
  var projection = d3.geo.mercator()
			.scale(width*5.5)
			.translate([-width+250, height+100]);
	var path = d3.geo.path()
			.projection(projection);					
	var maps = svg.append('g');
	var g = maps.append('g');
  var dt = maps.append('g'); 	
	d3.select('#brought').style('display', function(){ return window.location.search == '?embed=1' ? 'block' : 'none';});	
	d3.json('topojson/ind_states.json', function(json) {
			g.selectAll('.feature')
					.data(topojson.object(json, json.objects.india_states).geometries)
				.enter().append('path')
					.attr('class', 'feature')
					.attr('d', function(d){ return path(d);})
					.on('click', clicked);					
			d3.csv(story.data || datafile(), function(data){ 
					if(story.data){ $('#data_cont').hide(); d3.select('#data').attr('href', story.data); } else { $('#data_cont').show();}
					var subset = _.filter(data, story.filter);
					    draw_date(data[data.length-1], story);
					var dataset = d3.nest()
						.key(function(d){ return d[story.group]; })
						.rollup(function(rows){ 
							return { 'rads': d3.sum(rows, function(d){ return d[story.area[1]] ;}),
											 'num': d3.sum(rows, function(d){ return (parseInt(d[story.num[1]]) + parseInt(d[story.cen2001[1]]));}),   
											 'den': d3.sum(rows, function(d){ return d[story.den[1]] ;})
										 }								      
						})
						.entries(subset); 
					var rState = d3.scale.linear().domain(d3.extent(dataset.map(function(d) { return d.values['rads'];}))).range([5, 30]);					
					g.selectAll('.state_bubbles')
						.data(topojson.object(json, json.objects.india_states).geometries)
					.enter().append('circle')	
						.attr('class', 'state_bubbles')
						.attr('cx', function(d){ return path.centroid(d)[0]; })
						.attr('cy', function(d){ return path.centroid(d)[1]; })
						.data(dataset)
						.attr('r', function(d){ return rState(d.values['rads']); })
						.style('fill', function(d){ return color(d.values['num']/d.values['den']) ;}) 
						.attr('data-q', function(d){ return d.key; })
						.on('mouseover', function(){
							var details = d3.select(this).text(); 
							$('#copy_title').val(details).select();	
						})
						.append('title')
						.text(function(d){ return d.key +': '+ story.area[0]+ ' = '+ N(d.values['rads']) + '. '
										+ story.num[0] + ' + ' + story.cen2001[0] +' / '+ story.den[0]+' = ' + N(d.values['num']) +' / '+ N(d.values['den']) +' = '
										+ P(d.values['num']/d.values['den']);
						});
			});	
	});	
	function clicked(d) {
		var x, y, k;
		if (d && centered !== d) {
			var centroid = path.centroid(d); x = centroid[0]; y = centroid[1]; k = 4; centered = d;
		} else {
			x = width / 2.3; y = height / 1.9; k = 1; centered = null;
		}
		g.selectAll("path")
				.classed("active", centered && function(d) { return d === centered; });
		g.transition()
				.duration(750)
				.attr("transform", "translate(" + width / 2.3 + "," + height / 1.9  + ")scale(" + k + ")translate(" + -x + "," + -y + ")");				
	}
}
var tempGroup = '', tempSubgroup = ''; //, tempResult = [];
function draw_scatter(story) {
  var beyond = [];
	d3.selectAll('.tooltip').remove();
  // Add scatterplot info container
  d3.select('#right_container').style('display','block');
	d3.select('#hide_text').style('display', 'block');
	d3.select('.legend.scatter').style('display', 'block');
	d3.select('#brought').style('display', function(){ return window.location.search == '?embed=1' ? 'block' : 'none';});
	// Filter the data
  d3.csv(story.data || datafile(), function(data) {
		if(story.data){ $('#data_cont').hide(); d3.select('#data').attr('href', story.data); } else { $('#data_cont').show();}
    var subset = initchart(story, data);
		draw_date(data[data.length-1], story);
		// TODO: Make these move
    svg.selectAll('*').remove();
    var width = parseInt(svg.style('width'), 10);
    var height = svg.attr('height');		
		//set matrix
		svg.append('path')
      .attr("d",'M 40 461 L 922 40 L 40 40')           
			.style('fill', '#B8E62E').style('fill-opacity', 0.3).attr('stroke', '#000').attr('stroke-width',1);
		svg.append('path')
      .attr("d",'M 40 461 L 922 40 L 922 461')           
			.style('fill', '#D73027').style('fill-opacity', 0.5).attr('stroke', '#000').attr('stroke-width',1);	
    var rmax = _.max(_.map(subset, story.area[1]));
		// Set up the legend
    var legend = d3.select('.legend.scatter');
    legend.selectAll('*').remove();
    var select = legend.append('select').attr('class', 'states');
    var subselect = legend.append('select').attr('class', 'districts');
    var groups = _.uniq(_.pluck(subset, story.group[0]));
    groups.unshift('select State');
		select.selectAll('option')
        .data(groups)
      .enter()
        .append('option')
        .text(String);
		select.on('change', function() {
			var group = d3.select(this).property('value');			
		  d3.selectAll('.tooltip').remove();
			d3.selectAll('.tags').style('display', 'none');      
			if (group) {
				tempGroup = group;	
				svg.selectAll('circle').classed('fade', true);
        svg.selectAll('circle[data-q="' + group + '"]')
          .classed('fade', false)
					.classed('hide', false)
					.classed('mark', false)
          .classed('show', true);
				svg.select('.state[data-q="' + group + '"]').classed('hide', true);	
			} else {
				draw_scatter(story);
        svg.selectAll('circle.fade').classed('fade', false);
        svg.selectAll('circle.mark').classed('mark', false);
			}
			var result = _.filter(subset, function(d){ return d.State_Name == group && !d.District_Name.match(/^Total/); });
			//tempResult = result;
			result.unshift({"District_Name":"select District"});
      subselect.selectAll('option').remove();
      subselect.selectAll('option')
          .data(result)
        .enter()
          .append('option')
          .text(function(d){ return d.District_Name; });
			var details = svg.selectAll('.state[data-q="' + group + '"]').text();
			$('#copy_title').val(details);
			$('#copy_title').on('mouseover', function(){ $(this).select(); });			
		});			
		// Accumulated values of states
		var states = d3.nest()
				.key(function(d){ return d[story.group[0]]; })
				.rollup(function(rows){ return {'cx'  : d3.mean(rows, function(d){ return story.cx(d);}),
							                          'cy'  : d3.mean(rows, function(d){ return story.cy(d);}),
																			  'rad' : d3.mean(rows, function(d){ return story.area[1](d);}),
																				'rads': d3.sum(rows, function(d){ return story.area[1](d);})};
				})
				.entries(subset); 
		states.sort(function(a, b){ return b.values.rads - a.values.rads;});			
		var R = story.R;
    var xscale = d3.scale.linear().domain(story.xdom).range([R, width - R]);
    var yscale = d3.scale.linear().domain(story.ydom).range([height - R, R])
		var rState = d3.scale.linear().domain(d3.extent(states.map(function(d) { return d.values['rads'];}))).range([4, 40]);
		var rDistrict = d3.scale.linear().domain(d3.extent(subset.map(function(d) { return story.area[1](d);}))).range([4, 40]);
		// District level bubbles
		var districts = svg.selectAll('.district')    
			.data(subset).enter();			
		districts.append('circle')
			.attr('class', 'district') 
			.attr('cx', function(d) { return xscale(story.cx(d)); })
			.attr('cy', function(d) { return yscale(story.cy(d)); })
			.attr('r', function(d) { return rDistrict(story.area[1](d)); })
			.attr('fill', story.color)
			.attr('stroke', '#000')
			.classed('hide', true)
			.attr('data-q', function(d) { return d[story.group[0]]; })
			.attr('data-r', function(d) { return d[story.group[1]]; })
			.on('mouseover', function() {
        d3.select(this).classed('show', true);
				d3.select(this).style('stroke', '#fff').style('stroke-opacity', 1);
        var details = d3.select(this).text(); 
				$('#copy_title').val(details).select();	
      })
      .on('mouseout', function() {
        d3.select(this).classed('show', false);	
				d3.select(this).style('stroke', '#000').style('stroke-opacity', 0.5);		
      })
      .on('click', function() {
        // Set the main selection to blank if anything is faded; else set to selected circle
        var val = svg.selectAll('.show')[0].length ? '' : d3.select(this).attr('data-q');
        select.property('value', val).on('change').call(select.node());
				svg.selectAll('.district')
						.classed('show', false)
						.classed('hide', true);
				svg.selectAll('.state')
						.classed('hide', false)
						.classed('show', true);
				svg.selectAll('.tags').style('display', 'block');		
			})
      .append('title')
      .text(story.hover);
		// State level bubbles		
		var states = svg.selectAll('.state')
			.data(states).enter();
		states.append('circle')
			.attr('class', 'state')
			.attr('cx', function(d) { return xscale(d.values['cx']); })  
      .attr('cy', function(d) { return yscale(d.values['cy']); })  
      .attr('r', function(d) { return rState(d.values['rads']); }) 
			.attr('fill', function(d){ return gen_color(d.key);}) 
      .attr('stroke', '#000')  
			.attr('stroke-opacity', .5)  
      .attr('data-q', function(d) { return d.key; })
			.on('mouseover', function(){ 
				d3.select(this).classed('show', true);
				d3.select(this).style('stroke', '#fff').style('stroke-opacity', 1);
				var details = d3.select(this).text(); 
				$('#copy_title').val(details).select();
			})
			.on('mouseout', function(){ 
				d3.select(this).classed('show', false);	
				d3.select(this).style('stroke', '#000').style('stroke-opacity', 0.5);		
			})
			.on('click', function(){
				var val = svg.selectAll('.fade')[0].length ? '' : d3.select(this).attr('data-q');
        select.property('value', val).on('change').call(select.node());
				var q = d3.select(this).attr('data-q');
        svg.selectAll('.district[data-q="' + q + '"]').classed('hide', false);
		
				svg.selectAll('.state').classed('hide', true);
				svg.selectAll('.tags').style('display', 'none');
			})
			.append('title')
			.text(function(d){ return d.key + ': ' + story.area[0] + ' = ' + N(d.values['rads']) +'. '+ story.x[0] + ' = ' + P(d.values['cx'])
				+'. '+ story.y[0] + ' = ' + P(d.values['cy']); });			
		states.append('text')
			.attr('class', 'tags')
			.attr('x', function(d) { return xscale(d.values['cx']); })  
      .attr('y', function(d) { return yscale(d.values['cy']) - rState(d.values['rad']); })  
			.text(function(d){ return d.key;})
			.classed('hide', true)
			.attr('font-size', 10);				
		d3.select('#hide_text').on('click', function(){ 
			if(!d3.select('.state').classed('hide')){ 
				var hide = d3.selectAll('.tags').classed('hide');
					d3.selectAll('.tags').classed('hide', !hide);
			}		
		});	
		if(tempSubgroup){
			svg.selectAll('circle[data-q="' + tempGroup + '"]')
          .classed('fade', false)
					.classed('hide', false)
					.classed('mark', false)
          .classed('show', true);					
			svg.select('.state[data-q="' + tempGroup + '"]').classed('hide', true);
			svg.selectAll('.state').classed('hide', true);
			svg.selectAll('circle[data-q="' + tempGroup + '"]')
				.on('click', function(){
						svg.selectAll('.district')
							.classed('show', false)
							.classed('hide', true);
						svg.selectAll('.state')
							.classed('hide', false)
							.classed('show', false);
					});
		}
		subselect.on('change', function() {
      var subgroup = d3.select(this).property('value');
			svg.selectAll('circle').classed('mark', false);
      var group = d3.selectAll('.states').property('value');
			var result = _.filter(subset, function(d){ return d.State_Name == group && !d.District_Name.match(/^Total/); });
			tempSubgroup = subgroup;
			svg.selectAll('circle[data-q="' + group + '"]')
        .data(result)
        .classed('mark', function(d){
          return d.District_Name == subgroup ? true : false; 
				})
				.classed('show', function(d){ 
						return d.District_Name == subgroup ? true : false;
			  });
			d3.selectAll('.tooltip').remove();
			var details = svg.select('.district[data-q="' + group + '"][data-r="' + subgroup + '"]').text();
			$('#copy_title').val(details);
			$('#copy_title').on('mouseover', function(){ $(this).select(); });	
      $('.mark').tooltip({ title:function(){ return $('.mark title').text(); }, trigger:'focus', container:'body' }).tooltip('show');						
		});	
		var xaxis = svg.append('g')
      .classed('axis', true)
      .attr('transform', 'translate(0,' + (height - R) + ')')
      .call(d3.svg.axis()
              .scale(xscale)
              .orient('bottom')
              .tickFormat(d3.format('.0%')))
      .append('text')
      .text(story.x[0])
      .attr('transform', 'translate(0, -5)')
      .attr('x', width - R)
      .attr('text-anchor', 'end');
    var yaxis = svg.append('g')
      .attr('class', 'axis')
      .attr('transform', 'translate(' + R + ',0)')
      .call(d3.svg.axis()
              .scale(yscale)
              .orient('left')
              .tickFormat(d3.format('.0%')))
      .append('text')
      .text(story.y[0])
      .attr('x', R)
      .attr('transform', 'translate(5,0) rotate(-90,' + R + ',' + R + ')')
      .attr('text-anchor', 'end')
      .attr('dominant-baseline', 'hanging');	  
		// Lines joining x-axis and y-axis
		svg.append('g').selectAll('.h')
			.data(d3.range(0.2, story.ydom[1] , 0.2))
			.enter().append('line')
			.attr('class', 'h')
			.attr('x1', R)
			.attr('y1', function(d){ return yscale(d);})
			.attr('x2', function(d){ return xscale(d);})
			.attr('y2', function(d){ return yscale(d);});		
		svg.append('g').selectAll('.v')
			.data(d3.range(0.2, story.xdom[1] , 0.2))
			.enter().append('line')
			.attr('class', 'v')
			.attr('x1', function(d){ return xscale(d);})
			.attr('y1', function(d){ return yscale(d);})
			.attr('x2', function(d){ return xscale(d);})
			.attr('y2', height - R);	
		// Filter subgroups having values greater than 150%  
		beyond = _.filter(subset, function(d){ return story.cy(d) > story.ydom[1] ? d : '' ;});  
		// Sorted the values in descending order
    beyond.sort(function(a, b){ return story.cy(b) - story.cy(a); });
    // Remove the content - details of the bubbles out of the bound
    d3.selectAll('#details table').remove();
    d3.select('#header').text('Districts : toilets built - above ' + story.ydom[1] * 100 + '%');
    // Display values that are above 150%, in table
    d3.select('#details')
        .append('table')
        .attr('class', 'table table-condensed')
        .selectAll('tr')
        .data(beyond)
	  .enter()
         .append('tr')
         .selectAll('td')
         .data(function(d){ return [d.District_Name, d.State_Name, d3.round(story.cy(d) * 100) + '%']; })
        .enter()
          .append('td')
          .text(function(d){ return d;});
	// Subtext for the info container	  
    d3.select('#info')
		.text('These districts have achieved over '+ story.ydom[1] * 100 + '% , and are outside the graph.');
  });
}
function draw_boxscatter(story) {
  d3.selectAll('.tooltip').remove();
  d3.selectAll('#right_container').remove();
	d3.select('.legend.boxscatter').style('display', 'block');
	d3.select('#brought').style('display', function(){ return window.location.search == '?embed=1' ? 'block' : 'none';});
	d3.csv(story.data || datafile(), function(data) {
		if(story.data){ $('#data_cont').hide(); d3.select('#data').attr('href', story.data); } else { $('#data_cont').show();}
    var subset = initchart(story, data);
		draw_date(data[data.length-1], story);
		svg.selectAll('*').remove();
		svg.append('text').attr('x', 50).attr('y', 25).text('Click to filter -->').style('fill', '#000').style('stroke', 'none');
		svg.append('circle').attr('cx', 170).attr('cy', 20).attr('r', 8).attr('id', 'cirTSC').style('fill', '#4F81BD').style('stroke', '#000').style('cursor', 'pointer');
		svg.append('text').attr('x', 185).attr('y', 25).text('TSC value').style('fill', '#000').style('stroke', 'none');
    svg.append('circle').attr('cx', 340).attr('cy', 20).attr('r', 8).attr('id', 'cirCEN').style('fill', '#F79646').style('stroke', '#000').style('cursor', 'pointer');
		svg.append('text').attr('x', 355).attr('y', 25).text('Census value').style('fill', '#000').style('stroke', 'none');
		svg.append('rect').attr('x', 520).attr('y', 10).attr('width', 15).attr('height', 18).attr('id', 'recTSC').style('fill', '#C0504D').style('stroke', '#000').style('cursor', 'pointer');
		svg.append('text').attr('x', 540).attr('y', 25).text('TSC value is high').style('fill', '#000').style('stroke', 'none');
		svg.append('rect').attr('x', 730).attr('y', 10).attr('width', 15).attr('height', 18).attr('id', 'recCEN').style('fill', '#9BBB59').style('stroke', '#000').style('cursor', 'pointer');
		svg.append('text').attr('x', 750).attr('y', 25).text('Census value is high').style('fill', '#000').style('stroke', 'none');
		var width = parseInt(svg.style('width'), 10);
    var height = svg.attr('height');		
		var rmax = _.max(_.map(subset, story.area[1]));
		// Set up the legend
    var legend = d3.select('.legend.boxscatter');
    legend.selectAll('*').remove();
    var select = legend.append('select').attr('class', 'states');
    var subselect = legend.append('select').attr('class', 'districts');
    var groups = _.uniq(_.pluck(subset, story.group[0]));
    groups.unshift('select State');
		select.selectAll('option')
        .data(groups)
      .enter()
        .append('option')
        .text(String);
    // Accumulated values of states
		var nested_data = d3.nest()
				.key(function(d){ return d[story.group[0]]; })
				.rollup(function(rows){ return {'x'  : d3.sum(rows, function(d){ return d[story.X];}),
							                          'yT' : d3.sum(rows, function(d){ return d[story.YT];}),
							                          'yC' : d3.sum(rows, function(d){ return d[story.YC];})};							                          
				})
				.entries(subset); 
				//nested_data.sort(function(a, b){ return b.values['yT'] - a.values['yT'];});
				nested_data.sort(function(a, b){ return b.values['x'] - a.values['x'];});
		var R = story.R,
		    extentX = d3.extent(nested_data, function(d){ return d.values['x'] ; }),
		    extentYT = d3.extent(nested_data, function(d){ return d.values['yT']; }),
		    extentYC = d3.extent(nested_data, function(d){ return d.values['yC']; }),
		    extentYminmax = d3.extent(d3.merge([extentYT,extentYC]));
		//Set scale for state level visual		
		var xscale = d3.scale.sqrt().domain([extentX[0] - 50 , extentX[1] + 10000]).range([R, width - R]),
		    yscale = d3.scale.sqrt().domain([extentYminmax[0] - 20000, extentYminmax[1]]).range([height - R, R]); 
		
		grids(extentYminmax[0] - 100, extentYminmax[1], 1000000, yscale, extentX[0] - 10000, extentX[1] + 10000, 10000, xscale);
		axes(xscale, yscale, 15);
		
		var state_boxS = svg.append('g').classed('states', true).selectAll('.rect')
					.data(nested_data).enter();	
					
		state_boxS.append('rect')	
					.attr('x', function(d){ return xscale(d.values['x']) - R / 8; })
					.attr('y', function(d){ return yscale(Math.max(d.values['yT'], d.values['yC'])) - R / 8; }) 
					.attr('width', R/4)
					.attr('height', function(d){ return Math.abs(yscale(Math.max(d.values['yT'],d.values['yC'])) - yscale(Math.min(d.values['yT'],d.values['yC']))) + R / 4; }) 
          .classed('statsBox', true) 
					.attr('class', function(d){ return d.values['yT'] - d.values['yC'] < 0 ? 'statsBoxT' : 'statsBoxC';})
					.attr('data-q', function(d) { return d.key; })
					.on('click', districtBox)
					.on('mouseover', function() {
							var details = d3.select(this).text(); 
							$('#copy_title').val(details).select();	
					})
					.style('fill', function(d){ return d.values['yT'] - d.values['yC'] < 0 ? '#9BBB59' : '#C0504D' ; })
					.append('title')
					.text(function(d){ return d.key +' : TSC Finance = '+ N(d.values['x'])+'. TSC data = ' + N(d.values['yT'])+'. Census data = ' + N(d.values['yC']) +'. Difference (TSC - Census) = ' + N(d.values['yT']) +' - '+ N(d.values['yC']) +' = '+ N(d.values['yT'] - d.values['yC']) + '.'; });
				
		state_boxS.append('circle')
					.attr('cx', function(d){ return xscale(d.values['x']); })
					.attr('cy', function(d){ return yscale(Math.max(d.values['yT'], d.values['yC'])); }) 
					.attr('r', R/9)
					.attr('class', function(d){ return d.values['yT'] - d.values['yC'] > 0 ? 'statsT' : 'statsC';})
					.attr('data-q', function(d) { return d.key; })
					.on('click', districtBox)
					.style('fill', function(d){ return d.values['yT'] - d.values['yC'] > 0 ? '#4F81BD' : '#F79646';})
					.style('stroke', '#000')
					.append('title')
					.text(function(d){ return d.values['yT'] - d.values['yC'] > 0 ? d.key +' : TSC = ' + N(d.values['yT']) : d.key +' : Census = ' + N(d.values['yC']);});
					
		 state_boxS.append('circle')
					.attr('cx', function(d){ return xscale(d.values['x']); })
					.attr('cy', function(d){ return yscale(Math.min(d.values['yT'],d.values['yC'])); }) 
					.attr('r', R/9)
					.attr('class', function(d){ return d.values['yT'] - d.values['yC'] < 0 ? 'statsT' : 'statsC';})
					.attr('data-q', function(d) { return d.key; })
					.on('click', districtBox)
					.style('fill', function(d){ return d.values['yT'] - d.values['yC'] < 0 ? '#4F81BD' : '#F79646';})
					.style('stroke', '#000')
					.append('title')
					.text(function(d){ return d.values['yT'] - d.values['yC'] < 0 ? d.key +' : TSC = ' + N(d.values['yT']) : d.key +' : Census = ' + N(d.values['yC']);});
		
		var lineST = d3.svg.line()
				  .x(function(d){ return xscale(d.values['x']);})
				  .y(function(d){ return yscale(d.values['yT']);});
					
		var lineSC = d3.svg.line()
					.interpolate('linear')
					.x(function(d){ return xscale(d.values['x']);})
					.y(function(d){ return yscale(d.values['yC']);});			
					
		state_boxS.append('path')
					.attr('d', function(){ return lineST(nested_data);})
					.classed('lineST', true)
					.style('stroke', '#4F81BD');
		
		state_boxS.append('path')
					.attr('d', function(){ return lineSC(nested_data);})
					.classed('lineSC', true)
					.style('stroke', '#F79646');
	
		select.on('change', districtBox);
		function districtBox(d){
				svg.selectAll('.distsgrp').remove();
				d3.selectAll('.tooltip').remove();
				svg.selectAll('*').classed('fade', false);
				var selstate = d3.select(this).property('value');
				var q = selstate || d3.select(this).attr('data-q');
				$('select.states').val(q);
				svg.selectAll('.districts[data-q="' + q + '"]').classed('hide', false);
				svg.selectAll('.states').classed('hide', true);
				var result = _.filter(subset, function(d){ return d.State_Name == q && !d.District_Name.match(/^Total/); });
				groups = result;
				groups.unshift({"District_Name":"select District"});
			  subselect.selectAll('option').remove();
				subselect.selectAll('option')
						.data(groups)
					.enter()
						.append('option')
						.text(function(d){ return d.District_Name; });
			  result.shift();
				result.sort(function(a, b){ return b[story.X] - a[story.X];});
				var	extentXD = d3.extent(result, function(d){ return Math.floor(d[story.X]);}),
				extentYTD = d3.extent(result, function(d){ return Math.floor(d[story.YT]);}),
				extentYCD = d3.extent(result, function(d){ return Math.floor(d[story.YC]);}),
				extentYDminmax = d3.extent(d3.merge([extentYTD,extentYCD])),				
				xscaleD = d3.scale.sqrt().domain([extentXD[0]-(getlength(extentXD[0]) * 10), extentXD[1]+(getlength(extentXD[0]) * 10)]).range([R, width - R]),
				yscaleD = d3.scale.sqrt().domain([(extentYDminmax[0] - (Math.pow(10, getlength(extentYDminmax[0]) - 1))),extentYDminmax[1]+(getlength(extentYDminmax[1]) * 10)]).range([height - R, R]); 
				axes(xscaleD, yscaleD, 10);	
				
				var district_boxS	= svg.append('g').classed('distsgrp', true)
				.selectAll('.districts').data(result).enter();	
		
				district_boxS.append('rect')	
						.attr('x', function(d){ return xscaleD(d[story.X]) - R / 8; })
						.attr('y', function(d){ return yscaleD(Math.max(d[story.YT],d[story.YC])) - R / 8; })
						.attr('width', R/4)
						.attr('height', function(d){ return Math.abs(yscaleD(Math.max(d[story.YT],d[story.YC])) - yscaleD(Math.min(d[story.YT],d[story.YC]))) + R / 4;})
						.classed('districts distsBox', true)
						.attr('class', function(d){ return d[story.YT] - d[story.YC] < 0 ? 'districts distsBoxT' : 'districts distsBoxC' ; })
						.attr('data-q', function(d) { return d[story.group[0]]; })
						.attr('data-r', function(d) { return d[story.group[1]]; })
						.on('click', stateBox)
						.on('mouseover', function() {
								var details = d3.select(this).text(); 
								$('#copy_title').val(details).select();	
						})
						.style('fill', function(d){ return d[story.YT] - d[story.YC] < 0 ? '#9BBB59' : '#C0504D' ; })
						.append('title')
						.text(function(d){ return d.State_Name+' - '+d.District_Name +' : TSC Finance = '+ N(d[story.X])+'. TSC data = ' + N(d[story.YT])+'. Census data = ' + N(d[story.YC]) +'. Difference (TSC - Census) = ' + N(d[story.YT]) +' - '+ N(d[story.YC]) +' = '+ N(d[story.YT] - d[story.YC]) + '.'; });
			
				district_boxS.append('circle')	
						.attr('cx', function(d){ return xscaleD(d[story.X]); })
						.attr('cy', function(d){ return yscaleD(Math.max(d[story.YT], d[story.YC])); })
						.attr('r', R/9)
						.attr('class', function(d){ return d[story.YT] - d[story.YC] > 0 ? 'distsT' : 'distsC';})
						.attr('data-q', function(d) { return d[story.group[0]]; })
						.attr('data-r', function(d) { return d[story.group[1]]; })
						.on('click', stateBox)
						.style('fill', function(d){ return d[story.YT] - d[story.YC] > 0 ? '#4F81BD' : '#F79646';})
						.style('stroke', '#000')
						.append('title')
						.text(function(d){ return d[story.YT] - d[story.YC] > 0 ? d.District_Name +' : TSC = ' + N(d[story.YT]) : d.District_Name +' : Census = ' + N(d[story.YC]);});
			
				district_boxS.append('circle')	
						.attr('cx', function(d){ return xscaleD(d[story.X]); })
						.attr('cy', function(d){ return yscaleD(Math.min(d[story.YT], d[story.YC])); })
						.attr('r', R/9)
						.attr('class', function(d){ return d[story.YT] - d[story.YC] < 0 ? 'distsT' : 'distsC';})
						.attr('data-q', function(d) { return d[story.group[0]]; })
						.attr('data-r', function(d) { return d[story.group[1]]; })
						.on('click', stateBox)
						.style('fill', function(d){ return d[story.YT] - d[story.YC] < 0 ? '#4F81BD' : '#F79646';})
						.style('stroke', '#000')
						.append('title')
						.text(function(d){ return d[story.YT] - d[story.YC] < 0 ? d.District_Name +' : TSC = ' + N(d[story.YT]) : d.District_Name +' : Census = ' + N(d[story.YC]);});
		
				var lineDT = d3.svg.line()
							.x(function(d){ return xscaleD(d[story.X]);})
							.y(function(d){ return yscaleD(d[story.YT]);});
							
				var lineDC = d3.svg.line()
							.x(function(d){ return xscaleD(d[story.X]);})
							.y(function(d){ return yscaleD(d[story.YC]);});			
							
				district_boxS.append('path')
							.attr('d', function(d){ return lineDT(result);})
							.classed('lineDT', true)
							.style('stroke', '#4F81BD');
							
				district_boxS.append('path')
							.attr('d', function(d){ return lineDC(result);})
							.classed('lineDC', true)
							.style('stroke', '#F79646');
		}
		subselect.on('change', function(){
			var subgroup = d3.select(this).property('value');
			svg.selectAll('.districts').classed('mark', false);
      var group = select.property('value');
			d3.selectAll('.tooltip').remove();
			var details = svg.select('.districts[data-q="' + group + '"][data-r="' + subgroup + '"]').classed('mark', true).text();
			$('#copy_title').val(details);
			$('#copy_title').on('mouseover', function(){ $(this).select(); });	
      $('.mark').tooltip({ title:function(){ return $('.mark title').text(); }, trigger:'focus', container:'body' }).tooltip('show');						
		});
		svg.select('#cirTSC').on('click', function(){
			svg.selectAll('*').classed('fade', false);
			svg.selectAll('.statsBoxC, .statsBoxT, .distsBoxC, .distsBoxT, .statsC, .distsC, .lineSC, .lineDC').classed('fade', true);
		});
		svg.select('#cirCEN').on('click', function(){		
			svg.selectAll('*').classed('fade', false);
			svg.selectAll('.statsBoxC, .statsBoxT, .distsBoxC, .distsBoxT, .statsT, .distsT, .lineST, .lineDT').classed('fade', true);	
		});
		svg.select('#recTSC').on('click', function(){
			svg.selectAll('*').classed('fade', false);
			svg.selectAll('.statsBoxT, .distsBoxT, .statsT, .statsC, .distsC, .distsT, .lineST, .lineSC, .lineDT, .lineDC').classed('fade', true);		
			svg.selectAll('.statsBoxC, .distsBoxC').classed('show', true);
		});
		svg.select('#recCEN').on('click', function(){	
			svg.selectAll('*').classed('fade', false);	
			svg.selectAll('.statsBoxC, .distsBoxC, .statsT, .statsC, .distsC, .distsT, .lineST, .lineSC, .lineDT, .lineDC').classed('fade', true);		
			svg.selectAll('.statsBoxT, .distsBoxT').classed('show', true);
		});
		function getlength(n) {
				return n.toString().length;
		}
		function stateBox(d){
					d3.selectAll('.tooltip').remove();
					svg.selectAll('*').classed('fade', false);
					select.property('value', 'select State');
					subselect.selectAll('*').remove();
					d3.selectAll('.distsgrp, .lineDT, .lineDC').remove();
					axes(xscale, yscale, 15);
					svg.selectAll('.distgrp').classed('hide', true);
					svg.selectAll('.states').classed('hide', false);
		}
		function axes(x, y, t){
					svg.selectAll('.axis').remove();
					var xaxis = svg.append('g')
						.attr('class', 'axis')
						.attr('transform', 'translate(0,' + (height - R) + ')')
						.call(d3.svg.axis()
										.scale(x)
										.orient('bottom')
										.ticks(t)
										.tickFormat(d3.format('2s')))
						.append('text')
						.text(story.x[0])
						.attr('transform', 'translate(-5, -5)')
						.attr('x', width - R)
						.attr('text-anchor', 'end');
					var yaxis = svg.append('g')
						.attr('class', 'axis')
						.attr('transform', 'translate(' + R + ',0)')
						.call(d3.svg.axis()
										.scale(y)
										.orient('left')
										.ticks(t)
										.tickFormat(d3.format('2s')))
						.append('text')
						.text(story.yT[0])
						.attr('x', R)
						.attr('transform', 'translate(5,5) rotate(-90,' + R + ',' + R + ')')
						.attr('text-anchor', 'end')
						.attr('dominant-baseline', 'hanging');	  			
		}
		function grids(h0, h1, h2, y, v0, v1, v2, x){ 
		// Lines joining x-axis and y-axis
		  svg.selectAll('.h, .v').remove();
			svg.append('g').selectAll('.h')
				.data(d3.range(h0, h1, h2))   
				.enter().append('line')
				.attr('class', 'h')
				.attr('x1', R)
				.attr('y1', function(d){ return y(d);})
				.attr('x2', width - R) 
				.attr('y2', function(d){ return y(d);})
				.style('fill','none')
				.style('stroke', '#ddd')
				.style('shape-rendering','crispEdges');
			svg.append('g').selectAll('.v')
				.data(d3.range(v0, v1, v2))  
				.enter().append('line')
				.attr('class', 'v')
				.attr('x1', function(d){ return x(d);})
				.attr('y1', R)  
				.attr('x2', function(d){ return x(d);})
				.attr('y2', height - R)
				.style('fill','none')
				.style('stroke', '#ddd')
				.style('shape-rendering','crispEdges');
		}	
  });
}
function draw_stack(story) {
	d3.selectAll('.tooltip').remove();
	d3.select('#exp_text').text(' ');	
	d3.selectAll('.v1').remove();
	d3.selectAll('.y1').remove();
	d3.selectAll('text, line, .y2').remove();
	d3.select('.legend.stack').style('display', 'block');	
	d3.select('#brought').style('display', function(){ return window.location.search == '?embed=1' ? 'block' : 'none';});
  d3.csv(story.data || datafile(), function(data) {
		if(story.data){ $('#data_cont').hide(); d3.select('#data').attr('href', story.data); } else { $('#data_cont').show();}
    var subset = initchart(story, data);
    draw_date(data[data.length-1], story);
    var grouper = function(group) {
      return d3.nest()
        .rollup(function(leaves) {
          var result = {};
          if (leaves.length === 0) { return result; }
          d3.map(leaves[0]).forEach(function(metric, val) {
            result[metric] = d3.sum(leaves, function(d) { return +d[metric]; });
          });
          return result;
        })
        .key(function(d) { return d[group]; });
    };
    var nodes = grouper(story.group[0]);
		var leaves = grouper(story.group[1]);
    var ypad = 2;		
		// Set up the legend
    var legend = d3.select('.legend.stack');
    legend.selectAll('*').remove();
    var select = legend.append('select').attr('class', 'states');
    var subselect = legend.append('select').attr('class', 'districts');
    var groups = _.uniq(_.pluck(subset, story.group[0]));
    groups.unshift('select State');
		select.selectAll('option')
        .data(groups)
      .enter()
        .append('option')
        .text(String);
		select.on('change', function() {
			var subgroup = d3.select(this).property('value');
			svg.selectAll('.horiz0').classed('fade', true);
			svg.selectAll('.v0').classed('fade', true);
			svg.selectAll('.y2').remove();
			var group = d3.select(this).property('value');
			svg.attr('height', 150);
			if(d3.select(this).property('value') == 'select State'){ draw_stack(story); }
			var subdata = _.filter(subset, function(d) { return d[story.group[0]] == group; });
			var	datalength = subdata.length;
			var v1 = showstack('v1', leaves.entries(subdata), 550, 15, 200, datalength);
			v1.append('g').selectAll('.vert1')
				.data(d3.range(20, 100, 20))
       .enter().append('line')
				.attr('class','vert1')
				.attr('x1', x1)
				.attr('y1', 0)
				.attr('x2', x1)
				.attr('y2', svg.style('height'));	
			svg.append('g').selectAll('.y2')
				.data(d3.range(20, 100, 20))
			 .enter().append('text')
				.attr('class', 'y2')
				.attr('x', x1)
				.attr('y', 10)
				.text(function(d){ return d + '%';});
			if(story.lines == 'true'){	
					svg.append('g').selectAll('.horiz1')
						.data(subdata)
						.enter().append('line')
						.attr('class', 'horiz1')
						.attr('x1', 440)
						.attr('y1', function(d, i){ return (15 + i * (parseInt(story.ydom)) + i * ypad + (parseInt(story.ydom)) ); })
						.attr('x2', 830)
						.attr('y2', function(d, i){ return (15 + i * (parseInt(story.ydom)) + i * ypad + (parseInt(story.ydom)) ); });	
			}		
			svg.selectAll('.v0[data-q="' + group + '"]')
          .classed('fade', false)
					.attr('transform', function(d){ return 'translate(0, 15)'; });
			svg.selectAll('.horiz0').classed('fade', true);
			svg.selectAll('.v1 rect')
				.on('click', function(){ 
					svg.selectAll('.v1').classed('fade', true);		
					draw_stack(story);
			});
			var result = _.filter(subset, function(d){ return d.State_Name == group && !d.District_Name.match(/^Total/); });
      result.unshift({"District_Name":"select District"});
      subselect.selectAll('option').remove();
      subselect.selectAll('option')
          .data(result)
        .enter()
          .append('option')
          .text(function(d){ return d.District_Name; });
    });
    subselect.on('change', function() {
			var subgroup = d3.select(this).property('value'); 
			svg.selectAll('.horiz0, .horiz1').classed('fade', true);
			svg.selectAll('.v1').classed('fade', true);
			var group = d3.select(this).property('value');			
			svg.selectAll('.horiz1').classed('fade', true);		
			svg.selectAll('.v1[data-q="' + subgroup + '"]')
          .classed('fade', false)
					.attr('transform', function(d){ return 'translate(0, 15)'; });		
			svg.attr('height', 150);		
    });			
    function showstack(cls, data, x0, H, W, h) {
			svg.attr('height', parseInt(d3.max([(story.ydom * h + h * ypad + H), story.height])));
			svg.selectAll('g.' + cls).remove();
      var update = svg.selectAll('g.' + cls)
          .data(data);
      var enter = update.enter()
          .append('g')
          .classed(cls, true)
          .attr('data-q', function(d) { return d.key; })
					.attr('transform', function(d, i) { return 'translate(0, ' + (H + i * (parseInt(story.ydom) + ypad )) + ')'; });
			enter.append('text')
          .text(function(d) { return d.key; })
          .attr('x', x0 - 10)
          .attr('y', story.ydom/2)
          .attr('text-anchor', 'end')
          .attr('dominant-baseline', 'middle')
          .attr('font-size', H * 0.8);
      // For each state
      var rows = enter.selectAll('g.row')
          // Create an array of arrays of [row, row, row], where row = [cell, cell, cell]
          .data(function(d, i) { return story.stack.map(function(fn) { return fn(d.values); }); })
        .enter()
          // Each row is a g.row
          .append('g')
          .classed('row', true)
          // Vertically position each row
          .attr('transform', function(d, i) { return 'translate(0,' + i * H + ')'; })
          .attr('data-row', function(d, i) { return story.rows[i]; });
      // Within each row, draw the cells
      rows.selectAll('rect')
          .data(function(d) { return d; })
        .enter()
          .append('rect')
          .attr('x', function(d) { return x0 + W * d[0]; })
          .attr('width', function(d) { return W * d[1]; })
          .attr('height', (H - ypad))
          .attr('fill', function(d, i) { return story.colors[i]; })
          .on('mouseover', function(){
						var details = d3.select(this).text(); 
						$('#copy_title').val(details).select();
					})
          .append('title')
            .text(function(d, i) { 
              var s = this.parentNode.parentNode.parentNode;
							var g = this.parentNode.parentNode;
              return (d3.select(s).attr('data-r') || '') + d3.select(s).attr('data-q') + ': '+ d3.select(g).attr('data-row') + ', ' + story.hover(d, i);
            });
			if(story.lines == 'true'){
				svg.append('g').selectAll('.horiz0')
					.data(d3.range(30))
					.enter().append('line')
					.attr('class', 'horiz0')
					.attr('x1', 0)
					.attr('y1', function(d, i){ return (H + i * (parseInt(story.ydom)) + i * ypad + (parseInt(story.ydom)) ); })
					.attr('x2', 430)
					.attr('y2', function(d, i){ return (H + i * (parseInt(story.ydom)) + i * ypad + (parseInt(story.ydom)) ); });
			}	
      return update;
    }
		var x0 = d3.scale.linear().domain([0, 100]).range([150, 350]);
		var x1 = d3.scale.linear().domain([0, 100]).range([550, 750]);
    var v0 = showstack('v0', nodes.entries(subset), 150, 15, 200, 30);
		v0.append('g').selectAll('.vert0')
			.data(d3.range(20, 100, 20))
     .enter().append('line')
			.attr('class','vert0')
			.attr('x1', x0)
			.attr('y1', 0)
			.attr('x2', x0)
			.attr('y2', svg.style('height'));			
		svg.append('g').selectAll('.y1')
      .data(d3.range(20, 100, 20))
     .enter().append('text')
			.attr('class', 'y1')
			.attr('x', x0)
			.attr('y', 10)
			.text(function(d){ return d + '%';});
    v0.on('click', function() {
			d3.select('#chart').attr('height', story.height);
			d3.selectAll('.y2').remove();
			svg.selectAll('.mark').classed('mark', false);
			var filter = d3.select(this)
        .classed('mark', true)
        .attr('data-q');
			select.property('value', filter).on('change').call(select.node());				 
      var subdata = _.filter(subset, function(d) { return d[story.group[0]] == filter; });
			var	datalength = subdata.length;
      var v1 = showstack('v1', leaves.entries(subdata), 550, 15, 200, datalength);			
			v1.append('g').selectAll('.vert1')
				.data(d3.range(20, 100, 20))
       .enter().append('line')
				.attr('class','vert1')
				.attr('x1', x1)
				.attr('y1', 0)
				.attr('x2', x1)
				.attr('y2', svg.style('height'));					
			svg.append('g').selectAll('.y2')
				.data(d3.range(20, 100, 20))
			 .enter().append('text')
				.attr('class', 'y2')
				.attr('x', x1)
				.attr('y', 10)
				.text(function(d){ return d + '%';});			
			d3.selectAll('.horiz0').classed('fade', true);	
			d3.selectAll('g.v1').on('click', function(d){ return d3(this).style('display', 'none'); draw_stack(story) ;});	
    });
		function drawVertLines(){
				if(story.lines == 'true'){	
					svg.append('g').selectAll('.horiz1')
						.data(subdata)
						.enter().append('line')
						.attr('class', 'horiz1')
						.attr('x1', 440)
						.attr('y1', function(d, i){ return (15 + i * (parseInt(story.ydom)) + i * ypad + (parseInt(story.ydom)) ); })
						.attr('x2', 830)
						.attr('y2', function(d, i){ return (15 + i * (parseInt(story.ydom)) + i * ypad + (parseInt(story.ydom)) ); });	
				}	
			}		
  });
}
var tempresults = [];
function draw_dorling(story) {
	d3.selectAll('.tooltip').remove();
	d3.select('#data_cont div').style('padding-left','15px').style('margin-left','-10px');
	d3.select('#data_cont div strong').text('Change Date : ');
	d3.selectAll('#gradient_cont, .legend.dorling').style('display', 'block');
	//d3.selectAll('#demo, #about').style('display', 'none');		
	d3.select('#exp_text').text(' ');
	d3.selectAll('#gradient text, .state_bubbles, .feature').remove();
	d3.selectAll('rect').remove();
	// Creates gradient legend for cartogram	
	var gradient = d3.select('#gradient');
  gradient.append('rect').attr('x', 0).attr('y', 0)
    .attr('width', 958).attr('height', 30)
    .attr('fill', 'url(#'+ story.grad +')');
  gradient.selectAll('text')
    .data(story.percent) 
   .enter().append('text')
    .attr('x', function(d){ return d + '%';})
    .attr('y', 20)
    .data(story.pertext) 
    .text(function(d){ return d + '%'; })
    .style('fill', function(d, i){ return i == 3 ? 'white' : 'black';});
	var svg = d3.select('#chart');
			svg.selectAll('*').remove();
			svg.style('border', function(){ return window.location.search == '?embed=1' ?  '1px solid #fff' : '1px solid #ddd';});
	var width = parseInt(svg.style('width'));
  var height = parseInt(svg.style('height'));
	d3.select('#brought').style('display', function(){ return window.location.search == '?embed=1' ? 'block' : 'none';});
	d3.csv(story.data || datafile(), function(data) {
		if(story.data){ $('#data_cont').hide(); d3.select('#data').attr('href', story.data); } else { $('#data_cont').show();}
		var subset = initchart(story, data),		
	  legend = d3.select('.legend.dorling');
		legend.selectAll('*').remove();
		var select = legend.append('select').attr('class', 'param input-medium'); 
    var subselect = legend.append('select').attr('class', 'subparam'),
    distselect = legend.append('select').attr('class', 'districts'),
    group = (story.title).toUpperCase(),    
	  result = _.filter(subset, function(d){ return d.State_Name == group && !d.District_Name.match(/^Total/); });
		tempresults = result;
		select.selectAll('option')
				.data(d3.keys(options))
			.enter()
				.append('option')
				.text(String);
		var hashdec = decodeURIComponent(window.location.hash.replace(/^#/, '')).split('|');	
		subselect.selectAll('option').data(options[hashdec[2]] || options['Money spent']).enter().append('option').text(String);
		select.on('change', function(d){ 
				var param = d3.select(this).property('value');				
				var subparam = options[param];
				subparam.unshift('select parameters');
				subparam[1] == 'select parameters' ? subparam.shift() : '';
				subselect.selectAll('*').remove();
				subselect.selectAll('option')
						.data(subparam)
					.enter()
						.append('option')	
						.text(String);
		});
		$('select.param').val(hashdec[2]);
		$('select.subparam').val(hashdec[3]);
		distselect.selectAll('option')
				.data(tempresults)
			.enter()
				.append('option')
				.text(function(d){ return d.District_Name; });				
		distselect.on('change', function(d){
			d3.selectAll('.tooltip').remove();
			var dist = d3.select(this).property('value');
			svg.selectAll('circle')
        .data(tempresults)
        .classed('mark', function(d){
          return d.District_Name == dist ? true : false; 
				});
			var details = svg.select('.distsDor[data-q="' + dist + '"]').text();
			$('#copy_title').val(details);
			$('#copy_title').on('mouseover', function(){ $(this).select(); });		
			$('.mark').tooltip({ title:function(){ return $('.mark title').text(); }, trigger:'focus', container:'body' }).tooltip('show');						
		});
		d3.csv('GeocodeLatLong.csv', function(geo){
			georesult = _.filter(geo, function(d){ return d.State_Name == group && !d.District_Name.match(/^Total/); });
			var R = story.R,		
			xscale = d3.scale.linear().domain(d3.extent(georesult, function(d){ return parseFloat(d.Longitude);})).range([240, width - 240]),		
			yscale = d3.scale.linear().domain(d3.extent(georesult, function(d){ return parseFloat(d.Latitude);})).range([height - 80, 80]),
			r = d3.scale.linear().domain(d3.extent(result, function(d){ return parseFloat(d[story.size]);})).range([10, 25]);				
			svg.selectAll('text').remove();		
			var force = d3.layout.force()
				.gravity(0)
				.size([width, height]);
			var nodes = georesult.map(function(d){ return {
							x : xscale(d.Longitude), y : yscale(d.Latitude),
							x0 : xscale(d.Longitude), y0 : yscale(d.Latitude)
						}			
			});
			var node = svg.selectAll('.distsDor')
					.data(tempresults)
				.enter().append('circle')
				.attr('r', function(d){ return r(d[story.size]); })
					.on('mouseover', function(){ 
						d3.select(this).style('stroke', '#000');
						var details = d3.select(this).text(); 
						$('#copy_title').val(details).select();
					})
					.on('mouseout', function(){ 
						d3.select(this).style('stroke', '#999');		
					})
					.attr('class', 'distsDor')
					.attr('data-q', function(d) { return d.District_Name; })
					.attr('fill', story.color)  
					.style('stroke', '#999');	
			node.append('title')
					.text(story.hover);
			var text = svg.selectAll('.tags')
					.data(tempresults)
				.enter().append('text')
          .text(function(d){ return d.District_Name; })
					.attr('text-anchor', 'middle')
					.attr('dominant-baseline', 'middle')
					.style('font-size', '10px');
			force.nodes(nodes)
					.charge(-350)
					.on('tick', tick)
					.start();
			function tick(e) {
					node.data(nodes)
							.each(gravity(e.alpha * .5))
							.attr('cx', function(d) { return d.x; })
							.attr('cy', function(d) { return d.y; });	
					text.data(nodes)
							.each(gravity(e.alpha * .5))
							.attr('x', function(d){ return d.x; })
							.attr('y', function(d){ return d.y; });
				}		
			  function gravity(k) {
					return function(d) {
						d.x += (d.x0 - d.x) * k;
						d.y += (d.y0 - d.y) * k;
					};
				}		
			subselect.on('change', function(d){
					story.param1 = select.property('value');
					story.param2 = subselect.property('value');
					window.location.hash = encodeURIComponent(story.menu + '|' + story.title + '|' + story.param1 + '|' + story.param2);
				});								
		});		
	});
}

function draw_dorlingCart(story) {
	d3.selectAll('.tooltip').remove();
	d3.select('#data_cont div').style('padding-left','15px').style('margin-left','-10px');
	d3.select('#data_cont div strong').text('Change Date : ');
	d3.selectAll('#gradient_cont, .legend.dorlingCart').style('display', 'block');
	d3.selectAll('#demo, #about').style('display', 'none');		
	d3.select('#exp_text').text(' ');
	d3.selectAll('#gradient text, .state_bubbles, .feature').remove();
	d3.selectAll('rect').remove();
	// Creates gradient legend for cartogram	
	var gradient = d3.select('#gradient');
  gradient.append('rect').attr('x', 0).attr('y', 0)
    .attr('width', 958).attr('height', 30)
    .attr('fill', 'url(#'+ story.grad +')');
  gradient.selectAll('text')
    .data(story.percent) 
   .enter().append('text')
    .attr('x', function(d){ return d + '%';})
    .attr('y', 20)
    .data(story.pertext) 
    .text(function(d){ return d; })
    .style('fill', function(d, i){ return i == 3 ? 'white' : 'black';});
	var svg = d3.select('#chart');
			svg.selectAll('*').remove();
			svg.style('border', function(){ return window.location.search == '?embed=1' ?  '1px solid #fff' : '1px solid #ddd';});
	var width = parseInt(svg.style('width'));
  var height = parseInt(svg.style('height'));	
	var force = d3.layout.force()
			.gravity(0)
			.size([width, height]);
	d3.select('#brought').style('display', function(){ return window.location.search == '?embed=1' ? 'block' : 'none';});
	d3.csv(story.data || datafile(), function(data) {
		if(story.data){ $('#data_cont').hide(); d3.select('#data').attr('href', story.data); } else { $('#data_cont').show();}
		var subset = initchart(story, data),		
	  legend = d3.select('.legend.dorlingCart');
		legend.selectAll('*').remove();
		var select = legend.append('select').attr('class', 'states'),
    subselect = legend.append('select').attr('class', 'districts');
		var groups = _.uniq(_.pluck(subset, story.group[0]));
    groups.unshift('select State');
		result = _.filter(subset, function(d){ return d.State_Name == groups && !d.District_Name.match(/^Total/); });
		select.selectAll('option')
				.data(groups)
			.enter()
				.append('option')
				.text(String);
		select.on('change', function(d){ 
				var group = d3.select(this).property('value');			
				d3.selectAll('.tooltip').remove();
				var result = _.filter(subset, function(d){ return d.State_Name == group && !d.District_Name.match(/^Total/); });
				result.unshift({"District_Name":"select District"});
				subselect.selectAll('option').remove();
				subselect.selectAll('option')
						.data(result)
					.enter()
						.append('option')
						.text(function(d){ return d.District_Name; });
		});
		var nested_data = d3.nest()
				.key(function(d){ return d[story.group[0]]; })
				.rollup(function(rows){ return { 'cen2011'  : d3.sum(rows, function(d){ return d[story.size]; }),
																				 'IHHL2011' : d3.sum(rows, function(d){ return d[story.ihhl2011]; }),
																				 'IHHL2001' : d3.sum(rows, function(d){ return d[story.ihhl2001]; }),
																				 'cen2001'  : d3.sum(rows, function(d){ return d[story.trh2001]; })
																			 } 
				})
				.entries(subset);
		d3.csv('GeocodeLatLong.csv', function(geo){
			var R = story.R,
			longminmax = d3.extent(geo, function(d){ return parseFloat(d.Longitude);}),
			latminmax = d3.extent(geo, function(d){ return parseFloat(d.Latitude);});
			var xscale = d3.scale.linear().domain(longminmax).range([R * 6, width - R * 6]),
			yscale = d3.scale.linear().domain(latminmax).range([height - R*2, R*2]);
			var nested_geo = d3.nest()
				.key(function(d){ return d[story.group[0]]; })
				.rollup(function(rows){ return { 'long' :	d3.mean(rows, function(d){ return d.Longitude; }),
																				 'lat'  : d3.mean(rows, function(d){ return d.Latitude; })} 
				})
				.entries(geo);
			var nodes = nested_geo.map(function(d){ return {
																x: xscale(d.values['long']), y: yscale(d.values['lat']),
																x0: xscale(d.values['long']), y0: yscale(d.values['lat'])    
															};
			});
			force.nodes(nodes)
					.charge(-250)
					.on('tick', tick)
					.start();
			var node = svg.selectAll('circle')
					.data(nested_data)
				.enter().append('circle')
					.attr('data-q', function(d, i){ return d.key; }) 
					.attr('r', function(d){ return Math.pow(d.values['cen2011'], 1/5) ; }) 
					.on('click', distsDor)
					.classed('states', true)
					.style('fill', function(d){ return colorDor((1 - d.values['IHHL2011']/d.values['cen2011']) - (1 - d.values['IHHL2001']/d.values['cen2001']));}) 
					.style('stroke', '#000');
			node.append('title')
					.text(function(d){ return d.key+' : '+story.area[0]+ ' = '+N(d.values['cen2011']) +'. '
						 +story.IHHL2011[0]+' = '+N(d.values['IHHL2011'])+'. ' 
						 +story.TRH2001[0]+' = '+N(d.values['cen2001'])+'. '
						 +story.IHHL2001[0]+' = '+N(d.values['IHHL2001'])+'. '
						 +story.val1[0]+' = '+(1 - d.values['IHHL2011']/d.values['cen2011'])+'. '
						 +story.val2[0]+' = '+(1 - d.values['IHHL2001']/d.values['cen2001'])+'. Diff ( '
						 +story.val1[0]+' - '+story.val2[0]+' ) = '+((1 - d.values['IHHL2011']/d.values['cen2011']) - (1 - d.values['IHHL2001']/d.values['cen2001'])); 
					});
			function tick(e) {
				node.data(nodes)
						.each(gravity(e.alpha * .5))
						.attr('cx', function(d) { return d.x; })
						.attr('cy', function(d) { return d.y; });
			}		
			function gravity(k) {
				return function(d) {
					d.x += (d.x0 - d.x) * k;
					d.y += (d.y0 - d.y) * k;
				};
			}		
			select.on('change', distsDor);
			function distsDor(){ 
				svg.selectAll('.districts').classed('hide', true);
				var selstate = d3.select(this).property('value');
				var q = selstate || d3.select(this).attr('data-q');
				$('select.states').val(q);
				svg.selectAll('.states').classed('hide', true);
				var georesult = _.filter(geo, function(d){ return d.State_Name == q && !d.District_Name.match(/^Total/); });
				var subresult = _.filter(subset, function(d){ return d.State_Name == q && !d.District_Name.match(/^Total/); });
				groups = subresult;
				groups.unshift({"District_Name":"select District"});
			  subselect.selectAll('option').remove();
				subselect.selectAll('option')
						.data(groups)
					.enter()
						.append('option')
						.text(function(d){ return d.District_Name; });
			  subresult.shift();
				longminmax = d3.extent(georesult, function(d){ return parseFloat(d.Longitude);}),
				latminmax = d3.extent(georesult, function(d){ return parseFloat(d.Latitude);});
				var xscale = d3.scale.linear().domain(longminmax).range([R * 8, width - R * 8]),
				yscale = d3.scale.linear().domain(latminmax).range([height - R * 4, R * 4]);
				var nodes = georesult.map(function(d){ return {
							x: xscale(parseFloat(d.Longitude)), y: yscale(parseFloat(d.Latitude)),
							x0: xscale(parseFloat(d.Longitude)), y0: yscale(parseFloat(d.Latitude))
						}				
				});
				force.nodes(nodes)
					.charge(-350)
					.on('tick', tick)
					.start();
				var node = svg.append('g').selectAll('.districts')
						.data(subresult)
					.enter().append('circle')
						.attr('r', function(d){ return Math.pow(d[story.size], 1/4 );}) 
						.attr('data-q', function(d){ return d.State_Name})
						.attr('data-r', function(d){ return d.District_Name})	
						.classed('districts', true)
						.on('mouseover', function(){
								var details = d3.select(this).text(); 
								$('#copy_title').val(details).select();	
						})
						.on('click', function(){ 
								d3.selectAll('.tooltip').remove();
								$('select.states').val('select State');
								subselect.selectAll('option').remove();
								svg.selectAll('.districts').classed('hide', true);
								svg.selectAll('.states').classed('hide', false);
						})
						.style('fill', function(d){ return colorDor(d[story.X] - d[story.Y]).replace(/NaNNaNNaN/i, 'eee'); })
						.style('stroke', '#000');
				node.append('title')
					.text(function(d){ return d.State_Name +' - '+d.District_Name+': '
						+story.area[0]+' = '+N(d[story.size])+'. '
						+story.IHHL2011[0]+' = '+N(d[story.ihhl2011])+'. '
						+story.TRH2001[0]+' = '+N(d[story.trh2001])+'. '
						+story.IHHL2001[0]+' = '+N(d[story.ihhl2001])+'. '
						+story.val1[0]+' = '+d[story.X]+'. '
						+story.val2[0]+' = '+d[story.Y]+'. Diff ( '
						+story.val1[0]+' - '+story.val2[0]+' ) = '+(d[story.X] - d[story.Y]);		
					});					
				function tick(e) {
					node.data(nodes)
							.each(gravity(e.alpha * .5))
							.attr('cx', function(d) { return d.x; })
							.attr('cy', function(d) { return d.y; });	
				}		
			  function gravity(k) {
					return function(d) {
						d.x += (d.x0 - d.x) * k;
						d.y += (d.y0 - d.y) * k;
					};
				}				
			}
			subselect.on('change', function(d){
				d3.selectAll('.tooltip').remove();
				svg.selectAll('.districts').classed('mark', false);
				var group = select.property('value');
				var subgroup = d3.select(this).property('value');
				var details = svg.selectAll('.districts[data-q="' + group + '"][data-r="' + subgroup + '"]').classed('mark', true).text();
				$('#copy_title').val(details);
				$('#copy_title').on('mouseover', function(){ $(this).select(); });	
				$('.mark').tooltip({ title:function(){ return $('.mark title').text(); }, trigger:'focus', container:'body' }).tooltip('show');						
			});
		});	
	});
}	
function initchart(story, data) { 
  // No transitions work for other chart types, so just empty it
  var svgtype = svg.attr('data-type');
	if (svgtype !== story.type) {
    svg.selectAll('*').remove();
    if (svg.attr('data-type')) {
			svg.classed(svgtype, false);
      d3.selectAll('[data-story="' + svgtype + '"]').style('display', null);
    }
    d3.selectAll('[data-story="' + story.type + '"]').style('display', 'block');
    svg.classed(story.type, true)
      .attr('data-type', story.type);
  }
  return _.filter(data, story.filter);
}
//console.log(window.location.search);
d3.select('#emb_btn').on('click', function(){			
	var host_temp = window.location.href;
	var embed = host_temp.split('#').join('?embed=1#');
	$('#emb_text').val('<iframe src="'+embed+'" width="960" height="647" frameborder="0" marginwidth="0" marginheight="0" scrolling="no"'
	+' style="padding:0px 0px 0px 5px;border:1px solid #CCC;border-width:1px;" ></iframe>').select();	
});
d3.select('#copy_btn').on('click', function(){  
		$(this).zclip({
			path: "js/ZeroClipboard.swf",
			copy: function(){
				return $('#emb_text').val();
			},		
			afterCopy: function(){
				if($('#emb_text').val()){ 
					$('#status').val('Copied!').fadeIn(200).delay(1500).fadeOut(250);			
				}else{
					$('#status').val('Click Embed button!').fadeIn(200).delay(1500).fadeOut(250);			
				}
			}
		});		
});
if(window.location.search == '?embed=1'){
	d3.select('body').style('padding', '0px');
	d3.select('#title').style('font-size', '2em').style('margin-top','-15px');
	d3.selectAll('#visual, #btn').style('margin', '0px').style('padding', '0px');
	d3.select('#legend_cont').style('width', '960px');
	d3.selectAll('.legend').style('width', '475px').style('padding-left','5px');
	d3.selectAll('.legend.dorling').style('width', '645px').style('padding-left','5px');
	d3.select('#data_cont div').style('width', '455px');
	d3.select('svg').style('border', 'none');
	d3.select('#hide_btn').style('margin-left', '382px');
	d3.selectAll('.navbar-inner, #menu, #subtitle, #exp_text, #copy_cont,.btn-group, #right_container, #details, #info, #slideshare, #download_cont, #source_cont, #source, footer').remove();	
}
function position() {
  this.transition()
		.duration(400)
    .attr('x', function(d) { return d.x; })
    .attr('y', function(d) { return d.y; })
    .attr('width', function(d) { return d.dx; })
    .attr('height', function(d) { return d.dy; })
    .attr('class', function(d) { return "l" + d.depth; })
    .attr('data-q', function(d) { return d.depth == 1 ? d.key : d.District_Name; })
    .attr('data-r', function(d) { return d.depth == 2 ? d.State_Name : null; });    
}
function positionText() { 
  this.transition()
		.duration(-2000)
		.attr('x', function(d) { return d.x + '50'; })
    .attr('y', function(d) { return d.y; })
		.attr('text-anchor', 'middle')
		.attr('dominant-baseline', 'middle')
		.style('pointer-events', 'none');   
}  