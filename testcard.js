(function(){
"use strict";

var defaults = {
		back		: '#777777',
		charts		: ["contrast" , "sharpness" , "colour"]
}

var available_charts = ["contrast", "sharpness", "colour", "time"];
var parameters;
var main = document.querySelector('main');
var data = document.querySelector('script[type="text/json"]');
var scene_index = 0;

function mergeArrays(obj1,obj2) {
	var out = {};
	for(var i in obj1) {
		out[i] = obj1[i];
	}
	for(var i in obj2) {
		out[i] = obj2[i];
	}
	return out;
}

function testcard_pixels_check() {
	document.getElementById('pixels_horizontal').innerHTML = window.innerWidth;
	document.getElementById('pixels_vertical').innerHTML = window.innerHeight;
	document.getElementById('pixels_ratio').innerHTML = window.devicePixelRatio.toFixed(2);
}

function testcard_time_refresh() {
	var ms = Date.now();
	document.getElementById('timer').textContent = Math.floor(ms / 1000);
}

function testcard(scene) {
	var scenesTypes = ['img','youtube','video'];

	// setting background
	main.style.backgroundColor = scene.back;
	main.innerHTML='';

	for (var i in available_charts) {
		var chart_name = available_charts[i];
		var chart = document.getElementById(chart_name);
		chart.style.display = (scene.charts.indexOf(chart_name) === -1 ) ? 'none' : 'inline-block' ;
	}

	var has = false;
	for (var t in scenesTypes) {
		var mode = scenesTypes[t];
		if ((!has) && (scene[mode] !== undefined)) {
			switch (mode) {
				case 'img' :
					main.innerHTML = '<img src="'+scene.img+'" alt="" class="fullCroped" />';
					break;
				case 'video' :
					main.innerHTML = '<video src="'+scene.video+'" autoplay class="fullAdapt"></video>';
					break;
				case 'youtube' :
					main.innerHTML = '<iframe width="100%" height="100%" src="http://www.youtube-nocookie.com/embed/'+scene.youtube+'?rel=0" frameborder="0" allowfullscreen></iframe>';
					break;
			}
			has = true;
		}
	}
}

function goto_scene(scene_index) {
	var scene = mergeArrays( defaults , mergeArrays( parameters.default , parameters.scenes[scene_index]) );
	testcard(scene);
}

function keyboard(event) {
	switch ( event.keyCode ) {
		case 37 :
			scene_index = scene_index < 0 ? parameters.scenes.length : --scene_index;
			goto_scene(scene_index);
			break;
		case 39 :
			scene_index = scene_index > parameters.scenes.length ? 0 : ++scene_index;
			goto_scene(scene_index);
			break;
	}
}

if (data !== null) {
	parameters = JSON.parse(data.innerHTML);
}

goto_scene(scene_index);
testcard_pixels_check();

document.addEventListener('keydown',keyboard);
window.addEventListener('resize',testcard_pixels_check)
window.setInterval(testcard_time_refresh,100)

})();