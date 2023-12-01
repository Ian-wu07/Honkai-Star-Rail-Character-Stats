const FWIDTH_map = 800,
	FHEIGHT_map = 800;
const FWIDTH_SHIFT_map = 20 + FWIDTH_scatter,
	FHEIGHT_SHIFT_map = FHEIGHT_SHIFT_scatter;
const MARGIN_map = { LEFT: 100, RIGHT: 150, TOP: 70, BOTTOM: 100 };
const WIDTH_map = FWIDTH_map - (MARGIN_map.LEFT + MARGIN_map.RIGHT);
const HEIGHT_map = FHEIGHT_map - (MARGIN_map.TOP + MARGIN_map.BOTTOM);

function init_map(data) {
	d3.json("taiwan.json").then((taiwan) => {
		const svg = d3
			.select("#chart-area4")
			.style("position", "absolute")
			.style("top", FHEIGHT_SHIFT_map + "px")
			.style("left", FWIDTH_SHIFT_map + "px")
			.append("svg")
			.attr("width", FWIDTH_map)
			.attr("height", FHEIGHT_map);

		const g = svg
			.append("g")
			.attr(
				"transform",
				`translate(${MARGIN_map.LEFT}, ${MARGIN_map.TOP})`
			);

		const colorScale = d3
			.scaleSequential(d3.interpolateViridis)
			.domain([0, 1]);
		// 处理地理数据
		const projection = d3.geoEquirectangular().fitExtent(
			[
				[-WIDTH_map * 1.0, -HEIGHT_map * 1.0],
				[WIDTH_map * 1.5, HEIGHT_map * 2.0],
			],
			taiwan
		);

		const path = d3.geoPath().projection(projection);

		const mapG = g.append("g");
		mapG.selectAll("path")
			.data(taiwan.features)
			.enter()
			.append("path")
			.attr("d", path)
			.attr("stroke", "black")
			.attr("stroke-width", "0.7")
			.on("click", (d) => {
				const countyName = d.properties.ISO3166;
				if (!countyFilter || countyFilter !== countyName) {
					// 如果没有选择或者当前选择不同于点击的城市/县
					countyFilter = countyName;
				} else {
					// 如果当前选择与点击的城市/县相同
					countyFilter = null;
				}
				updateAllViews();
			});
		update_Map(data);
		g.append("text")
			.attr("x", WIDTH_map / 2)
			.attr("y", -30)
			.attr("text-anchor", "middle")
			.style("font-size", "30px")
			.text("Sample Count Map");

		const legendRectSize = 20;
		const legendSpacing = 10;
		const legendData = colorScale.ticks(7);
		const legend = g
			.append("g")
			.attr("class", "legend")
			.attr(
				"transform",
				`translate(${WIDTH_map - 180}, ${HEIGHT_map - 200})`
			);

		legend
			.append("text")
			.style("font-size", "20px")
			.text("Population(Normalized by Max.)");

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
	});
}

function update_Map(updata) {
	const taiwan_chart = d3.select("#chart-area4 svg g g").selectAll("path");

	const countyPatients = updata.reduce((acc, d) => {
		const countyCode = d.location;
		acc[countyCode] = (acc[countyCode] || 0) + 1;
		return acc;
	}, {});
	// console.log(countyPatients)
	const colorScale = d3.scaleSequential(d3.interpolateViridis).domain([0, 1]);
	// 处理地理数据
	const values = Object.values(countyPatients);
	const maxCount = d3.max(values);
	let minCount = d3.min(values);
	if (minCount === maxCount) {
		minCount = 0;
	}

	taiwan_chart
		.transition()
		.duration(1000)
		.style("fill", (d) => {
			const countyName = d.properties.ISO3166;
			const patientCount = countyPatients[countyName] || 0;

			const normalizedCount =
				(patientCount - minCount) / (maxCount - minCount);
			return colorScale(normalizedCount);
		});
}

function getCountyAbbreviation(countyCode) {
	const countyAbbreviations = {
		1: "ILA",
		2: "HSQ",
		3: "MIA",
		4: "CHA",
		5: "NAN",
		6: "YUN",
		7: "CYQ",
		8: "PIF",
		9: "TTT",
		10: "HUA",
		11: "KEE",
		12: "HSZ",
		13: "CYI",
		14: "TPE",
		15: "KHH",
		16: "TPQ",
		17: "TXG",
		18: "TNN",
		19: "TAO",
	};
	return countyAbbreviations[countyCode];
}
