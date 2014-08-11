testcard.html
--------------

Static HTML5 page. Helping to calibrate projection before a talk.

Author :  [Xavier "dascritch" Mouton-Dubosc](http://dascritch.com)

Orignially inspired by a design by [Ryan Gilmore](http://www.urbanspaceman.net/urbanspaceman/index.php?/print/tv-test-card/)

Version 0.3pre

[You can touch, you can try](http://dascritch.github.io/testcard.html/)

WARNING
-------
Browsers are not acurate video renderers. Do not use it for professionnal broadcast or on-air tuning : you may experience lot of bugs, lags and others critters !
This code is only for testing video-projections before talks, and also unveils some rendering bugs on browsers

Parameters
----------
Those values are globals or by scene.

|Attribute|Value                                              |Default|
|---------|---------------------------------------------------|-------|
|`back`   |Colour of the background in RGB-hex value.         |'777777'|
|`img`    |URL for the background image                       ||
|`video`  |URL for the video. Autoplayed                      ||
|`youtube`|ID for a Youtube video                             ||
|`vimeo`  |ID for a Vimeo video                               ||
|`capture`|Mirorring the webcam                               ||
|`charts` |displayed charts. No more than 3 or 4              |['contrast', 'sharpness', 'colour']|
|`time`   | time format                                       |'hh:mm:ss'|
|`countdownfor`|TODO time displayed is a countdown for the indicated unix timestamp'contrast', 'sharpness', 'colour'||
|`sound`  |test sound. should be { "wave":"sine","hz":"1000" }            |''|
|`synctop`|TODO parameters for the `synctop` chart            ||

Those values are purely global and cannot be changed per scene

|Attribute|Value                                              |Default|
|---------|---------------------------------------------------|-------|
|`labels` |List of tags for each chart                        |British english|
|`stylesheet`|URL of a special crafted style, better use including the original one|'./testcard.css'|
|`colours`|list of RGB-hex values for squares in colour chart. 7 cells up then 7 cells down.||
|`contrasts`|list of RGB-hex values for squares in contrast chart. As the previous one||

Known bugs
----------
* The « dppx » value on Safari desktop is not accurate when zooming
* Sub-rendering issues on SVG on Firefox, you can see in sharpness charts, on odd/even sizes
* countdown not ready yet
* capture mode (webcam) not ready yet
* synctop won't work accurately on chromium and old webkits

TODO
----
* slide script generator
* audio sync addon
* audio sync chart sync on https://www.youtube.com/watch?v=kxopViU98Xo
* dynamic slide source (option `capture` sadly not working).
 * audio vu-meter a la <http://www.html5audio.org/2012/09/visualizing-audio-elements-with-the-web-audio-api.html> , espacially <http://jsbin.com/eheyim>

Licence
-------

Code by [Xavier "dascritch" Mouton-Dubosc](http://dascritch.com)

Design derivated from [Ryan Gilmore](http://www.urbanspaceman.net/), rights to be cleared

Versions
--------
* August 2014 : 0.3 , full parametric and layout auto-constructive
* July 2014 : 0.2 , json parameters embeded in html.
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
