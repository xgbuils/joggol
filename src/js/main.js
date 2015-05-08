var siteswap     = require('siteswap-generator')
var Juggler      = require('./Juggler/juggler.js')
var generateText = require('./messages/generate-text')
var lang         = require('language')
var ErrorHandler = require('./validation/ErrorHandler.js')
var utils        = require('./utils.js')
var validate     = require('./validation/validate.js')
//var PatternsColeccion = require('./backbone/collections/PatternsCollection')
//var KeyboardView = require('./backbone/views/KeyboardView')
require('./backbone/models/SiteswapOptions.js')
require('./backbone/init.js')
                   require('./jQuery-plugins/plugins.js')
/*
var ua = window.navigator.userAgent
var native_android_browser = /android/i.test(ua) && ua.indexOf('534.30')

$.fn.keyboard = function (sequence, callback) {
    callback = callback || function (e) {return e}
    $(this).html('<ul>'
        + sequence.map(function (e) {
            return '<li>' + callback(e) + '</li>'
        }).join('')
        + '</ul>')
}

var text = {}
var values = {}
var errorHandler = new ErrorHandler()
var heightToLetter = "0123456789abcdefghijklmnopqrstuvxyz"

var scope = {
    values: {},
    href: {
        queryString: {}
    }
}

$(document).ready(function (event) {
    scope.$root = $('body, html')
    var DELAY   = 300

    $('.collapsed').each(function (index, item) {
        var $item = $(item)
        $item.removeClass('js-hide')
        var width = $item.outerWidth()
        console.log(width)
        $item.data('width', width)
        $item.css('width', width)
    })

    $('.word-expanded').each(function (index, item) {
        var $item = $(item)
        var width = $item.outerWidth()
        $item.data('width', width)
        $item.css('width', width)
    })

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

    var $wrapper = scope.$wrapper = $('#wrapper')
    scope.$create = $('#create')
    scope.topCreate = scope.$create.offset().top
    scope.$samples = $('#samples')
    scope.$header = $('#header')

    var $generator = scope.$generator = $('#generator')
    var $focus = null
    var inputs = {}
    $generator.data('active', false)
    $generator.data('top', $generator.offset().top)
    $generator.data('$focus', $focus)
    $.each(['balls', 'periods', 'heights'], function (index, item) {
        var $item = inputs['$' + item] = $('#' + item)
        if (native_android_browser)
            $item.addClass('android-browser')
        var $keys = $('#keyboard-' + item)
        if (item === 'periods') {
            $keys.keyboard(utils.range(1, 10), function (key) {
                return '<span class="numbers keyboard-btn number-' + key + '">' + key + '</span>'
            })
        } else {
            $keys.keyboard(utils.range(1, 25), function (key) {
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
        validatorHandler($item, item, index)       
    })

    var $simulator = scope.$simulator = $('#simulator')
    $simulator.data('active', false)
    $generator.data('inputs', inputs)

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


    function rec() {
        var first = $('li', scope.$samples).slice(0, 1)
        scope.$samples.animate({
            'margin-left': - first.width()
        }, DELAY, 'swing', function () {
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
        var items = {
            balls : inputs.$balls,
            period: inputs.$periods,
            height: inputs.$heights
        }
        var options = {}
        for (var key in items) {
            options[key] = {
                min: parseInt(items[key].data('$min').text()) || undefined,
                max: parseInt(items[key].data('$max').text()) || undefined
            }
        }

        var patterns = siteswap.Generator(options)
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
            $focus.triggerDelegated('blureditable', $generator)
            $generator.data('$focus', null)
        }
    })

    $generator.on('click', '.editable', $generator, function (event) {
        event.stopPropagation()
        var $generator = event.data
        var $focus     = $generator.data('$focus')
        if ($focus) {
            $focus.triggerDelegated('blureditable', $generator)
        }
        $focus = $('.contenteditable', this).first()
        $generator.data('$focus', $focus)
        $focus.triggerDelegated('focuseditable', $generator)
    })

    $generator.on('click', '.contenteditable', $generator, function (event) {
        event.stopPropagation()
        var $generator = event.data
        var $focus     = $generator.data('$focus')
        if ($focus) {
            $focus.triggerDelegated('blureditable', $generator)
        }
        $focus = $(this)
        $generator.data('$focus', $focus)
        $(this).triggerDelegated('focuseditable', $generator)
    })

    function selectButton($button, $context, onlymove) {
        if (!onlymove) {
            $button.addClass('js-select')
            $context.data('$select', $button)
        }
        var minmax = $button.data('minmax')
        //console.log('minmax', minmax, $button[0])
        var width  = $context.data('width')
        if ($context.outerWidth() > $keyboard.outerWidth()) {
            //console.log($(window).outerWidth(), $button.outerWidth(), $button.offset().left)
            var diff   = 0.5 * ($(window).outerWidth() - $button.outerWidth()) - $button.offset().left
            var pos    = $context.data('position') + diff
            if (pos < -width) 
                pos = -width
            else if (pos > 0)
                pos = 0
            $context.data('position', pos)
            $context.css('left', pos)
        }
    }

    function deselectButton($button, onlymove) {
        if (!onlymove) {
            $button.removeClass('js-select')
        }
    }

    $generator.on('focuseditable', '.contenteditable', $keyboard, function (event) {
        var $keyboard = event.data
        var $this   = $(this)
        var $keys   = $this.data('$keys')
        var $parent = $this.data('$parent')
        var $shown  = $keyboard.data('$shown')
        var minmax  = $this.data('minmax')

        $parent.addClass('expanded')
        if ($parent.hasClass('minEqMax'))
            visible('minEqMax', $parent)
        if ($parent.hasClass('minLessOrEq1'))
            visible('minLessOrEq1', $parent)

        $this.addClass('js-select')

        var width = $keys.data('width')
        if (!width) {
            width = $keys.width() - $keyboard.outerWidth() + 120
            $keys.data('width', width)
        }

        $keyboard.removeClass('js-hide')
        $keyboard.data('$shown', $keys)
        $keys.addClass('js-select')
        $keys.data('active', true)

        var num = parseInt($this.text().trim())
        var oposite
        var onlymove = false
        if (minmax === 'min') {
            oposite = parseInt($parent.data('$max').text().trim())
            if (num > oposite) {
                num      = oposite
                onlymove = true
                console.log('onlymove')
            }
        } else {
            oposite = parseInt($parent.data('$min').text().trim())
            if (num < oposite) {
                num      = oposite
                onlymove = true
                console.log('onlymove')
            }
        }
        var $select = $keys.data('$select')
        if ($select && !$select.hasClass(className)) {
            deselectButton($select)
        }

        if (num) {
            var className = 'number-' + num
            selectButton($('.' + className, $keys), $keys, onlymove)
        }
    })

    function visible (className, $context) {
        //console.log('visible')
        $context.removeClass(className)
    }

    function collapse (className, $context) {
        //console.log('collapse')
        $context.addClass(className)
    }

    function editableHandler (min, max, $context) {
        var added = false
        if (!added && min === max) {
            collapse('minEqMax', $context)
            added = true
        } else {
            visible('minEqMax', $context)
        }
        if (!added && min <= 1 || min === undefined) {
            collapse('minLessOrEq1', $context)
            added = true
        } else {
            visible('minLessOrEq1', $context)
        }
        if (added) {
            $context.removeClass('expanded')
        } else {
            $context.addClass('expanded')
        }
    }

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

        editableHandler(minText, maxText, $parent)

        $this.removeClass('js-select')
        if ($shown) {
            $keyboard.addClass('js-hide')
            $keys.removeClass('js-select')
            //numbers.$item = shown.$item
            //$keyboard.shown = undefined
        }
        $keys.data('active', false)
    })

    function inputHandler (event) {
        var scope  = event.data
        var $this  = $(this)
        var type   = $this.data('type')
        var minmax = $this.data('minmax')
        values[type][minmax] = parseInt($this.text()) || undefined
        validate(errorHandler, values, type, minmax, 'all')
        if (!errorHandler.ok())
            console.log(errorHandler.message())

        generateText[type](text, values[type], scope.outputs[type], lang)

        if (!errorHandler.ok()) {
            scope.message.$success.addClass('js-hide')
            scope.message.$error.text(errorHandler.message())
            scope.message.$error.removeClass('js-hide')
        } else {
            scope.message.$error.addClass('js-hide')
            scope.message.$success.removeClass('js-hide')
        }

        if (!errorHandler.ok()) {
            scope.$create.addClass('disabled')
            scope.$wrapper.addClass('simulator-disabled')
        } else {
            scope.$create.removeClass('disabled')
            scope.$wrapper.removeClass('simulator-disabled')
        }
    }

    $generator.on('inputeditable', '.contenteditable', scope, inputHandler)
    var width

    function validatorHandler($item, type, index) {
        var $min    = $item.data('$min')
        var $max    = $item.data('$max')
        var minText = $min.text()
        var maxText = $max.text()
        var textError
        editableHandler(minText, maxText, $item)
        values[type] = {
            min: parseInt(minText) || undefined,
            max: parseInt(maxText) || undefined
        }
        validate(errorHandler, values, type, 'min')
        if (!errorHandler.ok()) {
            scope.message.$error.text(textError)
            scope.message.$success.addClass('js-hide')
        }
        //console.log('min', values[type].min)
        validate(errorHandler, values, type, 'max', index === 2 ? 'all' : 'range')
        if (!errorHandler.ok()) {
            scope.message.$error.text(textError)
            scope.message.$success.addClass('js-hide')
        }
        //console.log('max', values[type].max)
        generateText[type](text, values[type], scope.outputs[type], lang)
        if (!errorHandler.ok()) {
            scope.$create.addClass('disabled')
            scope.$wrapper.addClass('simulator-disabled')
        } else {
            scope.$create.removeClass('disabled')
            scope.$wrapper.removeClass('simulator-disabled')
        }
    }
*/
    /*$.each(['balls', 'periods', 'heights'], function (index, type) {
        var $item = inputs['$' + type]

    })*/
