var svgWidth = 960;
var svgHeight = 500;

var margin = {
  top: 20,
  right: 40,
  bottom: 60,
  left: 100
};

var width = svgWidth - margin.left - margin.right;
var height = svgHeight - margin.top - margin.bottom;

// Create an SVG wrapper, append an SVG group that will hold our chart, and shift the latter by left and top margins.
var svg = d3.select(".chart")
  .append("svg")
  .attr("width", svgWidth)
  .attr("height", svgHeight);

var chartGroup = svg.append("g")
  .attr("transform", `translate(${margin.left}, ${margin.top})`);

// Import Data
d3.csv("data.csv", function(err, healthData) {
  if (err) throw err;
  console.log(healthData);
  // Step 1: Parse Data/Cast as numbers
   // ==============================
  healthData.forEach(function(data) {
    data.healthcare = +data.healthcare;
    data.poverty = +data.poverty;
    data.abbr = data.abbr;
  });

  // // Step 2: Create scale functions
  // // ==============================
  var xLinearScale = d3.scaleLinear()
    .domain([0, d3.max(healthData, d => d.poverty)])
    .range([0, width]);

  var yLinearScale = d3.scaleLinear()
    .domain([0, d3.max(healthData, d => d.healthcare)])
    .range([height, 0]);

  // // Step 3: Create axis functions
  // // ==============================
  var bottomAxis = d3.axisBottom(xLinearScale);
  var leftAxis = d3.axisLeft(yLinearScale);

  // // Step 4: Append Axes to the chart
  // // ==============================
  chartGroup.append("g")
    .attr("transform", `translate(0, ${height})`)
    .call(bottomAxis);

  chartGroup.append("g")
    .call(leftAxis);

  //  // Step 5: Create Circles
  // // ==============================
  var circlesGroup = chartGroup.selectAll("circle")
  .data(healthData)
  .enter()
  .append("circle")
  .attr("cx", d => xLinearScale(d.poverty))
  .attr("cy", d => yLinearScale(d.healthcare))
  .attr("r", "17")
  .attr("fill", "white")
  .attr("stroke", "black")
  .attr("opacity", ".75");

  //
  // // Step 6: Initialize tool tip
  // // ==============================
  var toolTip = d3.tip()
    .attr("class", "tooltip")
    .offset([80, -60])
    .html(function(d) {
      var state = d.abbr;
      var poverty = +d.poverty;
      var healthcare = +d.healthcare;
      return (d.state + "<br>Poverty: " + poverty + "%<br>Healthcare: " + healthcare + "%");
    });

  // // Step 7: Create tooltip in the chart
  // // ==============================
  chartGroup.call(toolTip);

  // Step 8: Create event listeners to display and hide the tooltip
  // ==============================
  circlesGroup.on("click", function(data) {
    toolTip.show(data);
  })
    // onmouseout event
    .on("mouseout", function(data, index) {
      toolTip.hide(data);
    });
  //
  // // Create axes labels
  chartGroup.append("text")
    .attr("transform", "rotate(-90)")
    .attr("y", 0 - margin.left + 40)
    .attr("x", 0 - (height / 2))
    .attr("dy", "1em")
    .attr("class", "axisText")
    .attr("font-size","11px")
    .attr("fill","black")
    .text("Healthcare (%)");

  chartGroup.append("text")
    .attr("transform", `translate(${width / 2}, ${height + margin.top + 20})`)
    .attr("text-anchor","middle")
    .attr("font-size","11px")
    .attr("fill","black")
    .text("Poverty (%)");

//TITLE
  chartGroup.append("text")
    .attr("x", (width / 2))
    .attr("y", 0 - (margin.top / 2))
    .attr("text-anchor", "middle")
    .style("font-size", "13px")
    .style("text-decoration", "underline")
    .text("Healthcare vs. Poverty");

  var circles = chartGroup.selectAll("state")
      .data(healthData)
      .enter()

  circles
    .append("circle")
    .attr("class", "state")
    .attr("cx", function(d, index) {
        return xLinearScale(+d.poverty);
        })
    .attr("cy", function(d, index) {
        return yLinearScale(+d.healthcare);
        })
    .attr("r", "20")
    .style("fill","skyblue")
    .style("opacity", .55)
    .style("stroke-width", ".85");

  circles
      .append("text")
      .attr("x", function(d, index) {
          return xLinearScale(+d.poverty- 0.25);
            })
      .attr("y", function(d, index) {
          return yLinearScale(+d.healthcare - 0.2);
            })
      .text(function(d){
          return d.abbr;
            })
      .attr("class", "circleText")
      .on("mouseover", function(d) {
          toolTip.show(d);
            })
      .on("mouseout", function(d, index) {
          toolTip.hide(d);
            });



});
