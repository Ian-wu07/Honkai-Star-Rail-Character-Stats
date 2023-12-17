const FWIDTH_combat = 800,
	FHEIGHT_combat = 600;
const FWIDTH_SHIFT_combat = 20 + FWIDTH_path,
	FHEIGHT_SHIFT_combat = FHEIGHT_title;
const MARGIN_combat = { LEFT: 100, RIGHT: 50, TOP: 80, BOTTOM: 100 };
const WIDTH_combat = FWIDTH_combat - (MARGIN_combat.LEFT + MARGIN_combat.RIGHT);
const HEIGHT_combat = FHEIGHT_combat - (MARGIN_combat.TOP + MARGIN_combat.BOTTOM);

let combat_xScale = null;
let combat_yScale = null;

function init_combat_type(data) {
	const svg = d3
		.select("#chart-area2")
		.style("position", "absolute")
		.style("top", FHEIGHT_SHIFT_combat + "px")
		.style("left", FWIDTH_SHIFT_combat + "px")
		.append("svg")
		.attr("width", FWIDTH_combat)
		.attr("height", FHEIGHT_combat)
		.on("click", (d) => {
			if (d3.event.target.tagName === "svg") {
				combat_Filter = null;
				updateAllViews();
			}
		});

	const g = svg
		.append("g")
		.attr("transform", `translate(${MARGIN_combat.LEFT}, ${MARGIN_combat.TOP})`);

	const combat_Counts = {
		ice: 0,
		wind: 0,
		fire: 0,
		imaginary: 0,
		lightning: 0,
		quantum: 0,
		lightning: 0,
	};

	data.forEach(function (d) {
		combat_Counts[d.combat_type] = (combat_Counts[d.combat_type] || 0) + 1;
	});

	let combat_Data = Object.keys(combat_Counts).map(function (combat_type) {
		return {
			combat_type: combat_type,
			count: combat_Counts[combat_type],
		};
	});

	combat_xScale = d3
		.scaleBand()
		.domain(combat_Data.map((d) => d.combat_type))
		.range([0, WIDTH_combat])
		.padding(0.3);

	combat_yScale = d3
		.scaleLinear()
		.domain([0, d3.max(combat_Data, (d) => d.count)])
		.range([HEIGHT_combat, 0]);

	// Create bars
	const rects_frame = g
		.append("g")
		.selectAll("rect")
		.data(combat_Data)
		.enter()
		.append("rect")
		.attr("x", (d) => combat_xScale(d.combat_type))
		.attr("y", HEIGHT_combat)
		.attr("width", combat_xScale.bandwidth())
		.attr("height", 0)
		.attr("fill", "black")
		.attr("stroke", text_color)
		.attr("stroke-width", "2px")
		.on("click", (d) => {
			if (combat_Filter === d.combat_type) {
				combat_Filter = null;
			} else {
				combat_Filter = d.combat_type;
			}
			updateAllViews();
		});

	rects_frame
		.transition()
		.duration(1000)
		.attr("y", (d) => combat_yScale(d.count))
		.attr("height", (d) => HEIGHT_combat - combat_yScale(d.count));

	const rectsG = g
		.append("g")
		.attr("class", "rectsG")
		.selectAll("rect")
		.data(combat_Data)
		.enter()
		.append("rect")
		.attr("x", (d) => combat_xScale(d.combat_type))
		.attr("y", HEIGHT_combat)
		.attr("width", combat_xScale.bandwidth())
		.attr("height", 0)
		.attr("fill", (d) => combat_colorScale(d.combat_type));

	rectsG.on("click", (d) => {
		if (combat_Filter === d.combat_type) {
			combat_Filter = null;
		} else {
			combat_Filter = d.combat_type;
		}
		updateAllViews();
	});

	const Combatimages = g
		.selectAll(".cmb-image")
		.data(combat_Data)
		.enter()
		.append("image")
		.attr("class", "cmb-image")
		.attr("xlink:href", (d) => getImageCombat(d.combat_type))
		.attr("x", (d) => combat_xScale(d.combat_type))
		.attr("y", HEIGHT_combat)
		.attr("width", combat_xScale.bandwidth())
		.attr("height", combat_xScale.bandwidth());

	Combatimages.transition()
		.duration(1000)
		.attr("y", (d) => combat_yScale(d.count) - 20)
		.attr("height", combat_xScale.bandwidth());

	update_combat(data);

	// Add x-axis
	g.append("g")
		.attr("transform", `translate(0, ${HEIGHT_combat})`)
		.call(d3.axisBottom(combat_xScale))
		.attr("font-size", "15px");

	// Add y-axis
	g.append("g")
		.call(d3.axisLeft(combat_yScale).ticks(5).tickFormat(d3.format("d")))
		.attr("font-size", "15px");

	g.append("text")
		.attr("x", WIDTH_combat / 2)
		.attr("y", -50)
		.attr("text-anchor", "middle")
		.attr("font-size", "30px")
		.style("fill", text_color)
		.text("Combat Type");

	// X label
	// g.append("text")
	// 	.attr("x", WIDTH_combat / 2)
	// 	.attr("y", HEIGHT_combat + 60)
	// 	.attr("font-size", "20px")
	// 	.attr("text-anchor", "middle")
	// 	.text("combat_type");

	// Y label
	g.append("text")
		.attr("x", -(HEIGHT_combat / 2))
		.attr("y", -40)
		.attr("font-size", "20px")
		.attr("text-anchor", "middle")
		.attr("transform", "rotate(-90)")
		.style("fill", text_color)
		.text("Count");
}

