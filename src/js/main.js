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
        } else if (height.min === undefined && height.max >= 0) {
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
            $keys.keyboard(range(0, 25), function (key) {
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

    function inputHandler (event, scope) {
        scope = event.data || scope
        var $this = $(this)
        var type  = $this.data('type')
        var minmax = $this.data('minmax')
        values[type][minmax] = parseInt($this.text()) || undefined

        generateText[type](text, values[type], scope.outputs[type])

        if (!error && text.error) {
            scope.message.$success.addClass('hide')
            scope.message.$error.text(text.error)
            scope.message.$error.removeClass('hide')
            error = true
        } else if (error && !text.error) {
            scope.message.$error.addClass('hide')
            scope.message.$success.removeClass('hide')
            error = false
        }
    }

    $generator.on('inputeditable', '.contenteditable', scope, inputHandler)
    var width

    $.each(['balls', 'periods', 'heights'], function (index, type) {
        var $item = inputs['$' + type]
        var $min  = $item.data('$min')
        var $max  = $item.data('$max')
        values[type] = {
            min: parseInt($min.text()) || undefined,
            max: parseInt($max.text()) || undefined
        }
        generateText[type](text, values[type], scope.outputs[type])
        if (!error && text.error) {
            scope.message.$error.text(text.error)
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

    scope.$root.on('click', 'a', scope, clickLinkHandler)
    buttons.$patterns.on('click', 'a', scope, clickLinkHandler)

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
        if (active && top < topSimulator - 50) {
            $simulator.trigger('off')
            $simulator.data('active', false)
        } else if (!active && top >= topSimulator - 50) {
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
        //console.log('ON simulator')
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