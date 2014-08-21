// Author : Xavier “dascritch” Mouton-Dubosc http://dascritch.com
// Inspired by an original design by Ryan Gilmore http://www.urbanspaceman.net/urbanspaceman/index.php?/print/tv-test-card/
// Licence still not cleared
// Repository : https://github.com/dascritch/testcard.html

(function(){
'use strict';

	/* manipulations utilities */

	function mergeArrays(obj1,obj2) {
		var i, out = {};
		for (i in obj1) {
			if (obj1.hasOwnProperty(i)) out[i] = obj1[i];
		}
		for (i in obj2) {
			if (obj2.hasOwnProperty(i)) out[i] = obj2[i];
		}
		return out;
	}

	function _obj(test) {
		return typeof test === 'object';
	}

	function _func(test) {
		return typeof test === 'function';
	}

	/* dom manipulations utilities */

	function appendAttr(element,attributs) {
		for (var cle in attributs) {
			if (attributs.hasOwnProperty(cle)) {
				var valeur = attributs[cle];
				element.setAttribute(cle,valeur);
			}
		}
	}

	function appendSvg(el,nom,attributs) {
		// this function was explained here : http://dascritch.net/post/2011/10/04/jQuery-pour-SVG-%3A-How-To-ins%C3%A9rer-un-%C3%A9l%C3%A9ment
		var svg = document.createElementNS('http://www.w3.org/2000/svg',nom);
		appendAttr(svg,attributs);
		el.appendChild(svg);
		return svg;
	}

	function append(el,nom,attributs,inner) {
		var created = document.createElement(nom);
		appendAttr(created,attributs);
		el.appendChild(created);
		if (inner !== undefined) {
			created.innerHTML = inner;
		}
		return created;
	}

	var self = {
		defaults : {
			back		: '777777',
			charts		: ['contrast', 'sharpness', 'colour'],
			time		: 'hh:mm:ss',
			// here is how to change chart names. NOTE this is only for default, never for scenes
			labels		: {
				'contrast'		: 'Contrast',
				'sharpness'		: 'Sharpness',
				'sharpnessh'	: 'Sharpness',
				'sharpnessv'	: 'Sharpness',
				'colour'		: 'Colour',
				'green'			: 'Green',
				'red'			: 'Red',
				'blue'			: 'Blue',
				'time'			: ' ',
				'synctop'		: 'Synchro'
			},
			stylesheet	: 'testcard.css',
			// yep, you can even change chart ranges. NOTE this is only for default, never for scenes
			colours		: [	'0000c0', 'c00000', 'c000c0', '00c000', '00c0c0', 'c0c000', 'c0c0c0' ,
							'000000', '2b2b2b', '555555', '808080', 'aaaaaa', 'd4d4d4', 'ffffff' ],
			contrasts	: [	'252525', '202020', '1a1a1a', '131313', '0d0d0d', '060606', '000000' ,
							'ffffff', 'f9f9f9', 'f2f2f2', 'ececec', 'e6e6e6', 'dfdfdf', 'd9d9d9' ],
			greens		: [	'00ff00', '00d400', '00aa00', '008000', '005500', '002b00', '000000' ,
							'ffffff', 'd4ffd4', 'aaffaa', '80ff80', '55ff55', '2bff2b', '00ff00' ],
			reds		: [	'ff0000', 'd40000', 'aa0000', '800000', '550000', '2b0000', '000000' ,
							'ffffff', 'ffd4d4', 'ffaaaa', 'ff8080', 'ff5555', 'ff2b2b', 'ff0000' ],
			blues		: [	'0000ff', '0000d4', '0000aa', '000080', '000055', '00002b', '000000' ,
							'ffffff', 'd4d4ff', 'aaaaff', '8080ff', '5555ff', '2b2bff', '0000ff' ],
			overscans	: {
				'top'		: '20,0 0,40 40,40',
				'left'		: '0,20 40,0 40,40',
				'right'		: '40,20 0,0 0,40',
				'bottom'	: '20,40 0,0 40,0',
			}
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
		chart_svg			: {},
		oscillator			: null,
		gainNode			: null,
		syncer_element		: null,
		syncbar_element		: null,
		offsync_animation	: 500,

		navigator			: window.navigator,

		pixels_check : function() {
			document.getElementById('pixels_horizontal').textContent = window.innerWidth;
			document.getElementById('pixels_vertical').textContent = window.innerHeight;
			document.getElementById('pixels_ratio').textContent = window.devicePixelRatio.toFixed(2);
		},

		colons : function(nums) {
			function twodigits(num) {
				return num<10 ? ('0' + num) : num;
			}

			var i, out = '';
			for (i in nums) {
				if (nums.hasOwnProperty(i))  out += (out === '' ? '' : ':') + twodigits(nums[i]);
			}
			return out;
		},
		time_refresh : function() {
			var ms = Date.now();

			if (self.countdown !== false ) {
				ms = Math.abs(self.countdown - ms);
			}
			var unix = Math.floor(ms /1E3 );
			var out;
			var cs = Math.floor((ms %1E3 ) / 10 );
			var s = unix %60;
			var m = Math.floor( unix/60 ) %60;
			var h = Math.floor( (unix/3600) - ( (self.countdown !== false ) ? 0 : self.timezoneoffset ) ) %24 ;
			switch( self.scene.time) {
				case 'hh:mm:ss' :
					out = self.colons([h,m,s]);
					break;
				case 'hh:mm:ss:cc' :
					out = self.colons([h,m,s,cs]);
					break;
				case 'hh:mm:ss:ff' :
					out = self.colons([h,m,s,Math.round(cs/4)]);
					break;
				case 'hexnolife' :
					out = Math.round(ms/25).toString(16).toUpperCase().substr(-6);
					if (out.length < 6) {
						out = '000000'.substr(out.length) + out;
					}
					break;
				//case 'unix' :
				default:
					out = unix;
			}
			document.getElementById('timer').textContent = out;
		},

		event_synctop : function() {
			if (!_obj( self.scene.synctop )) {
				return;
			}
			window.setTimeout(self.top_on, self.offsync_animation);
			window.setTimeout(self.top_off, self.offsync_animation + self.scene.synctop.length);
		},
		top_on : function() {
			if (self.gainNode !== null) {
				self.gainNode.gain.value = 0.5;
			}
			self.syncer_element.style.fill = '#ddd';
		},
		top_off : function() {
			if (self.gainNode !== null) {
				self.gainNode.gain.value = 0;
			}
			self.syncer_element.style.fill = '#333';
		},
		sound : function() {
			if (this.oscillator !== null) {
				this.oscillator.stop();
			}
			this.oscillator = null;
			this.gainNode = null;

			if ((this.scene.sound !== undefined) && (_obj( this.scene.sound ))) {
				var audioCtx = new window.AudioContext();

				// create Oscillator node
				this.oscillator = audioCtx.createOscillator();
				this.gainNode = audioCtx.createGain();
				this.oscillator.connect(this.gainNode);
				this.gainNode.connect(audioCtx.destination);

				this.oscillator.type = this.scene.sound.wave || 'sine';
				this.oscillator.frequency.value = this.scene.sound.freq || 1000;
				this.oscillator.start();
			}

			if (_obj( this.scene.synctop )) {
				this.scene.synctop.length = this.scene.synctop.length || 100;
				this.scene.synctop.loop = this.scene.synctop.loop || 2000;
				this.offsync_animation = this.scene.synctop.loop / 4;
				this.syncbar_element.setAttribute('width', Math.round(this.chart_squsize*7 * this.scene.synctop.length / this.scene.synctop.loop)+'px' );
				this.syncbar_element.setAttribute('x', Math.round(this.offsync_animation * this.chart_squsize*7 / this.scene.synctop.loop)+'px' );
				this.syncer_element.style.animationDuration = this.scene.synctop.loop +'ms';
				if (this.syncer_element.style.webkitAnimationDuration !== undefined) {
					// we have yet prefixed webkits
					this.syncer_element.style.webkitAnimationDuration = this.syncer_element.style.animationDuration;
				}
				this.top_off();
			} else {
				this.offsync_animation = 0;
				this.syncbar_element.setAttribute('width', this.chart_squsize*7 +'px');
				this.syncbar_element.setAttribute('x', '0px');
				this.top_on();
			}
		},

		screen_img : function() {
			this.scene_element = append(this.main,'img',{
				src			: this.scene.img,
				'class'		: 'fullCroped',
			});
		},
		screen_video : function() {
			this.scene_element = append(this.main,'video',{
				src			: this.scene.video,
				autoplay	: true,
				'class'		: 'fullAdapt',
			});
		},
		screen_youtube : function() {
			this.scene_element = append(this.main,'iframe',{
				width		: '100%',
				height		: '100%',
				src			: 'http://www.youtube-nocookie.com/embed/'+this.scene.youtube+'?rel=0',
				frameborder	: 0
			});
		},
		screen_vimeo : function() {
			this.scene_element = append(this.main,'iframe',{
				width		: '100%',
				height		: '100%',
				src			: 'http://player.vimeo.com/video/'+this.scene.vimeo,
				frameborder	: 0
			});
		},
		screen_capture : function () {
			if (_func( this.navigator.getUserMedia )) {
				this.navigator.getUserMedia(
					{
						video: true,
						audio: false
					},this.screen_capture_on,
					function(err) {
						console.info('Error on capture : ', err);
					});
			} else {
				console.info('Cannot capture webcam');
			}
		},
		screen_capture_on : function (stream) {
			var createSrc = window.URL ? window.URL.createObjectURL : function(stream) {return stream;};
			self.scene_element = append(self.main,'video',{
				id			: 'playback',
				'class'		: 'fullCroped',
			});
			if (_func( self.navigator.mozGetUserMedia )) {
				self.scene_element.mozSrcObject = stream;
			} else {
				self.scene_element.src = createSrc(stream);
			}
			self.scene_element.play();
		},
		screen : function() {
			// setting background
			if (this.scene_element !== null) {
				if (_func( this.scene_element.remove )) {
					this.scene_element.remove();
				} else {
					// ABSOLUTELY A BAD IDEA, but no way to get rid off phantomatic iframes
					delete this.scene_element;
				}
			}
			// this one for MSIE
			this.main.innerHTML = '';

			this.main.style.backgroundColor = '#'+this.scene.back;

			for (var chart_name in this.default.labels) {
				if (this.default.labels.hasOwnProperty(chart_name)) {
					var chart = document.getElementById(chart_name);
					chart.style.display = (this.scene.charts.indexOf(chart_name) === -1 ) ? 'none' : 'inline-block' ;
				}
			}

			if ((this.scene.charts.indexOf('time') !== -1) && (this.timer_interrupts === false) ) {
				this.timer_interrupts = window.setInterval(self.time_refresh,50);
			}

			if ((this.scene.charts.indexOf('time') === -1) && (this.timer_interrupts !== false) ) {
				window.clearInterval(this.timer_interrupts);
				this.timer_interrupts = false;
			}

			this.countdown = false;
			if (this.scene.countdownfor !== undefined) {
				var msperhour = 60 * 60 * 1E3;
				var offset = this.timezoneoffset * msperhour;
				var msperdays = 24 * msperhour;
				this.countdown = Date.parse(new Date().toISOString().substr(0,11) + self.scene.countdownfor + 'Z') + offset ;
				this.countdown += (this.countdown < (Date.parse(new Date()))) ? msperdays : 0 ;
			}

			this.sound();

			var has = false;
			this.available_scenes.forEach(function (mode) {
				if ( (!has) && (self.scene[mode] !== undefined) && (_func( self['screen_'+mode] )) ) {
					self['screen_'+mode]();
					has = true;
				}
			});
		},

		play : function() {
			self.scene_index = (window.location.hash === '') ? 0 : parseInt(window.location.hash.replace(/[^\d\-]/g,''),10);
			var target_scene = self.scene_index ;
			if (isNaN(target_scene)) {
				target_scene = 0;
			}
			var len = self.parameters.scenes.length;
			target_scene = ( (target_scene + len) % len );
			if (target_scene !== self.scene_index) {
				window.location.hash = ( target_scene === 0 ) ? '' : target_scene.toString();
				return;
			}
			self.scene = mergeArrays( self.default, self.parameters.scenes[self.scene_index]);
			self.screen();
		},

		previous : function() {
			window.location.replace('#'+( --self.scene_index ).toString());
		},
		next : function() {
			window.location.replace('#'+( ++self.scene_index ).toString());
		},
		event_keyboard : function(event) {
			switch ( event.keyCode ) {
				case 27 :
					window.history.go( -1 );
					break;
				case 35 :
					window.location.replace('#'+( self.parameters.scenes.length -1 ).toString());
					break;
				case 36 :
					window.location.replace('#');
					break;
				case 37 :
					self.previous();
					break;
				case 39 :
					self.next();
					break;
			}
		}
	};

	function build() {
		function build_sharpness() {
			function classname(cl) {
				return cl % 2 === 0 ? 'test_sharpnessO' : 'test_sharpnessI';
			}
			var x = 0;
			var cl = 0;
			var pars = {
					y		: 0,
					width	: self.chart_squsize *7,
					height	: self.chart_squsize *2
				};
			while (x < 280) {
				pars.x = x;
				pars['class'] = classname(cl);
				appendSvg(self.chart_svg.sharpnessh,'rect',pars);
				appendSvg(self.chart_svg.sharpness,'rect',pars);
				cl++;
				x += Math.floor( x / self.chart_squsize ) +1;
			}
			var y;
			for (x = 0 ; x <= 6 ; x++) {
				y = 0;
				cl = 0;
				pars.x = x * self.chart_squsize;
				while (y< (self.chart_squsize *2)) {
					pars.y = y;
					pars['class'] = classname(cl);
					appendSvg(self.chart_svg.sharpnessv,'rect',pars);
					if (y <= self.chart_squsize) {
						pars.y = y + self.chart_squsize;
						appendSvg(self.chart_svg.sharpness,'rect',pars);
					}
					y += x+1;
					cl++;
				}
			}
		}

		function build_squares(chartname) {
			var chartzone = self.chart_svg[chartname];
			function carre(color,c) {
				appendSvg(chartzone,'rect', {
					x		: 0 + self.chart_squsize * (c%7),
					y		: self.chart_squsize * Math.floor(c/7),
					width	: self.chart_squsize * 7,
					height	: self.chart_squsize * 2,
					fill	:'#' + color
				});
			}
			self.defaults[chartname+'s'].forEach(carre);
		}

		function build_colours() {
			['colour','contrast','green','red','blue'].forEach( build_squares );

			var magic_circles = { '0' : 6, '6' : 0, '7' : 13, '13' : 7 };
			for (var i in magic_circles) {
				if (magic_circles.hasOwnProperty(i)) {
					var c = magic_circles[i];
					appendSvg(self.chart_svg.contrast,'circle', {
						cx		: self.chart_squsize * ( (c % 7) + 0.5),
						cy		: self.chart_squsize * (Math.floor(c / 7) + 0.5),
						r		: self.chart_squsize / 4,
						fill	:'#'+self.defaults.contrasts[i]
					});
				}
			}
		}

		function build_timer() {
			var chartzone = self.chart_svg.time;
			appendSvg(chartzone,'text', {
					x	: self.chart_squsize * 3.5,
					y	: self.chart_squsize * 1.3, // yep, it's piggy-pinched
					id	: 'timer'
				});
		}

		function build_synctop() {
			var chartzone = self.chart_svg.synctop;
			appendSvg(chartzone,'rect', {
				x		: 0,
				y		: self.chart_squsize * 0.9,
				width	: self.chart_squsize * 7,
				height	: self.chart_squsize * 0.2,
				fill	: '#444'
			});
			self.syncbar_element = appendSvg(chartzone,'rect', {
				x		: 0,
				y		: self.chart_squsize * 0.9,
				width	: self.chart_squsize * 7,
				height	: self.chart_squsize * 0.2,
				fill	: '#ccc',
				id 		: 'syncbar'
			});
			self.syncer_element = appendSvg(chartzone,'polygon', {
				points	: '-10,0 10,0 0,38',
				fill	: '#ddd',
				id		: 'syncer'
			});

			[
				'animationstart', 'animationiteration',
				'webkitAnimationStart', 'webkitAnimationIteration',
				'MSAnimationStart', 'MSAnimationIteration'
			].forEach( function(event) {
				self.syncer_element.addEventListener(event, self.event_synctop, false);
			});
		}

		function build_unprefix_browsers() {
			if (!_func( self.navigator.getUserMedia )) {
				self.navigator.getUserMedia	= (
					self.navigator.webkitGetUserMedia ||
					self.navigator.mozGetUserMedia ||
					self.navigator.msGetUserMedia);
			}
		}

		function build_assets() {
			append(document.body,'link',{
				rel		: 'stylesheet' ,
				href	: self.default.stylesheet
			});
		}

		function build_layouts() {
			function build_labels() {
				var chartzone = append(document.body,'section',{ id : 'charts' });
				var p;
				for (var c in self.default.labels) {
					if (self.default.labels.hasOwnProperty(c)) {
						p = append(chartzone, 'p', { id : c });
						append(p, 'span', {}, self.default.labels[c]);
						self.chart_svg[c] = appendSvg(p, 'svg', {
							width	: self.chart_squsize*7,
							height	: self.chart_squsize*2
						});
					}
				}
			}

			function build_overscan() {
				var aside = append(document.body,'aside');
				for (var edge in self.default.overscans) {
					if (self.default.overscans.hasOwnProperty(edge)) {
						var canv = appendSvg(
								append(aside,'div',{ id : 'overscan-'+edge }),
								'svg');
						appendSvg( canv, 'polygon',{ points : self.default.overscans[edge] } );
					}
				}
			}

			self.main = append(document.body,'main');
			append(document.body,'section',{id:'rez'});
			append(document.getElementById('rez'),'p',{},
					'display <var id="pixels_horizontal">000</var> × <var id="pixels_vertical">000</var> — <var id="pixels_ratio">1</var> dppx');
			build_labels();
			build_overscan();
		}

		build_unprefix_browsers();
		build_assets();
		build_layouts();

		build_sharpness();
		build_colours();
		build_timer();
		build_synctop();

		self.timezoneoffset = new Date().getTimezoneOffset() / 60;
	}

	function go() {
		function fetch_params() {
			var data = document.querySelector('script[type="text/json"]');
			if (data !== null) {
				self.parameters = JSON.parse(data.innerHTML);
				self.default = mergeArrays( self.defaults , self.parameters );
			}
		}

		function set_ui_events() {
			window.addEventListener('hashchange',self.play);
			window.addEventListener('resize',self.pixels_check);
			document.addEventListener('keydown',self.event_keyboard);
			document.getElementById('overscan-left').addEventListener('click',self.previous);
			document.getElementById('overscan-right').addEventListener('click',self.next);
		}

		fetch_params();
		build();
		self.play();
		self.pixels_check();
		set_ui_events();
	}

	window.addEventListener('DOMContentLoaded',go);
})();