/*
    $keyboard.on('click', function (event) {
        event.stopPropagation()
    })

    $left.on('click', $keyboard, function (event) {
        var $keyboard = event.data
        var $shown    = $keyboard.data('$shown')
        if ($shown.outerWidth() > $keyboard.outerWidth()) {
            var width = $keyboard.width() - 100
            var pos = $shown.data('position') + width
            pos = Math.min(pos, 0)
            $shown.data('position', pos)
            $shown.css('left', pos)
        }
    })

    $right.on('click', $keyboard, function (event) {
        var $keyboard = event.data
        var $shown    = $keyboard.data('$shown')
        if ($shown.outerWidth() > $keyboard.outerWidth()) {
            var width     = $keyboard.width() - 100
            var pos = $shown.data('position') - width
            pos = Math.max(pos, -$shown.data('width'))
            $shown.data('position', pos)
            $shown.css('left', pos)
        }
    })

    function clickLinkHandler (event) {
        event.preventDefault()
        var scope = event.data
        var $keyboard  = scope.$keyboard
        var $simulator = scope.$simulator
        
        var href = utils.parseHref($(this).attr('href'), {
            fragment: '#header'
        })
        var oldQueryString = scope.href.queryString
        var newQueryString = href.queryString
        var targetTop = $(href.fragment).offset().top
        scope.$root.animate({scrollTop: targetTop}, DELAY, 'swing')
        if (href.fragment === "#header") {
            $keyboard.addClass('js-hide')
            var $shown = $keyboard.data('$shown')
            if ($shown) {
                $shown.removeClass('js-select')
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

    scope.$root.on('click', '.internal-link.disabled', function (event) {
        event.preventDefault()
    })
    scope.$root.on('click', '.internal-link:not(.disabled)', scope, clickLinkHandler)
    buttons.$patterns.on('click', 'a:not(.disabled)', scope, clickLinkHandler)

    $keyboard.on('click', '.keyboard-btn.numbers', $generator, function (event) {
        var num = parseInt($(this).text())
        var $generator = event.data
        var $focus     = $generator.data('$focus')
        $focus.text(num)
        $focus.triggerDelegated('inputeditable', $generator)
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
        buttons.$patterns.removeClass('js-select')
        if ($shown) {
            $shown.removeClass('js-select')
            $keyboard.data('$shown', null)
        }
        $keyboard.addClass('js-hide')
    })

    $generator.on('off', $keyboard, function (event) {
        //console.log('OFF generator')
        var $keyboard = event.data
        var $shown    = $keyboard.data('$shown')
        if ($shown) {
            $shown.removeClass('js-select')
            $keyboard.data('$shown', null)
        }
        $keyboard.addClass('js-hide')

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
            $shown.removeClass('js-select')
        }
        $shown = buttons.$patterns
        $keyboard.data('$shown', $shown)
        $shown.addClass('js-select')
        $keyboard.removeClass('js-hide')

        var width = buttons.$patterns.data('width')
        if (!width) {
            width = buttons.$patterns.width() - $keyboard.outerWidth() + 120
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
            $shown.removeClass('js-select')
            $keyboard.data('$shown', null)
        }
        if ($focus) {
            $shown = $focus.data('$keys')
            $keyboard.data('$shown', $shown)
            $shown.addClass('js-select')
            $keyboard.removeClass('js-hide')
        }
    })
})*/