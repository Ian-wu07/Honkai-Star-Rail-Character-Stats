const FWIDTH_CHD = 1500,
	  FHEIGHT_CHD = 800;
const FWIDTH_SHIFT_CHD = 0,
	  FHEIGHT_SHIFT_CHD = 20  + FHEIGHT_overview + FHEIGHT_SHIFT_overview;
const MARGIN_CHD = { LEFT: 100, RIGHT: 100, TOP: 50, BOTTOM: 100 };
const WIDTH_CHD = FWIDTH_CHD - (MARGIN_CHD.LEFT + MARGIN_CHD.RIGHT);
const HEIGHT_CHD = FHEIGHT_CHD - (MARGIN_CHD.TOP + MARGIN_CHD.BOTTOM);

Data = [1]
Data2 = [1,2,3,4,5]
clearData = []

function init_CHD() {
	const svg = d3
		.select("#chart-area4")
		.style("position", "absolute")
		.style("top", FHEIGHT_SHIFT_CHD + "px")
		.style("left", FWIDTH_SHIFT_CHD + "px")
		.append("svg")
		.attr("width", FWIDTH_CHD)
		.attr("height", FHEIGHT_CHD);

	const g = svg
		.append("g")
		.attr("transform", `translate(${MARGIN_CHD.LEFT}, ${MARGIN_CHD.TOP})`);
	
	Skshift = 320;

	const C_name = g.selectAll('.character-name')
	.data(Data)
	.enter()
	.append("text")
	.attr("x", Skshift)
	.attr("y", 20)
	.attr('class', 'character-name')
	.attr("font-size", "60px")
	.style("fill", text_color)
	.text("")
	.on("click",clearCHD());

	const C_images = g.selectAll('.character-image')
	.data(Data)
	.enter()
	.append('image')
	.attr('class', 'character-image')
	.attr('x', 0) 
	.attr('y', 0) 
	.attr('width',0) 
	.attr('height',0); 

	const BGcircle = g.selectAll('.BGcircle')
	.data(Data2)
	.enter()
	.append("circle")
	.attr('class', 'BGcircle')
	.attr("cx",25 + Skshift)
	.attr("cy",(i) => i*100 + 25)
	.attr("r", 0)
	.style("fill", '#0a0e74');

	const characterbasic = g.selectAll('.character-basic')
	.data(Data2)
	.enter()
	.append('image')
	.attr('class', 'character-basic')
	.attr('x', Skshift) 
	.attr('y', (i) => i*100) 
	.attr('width',50) 
	.attr('height',50); 

	const C_Sktext = g.selectAll('.character-skilltext')
	.data(Data2)
	.enter()
	.append("text")
	.attr("x", Skshift+60)
	.attr("y", (i) => i*100 + 30)
	.attr('class', 'character-skilltext')
	.attr("font-size", "40px")
	.style("fill", text_color)
	.text("");

	const Bgtext = g.selectAll('.Bgtext')
	.data(Data2)
	.enter()
	.append("text")
	.attr('class', 'Bgtext')
	.attr("x", Skshift)
	.attr("y", (i) => i*100 -10)
	.attr('class', 'Bgtext')
	.attr("font-size", "0px")
	.style("fill", text_color)
	.text((d)=>{
		if(d==1)return 'Basic ATK';
		if(d==2)return 'Skill';
		if(d==3)return 'Ultimate';
		if(d==4)return 'Talent';
		if(d==5)return 'Technique';
	});



	
	
}