function update_combat(updata) {
	const bar = d3.select("#chart-area2 svg g .rectsG").selectAll("rect");

	const combat_Counts = {
		ice: 0,
		wind: 0,
		fire: 0,
		imaginary: 0,
		lightning: 0,
		quantum: 0,
		physical: 0,
	};

	updata.forEach(function (d) {
		combat_Counts[d.combat_type] = (combat_Counts[d.combat_type] || 0) + 1;
	});

	let combat_Data = Object.keys(combat_Counts).map(function (combat_type) {
		return {
			combat_type: combat_type,
			count: combat_Counts[combat_type],
		};
	});

	bar.data(combat_Data)
		.transition()
		.duration(1000)
		.attr("x", (d) => combat_xScale(d.combat_type))
		.attr("y", (d) => combat_yScale(d.count))
		.attr("width", combat_xScale.bandwidth())
		.attr("height", (d) => HEIGHT_combat - combat_yScale(d.count))
		.attr("fill", (d) => combat_colorScale(d.combat_type))
		.attr("stroke", (d) => (combat_Filter === null ? "none" : combat_sel_color))
		.attr("stroke-width", "3px");

	const Combatimages = d3.select("#chart-area2 svg g ").selectAll(".cmb-image");
	Combatimages.data(combat_Data)
		.transition()
		.duration(1000)
		.attr("class", "cmb-image")
		.attr("xlink:href", (d) => getImageCombat(d.combat_type))
		.attr("x", (d) => combat_xScale(d.combat_type) + combat_xScale.bandwidth() / 2 - 20)
		.attr("y", (d) =>
			d.count === 0 ? combat_yScale(d.count) + 25 : combat_yScale(d.count) - 41
		)
		.attr("width", 40)
		.attr("height", 40);
}

function getImageCombat(type) {
	switch (type) {
		case "ice":
			return "Cmb/Ice.png";
		case "wind":
			return "Cmb/Wind.png";
		case "fire":
			return "Cmb/Fire.png";
		case "imaginary":
			return "Cmb/Imaginary.png";
		case "lightning":
			return "Cmb/Lightning.png";
		case "quantum":
			return "Cmb/Quantum.png";
		case "physical":
			return "Cmb/Physical.png";
	}
}
