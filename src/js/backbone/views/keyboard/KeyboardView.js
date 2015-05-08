var LazyArray = require('lazyarray-lite')

var KeyboardView = Backbone.View.extend({
    initialize: function (options) {
        var view = this
        this.$el = $(options.el)
        this.el  = this.$el[0]
        if (options.fieldsetView) {
            this.fieldsetView = options.fieldsetView
            this.fieldsetView.keyboardView = this
        }
        if (options.model) {
            this.model = options.model
        }

        options.start || (options.start = 0)
        this.index = 0

        this.position  = 0
        this.maxWidth  = Infinity
        this.transform           = options.transform || function (e) {return e} 
        this.lazyListOptions     = options.lazyListOptions
        this.lazyListConstructor = options.lazyListConstructor || function () {
            return new LazyArray({
                get: function (index) {
                    return index + options.start
                },
                maxLength: 100
            })
        }
        this.keys_list = this.lazyListConstructor(this.lazyListOptions)

        this.append()
        
        view.on('active', function () {
            view.parent.trigger('keyboard-active', view)
            view.$el.addClass('js-select')
        })

        view.on('inactive', function () {
            view.$el.removeClass('js-select')
        })

        this.on('left', function () {
            this.left(0.6 * this.width)
        })

        this.on('right', function () {
            this.right(0.6 * this.width)
        })

        this.$el.on('click', '.keyboard-btn', function () {
            var num  = parseInt($(this).text())
            view.center($(this))

            var type = view.fieldsetView.focusField.type
            view.model.set(type, num)
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
        var pos  = $key.offset().left
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
        $.fn.append.apply(this.$el, this.keys_list
            .slice(begin, this.index)
            .map(function (key) {
                return '<li><span class="numbers keyboard-btn number-' + transform(key) + '">' + transform(key) + '</span></li>'
            })
        )
    }
})

module.exports = KeyboardView