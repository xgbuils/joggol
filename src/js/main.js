var siteswapGenerator = require('siteswap-generator')
var scrollTo = require('./scrollTo.js')
var Juggler = require('./Juggler/juggler.js')

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
    values: {}
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

    scope.$form   = $('#form')
    scope.$create = $('#create')
    scope.$root = $('body, html')

    scope.outputs = {
        balls:  $('#p-balls'),
        period: $('#p-period'),
        height:  $('#p-height'),
    }

    scope.message = {
        $success: $('#success'),
        $error:   $('#error')
    }

    scope.$patterns = $('#patterns')

    scope.$simulator = $('#simulator')

    scope.$create.on('click', scope, function (event) {
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
    })

    scope.$form.on('click', '.editable', scope, function (event) {
        var scope = event.data
        $('.contenteditable', this).first().focus()
    })

    scope.$form.on('click', '.contenteditable', function (event) {
        event.stopPropagation()
        event.preventDefault()
    })

    scope.$form.on('focus', '.contenteditable', function (event) {
        event.preventDefault()
        var $this = $(this)
        console.log($this[0])
        $this.select()
    })

    scope.$form.on('input', 'span[contenteditable]', scope, function (event) {
        var scope = event.data
        var key = $(this).data('type')
        values[key] = {
            min: parseInt(scope.inputs[key].min.text()) || undefined,
            max: parseInt(scope.inputs[key].max.text()) || undefined
        }
        generateText[key](text, values[key], scope.outputs[key])
        //console.log('error:', error)
        //console.log('text.error:', text.error)
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
        /*div_patterns.style.height = '0px'
        div_patterns.style.minHeight = '0px'*/
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
})