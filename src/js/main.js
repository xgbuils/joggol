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
    console.log(href)
    var aux = href.split('?')
    var fragment = aux[0]
    var queryString = {}

    console.log(aux[1])
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
        console.log(period)
        console.log('eooo', text.error)
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

    scope.keyboard = {
        $widget: $('#keyboard'),
        $buttons: $('#keyboard-buttons'),
        numbers: {
            $item: $('#keyboard-numbers'),
            active: false,
            position: 0
        },
        balls: {
            $item: $('#keyboard-balls'),
        },
        periods: {
            $item: $('#keyboard-periods'),
        },
        heights: {
            $item: $('#keyboard-heights'),
        },
        patterns: {
            $item: $('#keyboard-patterns'),
            active: false,
            position: 0
        },
        $left: $('#keyboard-left'),
        $right: $('#keyboard-right'),
        shown: undefined,
        active: undefined,
        position: 0
    }

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

    var $item
 
    var $generator = scope.$generator = $('#generator')
    var $focus = null
    $generator.data('active', false)
    $generator.data('top', $generator.offset().top)
    $generator.data('$focus', $focus)
    $.each(['balls', 'periods', 'heights'], function (index, item) {
        var $item = $('#' + item)
        //console.log('#' + item, $item[0])
        $generator.data('$' + item, $item)
        $.each(['min', 'max'], function (index, sufix) {
            var $elem = $('#' + item + '-' + sufix)
            //console.log('#' + item + '-' + sufix, $elem)
            $item.data('$' + sufix, $elem)
            var width    = $elem.width()
            $elem.width(width)
            var minWidth = '40px'
            $elem.data('width', width)
            $elem.data('min-width', minWidth)
            $elem.data('type', item)
            $elem.data('minmax', sufix)
        })
    })
    
    var $balls   = $generator.data('$balls')
    var $periods = $generator.data('$periods')
    var $heights = $generator.data('$heights')


    scope.$create = $('#create')
    scope.topCreate = scope.$create.offset().top
    scope.simulator = {
        $item: $('#simulator'),
        active: false
    }
    scope.topSimulator = scope.simulator.$item.offset().top
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
        scope         = scope || event.data
        var keyboard  = scope.keyboard
        var simulator = scope.simulator
        var $generator = scope.$generator
        var array = [
            $generator.data('$balls'),
            $generator.data('$periods'),
            $generator.data('$heights')
        ]
        var params = $.map(array, function($item) {
            return {
                min: parseInt($item.data('$min').text()) || undefined,
                max: parseInt($item.data('$max').text()) || undefined
            }
        })
        console.log('CREATE PATTERN')
        var patterns = siteswapGenerator.apply(null, params)
        simulator.patterns = patterns.map(function (pattern) {
            return pattern.map(function (e) {
                return heightToLetter[e]
            }).join('')
        })
        keyboard.patterns.$item.keyboard(simulator.patterns, function (pattern) {
            return '<a class="keyboard-btn" href="#simulator?play=' + pattern + '">' + pattern + '</a>'
        })
        //console.log(simulator.patterns)
        if (scope.juggler) {
            scope.juggler.stop()
        }
        scope.jugglerPlaying = false
        keyboard.patterns.active = false
        keyboard.patterns.position = 0
        keyboard.patterns.$item.css('left', 0)
        keyboard.patterns.width = undefined
        //console.log(simulator.patterns)
    }

    scope.$create.on('click', scope, createPatterns)

    scope.$root.on('click', $generator, function (event) {
        console.log('jijiji')
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

    $generator.on('focuseditable', '.contenteditable', scope.keyboard, function (event) {
        var keyboard = event.data
        var shown   = keyboard.shown
        console.log('shown', shown)
        var numbers  = keyboard.numbers
        $(this).addClass('select')
        if (!numbers.width) {
            numbers.$item.keyboard(range(0, 35), function (number) {
                return '<span class="keyboard-btn">' + number + '</span>'
            })
            numbers.width = numbers.$item.width() - $(window).outerWidth() + 120
        }
        //keyboard.patterns.width = undefined
        if (!shown) {
            console.log('primero')
            keyboard.$widget.removeClass('hide')
            keyboard.shown = numbers
            numbers.$item.addClass('select')
        } else if (shown.$item === keyboard.patterns.$item) {
            console.log('segundo')
            shown.$item.removeClass('select')
            keyboard.shown = numbers
            numbers.$item.addClass('select')
        }
        numbers.active = true
        console.log(keyboard.shown)
    })

    $generator.on('blureditable', '.contenteditable', scope, function (event) {
        console.log('blureditable')
        var $this      = $(this)
        var scope      = event.data
        var keyboard   = scope.keyboard
        var numbers    = keyboard.numbers
        var shown      = keyboard.shown
        var $generator = scope.$generator
        var type       = $(this).data('type')
        var $item      = $generator.data('$' + type)
        var minText    = $item.data('$min').text()
        var maxText    = $item.data('$max').text()
        if (minText === maxText) {
            $item.addClass('minEqMax')
        } else if (minText <= 1 || minText === undefined) {
            $item.addClass('minLessOrEq1')
        }
        $(this).removeClass('select')
        if (shown) {
            keyboard.$widget.addClass('hide')
            numbers.$item.removeClass('select')
            numbers.$item = shown.$item
            keyboard.shown = undefined
        }
        numbers.active = false
    })

    function inputHandler (event) {
        console.log(event.target)
        var scope = event.data
        var $this = $(this)
        var type  = $this.data('type')
        var minmax = $this.data('minmax')
        console.log(type, minmax)
        values[type][minmax] =
            parseInt($this.text()) || undefined
        console.log('new values', values)

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
        console.log(text)
    }

    $generator.on('inputeditable', '.contenteditable', scope, inputHandler)
    console.log(scope.outputs)
    var width

    $.each(['balls', 'periods', 'heights'], function (index, type) {
        var $item = $generator.data('$' + type)
        values[type] = {
            min: parseInt($item.data('$min').text()) || undefined,
            max: parseInt($item.data('$max').text()) || undefined
        }
        generateText[type](text, values[type], scope.outputs[type])
        if (!error && text.error) {
            scope.message.$error.text(text.error)
        }
    })
    console.log('values', values)

    scope.keyboard.$widget.on('click', function (event) {
        event.stopPropagation()
    })

    scope.keyboard.$left.on('click', scope.keyboard, function (event) {
        var keyboard = event.data
        var width = keyboard.$widget.width() - 100
        var pos = keyboard.shown.position + width
        pos = keyboard.shown.position = Math.min(pos, 0)
        console.log(keyboard.shown)
        keyboard.shown.$item.css('left', pos)
    })

    scope.keyboard.$right.on('click', scope.keyboard, function (event) {
        var keyboard = event.data
        var width = keyboard.$widget.width() - 100
        var pos = keyboard.shown.position - width
        pos = keyboard.shown.position = Math.max(pos, -keyboard.shown.width)
        console.log(pos)
        keyboard.shown.$item.css('left', pos)
    })

    function clickLinkHandler (event) {
        console.log('uieyirutiu')
        event.preventDefault()
        console.log('jojojo')
        console.log('hola')
        var scope = event.data
        var keyboard = scope.keyboard
        var simulator = scope.simulator
        
        var href = parseHref($(this).attr('href'), {
            fragment: '#header'
        })
        var oldQueryString = scope.href.queryString
        var newQueryString = href.queryString
        var targetTop = $(href.fragment).offset().top
        scope.$root.animate({scrollTop: targetTop}, 300, 'swing')
        if (href.fragment === "#header") {
            keyboard.$widget.addClass('hide')
            var shown = keyboard.shown
            if (shown) {
                shown.$item.removeClass('select')
            }
        } else {
            if (href.fragment === "#simulator") {
                //console.log(simulator.patterns)
                if (!simulator.patterns) {
                    createPatterns({}, scope)
                }
                //console.log(simulator.patterns)
                href.queryString.play = href.queryString.play || simulator.patterns[0]
                console.log('play', href.queryString.play)
                if (!scope.juggler) {
                    scope.juggler = new Juggler({
                        stage: {
                            container: 'juggler-simulator',
                            width:  simulator.$item.width(),
                            height: simulator.$item.height()
                        }
                    })
                }
                //console.log(scope.jugglerPlaying)
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
    scope.keyboard.patterns.$item.on('click', 'a', scope, clickLinkHandler)
    scope.keyboard.numbers.$item.on('click', '.keyboard-btn', scope.keyboard.numbers, function (event) {
        var numbers = event.data
        if (numbers.$select) {
            numbers.$select.removeClass('select')
        }
        numbers.$select = $(this)
        numbers.$select.addClass('select')
    })
    scope.keyboard.patterns.$item.on('click', '.keyboard-btn', scope.keyboard.patterns, function (event) {
        var patterns = event.data
        if (patterns.$select) {
            patterns.$select.removeClass('select')
        }
        patterns.$select = $(this)
        patterns.$select.addClass('select')
    })
    scope.keyboard.numbers.$item.on('click', 'li', $generator, function (event) {
        var num = parseInt($(this).text())
        var $generator = event.data
        var $focus     = $generator.data('$focus')
        $focus.text(num)
        triggerDelegatedEvent('inputeditable', $generator, $focus[0])
    })

    $(window).on('scroll', scope, function (event) {
        var scope = event.data
        var keyboard   = scope.keyboard
        var $generator = scope.$generator
        var simulator  = scope.simulator
        var top = $(window).scrollTop()
        var topGenerator = $generator.offset().top
        
        if (top < topGenerator - 50) {
            scope.$header.removeClass('reduce')
        } else {
            scope.$header.addClass('reduce')
        }

        
        var active = $generator.data('active')
        console.log(top, topGenerator - 50, scope.topCreate, active)
        if (active && (top < topGenerator - 50 || top >= scope.topCreate)) {
            $generator.trigger('off')
            $generator.data('active', false)
        } else if (!active && (top >= topGenerator - 50 && top < scope.topCreate)){
            $generator.trigger('on')
            $generator.data('active', true)
        }

        //console.log(top, scope.topSimulator - 50)
        if (simulator.active && top < scope.topSimulator - 50) {
            simulator.$item.trigger('off')
            simulator.active = false
        } else if (!simulator.active && top >= scope.topSimulator - 50) {
            simulator.$item.trigger('on')
            simulator.active = true
        }
    })

    scope.simulator.$item.on('off', scope.keyboard, function (event) {
        console.log('OFF simulator')
        var keyboard = event.data
        console.log('shown', keyboard.shown)
        if (keyboard.shown) {
            keyboard.shown.$item.removeClass('select')
            keyboard.shown = undefined
        }
        if (!keyboard.numbers.active) {
            keyboard.$widget.addClass('hide') 
        }
    })

    $generator.on('off', scope.keyboard, function (event) {
        console.log('OFF generator')
        var keyboard = event.data
        console.log('shown', keyboard.shown)
        if (keyboard.shown) {
            keyboard.shown.$item.removeClass('select')
            keyboard.shown = undefined
        }
        if (!keyboard.patterns.active) {
            keyboard.$widget.addClass('hide')
        }
    })

    scope.simulator.$item.on('on', scope, function (event) {
        console.log('ON simulator')
        var scope     = event.data
        var keyboard  = scope.keyboard
        var href      = scope.href
        var simulator = scope.simulator
        console.log('shown', keyboard.shown)

        if (!simulator.patterns) {
            createPatterns({}, scope)
        }
        if (!scope.jugglerPlaying) {
            href.queryString.play = href.queryString.play || simulator.patterns[0]
            console.log('play', href.queryString.play)
            if (!scope.juggler) {
                scope.juggler = new Juggler({
                    stage: {
                        container: 'juggler-simulator',
                        width:  simulator.$item.width(),
                        height: simulator.$item.height()
                    }
                })
            }
            scope.juggler.stop()
            scope.juggler.setPattern(href.queryString.play)
            scope.juggler.play()
            scope.jugglerPlaying = true
        }
        if (keyboard.shown) {
            keyboard.shown.$item.removeClass('select')
        }
        keyboard.shown = keyboard.patterns
        keyboard.shown.$item.addClass('select')
        keyboard.$widget.removeClass('hide')

        //console.log('wiiiidth??????????? ', keyboard.patterns.width)
        if (!keyboard.patterns.width) {
            keyboard.patterns.width = keyboard.patterns.$item.width() - $(window).outerWidth() + 120
            console.log('wiiiidth: ', keyboard.patterns.width)
        }
    })

    $generator.on('on', scope.keyboard, function (event) {
        console.log('ON generator')
        var keyboard = event.data
        console.log('shown', keyboard.shown)
        if (keyboard.shown) {
            keyboard.shown.$item.removeClass('select')
            keyboard.shown = undefined
        }
        if (keyboard.numbers.active) {
            keyboard.shown = keyboard.numbers
            keyboard.shown.$item.addClass('select')
            keyboard.$widget.removeClass('hide')
        }
    })
})