(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
require('./rAF.js')

var Animation = function (func) {
    this.func   = func
    this.on     = false
    this.paused = this.played = Date.now()
    this.v      = 1
    this.active = false
}
Animation.prototype = {
    play: function () {
        if (this.func && !this.on) {
            if (this.paused)
                this.played += (Date.now() - this.paused)
            loop.call(this)
            this.active = this.on = true
        }
    },
    pause: function () {
        if (this.func && this.on) {
            cancelAnimationFrame(this.id)
            this.active = this.on = false
            this.paused = Date.now()
        }
    },
    mute: function () {
        if (this.func && this.on) {
            cancelAnimationFrame(this.id)
            this.active = this.on = false
            this.paused = undefined
        }
    },
    stop: function () {
        if (this.func) {
            this.pause()
            this.paused = this.played = Date.now()
        }
    },
    seek: function (time) {
        if (this.func) {
            var now     = Date.now()
            this.played = now - time
            this.paused = now
        }
    },
    speed: function (v) {
        if(this.func && isFinite(v)) {
            if (v) {
                v = v / this.v
                var now         = Date.now()
                var diff_played = (now - this.played) / v
                this.played     = now - diff_played
                if (this.paused) {
                    var diff_paused = (now - this.paused) / v
                    this.paused     = now - diff_paused
                }
                this.v *= v
                if (this.active)
                    this.play()
            } else {
                this.pause()
                this.active = true
            }
        }
    },
    remove: function () {
    	if (this.func) {
            this.pause()
            delete this.func
        }
    },
}
function loop () {
    var now = Date.now()
    var frame = {
        time: (now - this.played) * this.v
    }
    this.func(frame)
    this.id = window.requestAnimationFrame(loop.bind(this))
}
module.exports = Animation
},{"./rAF.js":2}],2:[function(require,module,exports){
// http://paulirish.com/2011/requestanimationframe-for-smart-animating/
// http://my.opera.com/emoller/blog/2011/12/20/requestanimationframe-for-smart-er-animating
 
// requestAnimationFrame polyfill by Erik Möller. fixes from Paul Irish and Tino Zijdel
 
// MIT license
 
(function() {
    var lastTime = 0;
    var vendors = ['ms', 'moz', 'webkit', 'o'];
    for(var x = 0; x < vendors.length && !window.requestAnimationFrame; ++x) {
        window.requestAnimationFrame = window[vendors[x]+'RequestAnimationFrame'];
        window.cancelAnimationFrame = window[vendors[x]+'CancelAnimationFrame'] 
                                   || window[vendors[x]+'CancelRequestAnimationFrame'];
    }
 
    if (!window.requestAnimationFrame)
        window.requestAnimationFrame = function(callback, element) {
            var currTime = new Date().getTime();
            var timeToCall = Math.max(0, 16 - (currTime - lastTime));
            var id = window.setTimeout(function() { callback(currTime + timeToCall); }, 
              timeToCall);
            lastTime = currTime + timeToCall;
            return id;
        };
 
    if (!window.cancelAnimationFrame)
        window.cancelAnimationFrame = function(id) {
            clearTimeout(id);
        };
}());
},{}],3:[function(require,module,exports){
function Layer(options) {
	this.shapes    = []
	this.canvas    = document.createElement('canvas')
	this.canvas.style.position = 'absolute'
	this.canvas.style.top  = '0'
	this.canvas.style.left = '0'
    this.ctx       = this.canvas.getContext('2d')
}

var LayerProto = Layer.prototype

LayerProto.add = function (shape) {
	this.shapes.push(shape)
	shape.layer = this
}

LayerProto.draw = function (shape) {
	this.clear()
	this.shapes.forEach(function (shape) {
		shape.draw()
	})
}

var ua = window.navigator.userAgent
var native_android_browser = /android/i.test(ua) && ua.indexOf('534.30')

if (native_android_browser) {
	console.log('native_android_browser')
    LayerProto.clear = function (shape) {
    	this.ctx.clearRect(0, 0, this.width, this.height)
    	// if early version of android browser
    	// fix bug android browsers: 
    	// https://medium.com/@dhashvir/android-4-1-x-stock-browser-canvas-solution-ffcb939af758
    	this.canvas.style.display = 'none'
        this.canvas.offsetHeight
        this.canvas.style.display = 'inherit'
    }
} else {
	LayerProto.clear = function (shape) {
		this.ctx.clearRect(0, 0, this.width, this.height)
	}
}

LayerProto.remove = function (shape) {
	this.clear()
	this.shapes.forEach(function (shape) {
		delete shape.layer
	})
	this.shapes = []
}

module.exports = Layer
},{}],4:[function(require,module,exports){
function Circle(options) {
	this.shape = options
}

Circle.prototype.draw = function () {
	//console.log('draw circle')
	var shape = this.shape
	var layer = this.layer
	layer.ctx.beginPath()
	layer.ctx.arc(shape.x, shape.y, shape.radius, 0, 2 * Math.PI)
	layer.ctx.closePath()
	if (shape.fill) {
		layer.ctx.fillStyle = shape.fill
		layer.ctx.fill()
	}
}

Circle.prototype.setX = function (x) {
	this.shape.x = x
}

Circle.prototype.setY = function (y) {
	this.shape.y = y
}

module.exports = Circle
},{}],5:[function(require,module,exports){
function Stage (options) {
	this.layers    = []
	var container = this.container = document.getElementById(options.container)
	if (!container)
		throw new Error ('element #' + options.container + ' does not exist')
	var style = container.style
	style.position = 'relative'
	style.width  = options.width + 'px'
	style.height = options.height + 'px'
	style.overflow = 'hidden'
	this.width  = parseInt(options.width)
	this.height = parseInt(options.height)
}

Stage.prototype.add = function (layer) {
	var canvas = layer.canvas
	this.layers.push(layer)
	canvas.width  = layer.width  = this.width
	canvas.height = layer.height = this.height
	this.container.appendChild(canvas)
}

Stage.prototype.resize = function (dimensions) {
	var dim    = {}
	  , width  = parseInt(dimensions.width)
	  , height = parseInt(dimensions.height)
	  , style  = this.container.style
	if (isFinite(width)) {
		style.width  = width  + 'px'
		this.width   = width
	}
	if (isFinite(height)) {
		style.height = height + 'px'
		this.height  = height
	}
}

module.exports = Stage
},{}],6:[function(require,module,exports){
module.exports = {
  Animation: require('./Animation/Animation.js'),
  Stage:     require('./Canvas/Stage.js'),
  Layer:     require('./Canvas/Layer.js'),
  Circle:    require('./Canvas/Shape/Circle.js')
}


},{"./Animation/Animation.js":1,"./Canvas/Layer.js":3,"./Canvas/Shape/Circle.js":4,"./Canvas/Stage.js":5}],7:[function(require,module,exports){
module.exports = require('./src/siteswap-generator')
},{"./src/siteswap-generator":8}],8:[function(require,module,exports){
function copyObject (obj) {
    var o = {}
    for (var key in obj) {
        o[key] = obj[key]
    }
    return o
}

function siteswapGenerator (balls, period, height) {
    var patterns = []

    if (typeof balls === 'number')
        balls = {max: balls}
    if (balls.min === undefined)
        balls.min = balls.max

    if (typeof period === 'number')
        period = {max: period}
    if (period.min === undefined)
        period.min = 1

    if (height === undefined)
        height = {max: period.max * balls.max}
    else if (typeof height === 'number')
        height = {max: height}
    else if (typeof height.max !== 'number')
        height.max = period.max * balls.max
    if (height.min === undefined)
        height.min = 0

    console.log(balls, period, height)

    for (var b = balls.max; b >= balls.min; --b) {
        var heightMax, heightMin
        var periodMin = Math.max(period.min, 2)
        for (var p = period.max; p >= periodMin; --p) {
            heightMax = Math.min(height.max, p * b)
            heightMin = Math.max(height.min, b + 1)

            for (var h = heightMax; h >= heightMin; --h) {
                specificPatterns(b, p, h, patterns)
            }
        }
        if (period.min <= 1 && 1 <= period.max && height.min <= b && b <= height.max)
            patterns.push([b])
    }

    return patterns
}

function specificPatterns(balls, period, top, patterns) {
    if (period === 1 && balls === top) {
        patterns.push([balls])
    } else {
        var used = {}
        used[top % period] = true
        recursive(period, top, used, {
            array : [top],
            index : 0,
            pos   : 1,
            rest  : balls * period - top
        }, patterns)
    }
}

function recursive(period, top, used, pattern, patterns) {
    if (pattern.pos < period) {
        var n   = period - pattern.pos
        var val = pattern.array[pattern.index]

        var max = Math.min(val, pattern.rest)
        var min = pattern.rest - top * (n - 1)
        if (n > 1) min++
        min = Math.max(min, 0)
        for (var i = max; i >= min; --i) {
            var index = val > i ? 0 : pattern.index + 1
            var num = (i + pattern.pos) % period
            if (used[num] === undefined) {
                var newUsed  = copyObject(used)
                newUsed[num] = true
                recursive(period, top, newUsed, {
                    array: pattern.array.concat([i]),
                    index: index,
                    pos:   pattern.pos + 1,
                    rest:  pattern.rest - i
                }, patterns)
            }
        }
    } else {
        if (pattern.index === 0) {
            patterns.push(pattern.array)
        }
    }
}

module.exports = siteswapGenerator
},{}],9:[function(require,module,exports){
var hasOwn = Object.prototype.hasOwnProperty;
var toString = Object.prototype.toString;
var undefined;

var isPlainObject = function isPlainObject(obj) {
	'use strict';
	if (!obj || toString.call(obj) !== '[object Object]') {
		return false;
	}

	var has_own_constructor = hasOwn.call(obj, 'constructor');
	var has_is_property_of_method = obj.constructor && obj.constructor.prototype && hasOwn.call(obj.constructor.prototype, 'isPrototypeOf');
	// Not own constructor property must be Object
	if (obj.constructor && !has_own_constructor && !has_is_property_of_method) {
		return false;
	}

	// Own properties are enumerated firstly, so to speed up,
	// if last one is own, then all properties are own.
	var key;
	for (key in obj) {}

	return key === undefined || hasOwn.call(obj, key);
};

function extend() {
	'use strict';
	var options, name, src, copy, copyIsArray, clone,
		target = arguments[0],
		i = 1,
		length = arguments.length,
		deep = false;

	// Handle a deep copy situation
	if (typeof target === 'boolean') {
		deep = target;
		target = arguments[1] || {};
		// skip the boolean and the target
		i = 2;
	} else if ((typeof target !== 'object' && typeof target !== 'function') || target == null) {
		target = {};
	}

	for (; i < length; ++i) {
		options = arguments[i];
		// Only deal with non-null/undefined values
		if (options != null) {
			// Extend the base object
			for (name in options) {
				src = target[name];
				copy = options[name];

				// Prevent never-ending loop
				if (target === copy) {
					continue;
				}

				// Recurse if we're merging plain objects or arrays
				if (deep && copy && (isPlainObject(copy) || (copyIsArray = Array.isArray(copy)))) {
					if (copyIsArray) {
						copyIsArray = false;
						clone = src && Array.isArray(src) ? src : [];
					} else {
						clone = src && isPlainObject(src) ? src : {};
					}

					// Never move original objects, clone them
					target[name] = extend(deep, clone, copy);

				// Don't bring in undefined values
				} else if (copy !== undefined) {
					target[name] = copy;
				}
			}
		}
	}

	// Return the modified object
	return target;
};

module.exports = extend
},{}],10:[function(require,module,exports){
var Kinema = require('kinemajs')
var extend = require('./extend.js')

var Juggler = (function () {

    var abc = "abcdefghijklmnopqrstuvwxyz"
    var nums = {}
    for (var i = 0; i < 10; ++i) {
        nums[i] = i
    }
    for (var i = 0; i < abc.length; ++i) {
        nums[abc[i]] = i + 10
    }

    function recalculate (attrs, maximum) {
        var juggling = attrs.juggling
        var stage    = attrs.stage
        var K = (maximum - juggling.waiting.time) * juggling.interval 
        var width

        if (stage.width) {
            var k = (juggling.integer_height - juggling.waiting.time) * juggling.interval
            var r = k / K //(k * k) / (K * K)
            width = r * stage.width
            console.log('uu', r)
        } else {
            var k = (3 - juggling.waiting.time) * juggling.interval
            var r = k / K // (k * k) / (K * K)
            width = 1.5 * juggling.height * r
        }

        return {
            width: 0.5 * width,
            gravity: 8 * juggling.height / (K * K),
            shift: juggling.waiting.shift * r,
            radius: juggling.balls.radius * r
        }
    }

    function Juggler(attrs) {
        console.log(attrs.stage)
        this.attrs = {}
        this.attrs = extend(true, this.attrs, {
            stage: {
                width:  500,
                height: 650
            },
            juggling: {
                interval: 500,
                waiting: {
                  time: 0.5,
                  shift: 50,
                },
                integer_height: 5,
                balls: {
                    radius: 10,
                    colors: ['red', 'blue', 'green', 'yellow', 'black', 'orange', 'purple']
                },
                height: 0.8 * attrs.stage.height,
                center: {
                    x: 0.5 * attrs.stage.width,
                    y: 0.9 * attrs.stage.height
                }
            },
            layer: new Kinema.Layer()
        }, attrs)
        this.attrs.stage = new Kinema.Stage(this.attrs.stage)
        this.attrs.stage.add(this.attrs.layer)

        var juggling = this.attrs.juggling
        var target = recalculate(this.attrs, this.attrs.juggling.integer_height)

        juggling.width   = target.width
        juggling.gravity = target.gravity
    }

    Juggler.toPattern = function (string) {
        return string.split('').map(function(e) {
            return nums[e]
        })
    }

    Juggler.prototype.setPattern = function (pattern) {
        if (typeof pattern === 'string') {
            pattern = Juggler.toPattern(pattern)
        }

        var attrs = this.attrs
        var stage    = attrs.stage
        var juggling = attrs.juggling

        var radius, shift, gravity, width
        var maximum = Math.max.apply(null, pattern)

        if (maximum > juggling.integer_height) {
            var target = recalculate(attrs, maximum)
            width   = target.width
            gravity = target.gravity
            shift   = target.shift
            radius  = target.radius
        } else {
            shift   = juggling.waiting.shift
            width   = juggling.width
            gravity = juggling.gravity
            radius  = juggling.balls.radius
        }

        //console.log(width, gravity, radius, shift)
        var num_balls = pattern.reduce(function (a, b) {
          return a + b
        }, 0)

        if (num_balls % pattern.length != 0) {
            throw new Error('El patró es irrealitzable. Es necessita un nombre enter de boles. Actualment: ' + num_balls / pattern.length)
        }

        num_balls /= pattern.length

        var numbers = [] // throws

        for (var i = 0; i < pattern.length; ++i) {
            var number = {}
            number.value  = pattern[i]
            number.next   = (i + number.value) % pattern.length
            number.period = (number.value - juggling.waiting.time) * juggling.interval 
            number.velocity = 0.5 * gravity * number.period
            numbers.push(number)
        }

        for (var i = 0; i < pattern.length; ++i) {
            if (!numbers[i].cycle) {
                var cycle_flags = {}
                var index = i
                var cycle = 0
                while (!cycle_flags[index]) {
                    cycle_flags[index] = true
                    index = numbers[index].next
                    cycle += numbers[index].value
                }
                for (var index in cycle_flags) {
                    numbers[index].cycle = cycle
                }
            }
        }

        var y0 = juggling.center.y
        shift /= 2
        var left  = juggling.center.x - (width / 2)
        var right = juggling.center.x + (width / 2)

        var j = 0
        var jmod = 0
        var i = 0
        var k = 0
        var begin = {}
        this.balls = []

        while (i < num_balls) {
            if (numbers[jmod].value !== 0) {
                if (begin[j] === undefined) {
                    begin[j] = i
                    begin[j + numbers[jmod].value] = i
                    ++i
                    var ball = {
                        figure: new Kinema.Circle({
                            x: j % 2 === 0 ? left + 15 : right -15,
                            y: y0,
                            radius: radius || 10,
                            fill: juggling.balls.colors[k% juggling.balls.colors.length],
                        }),
                        start: j,
                        cycle: numbers[jmod].cycle
                    }
                    this.balls.push(ball)
                    attrs.layer.add(ball.figure)
                    ++k
                } else {
                    begin[j + numbers[jmod].value] = numbers[jmod].value
                }
            }
            ++j
            jmod = j % numbers.length
        }

        var self = this

        //attrs.stage.add(attrs.layer)          
        attrs.animation = new Kinema.Animation(function(frame) {
            var steps = Math.floor(frame.time / juggling.interval)
            //console.log(steps)
            self.balls.forEach(function (ball) {
                var t = frame.time - juggling.interval * ball.start
                if (t >= 0) {
                    t %= ball.cycle * juggling.interval
                    var i = ball.start % numbers.length
                    var pattern
                    while (true) {
                        pattern = numbers[i].value
                        var time = pattern * juggling.interval
                        if (time > t) {
                            break
                        } else {
                            t -= time
                        }
                        i = numbers[i].next
                    }
                    var step = steps - Math.floor(t / juggling.interval)

                    var position = {}

                    if (step % 2 === 0) {
                        position.start = {
                            x: left + shift,
                            y: y0
                        }
                    } else {
                        position.start = {
                            x: right - shift,
                            y: y0
                        }
                    }

                    if ((step + numbers[i].value) % 2 === 0) {
                        position.middle = {
                            x: left - shift,
                            y: y0
                        }
                        position.end = {
                            x: left + shift,
                            y: y0
                        }
                    } else {
                        position.middle = {
                            x: right + shift,
                            y: y0
                        }
                        position.end = {
                            x: right - shift,
                            y: y0
                        }
                    }

                    var f = {
                        value: numbers[i].value,
                        time: {
                            total: juggling.interval,
                            thrown: numbers[i].period,
                            caught: juggling.interval * numbers[i].value - numbers[i].period,
                            now: t
                        },
                        left: step % 2 === 0,
                        gravity: gravity,
                        position: position
                    }

                    behaviour(ball.figure, f)
                }
            })
            attrs.layer.draw()
        })
    }

    Juggler.prototype.removePattern = function () {
        var self = this
        self.attrs.animation.stop()
        self.attrs.layer.remove()
    }

    /*Juggler.prototype.resize = function (dimensions) {
        this.stop()
        this.attrs.stage.resize(dimensions)
    }*/

    Juggler.prototype.play = function () {
        var animation = this.attrs.animation
        if (animation)
            animation.play()
    }

    Juggler.prototype.pause = function () {
        var animation = this.attrs.animation
        if (animation)
            animation.pause()
    }

    Juggler.prototype.mute = function () {
        var animation = this.attrs.animation
        if (animation)
            animation.mute()
    }

    Juggler.prototype.stop = function () {
        var animation = this.attrs.animation
        if (animation)
            animation.stop()
        this.attrs.layer.remove()
    }

    Juggler.prototype.speed = function (speed) {
        var animation = this.attrs.animation
        if (animation)
            animation.speed(speed)
    }

    Juggler.prototype.colors = function (colors) {
        this.stop()
        this.attrs.juggling.balls.colors = [].concat(colors)
    }

    return Juggler
})()

function behaviour(figure, frame) {
    var time = frame.time
    var position = frame.position
    var width
    var now = time.now
    if (now < time.thrown) {
        // thrown
        width = position.middle.x - position.start.x
        figure.setX(position.start.x + width * now / time.thrown)
        var velocity = 0.5 * frame.gravity * time.thrown
        figure.setY(position.start.y - velocity * now + 0.5 * frame.gravity * now * now)
    } else {
        // caught
        width = position.end.x - position.middle.x
        figure.setX(position.middle.x + width * (now - time.thrown) / time.caught)
        figure.setY(position.middle.y)
    }
}

module.exports = Juggler
},{"./extend.js":9,"kinemajs":6}],11:[function(require,module,exports){
var siteswapGenerator = require('siteswap-generator')
var Juggler = require('./Juggler/juggler.js')

$.fn.keyboard = function (sequence, callback) {
    callback = callback || function (e) {return e}
    $(this).html('<ul>'
        + sequence.map(function (e) {
            return '<li>' + callback(e) + '</li>'
        }).join('')
        + '</ul>')
}

function range(min, max) {
    var arr = []
    for (var i = min; i <= max; ++i) {
        arr.push(i)
    }
    return arr
}

function triggerDelegatedEvent (name, $wrapper, elem) {
    var e = $.Event(name)
    e.target = elem
    $wrapper.trigger(e)
}

function parseHref(href, config) {
    //console.log(href)
    var aux = href.split('?')
    var fragment = aux[0]
    var queryString = {}

    //console.log(aux[1])
    if (aux[1]) {
        var q = aux[1].split('&')
        for (var i in q) {
            aux = q[i].split('=')
            queryString[aux[0]] = aux[1]
        }
    }

    return {
        fragment: fragment || config.fragment,
        queryString: queryString
    }
}

function isInt(value) {
    return !isNaN(value) && value === Math.floor(value)
}

function capitalize(str) {
    return str[0].toUpperCase(str) + str.substring(1)
}

var message = {
    isNotAInt: function (value) {
        return value + 'no és un nombre enter'
    },
    invalidRange: function (range, type) {
        type = {
            balls: 'el nombre de boles',
            periods: 'el període',
            heights: 'l\'alçada'
        }[type]
        return capitalize(type) + ' menor (' + range.min 
             + ') no pot sobrepassar ' + type + ' major (' + range.max + ')'
    },
    emptyWithBigPeriod: function () {
        return 'No existeixen patrons vàlids dintre del rang indicat. Prova que l\'alçada màxima sigui menor al nombre màxim de boles'
    },
    emptyWithLittlePeriod: function () {
        return 'No existeixen patrons vàlids dintre del rang indicat. Prova que l\'alçada màxima sigui menor o igual al nombre màxim de boles'
    }
}

function validate(values, type, minmax, option) {
    var range = values[type]
    var value = range[minmax]
    if (!isInt(value)) {
        return message.isNotAInt(value)
    }

    if (option === 'all' || option === 'range') {
        if(range.min > range.max) {
            return message.invalidRange(range, type)
        }
    }

    if (option === 'all') {
        var maxBalls   = values.balls.max
        var maxHeights = values.heights.max
        var maxPeriods = values.periods.max
    
        if (maxHeights <= maxBalls && maxPeriods > 1) {
            return message.emptyWithBigPeriod()
        } else if(maxPeriods === 1 && maxHeights < maxBalls) {
            return message.emptyWithLittlePeriod()
        }
    }
    return ''
}

var generateText = {
    balls: function (text, balls, $output) {
        text.error = false
        if (balls.min !== undefined && balls.max !== undefined
         && balls.min <= balls.max && balls.min > 0) {
            if (balls.min === balls.max) 
                text.balls = 'de ' + balls.max + ' boles'
            else if (balls.min === 1)
                text.balls = 'de màxim ' + balls.max + ' boles'
            else if (balls.min < balls.max)
                text.balls = 'de ' + balls.min + ' a ' + balls.max + ' boles'
        } else {
            text.error = 'L\'interval de boles que demanes no es correcte'
        }
        $output.text(text.balls)
    },
    
    periods: function (text, period, $output) {
        text.error = false
        //console.log(period)
        if (period.min !== undefined && period.max !== undefined 
         && period.min <= period.max && period.min > 0) {
            if (period.min === period.max) 
                text.period = 'de període ' + period.max
            else if (period.min === 1)
                text.period = 'amb periodes no més grans de ' + period.max
            else if (period.min < period.max)
                text.period = 'amb períodes entre ' + period.min + ' i ' + period.max
        } else {
            text.error = 'L\'interval de períodes que demanes no es correcte'
        }
        $output.text(text.period)
    },

    heights: function (text, height, $output) {
        text.error = false
        if (height.min === undefined && height.max === undefined) {
            text.height = ''
        } else if ((height.min === undefined || height.min <= 1) && height.max >= 0) {
            text.height = 'amb llançaments no més alts de ' + height.max
        } else if (height.max === undefined && height.min >= 0) {
            text.height = 'amb llançaments que continguin alguna alçada major o igual a ' + height.min
        } else if (height.min <= height.max && height.min >= 0) {
            if (height.min === height.max) {
                text.height = 'amb llançaments que continguin alguna alçada de ' + height.min + ' i no més alta'
            } else {
                text.height = 'amb llançaments que continguin alguna alçada major o igual a ' + height.min + ' i no continguin cap alçada superior a ' + height.max
            }
        } else {
            text.error = 'L\'interval de periodes que demanes no es correcte'
        }

        $output.text(text.height)
    }
}

var text = {}
var values = {}
var error = false
var heightToLetter = "0123456789abcdefghijklmnopqrstuvxyz"

var scope = {
    values: {},
    href: {
        queryString: {}
    }
}

$(document).ready(function (event) {
    scope.$root = $('body, html')

    var $keyboard = scope.$keyboard = $('#keyboard')
    var buttons   = {}
    $keyboard.data('$shown', null)
    $.each(['balls', 'periods', 'heights', 'patterns'], function (index, item) {
        var $item = buttons['$' + item] = $('#keyboard-' + item)
        $item.data('position', 0)
        $item.data('active', false)
    })
    $keyboard.data('buttons', buttons)
    var $left  = $('#keyboard-left' )
    var $right = $('#keyboard-right')
    $keyboard.data('$left',  $left )
    $keyboard.data('$right', $right)

    scope.outputs = {
        balls:  $('#description-balls'),
        periods: $('#description-periods'),
        heights:  $('#description-heights'),
    }

    scope.message = {
        $success: $('#success'),
        $error:   $('#error')
    }

    scope.$header = $('#header')

    var $generator = scope.$generator = $('#generator')
    var $focus = null
    var inputs = {}
    $generator.data('active', false)
    $generator.data('top', $generator.offset().top)
    $generator.data('$focus', $focus)
    $.each(['balls', 'periods', 'heights'], function (index, item) {
        var $item = inputs['$' + item] = $('#' + item)
        var $keys = $('#keyboard-' + item)
        if (item === 'periods') {
            $keys.keyboard(range(1, 10), function (key) {
                return '<span class="numbers keyboard-btn number-' + key + '">' + key + '</span>'
            })
        } else {
            $keys.keyboard(range(1, 25), function (key) {
                return '<span class="numbers keyboard-btn number-' + key + '">' + key + '</span>'
            })
        }
        $.each(['min', 'max'], function (index, sufix) {
            var $elem = $('#' + item + '-' + sufix)
            $item.data('$' + sufix, $elem)

            $elem.data('$parent', $item)
            var width    = $elem.width()
            $elem.width(width)
            var minWidth = '40px'
            $elem.data('width', width)
            $elem.data('min-width', minWidth)
            $elem.data('type', item)
            $elem.data('minmax', sufix)
            $elem.data('$keys', $keys)
        })        
    })

    var $simulator = scope.$simulator = $('#simulator')
    $simulator.data('active', false)

    $generator.data('inputs', inputs)

    scope.$create = $('#create')
    scope.topCreate = scope.$create.offset().top
    scope.$samples = $('#samples')

    var $wrapper = scope.$wrapper = $('#wrapper')

    function rec() {
        var first = $('li', scope.$samples).slice(0, 1)
        scope.$samples.animate({
            'margin-left': - first.width()
        }, '300', 'swing', function () {
            scope.$samples.css('margin-left', 0)
            first.detach()
            scope.$samples.append(first)
        })        
        setTimeout(rec, 10000)
    }
    rec()

    function createPatterns(event, scope) {
        scope          = scope || event.data
        var $keyboard  = scope.$keyboard
        var $simulator = scope.$simulator
        var $generator = scope.$generator
        var array = [
            inputs.$balls,
            inputs.$periods,
            inputs.$heights
        ]
        var params = $.map(array, function($item) {
            return {
                min: parseInt($item.data('$min').text()) || undefined,
                max: parseInt($item.data('$max').text()) || undefined
            }
        })
        //console.log('CREATE PATTERN')
        var patterns = siteswapGenerator.apply(null, params)
        patterns = patterns.map(function (pattern) {
            return pattern.map(function (e) {
                return heightToLetter[e]
            }).join('')
        })
        $simulator.data('patterns', patterns)
        buttons.$patterns.keyboard(patterns, function (pattern) {
            return '<a class="keyboard-btn" href="#simulator?play=' + pattern + '">' + pattern + '</a>'
        })
        if (scope.juggler) {
            scope.juggler.stop()
        }
        scope.jugglerPlaying = false
        buttons.$patterns.data('active', false)
        buttons.$patterns.data('position', 0)
        buttons.$patterns.css('left', 0)
        buttons.$patterns.data('width', null)

        return patterns
    }

    scope.$create.on('click', scope, createPatterns)

    scope.$root.on('click', $generator, function (event) {
        //console.log('jijiji')
        var $generator = event.data
        var $focus     = $generator.data('$focus')
        if ($focus) {
            triggerDelegatedEvent('blureditable', $generator, $focus[0])
            $generator.data('$focus', null)
        }
    })

    $generator.on('click', '.editable', $generator, function (event) {
        event.stopPropagation()
        var $generator = event.data
        var $focus     = $generator.data('$focus')
        if ($focus) {
            triggerDelegatedEvent('blureditable', $generator, $focus[0])
        }
        $focus = $('.contenteditable', this).first()
        $generator.data('$focus', $focus)
        triggerDelegatedEvent('focuseditable', $generator, $focus[0])
    })

    $generator.on('click', '.contenteditable', $generator, function (event) {
        event.stopPropagation()
        var $generator = event.data
        var $focus     = $generator.data('$focus')
        if ($focus) {
            triggerDelegatedEvent('blureditable', $generator, $focus[0])
        }
        $focus = $(this)
        $generator.data('$focus', $focus)
        triggerDelegatedEvent('focuseditable', $generator, this)
    })

    function selectButton($button, $context) {
        $button.addClass('select')
        $context.data('$select', $button)
        var width = $context.data('width')
        var diff  = 0.5 * ($(window).outerWidth() - $button.outerWidth()) - $button.offset().left
        var pos   = $context.data('position') + diff
        if (pos < -width) 
            pos = -width
        else if (pos > 0)
            pos = 0
        $context.data('position', pos)
        $context.css('left', pos)
    }

    function deselectButton($button) {
        $button.removeClass('select')
    }

    $generator.on('focuseditable', '.contenteditable', $keyboard, function (event) {
        var $this     = $(this)
        var $keys = $this.data('$keys')
        console.log($keys[0])
        //var buttons   = $keyboard.data('buttons')
        var $shown = $keyboard.data('shown')
        /*console.log('$shown', $shown && $shown[0])
        var numbers   = buttonskeyboard.numbers*/
        // $this, $keys
        $this.addClass('select')

        var width     = $keys.data('width')
        if (!width) {
            width = $keys.width() - $(window).outerWidth() + 120
            $keys.data('width', width)
        }
        //keyboard.patterns.width = undefined
        //console.log('ummmm', $shown && $shown[0])
        if (!$shown) {
            //console.log('primero')
            $keyboard.removeClass('hide')
            $keyboard.data('$shown', $keys)
            $keys.addClass('select')
        } else {
            //console.log('segundo')
            $shown.removeClass('select')
            $shown = $keys
            $keyboard.data('$shown', $keys)
            $keys.addClass('select')
        }
        $keys.data('active', true)

        var $select = $keys.data('$select')
        if ($select && !$select.hasClass(className)) {
            deselectButton($select)
        }
        var num       = $this.text().trim()
        if (num) {
            var className = 'number-' + num
            selectButton($('.' + className, $keys), $keys)
        }
    })

    $generator.on('blureditable', '.contenteditable', scope, function (event) {
        //console.log('blureditable')
        var $this      = $(this)
        var scope      = event.data
        var $keyboard  = scope.$keyboard
        var $keys      = $this.data('$keys')
        var $shown     = $keyboard.data('$shown')
        var $parent    = $this.data('$parent')
        var minText    = $parent.data('$min').text()
        var maxText    = $parent.data('$max').text()

        if (minText <= 1 || minText === undefined) {
            $parent.addClass('minLessOrEq1')
        } else {
            $parent.removeClass('minLessOrEq1')
        }
        if (minText === maxText) {
            $parent.addClass('minEqMax')
        } else {
            $parent.removeClass('minEqMax')
        }

        $this.removeClass('select')
        if ($shown) {
            $keyboard.addClass('hide')
            $keys.removeClass('select')
            //numbers.$item = shown.$item
            //$keyboard.shown = undefined
        }
        $keys.data('active', false)
    })

    function inputHandler (event) {
        var scope = event.data
        var $this = $(this)
        var type  = $this.data('type')
        var minmax = $this.data('minmax')
        values[type][minmax] = parseInt($this.text()) || undefined
        var textError = validate(values, type, minmax, 'all')
        if (error)
            console.log(error)

        generateText[type](text, values[type], scope.outputs[type])

        if (!error && textError) {
            scope.message.$success.addClass('hide')
            scope.message.$error.text(textError)
            scope.message.$error.removeClass('hide')
            error = true
        } else if (error && !textError) {
            scope.message.$error.addClass('hide')
            scope.message.$success.removeClass('hide')
            error = false
        }
        console.log('error', error)

        if (error) {
            scope.$create.addClass('disabled')
            scope.$wrapper.addClass('simulator-disabled')
        } else {
            scope.$create.removeClass('disabled')
            scope.$wrapper.removeClass('simulator-disabled')
        }
    }

    $generator.on('inputeditable', '.contenteditable', scope, inputHandler)
    var width

    $.each(['balls', 'periods', 'heights'], function (index, type) {
        var $item = inputs['$' + type]
        var $min  = $item.data('$min')
        var $max  = $item.data('$max')
        var textError
        values[type] = {
            min: parseInt($min.text()) || undefined,
            max: parseInt($max.text()) || undefined
        }
        textError = validate(values, type, 'min')
        if (!error && textError) {
            scope.message.$error.text(textError)
            scope.message.$success.addClass('hide')
            error = true
        }
        console.log('min', values[type].min)
        textError = validate(values, type, 'max', index === 2 ? 'all' : 'range')
        if (!error && textError) {
            scope.message.$error.text(textError)
            scope.message.$success.addClass('hide')
            error = true
        }
        console.log('max', values[type].max)
        generateText[type](text, values[type], scope.outputs[type])
        if (error) {
            scope.$create.addClass('disabled')
        }
    })

    $keyboard.on('click', function (event) {
        event.stopPropagation()
    })

    $left.on('click', $keyboard, function (event) {
        var $keyboard = event.data
        var $shown    = $keyboard.data('$shown')
        var width = $keyboard.width() - 100
        var pos = $shown.data('position') + width
        pos = Math.min(pos, 0)
        $shown.data('position', pos)
        $shown.css('left', pos)
    })

    $right.on('click', $keyboard, function (event) {
        var $keyboard = event.data
        var $shown    = $keyboard.data('$shown')
        var width     = $keyboard.width() - 100
        var pos = $shown.data('position') - width
        pos = Math.max(pos, -$shown.data('width'))
        $shown.data('position', pos)
        $shown.css('left', pos)
    })

    function clickLinkHandler (event) {
        event.preventDefault()
        var scope = event.data
        var $keyboard  = scope.$keyboard
        var $simulator = scope.$simulator
        
        var href = parseHref($(this).attr('href'), {
            fragment: '#header'
        })
        var oldQueryString = scope.href.queryString
        var newQueryString = href.queryString
        var targetTop = $(href.fragment).offset().top
        scope.$root.animate({scrollTop: targetTop}, 300, 'swing')
        if (href.fragment === "#header") {
            $keyboard.addClass('hide')
            var $shown = $keyboard.data('shown')
            if ($shown) {
                $shown.removeClass('select')
            }
        } else {
            if (href.fragment === "#simulator") {
                var patterns = $simulator.data('patterns')
                if (!patterns) {
                    patterns = createPatterns({}, scope)
                }
                href.queryString.play = href.queryString.play || patterns[0]
                console.log('play', href.queryString.play)
                if (!scope.juggler) {
                    scope.juggler = new Juggler({
                        stage: {
                            container: 'juggler-simulator',
                            width:  $simulator.width(),
                            height: $simulator.height()
                        }
                    })
                }
                if (oldQueryString.play !== newQueryString.play) {
                    scope.juggler.stop()
                    scope.juggler.setPattern(href.queryString.play)
                    scope.juggler.play()
                    scope.jugglerPlaying = true
                }
            }
        }
        scope.href = href
    }

    scope.$root.on('click', 'a.disabled', function (event) {
        event.preventDefault()
    })
    scope.$root.on('click', 'a:not(.disabled)', scope, clickLinkHandler)
    buttons.$patterns.on('click', 'a:not(.disabled)', scope, clickLinkHandler)

    for (var key in buttons) {
        var $item = buttons[key]
        $item.on('click', '.keyboard-btn', $item, function (event) {
            var $this = $(this)
            var $item   = event.data
            var $select = $item.data('$select')
            if ($select) {
                deselectButton($select)
            }
            $item.data('$select', $this)
            selectButton($this, $item)
        })
    }

    $keyboard.on('click', '.keyboard-btn.numbers', $generator, function (event) {
        var num = parseInt($(this).text())
        var $generator = event.data
        var $focus     = $generator.data('$focus')
        $focus.text(num)
        triggerDelegatedEvent('inputeditable', $generator, $focus[0])
    })

    $(window).on('scroll', scope, function (event) {
        var scope = event.data
        var $generator = scope.$generator
        var $simulator = scope.$simulator
        var top = $(window).scrollTop()
        var topGenerator = $generator.offset().top
        var topSimulator = $simulator.offset().top
        
        if (top < topGenerator - 50) {
            scope.$header.removeClass('reduce')
        } else {
            scope.$header.addClass('reduce')
        }
        
        var active = $generator.data('active')
        if (active && (top < topGenerator - 50 || top >= scope.topCreate)) {
            $generator.trigger('off')
            $generator.data('active', false)
        } else if (!active && (top >= topGenerator - 50 && top < scope.topCreate)){
            $generator.trigger('on')
            $generator.data('active', true)
        }

        active = $simulator.data('active')
        //console.log(top, topSimulator, active)
        if (active && top < topSimulator - 50) {
            $simulator.trigger('off')
            $simulator.data('active', false)
        } else if (!active && !$wrapper.hasClass('simulator-disabled') && top >= topSimulator - 50) {
            $simulator.trigger('on')
            $simulator.data('active', true)
        }
    })

    $simulator.on('off', $keyboard, function (event) {
        //console.log('OFF simulator')
        var $keyboard = event.data
        var $shown    = $keyboard.data('$shown')
        var buttons   = $keyboard.data('buttons')
        buttons.$patterns.removeClass('select')
        if ($shown) {
            $shown.removeClass('select')
            $keyboard.data('$shown', null)
        }
        $keyboard.addClass('hide')
    })

    $generator.on('off', $keyboard, function (event) {
        //console.log('OFF generator')
        var $keyboard = event.data
        var $shown    = $keyboard.data('$shown')
        if ($shown) {
            $shown.removeClass('select')
            $keyboard.data('$shown', null)
        }
        //if (!keyboard.patterns.active) {
        $keyboard.addClass('hide')
        //}
    })

    $simulator.on('on', scope, function (event) {
        console.log('ON simulator')
        var scope      = event.data
        var $keyboard  = scope.$keyboard
        var $shown     = $keyboard.data('$shown')
        var buttons    = $keyboard.data('buttons')
        var href       = scope.href
        var $simulator = scope.$simulator
        var patterns   = $simulator.data('patterns')
        if (!patterns) {
            patterns = createPatterns({}, scope)
        }
        if (!scope.jugglerPlaying) {
            href.queryString.play = href.queryString.play || patterns[0]
            if (!scope.juggler) {
                scope.juggler = new Juggler({
                    stage: {
                        container: 'juggler-simulator',
                        width:  $simulator.width(),
                        height: $simulator.height()
                    }
                })
            }
            scope.juggler.stop()
            scope.juggler.setPattern(href.queryString.play)
            scope.juggler.play()
            scope.jugglerPlaying = true
        }
        if ($shown) {
            $shown.removeClass('select')
        }
        $shown = buttons.$patterns
        $keyboard.data('$shown', $shown)
        $shown.addClass('select')
        $keyboard.removeClass('hide')

        var width = buttons.$patterns.data('width')
        if (!width) {
            width = buttons.$patterns.width() - $(window).outerWidth() + 120
            buttons.$patterns.data('width', width)
        }
    })

    $generator.on('on', scope, function (event) {
        //console.log('ON generator')
        var scope     = event.data
        var $focus    = scope.$generator.data('$focus')
        var $keyboard = scope.$keyboard
        var $shown    = $keyboard.data('$shown')
        var buttons   = $keyboard.data('buttons')

        if ($shown) {
            $shown.removeClass('select')
            $keyboard.data('$shown', null)
        }
        if ($focus) {
            $shown = $focus.data('$keys')
            $keyboard.data('$shown', $shown)
            $shown.addClass('select')
            $keyboard.removeClass('hide')
        }
    })
})
},{"./Juggler/juggler.js":10,"siteswap-generator":7}]},{},[11]);
