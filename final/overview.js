const FWIDTH_overview = 800,
	FHEIGHT_overview = 800;
const FWIDTH_SHIFT_overview = 0,
	FHEIGHT_SHIFT_overview = 20 + FHEIGHT_path + FHEIGHT_SHIFT_path;
const MARGIN_overview = { LEFT: 100, RIGHT: 100, TOP: 150, BOTTOM: 100 };
const WIDTH_overview = FWIDTH_overview - (MARGIN_overview.LEFT + MARGIN_overview.RIGHT);
const HEIGHT_overview = FHEIGHT_overview - (MARGIN_overview.TOP + MARGIN_overview.BOTTOM);

const overview_colorScale = d3.scaleOrdinal().domain(["4", "5"]).range(["#df55ff", "#f2d35a"]);
const axis_shift = 50;
let x_Option = 'HP';
let y_Option = 'ATK';

function init_overview(data) {
	const svg = d3
		.select("#chart-area3")
		.style("position", "absolute")
		.style("top", FHEIGHT_SHIFT_overview + "px")
		.style("left", FWIDTH_SHIFT_overview + "px")
		.append("svg")
		.attr("width", FWIDTH_overview)
		.attr("height", FHEIGHT_overview);

	const g = svg
		.append("g")
		.attr("transform", `translate(${MARGIN_overview.LEFT}, ${MARGIN_overview.TOP})`);

	const x = d3
		.scaleLinear()
		.domain([
			d3.min(data, (d) => d.hp_80) - axis_shift,
			d3.max(data, (d) => d.hp_80) + axis_shift,
		])
		.range([0, WIDTH_overview]);

	g.append("g")
		.attr("class", "x_axis")
		.attr("transform", `translate(0, ${HEIGHT_overview})`)
		.call(d3.axisBottom(x))
		.attr("font-size", "15px");

	const y = d3
		.scaleLinear()
		.domain([
			d3.min(data, (d) => d.atk_80) - axis_shift * 0.4,
			d3.max(data, (d) => d.atk_80) + axis_shift * 0.4,
		])
		.range([HEIGHT_overview, 0]);

	g.append("g").attr("class", "y_axis").call(d3.axisLeft(y)).attr("font-size", "15px");

	g.append("g")
		.attr("class", "dot")
		.selectAll("dot")
		.data(data)
		.enter()
		.append("circle")
		.attr("cx", function (d) {
			return x(d.hp_80);
		})
		.attr("cy", function (d) {
			return y(d.atk_80);
		})
		.attr("r", 8)
		.style("opacity", 0.0)
		.style("fill", (d) => overview_colorScale(d.rarity));

	update_overview(data);
	//legend
	const legendRectSize = 20;
	const legendSpacing = 10;
	const legendData = d3.range(4, 6);
	const legend = g
		.append("g")
		.attr("class", "legend")
		.attr("transform", `translate(${WIDTH_overview + 10}, 0)`);

	legend.append("text").style("font-size", "20px").text("rarity");

	const legendItems = legend
		.selectAll("legend-item")
		.data(legendData)
		.enter()
		.append("g")
		.attr("class", "legend-item")
		.attr("transform", (d, i) => `translate(0, ${20 + i * (legendRectSize + legendSpacing)})`); // 调整每个图例项的垂直位置

	legendItems
		.append("rect")
		.attr("width", legendRectSize)
		.attr("height", legendRectSize)
		.style("fill", (d) => overview_colorScale(String(d)));

	legendItems
		.append("text")
		.attr("x", legendRectSize + 15)
		.attr("y", legendRectSize / 2 + 5)
		.text((d) => d)
		.attr("font-size", "20px");
	//title
	g.append("text")
		.attr("x", WIDTH_overview / 2)
		.attr("y", -30)
		.attr("text-anchor", "middle")
		.style("font-size", "30px")
		.text("HP-ATK");
	// X label
	g.append("text")
		.attr("x", WIDTH_overview / 2)
		.attr("y", HEIGHT_overview + 40)
		.attr("font-size", "20px")
		.attr("text-anchor", "middle")
		.text("HP");
	// Y label
	g.append("text")
		.attr("x", -(HEIGHT_overview / 2))
		.attr("y", -40)
		.attr("font-size", "20px")
		.attr("text-anchor", "middle")
		.attr("transform", "rotate(-90)")
		.text("ATK");

    //BUTTON-----------------------------------------------------------------
	{
	const allGroup = ["ATK", "HP", "DEF"];

	const x_button_label = d3
		.select("#chart-area3")
		.append("label")
		.style("position", "absolute")
		.style("top", 25 + "px")
		.style("left", MARGIN_overview.LEFT + "px")
		.style("font-size", "30px")
		.text("x axis:");

	const x_button = d3
		.select("#chart-area3")
		.append("select")
		.style("position", "absolute")
		.style("top", 20 + "px")
		.style(
			"left",
			MARGIN_overview.LEFT + 20 + x_button_label.node().getBoundingClientRect().width + "px"
		)
		.style("height", "50px")
		.style("width", "100px")
		.style("font-size", "25px")
		.on("change", (d) => {
			x_Option = d3.select(this).property("value");
            console.log(x_Option,d3.select(this))
			updateAllViews();
		});

	x_button // Add a button
		.selectAll("myOptions")
		.data(allGroup)
		.enter()
		.append("option")
		.text((d) => d)
		.attr("value", (d) => d);

	const y_button_label = d3
		.select("#chart-area3")
		.append("label")
		.style("position", "absolute")
		.style("top", 25 + "px")
		.style("left", MARGIN_overview.LEFT + 300 + "px")
		.style("font-size", "30px")
		.text("y axis:");

	const y_button = d3
		.select("#chart-area3")
		.append("select")
		.style("position", "absolute")
		.style("top", 20 + "px")
		.style(
			"left",
			MARGIN_overview.LEFT +
				20 +
				300 +
				y_button_label.node().getBoundingClientRect().width +
				"px"
		)
		.style("height", "50px")
		.style("width", "100px")
		.style("font-size", "25px")
		.on("change", (d) => {
			y_Option = d3.select(this).property("value");
			updateAllViews();
		});

	y_button // Add a button
		.selectAll("myOptions")
		.data(allGroup)
		.enter()
		.append("option")
		.text((d) => d)
		.attr("value", (d) => d);
    }
}