function update_CHD(charactername) {
	const  g = d3.select("#chart-area4 svg g");

	let path = "Character/" + charactername + "/";
	let imgpath = path +  "0.png";
	let basicpath = path +  "1.png";
	let skillpath = path +  "2.png";
	let ultpath = path +  "3.png";
	let talentpath = path +  "4.png";
	let tecpath = path +  "5.png";
	let skilltext = [getskilltext(charactername,1),getskilltext(charactername,2),getskilltext(charactername,3),getskilltext(charactername,4),getskilltext(charactername,5)]

	const C_name = g.selectAll('.character-name')
	.transition()
	.duration(1000)
	.attr("x", Skshift)
	.attr("y", 20)
	.attr("font-size", "50px")
	.style("fill", text_color)
	.text(charactername);
	
	const C_images = g.selectAll('.character-image')
	.attr('xlink:href',imgpath);
	
	C_images.transition()
	.duration(1000)
	.attr('x', 0) 
	.attr('y', 0) 
	.attr('width',300) 
	.attr('height', 300);
	
	

	const BGcircle = g.selectAll('.BGcircle')
	.transition()
	.duration(1000)
	.attr("r", 30)
	.style("fill", '#0a0e74');

	const characterbasic = g.selectAll('.character-basic')
	.attr('xlink:href',(d)=>{
		if(d==1)return basicpath;
		if(d==2)return skillpath;
		if(d==3)return ultpath;
		if(d==4)return talentpath;
		if(d==5)return tecpath;
	}) 
	 
	characterbasic.transition()
	.duration(1000)
	.attr('x', Skshift) 
	.attr('y', (i) => i*100) 
	.attr('width',50) 
	.attr('height',50);

	const C_Sktext = g.selectAll('.character-skilltext')
	.transition()
	.duration(1000)
	.attr("x", Skshift+60)
	.attr("y", (i) => i*100 + 30)
	.attr("font-size", "20px")
	.style("fill", text_color)
	.text((i) => skilltext[i-1]);

	const Bgtext = g.selectAll('.Bgtext')
	.attr("x", Skshift)
	.attr("y", (i) => i*100 -10)
	.attr('class', 'Bgtext')
	.attr("font-size", "25px")
	.text((d)=>{
		if(d==1)return 'Basic ATK';
		if(d==2)return 'Skill';
		if(d==3)return 'Ultimate';
		if(d==4)return 'Talent';
		if(d==5)return 'Technique';
	});
}

function clearCHD(){
	const  g = d3.select("#chart-area4 svg g");

	const C_name = g.selectAll('.character-name')
	.transition()
	.duration(1000)
	.attr("font-size", "60px")
	.style("fill", text_color)
	.text("");
	

	const C_images = g.selectAll('.character-image')
	.transition()
	.duration(1000)
	.attr('x', 0) 
	.attr('y', 0) 
	.attr('width',0) 
	.attr('height', 0); 

	const characterbasic = g.selectAll('.character-basic')
	.transition()
	.duration(1000)
	.attr('x', Skshift) 
	.attr('y', (i) => i*100) 
	.attr('width',0) 
	.attr('height',0); 

	const C_Sktext = g.selectAll('.character-skilltext')
	.transition()
	.duration(1000)
	.attr("x", Skshift+60)
	.attr("y", (i) => i*100 + 30)
	.attr("font-size", "20px")
	.style("fill", text_color)
	.text((i) => skilltext[i-1]);

}



