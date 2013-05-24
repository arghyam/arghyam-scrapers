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
  'stack'  : 'Each row represents one State. Click on it to reveal more boxes on the right representing each District. Blue = %Blue%, Red = %Red%, Green = %Green%.',
  'scatter': 'Each circle represents one %Circle%. Hover over it to reveal all districts in the same State. The size of the circle represents %CircleSize%. The x-axis is based on %AxisX%. The y-axis is based on %AxisY%. The colour is based on the State. (Each district in a given state has the same colour).'
};

// When the URL hash changes, draw the appropriate story.
function hashchange(e) {
  var hash = window.location.hash.replace(/^#/, '').replace(/_/g, ' ').split('|');
  for (var i=0, l=stories.length; i<l; i++) {
    var story = stories[i];
    if ((story.menu == hash[0]) && (story.title == hash[1])) {
      return draw(story);
    }
  }
  d3.select('#about').style('display', 'block');
  d3.select('#visual').style('display', 'none');
};
window.addEventListener('hashchange', hashchange);
hashchange();

// When any menu option is clicked, draw it.
function draw(story) {
  if (d3.event) {
    d3.event.preventDefault();
  }

  d3.selectAll('.tooltip').remove();
  d3.select('#about').style('display', 'none');
  d3.select('#visual').style('display', 'block');

  // Set the title and story
  d3.select('#menu').text(story.menu);
  d3.select('#title').text(story.title);
  d3.select('#story').text(story.story);
  d3.selectAll('#legend p').remove();
  d3.select('#legend').append('p').html(legends[story.type].replace(/%\w+%/g, function(all){ return story.legend[all] || all; }));
  d3.select('#source').attr('href', story.url).text(story.url);

  window.location.hash = (story.menu + '|' + story.title).replace(/ /g, '_');
  window['draw_' + story.type](story);
}

function draw_date(daterow, story) {
    var dates = _.uniq(_.map(story.cols, function(col) { return daterow[col]; }));
    d3.select('#date').text(dates.join(', '));
}

function draw_treemap(story) {
  // Filter the data
  d3.csv(story.file, function(data) {
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
      .append('title')
        .text(story.hover);
    node.exit().remove();

    // Set up the legend
    var legend = d3.select('.legend.treemap');
    legend.selectAll('*').remove();
    var select = legend.append('select').attr('class', 'states');
    var subselect = legend.append('select').attr('class', 'districts');
    var groups = _.uniq(_.pluck(data, story.group[0]));
    groups.unshift('');
    select.selectAll('option')
        .data(groups)
      .enter()
        .append('option')
        .text(function(d) { return d; });
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


function draw_scatter(story) {
  // Filter the data
  d3.csv(story.file, function(data) {
    var subset = initchart(story, data);
    draw_date(data[data.length-1], story);

    // TODO: Make these move
    svg.selectAll('*').remove();

    var width = parseInt(svg.style('width'), 10);
    var height = svg.attr('height');
    var node = svg.selectAll('circle')
      .data(subset);
    var rmax = _.max(_.map(subset, story.area[1]));

    // Set up the legend
    var legend = d3.select('.legend.scatter');
    legend.selectAll('*').remove();
    var select = legend.append('select').attr('class', 'states');
    var subselect = legend.append('select').attr('class', 'districts');
    var groups = _.uniq(_.pluck(data, story.group[0]));
    groups.unshift('');
    select.selectAll('option')
        .data(groups)
      .enter()
        .append('option')
        .text(function(d) { return d; });
    select.on('change', function() {
      d3.selectAll('.tooltip').remove();
      var group = d3.select(this).property('value');
      if (group) {
        svg.selectAll('circle').classed('fade', true);
        svg.selectAll('circle[data-q="' + group + '"]')
          .classed('fade', false)
          .classed('show', true);
      } else {
        svg.selectAll('circle.fade').classed('fade', false);
        svg.selectAll('circle.mark').classed('mark', false);
      }
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
    node.enter().append('circle')
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
  });
}


function draw_stack(story) {
  d3.csv(story.file, function(data) {
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

      enter.selectAll('rect')
          .data(function(d, i) { return story.stack(d.values); })
        .enter()
          .append('rect')
          .attr('x', function(d) { return x0 + W * d[0]; })
          .attr('width', function(d) { return W * d[1]; })
          .attr('y', ypad)
          .attr('height', H - ypad*2)
          .attr('fill', function(d, i) { return story.colors[i]; })
          .append('title')
            .text(story.hover);

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
    .attr('stroke', '#fff')
    .attr('class', function(d) { return "l" + d.depth; })
    .attr('data-q', function(d) { return d.depth == 1 ? d.key : d.District_Name; });
}
