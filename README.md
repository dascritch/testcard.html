testcard.html
--------------

Static HTML5 page. Helping to calibrate projection before a talk.

Author :  [Xavier "dascritch" Mouton-Dubosc](http://dascritch.com)

Inspired by an original design by [Ryan Gilmore](http://www.urbanspaceman.net/urbanspaceman/index.php?/print/tv-test-card/)

Version 0.2

TODO
----
* vertical sharpness grid
* dynamic sharpness grid
* slide script generator
* audio sync addon
* audio sync chart sync on https://www.youtube.com/watch?v=kxopViU98Xo
* dynamic slide source (via webcapture)

Known bugs
----------
* The « dppx » value on Safari desktop is not accurate when zooming

Parameters
----------
Those values are globals or by scene.
* `back` : colour of the background in #RGB value. neutral gray by default.
* `img` : URL for the background image
* `video` : URL for the video. Autoplayed
* `charts` : TODO displayed charts. No more than 3 or 4
* `time` : TODO time format
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
