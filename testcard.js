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
			time		: "hh:mm:ss",
			// here is how to change chart names. NOTE this is only for default, never for scenes
			labels				: {
				'contrast'		: 'Contrast',
				'sharpness'		: 'Sharpness',
				'sharpnessh'	: 'Sharpness',
				'sharpnessv'	: 'Sharpness',
				'colour'		: 'Colour',
				'time'			: ' ',
			},
			stylesheet	: "testcard.css",
			// yep, you can even change chart ranges. NOTE this is only for default, never for scenes
			colours		: [	'0000c0', 'c00000', 'c000c0', '00c000', '00c0c0', 'c0c000', 'c0c0c0' ,
							'000000', '2b2b2b', '555555', '808080', 'aaaaaa', 'd4d4d4', 'ffffff' ],
			contrasts	: [	'252525', '202020', '1a1a1a', '131313', '0d0d0d', '060606', '000000' ,
							'ffffff', 'f9f9f9', 'f2f2f2', 'ececec', 'e6e6e6', 'dfdfdf', 'd9d9d9' ],

		},
		available_scenes	: ['img','video','youtube','vimeo','capture'],
		parameters			: {},
		scene				: {},
		main				: null,
		scene_index			: 0,
		timer_interrupts	: false,
		countdown			: false,
		timezoneoffset		: 0,
		chart_squsize 		: 40,
		scene_element		: null,
		mergeArrays : function (obj1,obj2) {
			var i, out = {};
			for(i in obj1) {
				out[i] = obj1[i];
			}
			for(i in obj2) {
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
			var ms = Date.now();
			var unix = Math.floor(ms / 1000 );

			if (TC.countdown !== false ) {
				ms = Math.abs(TC.countdown - ms);
			}

			var out;
			var cs = Math.floor((ms % 1000) / 10 );
			var s = unix %60;
			var m = Math.floor(unix / 60 ) %60;
			var h = Math.floor( (unix / 3600  )- TC.timezoneoffset) %24 ;
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
					out = unix;
			}
			document.getElementById('timer').textContent = out;
		},
		append : function (el,nom,attributs,inner) {
			// this function was explained here : http://dascritch.net/post/2011/10/04/jQuery-pour-SVG-%3A-How-To-ins%C3%A9rer-un-%C3%A9l%C3%A9ment
			var created = document.createElement(nom);
			for (var cle in attributs) {
				var valeur = attributs[cle];
				created.setAttribute(cle,valeur);
			}
			el.appendChild(created);
			if (inner !== undefined) {
				created.innerHTML = inner;
			}
			return created;
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
			function classname(cl) {
				return cl % 2 === 0 ? "test_sharpnessO" : "test_sharpnessI";
			}
			var elb = document.querySelector('#sharpness svg');
			var elh = document.querySelector('#sharpnessh svg');
			var elv = document.querySelector('#sharpnessv svg');
			var x = 0;
			var cl = 0;
			var pars = {
					'y'			: 0,
					'width'		: this.chart_squsize *7,
					'height'	: this.chart_squsize *2
				};
			while (x<280) {
				pars.x = x;
				pars['class'] = classname(cl);
				this.appendSvg(elh,'rect',pars);
				this.appendSvg(elb,'rect',pars);
				cl++;
				x += Math.floor(x / this.chart_squsize) +1;
			}
			var y;
			for (x=0 ; x<=6 ; x++) {
				y = 0;
				cl = 0;
				pars.x = x * this.chart_squsize;
				while (y< (this.chart_squsize *2)) {
					pars.y = y;
					pars['class'] = classname(cl);
					this.appendSvg(elv,'rect',pars);
					if (y <= this.chart_squsize) {
						pars.y = y + this.chart_squsize;
						this.appendSvg(elb,'rect',pars);
					}
					y += x+1;
					cl++;
				}
			}
		},
		build_squares : function(chartname,range) {
			var chartzone = document.querySelector('#'+chartname+' svg');
			for (var c in range) {
				this.appendSvg(chartzone,'rect', {
					x		: 0 + this.chart_squsize * (c%7),
					y		: this.chart_squsize * Math.floor(c/7),
					width	: this.chart_squsize * 7,
					height	: this.chart_squsize * 2,
					fill	:'#'+range[c]
				});
			}
		},
		build_colours : function() {
				this.build_squares('colour',this.defaults.colours);
				this.build_squares('contrast',this.defaults.contrasts);
				var chart_contrast = document.querySelector('#contrast svg');
				var magic_circles = { '0':6, '6':0, '7':13, '13':7};
				for (var i in magic_circles) {
					var c = magic_circles[i];
					this.appendSvg(chart_contrast,'circle', {
						cx		: this.chart_squsize * ( (c%7) + 0.5),
						cy		: this.chart_squsize * (Math.floor(c/7) +0.5),
						r		: this.chart_squsize / 4,
						fill	:'#'+this.defaults.contrasts[i]
					});
				}
		},
		build_timer : function() {
			var chartzone = document.querySelector('#time svg');
			this.appendSvg(chartzone,'text', {
						x	: this.chart_squsize * 3.5,
						y	: this.chart_squsize * 1.3, // yep, it's piggy-pinched
						id	: 'timer'
					});
		},
		build : function() {
			//this.append(document.body,'meta', { charset : "utf-8" });
			this.append(document.body,'link', { rel : "stylesheet" ,  href : this.default.stylesheet });

			this.main = this.append(document.body,'main');
			this.append(document.body,'section',{id:'rez'});
			this.append(document.getElementById('rez'),'p',{},'display <var id="pixels_horizontal">000</var> × <var id="pixels_vertical">000</var> — <var id="pixels_ratio">1</var> dppx');

			var chartzone = this.append(document.body,'section',{ id:'charts' });
			var p;
			for (var c in this.default.labels) {
				p = this.append(chartzone,'p',{ id:c });
				this.append(p,'span',{},this.default.labels[c]);
				this.appendSvg(p,'svg',{ width:280, height:80 });
			}
			this.build_sharpness();
			this.build_colours();
			this.build_timer();

			var aside = this.append(document.body,'aside');
			var asides = {
				"overscan-top"		: "20,0 0,40 40,40",
				"overscan-left"		: "0,20 40,0 40,40",
				"overscan-right"	: "40,20 0,0 0,40",
				"overscan-bottom"	: "20,40 0,0 40,0",
			};
			for (var edge in asides) {
				var canv = this.appendSvg(
						this.append(aside,'div',{id:edge}),
						'svg');
				//canv.viewBox = "0,0 40,40";
				this.appendSvg(
					canv,
					'polygon',{points:asides[edge]}
				);
			}


			var d = new Date();
			this.timezoneoffset = d.getTimezoneOffset() / 60;
		},
		screen : function() {
			// setting background
			if ( (this.scene_element !== null) && (typeof this.scene_element.remove === 'function') ) {
				this.scene_element.remove()
			}
			// this one for MSIE
			this.main.innerHTML = '';

			this.main.style.backgroundColor = this.scene.back;

			for (var chart_name in this.default.labels) {
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
							this.scene_element = this.append(this.main,'img',{
								src			: this.scene.img,
								'class'		: 'fullCroped',
							});
							break;
						case 'video' :
							this.scene_element = this.append(this.main,'video',{
								src			: this.scene.video,
								autoplay	: true,
								'class'		: 'fullAdapt',
							});
							break;
						case 'youtube' :
							this.scene_element = this.append(this.main,'iframe',{
								width		: '100%',
								height		: '100%',
								src			: 'http://www.youtube-nocookie.com/embed/'+this.scene.youtube+'?rel=0',
								frameborder	: 0
							});
							break;
						case 'vimeo' :
							this.scene_element = this.append(this.main,'iframe',{
								width		: '100%',
								height		: '100%',
								src			: 'http://player.vimeo.com/video/'+this.scene.vimeo,
								frameborder	: 0
							});
							break;
						case 'capture' :
							this.scene_element = this.append(this.main,'video',{
								id			: 'playback',
								'class'		: 'fullAdapt',
							});
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
										this.scene_element.mozSrcObject = stream;
									} else {
										var vendorURL = window.URL || window.webkitURL;
										this.scene_element.src = vendorURL.createObjectURL(stream);
										this.scene_element.play();
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
			this.scene = this.mergeArrays( this.default, this.parameters.scenes[this.scene_index]);
			this.screen();
		},
		previous : function() {
			var self = TC;
			self.scene_index = self.scene_index < 0 ? self.parameters.scenes.length : --self.scene_index;
			self.play();
		},
		next : function() {
			var self = TC;
			self.scene_index = self.scene_index > self.parameters.scenes.length ? 0 : ++self.scene_index;
			self.play();
		},
		keyboard : function(event) {
			switch ( event.keyCode ) {
				case 37 :
					TC.previous();
					break;
				case 39 :
					TC.next();
					break;
			}
		}
	}

	function go() {
		var data = document.querySelector('script[type="text/json"]');
		if (data !== null) {
			TC.parameters = JSON.parse(data.innerHTML);
			TC.default = TC.mergeArrays( TC.defaults , TC.parameters );
		}
		TC.build();
		TC.play();
		TC.pixels_check();
		document.addEventListener('keydown',TC.keyboard);
		document.getElementById('overscan-left').addEventListener('click',TC.previous);
		document.getElementById('overscan-right').addEventListener('click',TC.next);
		window.addEventListener('resize',TC.pixels_check)
	}

	window.addEventListener('DOMContentLoaded',go);

})();