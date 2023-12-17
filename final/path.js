const FWIDTH_path = 700,
	FHEIGHT_path = 500;
const FWIDTH_SHIFT_path = 0,
	FHEIGHT_SHIFT_path = FHEIGHT_title;
const MARGIN_path = { LEFT: 100, RIGHT: 50, TOP: 80, BOTTOM: 100 };
const WIDTH_path = FWIDTH_path - (MARGIN_path.LEFT + MARGIN_path.RIGHT);
const HEIGHT_path = FHEIGHT_path - (MARGIN_path.TOP + MARGIN_path.BOTTOM);

let path_xScale = null;
let path_yScale = null;

function init_path(data) {
	const svg = d3
		.select("#chart-area1")
		.style("position", "absolute")
		.style("top", FHEIGHT_SHIFT_path + "px")
		.style("left", FWIDTH_SHIFT_path + "px")
		.append("svg")
		.attr("width", FWIDTH_path)
		.attr("height", FHEIGHT_path)
		.on("click", (d) => {
			if (d3.event.target.tagName === "svg") {
				path_Filter = null;
				updateAllViews();
			}
		});

	const g = svg
		.append("g")
		.attr("transform", `translate(${MARGIN_path.LEFT}, ${MARGIN_path.TOP})`);

	const pathCounts = {
		preservation: 0,
		hunt: 0,
		erudition: 0,
		nihility: 0,
		destruction: 0,
		harmony: 0,
		abundance: 0,
	};
	data.forEach(function (d) {
		pathCounts[d.path] = (pathCounts[d.path] || 0) + 1;
	});

	let pathData = Object.keys(pathCounts).map(function (path) {
		return { path: path, count: pathCounts[path] };
	});

	path_xScale = d3
		.scaleBand()
		.domain(pathData.map((d) => d.path))
		.range([0, WIDTH_path])
		.padding(0.3);

	path_yScale = d3
		.scaleLinear()
		.domain([0, d3.max(pathData, (d) => d.count)])
		.range([HEIGHT_path, 0]);

	// Create bars
	const rects_frame = g
		.append("g")
		.selectAll("rect")
		.data(pathData)
		.enter()
		.append("rect")
		.attr("x", (d) => path_xScale(d.path))
		.attr("y", HEIGHT_path)
		.attr("width", path_xScale.bandwidth())
		.attr("height", 0)
		.attr("fill", "black")
        .attr("stroke", text_color)
		.attr("stroke-width", "2px")
		.on("click", (d) => {
			if (path_Filter === d.path) {
				path_Filter = null;
			} else {
				path_Filter = d.path;
			}
			updateAllViews();
		});

	rects_frame
		.transition()
		.duration(1000)
		.attr("y", (d) => path_yScale(d.count))
		.attr("height", (d) => HEIGHT_path - path_yScale(d.count));

	const rectsG = g
		.append("g")
		.attr("class", "rectsG")
		.selectAll("rect")
		.data(pathData)
		.enter()
		.append("rect")
		.attr("x", (d) => path_xScale(d.path))
		.attr("y", HEIGHT_path)
		.attr("width", path_xScale.bandwidth())
		.attr("height", 0)
		.attr("fill", path_color);

	rectsG.on("click", (d) => {
		if (path_Filter === d.path) {
			path_Filter = null;
		} else {
			path_Filter = d.path;
		}
		updateAllViews();
	});


	const Pathimages = g.selectAll('.bar-image')
	.data(pathData)
	.enter()
	.append('image')
	.attr('class', 'bar-image')
	.attr('xlink:href', (d) => getImagePath(d.path)) 
	.attr('x', (d) => path_xScale(d.path)) 
	.attr('y', HEIGHT_path) 
	.attr('width',path_xScale.bandwidth()) 
	.attr('height', path_xScale.bandwidth()); 


	Pathimages.transition()
	.duration(1000)
	.attr('y', (d) => path_yScale(d.count) - 20) 
	.attr('height',  path_xScale.bandwidth()); 


	update_path(data);
	// Add x-axis
	g.append("g")
		.attr("transform", `translate(0, ${HEIGHT_path})`)
		.call(d3.axisBottom(path_xScale))
		.attr("font-size", "15px");

	// Add y-axis
	g.append("g")
		.call(d3.axisLeft(path_yScale).ticks(5).tickFormat(d3.format("d")))
		.attr("font-size", "15px");

	g.append("text")
		.attr("x", WIDTH_path / 2)
		.attr("y", -30)
		.attr("text-anchor", "middle")
		.attr("font-size", "30px")
		.style("fill", text_color)
		.text("Path");

	// X label
	// g.append("text")
	// 	.attr("x", WIDTH_path / 2)
	// 	.attr("y", HEIGHT_path + 60)
	// 	.attr("font-size", "20px")
	// 	.attr("text-anchor", "middle")
	// 	.text("path");

	// Y label
	g.append("text")
		.attr("x", -(HEIGHT_path / 2))
		.attr("y", -40)
		.attr("font-size", "20px")
		.attr("text-anchor", "middle")
		.attr("transform", "rotate(-90)")
		.style("fill", text_color)
		.text("Count");
}

function update_path(updata) {
	const bar = d3.select("#chart-area1 svg g .rectsG").selectAll("rect");

	const pathCounts = {
		preservation: 0,
		hunt: 0,
		erudition: 0,
		nihility: 0,
		destruction: 0,
		harmony: 0,
		abundance: 0,
	};
	updata.forEach(function (d) {
		pathCounts[d.path] = (pathCounts[d.path] || 0) + 1;
	});

	let pathData = Object.keys(pathCounts).map(function (path) {
		return { path: path, count: pathCounts[path] };
	});

	bar.data(pathData)
		.transition()
		.duration(1000)
		.attr("x", (d) => path_xScale(d.path))
		.attr("y", (d) => path_yScale(d.count))
		.attr("width", path_xScale.bandwidth())
		.attr("height", (d) => HEIGHT_path - path_yScale(d.count))
		.attr("fill", path_color)
		.attr("stroke", (d) => (path_Filter === null ? "none" : path_sel_color))
		.attr("stroke-width", "3px");
		
	const Pathimages = d3.select("#chart-area1 svg g ").selectAll(".bar-image");
	Pathimages.data(pathData)
		.transition()
		.duration(1000)
		.attr('class', 'bar-image')
		.attr('xlink:href', (d) => getImagePath(d.path)) 
		.attr('x', (d) => path_xScale(d.path)+5) 
		.attr('y', (d) => (d.count === 0 ?  path_yScale(d.count) + 25 : path_yScale(d.count))) 
		.attr('width',40) 
		.attr('height', 40); 

	// bar.enter()
	// 	.append('image')
	// 	.attr('class', 'bar-image')
	// 	.attr('xlink:href', (d) => getImagePath(d.path)) 
	// 	.attr('x', (d) => path_xScale(d.path)) // Adjust x-position as needed
	// 	.attr('y', HEIGHT_path) // Adjust y-position as needed
	// 	.attr('width',40) // Adjust width as needed
	// 	.attr('height', 40); // Adjust height as needed
	  
}

function getImagePath(path) {
	switch (path) {
	  case 'preservation':
		return 'Pth/Preservation.png'; 
	  case 'hunt':
		return 'Pth/Hunt.png'; 
	  case 'erudition':
		return 'Pth/Erudition.png'; 
	  case 'nihility':
			return 'Pth/Nihility.png'; 
	  case 'destruction':
		return 'Pth/Destruction.png'; 
	  case 'harmony':
		return 'Pth/Harmony.png'; 
	  case 'abundance':
		return 'Pth/Abundance.png'; 
	}
  }