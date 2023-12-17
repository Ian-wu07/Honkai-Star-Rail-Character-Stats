const FWIDTH_overview = 800,
	FHEIGHT_overview = 800;
const FWIDTH_SHIFT_overview = 0,
	FHEIGHT_SHIFT_overview = 20 + FHEIGHT_path + FHEIGHT_SHIFT_path;
const MARGIN_overview = { LEFT: 100, RIGHT: 100, TOP: 150, BOTTOM: 100 };
const WIDTH_overview = FWIDTH_overview - (MARGIN_overview.LEFT + MARGIN_overview.RIGHT);
const HEIGHT_overview = FHEIGHT_overview - (MARGIN_overview.TOP + MARGIN_overview.BOTTOM);

let x_Option = "HP";
let y_Option = "ATK";
var selectData = [];

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
		.attr("transform", `translate(${WIDTH_overview + 10}, 0)`)
		.style("fill", text_color);

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
		.attr("class", "title")
		.attr("x", WIDTH_overview / 2)
		.attr("y", -30)
		.attr("text-anchor", "middle")
		.style("font-size", "30px")
		.style("fill", text_color)
		.text("HP-ATK");
	// X label
	g.append("text")
		.attr("class", "x_axis_label")
		.attr("x", WIDTH_overview / 2)
		.attr("y", HEIGHT_overview + 60)
		.attr("font-size", "25px")
		.attr("text-anchor", "middle")
		.style("fill", text_color)
		.text("HP");
	// Y label
	g.append("text")
		.attr("class", "y_axis_label")
		.attr("x", -(HEIGHT_overview / 2))
		.attr("y", -60)
		.attr("font-size", "25px")
		.attr("text-anchor", "middle")
		.attr("transform", "rotate(-90)")
		.style("fill", text_color)
		.text("ATK");

	//BUTTON-----------------------------------------------------------------
	init_button();
}

