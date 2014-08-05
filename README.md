testcard.html
--------------

Static HTML5 page. Helping to calibrate projection before a talk.

Author :  [Xavier "dascritch" Mouton-Dubosc](http://dascritch.com)

Inspired by an original design by [Ryan Gilmore](http://www.urbanspaceman.net/urbanspaceman/index.php?/print/tv-test-card/)

Version 0.3pre

WARNING
-------
Browsers are not acurate viedo renderers. Do not use it for professionnal broadcast or on-air tuning : you may experience lot of bugs, lags and others !
This code is only for testing video-projections before talks, and also unveils some rendering bugs on browsers

Known bugs
----------
* The « dppx » value on Safari desktop is not accurate when zooming

TODO
----
* slide script generator
* audio sync addon
* audio sync chart sync on https://www.youtube.com/watch?v=kxopViU98Xo
* dynamic slide source (option `capture` sadly not working)

Parameters
----------
Those values are globals or by scene.
* `back` : colour of the background in #RGB value. neutral gray by default.
* `img` : URL for the background image
* `video` : URL for the video. Autoplayed
* `youtube` : ID for a Youtube video.
* `vimeo` : ID for a Vimeo video.
* `capture` : Mirorring the webcam
* `charts` : displayed charts. No more than 3 or 4
* `time` : time format
* `countdownfor` : TODO time displayed is a countdown for the indicated unix timestamp
* `synctop` : TODO parameters for the `synctop` chart

Licence
-------

Code by Xavier "dascritch" Mouton-Dubosc

Design derivated from Ryan Gilmore, rights to be cleared

Versions
--------
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
