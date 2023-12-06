const text_color='#bebebe'
const background_color='#0e1429'
const button_color="#44008d"

const path_color = "#69b3a2";
const path_sel_color = "red";

const combat_colorScale = d3
	.scaleOrdinal()
	.domain(["fire", "wind", "ice", "lightning", "quantum", "physical", "imaginary"])
	.range(["#f85037", "#00b596", "#44bef0", "#df55ff", "#615bbe", "#7c787c", "#f2d35a"]);
const combat_sel_color = "red";

const overview_colorScale = d3.scaleOrdinal().domain(["4", "5"]).range(["#df55ff", "#f2d35a"]);
const axis_shift = 50;

document.body.style.backgroundColor = background_color;
document.documentElement.style.setProperty('--text-color', text_color);

const FWIDTH_title = 1400,
    FHEIGHT_title = 100;

const svgTitle = d3.select("#title")
    .append("svg")
    .attr("width", FWIDTH_title)
    .attr("height", FHEIGHT_title);

svgTitle.append("text")
    .text("HSR Character Data")
    .attr("x", FWIDTH_title / 2)
    .attr("y", FHEIGHT_title / 2)
    .attr("font-size", "50px")
    .style("fill", text_color)
    .attr("text-anchor", "middle");
