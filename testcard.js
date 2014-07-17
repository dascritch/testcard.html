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

for (var index in parameters) {
	var scene = parameters[index];
	console.log('scene ' , index,scene)
	if (scene.video !== undefined) {
		main.innerHTML = '<video src="'+scene.video+'" autoplay></video>';
	}
}