function getskilltext(charactername,i){
	switch(charactername){
		case 'march_7th':
		 	if(i==1)return "[Frigid Cold Arrow] : Deals Ice DMG equal to 50% of March 7th's ATK to a single enemy.";
			if(i==2)return "[The Power of Cuteness] : Provides a single ally with a Shield for 3 turn(s).";
			if(i==3)return "[Glacial Cascade] : Deals Ice DMG equal to 90% of March 7th's ATK to all enemies.";
			if(i==4)return "[Girl Power] : Deals Ice DMG equal to 50% of her ATK after a shielded ally is attacked.";
			if(i==5)return "[Freezing Beauty] : There is a 100% base chance to Freeze a random enemy for 1 turn(s).";
		case 'dan_heng':
			if(i==1)return "[North Wind] : Deals Wind DMG equal to 50% of Dan Heng's ATK to a single enemy.";
			if(i==2)return "[Torrent] : Deals Wind DMG equal to 130% of Dan Heng's ATK to a single enemy.";
			if(i==3)return "[Ethereal Dream] : Deals Wind DMG equal to 240% of Dan Heng's ATK to a single enemy.";
			if(i==4)return "[Superiority of Reach] : If is the target of an ally's Ability, his next attack's Wind RES PEN increases by 18%.";
			if(i==5)return "[Splitting Spearhead] : After using Technique, his ATK increases by 40% for 3 turn(s).";
		case 'himeko':
			if(i==1)return "[Sawblade Tuning] : Deals Fire DMG equal to 50% of Himeko's ATK to a single enemy.";
			if(i==2)return "[Molten Detonation] : Deals Fire DMG equal to 100%/40% of Himeko's ATK to single/adjacent enemies.";
			if(i==3)return "[Heavenly Flare] : Deals Fire DMG equal to 138% of Himeko's ATK to all enemies.";
			if(i==4)return "[Victory Rush] : If fully Charged (3 points), Himeko deals Fire DMG equal to 70% of her ATK to all enemies.";
			if(i==5)return "[Splitting Spearhead] : After using Technique, his ATK increases by 40% for 3 turn(s).";
		case 'welt':
			if(i==1)return "[Gravity Suppression] : Deals Imaginary DMG equal to 50% of Welt's ATK to a single enemy.";
			if(i==2)return "[Edge of the Void] : Deals Imaginary DMG equal to 36% of Welt's ATK to a single enemy (3 times)";
			if(i==3)return "[Synthetic Black Hole] :  Enemies hit by this ability to be Imprisoned for 1 turn.";
			if(i==4)return "[Time Distortion] :  Welt deals Additional Imaginary DMG equal to 30% of his ATK to slowed enemy.";
			if(i==5)return "[Gravitational Imprisonment] : After using Technique,100% base chance to Imprison the enemies for 1 turn.";
		case 'kafka':
			if(i==1)return "[Midnight Tumult] : Deals Lightning DMG equal to 50% of Kafka's ATK to a single enemy.";
			if(i==2)return "[Caressing Moonlight] : All DoTs currently placed on that enemy immediately produce DMG equal to 60% of their original DMG.";
			if(i==3)return "[Twilight Trill] :  While Shocked, enemies receive Lightning DoT equal to 116% of Kafka's ATK at the beginning of each turn.";
			if(i==4)return "[Gentle but Cruel] :  Kafka launches 1 follow-up attack and deals Lightning DMG equal to 42% of her ATK to a target.";
			if(i==5)return "[Mercy Is Not Forgiveness] : 100% base chance to inflict Shock equivalent to that applied by her Ultimate.";
		case 'silver_wolf':
			if(i==1)return "[System Warning] : Deals Quantum DMG equal to 50% of Silver Wolf's ATK to a single enemy.";
			if(i==2)return "[Allow Changes?] : There is a 75% base chance to add 1 Weakness of an on-field ally's Type to the target enemy.";
			if(i==3)return "[User Banned] : There's a 85% base chance to decrease the target enemy's DEF by 36% for 3 turn(s).";
			if(i==4)return "[Awaiting System Response] :  Reduce ATK by 5%, reduce DEF by 4%, and reduce SPD by 3%.";
			if(i==5)return "[Force Quit Program] :  Deals Quantum DMG and reduces Toughness from all enemies.";
		case 'arlan':	
			if(i==1)return "[Lightning Rush] : Deals Lightning DMG equal to 50% of Arlan's ATK to a single enemy.";
			if(i==2)return "[Shackle Breaker] : Consumes Arlan's HP (15%) to deal Lightning DMG equal to 120% of Arlan's ATK to a enemy.";
			if(i==3)return "[Frenzied Punishment] : Deals Lightning DMG equal to 192% of Arlan's ATK to a single enemy.";
			if(i==4)return "[Pain and Anger] : Increases Arlan's DMG for every percent of HP below his Max HP(max 36%).";
			if(i==5)return "[Swift Harvest] : Deals Lightning DMG equal to 80% of Arlan's ATK to all enemies.";

		case 'asta':
			if(i==1)return "[Spectrum Beam] : Deals Fire DMG equal to 50% of Asta's ATK to a single enemy.";
			if(i==2)return "[Meteor Storm] : Deals Fire DMG equal to 25% of Asta's ATK to a single enemy and further deals DMG for 4 extra times.";
			if(i==3)return "[Astral Blessing] : Increases SPD of all allies by 36 for 2 turn(s).";
			if(i==4)return "[Astrometry] : For every stack of Charging Asta has, all allies' ATK increases by 7.0%, up to 5 time(s).";
			if(i==5)return "[Miracle Flash] : Deals Fire MG equal to 50% of Asta's ATK to all enemies.";

		case 'herta':
			if(i==1)return "[What Are You Looking At?] : Deals Ice DMG equal to 50% of Herta's ATK to a single enemy.";
			if(i==2)return "[One-Time Offer] : Deals Ice DMG equal to 50% of Herta's ATK to all enemies.";
			if(i==3)return "[It's Magic, I Added Some Magic] : Deals Ice DMG equal to 120% of Herta's ATK to all enemies.";
			if(i==4)return "[Fine, I'll Do It Myself] : Follow-up attack, dealing Ice DMG equal to 25% of Herta's ATK to all enemies.";
			if(i==5)return "[It Can Still Be Optimized] :  Herta's ATK increases by 40% for 3 turn(s) next battle.";

		case 'bronya':
			if(i==1)return "[Windrider Bullet] : Deals Wind DMG equal to 50% of Bronya's ATK to a single enemy.";
			if(i==2)return "[Combat Redeployment] : Dispels a debuff from a single ally, allows them to immediately take action.";
			if(i==3)return "[The Belobog March] : Increases the ATK and CRIT DMG of all allies for 2 turn(s).";
			if(i==4)return "[Leading the Way] : After using her Basic ATK, Bronya's next action will be Advanced Forward by 15%.";
			if(i==5)return "[Banner of Command] :  At the start of the next battle, all allies' ATK increases by 15% for 2 turn(s).";


		case 'seele':
			if(i==1)return "[Thwack] : Deals Quantum DMG equal to 50% of Seele's ATK to a single enemy.";
			if(i==2)return "[Sheathed Blade] : Increases SPD by 25% for 2 turn(s) and deals Quantum DMG to a single enemy.";
			if(i==3)return "[Butterfly Flurry] : Seele enters the buffed state and deals Quantum DMG equal to 255% of her ATK to a single enemy.";
			if(i==4)return "[Resurgence] : Defeating an enemy with Basic ATK, Skill, or Ultimate, and receives an extra turn. ";
			if(i==5)return "[Phantom Illusion] :  Seele gains Stealth for 20 second(s) and cannot be detected by enemies.";

		case 'serval':
			if(i==1)return "[Roaring Thunderclap] : Deals Lightning DMG equal to 50% of Serval's ATK to a single enemy.";
			if(i==2)return "[Lightning Flash] : Deals Lightning DMG equal to 70% of Serval's ATK to a single enemy and 30% to adjacent enemies.";
			if(i==3)return "[Here Comes the Mechanical Fever] : Deals Lightning DMG equal to 108% of Serval's ATK to all enemies.";
			if(i==4)return "[Galvanic Chords] : After Serval attacks, deals additional Lightning DMG equal to 36% of Serval's ATK to all Shocked enemies.";
			if(i==5)return "[Good Night, Belobo] :  Deals Lightning DMG equal to 50% of Serval's ATK to a random enemy.";

		case 'gepard':
			if(i==1)return "[Thwack] : Deals Ice DMG equal to 50% of Gepard's ATK to a single enemy.";
			if(i==2)return "[Sheathed Blade] : 65% base chance to Freeze the enemy for 1 turn(s).";
			if(i==3)return "[Butterfly Flurry] : Applies a Shield to all allies, absorbing DMG equal to 30% of Gepard's DEF plus 150 for 3 turn(s).";
			if(i==4)return "[Resurgence] : Gepard's HP immediately restores to 25% of his Max HP. ";
			if(i==5)return "[Phantom Illusion] :  A Shield will be applied to all allies for 2 turn(s).";

		case 'natasha':
			if(i==1)return "[Behind the Kindness] : Deals Physical DMG equal to 50% of Natasha's ATK to a single enemy.";
			if(i==2)return "[Love, Heal, and Choose] : Restores a single ally for 7% of Natasha's Max HP plus 70.";
			if(i==3)return "[Gift of Rebirth] : Heals all allies for 9.2% of Natasha's Max HP plus 92.";
			if(i==4)return "[Innervation] : When healing allies with HP percentage at 30% or lower, increases Natasha's Outgoing Healing by 25%. ";
			if(i==5)return "[Hypnosis Research] : Deals Physical DMG equal to 80% of Natasha's ATK to a random enemy.";

		case 'pela':
			if(i==1)return "[Frost Shot] : Deals Ice DMG equal to 50% of Pela's ATK to a single enemy.";
			if(i==2)return "[Frostbite] : Removes 1 buff(s) and deals Ice DMG equal to 105% of Pela's ATK to a single target enemy.";
			if(i==3)return "[Zone Suppression] : Deals Ice DMG equal to 60% of Pela's ATK to all enemies.";
			if(i==4)return "[Data Collecting] : If the enemy is debuffed after Pela's attack, Pela will restore 5 extra Energy.";
			if(i==5)return "[Preemptive Strike] : Pela deals Ice DMG equal to 80% of her ATK to a random enemy.";

		case 'clara':
			if(i==1)return "[I Want to Help] : Deals Physical DMG equal to 50% of Clara's ATK to a single enemy.";
			if(i==2)return "[Svarog Watches Over You] : Deals Physical DMG equal to 60% of Clara's ATK to all enemies.";
			if(i==3)return "[Promise, Not Command] : DMG dealt to her is reduced by an extra 15%.";
			if(i==4)return "[Because We're Family] : Under the protection of Svarog, DMG taken by Clara is reduced by 10%.";
			if(i==5)return "[Small Price for Victory] : Upon entering battle, the chance Clara will be attacked by enemies increases for 2 turn(s).";

		case 'sampo':
			if(i==1)return "[Dazzling Blades] : Deals Wind DMG equal to 50% of Sampo's ATK to a single enemy.";
			if(i==2)return "[Ricochet Love] : Deals Wind DMG equal to 28% of Sampo's ATK to a single enemy, and further 4 extra time(s).";
			if(i==3)return "[Surprise Present] : 100% base chance to increase the targets' DoT taken by 20% for 2 turn(s).";
			if(i==4)return "[Windtorn Dagger] : Sampo's attacks have a 65% base chance to inflict Wind Shear for 3 turn(s).";
			if(i==5)return "[Shining Bright] : 100% fixed chance to delay all enemies' action by 25%.";

		case 'hook':
			if(i==1)return "[Hehe! Don't Get Burned!] : Deals Fire DMG equal to 50% of Hook's ATK to a single enemy.";
			if(i==2)return "[Hey! Remember Hook?] : Deals Fire DMG equal to 120% of Hook's ATK to a single enemy. ";
			if(i==3)return "[Boom! Here Comes the Fire!] : After using Ultimate, the next Skill to be used is Enhanced.";
			if(i==4)return "[Ha! Oil to the Flames!] : When attacking a target afflicted with Burn, deals Fire DMG equal to 50% of Hook's ATK.";
			if(i==5)return "[Ack! Look at This Mess!] : 100% base chance to inflict Burn on every enemy for 3 turn(s).";

		case 'luka':
			if(i==1)return "[Direct Punch] : Deals Physical DMG equal to 50% of Luka's ATK to a single enemy.";
			if(i==2)return "[Hey! Remember Hook?] : 100% base chance to inflict Bleed on them, lasting for 3 turn(s).";
			if(i==3)return "[Boom! Here Comes the Fire!] : 100% base chance to increase a single enemy target's DMG received by 12% for 3 turn(s).";
			if(i==4)return "[Ha! Oil to the Flames!] : When he has 2 or more Fighting Will, his Basic ATK 'Direct Punch' is enhanced to 'Sky-Shatter Fist'.";
			if(i==5)return "[Ack! Look at This Mess!] : Luka deals Physical DMG equal to 50% of his ATK to a random single enemy.";

		case 'qingque':
			if(i==1)return "[Flower Pick] : Deals Quantum DMG equal to 50% of Qingque's ATK to a single enemy.";
			if(i==2)return "[A Scoop of Moon] : Immediately draws 2 jade tile(s) and increases DMG by 14% until the end of the current turn.";
			if(i==3)return "[A Quartet? Woo-hoo!] : Deals Quantum DMG to all enemies, and obtain 4 jade tiles of the same suit.";
			if(i==4)return "[Celestial Jade] : If starts with 4 tiles of the same suit,consumes all tiles to enter the 'Hidden Hand' state.";
			if(i==5)return "[Game Solitaire] : After using Technique, Qingque draws 2 jade tile(s) when the battle starts.";

		case 'tingyun':
			if(i==1)return "[Dislodged] : Deals Lightning DMG equal to 50% of Tingyun's ATK to a single enemy.";
			if(i==2)return "[Soothing Melody] :Benediction lasts for 3 turn(s) and is only effective on the most recent receiver of Tingyun's Skill.";
			if(i==3)return "[Amidst the Rejoicing Clouds] : Regenerates 50 Energy for a single ally and increases the target's DMG by 20% for 2 turn(s).";
			if(i==4)return "[Violet Sparknado] : If starts with 4 tiles of the same suit,consumes all tiles to enter the 'Hidden Hand' state.";
			if(i==5)return "[Gentle Breeze] : After using Technique, Qingque draws 2 jade tile(s) when the battle starts.";

		case 'luocha':
			if(i==1)return "[Thorns of the Abyss] : Deals Imaginary DMG equal to 50% of Luocha's ATK to a single enemy.";
			if(i==2)return "[Prayer of Abyss Flower] :  Luocha immediately restores the target ally's HP equal to 40% of Luocha's ATK plus 200.";
			if(i==3)return "[Death Wish] : Removes 1 buff(s) from all enemies and deals Imaginary DMG.";
			if(i==4)return "[Cycle of Life] : When Abyss Flower reaches 2 , consumes all stacks of Abyss Flower to deploy a Field against the enemy.";
			if(i==5)return "[Mercy of a Fool] : After the Technique is used, the Talent will be immediately triggered at the start of the next battle.";

		case 'jing_yuan':
			if(i==1)return "[Glistening Light] : Deals Lightning DMG equal to 50% of Jing Yuan's ATK to a single enemy.";
			if(i==2)return "[Rifting Zenith] : Deals Lightning DMG equal to 50% of Jing Yuan's ATK to all enemies.";
			if(i==3)return "[Lightbringer] : Deals Lightning DMG equal to 120% of Jing Yuan's ATK to all enemies.";
			if(i==4)return "[Prana Extirpated] : Summons Lightning-Lord and Deals Lightning DMG";
			if(i==5)return "[Spirit Invocation] : The Lightning-Lord's Hits Per Action in the first turn increases by 3.";
		
		case 'blade':
			if(i==1)return "[Shard Sword] : Deals 50% of Blade's ATK as Wind DMG to a target enemy.";
			if(i==2)return "[Hellscape] : Consumes HP equal to 30% of Blade's Max HP to enter the Hellscape state.";
			if(i==3)return "[Death Sentence] : Sets Blade's current HP to 50%and deals Wind DMG equal to the sum of 24% of his ATK.";
			if(i==4)return "[Shuhu's Gift] : Launches a follow-up attack on all enemies, dealing Wind DMG equal to 22% of Blade's ATK.";
			if(i==5)return "[Karma Wind] : Consumes 20% of Blade's Max HP while dealing Wind DMG equal to 40% of his Max HP to all enemies.";

		case 'sushang':
			if(i==1)return "[Starshine] : Deals Physical DMG equal to 50% of Sushang's ATK to a single enemy.";
			if(i==2)return "[Mountainfall] : Deals Physical DMG equal to 105% of Sushang's ATK to a single enemy.";
			if(i==3)return "[Dawn Herald] : Deals Physical DMG and immediately Advances Forward her actions by 100%.";
			if(i==4)return "[Dancing Blade] : When an enemy has their Weakness Broken on the field, Sushang's SPD increases by 15.00% for 2 turn(s).";
			if(i==5)return "[Warcry] : Upon entering battle, Sushang deals Physical DMG equal to 80% of her ATK to all enemies.";

		case 'yukong':
			if(i==1)return "[Arrowslinger] : Deals 50% of Yukong's ATK as Imaginary DMG to a target enemy.";
			if(i==2)return "[Emboldening Salvo] : When 'Roaring Bowstrings' is active, the ATK of all allies increases by 40%.";
			if(i==3)return "[Diving Kestrel] : If 'Roaring Bowstrings' is active, additionally increases all allies' CRIT Rate by 21% and CRIT DMG by 39%.";
			if(i==4)return "[Seven Layers, One Arrow] : Basic ATK additionally deals Imaginary DMG equal to 40% of Yukong's ATK.";
			if(i==5)return "[Chasing the Wind] : After using her Technique, Yukong enters Sprint mode for 20 seconds.";

		case 'yanqing':
			if(i==1)return "[Frost Thorn] : Deals Ice DMG equal to 50% of Yanqing's ATK to a single enemy.";
			if(i==2)return "[Darting Ironthorn] : Deals Ice DMG equal to 110% of Yanqing's ATK to a single enemy and activates Soulsteel Sync for 1 turn.";
			if(i==3)return "[Amidst the Raining Bliss] : Increases Yanqing's CRIT Rate by 60% and increases Yanqing's CRIT DMG 30% for one turn.";
			if(i==4)return "[One With the Sword] : When Soulsteel Sync is active, Yanqing is less likely to be attacked by enemies.";
			if(i==5)return "[The One True Sword] : Yanqing deals 30% more DMG for 2 turn(s) to enemies whose current HP is 50% or higher.";

		case 'bailu':
			if(i==1)return "[Diagnostic Kick] : Deals Lightning DMG equal to 50% of Bailu's ATK to a single enemy.";
			if(i==2)return "[Singing Among Clouds] : Heals a single ally for 7.8% of Bailu's Max HP plus 78 by two times.";
			if(i==3)return "[Felicitous Thunderleap] : Heals all allies for 9% of Bailu's Max HP plus 90.";
			if(i==4)return "[Gourdful Elixir] : When an ally receives a killing blow Bailu immediately heals the ally for 12% of Bailu's Max HP.";
			if(i==5)return "[Saunter in the Rain] : At the start of the next battle, all allies are granted Invigoration for 2 turn(s).";

		case 'trailblazer_0':
			if(i==1)return "[Farewell Hit] : Deals Physical DMG equal to 50% of the Trailblazer's ATK to a single enemy.";
			if(i==2)return "[RIP Home Run] : Deals Physical DMG equal to 62% of the Trailblazer's ATK to a single enemy and any adjacent enemies.";
			if(i==3)return "[Stardust Ace] : Farewell Hit deals Physical DMG equal to 300% of the Trailblazer's ATK to a single enemy.";
			if(i==4)return "[Perfect Pickoff] : Each time this character inflicts Weakness Break on an enemy, ATK increases by 10%(max 2 times).";
			if(i==5)return "[Immortal Third Strike] : Immediately heals all allies for 15% of their respective Max HP after using this Technique.";

		case 'trailblazer_1':
			if(i==1)return "[Ice-Breaking Light] : Deals Fire DMG equal to 50% of the Trailblazer's ATK to a single enemy and gains 1 stack of Magma Will.";
			if(i==2)return "[Ever-Burning Amber] : Increases the Trailblazer's DMG Reduction by 40% and gains 1 stack of Magma Will.";
			if(i==3)return "[War-Flaming Lance] : Deals Fire DMG equal to 50% of the Trailblazer's ATK plus 75% of the Trailblazer's DEF to all enemies.";
			if(i==4)return "[Treasure of the Architects] : Each time the Trailblazer is hit, they gain 1 stack of Magma Will for a max of 8 stack(s).";
			if(i==5)return "[Call of the Guardian] : Gains a Shield that absorbs DMG equal to 30% of the Trailblazer's DEF plus 384 for 1 turn(s).";

		case 'dan_heng_IL':
			if(i==1)return "[Beneficent Lotus] : Uses a 7-hit attack and deals Imaginary DMG equal to 250% of Dan Heng.";
			if(i==2)return "[Dracore Libre] : Enhances Basic ATK.";
			if(i==3)return "[Azure's Aqua Ablutes All] : Uses a 3-hit attack and deals Imaginary DMG equal to 180% of Dan Heng.";
			if(i==4)return "[Righteous Heart] : After each hit dealt during an attack, Dan Heng • Imbibitor Lunae gains 1 stack of Righteous Heart.";
			if(i==5)return "[Heaven-Quelling Prismadrakon] : Enters the Leaping Dragon state for 20 seconds.";

		case 'lynx':
			if(i==1)return "[Ice Crampon Technique] : Deals Quantum DMG equal to 25% of this character's Max HP to a single enemy.";
			if(i==2)return "[Salted Camping Cans] : Applies 'Survival Response' to a single target ally and increases their Max HP by 5% . ";
			if(i==3)return "[Snowfield First Aid] : Dispels 1 debuff(s) from all allies and immediately restores their respective HP.";
			if(i==4)return "[Outdoor Survival Experience] :  Applies continuous healing to the target ally for 2 turn(s).";
			if(i==5)return "[Chocolate Energy Bar] :  All allies are granted her Talent's continuous healing effect, lasting for 2 turn(s).";

		case 'fu_xuan':
			if(i==1)return "[Novaburst] : Deals Quantum DMG equal to 25% of Fu Xuan's Max HP to a single enemy.";
			if(i==2)return "[Known by Stars, Shown by Hearts] : Other team members will Distribute 65% of the DMG they receive. ";
			if(i==3)return "[Woes of Many Morphed to One] : Deals Quantum DMG equal to 60% of Fu Xuan's Max HP to all enemies.";
			if(i==4)return "[Bleak Breeds Bliss] : When Fu Xuan's current HP falls to 50% of her Max HP or less, HP Restore will be triggered.";
			if(i==5)return "[Of Fortune Comes Fate] :  After the Technique is used, all team members receive a Barrier, lasting for 20 seconds.";
	}

}

