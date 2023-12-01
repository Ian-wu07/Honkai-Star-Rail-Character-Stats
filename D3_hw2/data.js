// 全局变量，用于跟踪用户输入的条件
let ageFilter = null;
let educationFilter = null;
let countyFilter = null;
let allData = null;
d3.csv("data_loc.csv").then((data) => {
	// 存储数据
	data.forEach(function (d) {
        const { Age, MMSE, "Hb-A1C": HbA1C, Education, location } = d;
		d.Age = Number(Age);
        d.MMSE = Number(MMSE);
        d["Hb-A1C"] = Number(HbA1C);
		let education = Number(Education);
		if (education === 0) {
			d.Education = "No";
		} else if (education >= 1 && education <= 6) {
			d.Education = "Elementary";
		} else if (education >= 7 && education <= 9) {
			d.Education = "Junior High";
		} else if (education >= 10 && education <= 12) {
			d.Education = "Senior High";
		} else if (education >= 13) {
			d.Education = "College+";
		}
		d.location = getCountyAbbreviation(Number(location));
	});
	allData = data;
    init_bar(allData)
    setTimeout(() => init_pie(allData), 500)
    setTimeout(() => init_scatter(allData), 1500)
    setTimeout(() => init_map(allData), 2500)
});

function updateAllViews() {
	// 根据过滤条件过滤数据
	const filteredData = allData.filter((d) => {

		const agePass = ageFilter === null || (d.Age >= ageFilter[0] && d.Age <= ageFilter[1]);

		const educationPass = agePass&&(educationFilter === null || d.Education === educationFilter) ;

		const countyPass = educationPass&&(countyFilter=== null || d.location === countyFilter);

		return countyPass;
	});
	update_bar(filteredData);
	update_chart(filteredData);
    update_scatter(filteredData);
    update_Map(filteredData);
}
