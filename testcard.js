// Author : Xavier “dascritch” Mouton-Dubosc http://dascritch.com
// Inspired by an original design by Ryan Gilmore http://www.urbanspaceman.net/urbanspaceman/index.php?/print/tv-test-card/
// Licence still not cleared
// Repository : https://github.com/dascritch/testcard.html

(function(){
"use strict";

	var TC = {
		defaults : {
			back		: '#777777',
			charts		: ['contrast', 'sharpness', 'colour'],
			time		: "hh:mm:ss"
		},
		available_charts : ['contrast', 'sharpness', 'sharpnessh', 'sharpnessv', 'colour', 'time'],
		available_scenes : ['img','video','youtube','vimeo','capture'],
		parameters : {},
		scene : {},
		main : document.querySelector('main'),
		scene_index : 0,
		timer_interrupts : false,
		countdown : false,
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
		twodigits : function(num) {
			return num<10 ? ('0' + num) : num;
		},
		time_refresh : function() {
			var d = new Date();
			var ms = Date.now();

			if (TC.countdown !== false ) {
				ms = Math.abs(TC.countdown - ms);
			}

			var out;
			var cs = Math.floor((ms % 1000) / 10 );
			var s = Math.floor(ms / 1000 ) %60;
			var m = Math.floor(ms / 60000 ) %60;
			var h = Math.floor( (ms / 3600000  )- d.getTimezoneOffset() / 60) %24 ;
			switch( TC.scene.time) {
				case 'hh:mm:ss' :
					out = TC.twodigits(h) +':' + TC.twodigits(m) + ':' + TC.twodigits(s);
					break;
				case 'hh:mm:ss:cc' :
					out = TC.twodigits(h) +':' + TC.twodigits(m) + ':' + TC.twodigits(s) + ':' + TC.twodigits(cs);
					break;
				case 'hh:mm:ss:ff' :
					out = TC.twodigits(h) +':' + TC.twodigits(m) + ':' + TC.twodigits(s) + ':' + TC.twodigits(Math.round(cs/4));
					break;
				case 'hexnolife' :
					out = Math.round(ms/25).toString(16).toUpperCase().substr(-6)
					if (out.length < 6 ) out = '000000'.substr(out.length) + out;
					break;
				case 'unix' :
				default:
					out = Math.floor(ms / 1000);
			}
			document.getElementById('timer').textContent = out;
		},
		appendSvg : function (el,nom,attributs) {
			// this function was explained here : http://dascritch.net/post/2011/10/04/jQuery-pour-SVG-%3A-How-To-ins%C3%A9rer-un-%C3%A9l%C3%A9ment
			var svg = document.createElementNS("http://www.w3.org/2000/svg",nom);
			for (var cle in attributs) {
				var valeur = attributs[cle];
				svg.setAttribute(cle,valeur);
			}
			el.appendChild(svg);
			return svg;
		},
		build_sharpness : function() {
			var elb = document.querySelector('#sharpness svg');
			var elh = document.querySelector('#sharpnessh svg');
			var elv = document.querySelector('#sharpnessv svg');
			var x = 0;
			var cl = 0;
			var pars = {
					'y'			: 0,
					'width'		: 280,
					'height'	: 80
				};
			while (x<280) {
				pars.x = x;
				pars['class'] = cl % 2 === 0 ? "test_sharpnessO" : "test_sharpnessI";
				this.appendSvg(elh,'rect',pars);
				this.appendSvg(elb,'rect',pars);
				cl++;
				x += Math.floor(x / 40) +1;
			}
			var y;
			for (x=0 ; x<=6 ; x++) {
				y = 0;
				cl = 0;
				pars.x = x * 40;
				while (y<80) {
					pars.y = y;
					pars['class'] = cl % 2 === 0 ? "test_sharpnessO" : "test_sharpnessI";
					this.appendSvg(elv,'rect',pars);
					pars.y = y + 40;
					this.appendSvg(elb,'rect',pars);
					y += x+1;
					cl++;
				}
			}
		},
		build : function() {
			this.build_sharpness();
		},
		screen : function() {
			// setting background
			this.main.style.backgroundColor = this.scene.back;
			this.main.innerHTML='';

			for (var i in this.available_charts) {
				var chart_name = this.available_charts[i];
				var chart = document.getElementById(chart_name);
				chart.style.display = (this.scene.charts.indexOf(chart_name) === -1 ) ? 'none' : 'inline-block' ;
			}

			if ((this.scene.charts.indexOf('time') !== -1) && (this.timer_interrupts === false) ) {
				this.timer_interrupts = window.setInterval(TC.time_refresh,50)
			}

			if ((this.scene.charts.indexOf('time') === -1) && (this.timer_interrupts !== false) ) {
				window.clearInterval(this.timer_interrupts);
				this.timer_interrupts = false;
			}

			this.countdown = false;
			if (this.scene.countdownfor !== undefined) {
								this.countdown = Date.parse(new Date().toISOString().substr(0,11) + TC.scene.countdownfor + 'Z') + (new Date().getTimezoneOffset() *60000 *2) ;
			}

			var has = false;
			for (var t in this.available_scenes) {
				var mode = this.available_scenes[t];
				if ((!has) && (this.scene[mode] !== undefined)) {
					switch (mode) {
						case 'img' :
							this.main.innerHTML = '<img src="'+this.scene.img+'" alt="" class="fullCroped" />';
							break;
						case 'video' :
							this.main.innerHTML = '<video src="'+this.scene.video+'" autoplay class="fullAdapt"></video>';
							break;
						case 'youtube' :
							this.main.innerHTML = '<iframe width="100%" height="100%" src="http://www.youtube-nocookie.com/embed/'+this.scene.youtube+'?rel=0" frameborder="0" allowfullscreen></iframe>';
							break;
						case 'vimeo' :
							this.main.innerHTML = '<iframe width="100%" height="100%" src="http://player.vimeo.com/video/'+this.scene.vimeo+'" frameborder="0" allowfullscreen></iframe>';
							break;
						case 'capture' :
							this.main.innerHTML = '<video id="playback" class="fullAdapt"></video>';
							var video = document.getElementById('playback');

							navigator.getMedia = ( navigator.getUserMedia ||
													navigator.webkitGetUserMedia ||
													navigator.mozGetUserMedia ||
													navigator.msGetUserMedia);

							navigator.getMedia(
								{
									video: true,
									audio: false
								},function(stream) {
									if (navigator.mozGetUserMedia) {
										video.mozSrcObject = stream;
									} else {
										var vendorURL = window.URL || window.webkitURL;
										video.src = vendorURL.createObjectURL(stream);
										video.play();
									}
								},
								function(err) {
									console.log("An error occured! " + err);
								});
							break;
					}
					has = true;
				}
			}
		},
		play : function() {
			this.scene = this.mergeArrays( this.defaults ,
							this.mergeArrays( this.parameters.default ,
								this.parameters.scenes[this.scene_index]) );
			this.screen();
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

	TC.build();
	TC.play();
	TC.pixels_check();

	document.addEventListener('keydown',TC.keyboard);
	window.addEventListener('resize',TC.pixels_check)

})();