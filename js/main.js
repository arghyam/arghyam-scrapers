// Display the main chart. It's hidden by default.
d3.select('.chart').style('display', 'block');
// Clicking on the home button...
d3.select('#visual').style('display', 'none');
d3.select('#home').on('click', function() {
  d3.event.preventDefault();
  d3.select('#visual').style('display', 'none');
  d3.select('#about').style('display', 'block');
});
// Display the menus
var menu = d3.nest().key(function(d) { return d.menu; }).entries(stories);
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
parentmenu
  .append('ul')
  .classed('dropdown-menu', true)
  .selectAll('li')
      .data(function(d) { return d.values; })
    .enter()
      .append('li')
        .append('a')
        .attr('href', '#')
        .text(function(d) { return d.title; })
        .on('click', draw);
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
var legends = {
  'treemap': 'Each large box represents one State. Click on it to reveal smaller boxes that represent a District.' +
             '<br>Size = <strong>%Size%</strong>.' +
             '<br>Colour = <strong>%Colour%</strong>. Red is low, green is high.' +
             '<br>All figures are in <strong>Rs lakhs</strong>.',
  'stack'  : 'Each row represents one State, showing the break-up of <strong>%Rows%</strong>.' +
             'Click on it to reveal more boxes on the right representing each District.' + '<br> Blue = %Blue%, Red = %Red%, Green = %Green%.',
  'scatter': 'Each circle represents one %Circle%. Hover over it to reveal all districts in the same State. The size of the circle represents %CircleSize%. The x-axis is based on %AxisX%. The y-axis is based on %AxisY%. The colour is based on the State. (Each district in a given state has the same colour).'
};
// Returns the name of the data file for the currently selected date.
function datafile() {
  var file = d3.select('#datafiles').property('value');
  d3.select('#data').attr('href', file);
  return file;
}
// When the URL hash changes, draw the appropriate story.
function hashchange(e) {
  var hash = decodeURIComponent(window.location.hash.replace(/^#/, '')).split('|');
  for (var i=0, l=stories.length; i<l; i++) {
    var story = stories[i];
    if ((story.menu == hash[0]) && (story.title == hash[1])) {
      return draw(story);
    }
  }
  d3.select('#about').style('display', 'block');
  d3.select('#visual').style('display', 'none');
}
window.addEventListener('hashchange', hashchange);
hashchange();
// Allow download of SVG
d3.select('#downloadsvg').on('click', function() {
  d3.event.preventDefault();
  svgcrowbar();
});
// When any menu option is clicked, draw it.
function draw(story) {
  if (d3.event) {
    d3.event.preventDefault();
  }
  d3.selectAll('.tooltip').remove();
  d3.select('#about').style('display', 'none');
  d3.select('#visual').style('display', 'block');
  d3.selectAll('text').remove();
	d3.selectAll('rect').remove('text');
  // Remove treemap gradient container 
  d3.select('#gradient_cont').style('display', 'none');
  // Remove scatterplot info container
  d3.select('#right_container').style('display','none');
  // Set the title and story
  d3.select('#menu').text(story.menu);
  d3.select('#title').text(story.title);
  d3.select('#subtitle').text(story.subtitle);
  d3.select('#story').text(story.story);
  d3.selectAll('#legend p').remove();
  d3.select('#legend').append('p').html(legends[story.type].replace(/%\w+%/g, function(all){ return story.legend[all] || all; }));
  d3.selectAll('#columns text').remove();
  d3.select('#columns').text(story.cols.join(", "));
  d3.selectAll('#source a').remove();
  d3.select('#source').selectAll('a')
      .data(story.url)
    .enter()
      .append('a')
      .attr('target', '_blank')
      .attr('href', String)
      .text(String);
  window.location.hash = encodeURIComponent(story.menu + '|' + story.title);
  window['draw_' + story.type](story);
}
function draw_date(daterow, story) {
    var dates = _.uniq(_.map(story.cols, function(col) { return daterow[col]; }));
    d3.select('#date').text(dates.join(', '));
}
function draw_treemap(story) {
  // Add gradient legend for treemap
  d3.select('#gradient_cont').style('display', 'block');
  // Creates gradient legend for treemap
  var gradient = d3.select('#gradient');
  gradient.append('rect').attr('x', 0).attr('y', 0)
    .attr('width', 958).attr('height', 30)
    .attr('fill', 'url(#gradient_legend)');
  gradient.selectAll('text')
    .data([5, 37, 70, 95]) // gradient percentage from svg defs
   .enter().append('text')
    .attr('x', function(d){ return d + '%';})
    .attr('y', 20)
    .data([0, 50, 100, 200]) // color domain
    .text(function(d){ return d + '%'; })
    .style('fill', function(d, i){ return i == 1 ? 'black' : 'white';});
  // Filter the data
  d3.csv(datafile(), function(data) {
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
		node.enter().append('text')
      .call(position)
      .attr('dx', function(d){ return d.dx / 2; })
      .attr('dy', function(d){ return d.dy / 2; })
      .attr('text-anchor', 'middle')
	    .attr('dominant-baseline', 'middle')
      .style('pointer-events', 'none')
      .text(function(d){ return d.dx > 80 && d.key != 'India' ? d.key : '' ; })
      .style('font-size', function(d){ return d.dx / 11 + 'px'; });
    // Set up the legend
    var legend = d3.select('.legend.treemap');
    legend.selectAll('*').remove();
    var select = legend.append('select').attr('class', 'states');
    var subselect = legend.append('select').attr('class', 'districts');
    var groups = _.uniq(_.pluck(data, story.group[0]));
    groups.unshift('');
		groups.pop();
    select.selectAll('option')
        .data(groups)
      .enter()
        .append('option')
        .text(String);
    select.on('change', function() {
      var group = d3.select(this).property('value');
      svg.selectAll('rect').classed('mark', false);
      svg.selectAll('rect[data-q="' + group + '"]').classed('mark', true);
      var result = _.filter(data, function(d){ return d.State_Name == group && !d.District_Name.match(/^Total/); });
      result.unshift('');
      subselect.selectAll('option').remove();
      subselect.selectAll('option')
          .data(result)
        .enter()
          .append('option')
          .text(function(d){ return d.District_Name; });
    });
    subselect.on('change', function() {
      var subgroup = d3.select(this).property('value');
      svg.selectAll('rect').classed('mark', false);
      svg.selectAll('rect[data-q="' + subgroup + '"]').classed('mark', true);
    });
  });
}
var tempGroup = '', tempSubgroup = '', tempResult = [];
function draw_scatter(story) {
  var beyond = [];
  // Add scatterplot info container
  d3.select('#right_container').style('display','block');
  // Filter the data
  d3.csv(datafile(), function(data) {
    var subset = initchart(story, data);
    draw_date(data[data.length-1], story);
    // TODO: Make these move
    svg.selectAll('*').remove();
    var width = parseInt(svg.style('width'), 10);
    var height = svg.attr('height');
    var node = svg.selectAll('circle');    
    var rmax = _.max(_.map(subset, story.area[1]));
    // Set up the legend
    var legend = d3.select('.legend.scatter');
    legend.selectAll('*').remove();
    var select = legend.append('select').attr('class', 'states');
    var subselect = legend.append('select').attr('class', 'districts');
    var groups = _.uniq(_.pluck(data, story.group[0]));
    groups.unshift('');
		groups.pop();
    select.selectAll('option')
        .data(groups)
      .enter()
        .append('option')
        .text(String);
    select.on('change', function() {
      d3.selectAll('.tooltip').remove();
      var group = d3.select(this).property('value');
      if (group) {
        svg.selectAll('circle').classed('fade', true);
        svg.selectAll('circle[data-q="' + group + '"]')
          .classed('fade', false)
          .classed('show', true);
      } else {
		draw_scatter(story);
        svg.selectAll('circle.fade').classed('fade', false);
        svg.selectAll('circle.mark').classed('mark', false);
      }
	  tempGroup = group;
      var result = _.filter(data, function(d){ return d.State_Name == group && !d.District_Name.match(/^Total/); });
      result.unshift('');
      subselect.selectAll('option').remove();
      subselect.selectAll('option')
          .data(result)
        .enter()
          .append('option')
          .text(function(d){ return d.District_Name; });
    });
    subselect.on('change', function() {
      var subgroup = d3.select(this).property('value');
      svg.selectAll('circle').classed('mark', false);
      var group = d3.selectAll('.states').property('value');
      var result = _.filter(data, function(d){ return d.State_Name == group && !d.District_Name.match(/^Total/); });
	  tempSubgroup = subgroup;
	  svg.selectAll('circle[data-q="' + group + '"]')
        .data(result)
        .classed('mark', function(d){
          return d.District_Name == subgroup ? true : false; });
      d3.selectAll('.tooltip').remove();
      $('.mark').tooltip({ title:function(){ return $('.mark title').text(); }, trigger:'focus', container:'body' }).tooltip('show');
    });
    var R = story.R;
    var xscale = d3.scale.linear().domain(story.xdom).range([R, width - R]);
    var yscale = d3.scale.linear().domain(story.ydom).range([height - R, R]);
	var tempResult = _.filter(data, function(d){ return d.State_Name == tempGroup && !d.District_Name.match(/^Total/); });
	if(tempGroup){
      svg.select('circle').classed('mark', true);
	  tempData = tempResult;	
	  $('.states').val(tempGroup);
      subselect.selectAll('option')
        .data(tempResult)
       .enter()
        .append('option')
        .text(function(d){ return d.District_Name; });
		$('.districts').val(tempSubgroup); 
    }else { tempData = subset; };
	node.data(tempData)
	 .enter().append('circle')
      .attr('cx', function(d) { return xscale(story.cx(d)); })
      .attr('cy', function(d) { return yscale(story.cy(d)); })
      .attr('r', function(d) { return R * story.area[1](d) / rmax; })
      .attr('fill', story.color)
      .attr('stroke', '#aaf')
      .attr('data-q', function(d) { return d[story.group[0]]; })
      .on('mouseover', function() {
        var q = d3.select(this).attr('data-q');
        svg.selectAll('.show').classed('show', false);
        svg.selectAll('circle[data-q="' + q + '"]').classed('show', true);
				var details = d3.select(this).text(); 
				$('#copy_title').val(details).select();	
      })
      .on('mouseout', function() {
        svg.selectAll('.show').classed('show', false);
      })
      .on('click', function() {
        // Set the main selection to blank if anything is faded; else set to selected circle
        var val = svg.selectAll('.fade')[0].length ? '' : d3.select(this).attr('data-q');
        select.property('value', val).on('change').call(select.node());
      })
      .append('title')
      .text(story.hover);	  
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
	// Filter subgroups having values greater than 150%  
	var beyond = _.filter(subset, function(d){ return story.cy(d) > story.ydom[1] ? d : '' ;});  
    // Sorted the values in descending order
    beyond.sort(function(a, b){ return story.cy(b) - story.cy(a); });
    // Remove the content - details of the bubbles out of the bound
    d3.selectAll('#details table').remove();
    d3.select('#header').text('Districts above ' + story.ydom[1] * 100 + '%');
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
function draw_stack(story) {
  d3.csv(datafile(), function(data) {
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
    var ypad = 1;
    function showstack(cls, data, x0, H, W) {
      svg.selectAll('g.' + cls).remove();
      var update = svg.selectAll('g.' + cls)
          .data(data);
      var enter = update.enter()
          .append('g')
          .classed(cls, true)
          .attr('data-q', function(d) { return d.key; })
          .attr('transform', function(d, i) { return 'translate(0, ' + (H + i * H) + ')'; });
      enter.append('text')
          .text(function(d) { return d.key; })
          .attr('x', x0 - 10)
          .attr('y', H/2)
          .attr('text-anchor', 'end')
          .attr('dominant-baseline', 'middle')
          .attr('font-size', H * 0.75);
      // For each state
      var rows = enter.selectAll('g.row')
          // Create an array of arrays of [row, row, row], where row = [cell, cell, cell]
          .data(function(d, i) { return story.stack.map(function(fn) { return fn(d.values); }); })
        .enter()
          // Each row is a g.row
          .append('g')
          .classed('row', true)
          // Vertically position each row
          .attr('transform', function(d, i) { return 'translate(0,' + i * (H - ypad*3)/story.stack.length + ')'; })
          .attr('data-row', function(d, i) { return story.rows[i]; });
      // Within each row, draw the cells
      rows.selectAll('rect')
          .data(function(d) { return d; })
        .enter()
          .append('rect')
          .attr('x', function(d) { return x0 + W * d[0]; })
          .attr('width', function(d) { return W * d[1]; })
          .attr('height', (H - ypad*3)/story.stack.length - ypad)
          .attr('fill', function(d, i) { return story.colors[i]; })
          .append('title')
            .text(function(d, i) {
              var g = this.parentNode.parentNode;
              return d3.select(g).attr('data-row') + ' ' + story.hover(d, i);
            });
      return update;
    }
    var v0 = showstack('v0', nodes.entries(subset), 150, 16, 200);
    v0.on('click', function() {
      svg.selectAll('.mark').classed('mark', false);
      var filter = d3.select(this)
        .classed('mark', true)
        .attr('data-q');
      var subdata = _.filter(subset, function(d) { return d[story.group[0]] == filter; });
      showstack('v1', leaves.entries(subdata), 550, 12, 200);
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
function position() {
  this.transition()
    .duration(400)
    .attr('x', function(d) { return d.x; })
    .attr('y', function(d) { return d.y; })
    .attr('width', function(d) { return d.dx; })
    .attr('height', function(d) { return d.dy; })
    .attr('class', function(d) { return "l" + d.depth; })
    .attr('data-q', function(d) { return d.depth == 1 ? d.key : d.District_Name; });
}