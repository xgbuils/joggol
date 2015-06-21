var Model = require('frontpiece.model')

var AppModel = Model.extend({
    initialize: function (options) {
        this.on('change:keyboard', function (previous) {
            var current = this.get('keyboard')
            if (previous) {
                this.trigger('keyboard-' + previous + ':inactive')
            }
            if (current) {
                this.trigger('keyboard-' + current  + ':active' )
            }
            if        (!previous && current) {
            	this.trigger('keyboard:active')
            } else if (previous && !current) {
            	this.trigger('keyboard:inactive')
            }
        })
        this.on('change:focus', function (previous) {
            current = this.get('focus')
            if (previous !== current) {
                if (previous) {
                    this.trigger('blur:' + previous)
                }
                if (current) {
                    this.trigger('focus:' + current)
                }
            }
            var p = previous ? previous.split('.') : []
            var c = current  ? current.split('.')  : []
            var previousFieldset = p[0]
            var currentFieldset  = c[0]
            var currentField     = c[1]
            if (previousFieldset !== currentFieldset) {
                if (previousFieldset) {
                    this.trigger('blur:' + previousFieldset)
                }
                if (currentFieldset) {
                    this.trigger('focus:' + currentFieldset)
                }
            }
            if (previous !== current && currentFieldset) {
                this.trigger('click:' + currentFieldset, currentField)
            }
        })
    }
})

module.exports = AppModel