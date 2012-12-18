/**
 * @plugin  jquery.lottery.js
 * @verison v1.1
 * @desc    lottery images frap display
 * @author  LongZhou
 * @mail    pancnlz@gmail.com
 * @github  https://github.com/JesonRondo/lottery
 */
(function($) {
    var settings = {
        frap: 12,           // animate frap
        result: 0,          // lottery result            
        continuance: 5000,  // continue time
        process_img: []     // process images, first one is default status
    };

    var step = 0;
    var $target = null;
    var cur_stauts = 0;

    var drawDefaultStatus = function() {
        var $img = $('<img>').attr('src', settings.process_img[0]);
        $target.append($img);
    };

    var preLoad = function() {
        var img = new Image(0, 0);
        for (var key in settings.process_img) {
            img.src = settings.process_img[key];
        }
    };

    $.fn.lotteryInit = function(options) {
        settings = $.extend(settings, options);

        // init bind target, must id
        $target = $(this);

        var initDisplay = function() {
            if (step < 1) { // params error
                return false;
            } else {        // default status
                drawDefaultStatus();
                return true;
            }
        };

        var init = function() {
            // init step
            step = settings.process_img.length;
            // init display
            initDisplay();
            // pre load images
            preLoad();
        };
        
        return this.each(function() {
            init();
        });
    };

    $.lotteryStart = function(result) {
        settings.result = result;

        var validity =  function() {
            // error result change to last status
            if (settings.result >= step) {
                settings.result = step - 1;
            }
            // needn't lottery
            if (settings.result === 0) {
                return false;
            }
            return true;
        };

        var start = function() {
            // validity result;
            if (!validity()) {
                return;
            }

            var timer = setInterval(function() {
                cur_stauts++;
                if (cur_stauts >= step) {
                    cur_stauts = 1;
                }
                $target.find('img').attr('src', settings.process_img[cur_stauts]);
            }, 1000 / settings.frap);

            setTimeout(function() {
                // stop uniform animate
                clearInterval(timer);

                // slow down
                var sepa = settings.process_img.length * 2;
                var timetotal = 0;

                var depart = 3;
                var slowsp = parseInt(step * depart, 10);
                var nowspeed = parseInt(1000 / settings.frap, 10);
                var acce = (1500 - nowspeed) / slowsp;

                var timestep = nowspeed;

                var stopline = (slowsp - 1) / depart * (depart - 2);
                var curline = 0;

                var slowAnimate = function(stop_flag) {
                    if (curline > stopline) {
                        if (cur_stauts === settings.result) {
                            return;
                        }
                    }

                    cur_stauts++;
                    if (cur_stauts >= step) {
                        cur_stauts = 1;
                    }
                    $target.find('img').attr('src', settings.process_img[cur_stauts]);
                    curline++;
                };

                for (var j = 0; j < slowsp; j++) {
                    timestep += acce * j;
                    setTimeout(slowAnimate, timestep);
                }
            }, settings.continuance);
        }();
    }
}(jQuery));