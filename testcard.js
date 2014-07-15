function testcard_pixels_check() {
	document.getElementById('pixels_horizontal').innerHTML = window.innerHeight;
	document.getElementById('pixels_vertical').innerHTML = window.innerWidth;
	document.getElementById('pixels_ratio').innerHTML = window.devicePixelRatio.toFixed(2);
}

testcard_pixels_check();
window.addEventListener('resize',testcard_pixels_check)