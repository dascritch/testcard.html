function testcard_pixels_check() {
	document.getElementById('pixels_horizontal').innerHTML = window.innerWidth;
	document.getElementById('pixels_vertical').innerHTML = window.innerHeight;
	document.getElementById('pixels_ratio').innerHTML = window.devicePixelRatio.toFixed(2);
}

testcard_pixels_check();
window.addEventListener('resize',testcard_pixels_check)

var data = document.querySelector('script[type="text/json"]');
var main = document.querySelector('main');
var parameters;
if (data !== null) {
	parameters = JSON.parse(data.innerHTML);
}
var index = 0;
var scenesTypes = ['img','youtube','video'];

function mergewith(obj1,obj2) {
	for(var i in obj2) {
		obj1[i] = obj2[i];
	}
	return obj1;
}

var defaults = {
	back : '#777777'
}

for (var index in parameters.scenes) {
	console.log( parameters.default , parameters.scenes[index], parameters.default + parameters.scenes[index])
	var scene = mergewith( defaults , mergewith( parameters.default , parameters.scenes[index]) );
	if (scene.back !== undefined) {
		main.style.backgroundColor = scene.back;
	}
	for (var t in scenesTypes) {
		var mode = scenesTypes[t];
		if (scene[mode] !== undefined) {
			switch (mode) {
					/*
				case 'img' :
					main.innerHTML = '<img src="'+scene.img+'" alt="" class="fullCroped" />';
					break;
				case 'video' :
					main.innerHTML = '<video src="'+scene.video+'" autoplay class="fullAdapt"></video>';
					break;
					*/
			}
		}
	}
}