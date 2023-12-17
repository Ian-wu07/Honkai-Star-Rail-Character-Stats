let path_Filter = null;
let combat_Filter = null;
let allData = null;

d3.csv("hsr_character-data(1.3).csv").then((data) => {
	data.forEach(function (d) {
		const { atk_80, hp_80, def_80, spd, max_energy} = d;
		d.atk_80 = Number(atk_80);
		d.hp_80 = Number(hp_80);
		d.def_80 = Number(def_80);
        d.spd = Number(spd);
        d.max_energy = Number(max_energy);
	});
	allData = data;
    // console.log(allData)
	init_path(allData);
	setTimeout(() => init_combat_type(allData), 500);
	setTimeout(() => init_overview(allData), 1000);
	// setTimeout(() => init_map(allData), 2500)
});

function updateAllViews() {
	const filteredData = allData.filter((d) => {
		const path_Pass = path_Filter === null || d.path === path_Filter;
		const combat_Pass =
			path_Pass && (combat_Filter === null || d.combat_type === combat_Filter);
		return combat_Pass;
	});
	selectData = []
	update_path(filteredData);
	update_combat(filteredData);
	update_overview(filteredData);
	// update_Map(filteredData);
}
