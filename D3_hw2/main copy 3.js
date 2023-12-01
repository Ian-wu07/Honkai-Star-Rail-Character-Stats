const FWIDTH_scatter = 900,
	FHEIGHT_scatter = 800;
const FWIDTH_SHIFT_scatter = 0,
	FHEIGHT_SHIFT_scatter = 20 + FHEIGHT_bar;
const MARGIN_scatter = { LEFT: 100, RIGHT: 100, TOP: 70, BOTTOM: 100 };
const WIDTH_scatter =
	FWIDTH_scatter - (MARGIN_scatter.LEFT + MARGIN_scatter.RIGHT);
const HEIGHT_scatter =
	FHEIGHT_scatter - (MARGIN_scatter.TOP + MARGIN_scatter.BOTTOM);

function init_scatter(data) {
	const svg = d3
		.select("#chart-area3")
		.style("position", "absolute")
		.style("top", FHEIGHT_SHIFT_scatter + "px")
		.style("left", FWIDTH_SHIFT_scatter + "px")
		.append("svg")
		.attr("width", FWIDTH_scatter)
		.attr("height", FHEIGHT_scatter);

	const g = svg
		.append("g")
		.attr(
			"transform",
			`translate(${MARGIN_scatter.LEFT}, ${MARGIN_scatter.TOP})`
		);

	const groupCounts = {}; // 用于存储每个组合的病人数量

	data.forEach(function (d) {
		const key = `${d.Age}-${d.MMSE}`; // 使用 Age 和 MMSE 组成一个唯一的键
		if (groupCounts[key]) {
			groupCounts[key]++; // 增加该组合的计数
		} else {
			groupCounts[key] = 1; // 初始化该组合的计数
		}
	});

	const x = d3
		.scaleLinear()
		.domain([0, d3.max(data, (d) => d.Age)])
		.range([0, WIDTH_scatter]);
	g.append("g")
		.attr("class", "x_axis")
		.attr("transform", `translate(0, ${HEIGHT_scatter})`)
		.call(d3.axisBottom(x));

	const y = d3
		.scaleLinear()
		.domain([0, d3.max(data, (d) => d.MMSE)])
		.range([HEIGHT_scatter, 0]);
	g.append("g").attr("class", "y_axis").call(d3.axisLeft(y));

	// Add dots
	const colorScale = d3.scaleSequential(d3.interpolateTurbo).domain([5, 12]);

	const sizeScale = d3
		.scaleLinear()
		.domain([0, d3.max(data, (d) => groupCounts[`${d.Age}-${d.MMSE}`])]) // 设置散点大小的域
		.range([3, 10]); // 设置散点的最小和最大大小

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

	g.append("g")
		.attr("class", "dot")
		.selectAll("dot")
		.data(data)
		.enter()
		.append("circle")
		.attr("cx", function (d) {
			return x(d.Age);
		})
		.attr("cy", function (d) {
			return y(d.MMSE);
		})
		.attr("r", 0)
		.style("fill", (d) => {
			const hbA1C = Math.max(5, Math.min(12, d["Hb-A1C"]));
			return colorScale(hbA1C);
		})
		.style("opacity", 0.0)
		.on("mouseover", (d) => {
			tooltip
				.html(
					`Age: ${d.Age}<br>
                    MMSE: ${d.MMSE}<br>
                    Hb-A1C: ${d["Hb-A1C"]}<br>
                    Patients: ${groupCounts[`${d.Age}-${d.MMSE}`]}`
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
	update_scatter(data);
	//legend
	const legendRectSize = 20;
	const legendSpacing = 0;
	const legendData = d3.range(5, 13);
	const legend = g
		.append("g")
		.attr("class", "legend")
		.attr("transform", `translate(${WIDTH_scatter + 30}, 0)`);

	legend.append("text").style("font-size", "20px").text("Hb-A1C");

	const legendItems = legend
		.selectAll("legend-item")
		.data(legendData)
		.enter()
		.append("g")
		.attr("class", "legend-item")
		.attr(
			"transform",
			(d, i) =>
				`translate(0, ${20 + i * (legendRectSize + legendSpacing)})`
		); // 调整每个图例项的垂直位置

	legendItems
		.append("rect")
		.attr("width", legendRectSize)
		.attr("height", legendRectSize)
		.style("fill", (d) => colorScale(d));

	legendItems
		.append("text")
		.attr("x", legendRectSize + 15)
		.attr("y", legendRectSize / 2 + 5)
		.text((d) => d);
	//title
	g.append("text")
		.attr("x", WIDTH_scatter / 2)
		.attr("y", -30)
		.attr("text-anchor", "middle")
		.style("font-size", "30px")
		.text("Age-MMSE-HbA1C (Size:patient count)");
	// X label
	g.append("text")
		.attr("x", WIDTH_scatter / 2)
		.attr("y", HEIGHT_scatter + 40)
		.attr("font-size", "20px")
		.attr("text-anchor", "middle")
		.text("Age");
	// Y label
	g.append("text")
		.attr("x", -(HEIGHT_scatter / 2))
		.attr("y", -40)
		.attr("font-size", "20px")
		.attr("text-anchor", "middle")
		.attr("transform", "rotate(-90)")
		.text("MMSE");
}

function update_scatter(updata) {
	const scatter_chart = d3.select("#chart-area3 svg g");

	const groupCounts = d3.map(); // 使用 d3.map 替代普通的 JavaScript 对象

	updata.forEach((d) => {
		const key = `${d.Age}-${d.MMSE}`;
		groupCounts.set(key, (groupCounts.get(key) || 0) + 1);
	});

	const x = d3
		.scaleLinear()
		.domain([d3.min(updata, (d) => d.Age), d3.max(updata, (d) => d.Age)])
		.range([0, WIDTH_scatter]);

	scatter_chart
		.select(".x_axis")
		.transition()
		.duration(1000)
		.call(d3.axisBottom(x));

	const y = d3
		.scaleLinear()
		.domain([d3.min(updata, (d) => d.MMSE), d3.max(updata, (d) => d.MMSE)])
		.range([HEIGHT_scatter, 0]);

	scatter_chart
		.select(".y_axis")
		.transition()
		.duration(1000)
		.call(d3.axisLeft(y));

	if (updata.length === 0) {
		scatter_chart
			.selectAll(".dot circle")
			.transition()
			.duration(1000)
			.style("opacity", 0.0);
		return;
	}

	// Add dots
	const sizeScale = d3
		.scaleLinear()
		.domain([
			0,
			d3.max(updata, (d) => groupCounts.get(`${d.Age}-${d.MMSE}`)),
		])
		.range([3, 10]);

	scatter_chart
		.data(updata)
		.select(".dot")
		.selectAll("circle")
		.transition()
		.duration(1000)
		.style("opacity", 0.5)
		.attr("cx", function (d) {
			return x(d.Age);
		})
		.attr("cy", function (d) {
			return y(d.MMSE);
		})
		.attr("r", (d) => sizeScale(groupCounts.get(`${d.Age}-${d.MMSE}`)));
}