function update_overview(updata) {
	const scatter_chart = d3.select("#chart-area3 svg g");


    // const x_feature=x_Option.toLowerCase()
    // const y_feature=y_Option.toLowerCase()
	const x = d3
		.scaleLinear()
		.domain([
			d3.min(updata, (d) => d.hp_80 - axis_shift),
			d3.max(updata, (d) => d.hp_80 + axis_shift),
		])
		.range([0, WIDTH_overview]);

	scatter_chart.select(".x_axis").transition().duration(1000).call(d3.axisBottom(x));

	const y = d3
		.scaleLinear()
		.domain([
			d3.min(updata, (d) => d.atk_80 - axis_shift * 0.6),
			d3.max(updata, (d) => d.atk_80 + axis_shift * 0.6),
		])
		.range([HEIGHT_overview, 0]);

	scatter_chart.select(".y_axis").transition().duration(1000).call(d3.axisLeft(y));

	scatter_chart
		.select(".dot")
		.selectAll("circle")
		.data(updata)
		.join("circle")
		.transition()
		.duration(1000)
		.style("opacity", 0.8)
		.attr("r", 8)
		.attr("cx", function (d) {
			return x(d.hp_80);
		})
		.attr("cy", function (d) {
			return y(d.atk_80);
		})
		.style("fill", (d) => overview_colorScale(d.rarity));

	const tooltip = d3
		.select("body")
		.append("div")
		.style("position", "absolute")
		.style("visibility", "hidden")
		.style("background-color", "black")
		.style("color", "white")
		.style("border", "solid")
		.style("border-width", "1px")
		.style("border-radius", "5px")
		.style("padding", "10px")
		.style("font-size", "12px")
		.style("opacity", 0.8);

	scatter_chart
		.select(".dot")
		.selectAll("circle")
		.data(updata)
		.join("circle")
		.on("mouseover", (d) => {
			tooltip
				.html(
					`${d.character}<br>
	        Hp: ${d.hp_80}<br>
	        Atk: ${d.atk_80}<br>
	        Def: ${d.def_80}`
				)
				.style("visibility", "visible")
				.style("top", d3.event.pageY + "px")
				.style("left", d3.event.pageX + 10 + "px")
				.transition()
				.duration(200)
				.style("opacity", 0.8);
		})
		.on("mouseout", (d) =>
			tooltip
				.transition()
				.duration(200)
				.style("opacity", 0)
				.on("end", function () {
					tooltip.style("visibility", "hidden");
				})
		);
}
