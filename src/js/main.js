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
    
    period: function (text, period, $output) {
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

    height: function (text, height, $output) {
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
    scope.inputs = {
        balls: {
            min: $('#balls-min'),
            max: $('#balls-max')
        },
        period: {
            min: $('#period-min'),
            max: $('#period-max')
        },
        height: {
            min:  $('#height-min'),
            max:  $('#height-max')
        }
    } 

    scope.$root = $('body, html')
    scope.keyboard = {
        $widget: $('#keyboard'),
        $buttons: $('#keyboard-buttons'),
        numbers: {
            $item: $('#keyboard-numbers'),
            active: false,
            position: 0
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
        balls:  $('#p-balls'),
        period: $('#p-period'),
        height:  $('#p-height'),
    }

    scope.message = {
        $success: $('#success'),
        $error:   $('#error')
    }

    scope.$header = $('#header')
    scope.generator = {
        $item: $('#generator'),
        active: false
    }
    scope.topGenerator = scope.generator.$item.offset().top
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
        console.log('CREATE PATTERN')
        var patterns = siteswapGenerator(values.balls, values.period, values.height)
        simulator.patterns = patterns.map(function (pattern) {
            return pattern.map(function (e) {
                return heightToLetter[e]
            }).join('')
        })
        keyboard.patterns.$item.keyboard(simulator.patterns, function (pattern) {
            return '<a class="keyboard-btn" href="#simulator?play=' + pattern + '">' + pattern + '</a>'
        })
        console.log(simulator.patterns)
        if (scope.juggler) {
            scope.juggler.stop()
        }
        scope.jugglerPlaying = false
        keyboard.patterns.active = false
        console.log(simulator.patterns)
    }

    scope.$create.on('click', scope, createPatterns)

    scope.$root.on('click', scope, function (event) {
        console.log('jijiji')
        var scope = event.data
        if (scope.$focus) {
            triggerDelegatedEvent('blureditable', scope.generator.$item, scope.$focus[0])
            scope.$focus = undefined
        }
    })

    scope.generator.$item.on('click', '.editable', scope, function (event) {
        event.stopPropagation()
        var scope = event.data
        if (scope.$focus) {
            triggerDelegatedEvent('blureditable', scope.generator.$item, scope.$focus[0])
        }
        scope.$focus = $('.contenteditable', this).first()
        triggerDelegatedEvent('focuseditable', scope.generator.$item, scope.$focus[0])
    })

    scope.generator.$item.on('click', '.contenteditable', scope, function (event) {
        event.stopPropagation()
        var scope = event.data
        if (scope.$focus) {
            triggerDelegatedEvent('blureditable', scope.generator.$item, scope.$focus[0])
        }
        scope.$focus = $(this)
        triggerDelegatedEvent('focuseditable', scope.generator.$item, this)
    })

    scope.generator.$item.on('focuseditable', '.contenteditable', scope.keyboard, function (event) {
        var keyboard = event.data
        var shown   = keyboard.shown
        console.log('shown', shown)
        var numbers  = keyboard.numbers
        $(this).addClass('select')
        numbers.$item.keyboard(range(1, 90), function (number) {
            return '<span class="keyboard-btn">' + number + '</span>'
        })
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

    scope.generator.$item.on('blureditable', '.contenteditable', scope.keyboard, function (event) {
        console.log('blureditable')
        var keyboard = event.data
        var numbers  = keyboard.numbers
        var shown   = keyboard.shown
        $(this).removeClass('select')
        if (shown) {
            keyboard.$widget.addClass('hide')
            numbers.$item.removeClass('select')
            numbers.$item = shown.$item
            keyboard.shown = undefined
        }
        numbers.active = false
    })

    scope.generator.$item.on('inputeditable', '.contenteditable', scope, function (event) {
        console.log('dsadsa')
        var scope = event.data
        var key = $(this).data('type')
        values[key] = {
            min: parseInt(scope.inputs[key].min.text()) || undefined,
            max: parseInt(scope.inputs[key].max.text()) || undefined
        }
        generateText[key](text, values[key], scope.outputs[key])

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
    })
    
    for (var key in scope.outputs) {
        values[key] = {
            min: parseInt(scope.inputs[key].min.text()) || undefined,
            max: parseInt(scope.inputs[key].max.text()) || undefined
        }
        generateText[key](text, values[key], scope.outputs[key])

        if (!error && text.error) {
            scope.message.$error.text(text.error)
        }
    }

    scope.keyboard.$widget.on('click', function (event) {
        event.stopPropagation()
    })

    scope.keyboard.$left.on('click', scope.keyboard, function (event) {
        var keyboard = event.data
        var width = keyboard.$widget.width() - 100
        var pos = keyboard.shown.position += width
        console.log(keyboard.shown)
        keyboard.shown.$item.css('left', pos)
    })

    scope.keyboard.$right.on('click', scope.keyboard, function (event) {
        var keyboard = event.data
        var width = keyboard.$widget.width() - 100
        var pos = keyboard.shown.position -= width
        keyboard.shown.$item.css('left', pos)
    })

    function clickLinkHandler (event) {
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
                console.log(simulator.patterns)
                if (!simulator.patterns) {
                    createPatterns({}, scope)
                }
                console.log(simulator.patterns)
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
                console.log(scope.jugglerPlaying)
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
        console.log('CLICK NUMBER')

        var numbers = event.data
        if (numbers.$select) {
            numbers.$select.removeClass('select')
        }
        numbers.$select = $(this)
        /*var diff = 0.5 * window.innerWidth - numbers.$select.offset().left - 0.5 * numbers.$select.width() - 11
        numbers.position += diff
        numbers.$item.css('left', numbers.position)*/
        numbers.$select.addClass('select')
        //console.log(numbers.$select[0])
    })
    scope.keyboard.patterns.$item.on('click', '.keyboard-btn', scope.keyboard.patterns, function (event) {
        var patterns = event.data
        if (patterns.$select) {
            patterns.$select.removeClass('select')
        }
        patterns.$select = $(this)
        //console.log(patterns.position, $(window).outerWidth(true), window.innerWidth, patterns.$select.offset().left, patterns.$select.height())
        /*var diff = 0.5 * window.innerWidth - patterns.$select.offset().left - 0.5 * patterns.$select.width() - 11
        patterns.position += diff
        patterns.$item.css('left', patterns.position)*/
        patterns.$select.addClass('select')
    })
    scope.keyboard.numbers.$item.on('click', 'li', scope, function (event) {
        var num = parseInt($(this).text())
        scope.$focus.text(num)
        triggerDelegatedEvent('inputeditable', scope.generator.$item, scope.$focus[0])
    })

    $(window).on('scroll', scope, function (event) {
        var scope = event.data
        var keyboard  = scope.keyboard
        var generator = scope.generator
        var simulator = scope.simulator
        var top = $(window).scrollTop()
        
        if (top < scope.topGenerator - 50) {
            scope.$header.removeClass('reduce')
        } else {
            scope.$header.addClass('reduce')
        }

        console.log(scope.topCreate, top)
        //console.log(top >= scope.topGenerator - 50 && top < scope.topSimulator - 400)
        if (generator.active && (top < scope.topGenerator - 50 || top >= scope.topCreate)) {
            generator.$item.trigger('off')
            generator.active = false
        } else if (!generator.active && (top >= scope.topGenerator - 50 && top < scope.topCreate)){
            generator.$item.trigger('on')
            generator.active = true
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

    scope.generator.$item.on('off', scope.keyboard, function (event) {
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
    })

    scope.generator.$item.on('on', scope.keyboard, function (event) {
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