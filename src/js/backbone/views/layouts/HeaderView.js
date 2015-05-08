var LayoutView = require('./LayoutView')

var HeaderView = Backbone.View.extend({
    initialize: function (options) {
        LayoutView.prototype.initialize.call(this, options)
        this.name = 'header'

        /*this.on('active', function () {
     
        })*/
    }
})

module.exports = HeaderView