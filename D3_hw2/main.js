const FWIDTH_bar = 1000,
	FHEIGHT_bar = 400;
const MARGIN_bar = { LEFT: 100, RIGHT: 50, TOP: 50, BOTTOM: 100 };
const WIDTH_bar = FWIDTH_bar - (MARGIN_bar.LEFT + MARGIN_bar.RIGHT);
const HEIGHT_bar = FHEIGHT_bar - (MARGIN_bar.TOP + MARGIN_bar.BOTTOM);
let bar_x = null;
let bar_y = null;
function init_bar(data) {
	const svg = d3
		.select("#chart-area1")
		.append("svg")
		.attr("width", FWIDTH_bar)
		.attr("height", FHEIGHT_bar);

	const g = svg
		.append("g")
		.attr("transform", `translate(${MARGIN_bar.LEFT}, ${MARGIN_bar.TOP})`);

	bar_x = d3
		.scaleLinear()
		.domain([0, d3.max(data, (d) => d.Age)])
		.range([0, WIDTH_bar]);
	g.append("g")
		.attr("transform", `translate(0, ${HEIGHT_bar})`)
		.call(d3.axisBottom(bar_x));

	const histogram = d3
		.histogram()
		.value((d) => d.Age)
		.domain(bar_x.domain())
		.thresholds(bar_x.ticks(100));
	const bins = histogram(data);
	bar_y = d3
		.scaleLinear()
		.domain([0, d3.max(bins, (d) => d.length)])
		.range([HEIGHT_bar, 0]);
	g.append("g").call(d3.axisLeft(bar_y));

	const rectsG = g.append("g").attr("class", "rectsG");

	rectsG
		.selectAll("rect")
		.data(bins)
		.enter()
		.append("rect")
		.attr("x", (d) => bar_x(d.x0))
		.attr("y", HEIGHT_bar)
		.attr("width", (d) => bar_x(d.x1) - bar_x(d.x0))
		.attr("height", 0);

	let brush = d3
		.brushX()
		.extent([
			[0, 0],
			[WIDTH_bar, HEIGHT_bar],
		])
		.on("end", brushed);
	g.append("g").call(brush);
	update_bar(data);

	g.append("text")
		.attr("x", WIDTH_bar / 2)
		.attr("y", 0)
		.attr("text-anchor", "middle")
		.attr("font-size", "30px")
		.text("Age Distribution");
	// X label
	g.append("text")
		.attr("x", WIDTH_bar / 2)
		.attr("y", HEIGHT_bar + 40)
		.attr("font-size", "20px")
		.attr("text-anchor", "middle")
		.text("Age");
	// Y label
	g.append("text")
		.attr("x", -(HEIGHT_bar / 2))
		.attr("y", -40)
		.attr("font-size", "20px")
		.attr("text-anchor", "middle")
		.attr("transform", "rotate(-90)")
		.text("Count");

	const outlineRects = rectsG
		.selectAll(".outline-rect")
		.data(bins)
		.enter()
		.append("rect")
		.attr("class", "outline-rect")
		.attr("x", (d) => bar_x(d.x0))
		.attr("y", (d) => bar_y(d.length))
		.attr("width", (d) => bar_x(d.x1) - bar_x(d.x0))
		.attr("height", (d) => HEIGHT_bar - bar_y(d.length))
		.attr("fill", "none")
		.attr("stroke", "black")
		.attr("stroke-width", "1px");
}

function brushed() {
	let extent = d3.event.selection;
	ageFilter = null;
	if (extent !== null) {
		ageFilter = [(extent[0] / 850) * 100, (extent[1] / 850) * 100];
	}
	updateAllViews();
}

function update_bar(updata) {
	const bar = d3.select("#chart-area1 svg g .rectsG").selectAll("rect");

	const histogram = d3
		.histogram()
		.value((d) => d.Age)
		.domain(bar_x.domain())
		.thresholds(bar_x.ticks(100));
	const bins = histogram(updata);

	bar.data(bins)
		.transition()
		.duration(1000)
		.attr("x", (d) => bar_x(d.x0) )
		.attr("y", (d) => bar_y(d.length))
		.attr("width", (d) => bar_x(d.x1) - bar_x(d.x0))
		.attr("height", (d) => HEIGHT_bar - bar_y(d.length))
		.attr("fill", d=>ageFilter === null ? "#69b3a2" : "orange");
}
