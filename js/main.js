//var host = window.location.host;
//var iwp = 'www.indiawaterportal.org';
var host = window.location.href;
var iwp = 'http://arghyam.github.io/arghyam-scrapers/?#';
//var iwp = 'http://localhost/arghyam/arghyam-scrapers/?#';
console.log(host);
var slides = [];
d3.selectAll('.tooltip').remove();
if(host == iwp){
	var iwpStories = _.filter(stories, function(d){ return d.IWP == 'true'; });
	var menu = d3.nest().key(function(d) { return d.menu; }).entries(iwpStories);
}else{
	var menu = d3.nest().key(function(d) { return d.menu; }).entries(stories);
}
d3.selectAll('.navbar').on('click', function(){ return d3.selectAll('.tooltip').remove(); });
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
		.attr({ type : 'text', id : 'search', placeholder : 'search...'})
		.style('margin', '0 20px -20px 20px');		
search.append('i')
		.classed('icon-search', true);		
submenu.selectAll('li')
      .data(function(d) { return d.values; })
    .enter().append('li')
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
	d3.selectAll('#stateicons, #visual, #dataChange, #method').style('display', 'none');
	if(host == iwp){
		d3.select('#demo').style('display', 'block');
		d3.selectAll('#about, #stateicons').style('display', 'none');
	}else{
		d3.select('#about').style('display', 'block');
		d3.selectAll('#demo, #stateicons').style('display', 'none');
	}		
});
d3.select('#stateprofile').on('click', function() {
	d3.selectAll('.tooltip').remove();
	d3.selectAll('#about, #demo, #visual, #dataChange, #method').style('display', 'none');
	d3.select('#stateicons').style('display', 'block');			
});
d3.select('#dataChanges').on('click', function(){
	d3.event.preventDefault();	
	window.location.replace('#datachanges');
	d3.selectAll('.tooltip').remove();
	d3.selectAll('#stateicons, #about, #method, #demo, #visual').style('display', 'none');
	d3.select('#dataChange').style('display', 'block');
	datachanges();
});
d3.select('#methodology').on('click', function () {
	d3.event.preventDefault();
	window.location.replace('#methodology');
	d3.selectAll('.tooltip').remove();	
	d3.select('#method').style('display', 'block');		
	d3.selectAll('#about, #demo, #visual, #dataChange').style('display', 'none');				
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
			d3.selectAll('#stateicons, #about, #visual, #dataChange, #method').style('display', 'none');
		}else{
			d3.select('#about').style('display', 'block');
			d3.selectAll('#stateicons, #demo, #visual, #dataChange, #method').style('display', 'none');
		}
	}else if(hash == 'states'){
		d3.selectAll('#about, #demo, #visual, #dataChange, #method').style('display', 'none');
		d3.select('#stateicons').style('display', 'block');			
	}else if(hash == 'datachanges'){
		d3.select('#dataChange').style('display', 'block');
		d3.selectAll('#about, #demo, #visual, #method').style('display', 'none');		
		datachanges();		
	}else if (hash == 'methodology'){		
		d3.select('#method').style('display', 'block');
		d3.selectAll('#stateicons, #about, #demo, #visual, #dataChange').style('display', 'none');		
	}else{
		for (var i=0, l=stories.length; i<l; i++) {
			var story = stories[i];
			if((story.menu == hash[0]) && (story.title == hash[1])) {						
					if(story.menu == 'State'){
						story.param1 = hash[2];
						if(hash[2] == 'Performance' || hash[2] == 'Census'){
							story.param2 = ' ';
							story.url = tmp_story[hash[2]].url;
							story.cols = tmp_story[hash[2]].cols;							
						}else{						
							story.param2 = hash[3];
							story.url = tmp_story[hash[3]].url;
							story.cols = tmp_story[hash[3]].cols;
							story.area = tmp_story[hash[3]].area;
							story.size = tmp_story[hash[3]].area[1];
							story.num = tmp_story[hash[3]].num;
							story.den = tmp_story[hash[3]].den;	
						}		
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
  d3.select('#otstate').style('display', 'block');
  d3.selectAll('#gradient_cont, #legend_cont, #download_cont, #source_cont, #source').style('display', 'block');
	d3.selectAll('#stateicons, #about, #method, #demo, #brought, #dataChange, #slideshare, #forstate').style('display', 'none');
	d3.selectAll('.legend, #chart1, #chart2, #gradient_cont, #right_container, #hide_text').style('display', 'none');
	d3.selectAll('#source a, .treemap text, #columns text, #gradient text, .horiz0, .horiz1, .tooltip').remove();
	d3.select('#visual').style('display', 'block');
	d3.select('#chart').style('border', 'none');
	d3.select('#data_cont div').style('padding-left','90px').style('margin-left','0');
	d3.select('#data_cont div strong').text('From: 2001, Till (Change Date):');	
	d3.select('#legend_cont').style('padding-left', '1px');		
	// Set the title and story
  d3.select('#menu').text(story.menu);	
  d3.select('#title').text(story.title);
  d3.select('#subtitle').text(story.subtitle);
  d3.select('#story').text(story.story);
  d3.select('#columns').text(story.cols.join(", "));
  d3.select('#chart').attr('height', 500);
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
	$(window).bind('hashchange', function() {
		slides.length = 0;
		if(window.location.search != '?embed=1'){
			if(story.slideshare){
				d3.select('#slideshare').style('display', 'block');
				slides.push(story.slideshare);
				d3.select('#pptFrame').attr('src', slides[0]);
			}else{
				d3.select('#slideshare').style('display', 'none');
			}	
		}
 	});
	if(window.location.search != '?embed=1' && window.location.search != '#datachanges'){
		if(story.slideshare){		
			d3.select('#slideshare').style('display', 'block');
			slides.push(story.slideshare);
			if(slides.length == 1){					
				d3.select('#pptFrame').attr('src', slides[slides.length-1]);
			}
		}else{
			d3.select('#slideshare').style('display', 'none');	
		}	
	}
}
function draw_treemap(story) { 
	// Add gradient legend for treemap
  d3.selectAll('#gradient_cont, .legend.treemap').style('display', 'block');
	// Creates gradient legend for treemap
	var gradient = d3.select('#gradient');
  gradient.append('rect')
		.attr({ x: 0, y: 0, width: 958, height: 30, fill : 'url(#'+ story.grad +')' });				
  gradient.selectAll('text')
    .data(story.percent) // gradient percentage from svg defs
   .enter().append('text')
    .attr({ x: function(d){ return d + '%';}, y: 20 })
    .data(story.pertext) 
    .text(function(d){ return d + '%'; })
    .style('fill', function(d, i){ return i == 3 ? 'white' : 'black';});
	d3.select('#brought').style('display', function(){ return window.location.search == '?embed=1' ? 'block' : 'none';});	
  // Filter the data
  d3.csv(story.data || datafile(), function(data) {
		if(story.data){ $('#data_cont').hide(); d3.select('#data').attr('href', story.data); } else { $('#data_cont').show();}
		var subset = initchart(story, data);
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
			.attr({ dx: function(d){ return d.dx / 2; }, dy: function(d){ return d.dy / 2; } })
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
	// Add gradient legend for cartogram
  d3.select('#gradient_cont').style('display', 'block');
	d3.select('#legend_cont').style('padding-left', '470px');		
	// Creates gradient legend for cartogram
	var gradient = d3.select('#gradient');
  gradient.append('rect')
		.attr({ x: 0, y: 0, width: 958, height: 30, fill: 'url(#'+ story.grad +')' });
  gradient.selectAll('text')
    .data(story.percent) 
   .enter().append('text')
		.attr({ x: function(d){ return d + '%';}, y: 20 })
    .data(story.pertext) 
    .text(function(d){ return d + '%'; })
    .style('fill', function(d, i){ return i == 3 ? 'white' : 'black';});	
	var svg = d3.select('#chart');			
			svg.style('border', function(){ return window.location.search == '?embed=1' ?  '1px solid #fff' : '1px solid #ddd';});
	var width = parseInt(svg.style('width'));
  var height = parseInt(svg.style('height'));
	d3.select('#brought').style('display', function(){ return window.location.search == '?embed=1' ? 'block' : 'none';});	
	d3.csv(story.data || datafile(), function(data){ 
		if(story.data){ $('#data_cont').hide(); d3.select('#data').attr('href', story.data); } else { $('#data_cont').show();}
		var subset = initchart(story, data);
		var centered;
		var projection = d3.geo.mercator()
			.scale(width*5.5)
			.translate([-width+250, height+100]);
		var path = d3.geo.path()
			.projection(projection);
		var	map = svg.append('g');
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
		d3.json('topojson/ind_states.json', function(json) {
				svg.selectAll('.feature, .state_bubbles').remove();
				map.selectAll('.feature')
						.data(topojson.object(json, json.objects.india_states).geometries)
					.enter().append('path')
						.attr({ class: 'feature', d: function(d){ return path(d);} })
						.on('click', clicked);					
				map.selectAll('.state_bubbles')
						.data(topojson.object(json, json.objects.india_states).geometries)
					.enter().append('circle')
						.attr({ class: 'state_bubbles', cx: function(d){ return path.centroid(d)[0]; }, cy: function(d){ return path.centroid(d)[1];} })
						.data(dataset)
						.attr({ r: function(d){ return rState(d.values['rads']);}, 'data-q': function(d){ return d.key;} })
						.style('fill', function(d){ return color(d.values['num']/d.values['den']) ;}) 
						.on('mouseover', function(){
								var details = d3.select(this).text(); 
								$('#copy_title').val(details).select();	
						})
						.append('title')
						.text(function(d){ return d.key +': '+ story.area[0]+ ' = '+ N(d.values['rads']) + '. ' + story.num[0] + ' + ' + story.cen2001[0]
								+' / '+ story.den[0]+' = ' + N(d.values['num']) +' / '+ N(d.values['den']) +' = ' + P(d.values['num']/d.values['den']);
						});					
		});
		function clicked(d) {
				var x, y, k;
				if (d && centered !== d) {
					var centroid = path.centroid(d); x = centroid[0]; y = centroid[1]; k = 4; centered = d;
				} else {
					x = width / 2.3; y = height / 1.9; k = 1; centered = null;
				}
				map.selectAll("path")
						.classed("active", centered && function(d) { return d === centered; });
				map.transition()
						.duration(750)
						.attr("transform", "translate(" + width / 2.3 + "," + height / 1.9  + ")scale(" + k + ")translate(" + -x + "," + -y + ")");				
		}	
	});
}
var tempgroupScat = [], tempsubgroupScat = [], stimes = 0;
function draw_scatter(story) {
	// Add scatterplot info container
	d3.selectAll('#right_container, .legend.scatter, #hide_text').style('display','block');
	d3.select('#brought').style('display', function(){ return window.location.search == '?embed=1' ? 'block' : 'none';});
	d3.csv(story.data || datafile(), function(data) {
		if(story.data){ $('#data_cont').hide(); d3.select('#data').attr('href', story.data); } else { $('#data_cont').show();}
	  var subset = initchart(story, data),
		width = svg.attr('width'),
		height = svg.attr('height'),
		R = story.R,
		beyond = [],  
		legend = d3.select('.legend.scatter');
		svg.selectAll('line, text').remove();    
		legend.selectAll('*').remove();
    var select = legend.append('select').attr('class', 'states'),
		subselect = legend.append('select').attr('class', 'districts'),
		groups = _.uniq(_.pluck(subset, story.group[0]));
		groups.unshift('select State');
		select.selectAll('option')
        .data(groups)
      .enter()
        .append('option')
        .text(String);
		select.on('change', function(){
			var group = d3.select(this).property('value');			
			d3.selectAll('.tooltip').remove();
			svg.selectAll('.statesScat').classed('mark', false);
      state = svg.selectAll('.statesScat[data-q="'+group+'"]');
      state.classed('mark', true);
      var details = state.text();    
      $('#copy_title').val(details);
			$('#copy_title').on('mouseover', function(){ $(this).select(); });	
			$('.mark').tooltip({ title:function(){ return $('.mark title').text(); }, trigger:'focus', container:'body' }).tooltip('show');						
	  });			
		// Accumulated values of states
		var states = d3.nest()
				.key(function(d){ return d[story.group[0]]; })
				.rollup(function(rows){ return {'cx'  : d3.mean(rows, function(d){ return story.cx(d);}),
					'cy'  : d3.mean(rows, function(d){ return story.cy(d);}),
					'rad' : d3.mean(rows, function(d){ return story.size(d);}),
					'rads': d3.sum(rows, function(d){ return story.size(d);})};
				})
				.entries(subset); 
		states.sort(function(a, b){ return b.values.rads - a.values.rads;});			
		var xscale = d3.scale.linear().domain(story.xdom).range([R, width - R]),
		yscale = d3.scale.linear().domain(story.ydom).range([height - R, R]),
		rState = d3.scale.linear().domain(d3.extent(states.map(function(d) { return d.values['rads'];}))).range([5, 40]),
		rDistrict = d3.scale.linear().domain(d3.extent(subset.map(function(d) { return story.size(d);}))).range([5, 40]);
		if(stimes == 0){	
				svg.append('path')
					.attr("d",'M 40 461 L 922 40 L 40 40')           
					.style({ 'fill': '#B8E62E', 'fill-opacity': 0.3, 'stroke': '#000' });
				svg.append('path')
					.attr("d",'M 40 461 L 922 40 L 922 461')           
					.style({ 'fill': '#D73027', 'fill-opacity': 0.5, 'stroke': '#000' });
				// State level bubbles			
				var states = svg.selectAll('.state')
					.data(states).enter();
				var stateCircles = states.append('circle')
					.attr({ class: 'statesScat', cx: function(d){ return xscale(d.values['cx']); }, cy: function(d) { return yscale(d.values['cy']); }, 
									r: function(d) { return rState(d.values['rads']); }, fill: function(d){ return gen_color(d.key);}, 
									stroke: '#000', 'stroke-opacity': .5, 'data-q': function(d) { return d.key; }
					})
				  .on('mouseover', function(){ 
							var bcx = d3.select(this).attr('cx'),
							bcy = d3.select(this).attr('cy'),
							br = d3.select(this).attr('r'),
							bfill = d3.select(this).attr('fill');
							svg.append('circle').attr({ class:'border', cx: bcx, cy: bcy, r: parseInt(br) + 6, fill:'none', 'stroke': bfill, 'stroke-width': '2px' });
							var details = d3.select(this).text(); 
							$('#copy_title').val(details).select();
					})
					.on('mouseout', function(){ 
							svg.selectAll('.border').remove();
					})
					.on('click', distCircs)
					.append('title')
					.text(function(d){ return d.key + ': ' + story.area[0] + ' = ' + N(d.values['rads']) +'. '+ story.x[0] + ' = ' 
							+	P(d.values['cx']) +'. ' + story.y[0] + ' = ' + P(d.values['cy']); 
					});
				states.append('text')
					.attr({ class: 'tags hide', x: function(d) { return xscale(d.values['cx']); }, 
							y: function(d) { return yscale(d.values['cy']) - rState(d.values['rads']); } 
					})
					.text(function(d){ return d.key;});					
				stimes++;	
		}	else {	
				svg.selectAll('.border').remove();
				if(tempgroupScat.length > 0 ){
					if(tempgroupScat[tempgroupScat.length -1] == '')
					{
						tempgroupScat.pop();						
						var group = tempgroupScat[tempgroupScat.length - 1];							
					}else{ 
						var group = tempgroupScat[tempgroupScat.length - 1];
					}
					svg.selectAll('.districtsScat title').remove();
					var result = _.filter(subset, function(d){ return d.State_Name == group && !d.District_Name.match(/^Total/); });
					result.unshift({"District_Name":"select District"});
					var fade = svg.select('.statesScat').classed('fade');		
					if(fade){ 
							select.property('value', group);
							subselect.selectAll('option').remove();
							subselect.selectAll('option')
									.data(result)
								.enter()
									.append('option')
									.text(function(d){ return d.District_Name; });
							if(tempsubgroupScat.length > 0){
								var subgroup = tempsubgroupScat[tempsubgroupScat.length - 1 ];
								subselect.property('value', subgroup);
							}else{
								subselect.property('value', 'select District');
							}
					}else{		
							select.property('value', 'select State');
							subselect.selectAll('option').remove();
					}		
					result.shift();
					result.sort(function(a, b){ return story.size(b) - story.size(a);});
					svg.selectAll('.districtsScat[data-q="'+ group +'"]') 
						.data(result)
						.transition()
						.attr({ cx: function(d) { return xscale(story.cx(d)); }, cy: function(d) { return yscale(story.cy(d)); }, 
										r: function(d){ return rDistrict(story.size(d)); }
						});
					svg.selectAll('.districtsScat[data-q="'+ group +'"]') 
						.data(result)	
						.on('click', statCircs)
						.append('title')
						.text(story.hover);
				}
				svg.selectAll('.statesScat title').remove();
				svg.selectAll('.tags').remove();
				svg.selectAll('.statesScat')
						.data(states)
						.on('click', distCircs)
						.append('title')
						.text(function(d){ return d.key + ': ' + story.area[0] + ' = ' + N(d.values['rads']) +'. '+ story.x[0] + ' = ' 
								+	P(d.values['cx']) +'. ' + story.y[0] + ' = ' + P(d.values['cy']); 
						});	
				svg.selectAll('.statesScat')
						.data(states)
						.transition()
						.attr({ cx: function(d){ return xscale(d.values['cx']); }, cy: function(d) { return yscale(d.values['cy']); },
										r: function(d) { return rState(d.values['rads']); }
						});
				svg.selectAll('.tags')
					 .data(states)
					 .enter().append('text')	
 					 .attr({ class: 'tags hide', x: function(d) { return xscale(d.values['cx']); }, 
						    		y: function(d) { return yscale(d.values['cy']) - rState(d.values['rads']); } 
					 })
					.text(function(d){ return d.key;});
		}
		d3.select('#hide_text').on('click', function(){ 
			var fade = svg.select('.statesScat').classed('fade');		
			if(!fade){ 
				var hide = d3.selectAll('.tags').classed('hide');
			  d3.selectAll('.tags').classed('hide', !hide);
			}		
	  });
		subselect.on('change', function(){
				svg.selectAll('circle').classed('mark', false);
				var subgroup = d3.select(this).property('value'),
				group = select.property('value'),
			  result = _.filter(subset, function(d){ return d.State_Name == group && !d.District_Name.match(/^Total/); });
				result.sort(function(a, b){ return story.size(b) - story.size(a);});
				tempsubgroupScat.push(subgroup);
				svg.selectAll('.districtsScat') 
						.data(result)
						.classed('mark', function(d){
							return d.District_Name == subgroup ? true : false; 
						});						
				d3.selectAll('.tooltip, .border').remove();
				var bdistrict = svg.select('.districtsScat[data-q="' + group + '"][data-r="' + subgroup + '"]'),
				bcx = bdistrict.attr('cx'),
				bcy = bdistrict.attr('cy'),
				br = bdistrict.attr('r');
				svg.append('circle').attr({ class:'border', cx: bcx, cy: bcy, r: parseInt(br) + 6, fill:'none', 'stroke': '#444', 'stroke-width': '2px' });
				var details = svg.select('.districtsScat[data-q="' + group + '"][data-r="' + subgroup + '"]').text();
				$('#copy_title').val(details);
				$('#copy_title').on('mouseover', function(){ $(this).select(); });	
				$('.mark').tooltip({ title:function(){ return $('.mark title').text(); }, trigger:'focus', container:'body' }).tooltip('show');						
		});
		function distCircs(d) {
				d3.selectAll('.tooltip').remove();
				var group = d.key;
				result = _.filter(subset, function(d){ return d.State_Name == group && !d.District_Name.match(/^Total/); }),
				state = svg.selectAll('.statesScat[data-q="' + group + '"]'),
				cx = state.attr('cx'), cy = state.attr('cy'), fill = state.attr('fill');
				tempgroupScat.push(group);
				svg.selectAll('.tags').classed('hide', true);
				svg.selectAll('.border').remove();
				select.property('value', group);
				result.unshift({"District_Name":"select District"});
				subselect.selectAll('option').remove();
				subselect.selectAll('option')
						.data(result)
					.enter()
						.append('option')
						.text(function(d){ return d.District_Name; });	
				result.shift();
				result.sort(function(a, b){ return story.size(b) - story.size(a);});
				svg.selectAll('.statesScat').classed('fade', true);
				svg.selectAll('.districtsScat').remove();
				var districts = svg.selectAll('.districtsScat')
							.data(result)
						 .enter().append('circle')
							.attr({ cx: cx, cy: cy, fill: fill, r: 10, stroke: '#000', 'stroke-opacity': .5,
										  'data-q': function(d) { return d.State_Name; }, 'data-r': function(d) { return d.District_Name; }
							})
							.on('mouseover', function(){ 
									var bcx = d3.select(this).attr('cx'),
									bcy = d3.select(this).attr('cy'),
									br = d3.select(this).attr('r');
									svg.append('circle').attr({ class:'border', cx: bcx, cy: bcy, r: parseInt(br) + 6, fill:'none', 'stroke': '#444', 'stroke-width': '2px' });
									var details = d3.select(this).text(); 
									$('#copy_title').val(details).select();
							})
							.on('mouseout', function(){ 
									svg.selectAll('.border').remove();
							});
						districts.transition()
							.duration(1000)
							.attr({ class: 'districtsScat', cx: function(d) { return xscale(story.cx(d)); }, cy: function(d) { return yscale(story.cy(d)); }, 
											r: function(d){ return rDistrict(story.size(d)); }
							});
						districts.on('click', statCircs)
							.append('title')
							.text(story.hover);					
		}
		function statCircs(d){
				d3.selectAll('.tooltip').remove();
				svg.selectAll('.statesScat').classed('mark', false);	
				var group = d.State_Name,
				state = svg.selectAll('.statesScat[data-q="' + group + '"]'),
				cx = state.attr('cx'), cy = state.attr('cy'), r = state.attr('r');
				svg.selectAll('.statesScat').classed('fade', false);
				tempsubgroupScat = [];
				svg.selectAll('.border').remove();
				select.property('value', 'select State');
				subselect.selectAll('option').remove();
				svg.selectAll('.districtsScat')
						.transition()
						.duration(1000)
						.attr({ cx: cx, cy: cy, r: r })
						.each('end', function(){ svg.selectAll('.districtsScat').remove(); });
		}
		svg.selectAll('g').remove();
		var xAxis = d3.svg.axis().scale(xscale).orient('bottom').tickFormat(d3.format('.0%')),
		yAxis = d3.svg.axis().scale(yscale).orient('left').tickFormat(d3.format('.0%')),
		xaxis = svg.append('g')
			.classed('axis', true)
			.attr('transform', 'translate(0,' + (height - R) + ')')
			.call(xAxis)
			.append('text')
			.text(story.x[0])
			.attr({ transform: 'translate(0, -5)', x: width - R, 'text-anchor': 'end' }),
		yaxis = svg.append('g')
			.attr('class', 'axis')
			.attr('transform', 'translate(' + R + ',0)')
			.call(yAxis)
			.append('text')
			.text(story.y[0])
			.attr({ x: R, transform: 'translate(5,0) rotate(-90,' + R + ',' + R + ')', 'text-anchor': 'end', 'dominant-baseline': 'hanging'});
		// Lines joining x-axis and y-axis
		svg.append('g').selectAll('.h')
			.data(d3.range(0.2, story.ydom[1] , 0.2))
		 .enter().append('line')
			.attr({ class: 'h', x1: R, y1: function(d){ return yscale(d);}, 
							x2: function(d){ return xscale(d);}, y2: function(d){ return yscale(d);} 
			});
		svg.append('g').selectAll('.v')
			.data(d3.range(0.2, story.xdom[1] , 0.2))
		 .enter().append('line')
			.attr({ class: 'v', x1: function(d){ return xscale(d);}, y1: function(d){ return yscale(d);}, 
							x2: function(d){ return xscale(d);}, y2: height - R 
			});
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
  d3.select('.legend.boxscatter').style('display', 'block');
	d3.select('#brought').style('display', function(){ return window.location.search == '?embed=1' ? 'block' : 'none';});
	d3.csv(story.data || datafile(), function(data) {
		if(story.data){ $('#data_cont').hide(); d3.select('#data').attr('href', story.data); } else { $('#data_cont').show();}
    var subset = initchart(story, data);
		svg.selectAll('*').remove();
		svg.append('text').attr({ x: 25, y: 25, fill: '#000', stroke: 'none' }).text('Click to filter -->');
		svg.append('circle').attr({ id: 'cirTSC',cx: 155, cy: 20, r: 8, fill: '#4F81BD' });
		svg.append('text').attr({ x: 170, y: 25, fill: '#000', stroke: 'none' }).text('TSC value');
		svg.append('circle').attr({ id: 'cirCEN', cx: 290, cy: 20, r: 8, fill: '#F79646' });
		svg.append('text').attr({ x: 305, y: 25, fill: '#000', stroke: 'none' }).text('Census value');
		svg.append('rect').attr({ id: 'recTSC', x: 445, y: 10, width: 15, height: 18, fill: '#C0504D', 'shape-rendering': 'crispEdges' });
		svg.append('text').attr({ x: 465, y: 25, fill: '#000', stroke: 'none' }).text('TSC value is high');
		svg.append('rect').attr({ id: 'recCEN', x: 625, y: 10, width: 15, height: 18, fill: '#9BBB59', 'shape-rendering': 'crispEdges' });
		svg.append('text').attr({ x: 650, y: 25, fill: '#000', stroke: 'none' }).text('Census value is high');
		svg.append('rect').attr({ x: 830, y: 10, width: 75, height: 18, fill: '#eee', 'stroke': '#aaa','shape-rendering': 'crispEdges' });
		svg.append('text').attr({ id: 'clrFtr', x: 835, y: 25, 'cursor': 'pointer' }).text('Clear filter');
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
				nested_data.sort(function(a, b){ return b.values['x'] - a.values['x'];});
		var R = story.R,
		    extentX = d3.extent(nested_data, function(d){ return d.values['x'] ; }),
		    extentYT = d3.extent(nested_data, function(d){ return d.values['yT']; }),
		    extentYC = d3.extent(nested_data, function(d){ return d.values['yC']; }),
		    extentYminmax = d3.extent(d3.merge([extentYT,extentYC]));
		//Set scale for state level visual		
		var xscale = d3.scale.sqrt().clamp(true).domain([extentX[0] - 50 , extentX[1] + 10000]).range([R, width - R]),
		    yscale = d3.scale.sqrt().clamp(true).domain([extentYminmax[0] - 20000, extentYminmax[1]]).range([height - R, R]); 		
		grids(extentYminmax[0] - 100, extentYminmax[1], 1000000, yscale, extentX[0] - 10000, extentX[1] + 10000, 10000, xscale, 'statlines');
		axes(xscale, yscale, 15);
		var lineST = d3.svg.line()
					.x(function(d){ return xscale(d.values['x']);})
				  .y(function(d){ return yscale(d.values['yT']);});
		var lineSC = d3.svg.line()
					.interpolate('linear')
					.x(function(d){ return xscale(d.values['x']);})
					.y(function(d){ return yscale(d.values['yC']);});			
		var state_boxS = svg.append('g').classed('states', true).selectAll('.rect')
					.data(nested_data).enter();	
		state_boxS.append('rect')
					.attr({ x: function(d){ return xscale(d.values['x']) - R / 8; }, 
									y: function(d){ return yscale(Math.max(d.values['yT'], d.values['yC'])) - R / 8; }, width: R / 4, 
									height: function(d){ return Math.abs(yscale(Math.max(d.values['yT'],d.values['yC'])) 
													- yscale(Math.min(d.values['yT'],d.values['yC']))) + R / 4; }, 
									class: function(d){ return d.values['yT'] - d.values['yC'] < 0 ? 'statsBox statsBoxT' : 'statsBox statsBoxC';}, 
									'data-q': function(d) { return d.key; },  
									fill: function(d){ return d.values['yT'] - d.values['yC'] < 0 ? '#9BBB59' : '#C0504D' ; }
					})		
					.on('click', districtBox)
					.on('mouseover', function() {
							var details = d3.select(this).text(); 
							$('#copy_title').val(details).select();	
					})
					.append('title')
					.text(function(d){ return d.key +' : TSC Finance = '+ N(d.values['x'])+'. TSC data = ' + N(d.values['yT'])+'. Census data = ' 
								+ N(d.values['yC']) +'. Difference (TSC - Census) = ' + N(d.values['yT']) +' - '+ N(d.values['yC']) +' = '
								+ N(d.values['yT'] - d.values['yC']) + '.'; 
					});
		state_boxS.append('path').attr({ d: function(){ return lineST(nested_data);}, class: 'lineST fade', stroke: '#4F81BD' });
		state_boxS.append('path').attr({ d: function(){ return lineSC(nested_data);}, class: 'lineSC fade', stroke: '#F79646' });			
		state_boxS.append('circle')
					.attr({ cx: function(d){ return xscale(d.values['x']); }, 
									cy: function(d){ return yscale(Math.max(d.values['yT'], d.values['yC'])); }, r: R/9,
									class: function(d){ return d.values['yT'] - d.values['yC'] > 0 ? 'statsT' : 'statsC';}, 
									'data-q': function(d) { return d.key; },
									fill: function(d){ return d.values['yT'] - d.values['yC'] > 0 ? '#4F81BD' : '#F79646';}, stroke: '#000'
					})	
					.on('click', districtBox)
					.append('title')
					.text(function(d){ return d.values['yT'] - d.values['yC'] > 0 ? d.key +' : TSC = ' + N(d.values['yT']) : 
								d.key +' : Census = ' + N(d.values['yC']);
					});
		state_boxS.append('circle')
					.attr({ cx: function(d){ return xscale(d.values['x']); }, 'data-q': function(d) { return d.key; },
									cy: function(d){ return yscale(Math.min(d.values['yT'],d.values['yC'])); }, r: R/9,
									class: function(d){ return d.values['yT'] - d.values['yC'] < 0 ? 'statsT' : 'statsC';}, 
									fill: function(d){ return d.values['yT'] - d.values['yC'] < 0 ? '#4F81BD' : '#F79646';}, stroke: '#000'
					})
					.on('click', districtBox)
					.append('title')
					.text(function(d){ return d.values['yT'] - d.values['yC'] < 0 ? d.key +' : TSC = ' + N(d.values['yT']) : 
									d.key +' : Census = ' + N(d.values['yC']);
					});
		select.on('change', districtBox);
		function districtBox(d){
				svg.selectAll('.distsgrp').remove();
				svg.selectAll('.statlines').classed('fade', true);
				d3.selectAll('.tooltip').remove();
				var selstate = d3.select(this).property('value');
				if(selstate == 'select State'){
					draw_boxscatter(story);		
				} else {	
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
					xscaleD = d3.scale.sqrt()
								.clamp(true)	
								.domain([extentXD[0]-(getlength(extentXD[0]) * 10), extentXD[1]+(getlength(extentXD[0]) * 10)])
								.range([R, width - R]),
					yscaleD = d3.scale.sqrt()
								.clamp(true)
								.domain([(extentYDminmax[0] - (Math.pow(10, getlength(extentYDminmax[0]) - 1))),extentYDminmax[1]+(getlength(extentYDminmax[1]) * 10)])
								.range([height - R, R]);
					var lineDT = d3.svg.line()
								.x(function(d){ return xscaleD(d[story.X]);})
								.y(function(d){ return yscaleD(d[story.YT]);});
					var lineDC = d3.svg.line()
								.x(function(d){ return xscaleD(d[story.X]);})
								.y(function(d){ return yscaleD(d[story.YC]);});	
					grids(0, extentYDminmax[1]+(getlength(extentYDminmax[1]) * 10), getYInterval(extentYDminmax[1]),	yscaleD,
								0, extentXD[1]+(getlength(extentXD[0]) * 10), getXInterval(extentXD[1]), xscaleD, 'distlines'	);								
					axes(xscaleD, yscaleD, 10);	
					var district_boxS	= svg.append('g').classed('distsgrp', true)
							.selectAll('.districts').data(result).enter();	
					district_boxS.append('rect')
							.attr({ x: function(d){ return xscaleD(d[story.X]) - R / 8; }, 'data-r': function(d) { return d[story.group[1]]; },	 
											y: function(d){ return yscaleD(Math.max(d[story.YT],d[story.YC])) - R / 8; }, width: R/4, 
											height: function(d){ return Math.abs(yscaleD(Math.max(d[story.YT],d[story.YC])) 
															- yscaleD(Math.min(d[story.YT],d[story.YC]))) + R / 4;},
											class: function(d){ return d[story.YT] - d[story.YC] < 0 ? 'distsBox districts distsBoxT' : 'distsBox districts distsBoxC' ; },
											'data-q': function(d) { return d[story.group[0]]; }, 
											fill: function(d){ return d[story.YT] - d[story.YC] < 0 ? '#9BBB59' : '#C0504D' ; }
							})
							.on('click', stateBox)
							.on('mouseover', function() {
									var details = d3.select(this).text(); 
									$('#copy_title').val(details).select();	
							})
							.append('title')
							.text(function(d){ return d.State_Name+' - '+d.District_Name +' : TSC Finance = '+ N(d[story.X])+'. TSC data = ' 
										+ N(d[story.YT])+'. Census data = ' + N(d[story.YC]) +'. Difference (TSC - Census) = ' + N(d[story.YT]) +' - '
										+ N(d[story.YC]) +' = '+ N(d[story.YT] - d[story.YC]) + '.'; 
							});
					district_boxS.append('path').attr({ d: function(d){ return lineDT(result);}, class: 'lineDT fade', stroke: '#4F81BD' });
					district_boxS.append('path').attr({ d: function(d){ return lineDC(result);}, class: 'lineDC fade', stroke: '#F79646' });				
					district_boxS.append('circle')	
							.attr({ cx: function(d){ return xscaleD(d[story.X]); }, 
											cy: function(d){ return yscaleD(Math.max(d[story.YT], d[story.YC])); }, r: R/9,
											class: function(d){ return d[story.YT] - d[story.YC] > 0 ? 'distsT' : 'distsC';}, 
											fill:	function(d){ return d[story.YT] - d[story.YC] > 0 ? '#4F81BD' : '#F79646';},
											'data-q': function(d) { return d[story.group[0]]; }, 
											'data-r': function(d) { return d[story.group[1]]; }, stroke: '#000'							
							})
							.on('click', stateBox)
							.append('title')
							.text(function(d){ return d[story.YT] - d[story.YC] > 0 ? d.District_Name +' : TSC = ' + N(d[story.YT]) : 
										d.District_Name +' : Census = ' + N(d[story.YC]);
							});
				 district_boxS.append('circle')	
							.attr({ cx: function(d){ return xscaleD(d[story.X]); }, 
											cy: function(d){ return yscaleD(Math.min(d[story.YT], d[story.YC])); }, r: R/9,
											class: function(d){ return d[story.YT] - d[story.YC] < 0 ? 'distsT' : 'distsC';}, 
											fill: function(d){ return d[story.YT] - d[story.YC] < 0 ? '#4F81BD' : '#F79646';},
											'data-q': function(d) { return d[story.group[0]]; }, 
											'data-r': function(d) { return d[story.group[1]]; }, stroke: '#000'
							})
							.on('click', stateBox)
							.append('title')
							.text(function(d){ return d[story.YT] - d[story.YC] < 0 ? d.District_Name +' : TSC = ' + N(d[story.YT]) : 
									d.District_Name +' : Census = ' + N(d[story.YC]);
							});
				}
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
			svg.selectAll('rect, circle, path').classed('fade', false);
			svg.selectAll('.statsBoxC, .statsBoxT, .distsBoxC, .distsBoxT, .statsC, .distsC, .lineSC, .lineDC').classed('fade', true);
		});
		svg.select('#cirCEN').on('click', function(){		
			svg.selectAll('rect, circle, path').classed('fade', false);
			svg.selectAll('.statsBoxC, .statsBoxT, .distsBoxC, .distsBoxT, .statsT, .distsT, .lineST, .lineDT').classed('fade', true);	
		});
		svg.select('#recTSC').on('click', function(){
			svg.selectAll('rect, circle, path').classed('fade', false);
			svg.selectAll('.statsBoxT, .distsBoxT, .statsT, .statsC, .distsC, .distsT, .lineST, .lineSC, .lineDT, .lineDC').classed('fade', true);		
			svg.selectAll('.statsBoxC, .distsBoxC').classed('show', true);
		});
		svg.select('#recCEN').on('click', function(){	
			svg.selectAll('rect, circle, path').classed('fade', false);	
			svg.selectAll('.statsBoxC, .distsBoxC, .statsT, .statsC, .distsC, .distsT, .lineST, .lineSC, .lineDT, .lineDC').classed('fade', true);		
			svg.selectAll('.statsBoxT, .distsBoxT').classed('show', true);
		});
		svg.select('#clrFtr').on('click', function(){
			svg.selectAll('.lineST, .lineSC, .lineDT, .lineDC').classed('fade', true);	
			svg.selectAll('.statsBoxC, .statsBoxT, .distsBoxC, .distsBoxT, .statsC, .statsT, .distsC, .distsT').classed('fade', false);
		});
		function stateBox(d){
					svg.selectAll('.statlines').classed('fade', false);
					svg.selectAll('.distlines').remove();
					d3.selectAll('.tooltip').remove();
					svg.selectAll('.statelines').style('display', 'block');
					select.property('value', 'select State');
					subselect.selectAll('*').remove();
					svg.selectAll('.distsgrp, .lineDT, .lineDC').remove();
					axes(xscale, yscale, 15);
					svg.selectAll('.distgrp').classed('hide', true);
					svg.selectAll('.states').classed('hide', false);					
		}
		function axes(x, y, t){
					svg.selectAll('.axis').remove();
					var xaxis = svg.append('g')
						.attr({ class: 'axis', transform: 'translate(0,' + (height - R) + ')' })
						.call(d3.svg.axis()
										.scale(x)
										.orient('bottom')
										.ticks(t)
										.tickFormat(function(d) { return d / 100000 + 'L' ;}))
						.append('text')
						.text(story.x[0])
						.attr({ transform: 'translate(-5, -5)', x: width - R, 'text-anchor': 'end' });
					var yaxis = svg.append('g')
						.attr({ class: 'axis', transform: 'translate(' + R + ',0)' })
						.call(d3.svg.axis()
										.scale(y)
										.orient('left')
										.ticks(t)
										.tickFormat(function(d) { return d / 100000 + 'L' ;}))
						.append('text')
						.text(story.yT[0])
						.attr({ x: R, transform: 'translate(5,5) rotate(-90,' + R + ',' + R + ')', 'text-anchor': 'end', 'dominant-baseline': 'hanging' });
		}
		function grids(h0, h1, h2, y, v0, v1, v2, x, Class){ 
		// Lines joining x-axis and y-axis
			svg.selectAll('.distlines').remove();
		  svg.append('g').selectAll('.h')
					.data(d3.range(h0, h1, h2))   
				.enter().append('line')
					.attr({ class: 'h '+ Class, x1: R, y1: function(d){ return y(d);}, x2: width - R, y2: function(d){ return y(d);} })
					.style({ 'fill': 'none', 'stroke': '#ddd', 'shape-rendering': 'crispEdges'});
			svg.append('g').selectAll('.v')
					.data(d3.range(v0, v1, v2))  
				.enter().append('line')
					.attr({ class: 'v ' + Class, x1: function(d){ return x(d);}, y1: R, x2: function(d){ return x(d);}, y2: height - R })
					.style({ 'fill': 'none', 'stroke': '#ddd', 'shape-rendering': 'crispEdges'});
		}	
  });
}
function draw_stack(story) {
	//d3.selectAll('text, line').remove();
	d3.select('.legend.stack').style('display', 'block');	
	d3.select('#brought').style('display', function(){ return window.location.search == '?embed=1' ? 'block' : 'none';});
  d3.csv(story.data || datafile(), function(data) {
		if(story.data){ $('#data_cont').hide(); d3.select('#data').attr('href', story.data); } else { $('#data_cont').show();}
    var subset = initchart(story, data);
		svg.selectAll('*').remove();
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
			if(d3.select(this).property('value') == 'select State'){ draw_stack(story); }
			var subdata = _.filter(subset, function(d) { return d[story.group[0]] == group; });
			var	datalength = subdata.length;
			var v1 = showstack('v1', leaves.entries(subdata), 550, 15, 200, datalength);
			v1.append('g').selectAll('.vert1')
				.data(d3.range(20, 100, 20))
       .enter().append('line')
				.attr({ class: 'vert1', x1: x1, y1: 0, x2: x1, y2: svg.attr('height') });
			svg.append('g').selectAll('.y2')
				.data(d3.range(20, 100, 20))
			 .enter().append('text')
				.attr({ class: 'y2', x: x1, y: 10 })
				.text(function(d){ return d + '%';});
			if(story.lines == 'true'){	
					svg.selectAll('.horiz1').remove();
					svg.append('g').selectAll('.horiz1')
						.data(d3.range(datalength-1))
						.enter().append('line')
						.attr({ class: 'horiz1', 
										x1: 440, y1: function(d, i){ return (15 + i * (parseInt(story.ydom)) + i * ypad + (parseInt(story.ydom)) ); },
										x2: 830, y2: function(d, i){ return (15 + i * (parseInt(story.ydom)) + i * ypad + (parseInt(story.ydom)) ); }
						});	
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
			svg.attr('height', d3.max([ story.barHeight * datalength, 150 ]));
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
					.attr({ class: cls, 'data-q': function(d) { return d.key; }, 
							transform: function(d, i) { return 'translate(0, ' + (H + i * (parseInt(story.ydom) + ypad )) + ')'; }  
					});
			enter.append('text')
          .text(function(d) { return d.key; })
					.attr({ x: x0 - 10, y: story.ydom/2, 'font-size': H * 0.8, 'text-anchor': 'end', 'dominant-baseline': 'middle' });
			// For each state
      var rows = enter.selectAll('g.row')
          // Create an array of arrays of [row, row, row], where row = [cell, cell, cell]
          .data(function(d, i) { return story.stack.map(function(fn) { return fn(d.values); }); })
        .enter()
          // Each row is a g.row
          .append('g')
          .classed('row', true)
          // Vertically position each row
					.attr({ transform: function(d, i) { return 'translate(0,' + i * H + ')'; }, 'data-row': function(d, i) { return story.rows[i]; } });
      // Within each row, draw the cells
      rows.selectAll('rect')
          .data(function(d) { return d; })
        .enter()
          .append('rect')
					.attr({ x: function(d) { return x0 + W * d[0]; }, width: function(d) { return W * d[1]; }, 
									height: H - ypad, fill: function(d, i) { return story.colors[i]; } 
					})
					.on('mouseover', function(){
						var details = d3.select(this).text(); 
						$('#copy_title').val(details).select();
					})
          .append('title')
            .text(function(d, i) { 
              var s = this.parentNode.parentNode.parentNode;
							var g = this.parentNode.parentNode;
              return (d3.select(s).attr('data-r') || '') + d3.select(s).attr('data-q') + ': '
											+ d3.select(g).attr('data-row') + ', ' + story.hover(d, i);
            });
			if(story.lines == 'true'){
				svg.append('g').selectAll('.horiz0')
					.data(d3.range(30))
				.enter().append('line')
					.attr({ class: 'horiz0', x1: 0, y1: function(d, i){ return (H + i * (parseInt(story.ydom)) + i * ypad + (parseInt(story.ydom)) ); },
									x2: 430, y2: function(d, i){ return (H + i * (parseInt(story.ydom)) + i * ypad + (parseInt(story.ydom)) ); }								
					});
			}	
      return update;
    }
		var x0 = d3.scale.linear().domain([0, 100]).range([150, 350]);
		var x1 = d3.scale.linear().domain([0, 100]).range([550, 750]);
    var v0 = showstack('v0', nodes.entries(subset), 150, 15, 200, 30);
		v0.append('g').selectAll('.vert0')
			.data(d3.range(20, 100, 20))
     .enter().append('line')
			.attr({ class: 'vert0', x1: x0, y1: 0, x2: x0, y2: svg.attr('height')  });
		svg.append('g').selectAll('.y1')
      .data(d3.range(20, 100, 20))
     .enter().append('text')
			.attr({ class: 'y1', x: x0, y: 10 })
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
				.attr({ class: 'vert1', x1: x1, y1: 0, x2: x1, y2: svg.attr('height') });			 				
			svg.append('g').selectAll('.y2')
				.data(d3.range(20, 100, 20))
			 .enter().append('text')
				.attr({ class: 'y2', x: x1, y: 10 })
				.text(function(d){ return d + '%';});			
			d3.selectAll('.horiz0').classed('fade', true);	
			svg.attr('height', d3.max([ story.barHeight * datalength, 150 ]));
			v1.on('click', function(d){ draw_stack(story) ;});	
    });
		function drawVertLines(){
				if(story.lines == 'true'){	
					svg.append('g').selectAll('.horiz1')
						.data(subdata)
						.enter().append('line')
						.attr({ class: 'horiz1', x1: 440, y1: function(d, i){ return (15 + i * (parseInt(story.ydom)) + i * ypad + (parseInt(story.ydom)) ); },
									x2: 830 , y2: function(d, i){ return (15 + i * (parseInt(story.ydom)) + i * ypad + (parseInt(story.ydom)) ); }  
						});						
				}	
			}		
  });
}
function draw_dorling(story) { // state pages
	d3.selectAll('.legend.dorling, #forstate, #gradient_cont').style('display', 'block');  
	d3.select('#otstate').style('display', 'none');
	var gradient = d3.select('#gradient');
  gradient.append('rect')
		.attr({ x: 0, y: 0, width: 958, height: 30, fill: 'url(#'+ story.grad +')' });		
  gradient.selectAll('text')
    .data(story.percent) 
   .enter().append('text')
		.attr({ x: function(d){ return d + '%';}, y: 20, fill: function(d, i){ return i == 3 ? 'white' : 'black';} })
		.data(story.pertext) 
    .text(function(d){ return d + '%'; });	
  d3.selectAll('.subparams').remove();
	var subparamMoney = d3.select('.subparam#MoneySpent').append('select').attr('class', 'subparams'),
	 	subparamToilets = d3.select('.subparam#ToiletsBuilt').append('select').attr('class', 'subparams'),
		hashdec = decodeURIComponent(window.location.hash.replace(/^#/, '')).split('|');
	subparamMoney.selectAll('option')
		.data(options['Money Spent'])
		.enter().append('option')
		.text(String);
	subparamToilets.selectAll('option')
		.data(options['Toilets Built'])
		.enter().append('option')
		.text(String);	
	if(hashdec[2] == 'Money Spent'){
		$('#stateTab li').removeClass('active');
		$('#stateTab li:nth-child(1)').addClass('active');
		$('.tab-content .tab-pane').removeClass('in active');
		$('.tab-content #MoneySpents').addClass('in active');
	}else if(hashdec[2] == 'Toilets Built'){
		$('#stateTab li').removeClass('active');
		$('#stateTab li:nth-child(2)').addClass('active');
		$('.tab-content .tab-pane').removeClass('in active');
		$('.tab-content #ToiletsBuilts').addClass('in active');
	}else if(hashdec[2] == 'Performance'){
		$('#stateTab li').removeClass('active');
		$('#stateTab li:nth-child(3)').addClass('active');
		$('.tab-content .tab-pane').removeClass('in active');
		$('.tab-content #Performances').addClass('in active');
	}else{
		$('#stateTab li').removeClass('active');
		$('#stateTab li:nth-child(4)').addClass('active');
		$('.tab-content .tab-pane').removeClass('in active');
		$('.tab-content #Censuss').addClass('in active');
	}	
	$('.subparam#MoneySpent select').val(hashdec[3]); 
	$('.subparam#ToiletsBuilt select').val(hashdec[3]); 
	var svg1 = d3.select('#chartS1'),
	    svg2 = d3.select('#chartS2'),
	    svg3 = d3.select('#chartS3'),
	    svg4 = d3.select('#chartS4'),
	    group = story.title.toUpperCase();			
	d3.csv(story.data || datafile(), function(data) {
		var subset = initchart(story, data),		
		R = story.R, k = story.K, a = story.A,		
		nodes = [], node1 = [], node2 = [], topomaps = [], centered;
		width = parseInt(svg.attr('width')),
		height = parseInt(svg.attr('height')),
		projection = d3.geo.mercator()
			.scale(width*5.5)
			.translate([-width+230, height+100]),			
		path = d3.geo.path()
			.projection(projection),
		legend = d3.select('.legend.dorling');
		legend.selectAll('*').remove();
		var distselect = legend.append('select').attr('class', 'districts'),
    result = _.filter(subset, function(d){ return d.State_Name == group && !d.District_Name.match(/^Total/); }),
		Range = story.range,
		r = d3.scale.linear().domain(d3.extent(result, function(d){ return parseFloat(d[story.size]);})).range(Range);
		groups = result;
		groups.unshift({"District_Name":"select District"});
		distselect.selectAll('option')
				.data(groups)
			.enter()
				.append('option')
				.text(function(d){ return d.District_Name; });	
		result.shift();		
		d3.csv('GeocodeLatLong.csv', function(geo){
			var longminmax = d3.extent(geo, function(d){ return parseFloat(d.Longitude);}),
			latminmax = d3.extent(geo, function(d){ return parseFloat(d.Latitude);}),
			xscale = d3.scale.linear().domain(longminmax).range([295, 685]).clamp(true), 
			yscale = d3.scale.linear().domain(latminmax).range([477, 60]).clamp(true); 
			nodes = geo.map(function(d){ return {
								x: xscale(d.Longitude), y: yscale(d.Latitude),
								x0: xscale(d.Longitude), y0: yscale(d.Latitude)    
							};
			});	
			var maps1 = [], maps2 = []; 
			d3.json('topojson/ind_states.json', function(json) {
					svg1.select('g').remove();	
					svg2.select('g').remove();	
					maps1 = svg1.append('g');
					maps2 = svg2.append('g');
			  if(hashdec[2] == 'Money Spent'){		
					d3.selectAll('#legend_cont, #download_cont, #source_cont, #source').style('display', 'block');
					maps1.selectAll('.feature')
							.data(topojson.object(json, json.objects.india_states).geometries)
						.enter().append('path')
							.attr({ class: 'feature auto hide', 'data-q': function(d){ return d.properties.NAME.toUpperCase(); }, 
											d: function(d){ topomaps.push([d.properties.NAME.toUpperCase(), d]); return path(d);} 
							});
					var node1 = maps1.selectAll('.distCircs')
							.data(geo)
						.enter().append('circle')	
							.attr({ class: 'distCircs hide', cx: function(d) { return xscale(d.Longitude); }, 
											cy: function(d) { return yscale(d.Latitude); } 
							})							
							.data(subset)
							.attr({ r: function(d){ return d.State_Name == group ? r(d[story.size]) : 1;}, 'stroke': '#000', 'stroke-width': -1 + 'px', 
											fill: story.color, 'data-q': function(d){ return d.State_Name; }, 'data-r': function(d){ return d.District_Name; }											
							})							
							.on('mouseover', function(){
								var details = d3.select(this).text(); 
								$('#copy_title').val(details).select();	
							});
					node1.append('title')
							.text(story.hover);
					var selPath = _.filter(topomaps, function(m){ return m[0] == group; }),
					D = selPath[0][1],
					centroid = path.centroid(D); x = centroid[0]; y = centroid[1];
					maps1.selectAll('.feature[data-q="' + group + '"]').classed('hide', false).style({ 'stroke-width': -1 + 'px' });
					maps1.transition()
						.duration(-1600)
						.attr("transform", "translate(" + width / 2 + "," + height / a + ")scale(" + k + ")translate(" + -x + "," + -y + ")");		
					maps1.selectAll('.distCircs[data-q="' + group + '"]').classed('hide', false); 							
				}else if(hashdec[2] == 'Toilets Built'){	
					d3.selectAll('#legend_cont, #gradient_cont, #download_cont, #source_cont, #source').style('display', 'block');					
					maps2.selectAll('.featureTB')
							.data(topojson.object(json, json.objects.india_states).geometries)
						.enter().append('path')
							.attr({ class: 'featureTB auto hide', 'data-q': function(d){ return d.properties.NAME.toUpperCase(); }, 
											d: function(d){ topomaps.push([d.properties.NAME.toUpperCase(), d]); return path(d);} 
							});
					var node2 = maps2.selectAll('.distCircsTB')
							.data(geo)
						.enter().append('circle')	
							.attr({ class: 'distCircsTB hide', cx: function(d) { return xscale(d.Longitude); }, 
											cy: function(d) { return yscale(d.Latitude); } 
							})
							.data(subset)
							.attr({ r: function(d){ return d.State_Name == group ? r(d[story.size]) : 1;}, 'stroke': '#000', 'stroke-width': -1 + 'px', //r(d[story.size])
											fill: story.color, 'data-q': function(d){ return d.State_Name; }, 'data-r': function(d){ return d.District_Name; }											
							})							
							.on('mouseover', function(){
								var details = d3.select(this).text(); 
								$('#copy_title').val(details).select();	
							});
					node2.append('title')
							.text(story.hover);
					var selPath = _.filter(topomaps, function(m){ return m[0] == group; }),
					D = selPath[0][1],
					centroid = path.centroid(D); x = centroid[0]; y = centroid[1];
					maps2.selectAll('.featureTB[data-q="' + group + '"]').classed('hide', false).style({ 'stroke-width': -1 + 'px' });
					maps2.transition()
						.duration(-1600)
						.attr("transform", "translate(" + width / 2 + "," + height / a + ")scale(" + k + ")translate(" + -x + "," + -y + ")");				
					maps2.selectAll('.distCircsTB[data-q="' + group + '"]').classed('hide', false); 
				}										
				subparamMoney.on('change', function(d){
					story.param2 = subparamMoney.property('value');
					window.location.hash = encodeURIComponent(story.menu + '|' + story.title + '|' + story.param1 + '|' + story.param2);
				});
				subparamToilets.on('change', function(d){
					story.param2 = subparamToilets.property('value');
					window.location.hash = encodeURIComponent(story.menu + '|' + story.title + '|' + story.param1 + '|' + story.param2);
				});
			});							
		});	
		if(hashdec[2] == 'Performance'){	
				var width = svg.attr('width'),
						height = svg.attr('height');				
				// TSC - scatterplot
				d3.selectAll('#legend_cont, #download_cont, #source_cont, #source').style('display', 'block');
				d3.select('#gradient_cont').style('display', 'none');
				svg3.selectAll('*').remove();
				svg3.append('path')
					.attr("d",'M 40 461 L 922 40 L 40 40')           
					.style({ 'fill': '#B8E62E', 'fill-opacity': 0.3, 'stroke': '#000' });
				svg3.append('path')
					.attr("d",'M 40 461 L 922 40 L 922 461')           
					.style({ 'fill': '#D73027', 'fill-opacity': 0.5, 'stroke': '#000' });	
				var xscale1 = d3.scale.linear().domain(story.xdom).range([R, width - R]),
		    yscale1 = d3.scale.linear().domain(story.ydom).range([height - R, R]),
				rDistrict = d3.scale.linear().domain(d3.extent(result.map(function(d) { return story.area1[1](d);}))).range([10, 20]);
				var districts = svg3.selectAll('.districts')    
					.data(subset).enter();			
				districts.append('circle')
					.attr({ class: 'districts hide', cx: function(d) { return xscale1(story.cx(d)); }, cy: function(d) { return yscale1(story.cy(d)); }, 
							r: function(d){ return rDistrict(story.area1[1](d)); }, fill: story.color1, stroke: '#000', 'fill-opacity' : 0.9,
							'data-q': function(d) { return d.State_Name; }, 'data-r': function(d) { return d.District_Name; } 
					})
					.classed( 'hide', function(d){ return d.State_Name == group ? false : true; })
					.on('mouseover', function() {
							var details = d3.select(this).text(); 
							$('#copy_title').val(details).select();	
					})
					.append('title')
		      .text(story.hover1);		
		    var xaxis = svg3.append('g')
		      .classed('axis', true)
					.attr('transform', 'translate(0,' + (height - R) + ')')
		      .call(d3.svg.axis()
		              .scale(xscale1)
		              .orient('bottom')
		              .tickFormat(d3.format('.0%')))
		      .append('text')
		      .text(story.x[0])
					.attr({ transform: 'translate(0, -5)', x: width - R, 'text-anchor': 'end' });
		    var yaxis = svg3.append('g')
		      .attr('class', 'axis')
		      .attr('transform', 'translate(' + R + ',0)')
		      .call(d3.svg.axis()
		              .scale(yscale1)
		              .orient('left')
		              .tickFormat(d3.format('.0%')))
		      .append('text')
		      .text(story.y[0])
					.attr({ x: R, transform: 'translate(5,0) rotate(-90,' + R + ',' + R + ')', 'text-anchor': 'end', 'dominant-baseline': 'hanging'  });	
				// Lines joining x-axis and y-axis
				svg3.append('g').selectAll('.h')
					.data(d3.range(0.2, story.ydom[1] , 0.2))
					.enter().append('line')
					.attr({ class: 'h', x1: R, y1: function(d){ return yscale1(d);}, 
							x2: function(d){ return xscale1(d);}, y2: function(d){ return yscale1(d);} 
					});
				svg3.append('g').selectAll('.v')
					.data(d3.range(0.2, story.xdom[1] , 0.2))
					.enter().append('line')
					.attr({ class: 'v', x1: function(d){ return xscale1(d);}, y1: function(d){ return yscale1(d);}, 
							x2: function(d){ return xscale1(d);}, y2: height - R 
					});
		}else if(hashdec[2] == 'Census'){
			d3.selectAll('#gradient_cont, #legend_cont, #download_cont, #source_cont, #source').style('display', 'none');
			var statename = group.split(' ').join('');
			d3.selectAll('#svgcensus, #svgcensuslegend, #cenTitle, #despT, #chartT, #chartB, #despB, #despC, #chartC').selectAll('*').remove();
			var despT = story.cen_t, despB = story.cen_b, despC = story.cen_c;
			d3.select('#svgcensus')
				.append('object')
				.attr('data', 'census_svgs/'+statename+'.svg')
				.attr('width', 960)
				.attr('height', 500);				
			d3.select('#svgcensuslegend').append('img').attr('src', 'census_svgs/grad_legend_census.png') 		
			d3.select('#cenTitle').text('Comparing Census and rural sanitation scheme (TSC) data');
			d3.select('#despT').text(despT);
			d3.select('#chartT').append('img').attr('src', 'pdf/T'+statename+'.png');
			d3.select('#despB').selectAll('.pb').data(despB).enter().append('p').text(String);
			d3.select('#chartB').append('img').attr('src', 'pdf/B'+statename+'.png');
			d3.select('#despC').selectAll('.pc').data(despC).enter().append('p').text(String);		
			d3.select('#chartC').append('img').attr('src', 'pdf/C'+statename+'.png');
		}
		distselect.on('change', function(d){		
			d3.selectAll('.tooltip').remove();
			var subgroup = d3.select(this).property('value');
			svg1.selectAll('circle').classed('mark', false);
			svg2.selectAll('circle').classed('mark', false);
			svg3.selectAll('circle').classed('mark', false);
			svg1.selectAll('circle[data-q="' + group + '"]')
        .data(result)
        .classed('mark1', function(d){
          return d.District_Name == subgroup ? true : false; 
				});
			$('.mark1').tooltip({ title:function(){ return $('.mark1 title').text(); }, trigger:'focus', container:'body' }).tooltip('show');								
			svg2.selectAll('circle[data-q="' + group + '"]')
        .data(result)
        .classed('mark2', function(d){
          return d.District_Name == subgroup ? true : false; 
				});
			$('.mark2').tooltip({ title:function(){ return $('.mark2 title').text(); }, trigger:'focus', container:'body' }).tooltip('show');	
			svg3.selectAll('circle[data-q="' + group + '"]')
        .data(result)
        .classed('mark', function(d){
          return d.District_Name == subgroup ? true : false; 
				});
			$('.mark').tooltip({ title:function(){ return $('.mark title').text(); }, trigger:'focus', container:'body' }).tooltip('show');		
			if(hashdec[2] == 'Money Spent'){
				var details = svg1.selectAll('circle[data-q="' + group + '"][data-r="' + subgroup + '"]').text();
			}else if(hashdec[2] == 'Toilets Built'){
				var details = svg2.selectAll('circle[data-q="' + group + '"][data-r="' + subgroup + '"]').text();
			}else{
				 var details = svg3.selectAll('circle[data-q="' + group + '"][data-r="' + subgroup + '"]').text();
			}
			$('#copy_title').val(details);
			$('#copy_title').on('mouseover', function(){ $(this).select(); });		
		});
	});
	$('#stateTab a').click(function(e) {
	  e.preventDefault();
	  $(this).tab('show');
	  story.param1 = this.text;
	  if(story.param1 == 'Performance' || story.param1 == 'Census'){
	  	window.location.hash = encodeURIComponent(story.menu + '|' + story.title + '|' + story.param1);	
	  }else{
			story.param2 = options[story.param1][0];	  	
			window.location.hash = encodeURIComponent(story.menu + '|' + story.title + '|' + story.param1 + '|' + story.param2);
	  }	 
	});
}
function draw_dorlingCart(story) {   // census 2001 vs 2011
	d3.select('#data_cont div').style('padding-left','15px').style('margin-left','-10px');
	d3.select('#data_cont div strong').text('Change Date : ');
	d3.selectAll('#gradient_cont, .legend.dorlingCart').style('display', 'block');
	var gradient = d3.select('#gradient');
	gradient.append('rect')
		.attr({ x : 0, y: 0, width : 958, height : 30, fill : 'url(#' + story.grad + ')' });
  gradient.selectAll('text')
    .data(story.percent) 
   .enter().append('text')
		.attr({ x : function(d){ return d + '%';}, y : 20 })
		.data(story.pertext) 
    .text(function(d){ return d; })
    .style('fill', function(d, i){ return i == 3 ? 'white' : 'black';});
	var svg = d3.select('#chart');
			svg.style('border', function(){ return window.location.search == '?embed=1' ?  '1px solid #fff' : '1px solid #ddd';});
	var width = parseInt(svg.style('width')),
	height = parseInt(svg.style('height')),
	nodes = [], node = [], centered;
	var projection = d3.geo.mercator()
			.scale(width*5.5)
			.translate([-width+230, height+100]);			
	var path = d3.geo.path()
			.projection(projection);					
	var topomaps = [];		
	d3.select('#brought').style('display', function(){ return window.location.search == '?embed=1' ? 'block' : 'none';});	
	d3.csv(story.data || datafile(), function(data) {
		svg.selectAll('*').remove();
		if(story.data){ $('#data_cont').hide(); d3.select('#data').attr('href', story.data); } else { $('#data_cont').show();}
		var subset = initchart(story, data),		
	  legend = d3.select('.legend.dorlingCart');
		legend.selectAll('*').remove();
		var select = legend.append('select').attr('class', 'states'),
    subselect = legend.append('select').attr('class', 'districts'),
		groups = _.uniq(_.pluck(subset, story.group[0]));
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
				change(group);						
		});
		var nested_data = d3.nest()
				.key(function(d){ return d[story.group[0]]; })
				.rollup(function(rows){ return { 'C2011'   : d3.sum(rows, function(d){ return d[story.size]; }),
																				 'cen2011' : d3.sum(rows, function(d){ return d[story.cen2011];}),	
																				 'cen2001' : d3.sum(rows, function(d){ return d[story.cen2001];}),
																				 'trh2011' : d3.sum(rows, function(d){ return d[story.trh2011];}),
																				 'trh2001' : d3.sum(rows, function(d){ return d[story.trh2001];}),
																				 'diff'    : d3.mean(rows, function(d){ return d[story.diff];})
																			 } 
				})
				.entries(subset);
		var maps = svg.append('g'),
		    g = maps.append('g');
		d3.csv('GeocodeLatLong.csv', function(geo){
			var R = story.R,
			longminmax = d3.extent(geo, function(d){ return parseFloat(d.Longitude);}),
			latminmax = d3.extent(geo, function(d){ return parseFloat(d.Latitude);});
			var xscale = d3.scale.linear().domain(longminmax).range([295, 685]).clamp(true), 
			yscale = d3.scale.linear().domain(latminmax).range([477, 60]).clamp(true); 
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
			nodesD = geo.map(function(d){ return {
																x: xscale(d.Longitude), y: yscale(d.Latitude),
																x0: xscale(d.Longitude), y0: yscale(d.Latitude)    
															};
			});
			d3.json('topojson/ind_states.json', function(json) {
					g.selectAll('.feature')
							.data(topojson.object(json, json.objects.india_states).geometries)
						.enter().append('path')
							.attr({ class: 'feature auto', 'data-q': function(d){ return d.properties.NAME.toUpperCase(); }, 
											d: function(d){ topomaps.push([d.properties.NAME.toUpperCase(), d]); return path(d);} 
							});
					g.selectAll('.statCircs')
							.data(nodes)
						.enter().append('circle')						
							.attr({ class: 'statCircs', cx: function(d) { return d.x; }, cy: function(d) { return d.y; } })
							.data(nested_data)
							.attr({ 'data-q': function(d){ return d.key; }, r: function(d){ return Math.pow(d.values['C2011'], 1/6) ; }, 
											fill: function(d){ return colorDorCart(d.values['diff']).replace(/NaNNaNNaN/i, 'eee');}	
              })
							.on('mouseover', function(){
								var details = d3.select(this).text(); 
								$('#copy_title').val(details).select();	
							})
							.append('title')
							.text(function(d){ return d.key+' : '+story.area[0]+ ' = '+N(d.values['C2011']) +'. ' 
								+story.num[0]+' = '+N(d.values['cen2011'])+'. '
								+story.den1[0]+' = '+N(d.values['trh2001'])+'. '
								+story.num1[0]+' = '+N(d.values['cen2001'])+'. '
							  +story.cen2011_2001[0]+' = '+P(d.values['diff']);									 
              });
					node = g.selectAll('.distCircs')
							.data(geo)
						.enter().append('circle')	
							.attr({ class: 'distCircs  hide', cx: function(d) { return xscale(d.Longitude); }, 
											cy: function(d) { return yscale(d.Latitude); } 
							})
							.data(subset)
							.attr({ r: function(d){ return Math.pow(d[story.size], 1/12 );}, 'stroke': '#000', 'stroke-width': 0.25,
											fill: function(d){ return colorDorCart(d[story.diff]).replace(/NaNNaNNaN/i, 'eee'); },
											'data-q': function(d){ return d.State_Name; }, 'data-r': function(d){ return d.District_Name; }											
							})							
							.on('mouseover', function(){
								var details = d3.select(this).text(); 
								$('#copy_title').val(details).select();	
							});
					node.append('title')
							.text(function(d){ return d.State_Name +' - '+d.District_Name+': '
								  +story.area[0]+ ' = '+N(d[story.size]) +'. ' 
									+story.num[0]+' = '+N(d[story.cen2011])+'. '
									+story.den1[0]+' = '+N(d[story.trh2001])+'. '
									+story.num1[0]+' = '+N(d[story.cen2001])+'. '
									+story.cen2011_2001[0]+' = '+P(d[story.diff]);									 									
							});
				});
		});		
		function change(state) {			
			var x, y, k;
			if (state !== 'select State'){
				var sp = _.filter(topomaps, function(m){ return m[0] == state; });  
				d = sp[0][1];
				svg.selectAll('.feature').classed('hide', true);
				svg.selectAll('.statCircs, .distCircs').classed('hide', true);
				svg.selectAll('.feature[data-q="' + state + '"]').classed('hide', false); 
				svg.selectAll('.distCircs[data-q="' + state + '"]').classed('hide', false); 
				var centroid = path.centroid(d); x = centroid[0]; y = centroid[1]; k = 4; //centered = d;
			} else {
				svg.selectAll('.feature').classed('hide', false);
				svg.selectAll('.distCircs').classed('hide', true);
				svg.selectAll('.statCircs').classed('hide', false);
			}
			g.transition()
					.duration(0)
					.attr("transform", "translate(" + width / 2 + "," + height / 2  + ")scale(" + k + ")translate(" + -x + "," + -y + ")");
			}
			subselect.on('change', function(d){
				d3.selectAll('.tooltip').remove();
				svg.selectAll('.distCircs').classed('mark', false);
				var group = select.property('value'),
				subgroup = d3.select(this).property('value'),
				details = svg.selectAll('.distCircs[data-q="' + group + '"][data-r="' + subgroup + '"]').classed('mark', true).text();
				$('#copy_title').val(details);
				$('#copy_title').on('mouseover', function(){ $(this).select(); });	
				$('.mark').tooltip({ title:function(){ return $('.mark title').text(); }, trigger:'focus', container:'body' }).tooltip('show');						
		});
	});
}
function datachanges(){	
	$('.loader').show();
	d3.select('#dataChange').style('display', 'block');
	d3.csv('datachanges.csv', function(data){  
		total_columns = d3.keys(data[0]),
		columns = total_columns.splice(4, total_columns.length - 1); 
		dates = _.uniq(_.pluck(data, 'Date')), 
		select_date = d3.select('#date_changes'),
		month = [];	
		for(d=0,ds=dates.length; date=dates[d], d<ds; d++){
			month.push(date.slice(3, date.length));
		}		
		months = _.uniq(month).reverse();
		select_date.selectAll('*').remove();
		select_date.selectAll('.options')
 			.data(months).enter().append('option').text(String);
 		selected_date = select_date.property('value');
 		end_date = dates[dates.length-1]; 	
 		start_date = _.filter(dates, function(d){ return d.split('-')[1] == selected_date.split('-')[0];	});
 	 	filtered_data = _.filter(data, function(d){ return d.Date == end_date; });
 	 	prev_data = _.filter(data, function(d){ return d.Date == start_date[0];});
 	 	draw_table(filtered_data, prev_data);
		select_date.on('change', function(d, i){
			$('#perf_btn').removeClass('btn-primary');	
		 	$('#perf_btn').removeClass('active');	
			$('#fin_btn').addClass('btn-primary');	
			$('#fin_btn').addClass('active');	
		 	selected_date = d3.select(this).property('value');
		 	start_date = _.filter(dates, function(d){ return d.split('-')[1] == selected_date.split('-')[0];	});
		 	end_date = start_date[start_date.length-1];
		 	filtered_data = _.filter(data, function(d){ return d.Date == end_date; });
 	 		prev_data = _.filter(data, function(d){ return d.Date == start_date[0];});
 	 		draw_table(filtered_data, prev_data);			 		
		});
		function draw_table(filtered_data, prev_data){			
			$('.loader').show();
			d3.select('#tableData').selectAll('*').remove();
			nestedStateData = d3.nest()
					.key(function(d){ return d.State_Name; })
					.rollup(function(rows){ return get_rollup(d3.sum, rows); }) 					
					.entries(filtered_data),
			state_level_data = d3.nest()
					.key(function(d){ return d.State_Name; })
					.rollup(function(rows){ return get_rollup(d3.mean, rows); })		
					.entries(filtered_data),
			district_level_data = d3.nest()
					.key(function(d){ return [d.State_Name, d.District_Name]; })				
					.entries(filtered_data),
			prev_state_level_data = d3.nest()
					.key(function(d){ return d.State_Name; })
					.rollup(function(rows){ return get_rollup(d3.mean, rows); })		
					.entries(prev_data),
			prev_district_level_data = d3.nest()
					.key(function(d){ return [d.State_Name, d.District_Name]; })				
					.entries(prev_data);								
			states_districts  = ['+ ANDHRA PRADESH', '- ADILABAD', '- ANANTAPUR', '- CHITTOOR', '- CUDDAPAH', '- EAST GODAVARI', '- GUNTUR', '- KARIMNAGAR', '- KHAMMAM', '- KRISHNA', '- KURNOOL', '- MAHBUBNAGAR', '- MEDAK', '- NALGONDA', '- NELLORE', '- NIZAMABAD', '- PRAKASAM', '- RANGAREDDI', '- SRIKAKULAM', '- VISAKHAPATNAM', '- VIZIANAGARAM', '- WARANGAL', '- WEST GODAVARI', '+ ARUNACHAL PRADESH', '- ANJAW', '- CHANGLANG', '- DIBANG VALLEY', '- EAST KAMENG', '- EAST SIANG', '- KURUNG KUMEY', '- LOHIT', '- LOWER DIBANG VALLEY', '- LOWER SUBANSIRI', '- PAPUM PARE', '- TAWANG', '- TIRAP', '- UPPER SIANG', '- UPPER SUBANSIRI', '- WEST KAMENG', '- WEST SIANG', '+ ASSAM', '- BAGSHA', '- BARPETA', '- BONGAIGAON', '- CACHAR', '- CHIRANG', '- DARRANG', '- DHEMAJI', '- DHUBRI', '- DIBRUGARH', '- GOALPARA', '- GOLAGHAT', '- HAILAKANDI', '- JORHAT', '- KAMRUP', '- KARBI ANGLONG', '- KARIMGANJ', '- KOKRAJHAR', '- LAKHIMPUR', '- MARIGAON', '- NAGAON', '- NALBARI', '- NORTH CACHAR HILLS', '- SIBSAGAR', '- SONITPUR', '- TINSUKIA', '- UDALGURI', '+ BIHAR', '- ARARIA', '- ARWAL', '- AURANGABAD', '- BANKA', '- BEGUSARAI', '- BHAGALPUR', '- BHOJPUR', '- BUXAR', '- DARBHANGA', '- GAYA', '- GOPALGANJ', '- JAMUI', '- JEHANABAD', '- KAIMUR(BHABUA)', '- KATIHAR', '- KHAGARIA', '- KISHANGANJ', '- LAKHISARAI', '- MADHEPURA', '- MADHUBANI', '- MUNGER', '- MUZAFFARPUR', '- NALANDA', '- NAWADA', '- PASHCHIM CHAMPARAN', '- PATNA', '- PURBA CHAMPARAN', '- PURNIA', '- SAHARSA', '- SAMASTIPUR', '- SARAN', '- SASARAM(ROHTAS)', '- SHEIKHPURA', '- SHEOHAR', '- SITAMARHI', '- SIWAN', '- SUPAUL', '- VAISHALI', '+ CHHATTISGARH', '- BASTAR(JAGDALPUR)', '- BILASPUR', '- DANTEWADA', '- DHAMTARI', '- DURG', '- JANJGIR - CHAMPA', '- JASHPUR', '- KANKER', '- KAWARDHA(KABIRDHAM)', '- KORBA', '- KORIYA', '- MAHASAMUND', '- RAIGARH', '- RAIPUR', '- RAJNANDGAON', '- SURGUJA', '+ D & N HAVELI', '- DADRA AND NAGAR HAVELI', '+ GOA', '- NORTH GOA', '- SOUTH GOA', '+ GUJARAT', '- AHMEDABAD', '- AMRELI', '- ANAND', '- BANAS KANTHA', '- BHARUCH', '- BHAVNAGAR', '- DAHOD', '- DANGS', '- GANDHINAGAR', '- JAMNAGAR', '- JUNAGADH', '- KACHCHH', '- KHEDA', '- MAHESANA', '- NARMADA', '- NAVSARI', '- PANCH MAHALS', '- PATAN', '- PORBANDAR', '- RAJKOT', '- SABAR KANTHA', '- SURAT', '- SURENDRANAGAR', '- VADODARA', '- VALSAD', '+ HARYANA', '- AMBALA', '- BHIWANI', '- FARIDABAD', '- FATEHABAD', '- GURGAON', '- HISAR', '- JHAJJAR', '- JIND', '- KAITHAL', '- KARNAL', '- KURUKSHETRA', '- MAHENDRAGARH', '- MEWAT', '- PANCHKULA', '- PANIPAT', '- REWARI', '- ROHTAK', '- SIRSA', '- SONIPAT', '- YAMUNANAGAR', '+ HIMACHAL PRADESH', '- BILASPUR', '- CHAMBA', '- HAMIRPUR', '- KANGRA', '- KINNAUR', '- KULLU', '- LAHAUL & SPITI', '- MANDI', '- SHIMLA', '- SIRMAUR', '- SOLAN', '- UNA', '+ JAMMU & KASHMIR', '- ANANTNAG', '- BANDIPORA', '- BARAMULLA', '- BUDGAM', '- DODA', '- JAMMU', '- KARGIL', '- KATHUA', '- KISHTWAR', '- KULGAM', '- KUPWARA', '- LEH (LADAKH)', '- POONCH', '- PULWAMA', '- RAJAURI', '- RAMBAN', '- REASI', '- SAMBA', '- SHOPIAN', '- SRINAGAR', '- UDHAMPUR', '+ JHARKHAND', '- BOKARO', '- CHATRA', '- DEOGHAR', '- DHANBAD', '- DUMKA', '- GARHWA', '- GIRIDIH', '- GODDA', '- GUMLA', '- HAZARIBAGH', '- JAMTARA', '- KHUNTI', '- KODERMA', '- LATEHAR', '- LOHARDAGA', '- PAKUR', '- PALAMU', '- PASCHIM SINGHBHUM', '- PURBI SINGHBHUM', '- RAMGARH', '- RANCHI', '- SAHIBGANJ', '- SERAIKELA KHARSAWAN', '- SIMDEGA', '+ KARNATAKA', '- BAGALKOT', '- BANGALORE RURAL', '- BANGALORE URBAN', '- BELGAUM', '- BELLARY', '- BIDAR', '- BIJAPUR', '- CHAMARAJANAGAR', '- CHICKMAGALUR', '- CHIKBALLAPUR', '- CHITRADURGA', '- DAVANGERE', '- DHARWAD', '- GADAG', '- GULBARGA', '- HASSAN', '- HAVERI', '- KODAGU', '- KOLAR', '- KOPPAL', '- MANDYA', '- MANGALORE(DAKSHINA KANNADA)', '- MYSORE', '- RAICHUR', '- RAMANAGARA', '- SHIMOGA', '- TUMKUR', '- UDUPI', '- UTTAR KANNADA', '+ KERALA', '- ALAPPUZHA', '- ERNAKULAM', '- IDUKKI', '- KANNUR', '- KASARGOD', '- KOLLAM', '- KOTTAYAM', '- KOZHIKODE', '- MALAPPURAM', '- PALAKKAD', '- PATHANAMTHITTA', '- THIRUVANANTHAPURAM', '- THRISSUR', '- WAYANAD', '+ MADHYA PRADESH', '- ALIRAJPUR', '- ANUPPUR', '- ASHOKNAGAR', '- BALAGHAT', '- BARWANI', '- BETUL', '- BHIND', '- BHOPAL', '- BURHANPUR', '- CHHATARPUR', '- CHHINDWARA', '- DAMOH', '- DATIA', '- DEWAS', '- DHAR', '- DINDORI', '- GUNA', '- GWALIOR', '- HARDA', '- HOSHANGABAD', '- INDORE', '- JABALPUR', '- JHABUA', '- KATNI', '- KHANDWA(EAST NIMAR)', '- KHARGONE', '- MANDLA', '- MANDSAUR', '- MORENA', '- NARSINGHPUR', '- NEEMUCH', '- PANNA', '- RAISEN', '- RAJGARH', '- RATLAM', '- REWA', '- SAGAR', '- SATNA', '- SEHORE', '- SEONI', '- SHAHDOL', '- SHAJAPUR', '- SHEOPUR', '- SHIVPURI', '- SIDHI', '- SINGRAULI', '- TIKAMGARH', '- UJJAIN', '- UMARIA', '- VIDISHA', '+ MAHARASHTRA', '- AHMEDNAGAR', '- AKOLA', '- AMRAVATI', '- AURANGABAD', '- BEED', '- BHANDARA', '- BULDHANA', '- CHANDRAPUR', '- DHULE', '- GADCHIROLI', '- GONDIA', '- HINGOLI', '- JALGAON', '- JALNA', '- KOLHAPUR', '- LATUR', '- NAGPUR', '- NANDED', '- NANDURBAR', '- NASHIK', '- OSMANABAD', '- PARBHANI', '- PUNE', '- RAIGAD', '- RATNAGIRI', '- SANGLI', '- SATARA', '- SINDHUDURG', '- SOLAPUR', '- THANE', '- WARDHA', '- WASHIM', '- YAVATMAL', '+ MANIPUR', '- BISHNUPUR', '- CHANDEL', '- CHURACHANDPUR', '- IMPHAL EAST', '- IMPHAL WEST', '- SENAPATI', '- TAMENGLONG', '- THOUBAL', '- UKHRUL', '+ MEGHALAYA', '- EAST GARO HILLS', '- EAST KHASI HILLS', '- JAINTIA HILLS', '- RI BHOI', '- SOUTH GARO HILLS', '- WEST GARO HILLS', '- WEST KHASI HILLS', '+ MIZORAM', '- AIZAWL', '- CHAMPHAI', '- KOLASIB', '- LAWNGTLAI', '- LUNGLEI', '- MAMIT', '- SAIHA', '- SERCHHIP', '+ NAGALAND', '- DIMAPUR', '- KIPHIRE', '- KOHIMA', '- LONGLENG', '- MOKOKCHUNG', '- MON', '- PEREN', '- PHEK', '- TUENSANG', '- WOKHA', '- ZUNHEBOTO', '+ ORISSA', '- ANGUL', '- BALANGIR', '- BALESWAR', '- BARGARH', '- BHADRAK', '- BOUDH', '- CUTTACK', '- DEBAGARH', '- DHENKANAL', '- GAJAPATI', '- GANJAM', '- JAGATSINGHAPUR', '- JAJAPUR', '- JHARSUGUDA', '- KALAHANDI', '- KANDHAMAL', '- KENDRAPARA', '- KENDUJHAR', '- KHORDHA', '- KORAPUT', '- MALKANGIRI', '- MAYURBHANJ', '- NABARANGAPUR', '- NAYAGARH', '- NUAPADA', '- PURI', '- RAYAGADA', '- SAMBALPUR', '- SONEPUR', '- SUNDARGARH', '+ PUDUCHERRY', '- PONDICHERRY', '+ PUNJAB', '- AMRITSAR', '- BARNALA', '- BATHINDA', '- FARIDKOT', '- FATEHGARH SAHIB', '- FEROZEPUR', '- GURDASPUR', '- HOSHIARPUR', '- JALANDHAR', '- KAPURTHALA', '- LUDHIANA', '- MANSA', '- MOGA', '- MUKTSAR', '- NAWANSHAHR', '- PATIALA', '- RUPNAGAR', '- SAS NAGAR', '- SANGRUR', '- TARN TARAN', '+ RAJASTHAN', '- AJMER', '- ALWAR', '- BANSWARA', '- BARAN', '- BARMER', '- BHARATPUR', '- BHILWARA', '- BIKANER', '- BUNDI', '- CHITTORGARH', '- CHURU', '- DAUSA', '- DHOLPUR', '- DUNGARPUR', '- GANGANAGAR', '- HANUMANGARH', '- JAIPUR', '- JAISALMER', '- JALOR', '- JHALAWAR', '- JHUNJHUNU', '- JODHPUR', '- KARAULI', '- KOTA', '- NAGAUR', '- PALI', '- RAJSAMAND', '- SAWAI MADHOPUR', '- SIKAR', '- SIROHI', '- TONK', '- UDAIPUR', '+ SIKKIM', '- EAST SIKKIM', '- NORTH SIKKIM', '- SOUTH SIKKIM', '- WEST SIKKIM', '+ TAMIL NADU', '- COIMBATORE', '- CUDDALORE', '- DHARMAPURI', '- DINDIGUL', '- ERODE', '- KANCHIPURAM', '- KANYAKUMARI(NAGERCOIL)', '- KARUR', '- KRISHNAGIRI', '- MADURAI', '- NAGAPATTINAM', '- NAMAKKAL', '- NILGIRIS(UDHAGAMANDALAM)', '- PERAMBALUR', '- PUDUKKOTTAI', '- RAMANATHAPURAM', '- SALEM', '- SIVAGANGA', '- THANJAVUR', '- THENI', '- THOOTHUKUDI', '- TIRUCHIRAPPALLI', '- TIRUNELVELI', '- TIRUVALLUR', '- TIRUVANNAMALAI', '- TIRUVARUR', '- VELLORE', '- VILLUPURAM', '- VIRUDHUNAGAR', '+ TRIPURA', '- DHALAI', '- NORTH TRIPURA', '- SOUTH TRIPURA', '- WEST TRIPURA', '+ UTTAR PRADESH', '- AGRA', '- ALIGARH', '- ALLAHABAD', '- AMBEDKAR NAGAR', '- AURAIYA', '- AZAMGARH', '- BAGPAT', '- BAHRAICH', '- BALLIA', '- BALRAMPUR', '- BANDA', '- BARABANKI', '- BAREILLY', '- BASTI', '- BIJNOR', '- BUDAUN', '- BULANDSHAHR', '- CHANDAULI', '- CHITRAKOOT', '- DEORIA', '- ETAH', '- ETAWAH', '- FAIZABAD', '- FARRUKHABAD', '- FATEHPUR', '- FIROZABAD', '- GAUTAM BUDDHA NAGAR', '- GHAZIABAD', '- GHAZIPUR', '- GONDA', '- GORAKHPUR', '- HAMIRPUR', '- HARDOI', '- JALAUN', '- JAUNPUR', '- JHANSI', '- JYOTIBA PHULE NAGAR', '- KANNAUJ', '- KANPUR DEHAT', '- KANPUR NAGAR', '- KANSHIRAM NAGAR', '- KAUSHAMBI', '- KUSHINAGAR', '- LAKHIMPUR KHERI', '- LALITPUR', '- LUCKNOW', '- MAHAMAYA NAGAR(HATHRAS)', '- MAHARAJGANJ', '- MAHOBA', '- MAINPURI', '- MATHURA', '- MAU', '- MEERUT', '- MIRZAPUR', '- MORADABAD', '- MUZAFFARNAGAR', '- PILIBHIT', '- PRATAPGARH', '- RAE BARELI', '- RAMPUR', '- SAHARANPUR', '- SANT KABIR NAGAR', '- SANT RAVIDAS NAGAR( BHADOHI)', '- SHAHJAHANPUR', '- SHRAVASTI', '- SIDDHARTHNAGAR', '- SITAPUR', '- SONBHADRA', '- SULTANPUR', '- UNNAO', '- VARANASI', '+ UTTARAKHAND', '- ALMORA', '- BAGESHWAR', '- CHAMOLI', '- CHAMPAWAT', '- DEHRADUN', '- HARIDWAR', '- NAINITAL', '- PAURI(GARHWAL)', '- PITHORAGARH', '- RUDRAPRAYAG', '- TEHRI GARHWAL', '- UDHAM SINGH NAGAR', '- UTTARKASHI', '+ WEST BENGAL', '- BANKURA', '- BARDHAMAN', '- BIRBHUM', '- COOCH BEHAR', '- DAKSHIN DINAJPUR', '- DARJEELING', '- HOOGHLY', '- HOWRAH', '- JALPAIGURI', '- MALDA', '- MIDNAPUR EAST', '- MIDNAPUR WEST', '- MURSHIDABAD', '- NADIA', '- NORTH  PARAGANAS', '- PURULIA', '- SILIGURI', '- SOUTH PARAGANAS', '- UTTAR DINAJPUR'];
			table = d3.select('#tableData').append('table').attr({'width':'1170px'}).classed('table table-condensed', true),
			thead = table.append('thead'),
			tbody = table.append('tbody'),
			headtr = thead.append('tr'),
			bodytr = tbody.selectAll('tr').data(states_districts).enter().append('tr')
				.attr('class', function(d){ return d.split(' ')[0] === '+' ? 'headers valuestr' : 'rows hide valuestr' ; }); 
			headtr.append('th').text('STATE').style({'padding-left':'15px','background': '#000', 'color':'#fff'});
			bodytr.append('td').style({'min-width':'120px','max-width':'120px'}).text(String)
				 .style({'text-indent':function(d){ return d.split(' ')[0] === '-' ? '15px' : ''; }, 'color': function(d){ return d.split(' ')[0] === '+' ? 'blue' : '#000';} , 'cursor': function(d){ return d.split(' ')[0] === '+' ? 'pointer' : 'auto';} });	
			for(i=0,len=columns.length; col=columns[i], i<len; i++) {
				rows = [];
				for(j=0,lens=nestedStateData.length; state = nestedStateData[j], j<lens; j++){
					rows.push(state.values[col]);
				}
				if(d3.sum(rows) != 0){
					headtr.append('td').style({'background': '#000', 'color':'#fff', 'border': '1px solid #fff'}).attr({'class': function(d){ return col.substring(0, 4);}}).append('div')
				  	.attr({ class: 'tooltip1' , 'data-toggle':'tooltip', 'data-placement':'top', 'data-original-title': col.split('_').join(' ') })
				  	.text(col.split('_')[0].substring(0,6)).style({'cursor':'context-menu'});   
					$('.tooltip1').tooltip();
					row_values = [], prev_row_values = [];
					for(j=0, lenS=state_level_data.length; state=state_level_data[j], prev_state=prev_state_level_data[j], j<lenS; j++){
						row_values.push(state.values[col]);
						prev_row_values.push(prev_state.values[col]);
						districts = _.filter(district_level_data, function(d){ return d.key.split(',')[0] == state.key ;});
						prev_districts = _.filter(prev_district_level_data, function(d){ return d.key.split(',')[0] == state.key ;});
						for(k=0, lenD=districts.length; dist=districts[k],prev_dist=prev_districts[k], k<lenD; k++){
							row_values.push(dist.values[0][col]);
							prev_row_values.push(prev_dist.values[0][col]);														
						}
					}	
					curValues = [];				
					td = bodytr.data(row_values).append('td')
					 		.style({'border': '1px solid #fff', 'color':'#000', 'background' : function(d){  curValues.push(d); return d == 'Infinity' ? '#ddd' : d == 0 ? '#fc8d59' : '#91cf60'; } }) 
					 		.attr('class', function(d, i){ return col.substring(0, 4); })							
							.data(prev_row_values)
							.append('div').attr({ class: 'tooltip1' , 'data-toggle':'tooltip', 'data-placement':'bottom', 'data-original-title': function(d, i){ return 'Current value ('+end_date+'): '+P2(curValues[i]) + ' , Previous value ('+start_date[0]+'): '+P2(d)+' , Difference: '+P2(curValues[i] - d)+'.'; } });
					td.html('&nbsp;'); 		
					$('.tooltip1').tooltip();				 
				}
			}
			$('table tr td.Cons').addClass('hide');
			$('#perf_btn').click(function(){
				$(this).addClass('btn-primary');
				$('#fin_btn').removeClass('btn-primary active');
				$('table tr td.Cons').removeClass('hide');
				$('table tr td.Outl, td.Cent, td.Stat, td.Bene, td.Tota, td.Expe').addClass('hide');
			});
			$('#fin_btn').click(function(){
				$(this).addClass('btn-primary');
				$('#perf_btn').removeClass('btn-primary active');
				$('table tr td.Cons').addClass('hide');
				$('table tr td.Outl, td.Cent, td.Stat, td.Bene, td.Tota, td.Expe').removeClass('hide');
			});
			$('table tr.headers td:first-child').click(function() {
	    	$(this).parent().nextAll('tr').each( function() {
		        if ($(this).hasClass('headers')) {
		            return false;
		        }
		        var hide = $(this).hasClass('hide');
		        if(hide){
		        	$(this).removeClass('hide');	
		        }else{
		        	$(this).addClass('hide');	
		        }
		    });	    
			});			
			$('.loader').hide();
		}			
	});
}
function initchart(story, data) { 
  // No transitions work for other chart types, so just empty it
  var svgtype = svg.attr('data-type');
  if (svgtype !== story.type) {
		svg.selectAll('*').remove();
		stimes = 0;
		if (svg.attr('data-type')) {
			svg.classed(svgtype, false);
      d3.selectAll('[data-story="' + svgtype + '"]').style('display', null);
    }
    d3.selectAll('[data-story="' + story.type + '"]').style('display', 'block');
    d3.selectAll('svg').classed(story.type, true)
      .attr('data-type', story.type);
  }
  return _.filter(data, story.filter);
}
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
	d3.selectAll('.navbar-inner, #menu, #subtitle, #exp_text, #copy_cont,.btn-group, #slideshare').remove();	
	d3.selectAll('#right_container, #details, #info, #download_cont, #source_cont, #source, footer').remove();	
}

function get_rollup(c, rows){
	return { 
		'Outlay'								                     : c(rows, function(d){ return  d['Outlay'];}),
		'Centre_-_Amount_Released'									 : c(rows, function(d){ return  d['Centre_-_Amount_Released'];}),
		'State_-_Amount_Released'										 : c(rows, function(d){ return  d['State_-_Amount_Released'];}),
		'Beneficiary_-_Amount_Released'							 : c(rows, function(d){ return  d['Beneficiary_-_Amount_Released'];}),
		'Total_Amount_Released'											 : c(rows, function(d){ return  d['Total_Amount_Released'];}),
		'Expenditure_from_Centre_Share'							 : c(rows, function(d){ return  d['Expenditure_from_Centre_Share'];}),
		'Expenditure_from_State_Share'							 : c(rows, function(d){ return  d['Expenditure_from_State_Share'];}),
		'Expenditure_from_Beneficiary_Share'				 : c(rows, function(d){ return  d['Expenditure_from_Beneficiary_Share'];}),
		'Total_Expenditure'										       : c(rows, function(d){ return  d['Total_Expenditure'];}),
		'Total_Expenditure_on_BPL_toilets'					 : c(rows, function(d){ return  d['Total_Expenditure_on_BPL_toilets'];}),
		'Total_Expenditure_on_School_toilets'				 : c(rows, function(d){ return  d['Total_Expenditure_on_School_toilets'];}),
		'Total_Expenditure_on_Anganwadi_toilets'		 : c(rows, function(d){ return  d['Total_Expenditure_on_Anganwadi_toilets'];}),
		'Total_Expenditure_on_Sanitary_Complexes'		 : c(rows, function(d){ return  d['Total_Expenditure_on_Sanitary_Complexes'];}),
		'Construction_-_IHHL_BPL'										 : c(rows, function(d){ return  d['Construction_-_IHHL_BPL'];}),
		'Construction_-_IHHL_APL'										 : c(rows, function(d){ return  d['Construction_-_IHHL_APL'];}),
		'Construction_-_IHHL_Total'									 : c(rows, function(d){ return  d['Construction_-_IHHL_Total'];}),
		'Construction_-_Sanitary_Complexes_for_Women': c(rows, function(d){ return  d['Construction_-_Sanitary_Complexes_for_Women'];}),
		'Construction_-_Schools_toilets'						 : c(rows, function(d){ return  d['Construction_-_Schools_toilets'];}),
		'Construction_-_Anganwadi_toilets'					 : c(rows, function(d){ return  d['Construction_-_Anganwadi_toilets'];}),
		'Construction_-_Rural_Sanitary_Marts'				 : c(rows, function(d){ return  d['Construction_-_Rural_Sanitary_Marts'];}),
		'Construction_-_Production_Centres'					 : c(rows, function(d){ return  d['Construction_-_Production_Centres'];})			
	};
}


function getlength(n) {
	return n.toString().length;
}		
function getXInterval(n){
	return n > 7000 ? 1000 : n > 2900 ? 500 : n > 1000 ? 200 : n > 800 ? 100 : n > 250 ? 50 : n > 100 ? 20 : n > 50 ? 10 : 2; 
}
function getYInterval(n){
	return n > 750000 ? 100000 : n > 300000 ? 50000 : n > 140000 ? 20000 : n > 55000 ? 10000 : n > 25000 ? 5000 : n > 10000 ? 2000 : n > 5000 ? 1000 : n > 2500 ? 500 : n > 1000 ? 100 : 50;
}
function position() {
  this.transition()
		.duration(400)
		.attr({ x: function(d){ return d.x; }, y: function(d){ return d.y; }, width: function(d){ return d.dx; }, 
						height: function(d){ return d.dy; }, 'data-q': function(d){ return d.depth == 1 ? d.key : d.District_Name; },
				    class: function(d){ return "l" + d.depth; }, 'data-r': function(d){ return d.depth == 2 ? d.State_Name : null; }
		});		
}
function positionText() { 
  this.transition()
		.duration(-2000)
		.attr({ x: function(d) { return d.x + '50'; }, y: function(d) { return d.y; },  
				'text-anchor': 'middle', 'dominant-baseline': 'middle'
		});		
}  