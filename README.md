testcard.html
--------------

Static HTML5 page. Helping to calibrate projection before a talk.

Author :  [Xavier "dascritch" Mouton-Dubosc](http://dascritch.com)

Originally inspired by a design by [Ryan Gilmore](http://www.urbanspaceman.net/urbanspaceman/index.php?/print/tv-test-card/)

Version 0.3pre

[You can touch, you can try](http://dascritch.github.io/testcard.html/)

Disclaimer
----------
This code is only intented for testing video-projections before talks, and also unveils some rendering bugs on browsers.

Browsers are not acurate video renderers. Do not use it for professionnal broadcast or on-air tuning : you may experience lot of bugs, lags and others critters ! If you need a real testcard, you should play it via direct output or use a special generator. 

Howto
-----
Create a minimalist HTML page.
```html
<!doctype html>
<meta charset="utf-8" />
<script src="testcard.js"></script>
<script type="text/json">
{
	"default" : {
		( your global parameters)
	},
	"scenes" : [
	    { ( first scene parameters) },{ ( second scene parameters) },…
	]
}
</script>
```

That's the whole you need, just beware that the JSON section is strictly valid.

You can have as many html files with its own parameters in the same directory as you want. Easiest to have a collection of tests.

Parameters
----------
Those values are global or by scene.

|Attribute|Value                                              |Default|
|---------|---------------------------------------------------|-------|
|`back`   |Colour of the background in RGB-hex value.         |`"777777"`|
|`img`    |URL for the background image                       |omitted|
|`video`  |URL for the video. Autoplayed                      |omitted|
|`youtube`|ID for a Youtube video. Example : `"kxopViU98Xo"`  |omitted|
|`vimeo`  |ID for a Vimeo video. Example : `"70580647"`       |omitted|
|`capture`|Mirorring the webcam. Write `"capture":true`       |omitted|
|`charts` |displayed charts. No more than 3 or 4              |`["contrast", "sharpness", "colour"`]|
|`time`   | time format                                       |`"hh:mm:ss"`|
|`countdownfor`|time displayed is a countdown for the next indicated hour, today or tomorrow. Format should be `"hh:mm:ss"`|omitted|
|`sound`  |test sound. should be `{"wave":"sine","freq":1000}`            |omitted|
|`synctop`|time lengths in milliseconds for the `synctop` chart. should be `{"loop":2000,"length":100}`    |omitted|

Availables `charts` :
* `contrast`, `colour`, `red`, `blue`, `green`
* `sharpness`, `sharpnessh`, `sharpnessv`
* `time` : format is dictated by `time` and `countdownfor` parameters
* `synctop`

Those values are purely global and cannot be changed per scene

|Attribute|Value                                              |Default|
|---------|---------------------------------------------------|-------|
|`labels` |List of tags for each chart                        |British english|
|`stylesheet`|URL of a special crafted style, better use including the original one|`"./testcard.css"`|
|`colours`|list of RGB-hex values for squares in colour chart. 7 cells up then 7 cells down.||
|`contrasts`|list of RGB-hex values for squares in contrast chart. As the previous one||
|`overscans`|list of arrow form descriptions for unsafe overscan edges||

Known bugs
----------
* The « *dppx* » value on Safari desktop is not accurate when zooming
* Sub-rendering issues on SVG on Firefox, you can see in sharpness charts, on odd/even sizes
* Chrome, Safari and other webkit engines won't let you use capture (webcam, micro) on local files. Firefox accepts it.

TODO
----
* Capture mode on webkits
* YUV and other special colorspaces, with degradees
* slide script generator
* audio sync chart synced with a local video. [*This* kind of video](https://www.youtube.com/watch?v=kxopViU98Xo)
* audio from a stream.
* audio vu-meter a la <http://www.html5audio.org/2012/09/visualizing-audio-elements-with-the-web-audio-api.html> , especially <http://jsbin.com/eheyim>

Licence
-------

Code by [Xavier "dascritch" Mouton-Dubosc](http://dascritch.com)

Design derivated from [Ryan Gilmore](http://www.urbanspaceman.net/), rights to be cleared

Versions
--------
* August 2014 : 0.3
  * full parametric
  * layout auto-constructive
  * minimal html 
  * synctop 
  * correct countdown
  * capture
* July 2014 : 0.2
  * json parameters embeded in html
  * video inclusion from URL, youtube, vimeo
* June 2014 : 0.1 , first release.
  * static html.
  * Contrast, h-sharpness, colours charts
  * Viewport resolution and dppx
  * Unsafe overscan zone

Keeping in touch
----------------
* professional : <http://dascritch.com>
* blog : <http://dascritch.net>
* twitter : [@dascritch](https://twitter.com/dascritch)
