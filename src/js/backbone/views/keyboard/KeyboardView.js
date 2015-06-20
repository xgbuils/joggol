var View = require('frontpiece.view')
var LazyArray = require('lazyarray-lite')

var KeyboardView = View.extend({
    initialize: function (options) {
        var view = this
        this.name = options.name
        this.$el  = $(options.el)
        this.el   = this.$el[0]
        if (options.fieldsetView) {
            this.fieldsetView = options.fieldsetView
            this.fieldsetView.keyboardView = this
        }

        var model = this.model = options.model
        var keyboardModel = this.keyboardModel = options.keyboardModel
        var appModel      = this.appModel      = options.appModel
        this.lazyListOptions = this.model.get()

        options.start || (options.start = 1)

        this.position  = 0
        this.transform = options.transform || function (e) {return e} 
        
        this.lazyListConstructor = options.lazyListConstructor || function () {
            return new LazyArray({
                get: function (index) {
                    return index + options.start
                },
            })
        }

        this.create()

        if (keyboardModel) {
            keyboardModel.on('change:field', function (previous) {
                console.log('change:field')
                var current = this.get('field')
                if (previous !== current) {
                    var key = model.get(current)
                    console.log('.number-' + key)
                    var $key = $('.number-' + key, view.$el)
                    view.center($key)
                }
            })

            keyboardModel.on('change:field', function () {
                var field = this.get('field')
                var num = model.get(field)
            })

            keyboardModel.on('change:field', function () {
                var field = this.get('field')
                var key = model.get(field)
                view.trigger('click-key', $('.number-' + key, view.$el))
            })
        }

        appModel.on('keyboard-' + this.name + ':active', function () {
            view.$el.addClass('js-select')
        })
        appModel.on('keyboard-' + this.name + ':inactive', function () {
            view.$el.removeClass('js-select')
        })

        this.on('left', function () {
            this.left(0.6 * this.width)
        })

        this.on('right', function () {
            this.right(0.6 * this.width)
        })

        this.on('click-key', function ($key) {
            var $lastKey = $('.js-select', this.$el)
            var num  = parseInt($key.text())
            if ($lastKey[0]) {
                $lastKey.removeClass('js-select')
            }
            $key.addClass('js-select')
            this.center($key)
            if (this.name !== 'patterns') {
                var type = keyboardModel.get('field')
                this.model.set(type, num)
            }
        })

        this.$el.on('click', '.keyboard-btn', function () {
            view.trigger('click-key', $(this))
        })


    },
    left: function (incr) {
        var listWidth = this.$el.outerWidth()

        this.position -= incr
        if (this.position < 0) {
            this.position = 0
        }
        this.$el.css('left', -this.position)
    },
    right: function (incr) {
        var listWidth = this.$el.outerWidth()

        if (this.maxWidth === Infinity && this.index >= this.keys_list.maxLength) {
            this.maxWidth = listWidth - this.width
        }
        //var width = $context.data('width')
        this.position += incr
        if (this.position > this.maxWidth) {
            this.position = this.maxWidth
        }
        this.$el.css('left', -this.position)
        if (this.position + 2 * this.width > listWidth && this.index < this.keys_list.maxLength) {
            this.append()
        }
    },
    center: function ($key) {
        console.log($key.attr('class'))
        var pos  = $key.offset().left
        console.log('left', pos)
        var incr = 0.5 * $(window).outerWidth() - pos

        if (incr < 0) {
            this.right(-incr)
        } else {
            this.left(incr)
        }
    },
    append: function () {
        var transform = this.transform
        var begin     = this.index
        this.index   += 30
        var keys_list = this.keys_list.slice(begin, this.index)
        $.fn.append.apply(this.$el, keys_list
            .map(function (key) {
                return '<li><span class="numbers keyboard-btn number-' + transform(key) + '">' + transform(key) + '</span></li>'
            })
        )
    },
    create: function () {
        this.index = 0
        this.maxWidth = Infinity
        this.keys_list = this.lazyListConstructor(this.lazyListOptions)
        this.$el.empty()
        this.append()
    }
})

module.exports = KeyboardView