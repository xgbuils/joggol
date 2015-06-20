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
    }
})

module.exports = AppModel