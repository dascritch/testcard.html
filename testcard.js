// Author : Xavier “dascritch” Mouton-Dubosc http://dascritch.com
// Inspired by an original design by Ryan Gilmore http://www.urbanspaceman.net/urbanspaceman/index.php?/print/tv-test-card/
// Licence still not cleared
// Repository : https://github.com/dascritch/testcard.html

(function(){
"use strict";

	var TC = {
		defaults : {
				back		: '#777777',
				charts		: ['contrast', 'sharpness', 'colour']
		},
		available_charts : ['contrast', 'sharpness', 'colour', 'time'],
		available_scenes : ['img','youtube','video'],
		parameters : {},
		main : document.querySelector('main'),
		scene_index : 0,
		timer_interrupts : false,
		mergeArrays : function (obj1,obj2) {
			var out = {};
			for(var i in obj1) {
				out[i] = obj1[i];
			}
			for(var i in obj2) {
				out[i] = obj2[i];
			}
			return out;
		},
		pixels_check : function() {
			document.getElementById('pixels_horizontal').innerHTML = window.innerWidth;
			document.getElementById('pixels_vertical').innerHTML = window.innerHeight;
			document.getElementById('pixels_ratio').innerHTML = window.devicePixelRatio.toFixed(2);
		},
		time_refresh : function() {
			var ms = Date.now();
			document.getElementById('timer').textContent = Math.floor(ms / 1000);
		},
		testcard : function(scene) {
			// setting background
			this.main.style.backgroundColor = scene.back;
			this.main.innerHTML='';

			for (var i in this.available_charts) {
				var chart_name = this.available_charts[i];
				var chart = document.getElementById(chart_name);
				chart.style.display = (scene.charts.indexOf(chart_name) === -1 ) ? 'none' : 'inline-block' ;
			}

			if ((scene.charts.indexOf('time') !== -1) && (this.timer_interrupts === false) ) {
				this.timer_interrupts = window.setInterval(TC.time_refresh,50)
			}

			if ((scene.charts.indexOf('time') === -1) && (this.timer_interrupts !== false) ) {
				window.clearInterval(this.timer_interrupts);
				this.timer_interrupts = false;
			}

			var has = false;
			for (var t in this.available_scenes) {
				var mode = this.available_scenes[t];
				if ((!has) && (scene[mode] !== undefined)) {
					switch (mode) {
						case 'img' :
							this.main.innerHTML = '<img src="'+scene.img+'" alt="" class="fullCroped" />';
							break;
						case 'video' :
							this.main.innerHTML = '<video src="'+scene.video+'" autoplay class="fullAdapt"></video>';
							break;
						case 'youtube' :
							this.main.innerHTML = '<iframe width="100%" height="100%" src="http://www.youtube-nocookie.com/embed/'+scene.youtube+'?rel=0" frameborder="0" allowfullscreen></iframe>';
							break;
					}
					has = true;
				}
			}
		},
		play : function() {
			var scene = this.mergeArrays( this.defaults ,
							 this.mergeArrays( this.parameters.default ,
							 	this.parameters.scenes[this.scene_index]) );
			this.testcard(scene);
		},
		keyboard : function(event) {
			var self = TC;
			switch ( event.keyCode ) {
				case 37 :
					self.scene_index = self.scene_index < 0 ? self.parameters.scenes.length : --self.scene_index;
					self.play();
					break;
				case 39 :
					self.scene_index = self.scene_index > self.parameters.scenes.length ? 0 : ++self.scene_index;
					self.play();
					break;
			}
		}
	}


	var data = document.querySelector('script[type="text/json"]');
	if (data !== null) {
		TC.parameters = JSON.parse(data.innerHTML);
	}

TC.play();
TC.pixels_check();

document.addEventListener('keydown',TC.keyboard);
window.addEventListener('resize',TC.pixels_check)


})();