var FieldView = Backbone.View.extend({
    initialize: function (options) {
    	var view = this
        view.$el = $(options.el)
        view.el  = view.$el[0]

        this.computeStyles()

        view.$el.on('click', function (event) {
            //console.log('click', window.blablabla && window.blablabla.focusField.el)
            //console.log(view.parent.focusField)
        	event.preventDefault()
            event.stopPropagation()
            //console.log('ufff', window.blablabla && window.blablabla.focusField.el)
            //console.log('click')
        	view.parent.trigger('click-field', view)
            //console.log('aaaaaa', window.blablabla && window.blablabla.focusField.el)
        })

        view.on('focus', function (keyboardView) {
            console.log(view.el.id + '(' + view.cid + ') focus')
            var $el = this.$el
            $el.addClass('js-select')
        	var key = $el.text()

            var $key = $('.number-' + key, keyboardView.$el)
            keyboardView.center($key)
        })

        view.on('blur', function () {
            console.log(view.el.id + ' blur')
            this.$el.removeClass('js-select')
            // view.parent.trigger('focus', view, key)
        })
    },
    computeStyles: function () {
        this.width = this.$el.width()
        this.$el.width(this.width)
        this.minWidth = '40px'
    }
})

module.exports = FieldView