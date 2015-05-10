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

        this.on('create-model', function (model) {
            //console.log('KeyboardView')
            this.model  = model
            var options = model.toJSON()
            this.lazyListOptions = options
            this.create()
        })

        options.start || (options.start = 0)

        this.position  = 0
        this.transform           = options.transform || function (e) {return e} 
        
        this.lazyListConstructor = options.lazyListConstructor || function () {
            return new LazyArray({
                get: function (index) {
                    return index + options.start
                },
                maxLength: 100
            })
        }

         // necessari?
        
        view.on('active', function () {
            view.parent.trigger('keyboard-active', view)
            //console.log(view.$el[0].id, 'ACTIVE')
            view.$el.addClass('js-select')
        })

        view.on('inactive', function () {
            //console.log(view.$el[0].id, 'INACTIVE')
            view.$el.removeClass('js-select')
        })

        this.on('left', function () {
            this.left(0.6 * this.width)
        })

        this.on('right', function () {
            this.right(0.6 * this.width)
        })

        this.on('click-key', function ($key) {
            var num  = parseInt($key.text())
            this.center($key)

            if (this.fieldsetView) {
                var type = this.fieldsetView.focusField.type
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
        var keys_list = this.keys_list.slice(begin, this.index)
        //console.log(keys_list)
        $.fn.append.apply(this.$el, keys_list
            .map(function (key) {
                //console.log(key)
                return '<li><span class="numbers keyboard-btn number-' + transform(key) + '">' + transform(key) + '</span></li>'
            })
        )
    },
    create: function () {
        this.index = 0
        this.maxWidth = Infinity
        //console.log('lazyOptions', this.lazyListOptions)
        this.keys_list = this.lazyListConstructor(this.lazyListOptions)
        //console.log(this.keys_list)
        this.$el.empty()
        //console.log('append!!')
        this.append()
    }
})

module.exports = KeyboardView