function update_overview(updata) {
	const scatter_chart = d3.select("#chart-area3 svg g");
	scatter_chart.select(".dot").selectAll("circle").attr("stroke-width", 0);

	let x_feature = x_Option.toLowerCase() + "_80";
	let y_feature = y_Option.toLowerCase() + "_80";
    if(x_Option==='SPD') x_feature=x_Option.toLowerCase()
    if(y_Option==='SPD') y_feature=y_Option.toLowerCase()

	let x_axis_shift = axis_shift,
		y_axis_shift = axis_shift;
    if (x_Option === "SPD") {
		x_axis_shift *= 0.03;
	}
	else if (x_Option !== "HP") {
		x_axis_shift *= 0.4;
	}
    if (y_Option === "SPD") {
		y_axis_shift *= 0.03;
	}
	else if (y_Option !== "HP") {
		y_axis_shift *= 0.4;
	}

	const x = d3
		.scaleLinear()
		.domain([
			d3.min(updata, (d) => d[x_feature] - x_axis_shift),
			d3.max(updata, (d) => d[x_feature] + x_axis_shift),
		])
		.range([0, WIDTH_overview]);

	scatter_chart
		.select(".title")
		.transition()
		.duration(1000)
		.text(x_Option + "-" + y_Option);

	scatter_chart.select(".x_axis").transition().duration(1000).call(d3.axisBottom(x));
	scatter_chart
		.select(".x_axis_label")
		.transition()
		.duration(500) // 这是文字消失的过渡时间
		.style("opacity", 0)
		.on("end", function () {
			// 在过渡结束后更改文字
			d3.select(this)
				.text(x_Option)
				.transition()
				.duration(500) // 这是文字出现的过渡时间
				.style("opacity", 1);
		});

	const y = d3
		.scaleLinear()
		.domain([
			d3.min(updata, (d) => d[y_feature] - y_axis_shift),
			d3.max(updata, (d) => d[y_feature] + y_axis_shift),
		])
		.range([HEIGHT_overview, 0]);

	scatter_chart.select(".y_axis").transition().duration(1000).call(d3.axisLeft(y));
	scatter_chart
		.select(".y_axis_label")
		.transition()
		.duration(500) // 这是文字消失的过渡时间
		.style("opacity", 0)
		.on("end", function () {
			// 在过渡结束后更改文字
			d3.select(this)
				.text(y_Option)
				.transition()
				.duration(500) // 这是文字出现的过渡时间
				.style("opacity", 1);
		});

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
			return x(d[x_feature]);
		})
		.attr("cy", function (d) {
			return y(d[y_feature]);
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
		.style("padding", "15px")
		.style("font-size", "15px")
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
	        Hp : ${d.hp_80}<br>
	        Atk : ${d.atk_80}<br>
	        Def : ${d.def_80}<br>
            Spd : ${d.spd}`
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
		)
		.on("click", function (d) {
			let index = selectData.indexOf(d);
			if (index !== -1) {
				// 数据存在，删除它
				selectData.splice(index, 1);
				d3.select(this).attr("stroke-width", 0);
			} else if (selectData.length < 10) {
				// 数据不存在，添加它
				selectData.push(d);
				d3.select(this).attr("stroke", "red");
				d3.select(this).attr("stroke-width", 3);
			}
			d3.select("body").select("table").select("tbody").remove();
			if (selectData.length > 0) {
				tabulate(selectData, ["character", "HP", "ATK", "DEF", "SPD", "ENERGY"]);
			}
		});
	var tableWidth = 800;
	var rowHeight = 40;

	d3.select("body").select("table").remove();
	var table = d3
		.select("body")
		.append("table")
		.style("position", "absolute")
		.style("top", FHEIGHT_SHIFT_overview + "px")
		.style("left", FWIDTH_SHIFT_overview + FHEIGHT_overview + "px")
		.style("font-size", "25px")
		.style("border-spacing", "20px")
		.style("width", tableWidth + "px")
		.style("overflow-y", "auto")
		.style("table-layout", "fixed");

	var thead = table.append("thead");
	thead
		.append("tr")
		.selectAll("th")
		.data(["character", "HP", "ATK", "DEF", "SPD", "ENERGY"])
		.enter()
		.append("th")
		.text(function (column) {
			return column;
		})
		.on("click", function (d) {
			sortTable(d);
		});

	function tabulate(data, columns) {
		var tbody = table.append("tbody");

		// create a row for each object in the data
		var rows = tbody.selectAll("tr").data(data).enter().append("tr");

		// create a cell in each row for each column
		var cells = rows
			.selectAll("td")
			.data(function (row) {
				return columns.map(function (column) {
					var show = "";
					if (column === "HP") show = "hp_80";
					else if (column === "ATK") show = "atk_80";
					else if (column === "DEF") show = "def_80";
					else if (column === "SPD") show = "spd";
					else if (column === "ENERGY") show = "max_energy";
					else show = column;
					return { column: column, value: row[show] };
				});
			})
			.enter()
			.append("td")
			.text(function (d) {
				return d.value;
			})
			.style("text-align", "center");

		rows.style("height", rowHeight + "px");

		// 排序函数
		return table;
	}

	function sortTable(column) {
		var show = "";
		if (column == "ATK") show = "atk_80";
		else if (column == "HP") show = "hp_80";
		else if (column == "DEF") show = "def_80";
		else if (column === "SPD") show = "spd";
		else if (column === "ENERGY") show = "max_energy";
		else show = column;
		selectData.sort(function (a, b) {
			if (show === "character") {
				return a[show].localeCompare(b[show]);
			} else {
				return b[show] - a[show];
			}
		});

		d3.select("body").select("table").select("tbody").remove();
		tabulate(selectData, ["character", "HP", "ATK", "DEF", "SPD", "ENERGY"]);
	}
}

function init_button() {
	const allGroup = ["ATK", "HP", "DEF", "SPD"];

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
		.on("change", function () {
			x_Option = d3.select(this).property("value");
			updateAllViews();
		});

	x_button // Add a button
		.style("height", "50px")
		.style("width", "100px")
		.style("font-size", "25px")
		.style("background-color", button_color) // 设置按钮背景颜色
		.style("color", text_color) // 设置按钮文本颜色
		.selectAll("myOptions")
		.data(allGroup)
		.enter()
		.append("option")
		.text((d) => d)
		.attr("value", (d) => d)
		.property("selected", (d) => {
			selectData = [];
			return d === "HP";
		});

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

		.on("change", function (d) {
			y_Option = d3.select(this).property("value");
			selectData = [];
			updateAllViews();
		});

	y_button // Add a button
		.style("height", "50px")
		.style("width", "100px")
		.style("font-size", "25px")
		.style("background-color", button_color) // 设置按钮背景颜色
		.style("color", text_color) // 设置按钮文本颜色
		.selectAll("myOptions")
		.data(allGroup)
		.enter()
		.append("option")
		.text((d) => d)
		.attr("value", (d) => d);
}
