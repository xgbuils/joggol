var BallsOptions = Backbone.Model.extend({
    initialize: function (attr, opt) {
        Backbone.Model.prototype.initialize.call(this, attr, opt)
        this.get('min')  || this.set('min', this.get('max'))
    }
})

module.exports = BallsOptions