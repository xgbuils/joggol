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

    scope.$create = $('#create')
    scope.$generator = $('#generator')
    scope.$root = $('body, html')
    scope.keyboard = {
        $widget: $('#keyboard'),
        $left: $('#keyboard-left'),
        $keys: $('#keyboard-keys'),
        $right: $('#keyboard-right'),
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
    scope.$patterns = $('#patterns')

    scope.$simulator = $('#simulator')

    /*scope.$create.on('click', scope, function (event) {
        var scope = event.data
        event.preventDefault()

        var patterns = siteswapGenerator(values.balls, values.period, values.height)
        var html = '<ul>\n'
        for (var i = 0; i < patterns.length; ++i) {
            var textPattern = patterns[i].map(function (e) {
                return heightToLetter[e]
            }).join('')
            html += '<li><a href="#simulator' + '?pattern=' + textPattern + '">'
            html += textPattern
            html += '</a></li>\n'
        }
        html += '</ul>'

        var top = scope.$patterns.offset().top
        console.log($(window).height())
        scope.$simulator.css('height', 'auto')
        scope.$simulator.css('min-height', $(window).height())

        scope.$root.animate({scrollTop: top}, '500', 'swing', function() { 
            //alert("Finished animating");
        });

        scope.$patterns.html(html)
    })*/

    scope.$root.on('click', scope, function (event) {
        var scope = event.data
        if (scope.$focus) {
            triggerDelegatedEvent('blureditable', scope.$form, scope.$focus[0])
            scope.$focus = undefined
        }
    })

    scope.$generator.on('click', '.editable', scope, function (event) {
        event.stopPropagation()
        var scope = event.data
        if (scope.$focus) {
            triggerDelegatedEvent('blureditable', scope.$generator, scope.$focus[0])
        }
        scope.$focus = $('.contenteditable', this).first()
        triggerDelegatedEvent('focuseditable', scope.$generator, scope.$focus[0])
    })

    scope.$generator.on('click', '.contenteditable', scope, function (event) {
        event.stopPropagation()
        var scope = event.data
        if (scope.$focus) {
            triggerDelegatedEvent('blureditable', scope.$generator, scope.$focus[0])
        }
        scope.$focus = $(this)
        triggerDelegatedEvent('focuseditable', scope.$generator, this)
    })

    scope.$generator.on('focuseditable', '.contenteditable', scope, function (event) {
        var scope = event.data
        $(this).addClass('select')
        scope.keyboard.$widget.removeClass('hide')
        scope.keyboard.$keys.keyboard(range(1, 90))
    })

    scope.$generator.on('blureditable', '.contenteditable', scope, function (event) {
        var scope = event.data
        $(this).removeClass('select')
        scope.keyboard.$widget.addClass('hide')
    })

    scope.$generator.on('inputeditable', '.contenteditable', scope, function (event) {
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

    $(window).on('resize', function () {
        $('#data-height').text($(this).height())
    })

    scope.$patterns.on('click', 'a', scope, function (event) {
        var scope     = event.data
        var targetTop = scope.$simulator.offset().top
        if (!scope.juggler) {
            scope.juggler = new Juggler({
                stage: {
                    container: 'juggler-simulator',
                    width:  scope.$simulator.width(),
                    height: scope.$simulator.height()
                }
            })
        }
        scope.$root.animate({scrollTop: targetTop}, '500', 'swing', function() { 
            //alert("Finished animating");
        });
        scope.juggler.stop()
        scope.juggler.setPattern($(this).text())
        scope.juggler.play()
    })

    scope.keyboard.$widget.on('click', function (event) {
        event.stopPropagation()
    })

    scope.keyboard.$left.on('click', scope, function (event) {
        var scope = event.data
        var width = scope.keyboard.$widget.width() - 100
        console.log(width)
        var pos = scope.keyboard.position += width
        scope.keyboard.$keys.css('left', pos)
    })

    scope.keyboard.$right.on('click', scope, function (event) {
        var scope = event.data
        var width = scope.keyboard.$widget.width() - 100
        var pos = scope.keyboard.position -= width
        scope.keyboard.$keys.css('left', pos)
    })

    function clickLinkHandler (event) {
        console.log('hola')
        var scope = event.data
        event.preventDefault()
        event.stopPropagation()
        //console.log(this)
        var href = parseHref($(this).attr('href'), {
            fragment: '#header'
        })
        var queryString = href.queryString
        var targetTop = $(href.fragment).offset().top
        scope.$root.animate({scrollTop: targetTop}, '500', 'swing')
        if (href.fragment === "#header") {
            scope.$header.removeClass('reduce')
            scope.keyboard.$widget.addClass('hide')
        } else {
            scope.$header.addClass('reduce')
            if (href.fragment === "#simulator") {
                //queryString.play 
                scope.keyboard.$widget.removeClass('hide')
                //console.log('values: ', values.balls, values.period, values.height)
                var patterns = siteswapGenerator(values.balls, values.period, values.height)
                //console.log(patterns)
                textPatterns = patterns.map(function (pattern) {
                    return pattern.map(function (e) {
                        return heightToLetter[e]
                    }).join('')
                })
                scope.keyboard.$keys.keyboard(textPatterns, function (pattern) {
                    return '<a href="#simulator?play=' + pattern + '">' + pattern + '</a>'
                })

                queryString.play = queryString.play || textPatterns[0]
                console.log('play', queryString.play)

                if (!scope.juggler) {
                    scope.juggler = new Juggler({
                        stage: {
                            container: 'juggler-simulator',
                            width:  scope.$simulator.width(),
                            height: scope.$simulator.height()
                        }
                    })
                }
                scope.$root.animate({scrollTop: targetTop}, '500', 'swing')
                scope.juggler.stop()
                scope.juggler.setPattern(queryString.play)
                scope.juggler.play()
            }
        }
    }

    scope.$root.on('click', 'a', scope, clickLinkHandler)
    scope.keyboard.$keys.on('click', 'a', scope, clickLinkHandler)
    scope.keyboard.$keys.on('click', 'li', scope, function (event) {
        event.stopPropagation()
        var num = parseInt($(this).text())
        scope.$focus.text(num)
        triggerDelegatedEvent('inputeditable', scope.$generator, scope.$focus[0])
    })

    /*$('#header-btn').on('click', function () {
        $('.header').addClass('reduce')
        var targetTop = scope.$generator.offset().top
        scope.$root.animate({scrollTop: targetTop}, '500', 'swing', function() { 
            //alert("Finished animating");
        });
    })*/
})